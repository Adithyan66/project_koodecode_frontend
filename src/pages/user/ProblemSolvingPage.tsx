



import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, User, Menu } from 'lucide-react';
import Navbar from '../../components/user/Navbar';

interface TestResult {
    input: string;
    output: string;
    expected: string;
    passed: boolean;
}

const ProblemSolvingPage: React.FC = () => {
    const [selectedLanguage, setSelectedLanguage] = useState('javascript');
    const [code, setCode] = useState(`/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
};`);

    const [testResults, setTestResults] = useState<Record<string, TestResult>>({
        case1: {
            input: 'nums = [2,7,11,15], target = 9',
            output: '[0,1]',
            expected: '[0,1]',
            passed: true
        },
        case2: {
            input: 'nums = [3,2,4], target = 6',
            output: '[1,2]',
            expected: '[1,2]',
            passed: true
        },
        case3: {
            input: 'nums = [3,3], target = 6',
            output: '[0,1]',
            expected: '[0,1]',
            passed: true
        }
    });

    const [activeTab, setActiveTab] = useState('testcase');
    const [activeTestCase, setActiveTestCase] = useState(1);
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const editorRef = useRef<any>(null);

    const languages = [
        { value: 'javascript', label: 'JavaScript' },
        { value: 'python', label: 'Python' },
        { value: 'java', label: 'Java' },
        { value: 'cpp', label: 'C++' },
        { value: 'c', label: 'C' },
        { value: 'csharp', label: 'C#' },
        { value: 'go', label: 'Go' },
        { value: 'rust', label: 'Rust' },
        { value: 'typescript', label: 'TypeScript' }
    ];

    const codeTemplates: Record<string, string> = {
        javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Your code here
};`,
        python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Your code here
        pass`,
        java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
        return new int[0];
    }
}`,
        cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your code here
        return {};
    }
};`,
        typescript: `function twoSum(nums: number[], target: number): number[] {
    // Your code here
    return [];
}`
    };

    const testCases = [
        { nums: '[2,3,6,4]', target: '4' },
        { nums: '[3,2,4]', target: '6' },
        { nums: '[3,3]', target: '6' }
    ];

    const handleEditorDidMount = (editor: any) => {
        editorRef.current = editor;
    };

    const handleLanguageChange = (newLanguage: string) => {
        setSelectedLanguage(newLanguage);
        setCode(codeTemplates[newLanguage] || '');
    };

    const runCode = async () => {
        setIsRunning(true);
        setActiveTab('result');

        // Simulate code execution
        setTimeout(() => {
            setIsRunning(false);
        }, 2000);
    };

    const submitCode = async () => {
        setIsSubmitting(true);

        // Simulate code submission
        setTimeout(() => {
            setIsSubmitting(false);
        }, 3000);
    };

    const resetCode = () => {
        setCode(codeTemplates[selectedLanguage] || '');
    };

    return (
        <div className="h-screen bg-gray-900 text-white flex flex-col">

            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                {/* Left Panel - Problem Description */}
                <div className="w-1/2 bg-black border-r border-gray-700 overflow-y-auto">
                    <div className="p-6">
                        {/* Problem Header */}
                        <div className="flex items-center space-x-3 mb-4">
                            <span className="px-2 py-1 bg-green-600 text-white text-xs rounded font-medium">Easy</span>
                            <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded font-medium">AI Assist</span>
                        </div>

                        <h1 className="text-2xl font-bold mb-6">1. Two Sum</h1>

                        {/* Problem Description */}
                        <div className="space-y-4 text-gray-300 leading-relaxed">
                            <p>
                                Given an array of integers <code className="bg-gray-700 px-2 py-1 rounded text-green-400">nums</code> and an integer <code className="bg-gray-700 px-2 py-1 rounded text-green-400">target</code>,
                                return indices of the two numbers such that they add up to <code className="bg-gray-700 px-2 py-1 rounded text-green-400">target</code>.
                            </p>

                            <p>
                                You may assume that each input would have exactly one solution, and you may not use the same element twice.
                            </p>

                            <p>You can return the answer in any order.</p>

                            {/* Examples */}
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold mb-4 text-white">Example 1:</h3>
                                <div className="bg-gray-900 p-4 rounded-lg border-l-4 border-green-500">
                                    <p className="mb-2"><strong className="text-white">Input:</strong> nums = [2,7,11,15], target = 9</p>
                                    <p className="mb-2"><strong className="text-white">Output:</strong> [0,1]</p>
                                    <p><strong className="text-white">Explanation:</strong> Because nums[0] + nums[1] = 9, we return [0, 1].</p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-4 text-white">Example 2:</h3>
                                <div className="bg-gray-900 p-4 rounded-lg border-l-4 border-green-500">
                                    <p className="mb-2"><strong className="text-white">Input:</strong> nums = [3,2,4], target = 6</p>
                                    <p><strong className="text-white">Output:</strong> [1,2]</p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-4 text-white">Example 3:</h3>
                                <div className="bg-gray-900 p-4 rounded-lg border-l-4 border-green-500">
                                    <p className="mb-2"><strong className="text-white">Input:</strong> nums = [3,3], target = 6</p>
                                    <p><strong className="text-white">Output:</strong> [0,1]</p>
                                </div>
                            </div>

                            {/* Constraints */}
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold mb-4 text-white">Constraints:</h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-400">
                                    <li>2 ≤ nums.length ≤ 10⁴</li>
                                    <li>-10⁹ ≤ nums[i] ≤ 10⁹</li>
                                    <li>-10⁹ ≤ target ≤ 10⁹</li>
                                    <li><strong className="text-green-400">Only one valid answer exists.</strong></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Code Editor */}
                <div className="w-1/2 flex flex-col">
                    {/* Language Selector and Controls */}
                    <div className="bg-black border-b border-gray-700 px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <select
                                value={selectedLanguage}
                                onChange={(e) => handleLanguageChange(e.target.value)}
                                className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                {languages.map(lang => (
                                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                                ))}
                            </select>
                            <button
                                onClick={resetCode}
                                className="p-2 text-gray-400 hover:text-white transition-colors"
                                title="Reset Code"
                            >
                                <RotateCcw size={16} />
                            </button>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center text-green-500 text-sm">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                <span>Solved</span>
                            </div>
                        </div>
                    </div>

                    {/* Monaco Code Editor */}
                    <div className="flex-1">
                        <Editor
                            height="100%"
                            language={selectedLanguage}
                            theme="vs-dark"
                            value={code}
                            onChange={(value) => setCode(value || '')}
                            onMount={handleEditorDidMount}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                lineNumbers: 'on',
                                roundedSelection: false,
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                tabSize: 4,
                                insertSpaces: true,
                                wordWrap: 'on',
                                contextmenu: false,
                                copyWithSyntaxHighlighting: false,
                            }}
                        />
                    </div>

                    {/* Bottom Panel - Test Cases */}
                    <div className="h-64 bg-black border-t border-gray-700 flex flex-col">
                        {/* Tab Navigation */}
                        <div className="flex border-b border-gray-700">
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
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 p-4 overflow-y-auto">
                            {activeTab === 'testcase' && (
                                <div className="space-y-4">
                                    <div className="flex space-x-2">
                                        {[1, 2, 3].map((num) => (
                                            <button
                                                key={num}
                                                onClick={() => setActiveTestCase(num)}
                                                className={`px-3 py-1 text-sm rounded transition-colors ${activeTestCase === num
                                                    ? 'bg-gray-700 text-white'
                                                    : 'bg-gray-600 text-gray-300 hover:bg-gray-700'
                                                    }`}
                                            >
                                                Case {num}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2 font-medium">nums =</label>
                                            <div className="bg-gray-900 p-3 rounded border text-green-400 font-mono text-sm">
                                                {testCases[activeTestCase - 1]?.nums}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2 font-medium">Target =</label>
                                            <div className="bg-gray-900 p-3 rounded border text-green-400 font-mono text-sm">
                                                {testCases[activeTestCase - 1]?.target}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'result' && (
                                <div className="space-y-4">
                                    {isRunning ? (
                                        <div className="flex items-center space-x-2 text-yellow-500">
                                            <div className="animate-spin w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full"></div>
                                            <span className="text-sm">Running...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center space-x-2 text-green-500">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span className="text-sm font-medium">Accepted</span>
                                            </div>

                                            <div className="space-y-3">
                                                {Object.entries(testResults).map(([key, result], index) => (
                                                    <div key={key} className="bg-gray-900 p-4 rounded border">
                                                        <div className="flex items-center space-x-2 mb-3">
                                                            <span className="text-sm text-gray-400 font-medium">Case {index + 1}</span>
                                                            <div className={`w-2 h-2 rounded-full ${result.passed ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                            <span className={`text-xs ${result.passed ? 'text-green-500' : 'text-red-500'}`}>
                                                                {result.passed ? 'Passed' : 'Failed'}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-gray-400 space-y-1 font-mono">
                                                            <div>Input: <span className="text-gray-300">{result.input}</span></div>
                                                            <div>Output: <span className="text-green-400">{result.output}</span></div>
                                                            <div>Expected: <span className="text-green-400">{result.expected}</span></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="bg-gray-800 border-t border-gray-700 px-4 py-4 flex justify-end space-x-3">
                        <button
                            onClick={runCode}
                            disabled={isRunning}
                            className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded text-sm font-medium transition-colors"
                        >
                            <Play size={16} />
                            <span>{isRunning ? 'Running...' : 'Run'}</span>
                        </button>
                        <button
                            onClick={submitCode}
                            disabled={isSubmitting}
                            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded text-sm font-medium transition-colors"
                        >
                            <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
                        </button>
                    </div>

                    {/* Status Bar */}
                    <div className="bg-gray-900 border-t border-gray-700 px-4 py-2 flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-400">63.7k</span>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-green-500">364 Online</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProblemSolvingPage;