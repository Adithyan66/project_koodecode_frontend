



import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '../../components/user/Navbar';
import { useProblemSolving } from '../../app/hooks/problem/useProblemSolving';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorDisplay from '../../components/common/ErrorDisplay';
import ProblemHeader from '../../components/user/problem-solving/ProblemHeader';
import DescriptionSection from '../../components/user/problem-solving/DescriptionSection';
import EditorControls from '../../components/user/problem-solving/EditorControls';
import CodeEditorSection from '../../components/user/problem-solving/CodeEditorSection';
import BottomPanel from '../../components/user/problem-solving/BottomPanel';
import type { Constraint } from '../../types/problem';

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
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.LEFT_WIDTH, leftWidth.toString());
    }, [leftWidth]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.EDITOR_HEIGHT, editorHeight.toString());
    }, [editorHeight]);

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

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorDisplay message={error} />;
    if (!problemData) return <ErrorDisplay message="No problem data available" />;

    const formatConstraints = (constraints: Constraint[]): string[] => {
        return constraints.map(constraint => {
            let formatted = `${constraint.parameterName}: ${constraint.type}`;
            if (constraint.type === 'array') {
                if (constraint.minLength !== undefined && constraint.maxLength !== undefined) {
                    formatted += ` (length: ${constraint.minLength} <= length <= ${constraint.maxLength})`;
                } else if (constraint.minLength !== undefined) {
                    formatted += ` (length >= ${constraint.minLength})`;
                } else if (constraint.maxLength !== undefined) {
                    formatted += ` (length <= ${constraint.maxLength})`;
                }
            } else {
                if (constraint.minValue !== undefined && constraint.maxValue !== undefined) {
                    formatted += ` (${constraint.minValue} <= value <= ${constraint.maxValue})`;
                } else if (constraint.minValue !== undefined) {
                    formatted += ` (>= ${constraint.minValue})`;
                } else if (constraint.maxValue !== undefined) {
                    formatted += ` (<= ${constraint.maxValue})`;
                }
            }
            return formatted;
        });
    };

    const getAcceptanceRate = (accepted: number, total: number): string => {
        if (total === 0) return '0%';
        return `${((accepted / total) * 100).toFixed(1)}%`;
    };

    const formattedConstraints = formatConstraints(problemData.constraints);
    const acceptanceRate = getAcceptanceRate(problemData.acceptedSubmissions, problemData.totalSubmissions);

    return (
        <div className="h-screen bg-gray-900 text-white flex flex-col">
            {/* <Navbar /> */}
            <div ref={containerRef} className="flex flex-1 overflow-hidden relative p-1 ">
                <div 
                    className="bg-black rounded-lg overflow-hidden flex flex-col"
                    style={{ width: `${leftWidth}%` }}
                >
                    <div className="overflow-y-auto no-scrollbar flex-1 p-6">
                        <ProblemHeader problemData={problemData} acceptanceRate={acceptanceRate} />
                        <h1 className="text-2xl font-bold mb-2 text-white mb-6 mt-10">
                            {problemData.problemNumber}. {problemData.title}
                        </h1>
                        <DescriptionSection
                            problemData={problemData}
                            formattedConstraints={formattedConstraints}
                            showHints={showHints}
                            setShowHints={setShowHints}
                        />
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
                            submissionResults={submissionResults}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProblemSolvingPage;