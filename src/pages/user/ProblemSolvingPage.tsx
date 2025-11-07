



import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useProblemSolving } from '../../app/hooks/problem/useProblemSolving';
import ErrorDisplay from '../../components/common/ErrorDisplay';
import ProblemHeader from '../../components/user/problem-solving/ProblemHeader';
import DescriptionSectionWithTabs from '../../components/user/problem-solving/DescriptionSectionWithTabs';
import EditorControls from '../../components/user/problem-solving/EditorControls';
import CodeEditorSection from '../../components/user/problem-solving/CodeEditorSection';
import BottomPanel from '../../components/user/problem-solving/BottomPanel';
import Navbar from '../../components/user/Navbar';
import RotatingSpinner from '../../components/common/LoadingSpinner';
import { formatConstraints } from '../../utils/problem-related';

const STORAGE_KEYS = {
    LEFT_WIDTH: 'problemSolving_leftWidth',
    EDITOR_HEIGHT: 'problemSolving_editorHeight',
};

const DEFAULTS = {
    LEFT_WIDTH: 50,
    EDITOR_HEIGHT: 60,
};

const LIMITS = {
    MIN_LEFT_WIDTH: 20,
    MAX_LEFT_WIDTH: 80,
    MIN_EDITOR_HEIGHT: 20,
    MAX_EDITOR_HEIGHT: 80,
};

const ProblemSolvingPage: React.FC = () => {
    const {
        code,
        setCode,
        problemData,
        sampleTestCases,
        loading,
        error,
        runCodeResults,
        submissionResults,
        activeTab,
        setActiveTab,
        activeTestCase,
        setActiveTestCase,
        isRunning,
        isSubmitting,
        showHints,
        setShowHints,
        languages,
        handleEditorDidMount,
        handleLanguageChange,
        runCode,
        submitCode,
        resetCode,
        getTestCaseStatus,
        selectedLanguage,
    } = useProblemSolving();

    const [leftWidth, setLeftWidth] = useState<number>(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.LEFT_WIDTH);
        return saved ? parseFloat(saved) : DEFAULTS.LEFT_WIDTH;
    });

    const [editorHeight, setEditorHeight] = useState<number>(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.EDITOR_HEIGHT);
        return saved ? parseFloat(saved) : DEFAULTS.EDITOR_HEIGHT;
    });

    const [isResizingVertical, setIsResizingVertical] = useState(false);
    const [isResizingHorizontal, setIsResizingHorizontal] = useState(false);
    const [activeDescriptionTab, setActiveDescriptionTab] = useState<'description' | 'submissions'>('description');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.LEFT_WIDTH, leftWidth.toString());
    }, [leftWidth]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.EDITOR_HEIGHT, editorHeight.toString());
    }, [editorHeight]);

    useEffect(() => {
        if (submissionResults && !isSubmitting) {
            setActiveDescriptionTab('submissions');
        }
    }, [submissionResults, isSubmitting]);

    const handleVerticalMouseDown = useCallback(() => {
        setIsResizingVertical(true);
    }, []);

    const handleHorizontalMouseDown = useCallback(() => {
        setIsResizingHorizontal(true);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;

            if (isResizingVertical) {
                const containerRect = containerRef.current.getBoundingClientRect();
                const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
                
                if (newLeftWidth >= LIMITS.MIN_LEFT_WIDTH && newLeftWidth <= LIMITS.MAX_LEFT_WIDTH) {
                    setLeftWidth(newLeftWidth);
                }
            }

            if (isResizingHorizontal) {
                const containerRect = containerRef.current.getBoundingClientRect();
                const navbarHeight = 64;
                const availableHeight = containerRect.height;
                const relativeY = e.clientY - containerRect.top - navbarHeight;
                const newEditorHeight = (relativeY / availableHeight) * 100;
                
                if (newEditorHeight >= LIMITS.MIN_EDITOR_HEIGHT && newEditorHeight <= LIMITS.MAX_EDITOR_HEIGHT) {
                    setEditorHeight(newEditorHeight);
                }
            }
        };

        const handleMouseUp = () => {
            setIsResizingVertical(false);
            setIsResizingHorizontal(false);
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

    if (loading) return <RotatingSpinner />;
    if (error) return <ErrorDisplay message={error} />;
    if (!problemData) return <ErrorDisplay message="No problem data available" />;

    

    const getAcceptanceRate = (accepted: number, total: number): string => {
        if (total === 0) return '0%';
        return `${((accepted / total) * 100).toFixed(1)}%`;
    };

    const formattedConstraints = formatConstraints(problemData.constraints);
    const acceptanceRate = getAcceptanceRate(problemData.acceptedSubmissions, problemData.totalSubmissions);

    return (
        <div className="h-screen bg-gray-900 text-white flex flex-col">
            <Navbar />
            <div ref={containerRef} className="flex flex-1 overflow-hidden relative p-1 ">
                <div 
                    className="bg-black rounded-lg overflow-hidden flex flex-col"
                    style={{ width: `${leftWidth}%` }}
                >
                    <div className="flex flex-col overflow-hidden">
                        <div className="p-6 pb-4">
                            <ProblemHeader problemData={problemData} acceptanceRate={acceptanceRate} />
                            <h1 className="text-2xl font-bold mb-2 text-white mb-6 mt-10">
                                {problemData.problemNumber}. {problemData.title}
                            </h1>
                        </div>
                        <div className="flex-1 overflow-hidden px-6 pb-6">
                            <DescriptionSectionWithTabs
                                problemData={problemData}
                                formattedConstraints={formattedConstraints}
                                showHints={showHints}
                                setShowHints={setShowHints}
                                activeDescriptionTab={activeDescriptionTab}
                                setActiveDescriptionTab={setActiveDescriptionTab}
                                latestSubmission={submissionResults}
                            />
                        </div>
                    </div>
                </div>

                <div
                    className="relative flex items-center justify-center cursor-col-resize group"
                    style={{ width: '8px' }}
                    onMouseDown={handleVerticalMouseDown}
                >
                    <div className="w-1 h-12 bg-gray-600 rounded-full group-hover:bg-blue-500 transition-colors" />
                </div>

                <div 
                    className="flex flex-col overflow-hidden "
                    style={{ width: `calc(${100 - leftWidth}% - 8px)` }}
                >
                    <div 
                        className="bg-black rounded-lg overflow-hidden flex flex-col"
                        style={{ height: `${editorHeight}%` }}
                    >
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
                        />
                    </div>

                    <div
                        className="relative flex items-center justify-center cursor-row-resize group"
                        style={{ height: '8px' }}
                        onMouseDown={handleHorizontalMouseDown}
                    >
                        <div className="h-1 w-12 bg-gray-600 rounded-full group-hover:bg-blue-500 transition-colors" />
                    </div>

                    <div 
                        className="bg-black rounded-lg overflow-hidden"
                        style={{ height: `calc(${100 - editorHeight}% - 8px)` }}
                    >
                        <BottomPanel
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            activeTestCase={activeTestCase}
                            setActiveTestCase={setActiveTestCase}
                            sampleTestCases={sampleTestCases}
                            getTestCaseStatus={getTestCaseStatus}
                            isRunning={isRunning}
                            isSubmitting={isSubmitting}
                            runCode={runCode}
                            submitCode={submitCode}
                            runCodeResults={runCodeResults}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProblemSolvingPage;