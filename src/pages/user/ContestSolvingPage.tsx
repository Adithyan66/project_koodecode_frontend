

import Timer from '../../components/common/Timer';
import { useContestSolving } from '../../app/hooks/contest/useContestSolving';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorDisplay from '../../components/common/ErrorDisplay';
import DescriptionSection from '../../components/user/problem-solving/DescriptionSection';
import EditorControls from '../../components/user/problem-solving/EditorControls';
import CodeEditorSection from '../../components/user/problem-solving/CodeEditorSection';
import BottomPanel from '../../components/user/problem-solving/BottomPanel';
import SubmissionResultModal from '../../components/user/problem-solving/SubmissionResultModal';
import Logo from "../../assets/images/Screenshot from 2025-08-02 10-50-58 1.svg";
import { formatConstraints } from '../../utils/problem-related';

const ContestSolvingPage = () => {
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
        showAutoSubmitModal,
        handleCloseAutoSubmitModal,
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
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                    <div className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 rounded-2xl border-2 border-green-500/40 shadow-2xl shadow-green-500/20 w-full max-w-md overflow-hidden">
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent pointer-events-none" />
                        
                        {/* Content */}
                        <div className="relative p-6">
                            {/* Icon */}
                            <div className="flex justify-center mb-4">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-green-500/30 rounded-full blur-xl animate-pulse" />
                                    <div className="relative bg-gradient-to-br from-green-900/60 to-emerald-900/60 rounded-full p-4 border-2 border-green-500/50">
                                        <i className="fas fa-check-circle text-4xl text-green-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-white text-xl font-bold mb-3 text-center bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent">
                                Code Auto-Submitted
                            </h3>

                            {/* Description */}
                            <div className="bg-gray-950/50 rounded-lg p-4 mb-6 border border-green-500/20">
                                <p className="text-gray-300 text-sm leading-relaxed text-center">
                                    Your code was automatically submitted because the contest tab was hidden (tab change, minimize, or close).
                                </p>
                            </div>

                            {/* Button */}
                            <button
                                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold transition-all duration-300 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                                onClick={handleCloseAutoSubmitModal}
                            >
                                <i className="fas fa-arrow-right" />
                                <span>Go to Contest Info</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContestSolvingPage;