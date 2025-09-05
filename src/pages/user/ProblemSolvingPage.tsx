





// import React, { useState, useEffect, useRef } from 'react';
// import Editor from '@monaco-editor/react';
// import { Play, RotateCcw, User, Menu } from 'lucide-react';
// import Navbar from '../../components/user/Navbar';
// import httpClient from '../../services/axios/httpClient';
// import { useLocation, useParams } from 'react-router-dom';

// interface TestResult {
//     input: string;
//     output: string;
//     expected: string;
//     passed: boolean;
// }

// interface TestCase {
//     nums: string;
//     target: string;
// }

// interface ProblemData {
//     title: string;
//     problemNumber:number;
//     difficulty: string;
//     description: string;
//     examples: Array<{
//         input: string;
//         expectedOutput: string;
//         explanation?: string;
//     }>;
//     constraints: string[];
//     testCases: TestCase[];
//     codeTemplates: Record<string, string>;
// }

// const ProblemSolvingPage: React.FC = () => {


//     const [selectedLanguage, setSelectedLanguage] = useState('javascript');
//     const [code, setCode] = useState('');
//     const [problemData, setProblemData] = useState<ProblemData | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
//     const [activeTab, setActiveTab] = useState('testcase');
//     const [activeTestCase, setActiveTestCase] = useState(1);
//     const [isRunning, setIsRunning] = useState(false);
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const editorRef = useRef<any>(null);

//     const {problemId} = useParams()


//     const languages = [
//         { value: 'javascript', label: 'JavaScript' },
//         { value: 'python', label: 'Python' },
//         { value: 'java', label: 'Java' },
//         { value: 'cpp', label: 'C++' },
//         { value: 'c', label: 'C' },
//         { value: 'csharp', label: 'C#' },
//         { value: 'go', label: 'Go' },
//         { value: 'rust', label: 'Rust' },
//         { value: 'typescript', label: 'TypeScript' }
//     ];

//     // Default code templates (fallback if not provided by API)
//     const defaultCodeTemplates: Record<string, string> = {
//         javascript: `/**
//  * @param {number[]} nums
//  * @param {number} target
//  * @return {number[]}
//  */
// var twoSum = function(nums, target) {
//     // Your code here
// };`,
//         python: `class Solution:
//     def twoSum(self, nums: List[int], target: int) -> List[int]:
//         # Your code here
//         pass`,
//         java: `class Solution {
//     public int[] twoSum(int[] nums, int target) {
//         // Your code here
//         return new int[0];
//     }
// }`,
//         cpp: `class Solution {
// public:
//     vector<int> twoSum(vector<int>& nums, int target) {
//         // Your code here
//         return {};
//     }
// };`,
//         typescript: `function twoSum(nums: number[], target: number): number[] {
//     // Your code here
//     return [];
// }`
//     };

//     useEffect(() => {
//         const fetchProblemData = async () => {
//             setLoading(true);
//             setError(null);

//             try {
//                 const response = await httpClient.get(`user/problems/${problemId}/detail`);

//                 if (!response.data.success) {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }

//                 const { data } = response.data;
//                 setProblemData(data);
//                 console.log("problem data ", data);

//                 // Set initial code based on API response or fallback to default
//                 const templates = data.codeTemplates || defaultCodeTemplates;
//                 setCode(templates[selectedLanguage] || templates.javascript || '');

//             } catch (err: any) {
//                 setError(err.message || 'Failed to fetch problem data');
//                 console.error('Error fetching problem data:', err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchProblemData();
//     }, []);

//     const handleEditorDidMount = (editor: any) => {
//         editorRef.current = editor;
//     };

//     const handleLanguageChange = (newLanguage: string) => {
//         setSelectedLanguage(newLanguage);
//         const templates = problemData?.codeTemplates || defaultCodeTemplates;
//         setCode(templates[newLanguage] || templates.javascript || '');
//     };

//     const runCode = async () => {
//         setIsRunning(true);
//         setActiveTab('result');

//         try {
//             // Here you would send the code to your backend for execution
//             const response = await fetch('http://localhost:3000/api/user/problems/run', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     problemId: '68ac8804f1be441b31bbe1fe',
//                     code,
//                     language: selectedLanguage
//                 })
//             });

//             if (response.ok) {
//                 const results = await response.json();
//                 console.log("problems", results);

//                 setTestResults(results.testResults || {});
//             }
//         } catch (err) {
//             console.error('Error running code:', err);
//         } finally {
//             setIsRunning(false);
//         }
//     };

//     const submitCode = async () => {
//         setIsSubmitting(true);

//         try {
//             // Here you would send the code to your backend for submission
//             const response = await fetch('http://localhost:3000/api/user/problems/submit', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     problemId: '68ac8804f1be441b31bbe1fe',
//                     code,
//                     language: selectedLanguage
//                 })
//             });

//             if (response.ok) {
//                 const result = await response.json();
//                 // Handle submission result
//                 console.log('Submission result:', result);
//             }
//         } catch (err) {
//             console.error('Error submitting code:', err);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const resetCode = () => {
//         const templates = problemData?.codeTemplates || defaultCodeTemplates;
//         setCode(templates[selectedLanguage] || templates.javascript || '');
//     };

//     // Loading spinner component
//     const LoadingSpinner = () => (
//         <div className="flex justify-center items-center h-screen bg-gray-900">
//             <div className="flex flex-col items-center">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
//                 <p className="text-white mt-4 text-lg">Loading problem data...</p>
//             </div>
//         </div>
//     );

//     // Error component
//     const ErrorDisplay = ({ message }: { message: string }) => (
//         <div className="flex justify-center items-center h-screen bg-gray-900">
//             <div className="text-center">
//                 <div className="text-red-500 text-6xl mb-4">⚠️</div>
//                 <h2 className="text-white text-2xl mb-2">Error Loading Problem</h2>
//                 <p className="text-gray-400 mb-4">{message}</p>
//                 <button
//                     onClick={() => window.location.reload()}
//                     className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
//                 >
//                     Retry
//                 </button>
//             </div>
//         </div>
//     );

//     if (loading) {
//         return <LoadingSpinner />;
//     }

//     if (error) {
//         return <ErrorDisplay message={error} />;
//     }

//     if (!problemData) {
//         return <ErrorDisplay message="No problem data available" />;
//     }

//     return (
//         <div className="h-screen bg-gray-900 text-white flex flex-col">
//             <Navbar />

//             <div className="flex flex-1 overflow-hidden">
//                 {/* Left Panel - Problem Description */}
//                 <div className="w-1/2 bg-black border-r border-gray-700 overflow-y-auto">
//                     <div className="p-6">
//                         {/* Problem Header */}
//                         <div className="flex items-center space-x-3 mb-4">
//                             <span className={`px-2 py-1 text-white text-xs rounded font-medium ${
//                                 problemData.difficulty.toLowerCase() === 'easy' ? 'bg-green-600' :
//                                 problemData.difficulty.toLowerCase() === 'medium' ? 'bg-yellow-600' :
//                                 'bg-red-600'
//                             }`}>
//                                 {problemData.difficulty}
//                             </span>
//                             <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded font-medium">AI Assist</span>
//                         </div>

//                         <h1 className="text-2xl font-bold mb-6 text-white">{problemData.problemNumber}. {problemData.title}</h1>

//                         {/* Problem Description */}
//                         <div className="space-y-4 text-gray-300 leading-relaxed">
//                             <div dangerouslySetInnerHTML={{ __html: problemData.description }} />

//                             {/* Examples */}
//                             {problemData.examples && problemData.examples.map((example, index) => (
//                                 <div key={index} className="mt-8">
//                                     <h3 className="text-lg font-semibold mb-4 text-white">Example {index + 1}:</h3>
//                                     <div className=" p-4 rounded-lg border-l-4 border-gray-500">
//                                         <p className="mb-2"><strong className="text-white">Input :</strong> {example.input}</p>
//                                         <p className="mb-2"><strong className="text-white">Output:</strong> {example.expectedOutput}</p>
//                                         {example.explanation && (
//                                             <p><strong className="text-white">Explanation:</strong> {example.explanation}</p>
//                                         )}
//                                     </div>
//                                 </div>
//                             ))}

//                             {/* Constraints */}
//                             {problemData.constraints && problemData.constraints.length > 0 && (
//                                 <div className="mt-8">
//                                     <h3 className="text-lg font-semibold mb-4 text-white">Constraints:</h3>
//                                     <ul className="list-disc list-inside space-y-2 text-gray-400">
//                                         {problemData.constraints.map((constraint, index) => (
//                                             <li key={index}>{constraint}</li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Right Panel - Code Editor */}
//                 <div className="w-1/2 flex flex-col">
//                     {/* Language Selector and Controls */}
//                     <div className="bg-black border-b border-gray-700 px-4 py-3 flex items-center justify-between">
//                         <div className="flex items-center space-x-4">
//                             <select
//                                 value={selectedLanguage}
//                                 onChange={(e) => handleLanguageChange(e.target.value)}
//                                 className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
//                             >
//                                 {languages.map(lang => (
//                                     <option key={lang.value} value={lang.value}>{lang.label}</option>
//                                 ))}
//                             </select>
//                             <button
//                                 onClick={resetCode}
//                                 className="p-2 text-gray-400 hover:text-white transition-colors"
//                                 title="Reset Code"
//                             >
//                                 <RotateCcw size={16} />
//                             </button>
//                         </div>
//                     </div>

//                     {/* Monaco Code Editor */}
//                     <div className="flex-1">
//                         <Editor
//                             height="100%"
//                             language={selectedLanguage}
//                             theme="vs-dark"
//                             value={code}
//                             onChange={(value) => setCode(value || '')}
//                             onMount={handleEditorDidMount}
//                             options={{
//                                 minimap: { enabled: false },
//                                 fontSize: 14,
//                                 lineNumbers: 'on',
//                                 roundedSelection: false,
//                                 scrollBeyondLastLine: false,
//                                 automaticLayout: true,
//                                 tabSize: 4,
//                                 insertSpaces: true,
//                                 wordWrap: 'on',
//                                 contextmenu: false,
//                                 copyWithSyntaxHighlighting: false,
//                             }}
//                         />
//                     </div>

//                     {/* Bottom Panel - Test Cases */}
//                     <div className="h-64 bg-black border-t border-gray-700 flex flex-col">
//                         {/* Tab Navigation */}
//                         <div className="flex border-b border-gray-700">
//                             <button
//                                 onClick={() => setActiveTab('testcase')}
//                                 className={`px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'testcase'
//                                     ? 'text-white border-b-2 border-green-500 bg-gray-700'
//                                     : 'text-gray-400 hover:text-white hover:bg-gray-700'
//                                     }`}
//                             >
//                                 Testcase
//                             </button>
//                             <button
//                                 onClick={() => setActiveTab('result')}
//                                 className={`px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'result'
//                                     ? 'text-white border-b-2 border-green-500 bg-gray-700'
//                                     : 'text-gray-400 hover:text-white hover:bg-gray-700'
//                                     }`}
//                             >
//                                 Test Result
//                             </button>
//                         </div>

//                         {/* Tab Content */}
//                         <div className="flex-1 p-4 overflow-y-auto">
//                             {activeTab === 'testcase' && (
//                                 <div className="space-y-4">
//                                     <div className="flex space-x-2">
//                                         {problemData.testCases && problemData.testCases.map((_, index) => (
//                                             <button
//                                                 key={index}
//                                                 onClick={() => setActiveTestCase(index + 1)}
//                                                 className={`px-3 py-1 text-sm rounded transition-colors ${activeTestCase === index + 1
//                                                     ? 'bg-gray-700 text-white'
//                                                     : 'bg-gray-600 text-gray-300 hover:bg-gray-700'
//                                                     }`}
//                                             >
//                                                 Case {index + 1}
//                                             </button>
//                                         ))}
//                                     </div>

//                                     {problemData.testCases && problemData.testCases[activeTestCase - 1] && (
//                                         <div className="space-y-4">
//                                             <div>
//                                                 <label className="block text-sm text-gray-400 mb-2 font-medium">nums =</label>
//                                                 <div className="bg-gray-900 p-3 rounded border text-green-400 font-mono text-sm">
//                                                     {problemData.testCases[activeTestCase - 1].nums}
//                                                 </div>
//                                             </div>

//                                             <div>
//                                                 <label className="block text-sm text-gray-400 mb-2 font-medium">Target =</label>
//                                                 <div className="bg-gray-900 p-3 rounded border text-green-400 font-mono text-sm">
//                                                     {problemData.testCases[activeTestCase - 1].target}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             )}

//                             {activeTab === 'result' && (
//                                 <div className="space-y-4">
//                                     {isRunning ? (
//                                         <div className="flex items-center space-x-2 text-yellow-500">
//                                             <div className="animate-spin w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full"></div>
//                                             <span className="text-sm">Running tests...</span>
//                                         </div>
//                                     ) : (
//                                         <div className="space-y-3">
//                                             {Object.keys(testResults).length > 0 ? (
//                                                 Object.entries(testResults).map(([key, result], index) => (
//                                                     <div key={key} className="bg-gray-900 p-4 rounded border">
//                                                         <div className="flex items-center space-x-2 mb-3">
//                                                             <span className="text-sm text-gray-400 font-medium">Case {index + 1}</span>
//                                                             <div className={`w-2 h-2 rounded-full ${result.passed ? 'bg-green-500' : 'bg-red-500'}`}></div>
//                                                             <span className={`text-xs ${result.passed ? 'text-green-500' : 'text-red-500'}`}>
//                                                                 {result.passed ? 'Passed' : 'Failed'}
//                                                             </span>
//                                                         </div>
//                                                         <div className="text-xs text-gray-400 space-y-1 font-mono">
//                                                             <div>Input: <span className="text-gray-300">{result.input}</span></div>
//                                                             <div>Output: <span className="text-green-400">{result.output}</span></div>
//                                                             <div>Expected: <span className="text-green-400">{result.expected}</span></div>
//                                                         </div>
//                                                     </div>
//                                                 ))
//                                             ) : (
//                                                 <div className="text-gray-400 text-sm">No test results yet. Click "Run" to execute your code.</div>
//                                             )}
//                                         </div>
//                                     )}
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="bg-gray-800 border-t border-gray-700 px-4 py-4 flex justify-end space-x-3">
//                         <button
//                             onClick={runCode}
//                             disabled={isRunning}
//                             className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded text-sm font-medium transition-colors"
//                         >
//                             <Play size={16} />
//                             <span>{isRunning ? 'Running...' : 'Run'}</span>
//                         </button>
//                         <button
//                             onClick={submitCode}
//                             disabled={isSubmitting}
//                             className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded text-sm font-medium transition-colors"
//                         >
//                             <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ProblemSolvingPage;










import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, User, Menu, Heart, ThumbsUp, Users, CheckCircle } from 'lucide-react';
import Navbar from '../../components/user/Navbar';
import httpClient from '../../services/axios/httpClient';
import { useLocation, useParams } from 'react-router-dom';

interface TestResult {
    input: string;
    output: string;
    expected: string;
    passed: boolean;
}

interface Parameter {
    name: string;
    type: string;
    description?: string;
    _id?: string;
}

interface Constraint {
    parameterName: string;
    type: string;
    minValue?: number;
    maxValue?: number;
    _id?: string;
}

interface Example {
    input: string;
    output: any;
    explanation?: string;
    isSample: boolean;
}

interface SampleTestCase {
    problemId: string;
    inputs: Record<string, any>;
    expectedOutput: any;
    isSample: boolean;
    id: string;
    createdAt: string;
    updatedAt: string;
}

interface ProblemData {
    problemNumber: number;
    title: string;
    slug: string;
    difficulty: string;
    tags: string[];
    description: string;
    constraints: Constraint[];
    examples: Example[];
    likes: string[];
    totalSubmissions: number;
    acceptedSubmissions: number;
    hints: string[];
    companies: string[];
    isActive: boolean;
    createdBy: string;
    functionName: string;
    returnType: string;
    parameters: Parameter[];
    id: string;
    createdAt: string;
    updatedAt: string;
}

interface ApiResponse {
    success: boolean;
    message: string;
    data: {
        problem: ProblemData;
        sampleTestCases: SampleTestCase[];
    };
}

const ProblemSolvingPage: React.FC = () => {
    const [selectedLanguage, setSelectedLanguage] = useState('javascript');
    const [code, setCode] = useState('');
    const [problemData, setProblemData] = useState<ProblemData | null>(null);
    const [sampleTestCases, setSampleTestCases] = useState<SampleTestCase[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
    const [activeTab, setActiveTab] = useState('testcase');
    const [activeTestCase, setActiveTestCase] = useState(1);
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showHints, setShowHints] = useState(false);

    const editorRef = useRef<any>(null);
    const { problemId } = useParams();

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

    // Generate code templates dynamically based on problem data
    const generateCodeTemplates = (problem: ProblemData): Record<string, string> => {
        const { functionName, returnType, parameters } = problem;
        
        // Convert return type mappings
        const getLanguageType = (type: string, language: string): string => {
            const typeMap: Record<string, Record<string, string>> = {
                javascript: {
                    'number': 'number',
                    'string': 'string',
                    'boolean': 'boolean',
                    'array': 'Array',
                    'object': 'Object'
                },
                typescript: {
                    'number': 'number',
                    'string': 'string', 
                    'boolean': 'boolean',
                    'array': 'number[]',
                    'object': 'object'
                },
                python: {
                    'number': 'int',
                    'string': 'str',
                    'boolean': 'bool',
                    'array': 'List[int]',
                    'object': 'dict'
                },
                java: {
                    'number': 'int',
                    'string': 'String',
                    'boolean': 'boolean',
                    'array': 'int[]',
                    'object': 'Object'
                },
                cpp: {
                    'number': 'int',
                    'string': 'string',
                    'boolean': 'bool',
                    'array': 'vector<int>',
                    'object': 'map<string,int>'
                }
            };
            return typeMap[language]?.[type] || type;
        };

        const paramList = parameters.map(p => `${getLanguageType(p.type, 'temp')} ${p.name}`).join(', ');
        const jsParamList = parameters.map(p => `{${getLanguageType(p.type, 'javascript')}} ${p.name}`).join(', ');

        return {
            javascript: `/**
 * @param ${parameters.map(p => `{${getLanguageType(p.type, 'javascript')}} ${p.name}`).join('\n * @param ')}
 * @return {${getLanguageType(returnType, 'javascript')}}
 */
var ${functionName} = function(${parameters.map(p => p.name).join(', ')}) {
    // Your code here
};`,

            typescript: `function ${functionName}(${parameters.map(p => `${p.name}: ${getLanguageType(p.type, 'typescript')}`).join(', ')}): ${getLanguageType(returnType, 'typescript')} {
    // Your code here
    ${returnType === 'number' ? 'return 0;' : returnType === 'string' ? 'return "";' : returnType === 'boolean' ? 'return false;' : 'return null;'}
}`,

            python: `class Solution:
    def ${functionName}(self, ${parameters.map(p => `${p.name}: ${getLanguageType(p.type, 'python')}`).join(', ')}) -> ${getLanguageType(returnType, 'python')}:
        # Your code here
        ${returnType === 'number' ? 'return 0' : returnType === 'string' ? 'return ""' : returnType === 'boolean' ? 'return False' : 'pass'}`,

            java: `class Solution {
    public ${getLanguageType(returnType, 'java')} ${functionName}(${parameters.map(p => `${getLanguageType(p.type, 'java')} ${p.name}`).join(', ')}) {
        // Your code here
        ${returnType === 'number' ? 'return 0;' : returnType === 'string' ? 'return "";' : returnType === 'boolean' ? 'return false;' : 'return null;'}
    }
}`,

            cpp: `class Solution {
public:
    ${getLanguageType(returnType, 'cpp')} ${functionName}(${parameters.map(p => `${getLanguageType(p.type, 'cpp')}& ${p.name}`).join(', ')}) {
        // Your code here
        ${returnType === 'number' ? 'return 0;' : returnType === 'string' ? 'return "";' : returnType === 'boolean' ? 'return false;' : 'return {};'}
    }
};`,

            c: `${getLanguageType(returnType, 'cpp')} ${functionName}(${parameters.map(p => `${getLanguageType(p.type, 'cpp')} ${p.name}`).join(', ')}) {
    // Your code here
    ${returnType === 'number' ? 'return 0;' : returnType === 'string' ? 'return "";' : returnType === 'boolean' ? 'return false;' : 'return NULL;'}
}`,

            csharp: `public class Solution {
    public ${getLanguageType(returnType, 'java')} ${functionName.charAt(0).toUpperCase() + functionName.slice(1)}(${parameters.map(p => `${getLanguageType(p.type, 'java')} ${p.name}`).join(', ')}) {
        // Your code here
        ${returnType === 'number' ? 'return 0;' : returnType === 'string' ? 'return "";' : returnType === 'boolean' ? 'return false;' : 'return null;'}
    }
}`,

            go: `func ${functionName}(${parameters.map(p => `${p.name} ${getLanguageType(p.type, 'cpp')}`).join(', ')}) ${getLanguageType(returnType, 'cpp')} {
    // Your code here
    ${returnType === 'number' ? 'return 0' : returnType === 'string' ? 'return ""' : returnType === 'boolean' ? 'return false' : 'return nil'}
}`,

            rust: `impl Solution {
    pub fn ${functionName}(${parameters.map(p => `${p.name}: ${getLanguageType(p.type, 'cpp')}`).join(', ')}) -> ${getLanguageType(returnType, 'cpp')} {
        // Your code here
        ${returnType === 'number' ? '0' : returnType === 'string' ? 'String::new()' : returnType === 'boolean' ? 'false' : 'vec![]'}
    }
}`
        };
    };

    // Convert constraint objects to readable strings
    const formatConstraints = (constraints: Constraint[]): string[] => {
        return constraints.map(constraint => {
            let formatted = '';
            
            if (constraint.minValue !== undefined && constraint.maxValue !== undefined) {
                formatted = `${constraint.minValue} <= ${constraint.parameterName} <= ${constraint.maxValue}`;
            } else if (constraint.minValue !== undefined) {
                formatted = `${constraint.parameterName} >= ${constraint.minValue}`;
            } else if (constraint.maxValue !== undefined) {
                formatted = `${constraint.parameterName} <= ${constraint.maxValue}`;
            } else {
                formatted = `${constraint.parameterName} is of type ${constraint.type}`;
            }
            
            return formatted;
        });
    };

    // Calculate acceptance rate
    const getAcceptanceRate = (accepted: number, total: number): string => {
        if (total === 0) return '0%';
        return `${((accepted / total) * 100).toFixed(1)}%`;
    };

    useEffect(() => {
        const fetchProblemData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await httpClient.get(`user/problems/${problemId}/detail`);

                if (!response.data.success) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const { data }: { data: ApiResponse['data'] } = response.data;
                setProblemData(data.problem);
                setSampleTestCases(data.sampleTestCases || []);
                console.log("problem data ", data);

                // Generate code templates dynamically
                const templates = generateCodeTemplates(data.problem);
                setCode(templates[selectedLanguage] || templates.javascript || '');

            } catch (err: any) {
                setError(err.message || 'Failed to fetch problem data');
                console.error('Error fetching problem data:', err);
            } finally {
                setLoading(false);
            }
        };

        if (problemId) {
            fetchProblemData();
        }
    }, [problemId]);

    const handleEditorDidMount = (editor: any) => {
        editorRef.current = editor;
    };

    const handleLanguageChange = (newLanguage: string) => {
        setSelectedLanguage(newLanguage);
        if (problemData) {
            const templates = generateCodeTemplates(problemData);
            setCode(templates[newLanguage] || templates.javascript || '');
        }
    };

    const runCode = async () => {
        setIsRunning(true);
        setActiveTab('result');

        try {
            const response = await fetch('http://localhost:3000/api/user/problems/run', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    problemId: problemId,
                    code,
                    language: selectedLanguage
                })
            });

            if (response.ok) {
                const results = await response.json();
                console.log("problems", results);
                setTestResults(results.testResults || {});
            }
        } catch (err) {
            console.error('Error running code:', err);
        } finally {
            setIsRunning(false);
        }
    };

    const submitCode = async () => {
        setIsSubmitting(true);

        try {
            const response = await fetch('http://localhost:3000/api/user/problems/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    problemId: problemId,
                    code,
                    language: selectedLanguage
                })
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Submission result:', result);
            }
        } catch (err) {
            console.error('Error submitting code:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetCode = () => {
        if (problemData) {
            const templates = generateCodeTemplates(problemData);
            setCode(templates[selectedLanguage] || templates.javascript || '');
        }
    };

    // Loading and Error components remain the same
    const LoadingSpinner = () => (
        <div className="flex justify-center items-center h-screen bg-gray-900">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                <p className="text-white mt-4 text-lg">Loading problem data...</p>
            </div>
        </div>
    );

    const ErrorDisplay = ({ message }: { message: string }) => (
        <div className="flex justify-center items-center h-screen bg-gray-900">
            <div className="text-center">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h2 className="text-white text-2xl mb-2">Error Loading Problem</h2>
                <p className="text-gray-400 mb-4">{message}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                >
                    Retry
                </button>
            </div>
        </div>
    );

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorDisplay message={error} />;
    }

    if (!problemData) {
        return <ErrorDisplay message="No problem data available" />;
    }

    const formattedConstraints = formatConstraints(problemData.constraints);
    const acceptanceRate = getAcceptanceRate(problemData.acceptedSubmissions, problemData.totalSubmissions);

    return (
        <div className="h-screen bg-gray-900 text-white flex flex-col">
            <Navbar />

            <div className="flex flex-1 overflow-hidden">
                {/* Left Panel - Problem Description */}
                <div className="w-1/2 bg-black border-r border-gray-700 overflow-y-auto">
                    <div className="p-6">
                        {/* Problem Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <span className={`px-2 py-1 text-white text-xs rounded font-medium ${
                                    problemData.difficulty.toLowerCase() === 'easy' ? 'bg-green-600' :
                                    problemData.difficulty.toLowerCase() === 'medium' ? 'bg-yellow-600' :
                                    'bg-red-600'
                                }`}>
                                    {problemData.difficulty}
                                </span>
                                <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded font-medium">AI Assist</span>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                                <div className="flex items-center space-x-1">
                                    <ThumbsUp size={14} />
                                    <span>{problemData.likes?.length || 0}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Users size={14} />
                                    <span>{problemData.totalSubmissions}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <CheckCircle size={14} />
                                    <span>{acceptanceRate}</span>
                                </div>
                            </div>
                        </div>

                        <h1 className="text-2xl font-bold mb-2 text-white">
                            {problemData.problemNumber}. {problemData.title}
                        </h1>

                        {/* Function Signature */}
                        <div className="mb-6 p-3 bg-gray-800 rounded border-l-4 border-blue-500">
                            <div className="text-sm text-gray-400 mb-1">Function Signature:</div>
                            <code className="text-green-400 font-mono text-sm">
                                {problemData.functionName}({problemData.parameters.map(p => `${p.name}: ${p.type}`).join(', ')}) → {problemData.returnType}
                            </code>
                        </div>

                        {/* Tags */}
                        {problemData.tags && problemData.tags.length > 0 && (
                            <div className="mb-4 flex flex-wrap gap-2">
                                {problemData.tags.map((tag, index) => (
                                    <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Companies */}
                        {problemData.companies && problemData.companies.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold mb-2 text-gray-400">Companies:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {problemData.companies.map((company, index) => (
                                        <span key={index} className="px-2 py-1 bg-blue-900 text-blue-300 text-xs rounded">
                                            {company}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Problem Description */}
                        <div className="space-y-4 text-gray-300 leading-relaxed">
                            <div dangerouslySetInnerHTML={{ __html: problemData.description }} />

                            {/* Examples */}
                            {problemData.examples && problemData.examples.map((example, index) => (
                                <div key={index} className="mt-8">
                                    <h3 className="text-lg font-semibold mb-4 text-white">Example {index + 1}:</h3>
                                    <div className="p-4 rounded-lg border-l-4 border-gray-500 bg-gray-800">
                                        <p className="mb-2"><strong className="text-white">Input:</strong> {example.input}</p>
                                        <p className="mb-2"><strong className="text-white">Output:</strong> {example.output}</p>
                                        {example.explanation && (
                                            <p><strong className="text-white">Explanation:</strong> {example.explanation}</p>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Constraints */}
                            {formattedConstraints && formattedConstraints.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold mb-4 text-white">Constraints:</h3>
                                    <ul className="list-disc list-inside space-y-2 text-gray-400">
                                        {formattedConstraints.map((constraint, index) => (
                                            <li key={index} className="font-mono text-sm">{constraint}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Hints */}
                            {problemData.hints && problemData.hints.length > 0 && (
                                <div className="mt-8">
                                    <button
                                        onClick={() => setShowHints(!showHints)}
                                        className="text-lg font-semibold mb-4 text-white hover:text-yellow-400 transition-colors"
                                    >
                                        💡 Hints ({problemData.hints.length}) {showHints ? '▼' : '▶'}
                                    </button>
                                    {showHints && (
                                        <div className="space-y-2">
                                            {problemData.hints.map((hint, index) => (
                                                <div key={index} className="p-3 bg-yellow-900 bg-opacity-20 border-l-4 border-yellow-500 rounded">
                                                    <p className="text-yellow-200 text-sm">{hint}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
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
                                        {sampleTestCases.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setActiveTestCase(index + 1)}
                                                className={`px-3 py-1 text-sm rounded transition-colors ${activeTestCase === index + 1
                                                    ? 'bg-gray-700 text-white'
                                                    : 'bg-gray-600 text-gray-300 hover:bg-gray-700'
                                                    }`}
                                            >
                                                Case {index + 1}
                                            </button>
                                        ))}
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
                            )}

                            {activeTab === 'result' && (
                                <div className="space-y-4">
                                    {isRunning ? (
                                        <div className="flex items-center space-x-2 text-yellow-500">
                                            <div className="animate-spin w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full"></div>
                                            <span className="text-sm">Running tests...</span>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {Object.keys(testResults).length > 0 ? (
                                                Object.entries(testResults).map(([key, result], index) => (
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
                                                ))
                                            ) : (
                                                <div className="text-gray-400 text-sm">No test results yet. Click "Run" to execute your code.</div>
                                            )}
                                        </div>
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
                </div>
            </div>
        </div>
    );
};

export default ProblemSolvingPage;
