




import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate ,useLocation} from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../../components/user/Navbar';
import RoomTabNavigation from '../../components/user/room/RoomTabNavigation';
import RoomCreatorControls from '../../components/user/room/RoomCreatorControls';
import ProblemDescriptionTab from '../../components/user/room/ProblemDescriptionTab';
import VideoCallTab from '../../components/user/room/VideoCallTab';
import WhiteboardTab from '../../components/user/room/WhiteboardTab';
import EditorControls from '../../components/user/problem-solving/EditorControls';
import CodeEditorSection from '../../components/user/room/CodeEditorSection';
import BottomPanel from '../../components/user/problem-solving/BottomPanel';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorDisplay from '../../components/common/ErrorDisplay';

import { joinRoomThunk } from '../../features/room/roomThunks';
import { leaveRoom, setSocketConnected, updateRoomProblem, updateUserPermissions, addParticipant, removeParticipant } from '../../features/room/roomSlice';
import { roomSocketService } from '../../services/roomSocketService';
import type { RootState } from '../../app/store';
import { useAppDispatch } from '../../app/hooks';
import ChatComponent from '../../components/user/room/ChatComponent';
import type { ProblemData, RunCodeResponse, SampleTestCase, SubmissionResponse } from '../../types/problem';
import { getLanguageId, languageMap } from '../../utils/problem-related';
import { toast } from 'react-toastify';
import { runCodeApi } from '../../services/axios/auth/problem';

type RoomTab = 'problem' | 'video' | 'whiteboard' | 'chat';
type BottomTab = 'testcase' | 'result';

const RoomPage: React.FC = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const navigate = useNavigate();
    const location = useLocation();


    const { currentRoom, isJoining, error } = useSelector((state: RootState) => state.room);
    const { user } = useSelector((state: RootState) => state.user);
    const passwordFromState = location.state?.password;
    const editorRef = useRef<any>(null);

    // UI State
    const [activeTab, setActiveTab] = useState<RoomTab>('video');
    const [showCreatorControls, setShowCreatorControls] = useState(false);
    const [isVideoMinimized, setIsVideoMinimized] = useState(false);

    // Bottom Panel State
    const [bottomActiveTab, setBottomActiveTab] = useState<BottomTab>('testcase');

    const dispatch = useAppDispatch();

    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [code, setCode] = useState('');
    const [problemData, setProblemData] = useState<ProblemData | null>(null);
    const [sampleTestCases, setSampleTestCases] = useState<SampleTestCase[]>([]);
    const [runCodeResults, setRunCodeResults] = useState<RunCodeResponse | null>(null);
    const [submissionResults, setSubmissionResults] = useState<SubmissionResponse | null>(null);
    const [activeTestCase, setActiveTestCase] = useState(1);
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [languages, setLanguages] = useState<{ value: string; label: string }[]>([]);
    const selfViewVideoRef = useRef<HTMLVideoElement>(null);
    const [selfViewStream, setSelfViewStream] = useState<MediaStream | null>(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [selfViewPos, setSelfViewPos] = useState<{ x: number; y: number }>(() => {
        try {
            const saved = localStorage.getItem('room_self_view_pos');
            if (saved) return JSON.parse(saved);
        } catch {}
        return { x: 16, y: typeof window !== 'undefined' ? (window.innerHeight - 16 - 135) : 400 };
    });
    const [isDraggingSelfView, setIsDraggingSelfView] = useState(false);
    const selfViewDidDragRef = useRef(false);

    // Right pane vertical sizing (reuse approach from ProblemSolvingPage)
    const rightPaneRef = useRef<HTMLDivElement>(null);
    const [editorHeightPct, setEditorHeightPct] = useState<number>(60);
    const [isResizingHorizontal, setIsResizingHorizontal] = useState(false);

    const handleHorizontalMouseDown = useCallback(() => {
        setIsResizingHorizontal(true);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!rightPaneRef.current || !isResizingHorizontal) return;
            const rect = rightPaneRef.current.getBoundingClientRect();
            const relativeY = e.clientY - rect.top;
            const newPct = (relativeY / rect.height) * 100;
            if (newPct >= 20 && newPct <= 80) {
                setEditorHeightPct(newPct);
            }
        };
        const handleMouseUp = () => setIsResizingHorizontal(false);
        if (isResizingHorizontal) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'row-resize';
            document.body.style.userSelect = 'none';
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            };
        }
    }, [isResizingHorizontal]);

    // Join room on component mount
    useEffect(() => {
        if (roomId && !currentRoom) {
            handleJoinRoom();
        }

        return () => {
            if (currentRoom) {
                handleLeaveRoom();
            }
        };
    }, [roomId]);

    useEffect(() => {
        if (currentRoom?.socketToken && !roomSocketService.isConnected()) {
            initializeSocket();
        }
    }, [currentRoom?.socketToken]); 

    // Handle responsive layout
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsVideoMinimized(true);
            }
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
                    } catch {
                        // Ignore
                    }
                }
            } else {
                if (selfViewStream) {
                    selfViewStream.getTracks().forEach(t => t.stop());
                    setSelfViewStream(null);
                }
            }
        };
        ensureStream();
        // no cleanup, we control stop above when flag changes
    }, [isCameraOn]);

    useEffect(() => {
        if (selfViewVideoRef.current && selfViewStream) {
            try {
                selfViewVideoRef.current.srcObject = selfViewStream as any;
                const p = selfViewVideoRef.current.play();
                if (p && typeof p.then === 'function') p.catch(() => {});
            } catch {}
        }
    }, [selfViewStream, activeTab]);

    const onSelfViewPointerDown = (e: React.PointerEvent) => {
        setIsDraggingSelfView(true);
        selfViewDidDragRef.current = false;
        const startX = e.clientX;
        const startY = e.clientY;
        const init = { ...selfViewPos };
        const onMove = (ev: PointerEvent) => {
            const nx = init.x + (ev.clientX - startX);
            const ny = init.y + (ev.clientY - startY);
            setSelfViewPos({ x: nx, y: ny });
            if (Math.abs(ev.clientX - startX) > 3 || Math.abs(ev.clientY - startY) > 3) {
                selfViewDidDragRef.current = true;
            }
        };
        const onUp = () => {
            setIsDraggingSelfView(false);
            try {
                localStorage.setItem('room_self_view_pos', JSON.stringify(selfViewPos));
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

    // Add this useEffect to handle permission changes
    useEffect(() => {
        if (editorRef.current && currentRoom) {
            const canEdit = currentRoom.userPermissions?.canEditCode || false;
            editorRef.current.updateOptions({
                readOnly: !canEdit,
                domReadOnly: !canEdit
            });
        }
    }, [currentRoom?.userPermissions?.canEditCode]);


    const handleJoinRoom = async () => {
        try {
            let password: string | undefined ;
            if(passwordFromState){
                password = passwordFromState
            }
            let data = await dispatch(joinRoomThunk({ roomId: roomId!, password })).unwrap();

            if (data.room) {
                setProblemData(data.room.problem!);
                setSampleTestCases(data.room?.sampleTestCases || []);

                const supported = data.room.problem?.supportedLanguages;
                const availLanguages = supported
                    .map(id => languageMap[id])
                    .filter((l): l is { value: string; label: string } => l !== undefined);
                setLanguages(availLanguages);

                if (availLanguages.length > 0) {
                    const firstLang = availLanguages[0].value;
                    setSelectedLanguage(firstLang);
                    const langId = getLanguageId(firstLang);
                    const template = data.room?.problem.templates[langId!.toString()];
                    if (template) {
                        setCode(template.userFunctionSignature)
                    }
                }
            }
        } catch (error: any) {
            console.error('Failed to join room:', error);
            if (error.includes('password') || error.includes('private')) {
                const retryPassword = prompt('Invalid password. Please try again:');
                if (retryPassword) {
                    try {
                        await dispatch(joinRoomThunk({ roomId: roomId!, password: retryPassword })).unwrap();
                    } catch (retryError) {
                        navigate('/rooms');
                    }
                } else {
                    navigate('/rooms');
                }
            } else {
                navigate('/rooms');
            }
        }
    };

    const handleLeaveRoom = () => {
        if ((window as any).leaveJitsiCall) {
            (window as any).leaveJitsiCall();
        }

        roomSocketService.disconnect();
        dispatch(leaveRoom());
        navigate('/');
    };



    const initializeSocket = async () => {
        if (!currentRoom?.socketToken) return;

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
                    console.log("✅ Test response received:", data);
                },
                'message-received': (message: any) => {
                    console.log('✅ Chat message received:', message);
                },
                'user-typing': (data: any) => {
                    console.log('👀 User typing:', data);
                },
            });

            dispatch(setSocketConnected(true));
        } catch (error) {
            console.error('Failed to connect to room socket:', error);
            dispatch(setSocketConnected(false));
        }
    };

    // Socket Event Handlers
    const handleProblemChanged = (data: any) => {
        dispatch(updateRoomProblem({
            problem: data.problem,
            code: data.code,
            language: data.language
        }));

        setCode(data.code);
        setSelectedLanguage(data.language);
        setSampleTestCases(data.problem.sampleTestCases)
        setProblemData(data.problem)

        if (data.changedBy !== user?.id) {
            console.log(`Problem changed by user ${data.changedBy}`);
        }
    };

    const handleCodeChanged = (data: any) => {
        if (data.changedBy !== user?.id) {
            console.log("this is that data  ", data);
            setCode(data.code);
            setSelectedLanguage(data.language);
        }
    };

    const handlePermissionsUpdated = (data: any) => {
        dispatch(updateUserPermissions({
            userId: data.targetUserId,
            permissions: data.permissions
        }));

        if (data.targetUserId === user?.id && editorRef.current) {
            const canEdit = data.permissions.canEditCode || false;
            editorRef.current.updateOptions({
                readOnly: !canEdit,
                domReadOnly: !canEdit
            });

            console.log('Your permissions were updated:', data.permissions);
        }
    };

    const handleUserJoined = (data: any) => {
        dispatch(addParticipant({
            userId: data.userId,
            username: data.username
        }));
    };

    const handleUserLeft = (data: any) => {
        dispatch(removeParticipant(data.userId));
    };

    const handleUserKicked = (data: any) => {
        dispatch(removeParticipant(data.targetUserId));
        console.log(`User ${data.targetUserId} was kicked by ${data.kickedBy}`);
    };

    const handleKicked = (data: any) => {
        alert(`You have been kicked from the room. Reason: ${data.reason || 'No reason provided'}`);
        handleLeaveRoom();
    };

    const handleSocketError = (data: any) => {
        console.error('Socket error:', data.message);
    };

    // Code Editor Handlers
    const handleLanguageChange = (language: string) => {
        if (!currentRoom?.userPermissions?.canEditCode) return;
        if (!isCreator) return;

        setSelectedLanguage(language);
        const langId = getLanguageId(language);
        const template = currentRoom.problem.templates[langId!.toString()];
        if (template) {
            setCode(template.userFunctionSignature)
        }

        if (currentRoom?.problemNumber) {
            roomSocketService.updateCode(code, language, currentRoom.problemNumber);
        }
    };

    const handleEditorDidMount = (editor: any) => {
        editorRef.current = editor;

        const canEdit = currentRoom.userPermissions?.canEditCode || false;
        editor.updateOptions({
            readOnly: !canEdit,
            domReadOnly: !canEdit
        });

        if (canEdit) {
            editor.focus();
        }
    };

    const resetCode = () => {
        if (currentRoom?.problem?.templates[selectedLanguage].userFunctionSignature) {
            setCode(currentRoom.problem.templates[selectedLanguage].userFunctionSignature);
        }
    };



    const runCode = async () => {
        if (!problemData) return;
        setIsRunning(true);
        setBottomActiveTab('result');
        setRunCodeResults(null);
        try {
            // let problemId = useAppSelector(state=>state.room.currentRoom?.problem?.id)
            const testCaseIds = sampleTestCases.map(tc => tc.id);
            const results = await runCodeApi(problemData.id, code, getLanguageId(selectedLanguage), testCaseIds);
            setRunCodeResults(results);
            toast.success(`${results.passedTestCases}/${results.totalTestCases} test cases passed`);
        } catch (err) {
            // Error already toasted in API
        } finally {
            setIsRunning(false);
        }
    };

    const submitCode = async () => {
        setIsSubmitting(true);
        try {
            console.log('Submitting code...');
            await new Promise(resolve => setTimeout(resolve, 3000));
            setSubmissionResults({ status: 'accepted', results: [] } as any);
            setBottomActiveTab('result');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getTestCaseStatus = (testCaseId: string) => {
        return 'neutral' as 'passed' | 'failed' | 'neutral';
    };

    // Loading state
    if (isJoining) {
        return (
            <div className="h-screen bg-gray-900 text-white flex items-center justify-center">
                <LoadingSpinner />
                <span className="ml-4">Joining room...</span>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="h-screen bg-gray-900 text-white flex items-center justify-center">
                <ErrorDisplay message={error} />
            </div>
        );
    }

    // Room not found
    if (!currentRoom) {
        return (
            <div className="h-screen bg-gray-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-4">Room not found</h2>
                    <p className="text-gray-400 mb-4">The room you're looking for doesn't exist or has ended.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    const isCreator = currentRoom.createdBy === user?.id;

    return (
        <div className="h-screen bg-black text-white flex flex-col">
            <Navbar />

            {/* Room Header */}
            <div className="bg-black border-b border-gray-800 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-bold">{currentRoom.name}</h1>
                    <span className="text-gray-400 text-sm">
                        {currentRoom.participants?.filter(p => p.isOnline).length || 0} participants online
                    </span>
                    {currentRoom.problem && (
                        <span className="bg-green-600 text-xs px-2 py-1 rounded">
                            Problem #{currentRoom.problem.problemNumber}: {currentRoom.problem.title}
                        </span>
                    )}
                </div>
                <div className="hidden" />
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Single Layout with CSS Responsive Behavior */}
                <div className="flex w-full md:w-1/2 bg-black border-r border-gray-700 overflow-hidden flex-col relative">
                    <RoomTabNavigation
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        hasVideo={true}
                        hasWhiteboard={true}
                        showCreatorButton={isCreator}
                        creatorControlsOpen={showCreatorControls}
                        onToggleCreatorControls={() => setShowCreatorControls(!showCreatorControls)}
                        onLeaveRoom={handleLeaveRoom}
                    />

                    {isCreator && showCreatorControls && (
                        <RoomCreatorControls
                            room={currentRoom}
                            onClose={() => setShowCreatorControls(false)}
                        />
                    )}

                    <div className="flex-1 overflow-hidden relative">
                        {/* Problem Tab */}
                        <div className={`absolute inset-0 ${activeTab === 'problem' ? 'block' : 'hidden'}`}>
                            <ProblemDescriptionTab
                                // problem={problemData}
                                canChangeProblem={currentRoom.userPermissions?.canChangeProblem || false}
                            />
                        </div>

                        {/* SINGLE VideoCallTab Instance - Only One! */}
                        <div className={`absolute inset-0 ${activeTab === 'video' ? 'block' : 'hidden'}`}>
                            <VideoCallTab
                                key={`video-call-${currentRoom.roomId}`}
                                roomId={currentRoom.roomId}
                                jitsiUrl={currentRoom.jitsiUrl}
                                participants={currentRoom.participants}
                                username={user?.userName}
                                minimized={isVideoMinimized}
                                onMinimize={() => setIsVideoMinimized(true)}
                                onExpand={() => setIsVideoMinimized(false)}
                                onClose={() => setIsVideoMinimized(false)}
                                onLocalVideoStatusChange={(on) => setIsCameraOn(on)}
                            />
                        </div>

                        {/* Whiteboard Tab */}
                        <div className={`absolute inset-0 ${activeTab === 'whiteboard' ? 'block' : 'hidden'}`}>
                            <WhiteboardTab
                                roomId={currentRoom.roomId}
                                canDraw={currentRoom.userPermissions?.canDrawWhiteboard || false}
                            />
                        </div>

                        {/* Chat Tab */}
                        <div className={`absolute inset-0 ${activeTab === 'chat' ? 'block' : 'hidden'}`}>
                            <ChatComponent roomId={currentRoom.roomId} />
                        </div>
                    </div>

                    {/* Minimized Video Overlay - Only when minimized and not on video tab */}
                    {isVideoMinimized && activeTab !== 'video' && (
                        <div className="absolute top-16 right-4 w-64 h-48 bg-black rounded-lg overflow-hidden shadow-lg z-10">
                            <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-400 text-sm">
                                Video Call Minimized
                                <button
                                    onClick={() => {
                                        setActiveTab('video');
                                        setIsVideoMinimized(false);
                                    }}
                                    className="ml-2 text-blue-400 hover:text-blue-300"
                                >
                                    Expand
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Side - Code Editor (Hidden on Mobile) */}
                <div className="hidden md:flex md:w-1/2 flex-col overflow-hidden" ref={rightPaneRef}>
                    <div className="bg-black rounded-lg overflow-hidden flex flex-col" style={{ height: `${editorHeightPct}%` }}>
                        <EditorControls
                            selectedLanguage={selectedLanguage}
                            languages={languages}
                            handleLanguageChange={handleLanguageChange}
                            resetCode={resetCode}
                        />
                        <CodeEditorSection
                            selectedLanguage={selectedLanguage}
                            code={code}
                            setCode={setCode}
                            handleEditorDidMount={handleEditorDidMount}
                            readOnly={!currentRoom.userPermissions?.canEditCode}
                            roomId={currentRoom.roomId}
                            problemNumber={currentRoom.problem?.problemNumber}
                        />
                    </div>

                    <div
                        className="relative flex items-center justify-center cursor-row-resize group"
                        style={{ height: '8px' }}
                        onMouseDown={handleHorizontalMouseDown}
                    >
                        <div className="h-1 w-12 bg-gray-600 rounded-full group-hover:bg-blue-500 transition-colors" />
                    </div>

                    <div className="bg-black rounded-lg overflow-hidden" style={{ height: `calc(${100 - editorHeightPct}% - 8px)` }}>
                        <BottomPanel
                            activeTab={bottomActiveTab}
                            setActiveTab={setBottomActiveTab}
                            activeTestCase={activeTestCase}
                            setActiveTestCase={setActiveTestCase}
                            sampleTestCases={sampleTestCases}
                            getTestCaseStatus={getTestCaseStatus}
                            isRunning={isRunning}
                            isSubmitting={isSubmitting}
                            runCode={runCode}
                            submitCode={submitCode}
                            runCodeResults={runCodeResults}
                            submissionResults={submissionResults}
                        />
                    </div>
                </div>

                {/* Mobile Code Editor (Shown Below on Mobile) */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 h-1/2 bg-black border-t border-gray-700 flex flex-col">
                    <EditorControls
                        selectedLanguage={selectedLanguage}
                        languages={languages}
                        handleLanguageChange={handleLanguageChange}
                        resetCode={resetCode}
                    />

                    <div className="flex-1 flex flex-col">
                        <div className="flex-1">
                            <CodeEditorSection
                                selectedLanguage={selectedLanguage}
                                code={code}
                                setCode={setCode}
                                handleEditorDidMount={handleEditorDidMount}
                                readOnly={!currentRoom.userPermissions?.canEditCode}
                                roomId={currentRoom.roomId}
                                problemNumber={currentRoom.problem?.problemNumber}
                            />
                        </div>

                        <BottomPanel
                            activeTab={bottomActiveTab}
                            setActiveTab={setBottomActiveTab}
                            activeTestCase={activeTestCase}
                            setActiveTestCase={setActiveTestCase}
                            sampleTestCases={sampleTestCases}
                            getTestCaseStatus={getTestCaseStatus}
                            isRunning={isRunning}
                            isSubmitting={isSubmitting}
                            runCode={runCode}
                            submitCode={submitCode}
                            runCodeResults={runCodeResults}
                            submissionResults={submissionResults}
                        />
                    </div>
                </div>
            {activeTab !== 'video' && isCameraOn && (
                <div
                    className="fixed z-40 cursor-move"
                    style={{ left: `${selfViewPos.x}px`, top: `${selfViewPos.y}px` }}
                    onPointerDown={onSelfViewPointerDown}
                >
                    <video
                        ref={selfViewVideoRef}
                        muted
                        autoPlay
                        playsInline
                        onLoadedMetadata={() => {
                            try { selfViewVideoRef.current?.play().catch(() => {}); } catch {}
                        }}
                        style={{ width: '240px', height: '135px', transform: 'scaleX(-1)' }}
                        className="rounded-xl border-2 border-green-500 shadow-xl bg-black"
                    />
                </div>
            )}
            </div>
        </div>
    );
};

export default RoomPage;
