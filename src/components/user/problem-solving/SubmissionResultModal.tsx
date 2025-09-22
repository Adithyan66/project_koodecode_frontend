
import React from 'react';
import { CheckCircle, X } from 'lucide-react';
import type { ContestSubmissionData } from '../../../types/contest-problems';

interface SubmissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    submissionData: ContestSubmissionData;
}

const SubmissionResultModal: React.FC<SubmissionModalProps> = ({ isOpen, onClose, submissionData }) => {
    if (!isOpen) return null;

    const { result, attemptNumber, penaltyApplied, totalScore, message } = submissionData;
    const isAccepted = result.overallVerdict === 'Accepted';
    const remainingAttempts = message.match(/(\d+)\s+attempt\(s\)\s+remaining/)?.[1] || '0';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden">
                <div className={`p-6 border-b border-gray-700 ${isAccepted ? 'bg-gradient-to-r from-green-900 to-green-800' : 'bg-gradient-to-r from-red-900 to-red-800'}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            {isAccepted ? (
                                <CheckCircle size={32} className="text-green-400" />
                            ) : (
                                <X size={32} className="text-red-400" />
                            )}
                            <div>
                                <h2 className="text-2xl font-bold text-white">{result.overallVerdict}</h2>
                                <p className="text-gray-300">Submission #{result.id.slice(-8)}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors p-2"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>
                <div className="overflow-y-auto max-h-[70vh] p-6 space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-800 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-white mb-1">{result.testCasesPassed}/{result.totalTestCases}</div>
                            <div className="text-sm text-gray-400">Test Cases</div>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-white mb-1">{result.score}</div>
                            <div className="text-sm text-gray-400">Score</div>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-white mb-1">{attemptNumber}</div>
                            <div className="text-sm text-gray-400">Attempt</div>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg text-center">
                            <div className={`text-2xl font-bold mb-1 ${totalScore >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {totalScore >= 0 ? '+' : ''}{totalScore}
                            </div>
                            <div className="text-sm text-gray-400">Total Score</div>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <span className="text-gray-400">Language:</span>
                                <div className="text-white font-medium capitalize">{result.language.name}</div>
                            </div>
                            <div>
                                <span className="text-gray-400">Penalty Applied:</span>
                                <div className="text-red-400 font-medium">-{penaltyApplied}</div>
                            </div>
                            <div>
                                <span className="text-gray-400">Attempts Remaining:</span>
                                <div className="text-yellow-400 font-medium">{remainingAttempts}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-white mb-3">Performance</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-400">Execution Time:</span>
                                <div className="text-white font-medium">{result.totalExecutionTime}ms</div>
                            </div>
                            <div>
                                <span className="text-gray-400">Memory Usage:</span>
                                <div className="text-white font-medium">{Math.max(...result.testCaseResults.map(r => r.memoryUsage || 0))}KB</div>
                            </div>
                        </div>
                    </div>
                    <div className={`p-4 rounded-lg border-l-4 ${isAccepted ? 'bg-green-900 bg-opacity-30 border-green-500' : 'bg-red-900 bg-opacity-30 border-red-500'}`}>
                        <p className={`font-medium ${isAccepted ? 'text-green-300' : 'text-red-300'}`}>{message}</p>
                    </div>
                    {!isAccepted && result.testCaseResults.some(tc => tc.status === 'error' || tc.status === 'failed') && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white">Failed Test Cases</h3>
                            <div className="space-y-3">
                                {result.testCaseResults
                                    .filter(tc => tc.status === 'error' || tc.status === 'failed')
                                    .slice(0, 3)
                                    .map((testCase, index) => (
                                        <div key={testCase.testCaseId} className="bg-gray-800 border border-red-500 border-opacity-30 p-4 rounded-lg">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center space-x-2">
                                                    <X size={16} className="text-red-500" />
                                                    <span className="text-sm text-red-400 font-medium">Test Case {index + 1} Failed</span>
                                                </div>
                                                <div className="flex space-x-4 text-xs text-gray-400">
                                                    <span>{testCase.executionTime}ms</span>
                                                    <span>{testCase.memoryUsage}KB</span>
                                                </div>
                                            </div>
                                            <div className="text-xs space-y-2 font-mono">
                                                <div>
                                                    <span className="text-gray-300">Input:</span>
                                                    <div className="bg-gray-900 p-2 mt-1 rounded text-gray-300">{testCase.input}</div>
                                                </div>
                                                <div>
                                                    <span className="text-gray-300">Expected:</span>
                                                    <div className="bg-gray-900 p-2 mt-1 rounded text-green-400">{testCase.expectedOutput}</div>
                                                </div>
                                                <div>
                                                    <span className="text-gray-300">Your Output:</span>
                                                    <div className="bg-gray-900 p-2 mt-1 rounded text-red-400">{testCase.actualOutput || 'No output'}</div>
                                                </div>
                                                {testCase.errorMessage && (
                                                    <div>
                                                        <span className="text-red-400">Error:</span>
                                                        <div className="bg-red-900 bg-opacity-20 p-2 mt-1 rounded text-red-300">{testCase.errorMessage}</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                {result.testCaseResults.filter(tc => tc.status === 'error' || tc.status === 'failed').length > 3 && (
                                    <div className="text-center text-gray-400 text-sm">
                                        ... and {result.testCaseResults.filter(tc => tc.status === 'error' || tc.status === 'failed').length - 3} more failed test cases
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {isAccepted && (
                        <div className="bg-green-900 bg-opacity-30 border border-green-500 p-6 rounded-lg text-center">
                            <div className="text-green-400 text-lg font-semibold mb-2">🎉 Congratulations!</div>
                            <p className="text-green-300">Your solution passed all test cases successfully!</p>
                        </div>
                    )}
                </div>
                <div className="border-t border-gray-700 p-6 bg-gray-800">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-400">Submitted: {new Date(result.submittedAt).toLocaleString()}</div>
                        <div className="flex space-x-3">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
                            >
                                Close
                            </button>
                            {!isAccepted && parseInt(remainingAttempts) > 0 && (
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                                >
                                    Try Again
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmissionResultModal;