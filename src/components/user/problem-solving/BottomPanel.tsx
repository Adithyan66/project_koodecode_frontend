import React from 'react';
import { Play } from 'lucide-react';
import TestCaseDisplay from './TestCaseDisplay';
import RunCodeResultDisplay from './RunCodeResultDisplay';
import SubmissionResultDisplay from './SubmissionResultDisplay';
import type { SampleTestCase, RunCodeResponse, SubmissionResponse } from '../../../types/problem';

interface BottomPanelProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    activeTestCase: number;
    setActiveTestCase: (index: number) => void;
    sampleTestCases: SampleTestCase[];
    getTestCaseStatus: (testCaseId: string) => 'passed' | 'failed' | 'neutral';
    isRunning: boolean;
    isSubmitting: boolean;
    runCode: () => void;
    submitCode: () => void;
    runCodeResults: RunCodeResponse | null;
    submissionResults: SubmissionResponse | null;
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
    submissionResults,
}) => (
    <div className="h-64 bg-black border-t border-gray-700 flex flex-col">
        <div className="flex justify-between items-center border-b border-gray-700 px-4 py-2">
            <div className="flex space-x-2">
                <button
                    onClick={() => setActiveTab('testcase')}
                    className={`px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'testcase'
                        ? 'text-white border-b-2 border-green-500 bg-gray-700'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                        }`}
                >
                    Testcase
                </button>
                <button
                    onClick={() => setActiveTab('result')}
                    className={`px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'result'
                        ? 'text-white border-b-2 border-green-500 bg-gray-700'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                        }`}
                >
                    Test Result
                    {(runCodeResults || submissionResults) && (
                        <span className="ml-2 w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                    )}
                </button>
            </div>
            <div className="flex space-x-3">
                <button
                    onClick={runCode}
                    disabled={isRunning || isSubmitting}
                    className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded text-sm font-medium transition-colors"
                >
                    <Play size={16} />
                    <span>{isRunning ? 'Running...' : 'Run'}</span>
                </button>
                <button
                    onClick={submitCode}
                    disabled={isRunning || isSubmitting}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded text-sm font-medium transition-colors"
                >
                    <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
                </button>
            </div>
        </div>
        <div className="flex-1 p-4 overflow-y-auto no-scrollbar">
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
                    {isRunning || isSubmitting ? (
                        <div className="flex items-center space-x-2 text-yellow-500">
                            <div className="animate-spin w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full"></div>
                            <span className="text-sm">
                                {isRunning ? 'Running tests...' : 'Submitting solution...'}
                            </span>
                        </div>
                    ) : submissionResults ? (
                        <SubmissionResultDisplay result={submissionResults} />
                    ) : runCodeResults ? (
                        <RunCodeResultDisplay result={runCodeResults} />
                    ) : (
                        <div className="text-gray-400 text-sm">
                            No test results yet. Click "Run" to test with sample cases or "Submit" for full evaluation.
                        </div>
                    )}
                </div>
            )}
        </div>
    </div>
);

export default BottomPanel;