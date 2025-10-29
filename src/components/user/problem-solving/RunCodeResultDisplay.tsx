import React, { useState } from 'react';
import { Check, X, AlertCircle, Eye } from 'lucide-react';
import type { RunCodeResponse } from '../../../types/problem';

interface RunCodeResultDisplayProps {
    result: RunCodeResponse;
}

const RunCodeResultDisplay: React.FC<RunCodeResultDisplayProps> = ({ result }) => {
    const [activeTestCase, setActiveTestCase] = useState(1);
    const [showTestCases, setShowTestCases] = useState(false);
    
    const hasError = result.status === 'error';

    if (hasError && !showTestCases) {
        return (
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-5 rounded-xl border border-gray-700/50 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                            <AlertCircle size={20} className="text-red-400" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-red-400">{result.verdict}</h3>
                            <span className="text-xs text-gray-400">Sample Test Run</span>
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
                        {result.testCaseResults[0]?.errorMessage || 'An error occurred'}
                    </pre>
                </div>
                <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                        <span className="text-gray-500">Score:</span>
                        <span className="ml-2 text-white font-medium">{result.score}%</span>
                    </div>
                    <div>
                        <span className="text-gray-500">Time:</span>
                        <span className="ml-2 text-white font-medium">{result.totalTime}ms</span>
                    </div>
                    <div>
                        <span className="text-gray-500">Memory:</span>
                        <span className="ml-2 text-white font-medium">{result.maxMemory}KB</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
        

            <div className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                    {result.testCaseResults.map((testCase, index) => {
                        const isActive = activeTestCase === index + 1;
                        const isPassed = testCase.status === 'passed';
                        const isFailed = testCase.status === 'failed';
                        const isError = testCase.status === 'error';
                        
                        return (
                            <button
                                key={testCase.testCaseId}
                                onClick={() => setActiveTestCase(index + 1)}
                                className={`relative px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 flex items-center space-x-1.5 group ${
                                    isActive
                                        ? isPassed
                                            ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md shadow-green-500/30 scale-105'
                                            : (isFailed || isError)
                                                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md shadow-red-500/30 scale-105'
                                                : 'bg-gray-700 text-white shadow-md shadow-gray-600/20 scale-105'
                                        : isPassed
                                            ? 'bg-green-900/30 text-green-300 hover:bg-green-800/40 border border-green-600/50 hover:border-green-500'
                                            : (isFailed || isError)
                                                ? 'bg-red-900/30 text-red-300 hover:bg-red-800/40 border border-red-600/50 hover:border-red-500'
                                                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700 border border-gray-600/30 hover:border-gray-500'
                                }`}
                            >
                                <span>Case {index + 1}</span>
                                {isPassed && (
                                    <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center">
                                        <Check size={11} className="text-green-400" />
                                    </div>
                                )}
                                {(isFailed || isError) && (
                                    <div className="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center">
                                        <X size={11} className="text-red-400" />
                                    </div>
                                )}
                                {isActive && (
                                    <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-white/80 rounded-full" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {result.testCaseResults[activeTestCase - 1] && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs text-gray-400 px-1">
                            <span className="font-medium">Test Case {activeTestCase}</span>
                            <div className="flex space-x-3">
                                <span>{result.testCaseResults[activeTestCase - 1].executionTime}ms</span>
                                <span>{result.testCaseResults[activeTestCase - 1].memoryUsage}KB</span>
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1.5 font-semibold">
                                Input
                            </label>
                            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-2.5 rounded-md border border-gray-700/50 shadow-inner group-hover:border-gray-600/70 transition-colors">
                                <pre className="text-emerald-400 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words">
                                    {result.testCaseResults[activeTestCase - 1].input}
                                </pre>
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1.5 font-semibold">
                                Expected Output
                            </label>
                            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-2.5 rounded-md border border-blue-500/30 shadow-inner group-hover:border-blue-500/50 transition-colors">
                                <pre className="text-blue-400 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words">
                                    {result.testCaseResults[activeTestCase - 1].expectedOutput}
                                </pre>
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1.5 font-semibold">
                                Your Output
                            </label>
                            <div className={`bg-gradient-to-br from-gray-900 to-gray-800 p-2.5 rounded-md border shadow-inner group-hover:border-opacity-70 transition-colors ${
                                result.testCaseResults[activeTestCase - 1].status === 'passed'
                                    ? 'border-green-500/30 group-hover:border-green-500/50'
                                    : 'border-red-500/30 group-hover:border-red-500/50'
                            }`}>
                                <pre className={`font-mono text-xs leading-relaxed whitespace-pre-wrap break-words ${
                                    result.testCaseResults[activeTestCase - 1].status === 'passed'
                                        ? 'text-green-400'
                                        : 'text-red-400'
                                }`}>
                                    {result.testCaseResults[activeTestCase - 1].actualOutput || 'No output'}
                                </pre>
                            </div>
                        </div>

                        {result.testCaseResults[activeTestCase - 1].errorMessage && (
                            <div className="group">
                                <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1.5 font-semibold">
                                    Error Message
                                </label>
                                <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-2.5 rounded-md border border-gray-700/50 shadow-inner group-hover:border-gray-600/70 transition-colors">
                                    <pre className="text-red-300 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words">
                                        {result.testCaseResults[activeTestCase - 1].errorMessage}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RunCodeResultDisplay;