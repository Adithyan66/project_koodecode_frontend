import React from 'react';
import { Check, X } from 'lucide-react';
import type { RunCodeResponse } from '../../../types/problem';

interface RunCodeResultDisplayProps {
    result: RunCodeResponse;
}

const RunCodeResultDisplay: React.FC<RunCodeResultDisplayProps> = ({ result }) => (
    <div className="space-y-4">
        <div className="bg-gray-900 p-4 rounded border">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${result.verdict === 'Accepted' ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                    <span className={`font-medium ${result.verdict === 'Accepted' ? 'text-green-500' : 'text-red-500'
                        }`}>
                        {result.verdict}
                    </span>
                    <span className="text-gray-400 text-sm">
                        ({result.passedTestCases}/{result.totalTestCases} passed)
                    </span>
                </div>
                <div className="text-xs text-gray-400">
                    Sample Test Run
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                    <span className="text-gray-400">Score:</span>
                    <span className="ml-2 text-white">{result.score}%</span>
                </div>
                <div>
                    <span className="text-gray-400">Time:</span>
                    <span className="ml-2 text-white">{result.totalTime}ms</span>
                </div>
                <div>
                    <span className="text-gray-400">Memory:</span>
                    <span className="ml-2 text-white">{result.maxMemory}KB</span>
                </div>
            </div>
        </div>
        <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-300">Individual Results:</h4>
            {result.testCaseResults.map((testCase, index) => (
                <div key={testCase.testCaseId} className={`bg-gray-900 p-4 rounded border ${testCase.status === 'passed' ? 'border-green-500 border-opacity-30' : 'border-red-500 border-opacity-30'
                    }`}>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-400 font-medium">Case {index + 1}</span>
                            {testCase.status === 'passed' ? (
                                <Check size={16} className="text-green-500" />
                            ) : (
                                <X size={16} className="text-red-500" />
                            )}
                            <span className={`text-xs ${testCase.status === 'passed' ? 'text-green-500' : 'text-red-500'
                                }`}>
                                {testCase.status.charAt(0).toUpperCase() + testCase.status.slice(1)}
                            </span>
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
                            <div className={`bg-gray-800 p-2 mt-1 rounded ${testCase.status === 'passed' ? 'text-green-400' : 'text-red-400'
                                }`}>
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
    </div>
);

export default RunCodeResultDisplay;