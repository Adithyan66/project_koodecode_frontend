


import React, { useEffect, useState } from 'react';
import Navbar from '../../components/user/Navbar';
import Timer from '../../components/common/Timer';
import { useContestSolving } from '../../app/hooks/contest/useContestSolving';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorDisplay from '../../components/common/ErrorDisplay';
import DescriptionSection from '../../components/user/problem-solving/DescriptionSection';
import EditorControls from '../../components/user/problem-solving/EditorControls';
import CodeEditorSection from '../../components/user/problem-solving/CodeEditorSection';
import BottomPanel from '../../components/user/problem-solving/BottomPanel';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import SubmissionResultModal from '../../components/user/problem-solving/SubmissionResultModal';
import type { Constraint } from '../../types/problem';
import Logo from "../../assets/images/Screenshot from 2025-08-02 10-50-58 1.svg"

const ContestSolvingPage: React.FC = () => {
    const {
        code,
        setCode,
        problemData,
        sampleTestCases,
        loading,
        error,
        runCodeResults,
        contestSubmissionData,
        activeTab,
        setActiveTab,
        activeTestCase,
        setActiveTestCase,
        isRunning,
        isSubmitting,
        showHints,
        setShowHints,
        languages,
        remainingSeconds,
        showSubmissionModal,
        setShowSubmissionModal,
        handleEditorDidMount,
        handleLanguageChange,
        runCode,
        submitCode,
        resetCode,
        getTestCaseStatus,
        handleTimeUp,
        selectedLanguage,
    } = useContestSolving();
    const { contestNumber } = useParams();
    const navigate = useNavigate();

    const [showAutoSubmitModal, setShowAutoSubmitModal] = useState(false);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                submitCode(true);
                setShowAutoSubmitModal(true);
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [submitCode, code, problemData, contestNumber, selectedLanguage]);



    // Entry guard: only allow if navigated via Enter button
    const location = useLocation();

    useEffect(() => {
        const fromEnter = (location.state as any)?.fromEnter === true;
        let sessionAllowed = false;
        try {
            sessionAllowed = window.sessionStorage.getItem(`contest:${contestNumber}:entered`) === '1';
        } catch { }
        if (!fromEnter && !sessionAllowed) {
            // Replace history to prevent back navigation into this page
            if (contestNumber) {
                navigate(`/contest/${contestNumber}`, { replace: true });
            } else {
                navigate('/', { replace: true });
            }
        }
    }, [location.state, contestNumber, navigate]);

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

    const formattedConstraints = formatConstraints(problemData.constraints);

    return (
        <div className="h-screen bg-gray-900 text-white flex flex-col">
            < nav className="flex items-center justify-between px-6 py-2 bg-black relative h-14" >
                <div className="flex items-center space-x-2">
                    <img src={Logo} alt="Logo" className="h-8" />
                </div>

            </nav >
            <div className="flex flex-1 overflow-hidden">
                <div className="w-1/2 bg-black border-r border-gray-700 overflow-y-auto no-scrollbar">
                    <div className="p-6">
                        <h1 className="text-2xl font-bold mb-2 text-white mb-6 mt-10">
                            Q, {problemData.title}
                        </h1>
                        <DescriptionSection
                            problemData={problemData as any}
                            formattedConstraints={formattedConstraints}
                            showHints={showHints}
                            setShowHints={setShowHints}
                        />
                    </div>
                </div>
                <div className="w-1/2 flex flex-col min-h-0">
                    <div className="bg-black rounded-lg overflow-hidden flex flex-col flex-1 min-h-0">
                        <EditorControls
                            selectedLanguage={selectedLanguage}
                            languages={languages}
                            handleLanguageChange={handleLanguageChange}
                            resetCode={resetCode}
                            timer={remainingSeconds !== null ? (
                                <Timer remainingTimeSeconds={remainingSeconds} onTimeUp={handleTimeUp} />
                            ) : undefined}
                        />
                        <CodeEditorSection
                            selectedLanguage={selectedLanguage}
                            code={code}
                            setCode={setCode}
                            handleEditorDidMount={handleEditorDidMount}
                        />
                    </div>
                    <div className="bg-black rounded-lg overflow-hidden flex-none" style={{ height: '38%' }}>
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
            {contestSubmissionData && (
                <SubmissionResultModal
                    isOpen={showSubmissionModal}
                    onClose={() => setShowSubmissionModal(false)}
                    submissionData={contestSubmissionData}
                />
            )}

            {showAutoSubmitModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60" />
                    <div className="relative bg-gray-900/95 backdrop-blur rounded-xl border border-gray-700 w-full max-w-md p-5">
                        <h3 className="text-white text-lg font-semibold mb-2">Code auto-submitted</h3>
                        <p className="text-gray-300 text-sm mb-4">
                            Your code was auto-submitted because the contest tab was hidden (tab change/minimize/close).
                        </p>
                        <button
                            className="w-full px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => {
                                setShowAutoSubmitModal(false);
                                if (contestNumber) {
                                    navigate(`/contest/${contestNumber}`, { replace: true });
                                } else {
                                    navigate('/', { replace: true });
                                }
                            }}
                        >
                            Go to Contest Info
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContestSolvingPage;