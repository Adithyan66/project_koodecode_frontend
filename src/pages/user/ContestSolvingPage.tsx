


import React from 'react';
import Navbar from '../../components/user/Navbar';
import Timer from '../../components/common/Timer';
import { useContestSolving } from '../../app/hooks/contest/useContestSolving';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorDisplay from '../../components/common/ErrorDisplay';
import DescriptionSection from '../../components/user/problem-solving/DescriptionSection';
import EditorControls from '../../components/user/problem-solving/EditorControls';
import CodeEditorSection from '../../components/user/problem-solving/CodeEditorSection';
import BottomPanel from '../../components/user/problem-solving/BottomPanel';
import SubmissionResultModal from '../../components/user/problem-solving/SubmissionResultModal';
import type { Constraint } from '../../types/problem';

const ContestSolvingPage: React.FC = () => {
    const {
        code,
        setCode,
        problemData,
        sampleTestCases,
        loading,
        error,
        runCodeResults,
        submissionResults,
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
        editorRef,
        handleEditorDidMount,
        handleLanguageChange,
        runCode,
        submitCode,
        resetCode,
        getTestCaseStatus,
        handleTimeUp,
        selectedLanguage,
    } = useContestSolving();

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
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <div className="w-1/2 bg-black border-r border-gray-700 overflow-y-auto no-scrollbar">
                    <div className="p-6">
                        <h1 className="text-2xl font-bold mb-2 text-white mb-6 mt-10">
                            Q, {problemData.title}
                        </h1>
                        <DescriptionSection
                            problemData={problemData}
                            formattedConstraints={formattedConstraints}
                            showHints={showHints}
                            setShowHints={setShowHints}
                        />
                    </div>
                </div>
                <div className="w-1/2 flex flex-col">
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
            {contestSubmissionData && (
                <SubmissionResultModal
                    isOpen={showSubmissionModal}
                    onClose={() => setShowSubmissionModal(false)}
                    submissionData={contestSubmissionData}
                />
            )}
        </div>
    );
};

export default ContestSolvingPage;