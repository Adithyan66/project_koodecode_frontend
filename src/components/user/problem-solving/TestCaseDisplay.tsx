import React from 'react';
import { Check, X } from 'lucide-react';
import type { SampleTestCase } from '../../../types/problem';

interface TestCaseDisplayProps {
    activeTestCase: number;
    setActiveTestCase: (index: number) => void;
    sampleTestCases: SampleTestCase[];
    getTestCaseStatus: (testCaseId: string) => 'passed' | 'failed' | 'neutral';
}

const TestCaseDisplay: React.FC<TestCaseDisplayProps> = ({ activeTestCase, setActiveTestCase, sampleTestCases, getTestCaseStatus }) => (
    <div className="space-y-4">
        <div className="flex space-x-2">
            {sampleTestCases.map((testCase, index) => {
                const status = getTestCaseStatus(testCase.id);
                return (
                    <button
                        key={index}
                        onClick={() => setActiveTestCase(index + 1)}
                        className={`px-3 py-1 text-sm rounded transition-colors flex items-center space-x-2 ${activeTestCase === index + 1
                            ? status === 'passed' ? 'bg-green-700 text-white border border-green-500'
                                : status === 'failed' ? 'bg-red-700 text-white border border-red-500'
                                    : 'bg-gray-700 text-white'
                            : status === 'passed' ? 'bg-green-900 text-green-300 hover:bg-green-800 border border-green-600'
                                : status === 'failed' ? 'bg-red-900 text-red-300 hover:bg-red-800 border border-red-600'
                                    : 'bg-gray-600 text-gray-300 hover:bg-gray-700'
                            }`}
                    >
                        <span>Case {index + 1}</span>
                        {status === 'passed' && <Check size={12} className="text-green-400" />}
                        {status === 'failed' && <X size={12} className="text-red-400" />}
                    </button>
                );
            })}
        </div>
        {sampleTestCases[activeTestCase - 1] && (
            <div className="space-y-4">
                {Object.entries(sampleTestCases[activeTestCase - 1].inputs).map(([key, value]) => (
                    <div key={key}>
                        <label className="block text-sm text-gray-400 mb-2 font-medium">{key} =</label>
                        <div className="bg-gray-900 p-3 rounded border text-green-400 font-mono text-sm">
                            {typeof value === 'string' ? value : JSON.stringify(value)}
                        </div>
                    </div>
                ))}
                <div>
                    <label className="block text-sm text-gray-400 mb-2 font-medium">Expected Output =</label>
                    <div className="bg-gray-900 p-3 rounded border text-green-400 font-mono text-sm">
                        {typeof sampleTestCases[activeTestCase - 1].expectedOutput === 'string'
                            ? sampleTestCases[activeTestCase - 1].expectedOutput
                            : JSON.stringify(sampleTestCases[activeTestCase - 1].expectedOutput)}
                    </div>
                </div>
            </div>
        )}
    </div>
);

export default TestCaseDisplay;