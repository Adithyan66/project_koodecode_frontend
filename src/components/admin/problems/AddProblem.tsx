

// // // import React, { useState } from 'react';
// // // import { Plus, Minus, Check, X, Tag, Lightbulb, Building } from 'lucide-react';
// // // import axios from 'axios';
// // // import { toast } from 'react-toastify';
// // // import httpClient from '../../../services/axios/httpClient';
// // // import { useNavigate } from 'react-router-dom';

// // // interface Example {
// // //   id: string;
// // //   input: string;
// // //   expectedOutput: string;
// // //   explanation: string;
// // // }

// // // interface TestCase {
// // //   id: string;
// // //   input: string;
// // //   expectedOutput: string;
// // //   isSample: boolean;
// // // }

// // // const AddProblem = () => {

// // //   const navigate = useNavigate()

// // //   const [title, setTitle] = useState('');
// // //   const [difficulty, setDifficulty] = useState('easy');
// // //   const [description, setDescription] = useState('');

// // //   const [examples, setExamples] = useState<Example[]>([
// // //     { id: '1', input: '', expectedOutput: '', explanation: '' }
// // //   ]);

// // //   const [constraints, setConstraints] = useState(['']);

// // //   const [testCases, setTestCases] = useState<TestCase[]>([
// // //     { id: '1', input: '', expectedOutput: '', isSample: false },
// // //     { id: '2', input: '', expectedOutput: '', isSample: false },
// // //     { id: '3', input: '', expectedOutput: '', isSample: false },
// // //     { id: '4', input: '', expectedOutput: '', isSample: false },
// // //     { id: '5', input: '', expectedOutput: '', isSample: false }
// // //   ]);

// // //   // New fields
// // //   const [tags, setTags] = useState<string[]>(['']);
// // //   const [hints, setHints] = useState<string[]>(['']);
// // //   const [companies, setCompanies] = useState<string[]>(['']);

// // //   const [errors, setErrors] = useState<{ [key: string]: string }>({});

// // //   // Generate random problem ID
// // //   const generateProblemId = () => {
// // //     return 'PROB_' + Math.random().toString(36).substr(2, 9).toUpperCase();
// // //   };

// // //   // Example management
// // //   const addExample = () => {
// // //     if (examples.length < 3) {
// // //       const newId = (examples.length + 1).toString();
// // //       setExamples([...examples, { id: newId, input: '', expectedOutput: '', explanation: '' }]);
// // //     }
// // //   };

// // //   const removeExample = (id: string) => {
// // //     if (examples.length > 1) {
// // //       setExamples(examples.filter(example => example.id !== id));
// // //     }
// // //   };

// // //   const updateExample = (id: string, field: keyof Example, value: string) => {
// // //     setExamples(examples.map(example =>
// // //       example.id === id ? { ...example, [field]: value } : example
// // //     ));
// // //   };

// // //   // Constraint management
// // //   const addConstraint = () => {
// // //     setConstraints([...constraints, '']);
// // //   };

// // //   const removeConstraint = (index: number) => {
// // //     if (constraints.length > 1) {
// // //       setConstraints(constraints.filter((_, i) => i !== index));
// // //     }
// // //   };

// // //   const updateConstraint = (index: number, value: string) => {
// // //     setConstraints(constraints.map((constraint, i) =>
// // //       i === index ? value : constraint
// // //     ));
// // //   };

// // //   // Test case management
// // //   const addTestCase = () => {
// // //     const newId = (testCases.length + 1).toString();
// // //     setTestCases([...testCases, { id: newId, input: '', expectedOutput: '', isSample: false }]);
// // //   };

// // //   const removeTestCase = (id: string) => {
// // //     if (testCases.length > 5) {
// // //       setTestCases(testCases.filter(testCase => testCase.id !== id));
// // //     }
// // //   };

// // //   const updateTestCase = (id: string, field: keyof TestCase, value: string | boolean) => {
// // //     setTestCases(testCases.map(testCase =>
// // //       testCase.id === id ? { ...testCase, [field]: value } : testCase
// // //     ));
// // //   };

// // //   // Tags management
// // //   const addTag = () => {
// // //     setTags([...tags, '']);
// // //   };

// // //   const removeTag = (index: number) => {
// // //     if (tags.length > 1) {
// // //       setTags(tags.filter((_, i) => i !== index));
// // //     }
// // //   };

// // //   const updateTag = (index: number, value: string) => {
// // //     setTags(tags.map((tag, i) => i === index ? value : tag));
// // //   };

// // //   // Hints management
// // //   const addHint = () => {
// // //     setHints([...hints, '']);
// // //   };

// // //   const removeHint = (index: number) => {
// // //     if (hints.length > 1) {
// // //       setHints(hints.filter((_, i) => i !== index));
// // //     }
// // //   };

// // //   const updateHint = (index: number, value: string) => {
// // //     setHints(hints.map((hint, i) => i === index ? value : hint));
// // //   };

// // //   // Companies management
// // //   const addCompany = () => {
// // //     setCompanies([...companies, '']);
// // //   };

// // //   const removeCompany = (index: number) => {
// // //     if (companies.length > 1) {
// // //       setCompanies(companies.filter((_, i) => i !== index));
// // //     }
// // //   };

// // //   const updateCompany = (index: number, value: string) => {
// // //     setCompanies(companies.map((company, i) => i === index ? value : company));
// // //   };

// // //   // Validation
// // //   const validateForm = () => {
// // //     const newErrors: { [key: string]: string } = {};

// // //     if (!title.trim()) {
// // //       newErrors.title = 'Problem name is required';
// // //     }

// // //     if (!description.trim()) {
// // //       newErrors.description = 'Problem description is required';
// // //     }

// // //     // Validate examples
// // //     examples.forEach((example, index) => {
// // //       if (!example.input.trim()) {
// // //         newErrors[`example_${index}_input`] = 'Input is required';
// // //       }
// // //       if (!example.expectedOutput.trim()) {
// // //         newErrors[`example_${index}_output`] = 'Output is required';
// // //       }
// // //       if (!example.explanation.trim()) {
// // //         newErrors[`example_${index}_explanation`] = 'Explanation is required';
// // //       }
// // //     });

// // //     // Validate constraints
// // //     const nonEmptyConstraints = constraints.filter(c => c.trim());
// // //     if (nonEmptyConstraints.length === 0) {
// // //       newErrors.constraints = 'At least one constraint is required';
// // //     }

// // //     // Validate test cases
// // //     const nonEmptyTestCases = testCases.filter(tc => tc.input.trim() && tc.expectedOutput.trim());
// // //     if (nonEmptyTestCases.length < 5) {
// // //       newErrors.testCases = 'At least 5 complete test cases are required';
// // //     }

// // //     // Validate tags
// // //     const nonEmptyTags = tags.filter(tag => tag.trim());
// // //     if (nonEmptyTags.length === 0) {
// // //       newErrors.tags = 'At least one tag is required';
// // //     }

// // //     setErrors(newErrors);
// // //     return Object.keys(newErrors).length === 0;
// // //   };

// // //   const handleSubmit = async () => {

// // //     if (validateForm()) {
// // //       const problemData = {
// // //         problemId: generateProblemId(),
// // //         title: title.trim(),
// // //         difficulty,
// // //         description: description.trim(),
// // //         examples: examples.filter(ex => ex.input.trim() && ex.expectedOutput.trim()),
// // //         constraints: constraints.filter(c => c.trim()),
// // //         testCases: testCases.filter(tc => tc.input.trim() && tc.expectedOutput.trim()),
// // //         tags: tags.filter(tag => tag.trim()),
// // //         hints: hints.filter(hint => hint.trim()),
// // //         companies: companies.filter(company => company.trim())
// // //       };

// // //       try {
        
// // //         let res = await httpClient.post(`admin/problems/create-problem`, problemData)

// // //         if (res.data.success) {
// // //           toast.success("success")
// // //           navigate("/admin/problems")
// // //         }
// // //       } catch (error: unknown) {
// // //         if (axios.isAxiosError(error)) {
// // //           toast.error(error.response?.data.message);
// // //         } else {
// // //           console.log("Unexpected error:", error);
// // //         }
// // //       }
// // //     }
// // //   };



// // //   return (
// // //     <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg ">
// // //       <h1 className="text-3xl font-bold text-gray-800 mb-8">Add New Problem</h1>

// // //       <div className="space-y-8">
// // //         {/* Basic Information */}
// // //         <div className="space-y-4">
// // //           <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Basic Information</h2>

// // //           <div>
// // //             <label className="block text-sm font-medium text-gray-700 mb-2">
// // //               Problem Name *
// // //             </label>
// // //             <input
// // //               type="text"
// // //               value={title}
// // //               onChange={(e) => setTitle(e.target.value)}
// // //               className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : 'border-gray-300'
// // //                 }`}
// // //               placeholder="Enter problem name"
// // //             />
// // //             {errors.title && (
// // //               <p className="text-red-500 text-sm mt-1">{errors.title}</p>
// // //             )}
// // //           </div>

// // //           <div>
// // //             <label className="block text-sm font-medium text-gray-700 mb-2">
// // //               Difficulty Level *
// // //             </label>
// // //             <select
// // //               value={difficulty}
// // //               onChange={(e) => setDifficulty(e.target.value)}
// // //               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //             >
// // //               <option value="easy">Easy</option>
// // //               <option value="medium">Medium</option>
// // //               <option value="hard">Hard</option>
// // //             </select>
// // //           </div>

// // //           <div>
// // //             <label className="block text-sm font-medium text-gray-700 mb-2">
// // //               Problem Description *
// // //             </label>
// // //             <textarea
// // //               value={description}
// // //               onChange={(e) => setDescription(e.target.value)}
// // //               rows={6}
// // //               className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'
// // //                 }`}
// // //               placeholder="Describe the problem in detail..."
// // //             />
// // //             {errors.description && (
// // //               <p className="text-red-500 text-sm mt-1">{errors.description}</p>
// // //             )}
// // //           </div>
// // //         </div>

// // //         {/* Tags */}
// // //         <div className="space-y-4">
// // //           <div className="flex justify-between items-center">
// // //             <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 flex items-center">
// // //               <Tag className="w-5 h-5 mr-2" />
// // //               Tags *
// // //             </h2>
// // //             <button
// // //               type="button"
// // //               onClick={addTag}
// // //               className="flex items-center px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
// // //             >
// // //               <Plus className="w-4 h-4 mr-1" />
// // //               Add Tag
// // //             </button>
// // //           </div>

// // //           {errors.tags && (
// // //             <p className="text-red-500 text-sm">{errors.tags}</p>
// // //           )}

// // //           {tags.map((tag, index) => (
// // //             <div key={index} className="flex items-center space-x-2">
// // //               <input
// // //                 type="text"
// // //                 value={tag}
// // //                 onChange={(e) => updateTag(index, e.target.value)}
// // //                 className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                 placeholder="Enter tag (e.g., Array, Dynamic Programming, Graph)"
// // //               />
// // //               {tags.length > 1 && (
// // //                 <button
// // //                   type="button"
// // //                   onClick={() => removeTag(index)}
// // //                   className="text-red-500 hover:text-red-700"
// // //                 >
// // //                   <Minus className="w-4 h-4" />
// // //                 </button>
// // //               )}
// // //             </div>
// // //           ))}
// // //         </div>

// // //         {/* Examples */}
// // //         <div className="space-y-4">
// // //           <div className="flex justify-between items-center">
// // //             <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Examples (1-3 required)</h2>
// // //             {examples.length < 3 && (
// // //               <button
// // //                 type="button"
// // //                 onClick={addExample}
// // //                 className="flex items-center px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
// // //               >
// // //                 <Plus className="w-4 h-4 mr-1" />
// // //                 Add Example
// // //               </button>
// // //             )}
// // //           </div>

// // //           {examples.map((example, index) => (
// // //             <div key={example.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
// // //               <div className="flex justify-between items-center">
// // //                 <h3 className="font-medium text-gray-700">Example {index + 1}</h3>
// // //                 {examples.length > 1 && (
// // //                   <button
// // //                     type="button"
// // //                     onClick={() => removeExample(example.id)}
// // //                     className="text-red-500 hover:text-red-700"
// // //                   >
// // //                     <X className="w-4 h-4" />
// // //                   </button>
// // //                 )}
// // //               </div>

// // //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //                 <div>
// // //                   <label className="block text-sm font-medium text-gray-600 mb-1">Input *</label>
// // //                   <textarea
// // //                     value={example.input}
// // //                     onChange={(e) => updateExample(example.id, 'input', e.target.value)}
// // //                     rows={3}
// // //                     className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[`example_${index}_input`] ? 'border-red-500' : 'border-gray-300'
// // //                       }`}
// // //                     placeholder="Input for this example"
// // //                   />
// // //                   {errors[`example_${index}_input`] && (
// // //                     <p className="text-red-500 text-xs mt-1">{errors[`example_${index}_input`]}</p>
// // //                   )}
// // //                 </div>

// // //                 <div>
// // //                   <label className="block text-sm font-medium text-gray-600 mb-1">Output *</label>
// // //                   <textarea
// // //                     value={example.expectedOutput}
// // //                     onChange={(e) => updateExample(example.id, 'expectedOutput', e.target.value)}
// // //                     rows={3}
// // //                     className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[`example_${index}_output`] ? 'border-red-500' : 'border-gray-300'
// // //                       }`}
// // //                     placeholder="Expected output"
// // //                   />
// // //                   {errors[`example_${index}_output`] && (
// // //                     <p className="text-red-500 text-xs mt-1">{errors[`example_${index}_output`]}</p>
// // //                   )}
// // //                 </div>
// // //               </div>

// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-600 mb-1">Explanation *</label>
// // //                 <textarea
// // //                   value={example.explanation}
// // //                   onChange={(e) => updateExample(example.id, 'explanation', e.target.value)}
// // //                   rows={2}
// // //                   className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[`example_${index}_explanation`] ? 'border-red-500' : 'border-gray-300'
// // //                     }`}
// // //                   placeholder="Explain how the output is derived from the input"
// // //                 />
// // //                 {errors[`example_${index}_explanation`] && (
// // //                   <p className="text-red-500 text-xs mt-1">{errors[`example_${index}_explanation`]}</p>
// // //                 )}
// // //               </div>
// // //             </div>
// // //           ))}
// // //         </div>

// // //         {/* Constraints */}
// // //         <div className="space-y-4">
// // //           <div className="flex justify-between items-center">
// // //             <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Constraints</h2>
// // //             <button
// // //               type="button"
// // //               onClick={addConstraint}
// // //               className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
// // //             >
// // //               <Plus className="w-4 h-4 mr-1" />
// // //               Add Constraint
// // //             </button>
// // //           </div>

// // //           {errors.constraints && (
// // //             <p className="text-red-500 text-sm">{errors.constraints}</p>
// // //           )}

// // //           {constraints.map((constraint, index) => (
// // //             <div key={index} className="flex items-center space-x-2">
// // //               <input
// // //                 type="text"
// // //                 value={constraint}
// // //                 onChange={(e) => updateConstraint(index, e.target.value)}
// // //                 className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                 placeholder="Enter constraint (e.g., 1 ≤ n ≤ 10^5)"
// // //               />
// // //               {constraints.length > 1 && (
// // //                 <button
// // //                   type="button"
// // //                   onClick={() => removeConstraint(index)}
// // //                   className="text-red-500 hover:text-red-700"
// // //                 >
// // //                   <Minus className="w-4 h-4" />
// // //                 </button>
// // //               )}
// // //             </div>
// // //           ))}
// // //         </div>

// // //         {/* Hints */}
// // //         <div className="space-y-4">
// // //           <div className="flex justify-between items-center">
// // //             <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 flex items-center">
// // //               <Lightbulb className="w-5 h-5 mr-2" />
// // //               Hints (Optional)
// // //             </h2>
// // //             <button
// // //               type="button"
// // //               onClick={addHint}
// // //               className="flex items-center px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
// // //             >
// // //               <Plus className="w-4 h-4 mr-1" />
// // //               Add Hint
// // //             </button>
// // //           </div>

// // //           {hints.map((hint, index) => (
// // //             <div key={index} className="flex items-center space-x-2">
// // //               <input
// // //                 type="text"
// // //                 value={hint}
// // //                 onChange={(e) => updateHint(index, e.target.value)}
// // //                 className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                 placeholder="Enter hint to help solve the problem"
// // //               />
// // //               {hints.length > 1 && (
// // //                 <button
// // //                   type="button"
// // //                   onClick={() => removeHint(index)}
// // //                   className="text-red-500 hover:text-red-700"
// // //                 >
// // //                   <Minus className="w-4 h-4" />
// // //                 </button>
// // //               )}
// // //             </div>
// // //           ))}
// // //         </div>

// // //         {/* Companies */}
// // //         <div className="space-y-4">
// // //           <div className="flex justify-between items-center">
// // //             <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 flex items-center">
// // //               <Building className="w-5 h-5 mr-2" />
// // //               Companies (Optional)
// // //             </h2>
// // //             <button
// // //               type="button"
// // //               onClick={addCompany}
// // //               className="flex items-center px-3 py-1 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
// // //             >
// // //               <Plus className="w-4 h-4 mr-1" />
// // //               Add Company
// // //             </button>
// // //           </div>

// // //           {companies.map((company, index) => (
// // //             <div key={index} className="flex items-center space-x-2">
// // //               <input
// // //                 type="text"
// // //                 value={company}
// // //                 onChange={(e) => updateCompany(index, e.target.value)}
// // //                 className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                 placeholder="Enter company name (e.g., Google, Microsoft, Amazon)"
// // //               />
// // //               {companies.length > 1 && (
// // //                 <button
// // //                   type="button"
// // //                   onClick={() => removeCompany(index)}
// // //                   className="text-red-500 hover:text-red-700"
// // //                 >
// // //                   <Minus className="w-4 h-4" />
// // //                 </button>
// // //               )}
// // //             </div>
// // //           ))}
// // //         </div>

// // //         {/* Test Cases */}
// // //         <div className="space-y-4">
// // //           <div className="flex justify-between items-center">
// // //             <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
// // //               Test Cases (minimum 5 required)
// // //             </h2>
// // //             <button
// // //               type="button"
// // //               onClick={addTestCase}
// // //               className="flex items-center px-3 py-1 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
// // //             >
// // //               <Plus className="w-4 h-4 mr-1" />
// // //               Add Test Case
// // //             </button>
// // //           </div>

// // //           {errors.testCases && (
// // //             <p className="text-red-500 text-sm">{errors.testCases}</p>
// // //           )}

// // //           <div className="grid gap-4">
// // //             {testCases.map((testCase, index) => (
// // //               <div key={testCase.id} className="border border-gray-200 rounded-lg p-4">
// // //                 <div className="flex justify-between items-center mb-3">
// // //                   <h3 className="font-medium text-gray-700">Test Case {index + 1}</h3>
// // //                   <div className="flex items-center space-x-2">
// // //                     <label className="flex items-center space-x-2 text-sm text-gray-600">
// // //                       <input
// // //                         type="checkbox"
// // //                         checked={testCase.isSample}
// // //                         onChange={(e) => updateTestCase(testCase.id, 'isSample', e.target.checked)}
// // //                         className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
// // //                       />
// // //                       <span>Show in Example (run without submit)</span>
// // //                     </label>
// // //                     {testCases.length > 5 && (
// // //                       <button
// // //                         type="button"
// // //                         onClick={() => removeTestCase(testCase.id)}
// // //                         className="text-red-500 hover:text-red-700"
// // //                       >
// // //                         <X className="w-4 h-4" />
// // //                       </button>
// // //                     )}
// // //                   </div>
// // //                 </div>

// // //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //                   <div>
// // //                     <label className="block text-sm font-medium text-gray-600 mb-1">Input</label>
// // //                     <textarea
// // //                       value={testCase.input}
// // //                       onChange={(e) => updateTestCase(testCase.id, 'input', e.target.value)}
// // //                       rows={3}
// // //                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                       placeholder="Test case input"
// // //                     />
// // //                   </div>

// // //                   <div>
// // //                     <label className="block text-sm font-medium text-gray-600 mb-1">Expected Output</label>
// // //                     <textarea
// // //                       value={testCase.expectedOutput}
// // //                       onChange={(e) => updateTestCase(testCase.id, 'expectedOutput', e.target.value)}
// // //                       rows={3}
// // //                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                       placeholder="Expected output"
// // //                     />
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         </div>

// // //         {/* Submit Button */}
// // //         <div className="flex justify-end pt-6 border-t">
// // //           <button
// // //             type="button"
// // //             onClick={handleSubmit}
// // //             className="flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
// // //           >
// // //             <Check className="w-5 h-5 mr-2" />
// // //             Create Problem
// // //           </button>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default AddProblem;
















// // import React, { useState } from 'react';
// // import { Plus, Minus, Check, X, Tag, Lightbulb, Building, Code, Settings, Eye, Save } from 'lucide-react';
// // import axios from 'axios';
// // import { toast } from 'react-toastify';
// // import httpClient from '../../../services/axios/httpClient';
// // import { useNavigate } from 'react-router-dom';

// // interface Parameter {
// //   id: string;
// //   name: string;
// //   type: string;
// //   description: string;
// // }

// // interface Example {
// //   id: string;
// //   input: string;
// //   output: string;
// //   explanation: string;
// // }

// // interface TestCase {
// //   id: string;
// //   input: string;
// //   expectedOutput: string;
// //   isSample: boolean;
// // }

// // const SUPPORTED_TYPES = [
// //   'number',
// //   'string',
// //   'boolean',
// //   'number[]',
// //   'string[]',
// //   'boolean[]',
// //   'number[][]',
// //   'string[][]',
// //   'TreeNode',
// //   'ListNode',
// //   'object',
// //   'any'
// // ];

// // const AddProblem = () => {
// //   const navigate = useNavigate();

// //   // Basic Information
// //   const [title, setTitle] = useState('');
// //   const [difficulty, setDifficulty] = useState('easy');
// //   const [description, setDescription] = useState('');
// //   const [isActive, setIsActive] = useState(true);

// //   // Function Definition
// //   const [functionName, setFunctionName] = useState('');
// //   const [returnType, setReturnType] = useState('number');
// //   const [parameters, setParameters] = useState<Parameter[]>([
// //     { id: '1', name: '', type: 'number', description: '' }
// //   ]);

// //   // Content
// //   const [examples, setExamples] = useState<Example[]>([
// //     { id: '1', input: '', output: '', explanation: '' }
// //   ]);
// //   const [constraints, setConstraints] = useState(['']);
// //   const [testCases, setTestCases] = useState<TestCase[]>([
// //     { id: '1', input: '', expectedOutput: '', isSample: false },
// //     { id: '2', input: '', expectedOutput: '', isSample: false },
// //     { id: '3', input: '', expectedOutput: '', isSample: false },
// //     { id: '4', input: '', expectedOutput: '', isSample: false },
// //     { id: '5', input: '', expectedOutput: '', isSample: false }
// //   ]);

// //   // Additional Fields
// //   const [tags, setTags] = useState<string[]>(['']);
// //   const [hints, setHints] = useState<string[]>(['']);
// //   const [companies, setCompanies] = useState<string[]>(['']);

// //   const [errors, setErrors] = useState<{ [key: string]: string }>({});
// //   const [activeTab, setActiveTab] = useState('basic');

// //   // Generate function signature preview
// //   const generateFunctionSignature = (language: 'typescript' | 'java' | 'python' | 'cpp') => {
// //     if (!functionName || parameters.some(p => !p.name || !p.type)) return '';
    
// //     const typeMap: { [key: string]: { [lang: string]: string } } = {
// //       'number': { typescript: 'number', java: 'int', python: 'int', cpp: 'int' },
// //       'string': { typescript: 'string', java: 'String', python: 'str', cpp: 'string' },
// //       'boolean': { typescript: 'boolean', java: 'boolean', python: 'bool', cpp: 'bool' },
// //       'number[]': { typescript: 'number[]', java: 'int[]', python: 'List[int]', cpp: 'vector<int>' },
// //       'string[]': { typescript: 'string[]', java: 'String[]', python: 'List[str]', cpp: 'vector<string>' },
// //       'number[][]': { typescript: 'number[][]', java: 'int[][]', python: 'List[List[int]]', cpp: 'vector<vector<int>>' }
// //     };

// //     const params = parameters
// //       .filter(p => p.name && p.type)
// //       .map(p => {
// //         const mappedType = typeMap[p.type]?.[language] || p.type;
// //         switch (language) {
// //           case 'typescript':
// //             return `${p.name}: ${mappedType}`;
// //           case 'java':
// //             return `${mappedType} ${p.name}`;
// //           case 'python':
// //             return `${p.name}: ${mappedType}`;
// //           case 'cpp':
// //             return `${mappedType} ${p.name}`;
// //           default:
// //             return `${p.name}: ${mappedType}`;
// //         }
// //       })
// //       .join(', ');

// //     const mappedReturnType = typeMap[returnType]?.[language] || returnType;

// //     switch (language) {
// //       case 'typescript':
// //         return `function ${functionName}(${params}): ${mappedReturnType}`;
// //       case 'java':
// //         return `public ${mappedReturnType} ${functionName}(${params})`;
// //       case 'python':
// //         return `def ${functionName}(${params}) -> ${mappedReturnType}:`;
// //       case 'cpp':
// //         return `${mappedReturnType} ${functionName}(${params})`;
// //       default:
// //         return `${functionName}(${params}): ${mappedReturnType}`;
// //     }
// //   };

// //   // Parameter management
// //   const addParameter = () => {
// //     const newId = (parameters.length + 1).toString();
// //     setParameters([...parameters, { id: newId, name: '', type: 'number', description: '' }]);
// //   };

// //   const removeParameter = (id: string) => {
// //     if (parameters.length > 1) {
// //       setParameters(parameters.filter(param => param.id !== id));
// //     }
// //   };

// //   const updateParameter = (id: string, field: keyof Parameter, value: string) => {
// //     setParameters(parameters.map(param =>
// //       param.id === id ? { ...param, [field]: value } : param
// //     ));
// //   };

// //   // Example management
// //   const addExample = () => {
// //     if (examples.length < 3) {
// //       const newId = (examples.length + 1).toString();
// //       setExamples([...examples, { id: newId, input: '', output: '', explanation: '' }]);
// //     }
// //   };

// //   const removeExample = (id: string) => {
// //     if (examples.length > 1) {
// //       setExamples(examples.filter(example => example.id !== id));
// //     }
// //   };

// //   const updateExample = (id: string, field: keyof Example, value: string) => {
// //     setExamples(examples.map(example =>
// //       example.id === id ? { ...example, [field]: value } : example
// //     ));
// //   };

// //   // Constraint management
// //   const addConstraint = () => {
// //     setConstraints([...constraints, '']);
// //   };

// //   const removeConstraint = (index: number) => {
// //     if (constraints.length > 1) {
// //       setConstraints(constraints.filter((_, i) => i !== index));
// //     }
// //   };

// //   const updateConstraint = (index: number, value: string) => {
// //     setConstraints(constraints.map((constraint, i) =>
// //       i === index ? value : constraint
// //     ));
// //   };

// //   // Test case management
// //   const addTestCase = () => {
// //     const newId = (testCases.length + 1).toString();
// //     setTestCases([...testCases, { id: newId, input: '', expectedOutput: '', isSample: false }]);
// //   };

// //   const removeTestCase = (id: string) => {
// //     if (testCases.length > 5) {
// //       setTestCases(testCases.filter(testCase => testCase.id !== id));
// //     }
// //   };

// //   const updateTestCase = (id: string, field: keyof TestCase, value: string | boolean) => {
// //     setTestCases(testCases.map(testCase =>
// //       testCase.id === id ? { ...testCase, [field]: value } : testCase
// //     ));
// //   };

// //   // Array field management (tags, hints, companies)
// //   const addToArray = (array: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
// //     setter([...array, '']);
// //   };

// //   const removeFromArray = (array: string[], setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
// //     if (array.length > 1) {
// //       setter(array.filter((_, i) => i !== index));
// //     }
// //   };

// //   const updateArray = (array: string[], setter: React.Dispatch<React.SetStateAction<string[]>>, index: number, value: string) => {
// //     setter(array.map((item, i) => i === index ? value : item));
// //   };

// //   // Validation
// //   const validateForm = () => {
// //     const newErrors: { [key: string]: string } = {};

// //     if (!title.trim()) newErrors.title = 'Problem name is required';
// //     if (!description.trim()) newErrors.description = 'Problem description is required';
// //     if (!functionName.trim()) newErrors.functionName = 'Function name is required';

// //     // Validate parameters
// //     parameters.forEach((param, index) => {
// //       if (!param.name.trim()) newErrors[`param_${index}_name`] = 'Parameter name is required';
// //       if (!param.type) newErrors[`param_${index}_type`] = 'Parameter type is required';
// //     });

// //     // Validate examples
// //     examples.forEach((example, index) => {
// //       if (!example.input.trim()) newErrors[`example_${index}_input`] = 'Input is required';
// //       if (!example.output.trim()) newErrors[`example_${index}_output`] = 'Output is required';
// //       if (!example.explanation.trim()) newErrors[`example_${index}_explanation`] = 'Explanation is required';
// //     });

// //     const nonEmptyConstraints = constraints.filter(c => c.trim());
// //     if (nonEmptyConstraints.length === 0) newErrors.constraints = 'At least one constraint is required';

// //     const nonEmptyTestCases = testCases.filter(tc => tc.input.trim() && tc.expectedOutput.trim());
// //     if (nonEmptyTestCases.length < 5) newErrors.testCases = 'At least 5 complete test cases are required';

// //     const nonEmptyTags = tags.filter(tag => tag.trim());
// //     if (nonEmptyTags.length === 0) newErrors.tags = 'At least one tag is required';

// //     setErrors(newErrors);
// //     return Object.keys(newErrors).length === 0;
// //   };

// //   const handleSubmit = async () => {
// //     if (validateForm()) {
// //       const problemData = {
// //         title: title.trim(),
// //         difficulty,
// //         description: description.trim(),
// //         functionName: functionName.trim(),
// //         returnType,
// //         parameters: parameters.filter(p => p.name.trim()),
// //         examples: examples.filter(ex => ex.input.trim() && ex.output.trim()),
// //         constraints: constraints.filter(c => c.trim()),
// //         testCases: testCases.filter(tc => tc.input.trim() && tc.expectedOutput.trim()),
// //         tags: tags.filter(tag => tag.trim()),
// //         hints: hints.filter(hint => hint.trim()),
// //         companies: companies.filter(company => company.trim()),
// //         isActive
// //       };

// //       try {
// //         const res = await httpClient.post(`admin/problems/create-problem`, problemData);
// //         if (res.data.success) {
// //           toast.success("Problem created successfully!");
// //           navigate("/admin/problems");
// //         }
// //       } catch (error: unknown) {
// //         if (axios.isAxiosError(error)) {
// //           toast.error(error.response?.data.message || "Failed to create problem");
// //         } else {
// //           console.log("Unexpected error:", error);
// //         }
// //       }
// //     }
// //   };

// //   const TabButton = ({ id, icon: Icon, label, isActive }: any) => (
// //     <button
// //       type="button"
// //       onClick={() => setActiveTab(id)}
// //       className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
// //         isActive
// //           ? 'bg-blue-600 text-white shadow-md'
// //           : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
// //       }`}
// //     >
// //       <Icon className="w-4 h-4 mr-2" />
// //       {label}
// //     </button>
// //   );

// //   return (
// //     <div className="max-w-8xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
// //       <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
// //         {/* Header */}
// //         <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
// //           <h1 className="text-3xl font-bold text-white mb-2">Create New Problem</h1>
// //           <p className="text-blue-100">Design a coding challenge for your platform</p>
// //         </div>

// //         {/* Navigation Tabs */}
// //         <div className="p-6 bg-gray-50 border-b">
// //           <div className="flex flex-wrap gap-2">
// //             <TabButton id="basic" icon={Settings} label="Basic Info" isActive={activeTab === 'basic'} />
// //             <TabButton id="function" icon={Code} label="Function Definition" isActive={activeTab === 'function'} />
// //             <TabButton id="content" icon={Eye} label="Examples & Test Cases" isActive={activeTab === 'content'} />
// //             <TabButton id="metadata" icon={Tag} label="Tags & Metadata" isActive={activeTab === 'metadata'} />
// //           </div>
// //         </div>

// //         <div className="p-6">
// //           {/* Basic Information Tab */}
// //           {activeTab === 'basic' && (
// //             <div className="space-y-6">
// //               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// //                 <div className="space-y-4">
// //                   <div>
// //                     <label className="block text-sm font-semibold text-gray-700 mb-2">
// //                       Problem Title *
// //                     </label>
// //                     <input
// //                       type="text"
// //                       value={title}
// //                       onChange={(e) => setTitle(e.target.value)}
// //                       className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
// //                         errors.title ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
// //                       }`}
// //                       placeholder="Two Sum"
// //                     />
// //                     {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
// //                   </div>

// //                   <div>
// //                     <label className="block text-sm font-semibold text-gray-700 mb-2">
// //                       Difficulty Level *
// //                     </label>
// //                     <select
// //                       value={difficulty}
// //                       onChange={(e) => setDifficulty(e.target.value)}
// //                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
// //                     >
// //                       <option value="easy">🟢 Easy</option>
// //                       <option value="medium">🟡 Medium</option>
// //                       <option value="hard">🔴 Hard</option>
// //                     </select>
// //                   </div>

// //                   <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
// //                     <input
// //                       type="checkbox"
// //                       id="isActive"
// //                       checked={isActive}
// //                       onChange={(e) => setIsActive(e.target.checked)}
// //                       className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
// //                     />
// //                     <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
// //                       Make problem active immediately
// //                     </label>
// //                   </div>
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-semibold text-gray-700 mb-2">
// //                     Problem Description *
// //                   </label>
// //                   <textarea
// //                     value={description}
// //                     onChange={(e) => setDescription(e.target.value)}
// //                     rows={8}
// //                     className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
// //                       errors.description ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
// //                     }`}
// //                     placeholder="Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target..."
// //                   />
// //                   {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
// //                 </div>
// //               </div>
// //             </div>
// //           )}

// //           {/* Function Definition Tab */}
// //           {activeTab === 'function' && (
// //             <div className="space-y-6">
// //               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// //                 <div className="space-y-4">
// //                   <div>
// //                     <label className="block text-sm font-semibold text-gray-700 mb-2">
// //                       Function Name *
// //                     </label>
// //                     <input
// //                       type="text"
// //                       value={functionName}
// //                       onChange={(e) => setFunctionName(e.target.value)}
// //                       className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
// //                         errors.functionName ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
// //                       }`}
// //                       placeholder="twoSum"
// //                     />
// //                     {errors.functionName && <p className="text-red-500 text-sm mt-1">{errors.functionName}</p>}
// //                   </div>

// //                   <div>
// //                     <label className="block text-sm font-semibold text-gray-700 mb-2">
// //                       Return Type *
// //                     </label>
// //                     <select
// //                       value={returnType}
// //                       onChange={(e) => setReturnType(e.target.value)}
// //                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
// //                     >
// //                       {SUPPORTED_TYPES.map(type => (
// //                         <option key={type} value={type}>{type}</option>
// //                       ))}
// //                     </select>
// //                   </div>

// //                   {/* Parameters */}
// //                   <div>
// //                     <div className="flex justify-between items-center mb-4">
// //                       <h3 className="text-lg font-semibold text-gray-700">Parameters *</h3>
// //                       <button
// //                         type="button"
// //                         onClick={addParameter}
// //                         className="flex items-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
// //                       >
// //                         <Plus className="w-4 h-4 mr-1" />
// //                         Add Parameter
// //                       </button>
// //                     </div>

// //                     <div className="space-y-3">
// //                       {parameters.map((param, index) => (
// //                         <div key={param.id} className="p-4 border-2 border-gray-100 rounded-lg">
// //                           <div className="flex justify-between items-center mb-3">
// //                             <h4 className="font-medium text-gray-700">Parameter {index + 1}</h4>
// //                             {parameters.length > 1 && (
// //                               <button
// //                                 type="button"
// //                                 onClick={() => removeParameter(param.id)}
// //                                 className="text-red-500 hover:text-red-700 transition-colors"
// //                               >
// //                                 <X className="w-4 h-4" />
// //                               </button>
// //                             )}
// //                           </div>

// //                           <div className="grid grid-cols-2 gap-3">
// //                             <div>
// //                               <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
// //                               <input
// //                                 type="text"
// //                                 value={param.name}
// //                                 onChange={(e) => updateParameter(param.id, 'name', e.target.value)}
// //                                 className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
// //                                   errors[`param_${index}_name`] ? 'border-red-500' : 'border-gray-300'
// //                                 }`}
// //                                 placeholder="nums"
// //                               />
// //                               {errors[`param_${index}_name`] && (
// //                                 <p className="text-red-500 text-xs mt-1">{errors[`param_${index}_name`]}</p>
// //                               )}
// //                             </div>

// //                             <div>
// //                               <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
// //                               <select
// //                                 value={param.type}
// //                                 onChange={(e) => updateParameter(param.id, 'type', e.target.value)}
// //                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                               >
// //                                 {SUPPORTED_TYPES.map(type => (
// //                                   <option key={type} value={type}>{type}</option>
// //                                 ))}
// //                               </select>
// //                             </div>
// //                           </div>

// //                           <div className="mt-3">
// //                             <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
// //                             <input
// //                               type="text"
// //                               value={param.description}
// //                               onChange={(e) => updateParameter(param.id, 'description', e.target.value)}
// //                               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                               placeholder="Array of integers"
// //                             />
// //                           </div>
// //                         </div>
// //                       ))}
// //                     </div>
// //                   </div>
// //                 </div>

// //                 {/* Function Signature Preview */}
// //                 <div className="bg-gray-50 rounded-lg p-4">
// //                   <h3 className="text-lg font-semibold text-gray-700 mb-4">Function Signature Preview</h3>
                  
// //                   <div className="space-y-4">
// //                     {['typescript', 'java', 'python', 'cpp'].map((lang) => (
// //                       <div key={lang} className="bg-white rounded-md p-3 border">
// //                         <div className="flex items-center justify-between mb-2">
// //                           <span className="text-sm font-medium text-gray-600 capitalize">{lang}</span>
// //                           <Code className="w-4 h-4 text-gray-400" />
// //                         </div>
// //                         <code className="text-sm text-gray-800 font-mono">
// //                           {generateFunctionSignature(lang as any) || 'Complete function definition to see preview'}
// //                         </code>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           )}

// //           {/* Examples & Test Cases Tab */}
// //           {activeTab === 'content' && (
// //             <div className="space-y-8">
// //               {/* Examples */}
// //               <div>
// //                 <div className="flex justify-between items-center mb-4">
// //                   <h2 className="text-xl font-semibold text-gray-700">Examples (1-3 required)</h2>
// //                   {examples.length < 3 && (
// //                     <button
// //                       type="button"
// //                       onClick={addExample}
// //                       className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
// //                     >
// //                       <Plus className="w-4 h-4 mr-2" />
// //                       Add Example
// //                     </button>
// //                   )}
// //                 </div>

// //                 <div className="space-y-4">
// //                   {examples.map((example, index) => (
// //                     <div key={example.id} className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
// //                       <div className="flex justify-between items-center mb-4">
// //                         <h3 className="font-semibold text-gray-700">Example {index + 1}</h3>
// //                         {examples.length > 1 && (
// //                           <button
// //                             type="button"
// //                             onClick={() => removeExample(example.id)}
// //                             className="text-red-500 hover:text-red-700 transition-colors"
// //                           >
// //                             <X className="w-5 h-5" />
// //                           </button>
// //                         )}
// //                       </div>

// //                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
// //                         <div>
// //                           <label className="block text-sm font-medium text-gray-600 mb-2">Input *</label>
// //                           <textarea
// //                             value={example.input}
// //                             onChange={(e) => updateExample(example.id, 'input', e.target.value)}
// //                             rows={3}
// //                             className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
// //                               errors[`example_${index}_input`] ? 'border-red-500' : 'border-gray-300'
// //                             }`}
// //                             placeholder='[2,7,11,15], 9'
// //                           />
// //                           {errors[`example_${index}_input`] && (
// //                             <p className="text-red-500 text-xs mt-1">{errors[`example_${index}_input`]}</p>
// //                           )}
// //                         </div>

// //                         <div>
// //                           <label className="block text-sm font-medium text-gray-600 mb-2">Output *</label>
// //                           <textarea
// //                             value={example.output}
// //                             onChange={(e) => updateExample(example.id, 'output', e.target.value)}
// //                             rows={3}
// //                             className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
// //                               errors[`example_${index}_output`] ? 'border-red-500' : 'border-gray-300'
// //                             }`}
// //                             placeholder='[0,1]'
// //                           />
// //                           {errors[`example_${index}_output`] && (
// //                             <p className="text-red-500 text-xs mt-1">{errors[`example_${index}_output`]}</p>
// //                           )}
// //                         </div>
// //                       </div>

// //                       <div>
// //                         <label className="block text-sm font-medium text-gray-600 mb-2">Explanation *</label>
// //                         <textarea
// //                           value={example.explanation}
// //                           onChange={(e) => updateExample(example.id, 'explanation', e.target.value)}
// //                           rows={2}
// //                           className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
// //                             errors[`example_${index}_explanation`] ? 'border-red-500' : 'border-gray-300'
// //                           }`}
// //                           placeholder="Because nums[0] + nums[1] = 2 + 7 = 9, we return [0, 1]."
// //                         />
// //                         {errors[`example_${index}_explanation`] && (
// //                           <p className="text-red-500 text-xs mt-1">{errors[`example_${index}_explanation`]}</p>
// //                         )}
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>

// //               {/* Constraints */}
// //               <div>
// //                 <div className="flex justify-between items-center mb-4">
// //                   <h2 className="text-xl font-semibold text-gray-700">Constraints *</h2>
// //                   <button
// //                     type="button"
// //                     onClick={addConstraint}
// //                     className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
// //                   >
// //                     <Plus className="w-4 h-4 mr-2" />
// //                     Add Constraint
// //                   </button>
// //                 </div>

// //                 {errors.constraints && <p className="text-red-500 text-sm mb-3">{errors.constraints}</p>}

// //                 <div className="space-y-3">
// //                   {constraints.map((constraint, index) => (
// //                     <div key={index} className="flex items-center space-x-3">
// //                       <input
// //                         type="text"
// //                         value={constraint}
// //                         onChange={(e) => updateConstraint(index, e.target.value)}
// //                         className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
// //                         placeholder="2 ≤ nums.length ≤ 10^4"
// //                       />
// //                       {constraints.length > 1 && (
// //                         <button
// //                           type="button"
// //                           onClick={() => removeConstraint(index)}
// //                           className="text-red-500 hover:text-red-700 transition-colors"
// //                         >
// //                           <Minus className="w-5 h-5" />
// //                         </button>
// //                       )}
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>

// //               {/* Test Cases */}
// //               <div>
// //                 <div className="flex justify-between items-center mb-4">
// //                   <h2 className="text-xl font-semibold text-gray-700">Test Cases (minimum 5 required)</h2>
// //                   <button
// //                     type="button"
// //                     onClick={addTestCase}
// //                     className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
// //                   >
// //                     <Plus className="w-4 h-4 mr-2" />
// //                     Add Test Case
// //                   </button>
// //                 </div>

// //                 {errors.testCases && <p className="text-red-500 text-sm mb-3">{errors.testCases}</p>}

// //                 <div className="space-y-4">
// //                   {testCases.map((testCase, index) => (
// //                     <div key={testCase.id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
// //                       <div className="flex justify-between items-center mb-3">
// //                         <h3 className="font-medium text-gray-700">Test Case {index + 1}</h3>
// //                         <div className="flex items-center space-x-3">
// //                           <label className="flex items-center space-x-2 text-sm text-gray-600">
// //                             <input
// //                               type="checkbox"
// //                               checked={testCase.isSample}
// //                               onChange={(e) => updateTestCase(testCase.id, 'isSample', e.target.checked)}
// //                               className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
// //                             />
// //                             <span>Sample (visible in examples)</span>
// //                           </label>
// //                           {testCases.length > 5 && (
// //                             <button
// //                               type="button"
// //                               onClick={() => removeTestCase(testCase.id)}
// //                               className="text-red-500 hover:text-red-700 transition-colors"
// //                             >
// //                               <X className="w-4 h-4" />
// //                             </button>
// //                           )}
// //                         </div>
// //                       </div>

// //                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                         <div>
// //                           <label className="block text-sm font-medium text-gray-600 mb-1">Input (JSON format)</label>
// //                           <textarea
// //                             value={testCase.input}
// //                             onChange={(e) => updateTestCase(testCase.id, 'input', e.target.value)}
// //                             rows={3}
// //                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors font-mono text-sm"
// //                             placeholder='{"nums": [2,7,11,15], "target": 9}'
// //                           />
// //                         </div>

// //                         <div>
// //                           <label className="block text-sm font-medium text-gray-600 mb-1">Expected Output (JSON format)</label>
// //                           <textarea
// //                             value={testCase.expectedOutput}
// //                             onChange={(e) => updateTestCase(testCase.id, 'expectedOutput', e.target.value)}
// //                             rows={3}
// //                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors font-mono text-sm"
// //                             placeholder='[0,1]'
// //                           />
// //                         </div>
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //             </div>
// //           )}

// //           {/* Tags & Metadata Tab */}
// //           {activeTab === 'metadata' && (
// //             <div className="space-y-8">
// //               {/* Tags */}
// //               <div>
// //                 <div className="flex justify-between items-center mb-4">
// //                   <h2 className="text-xl font-semibold text-gray-700 flex items-center">
// //                     <Tag className="w-5 h-5 mr-2" />
// //                     Tags *
// //                   </h2>
// //                   <button
// //                     type="button"
// //                     onClick={() => addToArray(tags, setTags)}
// //                     className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
// //                   >
// //                     <Plus className="w-4 h-4 mr-2" />
// //                     Add Tag
// //                   </button>
// //                 </div>

// //                 {errors.tags && <p className="text-red-500 text-sm mb-3">{errors.tags}</p>}

// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
// //                   {tags.map((tag, index) => (
// //                     <div key={index} className="flex items-center space-x-2">
// //                       <input
// //                         type="text"
// //                         value={tag}
// //                         onChange={(e) => updateArray(tags, setTags, index, e.target.value)}
// //                         className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
// //                         placeholder="Array, Hash Table, Two Pointers"
// //                       />
// //                       {tags.length > 1 && (
// //                         <button
// //                           type="button"
// //                           onClick={() => removeFromArray(tags, setTags, index)}
// //                           className="text-red-500 hover:text-red-700 transition-colors"
// //                         >
// //                           <Minus className="w-5 h-5" />
// //                         </button>
// //                       )}
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>

// //               {/* Hints */}
// //               <div>
// //                 <div className="flex justify-between items-center mb-4">
// //                   <h2 className="text-xl font-semibold text-gray-700 flex items-center">
// //                     <Lightbulb className="w-5 h-5 mr-2" />
// //                     Hints (Optional)
// //                   </h2>
// //                   <button
// //                     type="button"
// //                     onClick={() => addToArray(hints, setHints)}
// //                     className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
// //                   >
// //                     <Plus className="w-4 h-4 mr-2" />
// //                     Add Hint
// //                   </button>
// //                 </div>

// //                 <div className="space-y-3">
// //                   {hints.map((hint, index) => (
// //                     <div key={index} className="flex items-center space-x-2">
// //                       <input
// //                         type="text"
// //                         value={hint}
// //                         onChange={(e) => updateArray(hints, setHints, index, e.target.value)}
// //                         className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
// //                         placeholder="A really brute force way would be to search for all possible pairs of numbers..."
// //                       />
// //                       {hints.length > 1 && (
// //                         <button
// //                           type="button"
// //                           onClick={() => removeFromArray(hints, setHints, index)}
// //                           className="text-red-500 hover:text-red-700 transition-colors"
// //                         >
// //                           <Minus className="w-5 h-5" />
// //                         </button>
// //                       )}
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>

// //               {/* Companies */}
// //               <div>
// //                 <div className="flex justify-between items-center mb-4">
// //                   <h2 className="text-xl font-semibold text-gray-700 flex items-center">
// //                     <Building className="w-5 h-5 mr-2" />
// //                     Companies (Optional)
// //                   </h2>
// //                   <button
// //                     type="button"
// //                     onClick={() => addToArray(companies, setCompanies)}
// //                     className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
// //                   >
// //                     <Plus className="w-4 h-4 mr-2" />
// //                     Add Company
// //                   </button>
// //                 </div>

// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
// //                   {companies.map((company, index) => (
// //                     <div key={index} className="flex items-center space-x-2">
// //                       <input
// //                         type="text"
// //                         value={company}
// //                         onChange={(e) => updateArray(companies, setCompanies, index, e.target.value)}
// //                         className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
// //                         placeholder="Google, Microsoft, Amazon, Apple"
// //                       />
// //                       {companies.length > 1 && (
// //                         <button
// //                           type="button"
// //                           onClick={() => removeFromArray(companies, setCompanies, index)}
// //                           className="text-red-500 hover:text-red-700 transition-colors"
// //                         >
// //                           <Minus className="w-5 h-5" />
// //                         </button>
// //                       )}
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //             </div>
// //           )}
// //         </div>

// //         {/* Footer with Submit Button */}
// //         <div className="p-6 bg-gray-50 border-t flex justify-between items-center">
// //           <div className="text-sm text-gray-600">
// //             Make sure all required fields are filled before submitting
// //           </div>
// //           <button
// //             type="button"
// //             onClick={handleSubmit}
// //             className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
// //           >
// //             <Check className="w-5 h-5 mr-2" />
// //             Create Problem
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AddProblem;











// import React, { useState, useEffect } from 'react';
// import { Plus, Minus, Check, X, Tag, Lightbulb, Building, Code, Settings, Eye, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import httpClient from '../../../services/axios/httpClient';
// import { useNavigate } from 'react-router-dom';

// interface Parameter {
//   id: string;
//   name: string;
//   type: string;
//   description: string;
// }

// interface ParameterConstraint {
//   parameterName: string;
//   type: string;
//   // For numbers
//   minValue?: number;
//   maxValue?: number;
//   // For strings
//   minLength?: number;
//   maxLength?: number;
//   allowedChars?: string;
//   // For arrays
//   arrayMinLength?: number;
//   arrayMaxLength?: number;
//   elementConstraints?: {
//     minValue?: number;
//     maxValue?: number;
//     minLength?: number;
//     maxLength?: number;
//   };
// }

// interface ParameterValue {
//   [parameterName: string]: any;
// }

// interface Example {
//   id: string;
//   inputs: ParameterValue;
//   expectedOutput: any;
//   explanation: string;
// }

// interface TestCase {
//   id: string;
//   inputs: ParameterValue;
//   expectedOutput: any;
//   isSample: boolean;
// }

// const SUPPORTED_TYPES = [
//   'number',
//   'string',
//   'boolean',
//   'number[]',
//   'string[]',
//   'boolean[]',
//   'number[][]',
//   'string[][]',
//   'TreeNode',
//   'ListNode',
//   'object'
// ];

// const TAB_SEQUENCE = [
//   { id: 'basic', title: 'Basic Info', icon: Settings },
//   { id: 'function', title: 'Function Definition', icon: Code },
//   { id: 'constraints', title: 'Constraints', icon: AlertCircle },
//   { id: 'examples', title: 'Examples', icon: Eye },
//   { id: 'testcases', title: 'Test Cases', icon: Check },
//   { id: 'metadata', title: 'Tags & Metadata', icon: Tag }
// ];

// const AddProblem = () => {
//   const navigate = useNavigate();
//   const [currentTabIndex, setCurrentTabIndex] = useState(0);

//   // Basic Information
//   const [title, setTitle] = useState('');
//   const [difficulty, setDifficulty] = useState('easy');
//   const [description, setDescription] = useState('');
//   const [isActive, setIsActive] = useState(true);

//   // Function Definition
//   const [functionName, setFunctionName] = useState('');
//   const [returnType, setReturnType] = useState('number');
//   const [parameters, setParameters] = useState<Parameter[]>([
//     { id: '1', name: '', type: 'number', description: '' }
//   ]);

//   // Constraints
//   const [parameterConstraints, setParameterConstraints] = useState<ParameterConstraint[]>([]);

//   // Examples and Test Cases
//   const [examples, setExamples] = useState<Example[]>([]);
//   const [testCases, setTestCases] = useState<TestCase[]>([]);

//   // Additional Fields
//   const [tags, setTags] = useState<string[]>(['']);
//   const [hints, setHints] = useState<string[]>(['']);
//   const [companies, setCompanies] = useState<string[]>(['']);

//   const [errors, setErrors] = useState<{ [key: string]: string }>({});

//   // Auto-generate constraints when parameters change
//   useEffect(() => {
//     if (parameters.length > 0 && parameters.some(p => p.name.trim())) {
//       const newConstraints = parameters
//         .filter(p => p.name.trim())
//         .map(p => {
//           // Check if constraint already exists for this parameter
//           const existingConstraint = parameterConstraints.find(c => c.parameterName === p.name);
          
//           if (existingConstraint) {
//             // Update existing constraint type if parameter type changed
//             return { ...existingConstraint, type: p.type };
//           }
          
//           // Create new constraint
//           return {
//             parameterName: p.name,
//             type: p.type,
//             minValue: p.type === 'number' ? -1000000000 : undefined,
//             maxValue: p.type === 'number' ? 1000000000 : undefined,
//             minLength: p.type === 'string' ? 1 : undefined,
//             maxLength: p.type === 'string' ? 1000 : undefined,
//             arrayMinLength: p.type.includes('[]') ? 1 : undefined,
//             arrayMaxLength: p.type.includes('[]') ? 10000 : undefined,
//             elementConstraints: p.type.includes('[]') ? {
//               minValue: p.type === 'number[]' || p.type === 'number[][]' ? -1000000000 : undefined,
//               maxValue: p.type === 'number[]' || p.type === 'number[][]' ? 1000000000 : undefined,
//               minLength: p.type === 'string[]' ? 1 : undefined,
//               maxLength: p.type === 'string[]' ? 100 : undefined
//             } : undefined
//           };
//         });
      
//       setParameterConstraints(newConstraints);
//     }
//   }, [parameters]);

//   // Auto-generate examples when constraints are set
//   useEffect(() => {
//     if (parameterConstraints.length > 0 && parameters.some(p => p.name.trim())) {
//       const validParams = parameters.filter(p => p.name.trim());
      
//       // Update existing examples to match current parameters
//       if (examples.length > 0) {
//         const updatedExamples = examples.map(example => {
//           const newInputs: ParameterValue = {};
//           validParams.forEach(p => {
//             // Keep existing value if parameter still exists, otherwise set empty
//             newInputs[p.name] = example.inputs[p.name] !== undefined ? example.inputs[p.name] : '';
//           });
//           return { ...example, inputs: newInputs };
//         });
//         setExamples(updatedExamples);
//       } else {
//         // Create first example
//         const initialInputs: ParameterValue = {};
//         validParams.forEach(p => {
//           initialInputs[p.name] = '';
//         });
        
//         setExamples([{
//           id: '1',
//           inputs: initialInputs,
//           expectedOutput: '',
//           explanation: ''
//         }]);
//       }

//       // Update existing test cases or create new ones
//       if (testCases.length > 0) {
//         const updatedTestCases = testCases.map(testCase => {
//           const newInputs: ParameterValue = {};
//           validParams.forEach(p => {
//             // Keep existing value if parameter still exists, otherwise set empty
//             newInputs[p.name] = testCase.inputs[p.name] !== undefined ? testCase.inputs[p.name] : '';
//           });
//           return { ...testCase, inputs: newInputs };
//         });
//         setTestCases(updatedTestCases);
//       } else {
//         // Create initial test cases
//         const initialTestCases = [];
//         for (let i = 1; i <= 5; i++) {
//           const inputs: ParameterValue = {};
//           validParams.forEach(p => {
//             inputs[p.name] = '';
//           });
          
//           initialTestCases.push({
//             id: i.toString(),
//             inputs,
//             expectedOutput: '',
//             isSample: false
//           });
//         }
//         setTestCases(initialTestCases);
//       }
//     }
//   }, [parameterConstraints]);

//   // Validation function for names (no spaces, only alphanumeric and underscore)
//   const isValidName = (name: string) => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);

//   // Check if a value is empty (handles different types)
//   const isEmpty = (value: any): boolean => {
//     if (value === null || value === undefined) return true;
//     if (typeof value === 'string') return value.trim() === '';
//     if (typeof value === 'number') return isNaN(value);
//     if (Array.isArray(value)) return value.length === 0;
//     return false;
//   };

//   // Generate function signature
//   const generateFunctionSignature = (language: 'typescript' | 'java' | 'python' | 'cpp') => {
//     if (!functionName || parameters.some(p => !p.name || !p.type)) return '';
    
//     const typeMap: { [key: string]: { [lang: string]: string } } = {
//       'number': { typescript: 'number', java: 'int', python: 'int', cpp: 'int' },
//       'string': { typescript: 'string', java: 'String', python: 'str', cpp: 'string' },
//       'boolean': { typescript: 'boolean', java: 'boolean', python: 'bool', cpp: 'bool' },
//       'number[]': { typescript: 'number[]', java: 'int[]', python: 'List[int]', cpp: 'vector<int>' },
//       'string[]': { typescript: 'string[]', java: 'String[]', python: 'List[str]', cpp: 'vector<string>' },
//       'number[][]': { typescript: 'number[][]', java: 'int[][]', python: 'List[List[int]]', cpp: 'vector<vector<int>>' }
//     };

//     const validParams = parameters.filter(p => p.name.trim() && p.type);
//     const params = validParams.map(p => {
//         const mappedType = typeMap[p.type]?.[language] || p.type;
//         switch (language) {
//           case 'typescript':
//             return `${p.name}: ${mappedType}`;
//           case 'java':
//             return `${mappedType} ${p.name}`;
//           case 'python':
//             return `${p.name}: ${mappedType}`;
//           case 'cpp':
//             return `${mappedType} ${p.name}`;
//           default:
//             return `${p.name}: ${mappedType}`;
//         }
//       })
//       .join(', ');

//     const mappedReturnType = typeMap[returnType]?.[language] || returnType;

//     switch (language) {
//       case 'typescript':
//         return `function ${functionName}(${params}): ${mappedReturnType}`;
//       case 'java':
//         return `public ${mappedReturnType} ${functionName}(${params})`;
//       case 'python':
//         return `def ${functionName}(${params}) -> ${mappedReturnType}:`;
//       case 'cpp':
//         return `${mappedReturnType} ${functionName}(${params})`;
//       default:
//         return `${functionName}(${params}): ${mappedReturnType}`;
//     }
//   };

//   // Parameter management - FIX: Use functional state updates to prevent interference
//   const addParameter = () => {
//     const newId = Date.now().toString(); // Use timestamp for unique IDs
//     setParameters(prev => [...prev, { id: newId, name: '', type: 'number', description: '' }]);
//   };

//   const removeParameter = (id: string) => {
//     setParameters(prev => {
//       if (prev.length > 1) {
//         return prev.filter(param => param.id !== id);
//       }
//       return prev;
//     });
//   };

//   // FIX: Improved parameter update function to prevent cross-contamination
//   const updateParameter = (id: string, field: keyof Parameter, value: string) => {
//     // Validate name field for no spaces
//     if (field === 'name' && value.includes(' ')) {
//       return; // Don't update if spaces are present
//     }
    
//     setParameters(prev => prev.map(param => {
//       if (param.id === id) {
//         return { ...param, [field]: value };
//       }
//       return param; // Return unchanged parameter
//     }));
//   };

//   // Constraint management
//   const updateConstraint = (parameterName: string, field: string, value: any) => {
//     setParameterConstraints(prev => 
//       prev.map(constraint => 
//         constraint.parameterName === parameterName 
//           ? { ...constraint, [field]: value }
//           : constraint
//       )
//     );
//   };

//   const updateElementConstraint = (parameterName: string, field: string, value: any) => {
//     setParameterConstraints(prev => 
//       prev.map(constraint => 
//         constraint.parameterName === parameterName 
//           ? { 
//               ...constraint, 
//               elementConstraints: { 
//                 ...constraint.elementConstraints, 
//                 [field]: value 
//               }
//             }
//           : constraint
//       )
//     );
//   };

//   // Example management
//   const addExample = () => {
//     if (examples.length < 3) {
//       const initialInputs: ParameterValue = {};
//       parameters.filter(p => p.name.trim()).forEach(p => {
//         initialInputs[p.name] = '';
//       });
      
//       const newId = Date.now().toString();
//       setExamples(prev => [...prev, { id: newId, inputs: initialInputs, expectedOutput: '', explanation: '' }]);
//     }
//   };

//   const removeExample = (id: string) => {
//     if (examples.length > 1) {
//       setExamples(prev => prev.filter(example => example.id !== id));
//     }
//   };

//   const updateExampleInput = (id: string, parameterName: string, value: any) => {
//     setExamples(prev => prev.map(example =>
//       example.id === id 
//         ? { ...example, inputs: { ...example.inputs, [parameterName]: value } }
//         : example
//     ));
//   };

//   const updateExampleOutput = (id: string, value: any) => {
//     setExamples(prev => prev.map(example =>
//       example.id === id ? { ...example, expectedOutput: value } : example
//     ));
//   };

//   const updateExampleExplanation = (id: string, value: string) => {
//     setExamples(prev => prev.map(example =>
//       example.id === id ? { ...example, explanation: value } : example
//     ));
//   };

//   // Test case management
//   const addTestCase = () => {
//     const initialInputs: ParameterValue = {};
//     parameters.filter(p => p.name.trim()).forEach(p => {
//       initialInputs[p.name] = '';
//     });
    
//     const newId = Date.now().toString();
//     setTestCases(prev => [...prev, { id: newId, inputs: initialInputs, expectedOutput: '', isSample: false }]);
//   };

//   const removeTestCase = (id: string) => {
//     if (testCases.length > 5) {
//       setTestCases(prev => prev.filter(testCase => testCase.id !== id));
//     }
//   };

//   const updateTestCaseInput = (id: string, parameterName: string, value: any) => {
//     setTestCases(prev => prev.map(testCase =>
//       testCase.id === id 
//         ? { ...testCase, inputs: { ...testCase.inputs, [parameterName]: value } }
//         : testCase
//     ));
//   };

//   const updateTestCaseOutput = (id: string, value: any) => {
//     setTestCases(prev => prev.map(testCase =>
//       testCase.id === id ? { ...testCase, expectedOutput: value } : testCase
//     ));
//   };

//   const updateTestCaseSample = (id: string, isSample: boolean) => {
//     setTestCases(prev => prev.map(testCase =>
//       testCase.id === id ? { ...testCase, isSample } : testCase
//     ));
//   };

//   // Array field management (tags, hints, companies)
//   const addToArray = (array: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
//     setter(prev => [...prev, '']);
//   };

//   const removeFromArray = (array: string[], setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
//     if (array.length > 1) {
//       setter(prev => prev.filter((_, i) => i !== index));
//     }
//   };

//   const updateArray = (array: string[], setter: React.Dispatch<React.SetStateAction<string[]>>, index: number, value: string) => {
//     setter(prev => prev.map((item, i) => i === index ? value : item));
//   };

//   // Input field generator based on parameter type
//   const generateInputField = (parameter: Parameter, value: any, onChange: (value: any) => void, placeholder?: string) => {
//     const constraint = parameterConstraints.find(c => c.parameterName === parameter.name);
    
//     switch (parameter.type) {
//       case 'number':
//         return (
//           <input
//             type="number"
//             value={value || ''}
//             onChange={(e) => onChange(parseFloat(e.target.value) || '')}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder={placeholder || `Enter ${parameter.name}`}
//             min={constraint?.minValue}
//             max={constraint?.maxValue}
//           />
//         );
      
//       case 'string':
//         return (
//           <input
//             type="text"
//             value={value || ''}
//             onChange={(e) => onChange(e.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder={placeholder || `Enter ${parameter.name}`}
//             minLength={constraint?.minLength}
//             maxLength={constraint?.maxLength}
//           />
//         );
      
//       case 'boolean':
//         return (
//           <select
//             value={value?.toString() || 'false'}
//             onChange={(e) => onChange(e.target.value === 'true')}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">Select boolean</option>
//             <option value="false">false</option>
//             <option value="true">true</option>
//           </select>
//         );
      
//       case 'number[]':
//       case 'string[]':
//       case 'boolean[]':
//         return (
//           <input
//             type="text"
//             value={value || ''}
//             onChange={(e) => onChange(e.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
//             placeholder={parameter.type === 'number[]' ? '[1,2,3,4]' : parameter.type === 'string[]' ? '["a","b","c"]' : '[true,false,true]'}
//           />
//         );
      
//       case 'number[][]':
//       case 'string[][]':
//         return (
//           <textarea
//             value={value || ''}
//             onChange={(e) => onChange(e.target.value)}
//             rows={3}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
//             placeholder={parameter.type === 'number[][]' ? '[[1,2],[3,4]]' : '[["a","b"],["c","d"]]'}
//           />
//         );
      
//       case 'TreeNode':
//       case 'ListNode':
//         return (
//           <input
//             type="text"
//             value={value || ''}
//             onChange={(e) => onChange(e.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
//             placeholder={parameter.type === 'TreeNode' ? '[1,2,3,null,4]' : '[1,2,3,4,5]'}
//           />
//         );
      
//       default:
//         return (
//           <textarea
//             value={value || ''}
//             onChange={(e) => onChange(e.target.value)}
//             rows={3}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
//             placeholder="Enter JSON object"
//           />
//         );
//     }
//   };

//   // FIX: Improved validation for examples
//   const validateExamples = () => {
//     if (examples.length === 0) return false;
    
//     return examples.some(example => {
//       // Check if all parameter inputs have values
//       const validParams = parameters.filter(p => p.name.trim());
//       const allInputsFilled = validParams.every(param => {
//         const inputValue = example.inputs[param.name];
//         return !isEmpty(inputValue);
//       });
      
//       // Check if output and explanation are filled
//       const outputFilled = !isEmpty(example.expectedOutput);
//       const explanationFilled = !isEmpty(example.explanation);
      
//       return allInputsFilled && outputFilled && explanationFilled;
//     });
//   };

//   // Navigation validation - FIX: Improved examples validation
//   const canGoNext = () => {
//     switch (currentTabIndex) {
//       case 0: // Basic Info
//         return title.trim() && description.trim();
//       case 1: // Function Definition
//         return functionName.trim() && isValidName(functionName) && 
//                parameters.every(p => p.name.trim() && isValidName(p.name) && p.type);
//       case 2: // Constraints
//         return parameterConstraints.length > 0;
//       case 3: // Examples - FIX: Use improved validation
//         return validateExamples();
//       case 4: // Test Cases
//         return testCases.filter(tc => {
//           const validParams = parameters.filter(p => p.name.trim());
//           const allInputsFilled = validParams.every(param => !isEmpty(tc.inputs[param.name]));
//           return allInputsFilled && !isEmpty(tc.expectedOutput);
//         }).length >= 5;
//       default:
//         return true;
//     }
//   };

//   // Get validation message for debugging
//   const getValidationMessage = () => {
//     switch (currentTabIndex) {
//       case 0:
//         if (!title.trim()) return 'Title is required';
//         if (!description.trim()) return 'Description is required';
//         return '';
//       case 1:
//         if (!functionName.trim()) return 'Function name is required';
//         if (!isValidName(functionName)) return 'Function name invalid (no spaces allowed)';
//         const invalidParam = parameters.find(p => !p.name.trim() || !isValidName(p.name) || !p.type);
//         if (invalidParam) return 'All parameters must have valid names and types';
//         return '';
//       case 2:
//         if (parameterConstraints.length === 0) return 'No constraints defined';
//         return '';
//       case 3: // Examples validation message
//         if (examples.length === 0) return 'No examples created';
//         const validParams = parameters.filter(p => p.name.trim());
//         const incompleteExamples = examples.filter(example => {
//           const allInputsFilled = validParams.every(param => !isEmpty(example.inputs[param.name]));
//           const outputFilled = !isEmpty(example.expectedOutput);
//           const explanationFilled = !isEmpty(example.explanation);
//           return !(allInputsFilled && outputFilled && explanationFilled);
//         });
//         if (incompleteExamples.length === examples.length) {
//           return 'At least one complete example required (all inputs, output, and explanation)';
//         }
//         return '';
//       case 4:
//         const validTestCases = testCases.filter(tc => {
//           const validParams = parameters.filter(p => p.name.trim());
//           const allInputsFilled = validParams.every(param => !isEmpty(tc.inputs[param.name]));
//           return allInputsFilled && !isEmpty(tc.expectedOutput);
//         });
//         if (validTestCases.length < 5) return `Need at least 5 complete test cases (have ${validTestCases.length})`;
//         return '';
//       default:
//         return '';
//     }
//   };

//   const nextTab = () => {
//     if (currentTabIndex < TAB_SEQUENCE.length - 1 && canGoNext()) {
//       setCurrentTabIndex(currentTabIndex + 1);
//     }
//   };

//   const prevTab = () => {
//     if (currentTabIndex > 0) {
//       setCurrentTabIndex(currentTabIndex - 1);
//     }
//   };

//   // Final validation and submit
//   const validateForm = () => {
//     const newErrors: { [key: string]: string } = {};

//     if (!title.trim()) newErrors.title = 'Problem name is required';
//     if (!description.trim()) newErrors.description = 'Problem description is required';
//     if (!functionName.trim()) newErrors.functionName = 'Function name is required';
//     if (!isValidName(functionName)) newErrors.functionName = 'Function name can only contain letters, numbers, and underscore (no spaces)';

//     parameters.forEach((param, index) => {
//       if (!param.name.trim()) newErrors[`param_${index}_name`] = 'Parameter name is required';
//       if (!isValidName(param.name)) newErrors[`param_${index}_name`] = 'Parameter name can only contain letters, numbers, and underscore (no spaces)';
//       if (!param.type) newErrors[`param_${index}_type`] = 'Parameter type is required';
//     });

//     if (!validateExamples()) newErrors.examples = 'At least one complete example is required';

//     const validTestCases = testCases.filter(tc => {
//       const validParams = parameters.filter(p => p.name.trim());
//       const allInputsFilled = validParams.every(param => !isEmpty(tc.inputs[param.name]));
//       return allInputsFilled && !isEmpty(tc.expectedOutput);
//     });
//     if (validTestCases.length < 5) newErrors.testCases = 'At least 5 complete test cases are required';

//     const nonEmptyTags = tags.filter(tag => tag.trim());
//     if (nonEmptyTags.length === 0) newErrors.tags = 'At least one tag is required';

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async () => {
//     if (validateForm()) {
//       const problemData = {
//         title: title.trim(),
//         difficulty,
//         description: description.trim(),
//         functionName: functionName.trim(),
//         returnType,
//         parameters: parameters.filter(p => p.name.trim()),
//         parameterConstraints,
//         examples: examples.filter(ex => {
//           const validParams = parameters.filter(p => p.name.trim());
//           const allInputsFilled = validParams.every(param => !isEmpty(ex.inputs[param.name]));
//           return allInputsFilled && !isEmpty(ex.expectedOutput) && !isEmpty(ex.explanation);
//         }),
//         testCases: testCases.filter(tc => {
//           const validParams = parameters.filter(p => p.name.trim());
//           const allInputsFilled = validParams.every(param => !isEmpty(tc.inputs[param.name]));
//           return allInputsFilled && !isEmpty(tc.expectedOutput);
//         }),
//         tags: tags.filter(tag => tag.trim()),
//         hints: hints.filter(hint => hint.trim()),
//         companies: companies.filter(company => company.trim()),
//         isActive
//       };

//       try {
//         const res = await httpClient.post(`admin/problems/create-problem`, problemData);
//         if (res.data.success) {
//           toast.success("Problem created successfully!");
//           navigate("/admin/problems");
//         }
//       } catch (error: unknown) {
//         if (axios.isAxiosError(error)) {
//           toast.error(error.response?.data.message || "Failed to create problem");
//         } else {
//           console.log("Unexpected error:", error);
//         }
//       }
//     }
//   };

//   const currentTab = TAB_SEQUENCE[currentTabIndex];

//   return (
//     <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
//       <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
//           <h1 className="text-3xl font-bold text-white mb-2">Create New Problem</h1>
//           <p className="text-blue-100">Step {currentTabIndex + 1} of {TAB_SEQUENCE.length}: {currentTab.title}</p>
//         </div>

//         {/* Progress Bar */}
//         <div className="p-6 bg-gray-50 border-b">
//           <div className="flex items-center justify-between mb-4">
//             {TAB_SEQUENCE.map((tab, index) => (
//               <div key={tab.id} className="flex items-center">
//                 <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
//                   index <= currentTabIndex 
//                     ? 'bg-blue-600 border-blue-600 text-white' 
//                     : 'bg-white border-gray-300 text-gray-400'
//                 }`}>
//                   <tab.icon className="w-5 h-5" />
//                 </div>
//                 {index < TAB_SEQUENCE.length - 1 && (
//                   <div className={`h-1 w-20 ml-2 transition-colors ${
//                     index < currentTabIndex ? 'bg-blue-600' : 'bg-gray-300'
//                   }`} />
//                 )}
//               </div>
//             ))}
//           </div>
//           <h2 className="text-xl font-semibold text-gray-700">{currentTab.title}</h2>
//         </div>

//         <div className="p-8 min-h-96">
//           {/* Basic Information Tab */}
//           {currentTabIndex === 0 && (
//             <div className="space-y-6">
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 <div className="space-y-6">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-3">
//                       Problem Title *
//                     </label>
//                     <input
//                       type="text"
//                       value={title}
//                       onChange={(e) => setTitle(e.target.value)}
//                       className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
//                         errors.title ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
//                       }`}
//                       placeholder="Two Sum"
//                       onBlur={() => {
//                         if (!title.trim()) {
//                           setErrors(prev => ({ ...prev, title: 'Problem name is required' }));
//                         } else {
//                           setErrors(prev => ({ ...prev, title: '' }));
//                         }
//                       }}
//                     />
//                     {errors.title && <p className="text-red-500 text-sm mt-2">{errors.title}</p>}
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-3">
//                       Difficulty Level *
//                     </label>
//                     <select
//                       value={difficulty}
//                       onChange={(e) => setDifficulty(e.target.value)}
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                     >
//                       <option value="easy">🟢 Easy</option>
//                       <option value="medium">🟡 Medium</option>
//                       <option value="hard">🔴 Hard</option>
//                     </select>
//                   </div>

//                   <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
//                     <input
//                       type="checkbox"
//                       id="isActive"
//                       checked={isActive}
//                       onChange={(e) => setIsActive(e.target.checked)}
//                       className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
//                     />
//                     <label htmlFor="isActive" className="text-sm font-medium text-blue-900">
//                       Make problem active immediately
//                     </label>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-3">
//                     Problem Description *
//                   </label>
//                   <textarea
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                     rows={10}
//                     className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
//                       errors.description ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
//                     }`}
//                     placeholder="Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target..."
//                     onBlur={() => {
//                       if (!description.trim()) {
//                         setErrors(prev => ({ ...prev, description: 'Problem description is required' }));
//                       } else {
//                         setErrors(prev => ({ ...prev, description: '' }));
//                       }
//                     }}
//                   />
//                   {errors.description && <p className="text-red-500 text-sm mt-2">{errors.description}</p>}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Function Definition Tab */}
//           {currentTabIndex === 1 && (
//             <div className="space-y-8">
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 <div className="space-y-6">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-3">
//                       Function Name * <span className="text-xs text-gray-500">(no spaces allowed)</span>
//                     </label>
//                     <input
//                       type="text"
//                       value={functionName}
//                       onChange={(e) => {
//                         // Prevent spaces from being entered
//                         if (!e.target.value.includes(' ')) {
//                           setFunctionName(e.target.value);
//                         }
//                       }}
//                       className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-mono ${
//                         errors.functionName ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
//                       }`}
//                       placeholder="twoSum"
//                       onBlur={() => {
//                         if (!functionName.trim()) {
//                           setErrors(prev => ({ ...prev, functionName: 'Function name is required' }));
//                         } else if (!isValidName(functionName)) {
//                           setErrors(prev => ({ ...prev, functionName: 'Function name can only contain letters, numbers, and underscore (no spaces)' }));
//                         } else {
//                           setErrors(prev => ({ ...prev, functionName: '' }));
//                         }
//                       }}
//                     />
//                     {errors.functionName && <p className="text-red-500 text-sm mt-2">{errors.functionName}</p>}
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-3">
//                       Return Type *
//                     </label>
//                     <select
//                       value={returnType}
//                       onChange={(e) => setReturnType(e.target.value)}
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                     >
//                       {SUPPORTED_TYPES.map(type => (
//                         <option key={type} value={type}>{type}</option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Parameters */}
//                   <div>
//                     <div className="flex justify-between items-center mb-4">
//                       <h3 className="text-lg font-semibold text-gray-700">Parameters *</h3>
//                       <button
//                         type="button"
//                         onClick={addParameter}
//                         className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-md hover:shadow-lg"
//                       >
//                         <Plus className="w-4 h-4 mr-2" />
//                         Add Parameter
//                       </button>
//                     </div>

//                     <div className="space-y-4">
//                       {parameters.map((param, index) => (
//                         <div key={param.id} className="p-6 border-2 border-gray-100 rounded-lg bg-gray-50">
//                           <div className="flex justify-between items-center mb-4">
//                             <h4 className="font-medium text-gray-700 text-lg">Parameter {index + 1}</h4>
//                             {parameters.length > 1 && (
//                               <button
//                                 type="button"
//                                 onClick={() => removeParameter(param.id)}
//                                 className="text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-50 rounded"
//                               >
//                                 <X className="w-5 h-5" />
//                               </button>
//                             )}
//                           </div>

//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                               <label className="block text-sm font-medium text-gray-600 mb-2">
//                                 Name * <span className="text-xs text-gray-500">(no spaces)</span>
//                               </label>
//                               <input
//                                 type="text"
//                                 value={param.name}
//                                 onChange={(e) => {
//                                   // Prevent spaces from being entered
//                                   if (!e.target.value.includes(' ')) {
//                                     updateParameter(param.id, 'name', e.target.value);
//                                   }
//                                 }}
//                                 className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono transition-colors ${
//                                   errors[`param_${index}_name`] ? 'border-red-500' : 'border-gray-300'
//                                 }`}
//                                 placeholder="nums"
//                                 onBlur={() => {
//                                   if (!param.name.trim()) {
//                                     setErrors(prev => ({ ...prev, [`param_${index}_name`]: 'Parameter name is required' }));
//                                   } else if (!isValidName(param.name)) {
//                                     setErrors(prev => ({ ...prev, [`param_${index}_name`]: 'Parameter name can only contain letters, numbers, and underscore (no spaces)' }));
//                                   } else {
//                                     setErrors(prev => ({ ...prev, [`param_${index}_name`]: '' }));
//                                   }
//                                 }}
//                               />
//                               {errors[`param_${index}_name`] && (
//                                 <p className="text-red-500 text-xs mt-1">{errors[`param_${index}_name`]}</p>
//                               )}
//                             </div>

//                             <div>
//                               <label className="block text-sm font-medium text-gray-600 mb-2">Type *</label>
//                               <select
//                                 value={param.type}
//                                 onChange={(e) => updateParameter(param.id, 'type', e.target.value)}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
//                               >
//                                 {SUPPORTED_TYPES.map(type => (
//                                   <option key={type} value={type}>{type}</option>
//                                 ))}
//                               </select>
//                             </div>
//                           </div>

//                           <div className="mt-4">
//                             <label className="block text-sm font-medium text-gray-600 mb-2">Description</label>
//                             <input
//                               type="text"
//                               value={param.description}
//                               onChange={(e) => updateParameter(param.id, 'description', e.target.value)}
//                               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
//                               placeholder="Array of integers"
//                             />
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Function Signature Preview */}
//                 <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
//                   <h3 className="text-lg font-semibold text-gray-700 mb-6 flex items-center">
//                     <Code className="w-5 h-5 mr-2" />
//                     Function Signature Preview
//                   </h3>
                  
//                   <div className="space-y-4">
//                     {['typescript', 'java', 'python', 'cpp'].map((lang) => (
//                       <div key={lang} className="bg-white rounded-lg p-4 border border-gray-300 shadow-sm">
//                         <div className="flex items-center justify-between mb-3">
//                           <span className="text-sm font-semibold text-gray-600 capitalize bg-gray-100 px-2 py-1 rounded">{lang}</span>
//                           <Code className="w-4 h-4 text-gray-400" />
//                         </div>
//                         <pre className="text-sm text-gray-800 font-mono bg-gray-50 p-3 rounded border overflow-x-auto">
//                           {generateFunctionSignature(lang as any) || 'Complete function definition to see preview'}
//                         </pre>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Constraints Tab */}
//           {currentTabIndex === 2 && (
//             <div className="space-y-6">
//               <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
//                 <div className="flex items-center">
//                   <AlertCircle className="w-5 h-5 text-blue-600 mr-2" />
//                   <p className="text-blue-800 text-sm">
//                     Define constraints for each parameter. These will be used to validate examples and test cases.
//                   </p>
//                 </div>
//               </div>

//               {parameterConstraints.map((constraint, index) => (
//                 <div key={constraint.parameterName} className="border-2 border-gray-200 rounded-lg p-6 bg-white">
//                   <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
//                     <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-mono mr-3">
//                       {constraint.parameterName}
//                     </span>
//                     <span className="text-gray-500 text-sm">({constraint.type})</span>
//                   </h3>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {/* Number constraints */}
//                     {constraint.type === 'number' && (
//                       <>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-600 mb-2">Minimum Value</label>
//                           <input
//                             type="number"
//                             value={constraint.minValue || ''}
//                             onChange={(e) => updateConstraint(constraint.parameterName, 'minValue', parseFloat(e.target.value) || undefined)}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             placeholder="-1000000000"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-600 mb-2">Maximum Value</label>
//                           <input
//                             type="number"
//                             value={constraint.maxValue || ''}
//                             onChange={(e) => updateConstraint(constraint.parameterName, 'maxValue', parseFloat(e.target.value) || undefined)}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             placeholder="1000000000"
//                           />
//                         </div>
//                       </>
//                     )}

//                     {/* String constraints */}
//                     {constraint.type === 'string' && (
//                       <>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-600 mb-2">Minimum Length</label>
//                           <input
//                             type="number"
//                             value={constraint.minLength || ''}
//                             onChange={(e) => updateConstraint(constraint.parameterName, 'minLength', parseInt(e.target.value) || undefined)}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             placeholder="1"
//                             min="0"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-600 mb-2">Maximum Length</label>
//                           <input
//                             type="number"
//                             value={constraint.maxLength || ''}
//                             onChange={(e) => updateConstraint(constraint.parameterName, 'maxLength', parseInt(e.target.value) || undefined)}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             placeholder="1000"
//                             min="1"
//                           />
//                         </div>
//                       </>
//                     )}

//                     {/* Array constraints */}
//                     {constraint.type.includes('[]') && (
//                       <>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-600 mb-2">Array Min Length</label>
//                           <input
//                             type="number"
//                             value={constraint.arrayMinLength || ''}
//                             onChange={(e) => updateConstraint(constraint.parameterName, 'arrayMinLength', parseInt(e.target.value) || undefined)}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             placeholder="1"
//                             min="0"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-600 mb-2">Array Max Length</label>
//                           <input
//                             type="number"
//                             value={constraint.arrayMaxLength || ''}
//                             onChange={(e) => updateConstraint(constraint.parameterName, 'arrayMaxLength', parseInt(e.target.value) || undefined)}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             placeholder="10000"
//                             min="1"
//                           />
//                         </div>

//                         {/* Element constraints for arrays */}
//                         {(constraint.type === 'number[]' || constraint.type === 'number[][]') && (
//                           <>
//                             <div>
//                               <label className="block text-sm font-medium text-gray-600 mb-2">Element Min Value</label>
//                               <input
//                                 type="number"
//                                 value={constraint.elementConstraints?.minValue || ''}
//                                 onChange={(e) => updateElementConstraint(constraint.parameterName, 'minValue', parseFloat(e.target.value) || undefined)}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 placeholder="-1000000000"
//                               />
//                             </div>
//                             <div>
//                               <label className="block text-sm font-medium text-gray-600 mb-2">Element Max Value</label>
//                               <input
//                                 type="number"
//                                 value={constraint.elementConstraints?.maxValue || ''}
//                                 onChange={(e) => updateElementConstraint(constraint.parameterName, 'maxValue', parseFloat(e.target.value) || undefined)}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 placeholder="1000000000"
//                               />
//                             </div>
//                           </>
//                         )}

//                         {constraint.type === 'string[]' && (
//                           <>
//                             <div>
//                               <label className="block text-sm font-medium text-gray-600 mb-2">Element Min Length</label>
//                               <input
//                                 type="number"
//                                 value={constraint.elementConstraints?.minLength || ''}
//                                 onChange={(e) => updateElementConstraint(constraint.parameterName, 'minLength', parseInt(e.target.value) || undefined)}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 placeholder="1"
//                                 min="0"
//                               />
//                             </div>
//                             <div>
//                               <label className="block text-sm font-medium text-gray-600 mb-2">Element Max Length</label>
//                               <input
//                                 type="number"
//                                 value={constraint.elementConstraints?.maxLength || ''}
//                                 onChange={(e) => updateElementConstraint(constraint.parameterName, 'maxLength', parseInt(e.target.value) || undefined)}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 placeholder="100"
//                                 min="1"
//                               />
//                             </div>
//                           </>
//                         )}
//                       </>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Examples Tab */}
//           {currentTabIndex === 3 && (
//             <div className="space-y-6">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h2 className="text-xl font-semibold text-gray-700">Examples</h2>
//                   <p className="text-sm text-gray-500 mt-1">Create 1-3 examples to help users understand the problem</p>
//                 </div>
//                 {examples.length < 3 && (
//                   <button
//                     type="button"
//                     onClick={addExample}
//                     className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-md hover:shadow-lg"
//                   >
//                     <Plus className="w-4 h-4 mr-2" />
//                     Add Example
//                   </button>
//                 )}
//               </div>

//               {errors.examples && <p className="text-red-500 text-sm">{errors.examples}</p>}

//               <div className="space-y-6">
//                 {examples.map((example, index) => (
//                   <div key={example.id} className="border-2 border-gray-200 rounded-lg p-6 bg-white hover:border-green-300 transition-colors">
//                     <div className="flex justify-between items-center mb-6">
//                       <h3 className="font-semibold text-gray-700 text-lg flex items-center">
//                         <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm mr-3">
//                           Example {index + 1}
//                         </span>
//                       </h3>
//                       {examples.length > 1 && (
//                         <button
//                           type="button"
//                           onClick={() => removeExample(example.id)}
//                           className="text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-50 rounded"
//                         >
//                           <X className="w-5 h-5" />
//                         </button>
//                       )}
//                     </div>

//                     {/* Parameter Inputs */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                       <div className="space-y-4">
//                         <h4 className="font-medium text-gray-600 border-b pb-2">Input Parameters</h4>
//                         {parameters.filter(p => p.name.trim()).map((param) => (
//                           <div key={param.id}>
//                             <label className="block text-sm font-medium text-gray-600 mb-2">
//                               {param.name} <span className="text-gray-400">({param.type})</span>
//                             </label>
//                             {generateInputField(
//                               param,
//                               example.inputs[param.name],
//                               (value) => updateExampleInput(example.id, param.name, value)
//                             )}
//                           </div>
//                         ))}
//                       </div>

//                       <div>
//                         <h4 className="font-medium text-gray-600 border-b pb-2 mb-4">Expected Output</h4>
//                         <label className="block text-sm font-medium text-gray-600 mb-2">
//                           Result <span className="text-gray-400">({returnType})</span>
//                         </label>
//                         {generateInputField(
//                           { name: 'output', type: returnType, description: '', id: 'output' },
//                           example.expectedOutput,
//                           (value) => updateExampleOutput(example.id, value),
//                           'Expected result'
//                         )}
//                       </div>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-600 mb-2">Explanation *</label>
//                       <textarea
//                         value={example.explanation}
//                         onChange={(e) => updateExampleExplanation(example.id, e.target.value)}
//                         rows={3}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
//                         placeholder="Explain how the output is derived from the input..."
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Test Cases Tab */}
//           {currentTabIndex === 4 && (
//             <div className="space-y-6">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h2 className="text-xl font-semibold text-gray-700">Test Cases</h2>
//                   <p className="text-sm text-gray-500 mt-1">Create comprehensive test cases to validate solutions (minimum 5 required)</p>
//                 </div>
//                 <button
//                   type="button"
//                   onClick={addTestCase}
//                   className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors shadow-md hover:shadow-lg"
//                 >
//                   <Plus className="w-4 h-4 mr-2" />
//                   Add Test Case
//                 </button>
//               </div>

//               {errors.testCases && <p className="text-red-500 text-sm">{errors.testCases}</p>}

//               <div className="space-y-4">
//                 {testCases.map((testCase, index) => (
//                   <div key={testCase.id} className="border-2 border-gray-200 rounded-lg p-6 bg-white hover:border-purple-300 transition-colors">
//                     <div className="flex justify-between items-center mb-4">
//                       <h3 className="font-medium text-gray-700 flex items-center">
//                         <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm mr-3">
//                           Test Case {index + 1}
//                         </span>
//                       </h3>
//                       <div className="flex items-center space-x-3">
//                         <label className="flex items-center space-x-2 text-sm text-gray-600">
//                           <input
//                             type="checkbox"
//                             checked={testCase.isSample}
//                             onChange={(e) => updateTestCaseSample(testCase.id, e.target.checked)}
//                             className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
//                           />
//                           <span>Sample (visible in examples)</span>
//                         </label>
//                         {testCases.length > 5 && (
//                           <button
//                             type="button"
//                             onClick={() => removeTestCase(testCase.id)}
//                             className="text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-50 rounded"
//                           >
//                             <X className="w-4 h-4" />
//                           </button>
//                         )}
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                       <div className="space-y-4">
//                         <h4 className="font-medium text-gray-600 border-b pb-2">Input Parameters</h4>
//                         {parameters.filter(p => p.name.trim()).map((param) => (
//                           <div key={param.id}>
//                             <label className="block text-sm font-medium text-gray-600 mb-2">
//                               {param.name} <span className="text-gray-400">({param.type})</span>
//                             </label>
//                             {generateInputField(
//                               param,
//                               testCase.inputs[param.name],
//                               (value) => updateTestCaseInput(testCase.id, param.name, value)
//                             )}
//                           </div>
//                         ))}
//                       </div>

//                       <div>
//                         <h4 className="font-medium text-gray-600 border-b pb-2 mb-4">Expected Output</h4>
//                         <label className="block text-sm font-medium text-gray-600 mb-2">
//                           Result <span className="text-gray-400">({returnType})</span>
//                         </label>
//                         {generateInputField(
//                           { name: 'output', type: returnType, description: '', id: 'output' },
//                           testCase.expectedOutput,
//                           (value) => updateTestCaseOutput(testCase.id, value),
//                           'Expected result'
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Metadata Tab */}
//           {currentTabIndex === 5 && (
//             <div className="space-y-8">
//               {/* Tags */}
//               <div>
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-xl font-semibold text-gray-700 flex items-center">
//                     <Tag className="w-5 h-5 mr-2" />
//                     Tags *
//                   </h2>
//                   <button
//                     type="button"
//                     onClick={() => addToArray(tags, setTags)}
//                     className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
//                   >
//                     <Plus className="w-4 h-4 mr-2" />
//                     Add Tag
//                   </button>
//                 </div>

//                 {errors.tags && <p className="text-red-500 text-sm mb-3">{errors.tags}</p>}

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                   {tags.map((tag, index) => (
//                     <div key={index} className="flex items-center space-x-2">
//                       <input
//                         type="text"
//                         value={tag}
//                         onChange={(e) => updateArray(tags, setTags, index, e.target.value)}
//                         className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
//                         placeholder="Array, Hash Table, Two Pointers"
//                       />
//                       {tags.length > 1 && (
//                         <button
//                           type="button"
//                           onClick={() => removeFromArray(tags, setTags, index)}
//                           className="text-red-500 hover:text-red-700 transition-colors"
//                         >
//                           <Minus className="w-5 h-5" />
//                         </button>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Hints */}
//               <div>
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-xl font-semibold text-gray-700 flex items-center">
//                     <Lightbulb className="w-5 h-5 mr-2" />
//                     Hints (Optional)
//                   </h2>
//                   <button
//                     type="button"
//                     onClick={() => addToArray(hints, setHints)}
//                     className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
//                   >
//                     <Plus className="w-4 h-4 mr-2" />
//                     Add Hint
//                   </button>
//                 </div>

//                 <div className="space-y-3">
//                   {hints.map((hint, index) => (
//                     <div key={index} className="flex items-center space-x-2">
//                       <input
//                         type="text"
//                         value={hint}
//                         onChange={(e) => updateArray(hints, setHints, index, e.target.value)}
//                         className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
//                         placeholder="A really brute force way would be to search for all possible pairs of numbers..."
//                       />
//                       {hints.length > 1 && (
//                         <button
//                           type="button"
//                           onClick={() => removeFromArray(hints, setHints, index)}
//                           className="text-red-500 hover:text-red-700 transition-colors"
//                         >
//                           <Minus className="w-5 h-5" />
//                         </button>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Companies */}
//               <div>
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-xl font-semibold text-gray-700 flex items-center">
//                     <Building className="w-5 h-5 mr-2" />
//                     Companies (Optional)
//                   </h2>
//                   <button
//                     type="button"
//                     onClick={() => addToArray(companies, setCompanies)}
//                     className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
//                   >
//                     <Plus className="w-4 h-4 mr-2" />
//                     Add Company
//                   </button>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                   {companies.map((company, index) => (
//                     <div key={index} className="flex items-center space-x-2">
//                       <input
//                         type="text"
//                         value={company}
//                         onChange={(e) => updateArray(companies, setCompanies, index, e.target.value)}
//                         className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
//                         placeholder="Google, Microsoft, Amazon, Apple"
//                       />
//                       {companies.length > 1 && (
//                         <button
//                           type="button"
//                           onClick={() => removeFromArray(companies, setCompanies, index)}
//                           className="text-red-500 hover:text-red-700 transition-colors"
//                         >
//                           <Minus className="w-5 h-5" />
//                         </button>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Footer Navigation */}
//         <div className="p-6 bg-gray-50 border-t flex justify-between items-center">
//           <button
//             type="button"
//             onClick={prevTab}
//             disabled={currentTabIndex === 0}
//             className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
//               currentTabIndex === 0
//                 ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
//                 : 'bg-gray-600 text-white hover:bg-gray-700 shadow-md hover:shadow-lg'
//             }`}
//           >
//             <ChevronLeft className="w-5 h-5 mr-2" />
//             Previous
//           </button>

//           <div className="text-center">
//             <div className="text-sm text-gray-500">
//               Step {currentTabIndex + 1} of {TAB_SEQUENCE.length}
//             </div>
//             {!canGoNext() && currentTabIndex < TAB_SEQUENCE.length - 1 && (
//               <div className="text-xs text-red-500 mt-1">
//                 {getValidationMessage()}
//               </div>
//             )}
//           </div>

//           {currentTabIndex === TAB_SEQUENCE.length - 1 ? (
//             <button
//               type="button"
//               onClick={handleSubmit}
//               className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
//             >
//               <Check className="w-5 h-5 mr-2" />
//               Create Problem
//             </button>
//           ) : (
//             <button
//               type="button"
//               onClick={nextTab}
//               disabled={!canGoNext()}
//               className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
//                 canGoNext()
//                   ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
//                   : 'bg-gray-200 text-gray-400 cursor-not-allowed'
//               }`}
//             >
//               Next
//               <ChevronRight className="w-5 h-5 ml-2" />
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddProblem;












import React, { useState, useEffect } from 'react';
import { Plus, Minus, Check, X, Tag, Lightbulb, Building, Code, Settings, Eye, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import httpClient from '../../../services/axios/httpClient';
import { useNavigate } from 'react-router-dom';

interface Parameter {
  id: string;
  name: string;
  type: string;
  description: string;
}

interface ParameterConstraint {
  parameterName: string;
  type: string;
  // For numbers
  minValue?: number;
  maxValue?: number;
  // For strings
  minLength?: number;
  maxLength?: number;
  allowedChars?: string;
  // For arrays
  arrayMinLength?: number;
  arrayMaxLength?: number;
  elementConstraints?: {
    minValue?: number;
    maxValue?: number;
    minLength?: number;
    maxLength?: number;
  };
}

interface ParameterValue {
  [parameterName: string]: any;
}

interface Example {
  id: string;
  inputs: ParameterValue;
  expectedOutput: any;
  explanation: string;
}

interface TestCase {
  id: string;
  inputs: ParameterValue;
  expectedOutput: any;
  isSample: boolean;
}

const SUPPORTED_TYPES = [
  'number',
  'string',
  'boolean',
  'number[]',
  'string[]',
  'boolean[]',
  'number[][]',
  'string[][]',
  'TreeNode',
  'ListNode',
  'object'
];

const TAB_SEQUENCE = [
  { id: 'basic', title: 'Basic Info', icon: Settings },
  { id: 'function', title: 'Function Definition', icon: Code },
  { id: 'constraints', title: 'Constraints', icon: AlertCircle },
  { id: 'examples', title: 'Examples', icon: Eye },
  { id: 'testcases', title: 'Test Cases', icon: Check },
  { id: 'metadata', title: 'Tags & Metadata', icon: Tag }
];

const AddProblem = () => {
  const navigate = useNavigate();
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  // Basic Information
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Function Definition
  const [functionName, setFunctionName] = useState('');
  const [returnType, setReturnType] = useState('number');
  const [parameters, setParameters] = useState<Parameter[]>([
    { id: '1', name: '', type: 'number', description: '' }
  ]);

  // Constraints
  const [parameterConstraints, setParameterConstraints] = useState<ParameterConstraint[]>([]);

  // Examples and Test Cases
  const [examples, setExamples] = useState<Example[]>([]);
  const [testCases, setTestCases] = useState<TestCase[]>([]);

  // Additional Fields
  const [tags, setTags] = useState<string[]>(['']);
  const [hints, setHints] = useState<string[]>(['']);
  const [companies, setCompanies] = useState<string[]>(['']);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Auto-generate constraints when parameters change
  useEffect(() => {
    if (parameters.length > 0 && parameters.some(p => p.name.trim())) {
      const newConstraints = parameters
        .filter(p => p.name.trim())
        .map(p => {
          // Check if constraint already exists for this parameter
          const existingConstraint = parameterConstraints.find(c => c.parameterName === p.name);
          
          if (existingConstraint) {
            // Update existing constraint type if parameter type changed
            return { ...existingConstraint, type: p.type };
          }
          
          // Create new constraint
          return {
            parameterName: p.name,
            type: p.type,
            minValue: p.type === 'number' ? -1000000000 : undefined,
            maxValue: p.type === 'number' ? 1000000000 : undefined,
            minLength: p.type === 'string' ? 1 : undefined,
            maxLength: p.type === 'string' ? 1000 : undefined,
            arrayMinLength: p.type.includes('[]') ? 1 : undefined,
            arrayMaxLength: p.type.includes('[]') ? 10000 : undefined,
            elementConstraints: p.type.includes('[]') ? {
              minValue: p.type === 'number[]' || p.type === 'number[][]' ? -1000000000 : undefined,
              maxValue: p.type === 'number[]' || p.type === 'number[][]' ? 1000000000 : undefined,
              minLength: p.type === 'string[]' ? 1 : undefined,
              maxLength: p.type === 'string[]' ? 100 : undefined
            } : undefined
          };
        });
      
      setParameterConstraints(newConstraints);
    }
  }, [parameters]);

  // Auto-generate examples when constraints are set
  useEffect(() => {
    if (parameterConstraints.length > 0 && parameters.some(p => p.name.trim())) {
      const validParams = parameters.filter(p => p.name.trim());
      
      // Update existing examples to match current parameters
      if (examples.length > 0) {
        const updatedExamples = examples.map(example => {
          const newInputs: ParameterValue = {};
          validParams.forEach(p => {
            // Keep existing value if parameter still exists, otherwise set empty
            newInputs[p.name] = example.inputs[p.name] !== undefined ? example.inputs[p.name] : '';
          });
          return { ...example, inputs: newInputs };
        });
        setExamples(updatedExamples);
      } else {
        // Create first example
        const initialInputs: ParameterValue = {};
        validParams.forEach(p => {
          initialInputs[p.name] = '';
        });
        
        setExamples([{
          id: '1',
          inputs: initialInputs,
          expectedOutput: '',
          explanation: ''
        }]);
      }

      // Update existing test cases or create new ones
      if (testCases.length > 0) {
        const updatedTestCases = testCases.map(testCase => {
          const newInputs: ParameterValue = {};
          validParams.forEach(p => {
            // Keep existing value if parameter still exists, otherwise set empty
            newInputs[p.name] = testCase.inputs[p.name] !== undefined ? testCase.inputs[p.name] : '';
          });
          return { ...testCase, inputs: newInputs };
        });
        setTestCases(updatedTestCases);
      } else {
        // Create initial test cases
        const initialTestCases = [];
        for (let i = 1; i <= 5; i++) {
          const inputs: ParameterValue = {};
          validParams.forEach(p => {
            inputs[p.name] = '';
          });
          
          initialTestCases.push({
            id: i.toString(),
            inputs,
            expectedOutput: '',
            isSample: false
          });
        }
        setTestCases(initialTestCases);
      }
    }
  }, [parameterConstraints]);

  // Validation function for names (no spaces, only alphanumeric and underscore)
  const isValidName = (name: string) => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);

  // Check if a value is empty (handles different types)
  const isEmpty = (value: any): boolean => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (typeof value === 'number') return isNaN(value);
    if (Array.isArray(value)) return value.length === 0;
    return false;
  };

  // Generate function signature
  const generateFunctionSignature = (language: 'typescript' | 'java' | 'python' | 'cpp') => {
    if (!functionName || parameters.some(p => !p.name || !p.type)) return '';
    
    const typeMap: { [key: string]: { [lang: string]: string } } = {
      'number': { typescript: 'number', java: 'int', python: 'int', cpp: 'int' },
      'string': { typescript: 'string', java: 'String', python: 'str', cpp: 'string' },
      'boolean': { typescript: 'boolean', java: 'boolean', python: 'bool', cpp: 'bool' },
      'number[]': { typescript: 'number[]', java: 'int[]', python: 'List[int]', cpp: 'vector<int>' },
      'string[]': { typescript: 'string[]', java: 'String[]', python: 'List[str]', cpp: 'vector<string>' },
      'number[][]': { typescript: 'number[][]', java: 'int[][]', python: 'List[List[int]]', cpp: 'vector<vector<int>>' }
    };

    const validParams = parameters.filter(p => p.name.trim() && p.type);
    const params = validParams.map(p => {
        const mappedType = typeMap[p.type]?.[language] || p.type;
        switch (language) {
          case 'typescript':
            return `${p.name}: ${mappedType}`;
          case 'java':
            return `${mappedType} ${p.name}`;
          case 'python':
            return `${p.name}: ${mappedType}`;
          case 'cpp':
            return `${mappedType} ${p.name}`;
          default:
            return `${p.name}: ${mappedType}`;
        }
      })
      .join(', ');

    const mappedReturnType = typeMap[returnType]?.[language] || returnType;

    switch (language) {
      case 'typescript':
        return `function ${functionName}(${params}): ${mappedReturnType}`;
      case 'java':
        return `public ${mappedReturnType} ${functionName}(${params})`;
      case 'python':
        return `def ${functionName}(${params}) -> ${mappedReturnType}:`;
      case 'cpp':
        return `${mappedReturnType} ${functionName}(${params})`;
      default:
        return `${functionName}(${params}): ${mappedReturnType}`;
    }
  };

  // Parameter management - FIX: Use functional state updates to prevent interference
  const addParameter = () => {
    const newId = Date.now().toString(); // Use timestamp for unique IDs
    setParameters(prev => [...prev, { id: newId, name: '', type: 'number', description: '' }]);
  };

  const removeParameter = (id: string) => {
    setParameters(prev => {
      if (prev.length > 1) {
        return prev.filter(param => param.id !== id);
      }
      return prev;
    });
  };

  // FIX: Improved parameter update function to prevent cross-contamination
  const updateParameter = (id: string, field: keyof Parameter, value: string) => {
    // Validate name field for no spaces
    if (field === 'name' && value.includes(' ')) {
      return; // Don't update if spaces are present
    }
    
    setParameters(prev => prev.map(param => {
      if (param.id === id) {
        return { ...param, [field]: value };
      }
      return param; // Return unchanged parameter
    }));
  };

  // Constraint management
  const updateConstraint = (parameterName: string, field: string, value: any) => {
    setParameterConstraints(prev => 
      prev.map(constraint => 
        constraint.parameterName === parameterName 
          ? { ...constraint, [field]: value }
          : constraint
      )
    );
  };

  const updateElementConstraint = (parameterName: string, field: string, value: any) => {
    setParameterConstraints(prev => 
      prev.map(constraint => 
        constraint.parameterName === parameterName 
          ? { 
              ...constraint, 
              elementConstraints: { 
                ...constraint.elementConstraints, 
                [field]: value 
              }
            }
          : constraint
      )
    );
  };

  // Example management
  const addExample = () => {
    if (examples.length < 3) {
      const initialInputs: ParameterValue = {};
      parameters.filter(p => p.name.trim()).forEach(p => {
        initialInputs[p.name] = '';
      });
      
      const newId = Date.now().toString();
      setExamples(prev => [...prev, { id: newId, inputs: initialInputs, expectedOutput: '', explanation: '' }]);
      
    }
  };

  const removeExample = (id: string) => {
    if (examples.length > 1) {
      setExamples(prev => prev.filter(example => example.id !== id));
    }
  };

  const updateExampleInput = (id: string, parameterName: string, value: any) => {
    setExamples(prev => prev.map(example =>
      example.id === id 
        ? { ...example, inputs: { ...example.inputs, [parameterName]: value } }
        : example
    ));
  };

  const updateExampleOutput = (id: string, value: any) => {
    setExamples(prev => prev.map(example =>
      example.id === id ? { ...example, expectedOutput: value } : example
    ));
  };

  const updateExampleExplanation = (id: string, value: string) => {
    setExamples(prev => prev.map(example =>
      example.id === id ? { ...example, explanation: value } : example
    ));
  };

  // Test case management
  const addTestCase = () => {
    const initialInputs: ParameterValue = {};
    parameters.filter(p => p.name.trim()).forEach(p => {
      initialInputs[p.name] = '';
    });
    
    const newId = Date.now().toString();
    setTestCases(prev => [...prev, { id: newId, inputs: initialInputs, expectedOutput: '', isSample: false }]);
  };

  const removeTestCase = (id: string) => {
    if (testCases.length > 5) {
      setTestCases(prev => prev.filter(testCase => testCase.id !== id));
    }
  };

  const updateTestCaseInput = (id: string, parameterName: string, value: any) => {
    setTestCases(prev => prev.map(testCase =>
      testCase.id === id 
        ? { ...testCase, inputs: { ...testCase.inputs, [parameterName]: value } }
        : testCase
    ));
  };

  const updateTestCaseOutput = (id: string, value: any) => {
    setTestCases(prev => prev.map(testCase =>
      testCase.id === id ? { ...testCase, expectedOutput: value } : testCase
    ));
  };

  const updateTestCaseSample = (id: string, isSample: boolean) => {
    setTestCases(prev => prev.map(testCase =>
      testCase.id === id ? { ...testCase, isSample } : testCase
    ));
  };

  // Array field management (tags, hints, companies)
  const addToArray = (array: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => [...prev, '']);
  };

  const removeFromArray = (array: string[], setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
    if (array.length > 1) {
      setter(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateArray = (array: string[], setter: React.Dispatch<React.SetStateAction<string[]>>, index: number, value: string) => {
    setter(prev => prev.map((item, i) => i === index ? value : item));
  };

  // Input field generator based on parameter type
  const generateInputField = (parameter: Parameter, value: any, onChange: (value: any) => void, placeholder?: string) => {
    const constraint = parameterConstraints.find(c => c.parameterName === parameter.name);
    
    switch (parameter.type) {
      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(parseFloat(e.target.value) || '')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={placeholder || `Enter ${parameter.name}`}
            min={constraint?.minValue}
            max={constraint?.maxValue}
          />
        );
      
      case 'string':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={placeholder || `Enter ${parameter.name}`}
            minLength={constraint?.minLength}
            maxLength={constraint?.maxLength}
          />
        );
      
      case 'boolean':
        return (
          <select
            value={value?.toString() || 'false'}
            onChange={(e) => onChange(e.target.value === 'true')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select boolean</option>
            <option value="false">false</option>
            <option value="true">true</option>
          </select>
        );
      
      case 'number[]':
      case 'string[]':
      case 'boolean[]':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            placeholder={parameter.type === 'number[]' ? '[1,2,3,4]' : parameter.type === 'string[]' ? '["a","b","c"]' : '[true,false,true]'}
          />
        );
      
      case 'number[][]':
      case 'string[][]':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            placeholder={parameter.type === 'number[][]' ? '[[1,2],[3,4]]' : '[["a","b"],["c","d"]]'}
          />
        );
      
      case 'TreeNode':
      case 'ListNode':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            placeholder={parameter.type === 'TreeNode' ? '[1,2,3,null,4]' : '[1,2,3,4,5]'}
          />
        );
      
      default:
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            placeholder="Enter JSON object"
          />
        );
    }
  };

  // FIX: Improved validation for examples
  const validateExamples = () => {
    if (examples.length === 0) return false;
    
    return examples.some(example => {
      // Check if all parameter inputs have values
      const validParams = parameters.filter(p => p.name.trim());
      const allInputsFilled = validParams.every(param => {
        const inputValue = example.inputs[param.name];
        return !isEmpty(inputValue);
      });
      
      // Check if output and explanation are filled
      const outputFilled = !isEmpty(example.expectedOutput);
      const explanationFilled = !isEmpty(example.explanation);
      
      return allInputsFilled && outputFilled && explanationFilled;
    });
  };

  // Navigation validation - FIX: Improved examples validation
  const canGoNext = () => {
    switch (currentTabIndex) {
      case 0: // Basic Info
        return title.trim() && description.trim();
      case 1: // Function Definition
        return functionName.trim() && isValidName(functionName) && 
               parameters.every(p => p.name.trim() && isValidName(p.name) && p.type);
      case 2: // Constraints
        return parameterConstraints.length > 0;
      case 3: // Examples - FIX: Use improved validation
        return validateExamples();
      case 4: // Test Cases
        return testCases.filter(tc => {
          const validParams = parameters.filter(p => p.name.trim());
          const allInputsFilled = validParams.every(param => !isEmpty(tc.inputs[param.name]));
          return allInputsFilled && !isEmpty(tc.expectedOutput);
        }).length >= 5;
      default:
        return true;
    }
  };

  // Get validation message for debugging
  const getValidationMessage = () => {
    switch (currentTabIndex) {
      case 0:
        if (!title.trim()) return 'Title is required';
        if (!description.trim()) return 'Description is required';
        return '';
      case 1:
        if (!functionName.trim()) return 'Function name is required';
        if (!isValidName(functionName)) return 'Function name invalid (no spaces allowed)';
        const invalidParam = parameters.find(p => !p.name.trim() || !isValidName(p.name) || !p.type);
        if (invalidParam) return 'All parameters must have valid names and types';
        return '';
      case 2:
        if (parameterConstraints.length === 0) return 'No constraints defined';
        return '';
      case 3: // Examples validation message
        if (examples.length === 0) return 'No examples created';
        const validParams = parameters.filter(p => p.name.trim());
        const incompleteExamples = examples.filter(example => {
          const allInputsFilled = validParams.every(param => !isEmpty(example.inputs[param.name]));
          const outputFilled = !isEmpty(example.expectedOutput);
          const explanationFilled = !isEmpty(example.explanation);
          return !(allInputsFilled && outputFilled && explanationFilled);
        });
        if (incompleteExamples.length === examples.length) {
          return 'At least one complete example required (all inputs, output, and explanation)';
        }
        return '';
      case 4:
        const validTestCases = testCases.filter(tc => {
          const validParams = parameters.filter(p => p.name.trim());
          const allInputsFilled = validParams.every(param => !isEmpty(tc.inputs[param.name]));
          return allInputsFilled && !isEmpty(tc.expectedOutput);
        });
        if (validTestCases.length < 5) return `Need at least 5 complete test cases (have ${validTestCases.length})`;
        return '';
      default:
        return '';
    }
  };

  const nextTab = () => {
    if (currentTabIndex < TAB_SEQUENCE.length - 1 && canGoNext()) {
      setCurrentTabIndex(currentTabIndex + 1);
    }
  };

  const prevTab = () => {
    if (currentTabIndex > 0) {
      setCurrentTabIndex(currentTabIndex - 1);
    }
  };

  // Final validation and submit
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) newErrors.title = 'Problem name is required';
    if (!description.trim()) newErrors.description = 'Problem description is required';
    if (!functionName.trim()) newErrors.functionName = 'Function name is required';
    if (!isValidName(functionName)) newErrors.functionName = 'Function name can only contain letters, numbers, and underscore (no spaces)';

    parameters.forEach((param, index) => {
      if (!param.name.trim()) newErrors[`param_${index}_name`] = 'Parameter name is required';
      if (!isValidName(param.name)) newErrors[`param_${index}_name`] = 'Parameter name can only contain letters, numbers, and underscore (no spaces)';
      if (!param.type) newErrors[`param_${index}_type`] = 'Parameter type is required';
    });

    if (!validateExamples()) newErrors.examples = 'At least one complete example is required';

    const validTestCases = testCases.filter(tc => {
      const validParams = parameters.filter(p => p.name.trim());
      const allInputsFilled = validParams.every(param => !isEmpty(tc.inputs[param.name]));
      return allInputsFilled && !isEmpty(tc.expectedOutput);
    });
    if (validTestCases.length < 5) newErrors.testCases = 'At least 5 complete test cases are required';

    const nonEmptyTags = tags.filter(tag => tag.trim());
    if (nonEmptyTags.length === 0) newErrors.tags = 'At least one tag is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const problemData = {
        title: title.trim(),
        difficulty,
        description: description.trim(),
        functionName: functionName.trim(),
        returnType,
        parameters: parameters.filter(p => p.name.trim()),
        constraints:parameterConstraints,
        examples: examples.filter(ex => {
          const validParams = parameters.filter(p => p.name.trim());
          const allInputsFilled = validParams.every(param => !isEmpty(ex.inputs[param.name]));
          return allInputsFilled && !isEmpty(ex.expectedOutput) && !isEmpty(ex.explanation);
        }),
        testCases: testCases.filter(tc => {
          const validParams = parameters.filter(p => p.name.trim());
          const allInputsFilled = validParams.every(param => !isEmpty(tc.inputs[param.name]));
          return allInputsFilled && !isEmpty(tc.expectedOutput);
        }),
        tags: tags.filter(tag => tag.trim()),
        hints: hints.filter(hint => hint.trim()),
        companies: companies.filter(company => company.trim()),
        isActive
      };
      
      console.log("problem data",problemData);

      try {
        const res = await httpClient.post(`admin/problems/create-problem`, problemData);
        
        if (res.data.success) {
          toast.success("Problem created successfully!");
          navigate("/admin/problems");
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          toast.error("this is error",error.response?.data.message || "Failed to create problem");
        } else {
          console.log("Unexpected error:", error);
        }
      }
    }
  };

  const currentTab = TAB_SEQUENCE[currentTabIndex];

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <h1 className="text-3xl font-bold text-white mb-2">Create New Problem</h1>
          <p className="text-blue-100">Step {currentTabIndex + 1} of {TAB_SEQUENCE.length}: {currentTab.title}</p>
        </div>

        {/* Progress Bar */}
        <div className="p-6 bg-gray-50 border-b">
          <div className="flex items-center justify-between mb-4">
            {TAB_SEQUENCE.map((tab, index) => (
              <div key={tab.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  index <= currentTabIndex 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  <tab.icon className="w-5 h-5" />
                </div>
                {index < TAB_SEQUENCE.length - 1 && (
                  <div className={`h-1 w-20 ml-2 transition-colors ${
                    index < currentTabIndex ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <h2 className="text-xl font-semibold text-gray-700">{currentTab.title}</h2>
        </div>

        <div className="p-8 min-h-96">
          {/* Basic Information Tab */}
          {currentTabIndex === 0 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Problem Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.title ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                      }`}
                      placeholder="Two Sum"
                      onBlur={() => {
                        if (!title.trim()) {
                          setErrors(prev => ({ ...prev, title: 'Problem name is required' }));
                        } else {
                          setErrors(prev => ({ ...prev, title: '' }));
                        }
                      }}
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-2">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Difficulty Level *
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="easy">🟢 Easy</option>
                      <option value="medium">🟡 Medium</option>
                      <option value="hard">🔴 Hard</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-blue-900">
                      Make problem active immediately
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Problem Description *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={10}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
                      errors.description ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                    }`}
                    placeholder="Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target..."
                    onBlur={() => {
                      if (!description.trim()) {
                        setErrors(prev => ({ ...prev, description: 'Problem description is required' }));
                      } else {
                        setErrors(prev => ({ ...prev, description: '' }));
                      }
                    }}
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-2">{errors.description}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Function Definition Tab */}
          {currentTabIndex === 1 && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Function Name * <span className="text-xs text-gray-500">(no spaces allowed)</span>
                    </label>
                    <input
                      type="text"
                      value={functionName}
                      onChange={(e) => {
                        // Prevent spaces from being entered
                        if (!e.target.value.includes(' ')) {
                          setFunctionName(e.target.value);
                        }
                      }}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-mono ${
                        errors.functionName ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                      }`}
                      placeholder="twoSum"
                      onBlur={() => {
                        if (!functionName.trim()) {
                          setErrors(prev => ({ ...prev, functionName: 'Function name is required' }));
                        } else if (!isValidName(functionName)) {
                          setErrors(prev => ({ ...prev, functionName: 'Function name can only contain letters, numbers, and underscore (no spaces)' }));
                        } else {
                          setErrors(prev => ({ ...prev, functionName: '' }));
                        }
                      }}
                    />
                    {errors.functionName && <p className="text-red-500 text-sm mt-2">{errors.functionName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Return Type *
                    </label>
                    <select
                      value={returnType}
                      onChange={(e) => setReturnType(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      {SUPPORTED_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Parameters */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-700">Parameters *</h3>
                      <button
                        type="button"
                        onClick={addParameter}
                        className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-md hover:shadow-lg"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Parameter
                      </button>
                    </div>

                    <div className="space-y-4">
                      {parameters.map((param, index) => (
                        <div key={param.id} className="p-6 border-2 border-gray-100 rounded-lg bg-gray-50">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-medium text-gray-700 text-lg">Parameter {index + 1}</h4>
                            {parameters.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeParameter(param.id)}
                                className="text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-50 rounded"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-2">
                                Name * <span className="text-xs text-gray-500">(no spaces)</span>
                              </label>
                              <input
                                type="text"
                                value={param.name}
                                onChange={(e) => {
                                  // Prevent spaces from being entered
                                  if (!e.target.value.includes(' ')) {
                                    updateParameter(param.id, 'name', e.target.value);
                                  }
                                }}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono transition-colors ${
                                  errors[`param_${index}_name`] ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="nums"
                                onBlur={() => {
                                  if (!param.name.trim()) {
                                    setErrors(prev => ({ ...prev, [`param_${index}_name`]: 'Parameter name is required' }));
                                  } else if (!isValidName(param.name)) {
                                    setErrors(prev => ({ ...prev, [`param_${index}_name`]: 'Parameter name can only contain letters, numbers, and underscore (no spaces)' }));
                                  } else {
                                    setErrors(prev => ({ ...prev, [`param_${index}_name`]: '' }));
                                  }
                                }}
                              />
                              {errors[`param_${index}_name`] && (
                                <p className="text-red-500 text-xs mt-1">{errors[`param_${index}_name`]}</p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-2">Type *</label>
                              <select
                                value={param.type}
                                onChange={(e) => updateParameter(param.id, 'type', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                              >
                                {SUPPORTED_TYPES.map(type => (
                                  <option key={type} value={type}>{type}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-600 mb-2">Description</label>
                            <input
                              type="text"
                              value={param.description}
                              onChange={(e) => updateParameter(param.id, 'description', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                              placeholder="Array of integers"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Function Signature Preview */}
                <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-700 mb-6 flex items-center">
                    <Code className="w-5 h-5 mr-2" />
                    Function Signature Preview
                  </h3>
                  
                  <div className="space-y-4">
                    {['typescript', 'java', 'python', 'cpp'].map((lang) => (
                      <div key={lang} className="bg-white rounded-lg p-4 border border-gray-300 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-gray-600 capitalize bg-gray-100 px-2 py-1 rounded">{lang}</span>
                          <Code className="w-4 h-4 text-gray-400" />
                        </div>
                        <pre className="text-sm text-gray-800 font-mono bg-gray-50 p-3 rounded border overflow-x-auto">
                          {generateFunctionSignature(lang as any) || 'Complete function definition to see preview'}
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Constraints Tab */}
          {currentTabIndex === 2 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-blue-600 mr-2" />
                  <p className="text-blue-800 text-sm">
                    Define constraints for each parameter. These will be used to validate examples and test cases.
                  </p>
                </div>
              </div>

              {parameterConstraints.map((constraint, index) => (
                <div key={constraint.parameterName} className="border-2 border-gray-200 rounded-lg p-6 bg-white">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-mono mr-3">
                      {constraint.parameterName}
                    </span>
                    <span className="text-gray-500 text-sm">({constraint.type})</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Number constraints */}
                    {constraint.type === 'number' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">Minimum Value</label>
                          <input
                            type="number"
                            value={constraint.minValue || ''}
                            onChange={(e) => updateConstraint(constraint.parameterName, 'minValue', parseFloat(e.target.value) || undefined)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="-1000000000"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">Maximum Value</label>
                          <input
                            type="number"
                            value={constraint.maxValue || ''}
                            onChange={(e) => updateConstraint(constraint.parameterName, 'maxValue', parseFloat(e.target.value) || undefined)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="1000000000"
                          />
                        </div>
                      </>
                    )}

                    {/* String constraints */}
                    {constraint.type === 'string' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">Minimum Length</label>
                          <input
                            type="number"
                            value={constraint.minLength || ''}
                            onChange={(e) => updateConstraint(constraint.parameterName, 'minLength', parseInt(e.target.value) || undefined)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="1"
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">Maximum Length</label>
                          <input
                            type="number"
                            value={constraint.maxLength || ''}
                            onChange={(e) => updateConstraint(constraint.parameterName, 'maxLength', parseInt(e.target.value) || undefined)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="1000"
                            min="1"
                          />
                        </div>
                      </>
                    )}

                    {/* Array constraints */}
                    {constraint.type.includes('[]') && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">Array Min Length</label>
                          <input
                            type="number"
                            value={constraint.arrayMinLength || ''}
                            onChange={(e) => updateConstraint(constraint.parameterName, 'arrayMinLength', parseInt(e.target.value) || undefined)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="1"
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">Array Max Length</label>
                          <input
                            type="number"
                            value={constraint.arrayMaxLength || ''}
                            onChange={(e) => updateConstraint(constraint.parameterName, 'arrayMaxLength', parseInt(e.target.value) || undefined)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="10000"
                            min="1"
                          />
                        </div>

                        {/* Element constraints for arrays */}
                        {(constraint.type === 'number[]' || constraint.type === 'number[][]') && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-2">Element Min Value</label>
                              <input
                                type="number"
                                value={constraint.elementConstraints?.minValue || ''}
                                onChange={(e) => updateElementConstraint(constraint.parameterName, 'minValue', parseFloat(e.target.value) || undefined)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="-1000000000"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-2">Element Max Value</label>
                              <input
                                type="number"
                                value={constraint.elementConstraints?.maxValue || ''}
                                onChange={(e) => updateElementConstraint(constraint.parameterName, 'maxValue', parseFloat(e.target.value) || undefined)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="1000000000"
                              />
                            </div>
                          </>
                        )}

                        {constraint.type === 'string[]' && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-2">Element Min Length</label>
                              <input
                                type="number"
                                value={constraint.elementConstraints?.minLength || ''}
                                onChange={(e) => updateElementConstraint(constraint.parameterName, 'minLength', parseInt(e.target.value) || undefined)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="1"
                                min="0"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-2">Element Max Length</label>
                              <input
                                type="number"
                                value={constraint.elementConstraints?.maxLength || ''}
                                onChange={(e) => updateElementConstraint(constraint.parameterName, 'maxLength', parseInt(e.target.value) || undefined)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="100"
                                min="1"
                              />
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Examples Tab */}
          {currentTabIndex === 3 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-700">Examples</h2>
                  <p className="text-sm text-gray-500 mt-1">Create 1-3 examples to help users understand the problem</p>
                </div>
                {examples.length < 3 && (
                  <button
                    type="button"
                    onClick={addExample}
                    className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-md hover:shadow-lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Example
                  </button>
                )}
              </div>

              {errors.examples && <p className="text-red-500 text-sm">{errors.examples}</p>}

              <div className="space-y-6">
                {examples.map((example, index) => (
                  <div key={example.id} className="border-2 border-gray-200 rounded-lg p-6 bg-white hover:border-green-300 transition-colors">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-semibold text-gray-700 text-lg flex items-center">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm mr-3">
                          Example {index + 1}
                        </span>
                      </h3>
                      {examples.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExample(example.id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-50 rounded"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    {/* Parameter Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-600 border-b pb-2">Input Parameters</h4>
                        {parameters.filter(p => p.name.trim()).map((param) => (
                          <div key={param.id}>
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                              {param.name} <span className="text-gray-400">({param.type})</span>
                            </label>
                            {generateInputField(
                              param,
                              example.inputs[param.name],
                              (value) => updateExampleInput(example.id, param.name, value)
                            )}
                          </div>
                        ))}
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-600 border-b pb-2 mb-4">Expected Output</h4>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Result <span className="text-gray-400">({returnType})</span>
                        </label>
                        {generateInputField(
                          { name: 'output', type: returnType, description: '', id: 'output' },
                          example.expectedOutput,
                          (value) => updateExampleOutput(example.id, value),
                          'Expected result'
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Explanation *</label>
                      <textarea
                        value={example.explanation}
                        onChange={(e) => updateExampleExplanation(example.id, e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                        placeholder="Explain how the output is derived from the input..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Test Cases Tab */}
          {currentTabIndex === 4 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-700">Test Cases</h2>
                  <p className="text-sm text-gray-500 mt-1">Create comprehensive test cases to validate solutions (minimum 5 required)</p>
                </div>
                <button
                  type="button"
                  onClick={addTestCase}
                  className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors shadow-md hover:shadow-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Test Case
                </button>
              </div>

              {errors.testCases && <p className="text-red-500 text-sm">{errors.testCases}</p>}

              <div className="space-y-4">
                {testCases.map((testCase, index) => (
                  <div key={testCase.id} className="border-2 border-gray-200 rounded-lg p-6 bg-white hover:border-purple-300 transition-colors">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-gray-700 flex items-center">
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm mr-3">
                          Test Case {index + 1}
                        </span>
                      </h3>
                      <div className="flex items-center space-x-3">
                        <label className="flex items-center space-x-2 text-sm text-gray-600">
                          <input
                            type="checkbox"
                            checked={testCase.isSample}
                            onChange={(e) => updateTestCaseSample(testCase.id, e.target.checked)}
                            className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                          />
                          <span>Sample (visible in examples)</span>
                        </label>
                        {testCases.length > 5 && (
                          <button
                            type="button"
                            onClick={() => removeTestCase(testCase.id)}
                            className="text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-50 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-600 border-b pb-2">Input Parameters</h4>
                        {parameters.filter(p => p.name.trim()).map((param) => (
                          <div key={param.id}>
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                              {param.name} <span className="text-gray-400">({param.type})</span>
                            </label>
                            {generateInputField(
                              param,
                              testCase.inputs[param.name],
                              (value) => updateTestCaseInput(testCase.id, param.name, value)
                            )}
                          </div>
                        ))}
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-600 border-b pb-2 mb-4">Expected Output</h4>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Result <span className="text-gray-400">({returnType})</span>
                        </label>
                        {generateInputField(
                          { name: 'output', type: returnType, description: '', id: 'output' },
                          testCase.expectedOutput,
                          (value) => updateTestCaseOutput(testCase.id, value),
                          'Expected result'
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata Tab */}
          {currentTabIndex === 5 && (
            <div className="space-y-8">
              {/* Tags */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-700 flex items-center">
                    <Tag className="w-5 h-5 mr-2" />
                    Tags *
                  </h2>
                  <button
                    type="button"
                    onClick={() => addToArray(tags, setTags)}
                    className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Tag
                  </button>
                </div>

                {errors.tags && <p className="text-red-500 text-sm mb-3">{errors.tags}</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {tags.map((tag, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={tag}
                        onChange={(e) => updateArray(tags, setTags, index, e.target.value)}
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        placeholder="Array, Hash Table, Two Pointers"
                      />
                      {tags.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFromArray(tags, setTags, index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Hints */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-700 flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2" />
                    Hints (Optional)
                  </h2>
                  <button
                    type="button"
                    onClick={() => addToArray(hints, setHints)}
                    className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Hint
                  </button>
                </div>

                <div className="space-y-3">
                  {hints.map((hint, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={hint}
                        onChange={(e) => updateArray(hints, setHints, index, e.target.value)}
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                        placeholder="A really brute force way would be to search for all possible pairs of numbers..."
                      />
                      {hints.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFromArray(hints, setHints, index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Companies */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-700 flex items-center">
                    <Building className="w-5 h-5 mr-2" />
                    Companies (Optional)
                  </h2>
                  <button
                    type="button"
                    onClick={() => addToArray(companies, setCompanies)}
                    className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Company
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {companies.map((company, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => updateArray(companies, setCompanies, index, e.target.value)}
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="Google, Microsoft, Amazon, Apple"
                      />
                      {companies.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFromArray(companies, setCompanies, index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-6 bg-gray-50 border-t flex justify-between items-center">
          <button
            type="button"
            onClick={prevTab}
            disabled={currentTabIndex === 0}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              currentTabIndex === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700 shadow-md hover:shadow-lg'
            }`}
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </button>

          <div className="text-center">
            <div className="text-sm text-gray-500">
              Step {currentTabIndex + 1} of {TAB_SEQUENCE.length}
            </div>
            {!canGoNext() && currentTabIndex < TAB_SEQUENCE.length - 1 && (
              <div className="text-xs text-red-500 mt-1">
                {getValidationMessage()}
              </div>
            )}
          </div>

          {currentTabIndex === TAB_SEQUENCE.length - 1 ? (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Check className="w-5 h-5 mr-2" />
              Create Problem
            </button>
          ) : (
            <button
              type="button"
              onClick={nextTab}
              disabled={!canGoNext()}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                canGoNext()
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProblem;
