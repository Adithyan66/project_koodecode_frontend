import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../../components/user/Navbar';
import RoomTabNavigation from '../../components/user/room/RoomTabNavigation';
import RoomCreatorControls from '../../components/user/room/RoomCreatorControls';
import ProblemDescriptionTab from '../../components/user/room/ProblemDescriptionTab';
import VideoCallTab from '../../components/user/room/VideoCallTab';
import WhiteboardTab from '../../components/user/room/WhiteboardTab';
import EditorControls from '../../components/user/room/EditorControls';
import CodeEditorSection from '../../components/user/room/CodeEditorSection';
import BottomPanel from '../../components/user/problem-solving/BottomPanel';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorDisplay from '../../components/common/ErrorDisplay';

import { joinRoomThunk } from '../../features/room/roomThunks';
import { leaveRoom, setSocketConnected, updateRoomProblem, updateUserPermissions, addParticipant, removeParticipant } from '../../features/room/roomSlice';
import { roomSocketService } from '../../services/roomSocketService';
import type { RootState } from '../../app/store';
import { useAppDispatch } from '../../app/hooks';




type RoomTab = 'problem' | 'video' | 'whiteboard';
type BottomTab = 'testcase' | 'result';




const RoomPage: React.FC = () => {


    const { roomId } = useParams<{ roomId: string }>();
    const navigate = useNavigate();
    // const dispatch = useDispatch();

    // Redux state
    const { currentRoom, isJoining, error } = useSelector((state: RootState) => state.room);
    const { user } = useSelector((state: RootState) => state.user);

    // UI State
    const [activeTab, setActiveTab] = useState<RoomTab>('problem');
    const [showCreatorControls, setShowCreatorControls] = useState(false);
    const [isVideoMinimized, setIsVideoMinimized] = useState(false);

    // Code Editor State
    const [selectedLanguage, setSelectedLanguage] = useState('javascript');
    const [code, setCode] = useState('');
    const languages = [
        { value: 'javascript', label: 'JavaScript' },
        { value: 'python', label: 'Python' },
        { value: 'java', label: 'Java' },
        { value: 'cpp', label: 'C++' },
        { value: 'go', label: 'Go' }
    ];

    // Bottom Panel State
    const [bottomActiveTab, setBottomActiveTab] = useState<BottomTab>('testcase');
    const [activeTestCase, setActiveTestCase] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [runCodeResults, setRunCodeResults] = useState(null);
    const [submissionResults, setSubmissionResults] = useState(null);

    const dispatch = useAppDispatch();




    // Join room on component mount
    useEffect(() => {
        console.log("curreeeeeeeeent ",currentRoom);
        console.log("prrrrrrrr",currentRoom?.room.problem);
        
        
        if (roomId && !currentRoom) {
            handleJoinRoom();
        }

        return () => {
            if (currentRoom) {
                handleLeaveRoom();
            }
        };
    }, [roomId, currentRoom, isJoining]);

    // Initialize Socket.IO when room is joined
    useEffect(() => {
        if (currentRoom?.socketToken) {
            initializeSocket();
        }
    }, [currentRoom]);

    // Handle responsive layout
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                // Mobile: minimize video by default
                setIsVideoMinimized(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleJoinRoom = async () => {
        try {
            let password: string | undefined;

            // For private rooms, prompt for password
            // In real app, this might come from a proper modal or route state
            const urlParams = new URLSearchParams(window.location.search);
            // password = urlParams.get('password') || undefined;

            // if (!password) {
            //     // Could implement a proper password modal here
            //     const isPrivate = true; // This would come from room info
            //     if (isPrivate) {
            //         password = prompt('This is a private room. Please enter the password:') || undefined;
            //     }
            // }

            await dispatch(joinRoomThunk({ roomId: roomId!, password })).unwrap();

        } catch (error: any) {
            console.error('Failed to join room:', error);
            // Handle specific error cases
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
                'whiteboard-changed': handleWhiteboardChanged,
                'permissions-updated': handlePermissionsUpdated,
                'user-joined': handleUserJoined,
                'user-left': handleUserLeft,
                'user-kicked': handleUserKicked,
                'kicked': handleKicked,
                'error': handleSocketError
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

        // Show notification
        if (data.changedBy !== user?.id) {
            // You could show a toast notification here
            console.log(`Problem changed by user ${data.changedBy}`);
        }
    };

    const handleCodeChanged = (data: any) => {
        if (data.changedBy !== user?.id) {
            setCode(data.code);
            setSelectedLanguage(data.language);
        }
    };

    const handleWhiteboardChanged = (data: any) => {
        // Whiteboard component will handle this
        console.log('Whiteboard changed:', data);
    };

    const handlePermissionsUpdated = (data: any) => {
        dispatch(updateUserPermissions({
            userId: data.targetUserId,
            permissions: data.permissions
        }));

        if (data.targetUserId === user?.id) {
            // Show notification about permission change
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
        // Could show toast notification
    };

    // Code Editor Handlers
    const handleLanguageChange = (language: string) => {
        if (!currentRoom?.userPermissions?.canEditCode) return;
        if (!isCreator) return; // Only creator can change language

        setSelectedLanguage(language);

        // Broadcast language change would happen through code update
        if (currentRoom?.problemNumber) {
            roomSocketService.updateCode(code, language, currentRoom.problemNumber);
        }
    };

    const handleEditorDidMount = (editor: any) => {
        // Setup editor
    };

    const resetCode = () => {
        if (currentRoom?.problem?.templates[selectedLanguage].userFunctionSignature) {
            setCode(currentRoom.problem.templates[selectedLanguage].userFunctionSignature);
        }
    };

    const runCode = async () => {
        setIsRunning(true);
        try {
            // Implement your existing Judge0 integration here
            // This would use the same logic as your problem solving page
            console.log('Running code...');
            await new Promise(resolve => setTimeout(resolve, 2000)); // Mock delay
            setRunCodeResults({ status: 'success', output: 'Mock output' } as any);
            setBottomActiveTab('result');
        } finally {
            setIsRunning(false);
        }
    };

    const submitCode = async () => {
        setIsSubmitting(true);
        try {
            // Implement your existing Judge0 integration here
            console.log('Submitting code...');
            await new Promise(resolve => setTimeout(resolve, 3000)); // Mock delay
            setSubmissionResults({ status: 'accepted', results: [] } as any);
            setBottomActiveTab('result');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getTestCaseStatus = (testCaseId: string) => {
        // Implement based on your existing logic
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
    if (error ) {
        return (
            <div className="h-screen bg-gray-900 text-white flex items-center justify-center">
                <ErrorDisplay
                    message={error}
                    // onRetry={() => handleJoinRoom()}
                    // onBack={() => navigate('/')}
                />
            </div>
        );
    }

    // Room not found
    if (!currentRoom ) {
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
    const sampleTestCases = currentRoom.problem?.sampleTestCases || [];

    return (
        <div className="h-screen bg-gray-900 text-white flex flex-col">
            <Navbar />

            {/* Room Header */}
            <div className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
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

                <div className="flex items-center space-x-3">
                    {isCreator && (
                        <button
                            onClick={() => setShowCreatorControls(!showCreatorControls)}
                            className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm transition-colors"
                        >
                            Creator Controls
                        </button>
                    )}
                    <button
                        onClick={handleLeaveRoom}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition-colors"
                    >
                        Leave Room
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Mobile Layout */}
                <div className="md:hidden flex flex-col w-full">
                    {/* Top Section - Tabs */}
                    <div className="h-1/2 bg-black border-b border-gray-700 overflow-hidden flex flex-col">
                        <RoomTabNavigation
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            hasVideo={true}
                            hasWhiteboard={true}
                        />

                        {isCreator && showCreatorControls && (
                            <RoomCreatorControls
                                room={currentRoom}
                                onClose={() => setShowCreatorControls(false)}
                            />
                        )}

                        <div className="flex-1 overflow-hidden">
                            {activeTab === 'problem' && (
                                <ProblemDescriptionTab
                                    problem={currentRoom.problem}
                                    canChangeProblem={currentRoom.userPermissions?.canChangeProblem || false}
                                />
                            )}

                            {activeTab === 'video' && (
                                <VideoCallTab
                                    roomId={currentRoom.roomId}
                                    jitsiUrl={currentRoom.jitsiUrl}
                                    participants={currentRoom.participants}
                                />
                            )}

                            {activeTab === 'whiteboard' && (
                                <WhiteboardTab
                                    roomId={currentRoom.roomId}
                                    canDraw={currentRoom.userPermissions?.canDrawWhiteboard || false}
                                />
                            )}
                        </div>
                    </div>

                    {/* Bottom Section - Code Editor */}
                    <div className="h-1/2 flex flex-col">
                        <EditorControls
                            selectedLanguage={selectedLanguage}
                            languages={languages}
                            handleLanguageChange={handleLanguageChange}
                            resetCode={resetCode}
                            disabled={!currentRoom.userPermissions?.canEditCode}
                            isCreator={isCreator}
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
                                    problemNumber={currentRoom.problemNumber}
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
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:flex w-full">
                    {/* Left Side - Tabbed Content */}
                    <div className="w-1/2 bg-black border-r border-gray-700 overflow-hidden flex flex-col relative">
                        <RoomTabNavigation
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            hasVideo={true}
                            hasWhiteboard={true}
                        />

                        {isCreator && showCreatorControls && (
                            <RoomCreatorControls
                                room={currentRoom}
                                onClose={() => setShowCreatorControls(false)}
                            />
                        )}

                        <div className="flex-1 overflow-hidden">
                            {activeTab === 'problem' && (
                                <ProblemDescriptionTab
                                    problem={currentRoom.problem}
                                    canChangeProblem={currentRoom.userPermissions?.canChangeProblem || false}
                                />
                            )}

                            {activeTab === 'video' && (
                                <VideoCallTab
                                    roomId={currentRoom.roomId}
                                    jitsiUrl={currentRoom.jitsiUrl}
                                    participants={currentRoom.participants}
                                    onMinimize={() => setIsVideoMinimized(true)}
                                />
                            )}

                            {activeTab === 'whiteboard' && (
                                <WhiteboardTab
                                    roomId={currentRoom.roomId}
                                    canDraw={currentRoom.userPermissions?.canDrawWhiteboard || false}
                                />
                            )}
                        </div>

                        {/* Minimized Video Overlay */}
                        {isVideoMinimized && activeTab !== 'video' && (
                            <div className="absolute top-16 right-4 w-64 h-48 bg-black rounded-lg overflow-hidden shadow-lg z-10">
                                <VideoCallTab
                                    roomId={currentRoom.roomId}
                                    jitsiUrl={currentRoom.jitsiUrl}
                                    participants={currentRoom.participants}
                                    minimized={true}
                                    onExpand={() => {
                                        setActiveTab('video');
                                        setIsVideoMinimized(false);
                                    }}
                                    onClose={() => setIsVideoMinimized(false)}
                                />
                            </div>
                        )}
                    </div>

                    {/* Right Side - Code Editor */}
                    <div className="w-1/2 flex flex-col">
                        <EditorControls
                            selectedLanguage={selectedLanguage}
                            languages={languages}
                            handleLanguageChange={handleLanguageChange}
                            resetCode={resetCode}
                            disabled={!currentRoom.userPermissions?.canEditCode}
                            isCreator={isCreator}
                        />

                        <CodeEditorSection
                            selectedLanguage={selectedLanguage}
                            code={code}
                            setCode={setCode}
                            handleEditorDidMount={handleEditorDidMount}
                            readOnly={!currentRoom.userPermissions?.canEditCode}
                            roomId={currentRoom.roomId}
                            problemNumber={currentRoom.problemNumber}
                        />

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
            </div>
        </div>
    );
};

export default RoomPage;
