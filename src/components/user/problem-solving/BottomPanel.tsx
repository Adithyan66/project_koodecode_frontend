import React from 'react';
import { Play } from 'lucide-react';
import TestCaseDisplay from './TestCaseDisplay';
import RunCodeResultDisplay from './RunCodeResultDisplay';
import type { SampleTestCase, RunCodeResponse, SubmissionResponse } from '../../../types/problem';

export type BottomPanelTab = 'testcase' | 'result';

interface BottomPanelProps {
    activeTab: BottomPanelTab;
    setActiveTab: React.Dispatch<React.SetStateAction<BottomPanelTab>>;
    activeTestCase: number;
    setActiveTestCase: (index: number) => void;
    sampleTestCases: SampleTestCase[];
    getTestCaseStatus: (testCaseId: string) => 'passed' | 'failed' | 'neutral';
    isRunning: boolean;
    isSubmitting: boolean;
    runCode: () => void;
    submitCode: (autoSubmit?: boolean) => void;
    runCodeResults: RunCodeResponse | null;
    submissionResults?: SubmissionResponse | null;
}

const BottomPanel: React.FC<BottomPanelProps> = ({
    activeTab,
    setActiveTab,
    activeTestCase,
    setActiveTestCase,
    sampleTestCases,
    getTestCaseStatus,
    isRunning,
    isSubmitting,
    runCode,
    submitCode,
    runCodeResults,
    submissionResults: _submissionResults,
}) => (
    <div className="h-full bg-gradient-to-b from-gray-900 to-black flex flex-col">
        <div className="flex justify-between items-center bg-gray-800/50 backdrop-blur-sm px-6 py-3 border-b border-gray-700/50">
            <div className="flex space-x-1">
                <button
                    onClick={() => setActiveTab('testcase')}
                    className={`relative px-5 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg ${activeTab === 'testcase'
                        ? 'text-white bg-gray-700 shadow-lg shadow-green-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                        }`}
                >
                    {activeTab === 'testcase' && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-green-500 to-transparent rounded-full" />
                    )}
                    Testcase
                </button>
                <button
                    onClick={() => setActiveTab('result')}
                    className={`relative px-5 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg ${activeTab === 'result'
                        ? 'text-white bg-gray-700 shadow-lg shadow-green-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                        }`}
                >
                    {activeTab === 'result' && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-green-500 to-transparent rounded-full" />
                    )}
                    <span>Test Result</span>
                    {runCodeResults && (
                        <span className="ml-2 w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse shadow-lg shadow-green-400/50"></span>
                    )}
                </button>
            </div>
            <div className="flex space-x-3">
                <button
                    onClick={runCode}
                    disabled={isRunning || isSubmitting}
                    className="group flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-gray-600/30 active:scale-95"
                >
                    <Play size={16} className={`${isRunning ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
                    <span>{isRunning ? 'Running...' : 'Run'}</span>
                </button>
                <button
                    onClick={() => submitCode(false)}
                    disabled={isRunning || isSubmitting}
                    className="group flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-green-600/40 active:scale-95"
                >
                    <span className="font-semibold">{isSubmitting ? 'Submitting...' : 'Submit'}</span>
                </button>
            </div>
        </div>
        <div className="flex-1 p-6 overflow-y-auto no-scrollbar">
            {activeTab === 'testcase' && (
                <TestCaseDisplay
                    activeTestCase={activeTestCase}
                    setActiveTestCase={setActiveTestCase}
                    sampleTestCases={sampleTestCases}
                    getTestCaseStatus={getTestCaseStatus}
                />
            )}
            {activeTab === 'result' && (
                <div className="space-y-4">
                    {isRunning ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <div className="relative">
                                <div className="animate-spin w-12 h-12 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full"></div>
                                <div className="absolute inset-0 animate-ping w-12 h-12 border-4 border-yellow-500/20 rounded-full"></div>
                            </div>
                            <div className="text-center">
                                <p className="text-yellow-400 font-medium">Running tests...</p>
                                <p className="text-gray-500 text-sm mt-1">Testing your code against sample cases</p>
                            </div>
                        </div>
                    ) : isSubmitting ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <div className="relative">
                                <div className="animate-spin w-12 h-12 border-4 border-green-500/30 border-t-green-500 rounded-full"></div>
                                <div className="absolute inset-0 animate-ping w-12 h-12 border-4 border-green-500/20 rounded-full"></div>
                            </div>
                            <div className="text-center">
                                <p className="text-green-400 font-medium">Submitting solution...</p>
                                <p className="text-gray-500 text-sm mt-1">Evaluating against all test cases</p>
                            </div>
                        </div>
                    ) : runCodeResults ? (
                        <RunCodeResultDisplay result={runCodeResults} />
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 space-y-4">
                            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
                                <Play size={28} className="text-gray-600" />
                            </div>
                            <div className="text-center">
                                <p className="text-gray-400 font-medium">No test results yet</p>
                                <p className="text-gray-600 text-sm mt-2 max-w-md">
                                    Click <span className="text-gray-400 font-semibold">"Run"</span> to test with sample cases.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    </div>
);

export default BottomPanel;