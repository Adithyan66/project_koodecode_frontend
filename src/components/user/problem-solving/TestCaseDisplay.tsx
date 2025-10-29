import React from 'react';
import { Check, X } from 'lucide-react';
import type { SampleTestCase } from '../../../types/problem';

interface TestCaseDisplayProps {
    activeTestCase: number;
    setActiveTestCase: (index: number) => void;
    sampleTestCases: SampleTestCase[];
    getTestCaseStatus: (testCaseId: string) => 'passed' | 'failed' | 'neutral';
}

const TestCaseDisplay: React.FC<TestCaseDisplayProps> = ({ activeTestCase, setActiveTestCase, sampleTestCases, getTestCaseStatus }) => {

    
    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
                {sampleTestCases.map((testCase, index) => {
                    const status = getTestCaseStatus(testCase.id);
                    const isActive = activeTestCase === index + 1;
                    return (
                        <button
                            key={index}
                            onClick={() => setActiveTestCase(index + 1)}
                            className={`relative px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 flex items-center space-x-1.5 group ${
                                isActive
                                    ? status === 'passed' 
                                        ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md shadow-green-500/30 scale-105'
                                        : status === 'failed' 
                                            ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md shadow-red-500/30 scale-105'
                                            : 'bg-gray-700 text-white shadow-md shadow-gray-600/20 scale-105'
                                    : status === 'passed' 
                                        ? 'bg-green-900/30 text-green-300 hover:bg-green-800/40 border border-green-600/50 hover:border-green-500'
                                        : status === 'failed' 
                                            ? 'bg-red-900/30 text-red-300 hover:bg-red-800/40 border border-red-600/50 hover:border-red-500'
                                            : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700 border border-gray-600/30 hover:border-gray-500'
                            }`}
                        >
                            <span>Case {index + 1}</span>
                            {status === 'passed' && (
                                <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <Check size={11} className="text-green-400" />
                                </div>
                            )}
                            {status === 'failed' && (
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
            {sampleTestCases[activeTestCase - 1] && (
                <div className="space-y-3">
                    {Object.entries(sampleTestCases[activeTestCase - 1].inputs).map(([key, value]) => (
                        <div key={key} className="group">
                            <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1.5 font-semibold">
                                {key}
                            </label>
                            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-2.5 rounded-md border border-gray-700/50 shadow-inner group-hover:border-gray-600/70 transition-colors">
                                <pre className="text-emerald-400 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words">
                                    {typeof value === 'string' ? value : JSON.stringify(value)}
                                </pre>
                            </div>
                        </div>
                    ))}
                    <div className="group">
                        <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1.5 font-semibold flex items-center space-x-2">
                            <span>Expected Output</span>
                            <div className="flex-1 h-px bg-gradient-to-r from-gray-600 to-transparent" />
                        </label>
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-2.5 rounded-md border border-blue-500/30 shadow-inner group-hover:border-blue-500/50 transition-colors">
                            <pre className="text-blue-400 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words">
                                {typeof sampleTestCases[activeTestCase - 1].expectedOutput === 'string'
                                    ? sampleTestCases[activeTestCase - 1].expectedOutput
                                    : JSON.stringify(sampleTestCases[activeTestCase - 1].expectedOutput)}
                            </pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default TestCaseDisplay;