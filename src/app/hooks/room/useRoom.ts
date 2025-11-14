import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { joinRoomThunk } from '../../../features/room/roomThunks';
import { leaveRoom, setSocketConnected, updateRoomProblem, updateUserPermissions, addParticipant, removeParticipant } from '../../../features/room/roomSlice';
import { roomSocketService } from '../../../services/roomSocketService';
import type { ProblemData, RunCodeResponse, SampleTestCase, SubmissionResponse } from '../../../types/problem';
import type { Room } from '../../../types/room';
import { getLanguageId, languageMap } from '../../../utils/problem-related';
import { runCodeApi } from '../../../services/axios/auth/problem';
import { roomService } from '../../../services/axios/user/room';

type RoomTab = 'problem' | 'video' | 'whiteboard' | 'chat';
type BottomTab = 'testcase' | 'result';

export const useRoom = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();

    const { currentRoom, isJoining, error } = useAppSelector(state => state.room);
    const { user } = useAppSelector(state => state.user);

    const passwordFromState = location.state?.password;

    const editorRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const rightPaneRef = useRef<HTMLDivElement>(null);
    const selfViewVideoRef = useRef<HTMLVideoElement>(null);
    const hasLeftRoomRef = useRef(false);
    const currentRoomRef = useRef<Room | null>(null);

    const [activeTab, setActiveTab] = useState<RoomTab>('video');
    const [showCreatorControls, setShowCreatorControls] = useState(false);
    const [isVideoMinimized, setIsVideoMinimized] = useState(false);
    const [bottomActiveTab, setBottomActiveTab] = useState<BottomTab>('testcase');
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [code, setCode] = useState('');
    const [problemData, setProblemData] = useState<ProblemData | null>(null);
    const [sampleTestCases, setSampleTestCases] = useState<SampleTestCase[]>([]);
    const [runCodeResults, setRunCodeResults] = useState<RunCodeResponse | null>(null);
    const [submissionResults, setSubmissionResults] = useState<SubmissionResponse | null>(null);
    const [activeTestCase, setActiveTestCase] = useState(1);
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmissionResultVisible, setIsSubmissionResultVisible] = useState(false);
    const [languages, setLanguages] = useState<{ value: string; label: string }[]>([]);
    const [selfViewStream, setSelfViewStream] = useState<MediaStream | null>(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [selfViewPos, setSelfViewPos] = useState<{ x: number; y: number }>(() => {
        try {
            const saved = localStorage.getItem('room_self_view_pos');
            if (saved) return JSON.parse(saved);
        } catch {}
        return { x: 16, y: typeof window !== 'undefined' ? window.innerHeight - 16 - 135 : 400 };
    });
    const selfViewDidDragRef = useRef(false);
    const [editorHeightPct, setEditorHeightPct] = useState<number>(60);
    const [isResizingHorizontal, setIsResizingHorizontal] = useState(false);
    const [leftPaneWidthPct, setLeftPaneWidthPct] = useState<number>(() => {
        if (typeof window === 'undefined') {
            return 50;
        }
        try {
            const saved = window.localStorage.getItem('room_leftPaneWidth');
            if (saved) {
                const parsed = parseFloat(saved);
                if (!Number.isNaN(parsed)) {
                    return Math.min(Math.max(parsed, 37.5), 80);
                }
            }
        } catch {}
        return 50;
    });
    const [isResizingVertical, setIsResizingVertical] = useState(false);
    const [isDesktop, setIsDesktop] = useState(() => {
        if (typeof window === 'undefined') {
            return false;
        }
        return window.innerWidth >= 768;
    });

    useEffect(() => {
        try {
            window.localStorage.setItem('room_leftPaneWidth', leftPaneWidthPct.toString());
        } catch {}
    }, [leftPaneWidthPct]);

    const handleHorizontalMouseDown = useCallback(() => {
        setIsResizingHorizontal(true);
    }, []);

    const handleVerticalMouseDown = useCallback(() => {
        if (!isDesktop) {
            return;
        }
        setIsResizingVertical(true);
    }, [isDesktop]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isResizingVertical && containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const newPct = ((e.clientX - rect.left) / rect.width) * 100;
                const clamped = Math.min(Math.max(newPct, 37.5), 80);
                setLeftPaneWidthPct(prev => (prev === clamped ? prev : clamped));
            }
            if (isResizingHorizontal && rightPaneRef.current) {
                const rect = rightPaneRef.current.getBoundingClientRect();
                const relativeY = e.clientY - rect.top;
                const newPct = (relativeY / rect.height) * 100;
                if (newPct >= 20 && newPct <= 80) {
                    setEditorHeightPct(newPct);
                }
            }
        };
        const handleMouseUp = () => {
            setIsResizingVertical(false);
            setIsResizingHorizontal(false);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
        if (isResizingVertical || isResizingHorizontal) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = isResizingVertical ? 'col-resize' : 'row-resize';
            document.body.style.userSelect = 'none';
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            };
        }
    }, [isResizingVertical, isResizingHorizontal]);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 768) {
                setIsVideoMinimized(true);
            }
            setIsDesktop(width >= 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const ensureStream = async () => {
            if (isCameraOn) {
                if (!selfViewStream) {
                    try {
                        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                        setSelfViewStream(stream);
                        if (selfViewVideoRef.current) {
                            selfViewVideoRef.current.srcObject = stream as any;
                            await selfViewVideoRef.current.play().catch(() => {});
                        }
                    } catch {}
                }
            } else {
                if (selfViewStream) {
                    selfViewStream.getTracks().forEach(track => track.stop());
                    setSelfViewStream(null);
                }
            }
        };
        void ensureStream();
    }, [isCameraOn, selfViewStream]);

    useEffect(() => {
        if (selfViewVideoRef.current && selfViewStream) {
            try {
                selfViewVideoRef.current.srcObject = selfViewStream as any;
                const p = selfViewVideoRef.current.play();
                if (p && typeof p.then === 'function') p.catch(() => {});
            } catch {}
        }
    }, [selfViewStream, activeTab]);

    useEffect(() => {
        if (editorRef.current && currentRoom) {
            const canEdit = currentRoom.userPermissions?.canEditCode || false;
            editorRef.current.updateOptions({
                readOnly: !canEdit,
                domReadOnly: !canEdit
            });
        }
    }, [currentRoom?.userPermissions?.canEditCode]);

    const onSelfViewPointerDown = (e: React.PointerEvent) => {
        selfViewDidDragRef.current = false;
        const startX = e.clientX;
        const startY = e.clientY;
        const init = { ...selfViewPos };
        let lastPosition = init;
        const onMove = (ev: PointerEvent) => {
            const nx = init.x + (ev.clientX - startX);
            const ny = init.y + (ev.clientY - startY);
            lastPosition = { x: nx, y: ny };
            setSelfViewPos(lastPosition);
            if (Math.abs(ev.clientX - startX) > 3 || Math.abs(ev.clientY - startY) > 3) {
                selfViewDidDragRef.current = true;
            }
        };
        const onUp = () => {
            try {
                localStorage.setItem('room_self_view_pos', JSON.stringify(lastPosition));
            } catch {}
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
            if (!selfViewDidDragRef.current) {
                setActiveTab('video');
            }
        };
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
    };

    const handleJoinRoom = useCallback(async () => {
        try {
            let password: string | undefined;
            if (passwordFromState) {
                password = passwordFromState;
            }
            const response = await dispatch(joinRoomThunk({ roomId: roomId!, password })).unwrap();
            const room = response.data;
            const roomProblem = room.problem ?? null;
            if (room) {
                setProblemData(roomProblem);
                setSampleTestCases(room.sampleTestCases || []);
                const supported = Array.isArray(roomProblem?.supportedLanguages)
                    ? roomProblem.supportedLanguages
                    : [];
                const availLanguages = supported
                    .map((id: string | number) => languageMap[+id])
                    .filter((l: any): l is { value: string; label: string } => l !== undefined);
                setLanguages(availLanguages);
                if (availLanguages.length > 0 && roomProblem?.templates) {
                    const firstLang = availLanguages[0].value;
                    setSelectedLanguage(firstLang);
                    const langId = getLanguageId(firstLang);
                    if (langId) {
                        const template = roomProblem.templates[langId.toString()];
                        if (template) {
                            setCode(template.userFunctionSignature);
                        }
                    }
                }
            }
        } catch (error: any) {
            const rawMessage = typeof error === 'string'
                ? error
                : typeof error?.message === 'string'
                    ? error.message
                    : typeof error?.data?.message === 'string'
                        ? error.data.message
                        : '';
            const message = rawMessage.toLowerCase();
            if (message.includes('password') || message.includes('private')) {
                const retryPassword = prompt('Invalid password. Please try again:');
                if (retryPassword) {
                    try {
                        await dispatch(joinRoomThunk({ roomId: roomId!, password: retryPassword })).unwrap();
                    } catch {
                        navigate('/');
                    }
                } else {
                    navigate('/');
                }
            } else {
                navigate('/');
            }
        }
    }, [dispatch, navigate, passwordFromState, roomId]);

    const handleLeaveRoom = useCallback(() => {
        if (hasLeftRoomRef.current) {
            return;
        }
        hasLeftRoomRef.current = true;
        if ((window as any).leaveJitsiCall) {
            (window as any).leaveJitsiCall();
        }
        roomSocketService.disconnect();
        dispatch(leaveRoom());
        navigate('/');
    }, [dispatch, navigate]);

    const handleProblemChanged = useCallback((data: any) => {
        
        dispatch(updateRoomProblem({
            problem: data.problem,
            code: data.code,
            language: data.language
        }));
        setCode(data.code);
        setSelectedLanguage(data.language);
        setSampleTestCases(data.problem.sampleTestCases);
        setProblemData(data.problem);
        if (data.changedBy !== user?.id) {
            console.log(`Problem changed by user ${data.changedBy}`);
        }
    }, [dispatch, user?.id]);

    const handleCodeChanged = useCallback((data: any) => {
        if (data.changedBy !== user?.id) {
            console.log('this is that data  ', data);
            setCode(data.code);
            setSelectedLanguage(data.language);
        }
    }, [user?.id]);

    const handlePermissionsUpdated = useCallback((data: any) => {
        dispatch(updateUserPermissions({
            userId: data.targetUserId,
            permissions: data.permissions,
            targetUserId: user?.id
        }));
        if (data.targetUserId === user?.id && editorRef.current) {
            const canEdit = data.permissions.canEditCode || false;
            editorRef.current.updateOptions({
                readOnly: !canEdit,
                domReadOnly: !canEdit
            });
        }
    }, [dispatch, user?.id]);

    const handleUserJoined = useCallback((data: any) => {
        dispatch(addParticipant({
            userId: data.userId,
            username: data.userName,
            fullName: data?.fullName,
            email: data?.email,
            profilePicKey: data?.profilePicKey
        }));
    }, [dispatch]);

    const handleUserLeft = useCallback((data: any) => {
        dispatch(removeParticipant(data.userId));
    }, [dispatch]);

    const handleUserKicked = useCallback((data: any) => {
        dispatch(removeParticipant(data.targetUserId));
        console.log(`User ${data.targetUserId} was kicked by ${data.kickedBy}`);
    }, [dispatch]);

    const handleKicked = useCallback(() => {
        handleLeaveRoom();
    }, [handleLeaveRoom]);

    const handleSocketError = useCallback((data: any) => {
        console.error('Socket error:', data.message);
    }, []);

    useEffect(() => {
        hasLeftRoomRef.current = false;
    }, [roomId]);

    const isCreator = currentRoom?.createdBy === user?.id;

    useEffect(() => {
        currentRoomRef.current = currentRoom ?? null;
    }, [currentRoom]);

    const handleLanguageChange = (language: string) => {
        if (!currentRoom?.userPermissions?.canEditCode) return;
        if (!isCreator) return;
        setSelectedLanguage(language);
        const langId = getLanguageId(language);
        if (!langId) return;
        const template = currentRoom?.problem?.templates?.[langId.toString()];
        if (template?.userFunctionSignature) {
            const newCode = template.userFunctionSignature;
            setCode(newCode);
            if (currentRoom?.problemNumber) {
                roomSocketService.updateCode(newCode, language, currentRoom.problemNumber);
            }
            return;
        }
        if (currentRoom?.problemNumber) {
            roomSocketService.updateCode(code, language, currentRoom.problemNumber);
        }
    };

    const handleEditorDidMount = (editor: any) => {
        editorRef.current = editor;
        const canEdit = currentRoom?.userPermissions?.canEditCode || false;
        editor.updateOptions({
            readOnly: !canEdit,
            domReadOnly: !canEdit
        });
        if (canEdit) {
            editor.focus();
        }
    };

    const resetCode = () => {
        const template = currentRoom?.problem?.templates?.[selectedLanguage];
        if (template?.userFunctionSignature) {
            setCode(template.userFunctionSignature);
        }
    };

    const runCode = async () => {
        if (!problemData) return;
        setIsRunning(true);
        setBottomActiveTab('result');
        setRunCodeResults(null);
        try {
            const testCaseIds = sampleTestCases.map(tc => tc.id);
            const langId = getLanguageId(selectedLanguage);
            if (!langId) {
                setIsRunning(false);
                return;
            }
            const results = await runCodeApi(problemData.id, code, langId, testCaseIds);
            setRunCodeResults(results);
            toast.success(`${results.passedTestCases}/${results.totalTestCases} test cases passed`);
        } catch {}
        setIsRunning(false);
    };

    const submitCode = async () => {
        if (!roomId) return;
        if (!problemData) return;
        const langId = getLanguageId(selectedLanguage);
        if (!langId) {
            toast.error('Select a language before submitting');
            return;
        }
        setIsSubmitting(true);
        setBottomActiveTab('result');
        setRunCodeResults(null);
        try {
            const result = await roomService.submitCode({
                roomId,
                problemId: problemData.id,
                sourceCode: code,
                languageId: langId
            });
            setSubmissionResults(result);
            setIsSubmissionResultVisible(true);
        } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || 'Submission failed';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeSubmissionResultView = () => {
        setIsSubmissionResultVisible(false);
    };

    useEffect(() => {
        if (!roomId) return;
        if (isJoining) return;
        if (currentRoom) return;
        void handleJoinRoom();
    }, [roomId, currentRoom, isJoining, handleJoinRoom]);

    useEffect(() => {
        return () => {
            if (currentRoomRef.current && !hasLeftRoomRef.current) {
                handleLeaveRoom();
            }
        };
    }, [handleLeaveRoom]);

    useEffect(() => {
        if (!currentRoom?.socketToken) return;
        if (roomSocketService.isConnected()) return;
        const connect = async () => {
            try {
                await roomSocketService.connect(currentRoom.socketToken, {
                    'problem-changed': handleProblemChanged,
                    'code-changed': handleCodeChanged,
                    'permissions-updated': handlePermissionsUpdated,
                    'user-joined': handleUserJoined,
                    'user-left': handleUserLeft,
                    'user-kicked': handleUserKicked,
                    'kicked': handleKicked,
                    'error': handleSocketError,
                    'test-response': (data: any) => {
                        console.log('✅ Test response received:', data);
                    },
                    'message-received': (message: any) => {
                        console.log('✅ Chat message received:', message);
                    },
                    'user-typing': (data: any) => {
                        console.log('👀 User typing:', data);
                    }
                });
                dispatch(setSocketConnected(true));
            } catch (error) {
                console.error('Failed to connect to room socket:', error);
                dispatch(setSocketConnected(false));
            }
        };
        void connect();
    }, [currentRoom?.socketToken, dispatch, handleProblemChanged, handleCodeChanged, handlePermissionsUpdated, handleUserJoined, handleUserLeft, handleUserKicked, handleKicked, handleSocketError]);

    const getTestCaseStatus = (_testCaseId: string) => {
        return 'neutral' as 'passed' | 'failed' | 'neutral';
    };

    return {
        roomId,
        currentRoom,
        isJoining,
        error,
        user,
        isCreator,
        activeTab,
        setActiveTab,
        showCreatorControls,
        setShowCreatorControls,
        isVideoMinimized,
        setIsVideoMinimized,
        bottomActiveTab,
        setBottomActiveTab,
        selectedLanguage,
        languages,
        code,
        setCode,
        problemData,
        sampleTestCases,
        runCodeResults,
        submissionResults,
        isSubmissionResultVisible,
        activeTestCase,
        setActiveTestCase,
        isRunning,
        isSubmitting,
        rightPaneRef,
        containerRef,
        editorHeightPct,
        handleHorizontalMouseDown,
        handleVerticalMouseDown,
        leftPaneWidthPct,
        isDesktop,
        isResizingVertical,
        isResizingHorizontal,
        handleLanguageChange,
        resetCode,
        handleEditorDidMount,
        runCode,
        submitCode,
        getTestCaseStatus,
        handleLeaveRoom,
        selfViewVideoRef,
        selfViewPos,
        onSelfViewPointerDown,
        isCameraOn,
        setIsCameraOn,
        closeSubmissionResultView
    };
};

export type UseRoomReturn = ReturnType<typeof useRoom>;
