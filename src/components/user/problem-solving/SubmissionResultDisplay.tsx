import React, { useState } from 'react';
import { CheckCircle, X, AlertCircle, Eye, Trophy } from 'lucide-react';
import type { SubmissionResponse } from '../../../types/problem';

interface SubmissionResultDisplayProps {
    result: SubmissionResponse;
}

const SubmissionResultDisplay: React.FC<SubmissionResultDisplayProps> = ({ result }) => {
    const [activeTestCase, setActiveTestCase] = useState(1);
    const [showTestCases, setShowTestCases] = useState(false);
    const failedTestCases = result.testCaseResults.filter(tc => tc.status !== 'passed' && tc.status !== 'error');
    const hasError = result.testCaseResults.some(tc => tc.status === 'error');

    if (result.overallVerdict === 'Accepted') {
        return (
            <div className="space-y-4">
                <div className="bg-gradient-to-br from-green-950/50 to-green-900/30 border border-green-500/50 p-8 rounded-xl text-center shadow-2xl">
                    <div className="flex justify-center mb-4 relative">
                        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                            <Trophy size={48} className="text-green-400" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-12 h-12 bg-green-500/10 rounded-full animate-ping"></div>
                    </div>
                    <h3 className="text-2xl font-bold text-green-400 mb-2">Accepted!</h3>
                    <p className="text-green-300 mb-6">Your solution passed all test cases</p>
                    <div className="grid grid-cols-3 gap-4 text-sm bg-green-950/30 rounded-lg p-4">
                        <div>
                            <span className="text-gray-400 block mb-1">Test Cases</span>
                            <div className="text-white font-bold text-lg">{result.testCasesPassed}/{result.totalTestCases}</div>
                        </div>
                        <div>
                            <span className="text-gray-400 block mb-1">Runtime</span>
                            <div className="text-white font-bold text-lg">{result.totalExecutionTime}ms</div>
                        </div>
                        <div>
                            <span className="text-gray-400 block mb-1">Score</span>
                            <div className="text-green-400 font-bold text-lg">{result.score}%</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (hasError && !showTestCases) {
        const errorTestCase = result.testCaseResults.find(tc => tc.status === 'error');
        return (
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-5 rounded-xl border border-gray-700/50 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                            <AlertCircle size={20} className="text-red-400" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-red-400">{result.overallVerdict}</h3>
                            <p className="text-gray-400 text-xs">{result.testCasesPassed}/{result.totalTestCases} test cases passed</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowTestCases(true)}
                        className="flex items-center space-x-1.5 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg transition-all text-xs font-medium"
                    >
                        <Eye size={14} />
                        <span>View Test Cases</span>
                    </button>
                </div>
                <div className="bg-gray-950/50 p-3 rounded-lg border border-gray-700/30 mb-3">
                    <pre className="text-red-300 text-xs font-mono whitespace-pre-wrap break-words leading-relaxed">
                        {errorTestCase?.errorMessage || 'An error occurred'}
                    </pre>
                </div>
                <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                        <span className="text-gray-500">Score:</span>
                        <span className="ml-2 text-white font-medium">{result.score}%</span>
                    </div>
                    <div>
                        <span className="text-gray-500">Time:</span>
                        <span className="ml-2 text-white font-medium">{result.totalExecutionTime}ms</span>
                    </div>
                    <div>
                        <span className="text-gray-500">Memory:</span>
                        <span className="ml-2 text-white font-medium">{Math.max(...result.testCaseResults.map(r => r.memoryUsage))}KB</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-5 rounded-xl border border-gray-700/50 shadow-lg">
                <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                        <X size={20} className="text-red-400" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-red-400">{result.overallVerdict}</h3>
                            <span className="text-xs text-gray-400">Full Submission</span>
                        </div>
                        <p className="text-gray-400 text-xs">{result.testCasesPassed}/{result.totalTestCases} test cases passed</p>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                        <span className="text-gray-500">Runtime:</span>
                        <span className="ml-2 text-white font-medium">{result.totalExecutionTime}ms</span>
                    </div>
                    <div>
                        <span className="text-gray-500">Score:</span>
                        <span className="ml-2 text-white font-medium">{result.score}%</span>
                    </div>
                    <div>
                        <span className="text-gray-500">Memory:</span>
                        <span className="ml-2 text-white font-medium">{Math.max(...result.testCaseResults.map(r => r.memoryUsage))}KB</span>
                    </div>
                </div>
            </div>

            {failedTestCases.length > 0 && (
                <div className="space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                        {failedTestCases.map((testCase, index) => {
                            const isActive = activeTestCase === index + 1;
                            
                            return (
                                <button
                                    key={testCase.testCaseId}
                                    onClick={() => setActiveTestCase(index + 1)}
                                    className={`relative px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 flex items-center space-x-1.5 group ${
                                        isActive
                                            ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md shadow-red-500/30 scale-105'
                                            : 'bg-red-900/30 text-red-300 hover:bg-red-800/40 border border-red-600/50 hover:border-red-500'
                                    }`}
                                >
                                    <span>Failed Case {index + 1}</span>
                                    <div className="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center">
                                        <X size={11} className="text-red-400" />
                                    </div>
                                    {isActive && (
                                        <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-white/80 rounded-full" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {failedTestCases[activeTestCase - 1] && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs text-gray-400 px-1">
                                <span className="font-medium">Failed Test Case {activeTestCase}</span>
                                <div className="flex space-x-3">
                                    <span>{failedTestCases[activeTestCase - 1].executionTime}ms</span>
                                    <span>{failedTestCases[activeTestCase - 1].memoryUsage}KB</span>
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1.5 font-semibold">
                                    Input
                                </label>
                                <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-2.5 rounded-md border border-gray-700/50 shadow-inner group-hover:border-gray-600/70 transition-colors">
                                    <pre className="text-emerald-400 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words">
                                        {failedTestCases[activeTestCase - 1].input}
                                    </pre>
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1.5 font-semibold">
                                    Expected Output
                                </label>
                                <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-2.5 rounded-md border border-blue-500/30 shadow-inner group-hover:border-blue-500/50 transition-colors">
                                    <pre className="text-blue-400 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words">
                                        {failedTestCases[activeTestCase - 1].expectedOutput}
                                    </pre>
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1.5 font-semibold">
                                    Your Output
                                </label>
                                <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-2.5 rounded-md border border-red-500/30 shadow-inner group-hover:border-red-500/50 transition-colors">
                                    <pre className="text-red-400 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words">
                                        {failedTestCases[activeTestCase - 1].actualOutput || 'No output'}
                                    </pre>
                                </div>
                            </div>

                            {failedTestCases[activeTestCase - 1].errorMessage && (
                                <div className="group">
                                    <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1.5 font-semibold">
                                        Error Message
                                    </label>
                                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-2.5 rounded-md border border-gray-700/50 shadow-inner group-hover:border-gray-600/70 transition-colors">
                                        <pre className="text-red-300 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words">
                                            {failedTestCases[activeTestCase - 1].errorMessage}
                                        </pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SubmissionResultDisplay;