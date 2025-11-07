





import React from 'react';
import Navbar from '../../components/user/Navbar';
import RoomTabNavigation from '../../components/room/RoomTabNavigation';
import RoomCreatorControls from '../../components/room/RoomCreatorControls';
import ProblemDescriptionTab from '../../components/room/ProblemDescriptionTab';
import VideoCallTab from '../../components/room/VideoCallTab';
import WhiteboardTab from '../../components/room/WhiteboardTab';
import EditorControls from '../../components/user/problem-solving/EditorControls';
import CodeEditorSection from '../../components/room/CodeEditorSection';
import BottomPanel from '../../components/user/problem-solving/BottomPanel';
import ErrorDisplay from '../../components/common/ErrorDisplay';

import ChatComponent from '../../components/room/chatComponent';
import RotatingSpinner from '../../components/common/LoadingSpinner';
import { useRoom } from '../../app/hooks/room/useRoom';

const RoomPage: React.FC = () => {
    const {
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
        sampleTestCases,
        runCodeResults,
        submissionResults,
        activeTestCase,
        setActiveTestCase,
        isRunning,
        isSubmitting,
        rightPaneRef,
        editorHeightPct,
        handleHorizontalMouseDown,
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
        setIsCameraOn
    } = useRoom();

    if (isJoining) {
        return <RotatingSpinner />;
    }

    if (error) {
        return (
            <div className="h-screen bg-gray-900 text-white flex items-center justify-center">
                <ErrorDisplay message={error} />
            </div>
        );
    }

    if (!currentRoom) {
        return (
            <div className="h-screen bg-gray-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-4">Room not found</h2>
                    <p className="text-gray-400 mb-4">The room you're looking for doesn't exist or has ended.</p>
                    <button
                        onClick={() => handleLeaveRoom()}
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-black text-white flex flex-col">
            <Navbar />
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
                        <div className={`absolute inset-0 ${activeTab === 'problem' ? 'block' : 'hidden'}`}>
                            <ProblemDescriptionTab
                                canChangeProblem={currentRoom.userPermissions?.canChangeProblem || false}
                            />
                        </div>

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
                                onLocalVideoStatusChange={on => setIsCameraOn(on)}
                            />
                        </div>

                        <div className={`absolute inset-0 ${activeTab === 'whiteboard' ? 'block' : 'hidden'}`}>
                            <WhiteboardTab
                                roomId={currentRoom.roomId}
                                canDraw={currentRoom.userPermissions?.canDrawWhiteboard || false}
                            />
                        </div>

                        <div className={`absolute inset-0 ${activeTab === 'chat' ? 'block' : 'hidden'}`}>
                            <ChatComponent roomId={currentRoom.roomId} />
                        </div>
                    </div>

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
                                try {
                                    selfViewVideoRef.current?.play().catch(() => {});
                                } catch {}
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
