



import React from 'react';
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
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <div className="w-1/2 bg-black border-r border-gray-700 overflow-y-auto no-scrollbar">
                    <div className="p-6">
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
                <div className="w-1/2 flex flex-col">
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
    );
};

export default ProblemSolvingPage;