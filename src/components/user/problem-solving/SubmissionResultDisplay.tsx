import React from 'react';
import { CheckCircle, X } from 'lucide-react';
import type { SubmissionResponse } from '../../../types/problem';

interface SubmissionResultDisplayProps {
    result: SubmissionResponse;
}

const SubmissionResultDisplay: React.FC<SubmissionResultDisplayProps> = ({ result }) => {
    const failedTestCases = result.testCaseResults.filter(tc => tc.status !== 'passed');

    if (result.overallVerdict === 'Accepted') {
        return (
            <div className="space-y-4">
                <div className="bg-green-900 bg-opacity-30 border border-green-500 p-6 rounded-lg text-center">
                    <div className="flex justify-center mb-4">
                        <CheckCircle size={48} className="text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold text-green-400 mb-2">Accepted!</h3>
                    <p className="text-green-300 mb-4">Your solution passed all test cases</p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                            <span className="text-gray-400">Test Cases:</span>
                            <div className="text-white font-medium">{result.testCasesPassed}/{result.totalTestCases}</div>
                        </div>
                        <div>
                            <span className="text-gray-400">Runtime:</span>
                            <div className="text-white font-medium">{result.totalExecutionTime}ms</div>
                        </div>
                        <div>
                            <span className="text-gray-400">Score:</span>
                            <div className="text-white font-medium">{result.score}%</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="bg-red-900 bg-opacity-30 border border-red-500 p-4 rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                    <X size={24} className="text-red-500" />
                    <div>
                        <h3 className="text-lg font-bold text-red-400">{result.overallVerdict}</h3>
                        <p className="text-red-300 text-sm">{result.testCasesPassed}/{result.totalTestCases} test cases passed</p>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                        <span className="text-gray-400">Runtime:</span>
                        <span className="ml-2 text-white">{result.totalExecutionTime}ms</span>
                    </div>
                    <div>
                        <span className="text-gray-400">Score:</span>
                        <span className="ml-2 text-white">{result.score}%</span>
                    </div>
                    <div>
                        <span className="text-gray-400">Memory:</span>
                        <span className="ml-2 text-white">{Math.max(...result.testCaseResults.map(r => r.memoryUsage))}KB</span>
                    </div>
                </div>
            </div>
            {failedTestCases.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-red-400">Failed Test Cases:</h4>
                    {failedTestCases.map((testCase, index) => (
                        <div key={testCase.testCaseId} className="bg-gray-900 border border-red-500 p-4 rounded">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                    <X size={16} className="text-red-500" />
                                    <span className="text-sm text-red-400 font-medium">Test Case Failed</span>
                                </div>
                                <div className="flex space-x-4 text-xs text-gray-400">
                                    <span>{testCase.executionTime}ms</span>
                                    <span>{testCase.memoryUsage}KB</span>
                                </div>
                            </div>
                            <div className="text-xs text-gray-400 space-y-2 font-mono">
                                <div>
                                    <span className="text-gray-300">Input:</span>
                                    <div className="bg-gray-800 p-2 mt-1 rounded text-gray-300">
                                        {testCase.input}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-gray-300">Expected:</span>
                                    <div className="bg-gray-800 p-2 mt-1 rounded text-green-400">
                                        {testCase.expectedOutput}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-gray-300">Your Output:</span>
                                    <div className="bg-gray-800 p-2 mt-1 rounded text-red-400">
                                        {testCase.actualOutput || 'No output'}
                                    </div>
                                </div>
                                {testCase.errorMessage && (
                                    <div>
                                        <span className="text-red-400">Error:</span>
                                        <div className="bg-red-900 bg-opacity-20 p-2 mt-1 rounded text-red-300">
                                            {testCase.errorMessage}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SubmissionResultDisplay;