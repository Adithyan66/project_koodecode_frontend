


// import React, { useState, useEffect, useRef } from 'react';
// import Editor from '@monaco-editor/react';
// import { Play, RotateCcw, User, Menu, Heart, ThumbsUp, Users, CheckCircle, X, Check } from 'lucide-react';
// import Navbar from '../../components/user/Navbar';
// import httpClient from '../../services/axios/httpClient';
// import { useLocation, useParams } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// // Updated interfaces based on your API response
// interface TestCaseResult {
//     testCaseId: string;
//     input: string;
//     expectedOutput: string;
//     actualOutput: string;
//     status: 'passed' | 'failed' | 'error';
//     executionTime: number;
//     memoryUsage: number;
//     judge0Token: string;
//     errorMessage: string | null;
// }

// interface RunCodeResponse {
//     verdict: string;
//     status: string;
//     score: number;
//     totalTime: number;
//     maxMemory: number;
//     testCaseResults: TestCaseResult[];
//     totalTestCases: number;
//     passedTestCases: number;
//     failedTestCases: number;
// }

// interface SubmissionResponse {
//     id: string;
//     language: {
//         id: number;
//         name: string;
//     };
//     overallVerdict: string;
//     problemId: string;
//     score: number;
//     status: string;
//     submittedAt: string;
//     testCaseResults: TestCaseResult[];
//     testCasesPassed: number;
//     totalExecutionTime: number;
//     totalTestCases: number;
//     userId: string;
// }

// interface Parameter {
//     name: string;
//     type: string;
//     description?: string;
//     _id?: string;
// }

// interface Constraint {
//     parameterName: string;
//     type: string;
//     minValue?: number;
//     maxValue?: number;
//     _id?: string;
// }

// interface Example {
//     input: string;
//     output: any;
//     explanation?: string;
//     isSample: boolean;
// }

// interface SampleTestCase {
//     problemId: string;
//     inputs: Record<string, any>;
//     expectedOutput: any;
//     isSample: boolean;
//     id: string;
//     createdAt: string;
//     updatedAt: string;
// }

// interface ProblemData {
//     problemNumber: number;
//     title: string;
//     slug: string;
//     difficulty: string;
//     tags: string[];
//     description: string;
//     constraints: Constraint[];
//     examples: Example[];
//     likes: string[];
//     totalSubmissions: number;
//     acceptedSubmissions: number;
//     hints: string[];
//     companies: string[];
//     isActive: boolean;
//     createdBy: string;
//     functionName: string;
//     returnType: string;
//     parameters: Parameter[];
//     id: string;
//     createdAt: string;
//     updatedAt: string;
// }

// interface ApiResponse {
//     success: boolean;
//     message: string;
//     data: {
//         problem: ProblemData;
//         sampleTestCases: SampleTestCase[];
//     };
// }

// const ProblemSolvingPage: React.FC = () => {
//     const [selectedLanguage, setSelectedLanguage] = useState('javascript');
//     const [code, setCode] = useState('');
//     const [problemData, setProblemData] = useState<ProblemData | null>(null);
//     const [sampleTestCases, setSampleTestCases] = useState<SampleTestCase[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
    
//     const [runCodeResults, setRunCodeResults] = useState<RunCodeResponse | null>(null);
//     const [submissionResults, setSubmissionResults] = useState<SubmissionResponse | null>(null);
    
//     const [activeTab, setActiveTab] = useState('testcase');
//     const [activeTestCase, setActiveTestCase] = useState(1);
//     const [isRunning, setIsRunning] = useState(false);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [showHints, setShowHints] = useState(false);

//     const editorRef = useRef<any>(null);
//     const { slug } = useParams();

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

//     // Generate code templates dynamically based on problem data
//     const generateCodeTemplates = (problem: ProblemData): Record<string, string> => {
//         const { functionName, returnType, parameters } = problem;

//         // Convert return type mappings
//         const getLanguageType = (type: string, language: string): string => {
//             const typeMap: Record<string, Record<string, string>> = {
//                 javascript: {
//                     'number': 'number',
//                     'string': 'string',
//                     'boolean': 'boolean',
//                     'array': 'Array',
//                     'object': 'Object'
//                 },
//                 typescript: {
//                     'number': 'number',
//                     'string': 'string',
//                     'boolean': 'boolean',
//                     'array': 'number[]',
//                     'object': 'object'
//                 },
//                 python: {
//                     'number': 'int',
//                     'string': 'str',
//                     'boolean': 'bool',
//                     'array': 'List[int]',
//                     'object': 'dict'
//                 },
//                 java: {
//                     'number': 'int',
//                     'string': 'String',
//                     'boolean': 'boolean',
//                     'array': 'int[]',
//                     'object': 'Object'
//                 },
//                 cpp: {
//                     'number': 'int',
//                     'string': 'string',
//                     'boolean': 'bool',
//                     'array': 'vector<int>',
//                     'object': 'map<string,int>'
//                 }
//             };
//             return typeMap[language]?.[type] || type;
//         };

//         const paramList = parameters.map(p => `${getLanguageType(p.type, 'temp')} ${p.name}`).join(', ');
//         const jsParamList = parameters.map(p => `{${getLanguageType(p.type, 'javascript')}} ${p.name}`).join(', ');

//         return {
//             javascript: `/**
//  * @param ${parameters.map(p => `{${getLanguageType(p.type, 'javascript')}} ${p.name}`).join('\n * @param ')}
//  * @return {${getLanguageType(returnType, 'javascript')}}
//  */
// var ${functionName} = function(${parameters.map(p => p.name).join(', ')}) {
//     // Your code here
// };`,

//             typescript: `function ${functionName}(${parameters.map(p => `${p.name}: ${getLanguageType(p.type, 'typescript')}`).join(', ')}): ${getLanguageType(returnType, 'typescript')} {
//     // Your code here
//     ${returnType === 'number' ? 'return 0;' : returnType === 'string' ? 'return "";' : returnType === 'boolean' ? 'return false;' : 'return null;'}
// }`,

//             python: `class Solution:
//     def ${functionName}(self, ${parameters.map(p => `${p.name}: ${getLanguageType(p.type, 'python')}`).join(', ')}) -> ${getLanguageType(returnType, 'python')}:
//         # Your code here
//         ${returnType === 'number' ? 'return 0' : returnType === 'string' ? 'return ""' : returnType === 'boolean' ? 'return False' : 'pass'}`,

//             java: `class Solution {
//     public ${getLanguageType(returnType, 'java')} ${functionName}(${parameters.map(p => `${getLanguageType(p.type, 'java')} ${p.name}`).join(', ')}) {
//         // Your code here
//         ${returnType === 'number' ? 'return 0;' : returnType === 'string' ? 'return "";' : returnType === 'boolean' ? 'return false;' : 'return null;'}
//     }
// }`,

//             cpp: `class Solution {
// public:
//     ${getLanguageType(returnType, 'cpp')} ${functionName}(${parameters.map(p => `${getLanguageType(p.type, 'cpp')}& ${p.name}`).join(', ')}) {
//         // Your code here
//         ${returnType === 'number' ? 'return 0;' : returnType === 'string' ? 'return "";' : returnType === 'boolean' ? 'return false;' : 'return {};'}
//     }
// };`,

//             c: `${getLanguageType(returnType, 'cpp')} ${functionName}(${parameters.map(p => `${getLanguageType(p.type, 'cpp')} ${p.name}`).join(', ')}) {
//     // Your code here
//     ${returnType === 'number' ? 'return 0;' : returnType === 'string' ? 'return "";' : returnType === 'boolean' ? 'return false;' : 'return NULL;'}
// }`,

//             csharp: `public class Solution {
//     public ${getLanguageType(returnType, 'java')} ${functionName.charAt(0).toUpperCase() + functionName.slice(1)}(${parameters.map(p => `${getLanguageType(p.type, 'java')} ${p.name}`).join(', ')}) {
//         // Your code here
//         ${returnType === 'number' ? 'return 0;' : returnType === 'string' ? 'return "";' : returnType === 'boolean' ? 'return false;' : 'return null;'}
//     }
// }`,

//             go: `func ${functionName}(${parameters.map(p => `${p.name} ${getLanguageType(p.type, 'cpp')}`).join(', ')}) ${getLanguageType(returnType, 'cpp')} {
//     // Your code here
//     ${returnType === 'number' ? 'return 0' : returnType === 'string' ? 'return ""' : returnType === 'boolean' ? 'return false' : 'return nil'}
// }`,

//             rust: `impl Solution {
//     pub fn ${functionName}(${parameters.map(p => `${p.name}: ${getLanguageType(p.type, 'cpp')}`).join(', ')}) -> ${getLanguageType(returnType, 'cpp')} {
//         // Your code here
//         ${returnType === 'number' ? '0' : returnType === 'string' ? 'String::new()' : returnType === 'boolean' ? 'false' : 'vec![]'}
//     }
// }`
//         };
//     };

//     // Convert constraint objects to readable strings
//     const formatConstraints = (constraints: Constraint[]): string[] => {
//         return constraints.map(constraint => {
//             let formatted = '';

//             if (constraint.minValue !== undefined && constraint.maxValue !== undefined) {
//                 formatted = `${constraint.minValue} <= ${constraint.parameterName} <= ${constraint.maxValue}`;
//             } else if (constraint.minValue !== undefined) {
//                 formatted = `${constraint.parameterName} >= ${constraint.minValue}`;
//             } else if (constraint.maxValue !== undefined) {
//                 formatted = `${constraint.parameterName} <= ${constraint.maxValue}`;
//             } else {
//                 formatted = `${constraint.parameterName} is of type ${constraint.type}`;
//             }

//             return formatted;
//         });
//     };

//     // Calculate acceptance rate
//     const getAcceptanceRate = (accepted: number, total: number): string => {
//         if (total === 0) return '0%';
//         return `${((accepted / total) * 100).toFixed(1)}%`;
//     };

//     useEffect(() => {
//         const fetchProblemData = async () => {
//             setLoading(true);
//             setError(null);

//             try {
//                 const response = await httpClient.get(`user/problems/${slug}/detail`);

//                 if (!response.data.success) {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }

//                 const { data }: { data: ApiResponse['data'] } = response.data;
//                 setProblemData(data.problem);
//                 setSampleTestCases(data.sampleTestCases || []);
//                 console.log("problem data ", data);

//                 // Generate code templates dynamically
//                 const templates = generateCodeTemplates(data.problem);

//                 setCode(templates[selectedLanguage] || templates.javascript || '');

//             } catch (err: any) {
//                 setError(err.message || 'Failed to fetch problem data');
//                 console.error('Error fetching problem data:', err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (slug) {
//             fetchProblemData();
//         }
//     }, [slug]);

//     const handleEditorDidMount = (editor: any) => {
//         editorRef.current = editor;
//     };

//     const handleLanguageChange = (newLanguage: string) => {
//         setSelectedLanguage(newLanguage);
//         if (problemData) {
//             const templates = generateCodeTemplates(problemData);
//             setCode(templates[newLanguage] || templates.javascript || '');
//         }
//     };

//     function getLanguageId(language: string): number | undefined {
//         switch (language.toLowerCase()) {
//             case "c":
//                 return 50;
//             case "cpp":
//             case "c++":
//                 return 54;
//             case "java":
//                 return 62;
//             case "javascript":
//             case "js":
//                 return 63;
//             case "python":
//             case "py":
//                 return 71;
//             case "typescript":
//             case "ts":
//                 return 74;
//             case "csharp":
//             case "c#":
//                 return 51;
//             case "go":
//                 return 60;
//             case "ruby":
//                 return 72;
//             case "swift":
//                 return 83;
//             case "kotlin":
//                 return 78;
//             case "php":
//                 return 68;
//             case "rust":
//                 return 73;
//             case "dart":
//                 return 85;
//             default:
//                 return undefined;
//         }
//     }

//     // Updated runCode function with correct endpoint
//     const runCode = async () => {
//         setIsRunning(true);
//         setActiveTab('result');
//         setRunCodeResults(null);

//         try {
//             // Extract sample test case IDs
//             const testCaseIds = sampleTestCases.map(tc => tc.id);
            
//             const response = await httpClient.post(`user/problems/test-case`, {
//                 problemId: problemData?.id,
//                 sourceCode: code,
//                 languageId: getLanguageId(selectedLanguage),
//                 testCases: testCaseIds // Pass the test case IDs we want to run
//             });

//             if (response.data.success) {
//                 setRunCodeResults(response.data.data);
//                 toast.success(`${response.data.data.passedTestCases}/${response.data.data.totalTestCases} test cases passed`);
//             } else {
//                 toast.error('Failed to run code');
//             }

//         } catch (err: any) {
//             console.error('Error running code:', err);
//             toast.error('Error running code: ' + (err.response?.data?.message || err.message));
//         } finally {
//             setIsRunning(false);
//         }
//     };

//     // Updated submitCode function with correct endpoint
//     const submitCode = async () => {
//         setIsSubmitting(true);
//         setSubmissionResults(null);

//         try {
//             const response = await httpClient.post(`user/problems/submit`, {
//                 problemId: problemData?.id,
//                 sourceCode: code,
//                 languageId: getLanguageId(selectedLanguage)
//             });

//             if (response.data.success) {
//                 setSubmissionResults(response.data.data);
//                 const result = response.data.data;
                
//                 if (result.overallVerdict === 'Accepted') {
//                     toast.success(`✅ Accepted! ${result.testCasesPassed}/${result.totalTestCases} test cases passed`);
//                 } else {
//                     toast.error(`❌ ${result.overallVerdict} - ${result.testCasesPassed}/${result.totalTestCases} test cases passed`);
//                 }
                
//                 // Switch to result tab to show submission results
//                 setActiveTab('result');
//             } else {
//                 toast.error('Submission failed');
//             }
//         } catch (err: any) {
//             console.error('Error submitting code:', err);
//             toast.error('Submission error: ' + (err.response?.data?.message || err.message));
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const resetCode = () => {
//         if (problemData) {
//             const templates = generateCodeTemplates(problemData);
//             setCode(templates[selectedLanguage] || templates.javascript || '');
//         }
//     };

//     // Get test case status for individual test case display
//     const getTestCaseStatus = (testCaseId: string): 'passed' | 'failed' | 'neutral' => {
//         if (!runCodeResults) return 'neutral';
//         const result = runCodeResults.testCaseResults.find(r => r.testCaseId === testCaseId);
//         return result ? result.status === 'passed' ? 'passed' : 'failed' : 'neutral';
//     };

//     // Updated result display for submissions - only show failed test cases
//     const SubmissionResultDisplay = ({ result }: { result: SubmissionResponse }) => {
//         const failedTestCases = result.testCaseResults.filter(tc => tc.status !== 'passed');
        
//         if (result.overallVerdict === 'Accepted') {
//             return (
//                 <div className="space-y-4">
//                     {/* Success UI */}
//                     <div className="bg-green-900 bg-opacity-30 border border-green-500 p-6 rounded-lg text-center">
//                         <div className="flex justify-center mb-4">
//                             <CheckCircle size={48} className="text-green-500" />
//                         </div>
//                         <h3 className="text-xl font-bold text-green-400 mb-2">Accepted!</h3>
//                         <p className="text-green-300 mb-4">Your solution passed all test cases</p>
//                         <div className="grid grid-cols-3 gap-4 text-sm">
//                             <div>
//                                 <span className="text-gray-400">Test Cases:</span>
//                                 <div className="text-white font-medium">{result.testCasesPassed}/{result.totalTestCases}</div>
//                             </div>
//                             <div>
//                                 <span className="text-gray-400">Runtime:</span>
//                                 <div className="text-white font-medium">{result.totalExecutionTime}ms</div>
//                             </div>
//                             <div>
//                                 <span className="text-gray-400">Score:</span>
//                                 <div className="text-white font-medium">{result.score}%</div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             );
//         }

//         return (
//             <div className="space-y-4">
//                 {/* Failed submission header */}
//                 <div className="bg-red-900 bg-opacity-30 border border-red-500 p-4 rounded-lg">
//                     <div className="flex items-center space-x-3 mb-3">
//                         <X size={24} className="text-red-500" />
//                         <div>
//                             <h3 className="text-lg font-bold text-red-400">{result.overallVerdict}</h3>
//                             <p className="text-red-300 text-sm">{result.testCasesPassed}/{result.totalTestCases} test cases passed</p>
//                         </div>
//                     </div>
//                     <div className="grid grid-cols-3 gap-4 text-sm">
//                         <div>
//                             <span className="text-gray-400">Runtime:</span>
//                             <span className="ml-2 text-white">{result.totalExecutionTime}ms</span>
//                         </div>
//                         <div>
//                             <span className="text-gray-400">Score:</span>
//                             <span className="ml-2 text-white">{result.score}%</span>
//                         </div>
//                         <div>
//                             <span className="text-gray-400">Memory:</span>
//                             <span className="ml-2 text-white">{Math.max(...result.testCaseResults.map(r => r.memoryUsage))}KB</span>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Show only failed test cases */}
//                 {failedTestCases.length > 0 && (
//                     <div className="space-y-3">
//                         <h4 className="text-sm font-medium text-red-400">Failed Test Cases:</h4>
//                         {failedTestCases.map((testCase, index) => (
//                             <div key={testCase.testCaseId} className="bg-gray-900 border border-red-500 p-4 rounded">
//                                 <div className="flex items-center justify-between mb-3">
//                                     <div className="flex items-center space-x-2">
//                                         <X size={16} className="text-red-500" />
//                                         <span className="text-sm text-red-400 font-medium">Test Case Failed</span>
//                                     </div>
//                                     <div className="flex space-x-4 text-xs text-gray-400">
//                                         <span>{testCase.executionTime}ms</span>
//                                         <span>{testCase.memoryUsage}KB</span>
//                                     </div>
//                                 </div>
                                
//                                 <div className="text-xs text-gray-400 space-y-2 font-mono">
//                                     <div>
//                                         <span className="text-gray-300">Input:</span>
//                                         <div className="bg-gray-800 p-2 mt-1 rounded text-gray-300">
//                                             {testCase.input}
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <span className="text-gray-300">Expected:</span>
//                                         <div className="bg-gray-800 p-2 mt-1 rounded text-green-400">
//                                             {testCase.expectedOutput}
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <span className="text-gray-300">Your Output:</span>
//                                         <div className="bg-gray-800 p-2 mt-1 rounded text-red-400">
//                                             {testCase.actualOutput || 'No output'}
//                                         </div>
//                                     </div>
//                                     {testCase.errorMessage && (
//                                         <div>
//                                             <span className="text-red-400">Error:</span>
//                                             <div className="bg-red-900 bg-opacity-20 p-2 mt-1 rounded text-red-300">
//                                                 {testCase.errorMessage}
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         );
//     };

//     // Updated result display for test case runs
//     const RunCodeResultDisplay = ({ result }: { result: RunCodeResponse }) => {
//         return (
//             <div className="space-y-4">
//                 {/* Overall Result Summary */}
//                 <div className="bg-gray-900 p-4 rounded border">
//                     <div className="flex items-center justify-between mb-3">
//                         <div className="flex items-center space-x-3">
//                             <div className={`w-3 h-3 rounded-full ${
//                                 result.verdict === 'Accepted' ? 'bg-green-500' : 'bg-red-500'
//                             }`}></div>
//                             <span className={`font-medium ${
//                                 result.verdict === 'Accepted' ? 'text-green-500' : 'text-red-500'
//                             }`}>
//                                 {result.verdict}
//                             </span>
//                             <span className="text-gray-400 text-sm">
//                                 ({result.passedTestCases}/{result.totalTestCases} passed)
//                             </span>
//                         </div>
//                         <div className="text-xs text-gray-400">
//                             Sample Test Run
//                         </div>
//                     </div>
                    
//                     <div className="grid grid-cols-3 gap-4 text-xs">
//                         <div>
//                             <span className="text-gray-400">Score:</span>
//                             <span className="ml-2 text-white">{result.score}%</span>
//                         </div>
//                         <div>
//                             <span className="text-gray-400">Time:</span>
//                             <span className="ml-2 text-white">{result.totalTime}ms</span>
//                         </div>
//                         <div>
//                             <span className="text-gray-400">Memory:</span>
//                             <span className="ml-2 text-white">{result.maxMemory}KB</span>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Individual Test Case Results */}
//                 <div className="space-y-3">
//                     <h4 className="text-sm font-medium text-gray-300">Individual Results:</h4>
//                     {result.testCaseResults.map((testCase, index) => (
//                         <div key={testCase.testCaseId} className={`bg-gray-900 p-4 rounded border ${
//                             testCase.status === 'passed' ? 'border-green-500 border-opacity-30' : 'border-red-500 border-opacity-30'
//                         }`}>
//                             <div className="flex items-center justify-between mb-3">
//                                 <div className="flex items-center space-x-2">
//                                     <span className="text-sm text-gray-400 font-medium">Case {index + 1}</span>
//                                     {testCase.status === 'passed' ? (
//                                         <Check size={16} className="text-green-500" />
//                                     ) : (
//                                         <X size={16} className="text-red-500" />
//                                     )}
//                                     <span className={`text-xs ${
//                                         testCase.status === 'passed' ? 'text-green-500' : 'text-red-500'
//                                     }`}>
//                                         {testCase.status.charAt(0).toUpperCase() + testCase.status.slice(1)}
//                                     </span>
//                                 </div>
//                                 <div className="flex space-x-4 text-xs text-gray-400">
//                                     <span>{testCase.executionTime}ms</span>
//                                     <span>{testCase.memoryUsage}KB</span>
//                                 </div>
//                             </div>
                            
//                             <div className="text-xs text-gray-400 space-y-2 font-mono">
//                                 <div>
//                                     <span className="text-gray-300">Input:</span>
//                                     <div className="bg-gray-800 p-2 mt-1 rounded text-gray-300">
//                                         {testCase.input}
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <span className="text-gray-300">Expected:</span>
//                                     <div className="bg-gray-800 p-2 mt-1 rounded text-green-400">
//                                         {testCase.expectedOutput}
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <span className="text-gray-300">Your Output:</span>
//                                     <div className={`bg-gray-800 p-2 mt-1 rounded ${
//                                         testCase.status === 'passed' ? 'text-green-400' : 'text-red-400'
//                                     }`}>
//                                         {testCase.actualOutput || 'No output'}
//                                     </div>
//                                 </div>
//                                 {testCase.errorMessage && (
//                                     <div>
//                                         <span className="text-red-400">Error:</span>
//                                         <div className="bg-red-900 bg-opacity-20 p-2 mt-1 rounded text-red-300">
//                                             {testCase.errorMessage}
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         );
//     };

//     // Loading and Error components remain the same
//     const LoadingSpinner = () => (
//         <div className="flex justify-center items-center h-screen bg-gray-900">
//             <div className="flex flex-col items-center">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
//                 <p className="text-white mt-4 text-lg">Loading problem data...</p>
//             </div>
//         </div>
//     );

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

//     const formattedConstraints = formatConstraints(problemData.constraints);
//     const acceptanceRate = getAcceptanceRate(problemData.acceptedSubmissions, problemData.totalSubmissions);

//     return (
//         <div className="h-screen bg-gray-900 text-white flex flex-col">
//             <Navbar />

//             <div className="flex flex-1 overflow-hidden">
//                 {/* Left Panel - Problem Description */}
//                 <div className="w-1/2 bg-black border-r border-gray-700 overflow-y-auto">
//                     <div className="p-6">
//                         {/* Problem Header */}
//                         <div className="flex items-center justify-between mb-4">
//                             <div className="flex items-center space-x-3">
//                                 <span className={`px-2 py-1 text-white text-xs rounded font-medium ${problemData.difficulty.toLowerCase() === 'easy' ? 'bg-green-600' :
//                                     problemData.difficulty.toLowerCase() === 'medium' ? 'bg-yellow-600' :
//                                         'bg-red-600'
//                                     }`}>
//                                     {problemData.difficulty}
//                                 </span>
//                                 <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded font-medium">AI Assist</span>
//                             </div>

//                             <div className="flex items-center space-x-4 text-sm text-gray-400">
//                                 <div className="flex items-center space-x-1">
//                                     <ThumbsUp size={14} />
//                                     <span>{problemData.likes?.length || 0}</span>
//                                 </div>
//                                 <div className="flex items-center space-x-1">
//                                     <Users size={14} />
//                                     <span>{problemData.totalSubmissions}</span>
//                                 </div>
//                                 <div className="flex items-center space-x-1">
//                                     <CheckCircle size={14} />
//                                     <span>{acceptanceRate}</span>
//                                 </div>
//                             </div>
//                         </div>

//                         <h1 className="text-2xl font-bold mb-2 text-white">
//                             {problemData.problemNumber}. {problemData.title}
//                         </h1>

//                         {/* Function Signature */}
//                         <div className="mb-6 p-3 bg-gray-800 rounded border-l-4 border-blue-500">
//                             <div className="text-sm text-gray-400 mb-1">Function Signature:</div>
//                             <code className="text-green-400 font-mono text-sm">
//                                 {problemData.functionName}({problemData.parameters.map(p => `${p.name}: ${p.type}`).join(', ')}) → {problemData.returnType}
//                             </code>
//                         </div>

//                         {/* Tags */}
//                         {problemData.tags && problemData.tags.length > 0 && (
//                             <div className="mb-4 flex flex-wrap gap-2">
//                                 {problemData.tags.map((tag, index) => (
//                                     <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
//                                         {tag}
//                                     </span>
//                                 ))}
//                             </div>
//                         )}

//                         {/* Companies */}
//                         {problemData.companies && problemData.companies.length > 0 && (
//                             <div className="mb-6">
//                                 <h3 className="text-sm font-semibold mb-2 text-gray-400">Companies:</h3>
//                                 <div className="flex flex-wrap gap-2">
//                                     {problemData.companies.map((company, index) => (
//                                         <span key={index} className="px-2 py-1 bg-blue-900 text-blue-300 text-xs rounded">
//                                             {company}
//                                         </span>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}

//                         {/* Problem Description */}
//                         <div className="space-y-4 text-gray-300 leading-relaxed">
//                             <div dangerouslySetInnerHTML={{ __html: problemData.description }} />

//                             {/* Examples */}
//                             {problemData.examples && problemData.examples.map((example, index) => (
//                                 <div key={index} className="mt-8">
//                                     <h3 className="text-lg font-semibold mb-4 text-white">Example {index + 1}:</h3>
//                                     <div className="p-4 rounded-lg border-l-4 border-gray-500 bg-gray-800">
//                                         <p className="mb-2"><strong className="text-white">Input:</strong> {example.input}</p>
//                                         <p className="mb-2"><strong className="text-white">Output:</strong> {example.output}</p>
//                                         {example.explanation && (
//                                             <p><strong className="text-white">Explanation:</strong> {example.explanation}</p>
//                                         )}
//                                     </div>
//                                 </div>
//                             ))}

//                             {/* Constraints */}
//                             {formattedConstraints && formattedConstraints.length > 0 && (
//                                 <div className="mt-8">
//                                     <h3 className="text-lg font-semibold mb-4 text-white">Constraints:</h3>
//                                     <ul className="list-disc list-inside space-y-2 text-gray-400">
//                                         {formattedConstraints.map((constraint, index) => (
//                                             <li key={index} className="font-mono text-sm">{constraint}</li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                             )}

//                             {/* Hints */}
//                             {problemData.hints && problemData.hints.length > 0 && (
//                                 <div className="mt-8">
//                                     <button
//                                         onClick={() => setShowHints(!showHints)}
//                                         className="text-lg font-semibold mb-4 text-white hover:text-yellow-400 transition-colors"
//                                     >
//                                         💡 Hints ({problemData.hints.length}) {showHints ? '▼' : '▶'}
//                                     </button>
//                                     {showHints && (
//                                         <div className="space-y-2">
//                                             {problemData.hints.map((hint, index) => (
//                                                 <div key={index} className="p-3 bg-yellow-900 bg-opacity-20 border-l-4 border-yellow-500 rounded">
//                                                     <p className="text-yellow-200 text-sm">{hint}</p>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     )}
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
//                                 {(runCodeResults || submissionResults) && (
//                                     <span className="ml-2 w-2 h-2 bg-green-500 rounded-full inline-block"></span>
//                                 )}
//                             </button>
//                         </div>

//                         {/* Tab Content */}
//                         <div className="flex-1 p-4 overflow-y-auto">
//                             {activeTab === 'testcase' && (
//                                 <div className="space-y-4">
//                                     <div className="flex space-x-2">
//                                         {sampleTestCases.map((testCase, index) => {
//                                             const status = getTestCaseStatus(testCase.id);
//                                             return (
//                                                 <button
//                                                     key={index}
//                                                     onClick={() => setActiveTestCase(index + 1)}
//                                                     className={`px-3 py-1 text-sm rounded transition-colors flex items-center space-x-2 ${activeTestCase === index + 1
//                                                         ? status === 'passed' ? 'bg-green-700 text-white border border-green-500'
//                                                         : status === 'failed' ? 'bg-red-700 text-white border border-red-500'
//                                                         : 'bg-gray-700 text-white'
//                                                         : status === 'passed' ? 'bg-green-900 text-green-300 hover:bg-green-800 border border-green-600'
//                                                         : status === 'failed' ? 'bg-red-900 text-red-300 hover:bg-red-800 border border-red-600'
//                                                         : 'bg-gray-600 text-gray-300 hover:bg-gray-700'
//                                                         }`}
//                                                 >
//                                                     <span>Case {index + 1}</span>
//                                                     {status === 'passed' && <Check size={12} className="text-green-400" />}
//                                                     {status === 'failed' && <X size={12} className="text-red-400" />}
//                                                 </button>
//                                             );
//                                         })}
//                                     </div>

//                                     {sampleTestCases[activeTestCase - 1] && (
//                                         <div className="space-y-4">
//                                             {Object.entries(sampleTestCases[activeTestCase - 1].inputs).map(([key, value]) => (
//                                                 <div key={key}>
//                                                     <label className="block text-sm text-gray-400 mb-2 font-medium">{key} =</label>
//                                                     <div className="bg-gray-900 p-3 rounded border text-green-400 font-mono text-sm">
//                                                         {typeof value === 'string' ? value : JSON.stringify(value)}
//                                                     </div>
//                                                 </div>
//                                             ))}

//                                             <div>
//                                                 <label className="block text-sm text-gray-400 mb-2 font-medium">Expected Output =</label>
//                                                 <div className="bg-gray-900 p-3 rounded border text-green-400 font-mono text-sm">
//                                                     {typeof sampleTestCases[activeTestCase - 1].expectedOutput === 'string'
//                                                         ? sampleTestCases[activeTestCase - 1].expectedOutput
//                                                         : JSON.stringify(sampleTestCases[activeTestCase - 1].expectedOutput)}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             )}

//                             {activeTab === 'result' && (
//                                 <div className="space-y-4">
//                                     {isRunning || isSubmitting ? (
//                                         <div className="flex items-center space-x-2 text-yellow-500">
//                                             <div className="animate-spin w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full"></div>
//                                             <span className="text-sm">
//                                                 {isRunning ? 'Running tests...' : 'Submitting solution...'}
//                                             </span>
//                                         </div>
//                                     ) : submissionResults ? (
//                                         <SubmissionResultDisplay result={submissionResults} />
//                                     ) : runCodeResults ? (
//                                         <RunCodeResultDisplay result={runCodeResults} />
//                                     ) : (
//                                         <div className="text-gray-400 text-sm">
//                                             No test results yet. Click "Run" to test with sample cases or "Submit" for full evaluation.
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
//                             disabled={isRunning || isSubmitting}
//                             className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded text-sm font-medium transition-colors"
//                         >
//                             <Play size={16} />
//                             <span>{isRunning ? 'Running...' : 'Run'}</span>
//                         </button>
//                         <button
//                             onClick={submitCode}
//                             disabled={isRunning || isSubmitting}
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
import { Play, RotateCcw, User, Menu, Heart, ThumbsUp, Users, CheckCircle, X, Check } from 'lucide-react';
import Navbar from '../../components/user/Navbar';
import httpClient from '../../services/axios/httpClient';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

// Updated interfaces based on your API response
interface TestCaseResult {
    testCaseId: string;
    input: string;
    expectedOutput: string;
    actualOutput: string;
    status: 'passed' | 'failed' | 'error';
    executionTime: number;
    memoryUsage: number;
    judge0Token: string;
    errorMessage: string | null;
}

interface RunCodeResponse {
    verdict: string;
    status: string;
    score: number;
    totalTime: number;
    maxMemory: number;
    testCaseResults: TestCaseResult[];
    totalTestCases: number;
    passedTestCases: number;
    failedTestCases: number;
}

interface SubmissionResponse {
    id: string;
    language: {
        id: number;
        name: string;
    };
    overallVerdict: string;
    problemId: string;
    score: number;
    status: string;
    submittedAt: string;
    testCaseResults: TestCaseResult[];
    testCasesPassed: number;
    totalExecutionTime: number;
    totalTestCases: number;
    userId: string;
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
    minLength?: number;
    maxLength?: number;
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
    supportedLanguages: number[];
    templates: Record<string, {
        templateCode: string;
        userFunctionSignature: string;
        placeholder: string;
        _id?: string;
    }>;
}

interface ApiResponse {
    success: boolean;
    message: string;
    data: {
        problem: ProblemData;
        sampleTestCases: SampleTestCase[];
    };
}

const languageMap: Record<number, { value: string; label: string }> = {
    50: { value: 'c', label: 'C' },
    51: { value: 'csharp', label: 'C#' },
    54: { value: 'cpp', label: 'C++' },
    60: { value: 'go', label: 'Go' },
    62: { value: 'java', label: 'Java' },
    63: { value: 'javascript', label: 'JavaScript' },
    68: { value: 'php', label: 'PHP' },
    71: { value: 'python', label: 'Python' },
    72: { value: 'ruby', label: 'Ruby' },
    73: { value: 'rust', label: 'Rust' },
    74: { value: 'typescript', label: 'TypeScript' },
    78: { value: 'kotlin', label: 'Kotlin' },
    83: { value: 'swift', label: 'Swift' },
};

const ProblemSolvingPage: React.FC = () => {
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [code, setCode] = useState('');
    const [problemData, setProblemData] = useState<ProblemData | null>(null);
    const [sampleTestCases, setSampleTestCases] = useState<SampleTestCase[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [runCodeResults, setRunCodeResults] = useState<RunCodeResponse | null>(null);
    const [submissionResults, setSubmissionResults] = useState<SubmissionResponse | null>(null);
    
    const [activeTab, setActiveTab] = useState('testcase');
    const [activeTestCase, setActiveTestCase] = useState(1);
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showHints, setShowHints] = useState(false);
    const [languages, setLanguages] = useState<{ value: string; label: string }[]>([]);

    const editorRef = useRef<any>(null);
    const { slug } = useParams();

    // Helper to get default function body based on language
    const getFunctionSeparator = (language: string): string => {
        switch (language) {
            case 'python':
                return ':';
            default:
                return '';
        }
    };

    const getDefaultBody = (language: string, returnType: string): string => {
        switch (language) {
            case 'python':
                return '        pass';
            case 'c':
                return returnType.includes('*') ? ' {\n    // Your code here\n    return NULL;\n}' : ' {\n    // Your code here\n    return 0;\n}';
            default:
                return ' {\n    // Your code here\n}';
        }
    };

    // Convert constraint objects to readable strings
    const formatConstraints = (constraints: Constraint[]): string[] => {
        return constraints.map(constraint => {
            let formatted = `${constraint.parameterName}: ${constraint.type}`;

            if (constraint.type === 'array') {
                if (constraint.minLength !== undefined && constraint.maxLength !== undefined) {
                    formatted += ` (length: ${constraint.minLength} <= length <= ${constraint.maxLength})`;
                } else if (constraint.minLength !== undefined) {
                    formatted += ` (length >= ${constraint.minLength})`;
                } else if (constraint.maxLength !== undefined) {
                    formatted += ` (length <= ${constraint.maxLength})`;
                }
            } else {
                if (constraint.minValue !== undefined && constraint.maxValue !== undefined) {
                    formatted += ` (${constraint.minValue} <= value <= ${constraint.maxValue})`;
                } else if (constraint.minValue !== undefined) {
                    formatted += ` (>= ${constraint.minValue})`;
                } else if (constraint.maxValue !== undefined) {
                    formatted += ` (<= ${constraint.maxValue})`;
                }
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
                const response = await httpClient.get(`user/problems/${slug}/detail`);

                if (!response.data.success) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const { data }: { data: ApiResponse['data'] } = response.data;
                setProblemData(data.problem);
                setSampleTestCases(data.sampleTestCases || []);
                console.log("problem data ", data);

                // Set supported languages
                const supported = data.problem.supportedLanguages;
                const availLanguages = supported
                    .map(id => languageMap[id])
                    .filter((l): l is { value: string; label: string } => l !== undefined);
                setLanguages(availLanguages);

                if (availLanguages.length > 0) {
                    const firstLang = availLanguages[0].value;
                    setSelectedLanguage(firstLang);

                    // Set initial code
                    const langId = getLanguageId(firstLang);
                    const template = data.problem.templates[langId!.toString()];
                    if (template) {
                        const separator = getFunctionSeparator(firstLang);
                        const defaultBody = getDefaultBody(firstLang, data.problem.returnType);
                        const userCode = `${template.userFunctionSignature}${separator}\n${defaultBody}`;
                        setCode(template.userFunctionSignature.replace(template.placeholder, userCode));
                    }
                }

            } catch (err: any) {
                setError(err.message || 'Failed to fetch problem data');
                console.error('Error fetching problem data:', err);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchProblemData();
        }
    }, [slug]);

    const handleEditorDidMount = (editor: any) => {
        editorRef.current = editor;
    };

    const handleLanguageChange = (newLanguage: string) => {
        setSelectedLanguage(newLanguage);
        if (problemData) {
            const langId = getLanguageId(newLanguage);
            const template = problemData.templates[langId!.toString()];
            if (template) {
                const separator = getFunctionSeparator(newLanguage);
                const defaultBody = getDefaultBody(newLanguage, problemData.returnType);
                const userCode = `${template.userFunctionSignature}${separator}\n${defaultBody}`;
                setCode(template.userFunctionSignature.replace(template.placeholder, userCode));
            }
        }
    };

    function getLanguageId(language: string): number | undefined {
        switch (language.toLowerCase()) {
            case "c":
                return 50;
            case "cpp":
            case "c++":
                return 54;
            case "java":
                return 62;
            case "javascript":
            case "js":
                return 63;
            case "python":
            case "py":
                return 71;
            case "typescript":
            case "ts":
                return 74;
            case "csharp":
            case "c#":
                return 51;
            case "go":
                return 60;
            case "ruby":
                return 72;
            case "swift":
                return 83;
            case "kotlin":
                return 78;
            case "php":
                return 68;
            case "rust":
                return 73;
            case "dart":
                return 85;
            default:
                return undefined;
        }
    }

    // Updated runCode function with correct endpoint
    const runCode = async () => {
        setIsRunning(true);
        setActiveTab('result');
        setRunCodeResults(null);

        try {
            // Extract sample test case IDs
            const testCaseIds = sampleTestCases.map(tc => tc.id);
            
            const response = await httpClient.post(`user/problems/test-case`, {
                problemId: problemData?.id,
                sourceCode: code,
                languageId: getLanguageId(selectedLanguage),
                testCases: testCaseIds 
            });

            if (response.data.success) {
                setRunCodeResults(response.data.data);
                toast.success(`${response.data.data.passedTestCases}/${response.data.data.totalTestCases} test cases passed`);
            } else {
                toast.error('Failed to run code');
            }

        } catch (err: any) {
            console.error('Error running code:', err);
            toast.error('Error running code: ' + (err.response?.data?.message || err.message));
        } finally {
            setIsRunning(false);
        }
    };

    // Updated submitCode function with correct endpoint
    const submitCode = async () => {
        setIsSubmitting(true);
        setSubmissionResults(null);

        try {
            const response = await httpClient.post(`user/problems/submit`, {
                problemId: problemData?.id,
                sourceCode: code,
                languageId: getLanguageId(selectedLanguage)
            });

            if (response.data.success) {
                setSubmissionResults(response.data.data);
                const result = response.data.data;
                
                if (result.overallVerdict === 'Accepted') {
                    toast.success(`✅ Accepted! ${result.testCasesPassed}/${result.totalTestCases} test cases passed`);
                } else {
                    toast.error(`❌ ${result.overallVerdict} - ${result.testCasesPassed}/${result.totalTestCases} test cases passed`);
                }
                
                // Switch to result tab to show submission results
                setActiveTab('result');
            } else {
                toast.error('Submission failed');
            }
        } catch (err: any) {
            console.error('Error submitting code:', err);
            toast.error('Submission error: ' + (err.response?.data?.message || err.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetCode = () => {
        if (problemData) {
            const langId = getLanguageId(selectedLanguage);
            const template = problemData.templates[langId!.toString()];
            if (template) {
                const separator = getFunctionSeparator(selectedLanguage);
                const defaultBody = getDefaultBody(selectedLanguage, problemData.returnType);
                const userCode = `${template.userFunctionSignature}${separator}\n${defaultBody}`;
                setCode(template.userFunctionSignature.replace(template.placeholder, userCode));
            }
        }
    };

    // Get test case status for individual test case display
    const getTestCaseStatus = (testCaseId: string): 'passed' | 'failed' | 'neutral' => {
        if (!runCodeResults) return 'neutral';
        const result = runCodeResults.testCaseResults.find(r => r.testCaseId === testCaseId);
        return result ? result.status === 'passed' ? 'passed' : 'failed' : 'neutral';
    };

    // Updated result display for submissions - only show failed test cases
    const SubmissionResultDisplay = ({ result }: { result: SubmissionResponse }) => {
        const failedTestCases = result.testCaseResults.filter(tc => tc.status !== 'passed');
        
        if (result.overallVerdict === 'Accepted') {
            return (
                <div className="space-y-4">
                    {/* Success UI */}
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
                {/* Failed submission header */}
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

                {/* Show only failed test cases */}
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

    // Updated result display for test case runs
    const RunCodeResultDisplay = ({ result }: { result: RunCodeResponse }) => {
        return (
            <div className="space-y-4">
                {/* Overall Result Summary */}
                <div className="bg-gray-900 p-4 rounded border">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                                result.verdict === 'Accepted' ? 'bg-green-500' : 'bg-red-500'
                            }`}></div>
                            <span className={`font-medium ${
                                result.verdict === 'Accepted' ? 'text-green-500' : 'text-red-500'
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

                {/* Individual Test Case Results */}
                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-300">Individual Results:</h4>
                    {result.testCaseResults.map((testCase, index) => (
                        <div key={testCase.testCaseId} className={`bg-gray-900 p-4 rounded border ${
                            testCase.status === 'passed' ? 'border-green-500 border-opacity-30' : 'border-red-500 border-opacity-30'
                        }`}>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-400 font-medium">Case {index + 1}</span>
                                    {testCase.status === 'passed' ? (
                                        <Check size={16} className="text-green-500" />
                                    ) : (
                                        <X size={16} className="text-red-500" />
                                    )}
                                    <span className={`text-xs ${
                                        testCase.status === 'passed' ? 'text-green-500' : 'text-red-500'
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
                                    <div className={`bg-gray-800 p-2 mt-1 rounded ${
                                        testCase.status === 'passed' ? 'text-green-400' : 'text-red-400'
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
                                <span className={`px-2 py-1 text-white text-xs rounded font-medium ${problemData.difficulty.toLowerCase() === 'easy' ? 'bg-green-600' :
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
                                    <div className="p-4 rounded-lg border-l-4 border-gray-500 bg-gray-800 space-y-2">
                                        <strong className="text-white">Input:</strong>
                                        {(() => {
                                            try {
                                                const parsedInput = JSON.parse(example.input);
                                                return Object.entries(parsedInput).map(([key, value]) => (
                                                    <div key={key} className="ml-4 text-gray-300 font-mono text-sm">
                                                        {key} = {JSON.stringify(value)}
                                                    </div>
                                                ));
                                            } catch (e) {
                                                return <div className="ml-4 text-gray-300">{example.input}</div>;
                                            }
                                        })()}
                                        <div>
                                            <strong className="text-white">Output:</strong>{' '}
                                            <span className="font-mono text-sm">{JSON.stringify(example.output)}</span>
                                        </div>
                                        {example.explanation && (
                                            <div>
                                                <strong className="text-white">Explanation:</strong>{' '}
                                                <span className="text-gray-300">{example.explanation}</span>
                                            </div>
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
                                lineNumbers: 'off',
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
                                {(runCodeResults || submissionResults) && (
                                    <span className="ml-2 w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                                )}
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 p-4 overflow-y-auto">
                            {activeTab === 'testcase' && (
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

                    {/* Action Buttons */}
                    <div className="bg-gray-800 border-t border-gray-700 px-4 py-4 flex justify-end space-x-3">
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
            </div>
        </div>
    );
};

export default ProblemSolvingPage;