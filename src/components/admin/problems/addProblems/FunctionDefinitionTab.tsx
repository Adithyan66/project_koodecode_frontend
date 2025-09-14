

// // // // import React from 'react';
// // // // import { Code, Plus, X, Check, Languages } from "lucide-react";
// // // // import { SUPPORTED_TYPES, type Parameter, type Language } from "../../../../pages/admin/AddProblemPage";

// // // // const FunctionDefinitionTab: React.FC<{
// // // //   functionName: string;
// // // //   setFunctionName: React.Dispatch<React.SetStateAction<string>>;
// // // //   returnType: string;
// // // //   setReturnType: React.Dispatch<React.SetStateAction<string>>;
// // // //   parameters: Parameter[];
// // // //   setParameters: React.Dispatch<React.SetStateAction<Parameter[]>>;
// // // //   languages: Language[];
// // // //   selectedLanguageIds: number[];
// // // //   setSelectedLanguageIds: React.Dispatch<React.SetStateAction<number[]>>;
// // // //   isLoadingLanguages: boolean;
// // // //   errors: { [key: string]: string };
// // // //   setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
// // // // }> = ({ 
// // // //   functionName, 
// // // //   setFunctionName, 
// // // //   returnType, 
// // // //   setReturnType, 
// // // //   parameters, 
// // // //   setParameters,
// // // //   languages,
// // // //   selectedLanguageIds,
// // // //   setSelectedLanguageIds,
// // // //   isLoadingLanguages,
// // // //   errors, 
// // // //   setErrors 
// // // // }) => {
  
// // // //   const isValidName = (name: string) => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);

// // // //   const addParameter = () => {
// // // //     const newId = Date.now().toString();
// // // //     setParameters(prev => [...prev, { id: newId, name: '', type: 'number', description: '' }]);
// // // //   };

// // // //   const removeParameter = (id: string) => {
// // // //     setParameters(prev => {
// // // //       if (prev.length > 1) {
// // // //         return prev.filter(param => param.id !== id);
// // // //       }
// // // //       return prev;
// // // //     });
// // // //   };

// // // //   const updateParameter = (id: string, field: keyof Parameter, value: string) => {
// // // //     if (field === 'name' && value.includes(' ')) {
// // // //       return;
// // // //     }
    
// // // //     setParameters(prev => prev.map(param => {
// // // //       if (param.id === id) {
// // // //         return { ...param, [field]: value };
// // // //       }
// // // //       return param;
// // // //     }));
// // // //   };

// // // //   const handleLanguageToggle = (languageId: number) => {
// // // //     setSelectedLanguageIds(prev => {
// // // //       if (prev.includes(languageId)) {
// // // //         return prev.filter(id => id !== languageId);
// // // //       } else {
// // // //         return [...prev, languageId];
// // // //       }
// // // //     });
// // // //   };

// // // //   // Language name to signature mapping
// // // //   const getLanguageKey = (languageName: string): string => {
// // // //     if (languageName.toLowerCase().includes('javascript') || languageName.toLowerCase().includes('node')) return 'javascript';
// // // //     if (languageName.toLowerCase().includes('typescript')) return 'typescript';
// // // //     if (languageName.toLowerCase().includes('python')) return 'python';
// // // //     if (languageName.toLowerCase().includes('java') && !languageName.toLowerCase().includes('javascript')) return 'java';
// // // //     if (languageName.toLowerCase().includes('c++') || languageName.toLowerCase().includes('cpp')) return 'cpp';
// // // //     if (languageName.toLowerCase().includes('c#') || languageName.toLowerCase().includes('csharp')) return 'csharp';
// // // //     if (languageName.toLowerCase().includes('go')) return 'go';
// // // //     if (languageName.toLowerCase().includes('rust')) return 'rust';
// // // //     if (languageName.toLowerCase().includes('kotlin')) return 'kotlin';
// // // //     if (languageName.toLowerCase().includes('swift')) return 'swift';
// // // //     return 'generic';
// // // //   };

// // // //   const generateFunctionSignature = (languageKey: string) => {
// // // //     if (!functionName || parameters.some(p => !p.name || !p.type)) return '';
    
// // // //     const typeMap: { [key: string]: { [lang: string]: string } } = {
// // // //       'number': { 
// // // //         typescript: 'number', 
// // // //         javascript: 'number',
// // // //         java: 'int', 
// // // //         python: 'int', 
// // // //         cpp: 'int',
// // // //         csharp: 'int',
// // // //         go: 'int',
// // // //         rust: 'i32',
// // // //         kotlin: 'Int',
// // // //         swift: 'Int',
// // // //         generic: 'int'
// // // //       },
// // // //       'string': { 
// // // //         typescript: 'string',
// // // //         javascript: 'string', 
// // // //         java: 'String', 
// // // //         python: 'str', 
// // // //         cpp: 'string',
// // // //         csharp: 'string',
// // // //         go: 'string',
// // // //         rust: 'String',
// // // //         kotlin: 'String',
// // // //         swift: 'String',
// // // //         generic: 'string'
// // // //       },
// // // //       'boolean': { 
// // // //         typescript: 'boolean',
// // // //         javascript: 'boolean', 
// // // //         java: 'boolean', 
// // // //         python: 'bool', 
// // // //         cpp: 'bool',
// // // //         csharp: 'bool',
// // // //         go: 'bool',
// // // //         rust: 'bool',
// // // //         kotlin: 'Boolean',
// // // //         swift: 'Bool',
// // // //         generic: 'bool'
// // // //       },
// // // //       'number[]': { 
// // // //         typescript: 'number[]',
// // // //         javascript: 'number[]', 
// // // //         java: 'int[]', 
// // // //         python: 'List[int]', 
// // // //         cpp: 'vector<int>',
// // // //         csharp: 'int[]',
// // // //         go: '[]int',
// // // //         rust: 'Vec<i32>',
// // // //         kotlin: 'IntArray',
// // // //         swift: '[Int]',
// // // //         generic: 'int[]'
// // // //       },
// // // //       'string[]': { 
// // // //         typescript: 'string[]',
// // // //         javascript: 'string[]', 
// // // //         java: 'String[]', 
// // // //         python: 'List[str]', 
// // // //         cpp: 'vector<string>',
// // // //         csharp: 'string[]',
// // // //         go: '[]string',
// // // //         rust: 'Vec<String>',
// // // //         kotlin: 'Array<String>',
// // // //         swift: '[String]',
// // // //         generic: 'string[]'
// // // //       },
// // // //       'number[][]': { 
// // // //         typescript: 'number[][]',
// // // //         javascript: 'number[][]', 
// // // //         java: 'int[][]', 
// // // //         python: 'List[List[int]]', 
// // // //         cpp: 'vector<vector<int>>',
// // // //         csharp: 'int[][]',
// // // //         go: '[][]int',
// // // //         rust: 'Vec<Vec<i32>>',
// // // //         kotlin: 'Array<IntArray>',
// // // //         swift: '[[Int]]',
// // // //         generic: 'int[][]'
// // // //       }
// // // //     };

// // // //     const validParams = parameters.filter(p => p.name.trim() && p.type);
// // // //     const params = validParams.map(p => {
// // // //       const mappedType = typeMap[p.type]?.[languageKey] || p.type;
// // // //       switch (languageKey) {
// // // //         case 'typescript':
// // // //         case 'javascript':
// // // //           return `${p.name}: ${mappedType}`;
// // // //         case 'java':
// // // //         case 'csharp':
// // // //         case 'cpp':
// // // //         case 'kotlin':
// // // //           return `${mappedType} ${p.name}`;
// // // //         case 'python':
// // // //           return `${p.name}: ${mappedType}`;
// // // //         case 'go':
// // // //           return `${p.name} ${mappedType}`;
// // // //         case 'rust':
// // // //           return `${p.name}: ${mappedType}`;
// // // //         case 'swift':
// // // //           return `${p.name}: ${mappedType}`;
// // // //         default:
// // // //           return `${mappedType} ${p.name}`;
// // // //       }
// // // //     }).join(', ');

// // // //     const mappedReturnType = typeMap[returnType]?.[languageKey] || returnType;

// // // //     switch (languageKey) {
// // // //       case 'typescript':
// // // //         return `function ${functionName}(${params}): ${mappedReturnType}`;
// // // //       case 'javascript':
// // // //         return `function ${functionName}(${params})`;
// // // //       case 'java':
// // // //         return `public ${mappedReturnType} ${functionName}(${params})`;
// // // //       case 'python':
// // // //         return `def ${functionName}(${params}) -> ${mappedReturnType}:`;
// // // //       case 'cpp':
// // // //         return `${mappedReturnType} ${functionName}(${params})`;
// // // //       case 'csharp':
// // // //         return `public ${mappedReturnType} ${functionName}(${params})`;
// // // //       case 'go':
// // // //         return `func ${functionName}(${params}) ${mappedReturnType}`;
// // // //       case 'rust':
// // // //         return `fn ${functionName}(${params}) -> ${mappedReturnType}`;
// // // //       case 'kotlin':
// // // //         return `fun ${functionName}(${params}): ${mappedReturnType}`;
// // // //       case 'swift':
// // // //         return `func ${functionName}(${params}) -> ${mappedReturnType}`;
// // // //       default:
// // // //         return `${mappedReturnType} ${functionName}(${params})`;
// // // //     }
// // // //   };

// // // //   const selectedLanguages = languages.filter(lang => selectedLanguageIds.includes(lang.id));

// // // //   return (
// // // //     <div className="space-y-8">
// // // //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
// // // //         <div className="space-y-6">
// // // //           {/* Existing function name and return type sections */}
// // // //           <div>
// // // //             <label className="block text-sm font-semibold text-gray-700 mb-3">
// // // //               Function Name * <span className="text-xs text-gray-500">(no spaces allowed)</span>
// // // //             </label>
// // // //             <input
// // // //               type="text"
// // // //               value={functionName}
// // // //               onChange={(e) => {
// // // //                 if (!e.target.value.includes(' ')) {
// // // //                   setFunctionName(e.target.value);
// // // //                 }
// // // //               }}
// // // //               className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-mono ${
// // // //                 errors.functionName ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
// // // //               }`}
// // // //               placeholder="twoSum"
// // // //               onBlur={() => {
// // // //                 if (!functionName.trim()) {
// // // //                   setErrors(prev => ({ ...prev, functionName: 'Function name is required' }));
// // // //                 } else if (!isValidName(functionName)) {
// // // //                   setErrors(prev => ({ ...prev, functionName: 'Function name can only contain letters, numbers, and underscore (no spaces)' }));
// // // //                 } else {
// // // //                   setErrors(prev => ({ ...prev, functionName: '' }));
// // // //                 }
// // // //               }}
// // // //             />
// // // //             {errors.functionName && <p className="text-red-500 text-sm mt-2">{errors.functionName}</p>}
// // // //           </div>

// // // //           <div>
// // // //             <label className="block text-sm font-semibold text-gray-700 mb-3">
// // // //               Return Type *
// // // //             </label>
// // // //             <select
// // // //               value={returnType}
// // // //               onChange={(e) => setReturnType(e.target.value)}
// // // //               className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
// // // //             >
// // // //               {SUPPORTED_TYPES.map(type => (
// // // //                 <option key={type} value={type}>{type}</option>
// // // //               ))}
// // // //             </select>
// // // //           </div>

// // // //           {/* Language Selection Section */}
// // // //           <div>
// // // //             <div className="flex justify-between items-center mb-4">
// // // //               <label className="block text-sm font-semibold text-gray-700">
// // // //                 Supported Languages * 
// // // //                 <span className="text-xs text-gray-500 block mt-1">
// // // //                   Select programming languages for this problem
// // // //                 </span>
// // // //               </label>
// // // //               <div className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
// // // //                 {selectedLanguageIds.length} selected
// // // //               </div>
// // // //             </div>

// // // //             {isLoadingLanguages ? (
// // // //               <div className="flex items-center justify-center py-8 text-gray-500">
// // // //                 <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
// // // //                 Loading languages...
// // // //               </div>
// // // //             ) : (
// // // //               <div className="max-h-64 overflow-y-auto border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
// // // //                 <div className="grid grid-cols-1 gap-2">
// // // //                   {languages.map((language) => (
// // // //                     <label key={language.id} className="flex items-center space-x-3 p-2 hover:bg-white rounded-lg cursor-pointer transition-colors">
// // // //                       <input
// // // //                         type="checkbox"
// // // //                         checked={selectedLanguageIds.includes(language.id)}
// // // //                         onChange={() => handleLanguageToggle(language.id)}
// // // //                         className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
// // // //                       />
// // // //                       <span className="text-sm font-medium text-gray-700 flex-1">
// // // //                         {language.name}
// // // //                       </span>
// // // //                       {selectedLanguageIds.includes(language.id) && (
// // // //                         <Check className="w-4 h-4 text-green-600" />
// // // //                       )}
// // // //                     </label>
// // // //                   ))}
// // // //                 </div>
// // // //               </div>
// // // //             )}
// // // //             {errors.languages && <p className="text-red-500 text-sm mt-2">{errors.languages}</p>}
// // // //           </div>

// // // //           {/* Parameters Section */}
// // // //           <div>
// // // //             <div className="flex justify-between items-center mb-4">
// // // //               <h3 className="text-lg font-semibold text-gray-700">Parameters *</h3>
// // // //               <button
// // // //                 type="button"
// // // //                 onClick={addParameter}
// // // //                 className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-md hover:shadow-lg"
// // // //               >
// // // //                 <Plus className="w-4 h-4 mr-2" />
// // // //                 Add Parameter
// // // //               </button>
// // // //             </div>

// // // //             <div className="space-y-4">
// // // //               {parameters.map((param, index) => (
// // // //                 <div key={param.id} className="p-6 border-2 border-gray-100 rounded-lg bg-gray-50">
// // // //                   <div className="flex justify-between items-center mb-4">
// // // //                     <h4 className="font-medium text-gray-700 text-lg">Parameter {index + 1}</h4>
// // // //                     {parameters.length > 1 && (
// // // //                       <button
// // // //                         type="button"
// // // //                         onClick={() => removeParameter(param.id)}
// // // //                         className="text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-50 rounded"
// // // //                       >
// // // //                         <X className="w-5 h-5" />
// // // //                       </button>
// // // //                     )}
// // // //                   </div>

// // // //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // // //                     <div>
// // // //                       <label className="block text-sm font-medium text-gray-600 mb-2">
// // // //                         Name * <span className="text-xs text-gray-500">(no spaces)</span>
// // // //                       </label>
// // // //                       <input
// // // //                         type="text"
// // // //                         value={param.name}
// // // //                         onChange={(e) => {
// // // //                           if (!e.target.value.includes(' ')) {
// // // //                             updateParameter(param.id, 'name', e.target.value);
// // // //                           }
// // // //                         }}
// // // //                         className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono transition-colors ${
// // // //                           errors[`param_${index}_name`] ? 'border-red-500' : 'border-gray-300'
// // // //                         }`}
// // // //                         placeholder="nums"
// // // //                         onBlur={() => {
// // // //                           if (!param.name.trim()) {
// // // //                             setErrors(prev => ({ ...prev, [`param_${index}_name`]: 'Parameter name is required' }));
// // // //                           } else if (!isValidName(param.name)) {
// // // //                             setErrors(prev => ({ ...prev, [`param_${index}_name`]: 'Parameter name can only contain letters, numbers, and underscore (no spaces)' }));
// // // //                           } else {
// // // //                             setErrors(prev => ({ ...prev, [`param_${index}_name`]: '' }));
// // // //                           }
// // // //                         }}
// // // //                       />
// // // //                       {errors[`param_${index}_name`] && (
// // // //                         <p className="text-red-500 text-xs mt-1">{errors[`param_${index}_name`]}</p>
// // // //                       )}
// // // //                     </div>

// // // //                     <div>
// // // //                       <label className="block text-sm font-medium text-gray-600 mb-2">Type *</label>
// // // //                       <select
// // // //                         value={param.type}
// // // //                         onChange={(e) => updateParameter(param.id, 'type', e.target.value)}
// // // //                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
// // // //                       >
// // // //                         {SUPPORTED_TYPES.map(type => (
// // // //                           <option key={type} value={type}>{type}</option>
// // // //                         ))}
// // // //                       </select>
// // // //                     </div>
// // // //                   </div>

// // // //                   <div className="mt-4">
// // // //                     <label className="block text-sm font-medium text-gray-600 mb-2">Description</label>
// // // //                     <input
// // // //                       type="text"
// // // //                       value={param.description}
// // // //                       onChange={(e) => updateParameter(param.id, 'description', e.target.value)}
// // // //                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
// // // //                       placeholder="Array of integers"
// // // //                     />
// // // //                   </div>
// // // //                 </div>
// // // //               ))}
// // // //             </div>
// // // //           </div>
// // // //         </div>

// // // //         {/* Function Signature Preview - Only for Selected Languages */}
// // // //         <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
// // // //           <h3 className="text-lg font-semibold text-gray-700 mb-6 flex items-center">
// // // //             <Code className="w-5 h-5 mr-2" />
// // // //             Function Signature Preview
// // // //             <span className="text-sm font-normal text-gray-500 ml-2">
// // // //               ({selectedLanguages.length} languages)
// // // //             </span>
// // // //           </h3>
          
// // // //           {selectedLanguages.length === 0 ? (
// // // //             <div className="text-center py-8 text-gray-500">
// // // //               <Languages className="w-12 h-12 mx-auto mb-3 text-gray-300" />
// // // //               <p>Select languages to see function signatures</p>
// // // //             </div>
// // // //           ) : (
// // // //             <div className="space-y-4 max-h-96 overflow-y-auto">
// // // //               {selectedLanguages.map((language) => {
// // // //                 const languageKey = getLanguageKey(language.name);
// // // //                 return (
// // // //                   <div key={language.id} className="bg-white rounded-lg p-4 border border-gray-300 shadow-sm">
// // // //                     <div className="flex items-center justify-between mb-3">
// // // //                       <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded">
// // // //                         {language.name}
// // // //                       </span>
// // // //                       <Code className="w-4 h-4 text-gray-400" />
// // // //                     </div>
// // // //                     <pre className="text-sm text-gray-800 font-mono bg-gray-50 p-3 rounded border overflow-x-auto">
// // // //                       {generateFunctionSignature(languageKey) || 'Complete function definition to see preview'}
// // // //                     </pre>
// // // //                   </div>
// // // //                 );
// // // //               })}
// // // //             </div>
// // // //           )}
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default FunctionDefinitionTab;




// // // import React, { useState, useEffect } from 'react';
// // // import { Code, Plus, X, Check, Languages, FileText, AlertTriangle, Eye } from "lucide-react";
// // // import { SUPPORTED_TYPES, type Parameter, type Language, type ProblemTemplate, type LanguageTemplate } from "../../../../pages/admin/AddProblemPage";

// // // const FunctionDefinitionTab: React.FC<{
// // //   functionName: string;
// // //   setFunctionName: React.Dispatch<React.SetStateAction<string>>;
// // //   returnType: string;
// // //   setReturnType: React.Dispatch<React.SetStateAction<string>>;
// // //   parameters: Parameter[];
// // //   setParameters: React.Dispatch<React.SetStateAction<Parameter[]>>;
// // //   languages: Language[];
// // //   selectedLanguageIds: number[];
// // //   setSelectedLanguageIds: React.Dispatch<React.SetStateAction<number[]>>;
// // //   templates: ProblemTemplate;
// // //   setTemplates: React.Dispatch<React.SetStateAction<ProblemTemplate>>;
// // //   isLoadingLanguages: boolean;
// // //   errors: { [key: string]: string };
// // //   setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
// // // }> = ({ 
// // //   functionName, 
// // //   setFunctionName, 
// // //   returnType, 
// // //   setReturnType, 
// // //   parameters, 
// // //   setParameters,
// // //   languages,
// // //   selectedLanguageIds,
// // //   setSelectedLanguageIds,
// // //   templates,
// // //   setTemplates,
// // //   isLoadingLanguages,
// // //   errors, 
// // //   setErrors 
// // // }) => {
  
// // //   const [activeTemplateTab, setActiveTemplateTab] = useState<number | null>(null);
// // //   const [showSignatureEditor, setShowSignatureEditor] = useState(false);

// // //   const isValidName = (name: string) => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);

// // //   // Auto-generate templates when languages or function definition changes
// // //   useEffect(() => {
// // //     selectedLanguageIds.forEach(langId => {
// // //       if (!templates[langId]) {
// // //         const language = languages.find(l => l.id === langId);
// // //         if (language) {
// // //           const generatedTemplate = generateDefaultTemplate(language, functionName, returnType, parameters);
// // //           setTemplates(prev => ({
// // //             ...prev,
// // //             [langId]: generatedTemplate
// // //           }));
// // //         }
// // //       }
// // //     });

// // //     // Remove templates for unselected languages
// // //     const updatedTemplates = { ...templates };
// // //     Object.keys(updatedTemplates).forEach(langIdStr => {
// // //       const langId = parseInt(langIdStr);
// // //       if (!selectedLanguageIds.includes(langId)) {
// // //         delete updatedTemplates[langId];
// // //       }
// // //     });
// // //     setTemplates(updatedTemplates);
// // //   }, [selectedLanguageIds, functionName, returnType, parameters, languages]);

// // //   const generateDefaultTemplate = (language: Language, funcName: string, retType: string, params: Parameter[]): LanguageTemplate => {
// // //     const languageKey = getLanguageKey(language.name);
// // //     const placeholder = "USER_FUNCTION_PLACEHOLDER";
// // //     const signature = generateFunctionSignature(languageKey, funcName, retType, params);
    
// // //     const validParams = params.filter(p => p.name.trim() && p.type);

// // //     switch (languageKey) {
// // //       case 'c':
// // //       case 'cpp':
// // //         return {
// // //           templateCode: `#include <stdio.h>
// // // #include <stdlib.h>
// // // ${languageKey === 'cpp' ? '#include <iostream>\n#include <vector>\nusing namespace std;' : ''}

// // // ${placeholder}

// // // int main() {
// // //     // Read input from stdin
// // //     // TODO: Implement input parsing based on your parameter types
// // //     ${validParams.map(p => `// ${p.name}: ${p.type}`).join('\n    ')}
    
// // //     // Call your function
// // //     // TODO: Implement function call and output formatting
    
// // //     return 0;
// // // }`,
// // //           userFunctionSignature: signature,
// // //           placeholder
// // //         };

// // //       case 'java':
// // //         return {
// // //           templateCode: `import java.util.*;
// // // import java.io.*;

// // // public class Solution {
// // //     ${placeholder}
    
// // //     public static void main(String[] args) throws IOException {
// // //         BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        
// // //         // Read input from stdin
// // //         // TODO: Implement input parsing based on your parameter types
// // //         ${validParams.map(p => `// ${p.name}: ${p.type}`).join('\n        ')}
        
// // //         Solution solution = new Solution();
// // //         // TODO: Call your function and print result
        
// // //         br.close();
// // //     }
// // // }`,
// // //           userFunctionSignature: signature,
// // //           placeholder
// // //         };

// // //       case 'python':
// // //         return {
// // //           templateCode: `import sys
// // // from typing import List, Optional

// // // class Solution:
// // //     ${placeholder}

// // // if __name__ == "__main__":
// // //     # Read input from stdin
// // //     lines = sys.stdin.read().strip().split('\\n')
    
// // //     # TODO: Implement input parsing based on your parameter types
// // //     ${validParams.map(p => `# ${p.name}: ${p.type}`).join('\n    ')}
    
// // //     # Create solution instance and call function
// // //     solution = Solution()
// // //     # TODO: Call your function and print result`,
// // //           userFunctionSignature: signature,
// // //           placeholder
// // //         };

// // //       case 'javascript':
// // //       case 'nodejs':
// // //         return {
// // //           templateCode: `const readline = require('readline');

// // // ${placeholder}

// // // const rl = readline.createInterface({
// // //     input: process.stdin,
// // //     output: process.stdout
// // // });

// // // let lines = [];
// // // rl.on('line', (line) => {
// // //     lines.push(line.trim());
// // // }).on('close', () => {
// // //     // Parse input
// // //     // TODO: Implement input parsing based on your parameter types
// // //     ${validParams.map(p => `// ${p.name}: ${p.type}`).join('\n    ')}
    
// // //     // Call function and print result
// // //     // TODO: Call your function and print result
// // // });`,
// // //           userFunctionSignature: signature,
// // //           placeholder
// // //         };

// // //       default:
// // //         return {
// // //           templateCode: `${placeholder}

// // // // TODO: Implement main function and input/output handling
// // // // Read from stdin, call your function, and print the result`,
// // //           userFunctionSignature: signature,
// // //           placeholder
// // //         };
// // //     }
// // //   };

// // //   const addParameter = () => {
// // //     const newId = Date.now().toString();
// // //     setParameters(prev => [...prev, { id: newId, name: '', type: 'number', description: '' }]);
// // //   };

// // //   const removeParameter = (id: string) => {
// // //     setParameters(prev => {
// // //       if (prev.length > 1) {
// // //         return prev.filter(param => param.id !== id);
// // //       }
// // //       return prev;
// // //     });
// // //   };

// // //   const updateParameter = (id: string, field: keyof Parameter, value: string) => {
// // //     if (field === 'name' && value.includes(' ')) {
// // //       return;
// // //     }
    
// // //     setParameters(prev => prev.map(param => {
// // //       if (param.id === id) {
// // //         return { ...param, [field]: value };
// // //       }
// // //       return param;
// // //     }));
// // //   };

// // //   const handleLanguageToggle = (languageId: number) => {
// // //     setSelectedLanguageIds(prev => {
// // //       if (prev.includes(languageId)) {
// // //         return prev.filter(id => id !== languageId);
// // //       } else {
// // //         return [...prev, languageId];
// // //       }
// // //     });
// // //   };

// // //   const updateTemplate = (languageId: number, field: keyof LanguageTemplate, value: string) => {
// // //     setTemplates(prev => ({
// // //       ...prev,
// // //       [languageId]: {
// // //         ...prev[languageId],
// // //         [field]: value
// // //       }
// // //     }));
// // //   };

// // //   const getLanguageKey = (languageName: string): string => {
// // //     const name = languageName.toLowerCase();
// // //     if (name.includes('c++') || name.includes('cpp')) return 'cpp';
// // //     if (name.includes('c') && !name.includes('c++') && !name.includes('c#')) return 'c';
// // //     if (name.includes('java') && !name.includes('javascript')) return 'java';
// // //     if (name.includes('python')) return 'python';
// // //     if (name.includes('javascript') || name.includes('node')) return 'javascript';
// // //     if (name.includes('typescript')) return 'typescript';
// // //     if (name.includes('c#') || name.includes('csharp')) return 'csharp';
// // //     if (name.includes('go')) return 'go';
// // //     if (name.includes('rust')) return 'rust';
// // //     if (name.includes('kotlin')) return 'kotlin';
// // //     if (name.includes('swift')) return 'swift';
// // //     return 'generic';
// // //   };

// // //   const generateFunctionSignature = (languageKey: string, funcName: string, retType: string, params: Parameter[]) => {
// // //     if (!funcName || params.some(p => !p.name || !p.type)) return '';
    
// // //     const typeMap: { [key: string]: { [lang: string]: string } } = {
// // //       'number': { 
// // //         typescript: 'number', 
// // //         javascript: 'number',
// // //         java: 'int', 
// // //         python: 'int', 
// // //         cpp: 'int',
// // //         c: 'int',
// // //         csharp: 'int',
// // //         go: 'int',
// // //         rust: 'i32',
// // //         kotlin: 'Int',
// // //         swift: 'Int',
// // //         generic: 'int'
// // //       },
// // //       'string': { 
// // //         typescript: 'string',
// // //         javascript: 'string', 
// // //         java: 'String', 
// // //         python: 'str', 
// // //         cpp: 'string',
// // //         c: 'char*',
// // //         csharp: 'string',
// // //         go: 'string',
// // //         rust: 'String',
// // //         kotlin: 'String',
// // //         swift: 'String',
// // //         generic: 'string'
// // //       },
// // //       'boolean': { 
// // //         typescript: 'boolean',
// // //         javascript: 'boolean', 
// // //         java: 'boolean', 
// // //         python: 'bool', 
// // //         cpp: 'bool',
// // //         c: 'int',
// // //         csharp: 'bool',
// // //         go: 'bool',
// // //         rust: 'bool',
// // //         kotlin: 'Boolean',
// // //         swift: 'Bool',
// // //         generic: 'bool'
// // //       },
// // //       'number[]': { 
// // //         typescript: 'number[]',
// // //         javascript: 'number[]', 
// // //         java: 'int[]', 
// // //         python: 'List[int]', 
// // //         cpp: 'vector<int>',
// // //         c: 'int*',
// // //         csharp: 'int[]',
// // //         go: '[]int',
// // //         rust: 'Vec<i32>',
// // //         kotlin: 'IntArray',
// // //         swift: '[Int]',
// // //         generic: 'int[]'
// // //       },
// // //       'string[]': { 
// // //         typescript: 'string[]',
// // //         javascript: 'string[]', 
// // //         java: 'String[]', 
// // //         python: 'List[str]', 
// // //         cpp: 'vector<string>',
// // //         c: 'char**',
// // //         csharp: 'string[]',
// // //         go: '[]string',
// // //         rust: 'Vec<String>',
// // //         kotlin: 'Array<String>',
// // //         swift: '[String]',
// // //         generic: 'string[]'
// // //       }
// // //     };

// // //     const validParams = params.filter(p => p.name.trim() && p.type);
// // //     const paramStrings = validParams.map(p => {
// // //       const mappedType = typeMap[p.type]?.[languageKey] || p.type;
// // //       switch (languageKey) {
// // //         case 'typescript':
// // //         case 'javascript':
// // //           return `${p.name}: ${mappedType}`;
// // //         case 'java':
// // //         case 'csharp':
// // //         case 'cpp':
// // //         case 'c':
// // //         case 'kotlin':
// // //           return `${mappedType} ${p.name}`;
// // //         case 'python':
// // //           return `${p.name}: ${mappedType}`;
// // //         case 'go':
// // //           return `${p.name} ${mappedType}`;
// // //         case 'rust':
// // //           return `${p.name}: ${mappedType}`;
// // //         case 'swift':
// // //           return `${p.name}: ${mappedType}`;
// // //         default:
// // //           return `${mappedType} ${p.name}`;
// // //       }
// // //     }).join(', ');

// // //     const mappedReturnType = typeMap[retType]?.[languageKey] || retType;

// // //     switch (languageKey) {
// // //       case 'typescript':
// // //         return `function ${funcName}(${paramStrings}): ${mappedReturnType}`;
// // //       case 'javascript':
// // //         return `function ${funcName}(${paramStrings})`;
// // //       case 'java':
// // //         return `public ${mappedReturnType} ${funcName}(${paramStrings})`;
// // //       case 'python':
// // //         return `def ${funcName}(self, ${paramStrings}) -> ${mappedReturnType}:`;
// // //       case 'cpp':
// // //         return `${mappedReturnType} ${funcName}(${paramStrings})`;
// // //       case 'c':
// // //         return `${mappedReturnType} ${funcName}(${paramStrings})`;
// // //       case 'csharp':
// // //         return `public ${mappedReturnType} ${funcName}(${paramStrings})`;
// // //       case 'go':
// // //         return `func ${funcName}(${paramStrings}) ${mappedReturnType}`;
// // //       case 'rust':
// // //         return `fn ${funcName}(${paramStrings}) -> ${mappedReturnType}`;
// // //       case 'kotlin':
// // //         return `fun ${funcName}(${paramStrings}): ${mappedReturnType}`;
// // //       case 'swift':
// // //         return `func ${funcName}(${paramStrings}) -> ${mappedReturnType}`;
// // //       default:
// // //         return `${mappedReturnType} ${funcName}(${paramStrings})`;
// // //     }
// // //   };

// // //   const selectedLanguages = languages.filter(lang => selectedLanguageIds.includes(lang.id));

// // //   const validateTemplate = (languageId: number): boolean => {
// // //     const template = templates[languageId];
// // //     if (!template) return false;
    
// // //     return template.templateCode.includes(template.placeholder) && 
// // //            template.templateCode.trim().length > 0 &&
// // //            template.userFunctionSignature.trim().length > 0;
// // //   };

// // //   return (
// // //     <div className="space-y-8">
// // //       {/* Function Definition Section */}
// // //       <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
// // //         <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
// // //           <Code className="w-6 h-6 mr-3 text-blue-600" />
// // //           Function Definition & Templates
// // //         </h2>

// // //         <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
// // //           {/* Left Column - Basic Definition */}
// // //           <div className="space-y-6">
// // //             <div>
// // //               <label className="block text-sm font-semibold text-gray-700 mb-3">
// // //                 Function Name * <span className="text-xs text-gray-500">(no spaces allowed)</span>
// // //               </label>
// // //               <input
// // //                 type="text"
// // //                 value={functionName}
// // //                 onChange={(e) => {
// // //                   if (!e.target.value.includes(' ')) {
// // //                     setFunctionName(e.target.value);
// // //                   }
// // //                 }}
// // //                 className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-mono ${
// // //                   errors.functionName ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
// // //                 }`}
// // //                 placeholder="twoSum"
// // //                 onBlur={() => {
// // //                   if (!functionName.trim()) {
// // //                     setErrors(prev => ({ ...prev, functionName: 'Function name is required' }));
// // //                   } else if (!isValidName(functionName)) {
// // //                     setErrors(prev => ({ ...prev, functionName: 'Function name can only contain letters, numbers, and underscore (no spaces)' }));
// // //                   } else {
// // //                     setErrors(prev => ({ ...prev, functionName: '' }));
// // //                   }
// // //                 }}
// // //               />
// // //               {errors.functionName && <p className="text-red-500 text-sm mt-2">{errors.functionName}</p>}
// // //             </div>

// // //             <div>
// // //               <label className="block text-sm font-semibold text-gray-700 mb-3">
// // //                 Return Type *
// // //               </label>
// // //               <select
// // //                 value={returnType}
// // //                 onChange={(e) => setReturnType(e.target.value)}
// // //                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
// // //               >
// // //                 {SUPPORTED_TYPES.map(type => (
// // //                   <option key={type} value={type}>{type}</option>
// // //                 ))}
// // //               </select>
// // //             </div>

// // //             {/* Language Selection */}
// // //             <div>
// // //               <div className="flex justify-between items-center mb-4">
// // //                 <label className="block text-sm font-semibold text-gray-700">
// // //                   Supported Languages * 
// // //                   <span className="text-xs text-gray-500 block mt-1">
// // //                     Select programming languages for this problem
// // //                   </span>
// // //                 </label>
// // //                 <div className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
// // //                   {selectedLanguageIds.length} selected
// // //                 </div>
// // //               </div>

// // //               {isLoadingLanguages ? (
// // //                 <div className="flex items-center justify-center py-8 text-gray-500">
// // //                   <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
// // //                   Loading languages...
// // //                 </div>
// // //               ) : (
// // //                 <div className="max-h-64 overflow-y-auto border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
// // //                   <div className="grid grid-cols-1 gap-2">
// // //                     {languages.map((language) => (
// // //                       <label key={language.id} className="flex items-center space-x-3 p-2 hover:bg-white rounded-lg cursor-pointer transition-colors">
// // //                         <input
// // //                           type="checkbox"
// // //                           checked={selectedLanguageIds.includes(language.id)}
// // //                           onChange={() => handleLanguageToggle(language.id)}
// // //                           className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
// // //                         />
// // //                         <span className="text-sm font-medium text-gray-700 flex-1">
// // //                           {language.name}
// // //                         </span>
// // //                         {selectedLanguageIds.includes(language.id) && (
// // //                           <div className="flex items-center space-x-1">
// // //                             {validateTemplate(language.id) ? (
// // //                               <Check className="w-4 h-4 text-green-600" />
// // //                             ) : (
// // //                               <AlertTriangle className="w-4 h-4 text-orange-500" />
// // //                             )}
// // //                           </div>
// // //                         )}
// // //                       </label>
// // //                     ))}
// // //                   </div>
// // //                 </div>
// // //               )}
// // //               {errors.languages && <p className="text-red-500 text-sm mt-2">{errors.languages}</p>}
// // //               {errors.templates && <p className="text-red-500 text-sm mt-2">{errors.templates}</p>}
// // //             </div>

// // //             {/* Parameters Section */}
// // //             <div>
// // //               <div className="flex justify-between items-center mb-4">
// // //                 <h3 className="text-lg font-semibold text-gray-700">Parameters *</h3>
// // //                 <button
// // //                   type="button"
// // //                   onClick={addParameter}
// // //                   className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-md hover:shadow-lg"
// // //                 >
// // //                   <Plus className="w-4 h-4 mr-2" />
// // //                   Add Parameter
// // //                 </button>
// // //               </div>

// // //               <div className="space-y-4">
// // //                 {parameters.map((param, index) => (
// // //                   <div key={param.id} className="p-6 border-2 border-gray-100 rounded-lg bg-gray-50">
// // //                     <div className="flex justify-between items-center mb-4">
// // //                       <h4 className="font-medium text-gray-700 text-lg">Parameter {index + 1}</h4>
// // //                       {parameters.length > 1 && (
// // //                         <button
// // //                           type="button"
// // //                           onClick={() => removeParameter(param.id)}
// // //                           className="text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-50 rounded"
// // //                         >
// // //                           <X className="w-5 h-5" />
// // //                         </button>
// // //                       )}
// // //                     </div>

// // //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //                       <div>
// // //                         <label className="block text-sm font-medium text-gray-600 mb-2">
// // //                           Name * <span className="text-xs text-gray-500">(no spaces)</span>
// // //                         </label>
// // //                         <input
// // //                           type="text"
// // //                           value={param.name}
// // //                           onChange={(e) => {
// // //                             if (!e.target.value.includes(' ')) {
// // //                               updateParameter(param.id, 'name', e.target.value);
// // //                             }
// // //                           }}
// // //                           className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono transition-colors ${
// // //                             errors[`param_${index}_name`] ? 'border-red-500' : 'border-gray-300'
// // //                           }`}
// // //                           placeholder="nums"
// // //                           onBlur={() => {
// // //                             if (!param.name.trim()) {
// // //                               setErrors(prev => ({ ...prev, [`param_${index}_name`]: 'Parameter name is required' }));
// // //                             } else if (!isValidName(param.name)) {
// // //                               setErrors(prev => ({ ...prev, [`param_${index}_name`]: 'Parameter name can only contain letters, numbers, and underscore (no spaces)' }));
// // //                             } else {
// // //                               setErrors(prev => ({ ...prev, [`param_${index}_name`]: '' }));
// // //                             }
// // //                           }}
// // //                         />
// // //                         {errors[`param_${index}_name`] && (
// // //                           <p className="text-red-500 text-xs mt-1">{errors[`param_${index}_name`]}</p>
// // //                         )}
// // //                       </div>

// // //                       <div>
// // //                         <label className="block text-sm font-medium text-gray-600 mb-2">Type *</label>
// // //                         <select
// // //                           value={param.type}
// // //                           onChange={(e) => updateParameter(param.id, 'type', e.target.value)}
// // //                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
// // //                         >
// // //                           {SUPPORTED_TYPES.map(type => (
// // //                             <option key={type} value={type}>{type}</option>
// // //                           ))}
// // //                         </select>
// // //                       </div>
// // //                     </div>

// // //                     <div className="mt-4">
// // //                       <label className="block text-sm font-medium text-gray-600 mb-2">Description</label>
// // //                       <input
// // //                         type="text"
// // //                         value={param.description}
// // //                         onChange={(e) => updateParameter(param.id, 'description', e.target.value)}
// // //                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
// // //                         placeholder="Array of integers"
// // //                       />
// // //                     </div>
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             </div>
// // //           </div>

// // //           {/* Right Column - Templates & Signatures */}
// // //           <div className="space-y-6">
// // //             {selectedLanguages.length === 0 ? (
// // //               <div className="text-center py-12 text-gray-500">
// // //                 <Languages className="w-16 h-16 mx-auto mb-4 text-gray-300" />
// // //                 <p className="text-lg">Select languages to configure templates</p>
// // //               </div>
// // //             ) : (
// // //               <>
// // //                 {/* Function Signatures */}
// // //                 <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
// // //                   <div className="flex justify-between items-center mb-4">
// // //                     <h3 className="text-lg font-semibold text-gray-700 flex items-center">
// // //                       <Eye className="w-5 h-5 mr-2" />
// // //                       Function Signatures
// // //                     </h3>
// // //                     <button
// // //                       type="button"
// // //                       onClick={() => setShowSignatureEditor(!showSignatureEditor)}
// // //                       className={`px-3 py-1 text-xs rounded-full transition-colors ${
// // //                         showSignatureEditor 
// // //                           ? 'bg-blue-100 text-blue-700' 
// // //                           : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
// // //                       }`}
// // //                     >
// // //                       {showSignatureEditor ? 'View Only' : 'Edit'}
// // //                     </button>
// // //                   </div>
                  
// // //                   <div className="space-y-3 max-h-64 overflow-y-auto">
// // //                     {selectedLanguages.map((language) => {
// // //                       const languageKey = getLanguageKey(language.name);
// // //                       const autoSignature = generateFunctionSignature(languageKey, functionName, returnType, parameters);
// // //                       const currentSignature = templates[language.id]?.userFunctionSignature || autoSignature;
                      
// // //                       return (
// // //                         <div key={language.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
// // //                           <div className="flex items-center justify-between mb-2">
// // //                             <span className="text-sm font-semibold text-gray-600 bg-gray-200 px-2 py-1 rounded">
// // //                               {language.name}
// // //                             </span>
// // //                           </div>
// // //                           {showSignatureEditor ? (
// // //                             <textarea
// // //                               value={currentSignature}
// // //                               onChange={(e) => updateTemplate(language.id, 'userFunctionSignature', e.target.value)}
// // //                               className="w-full text-sm font-mono bg-white border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
// // //                               rows={2}
// // //                               placeholder="Edit function signature..."
// // //                             />
// // //                           ) : (
// // //                             <pre className="text-sm text-gray-800 font-mono bg-white p-2 rounded border overflow-x-auto">
// // //                               {currentSignature || 'Complete function definition to see preview'}
// // //                             </pre>
// // //                           )}
// // //                         </div>
// // //                       );
// // //                     })}
// // //                   </div>
// // //                 </div>

// // //                 {/* Template Code Editor */}
// // //                 <div className="bg-white rounded-lg border-2 border-gray-200">
// // //                   <div className="p-4 border-b border-gray-200">
// // //                     <h3 className="text-lg font-semibold text-gray-700 flex items-center">
// // //                       <FileText className="w-5 h-5 mr-2" />
// // //                       Template Code Editor
// // //                       <span className="text-sm font-normal text-gray-500 ml-2">
// // //                         ({selectedLanguages.length} templates)
// // //                       </span>
// // //                     </h3>
// // //                   </div>

// // //                   {/* Language Tabs */}
// // //                   <div className="flex flex-wrap border-b border-gray-200 bg-gray-50 px-4">
// // //                     {selectedLanguages.map((language) => (
// // //                       <button
// // //                         key={language.id}
// // //                         onClick={() => setActiveTemplateTab(activeTemplateTab === language.id ? null : language.id)}
// // //                         className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center space-x-2 ${
// // //                           activeTemplateTab === language.id
// // //                             ? 'border-blue-500 text-blue-600 bg-white'
// // //                             : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
// // //                         }`}
// // //                       >
// // //                         <span>{language.name}</span>
// // //                         {validateTemplate(language.id) ? (
// // //                           <Check className="w-4 h-4 text-green-500" />
// // //                         ) : (
// // //                           <AlertTriangle className="w-4 h-4 text-orange-500" />
// // //                         )}
// // //                       </button>
// // //                     ))}
// // //                   </div>

// // //                   {/* Template Editor Content */}
// // //                   {activeTemplateTab && (
// // //                     <div className="p-4">
// // //                       {(() => {
// // //                         const language = languages.find(l => l.id === activeTemplateTab);
// // //                         const template = templates[activeTemplateTab];
                        
// // //                         if (!language || !template) return null;

// // //                         return (
// // //                           <div className="space-y-4">
// // //                             <div className="flex items-center justify-between mb-3">
// // //                               <h4 className="font-medium text-gray-700">
// // //                                 Template for {language.name}
// // //                               </h4>
// // //                               <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
// // //                                 Placeholder: {template.placeholder}
// // //                               </div>
// // //                             </div>

// // //                             <div>
// // //                               <label className="block text-sm font-medium text-gray-600 mb-2">
// // //                                 Placeholder Text *
// // //                               </label>
// // //                               <input
// // //                                 type="text"
// // //                                 value={template.placeholder}
// // //                                 onChange={(e) => updateTemplate(activeTemplateTab, 'placeholder', e.target.value)}
// // //                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
// // //                                 placeholder="USER_FUNCTION_PLACEHOLDER"
// // //                               />
// // //                             </div>

// // //                             <div>
// // //                               <label className="block text-sm font-medium text-gray-600 mb-2">
// // //                                 Template Code *
// // //                                 <span className="text-xs text-gray-500 ml-2">
// // //                                   (Must contain the placeholder text)
// // //                                 </span>
// // //                               </label>
// // //                               <div className="relative">
// // //                                 <textarea
// // //                                   value={template.templateCode}
// // //                                   onChange={(e) => updateTemplate(activeTemplateTab, 'templateCode', e.target.value)}
// // //                                   className={`w-full h-80 px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none ${
// // //                                     !template.templateCode.includes(template.placeholder)
// // //                                       ? 'border-red-300 bg-red-50'
// // //                                       : 'border-gray-300 bg-gray-50'
// // //                                   }`}
// // //                                   placeholder={`Enter template code for ${language.name}...`}
// // //                                 />
// // //                                 {!template.templateCode.includes(template.placeholder) && (
// // //                                   <div className="absolute bottom-2 right-2 text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
// // //                                     Missing placeholder: {template.placeholder}
// // //                                   </div>
// // //                                 )}
// // //                               </div>
// // //                             </div>

// // //                             <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded-lg">
// // //                               <strong>Template Guide:</strong>
// // //                               <ul className="mt-2 space-y-1 list-disc list-inside">
// // //                                 <li>Include input parsing logic to read from stdin</li>
// // //                                 <li>Place <code className="bg-gray-200 px-1 rounded">{template.placeholder}</code> where user's function should be inserted</li>
// // //                                 <li>Add function call with proper parameters</li>
// // //                                 <li>Format and print the result as expected</li>
// // //                               </ul>
// // //                             </div>
// // //                           </div>
// // //                         );
// // //                       })()}
// // //                     </div>
// // //                   )}

// // //                   {!activeTemplateTab && (
// // //                     <div className="p-8 text-center text-gray-500">
// // //                       <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
// // //                       <p>Click on a language tab to edit its template</p>
// // //                     </div>
// // //                   )}
// // //                 </div>
// // //               </>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default FunctionDefinitionTab;





// // import React, { useState, useEffect } from 'react';
// // import { Code, Plus, X, Check, Languages, FileText, Edit3 } from "lucide-react";
// // import { SUPPORTED_TYPES, type Parameter, type Language, type ProblemTemplate, type LanguageTemplate } from "../../../../pages/admin/AddProblemPage";

// // const FunctionDefinitionTab: React.FC<{
// //   functionName: string;
// //   setFunctionName: React.Dispatch<React.SetStateAction<string>>;
// //   returnType: string;
// //   setReturnType: React.Dispatch<React.SetStateAction<string>>;
// //   parameters: Parameter[];
// //   setParameters: React.Dispatch<React.SetStateAction<Parameter[]>>;
// //   languages: Language[];
// //   selectedLanguageIds: number[];
// //   setSelectedLanguageIds: React.Dispatch<React.SetStateAction<number[]>>;
// //   templates: ProblemTemplate;
// //   setTemplates: React.Dispatch<React.SetStateAction<ProblemTemplate>>;
// //   isLoadingLanguages: boolean;
// //   errors: { [key: string]: string };
// //   setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
// // }> = ({ 
// //   functionName, 
// //   setFunctionName, 
// //   returnType, 
// //   setReturnType, 
// //   parameters, 
// //   setParameters,
// //   languages,
// //   selectedLanguageIds,
// //   setSelectedLanguageIds,
// //   templates,
// //   setTemplates,
// //   isLoadingLanguages,
// //   errors, 
// //   setErrors 
// // }) => {
  
// //   const [activeTemplateTab, setActiveTemplateTab] = useState<number | null>(null);

// //   // Auto-generate templates when languages are selected or function changes
// //   useEffect(() => {
// //     selectedLanguageIds.forEach(langId => {
// //       if (!templates[langId]) {
// //         const language = languages.find(l => l.id === langId);
// //         if (language) {
// //           const generatedTemplate = generateDefaultTemplate(language, functionName, returnType, parameters);
// //           setTemplates(prev => ({
// //             ...prev,
// //             [langId]: generatedTemplate
// //           }));
// //         }
// //       }
// //     });

// //     // Remove templates for unselected languages
// //     const updatedTemplates = { ...templates };
// //     Object.keys(updatedTemplates).forEach(langIdStr => {
// //       const langId = parseInt(langIdStr);
// //       if (!selectedLanguageIds.includes(langId)) {
// //         delete updatedTemplates[langId];
// //       }
// //     });
// //     setTemplates(updatedTemplates);
// //   }, [selectedLanguageIds, languages]);

// //   // Update templates when function definition changes
// //   useEffect(() => {
// //     if (functionName && parameters.length > 0) {
// //       selectedLanguageIds.forEach(langId => {
// //         const language = languages.find(l => l.id === langId);
// //         if (language && templates[langId]) {
// //           const newSignature = generateFunctionSignature(getLanguageKey(language.name), functionName, returnType, parameters);
// //           setTemplates(prev => ({
// //             ...prev,
// //             [langId]: {
// //               ...prev[langId],
// //               userFunctionSignature: newSignature
// //             }
// //           }));
// //         }
// //       });
// //     }
// //   }, [functionName, returnType, parameters, selectedLanguageIds, languages]);

// //   const generateDefaultTemplate = (language: Language, funcName: string, retType: string, params: Parameter[]): LanguageTemplate => {
// //     const languageKey = getLanguageKey(language.name);
// //     const placeholder = "USER_FUNCTION_PLACEHOLDER";
// //     const signature = generateFunctionSignature(languageKey, funcName, retType, params);
    
// //     const validParams = params.filter(p => p.name.trim() && p.type);

// //     switch (languageKey) {
// //       case 'c':
// //         return {
// //           templateCode: `#include <stdio.h>
// // #include <stdlib.h>

// // ${placeholder}

// // int main() {
// //     // Read input from stdin
// // ${validParams.map(p => `    // TODO: Read ${p.name} (${p.type})`).join('\n')}
    
// //     // Call your function
// //     // TODO: Call ${funcName} and print result
    
// //     return 0;
// // }`,
// //           userFunctionSignature: signature,
// //           placeholder
// //         };

// //       case 'cpp':
// //         return {
// //           templateCode: `#include <iostream>
// // #include <vector>
// // #include <string>
// // using namespace std;

// // ${placeholder}

// // int main() {
// //     // Read input from stdin
// // ${validParams.map(p => `    // TODO: Read ${p.name} (${p.type})`).join('\n')}
    
// //     // Call your function
// //     // TODO: Call ${funcName} and print result
    
// //     return 0;
// // }`,
// //           userFunctionSignature: signature,
// //           placeholder
// //         };

// //       case 'java':
// //         return {
// //           templateCode: `import java.util.*;
// // import java.io.*;

// // public class Solution {
// //     ${placeholder}
    
// //     public static void main(String[] args) throws IOException {
// //         BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        
// //         // Read input from stdin
// // ${validParams.map(p => `        // TODO: Read ${p.name} (${p.type})`).join('\n')}
        
// //         Solution solution = new Solution();
// //         // TODO: Call ${funcName} and print result
        
// //         br.close();
// //     }
// // }`,
// //           userFunctionSignature: signature,
// //           placeholder
// //         };

// //       case 'python':
// //         return {
// //           templateCode: `import sys
// // from typing import List, Optional

// // class Solution:
// //     ${placeholder}

// // if __name__ == "__main__":
// //     # Read input from stdin
// //     lines = sys.stdin.read().strip().split('\\n')
    
// //     # TODO: Parse input
// // ${validParams.map(p => `    # ${p.name}: ${p.type}`).join('\n')}
    
// //     # Create solution instance and call function
// //     solution = Solution()
// //     # TODO: Call ${funcName} and print result`,
// //           userFunctionSignature: signature,
// //           placeholder
// //         };

// //       case 'javascript':
// //       case 'nodejs':
// //         return {
// //           templateCode: `const readline = require('readline');

// // ${placeholder}

// // const rl = readline.createInterface({
// //     input: process.stdin,
// //     output: process.stdout
// // });

// // let lines = [];
// // rl.on('line', (line) => {
// //     lines.push(line.trim());
// // }).on('close', () => {
// //     // Parse input
// // ${validParams.map(p => `    // TODO: Parse ${p.name} (${p.type})`).join('\n')}
    
// //     // Call function and print result
// //     // TODO: Call ${funcName} and print result
// // });`,
// //           userFunctionSignature: signature,
// //           placeholder
// //         };

// //       default:
// //         return {
// //           templateCode: `${placeholder}

// // // TODO: Implement main function and input/output handling
// // // Read from stdin, call your function, and print the result`,
// //           userFunctionSignature: signature,
// //           placeholder
// //         };
// //     }
// //   };

// //   const addParameter = () => {
// //     const newId = Date.now().toString();
// //     setParameters(prev => [...prev, { id: newId, name: '', type: 'number', description: '' }]);
// //   };

// //   const removeParameter = (id: string) => {
// //     setParameters(prev => {
// //       if (prev.length > 1) {
// //         return prev.filter(param => param.id !== id);
// //       }
// //       return prev;
// //     });
// //   };

// //   const updateParameter = (id: string, field: keyof Parameter, value: string) => {
// //     setParameters(prev => prev.map(param => {
// //       if (param.id === id) {
// //         return { ...param, [field]: value };
// //       }
// //       return param;
// //     }));
// //   };

// //   const handleLanguageToggle = (languageId: number) => {
// //     setSelectedLanguageIds(prev => {
// //       if (prev.includes(languageId)) {
// //         return prev.filter(id => id !== languageId);
// //       } else {
// //         return [...prev, languageId];
// //       }
// //     });
// //   };

// //   const updateTemplate = (languageId: number, field: keyof LanguageTemplate, value: string) => {
// //     setTemplates(prev => ({
// //       ...prev,
// //       [languageId]: {
// //         ...prev[languageId],
// //         [field]: value
// //       }
// //     }));
// //   };

// //   const getLanguageKey = (languageName: string): string => {
// //     const name = languageName.toLowerCase();
// //     if (name.includes('c++') || name.includes('cpp')) return 'cpp';
// //     if (name.includes('c') && !name.includes('c++') && !name.includes('c#')) return 'c';
// //     if (name.includes('java') && !name.includes('javascript')) return 'java';
// //     if (name.includes('python')) return 'python';
// //     if (name.includes('javascript') || name.includes('node')) return 'javascript';
// //     if (name.includes('typescript')) return 'typescript';
// //     if (name.includes('c#') || name.includes('csharp')) return 'csharp';
// //     if (name.includes('go')) return 'go';
// //     if (name.includes('rust')) return 'rust';
// //     if (name.includes('kotlin')) return 'kotlin';
// //     if (name.includes('swift')) return 'swift';
// //     return 'generic';
// //   };

// //   const generateFunctionSignature = (languageKey: string, funcName: string, retType: string, params: Parameter[]) => {
// //     if (!funcName) return '';
    
// //     const typeMap: { [key: string]: { [lang: string]: string } } = {
// //       'number': { 
// //         typescript: 'number', 
// //         javascript: 'number',
// //         java: 'int', 
// //         python: 'int', 
// //         cpp: 'int',
// //         c: 'int',
// //         csharp: 'int',
// //         go: 'int',
// //         rust: 'i32',
// //         kotlin: 'Int',
// //         swift: 'Int',
// //         generic: 'int'
// //       },
// //       'string': { 
// //         typescript: 'string',
// //         javascript: 'string', 
// //         java: 'String', 
// //         python: 'str', 
// //         cpp: 'string',
// //         c: 'char*',
// //         csharp: 'string',
// //         go: 'string',
// //         rust: 'String',
// //         kotlin: 'String',
// //         swift: 'String',
// //         generic: 'string'
// //       },
// //       'boolean': { 
// //         typescript: 'boolean',
// //         javascript: 'boolean', 
// //         java: 'boolean', 
// //         python: 'bool', 
// //         cpp: 'bool',
// //         c: 'int',
// //         csharp: 'bool',
// //         go: 'bool',
// //         rust: 'bool',
// //         kotlin: 'Boolean',
// //         swift: 'Bool',
// //         generic: 'bool'
// //       },
// //       'number[]': { 
// //         typescript: 'number[]',
// //         javascript: 'number[]', 
// //         java: 'int[]', 
// //         python: 'List[int]', 
// //         cpp: 'vector<int>',
// //         c: 'int*',
// //         csharp: 'int[]',
// //         go: '[]int',
// //         rust: 'Vec<i32>',
// //         kotlin: 'IntArray',
// //         swift: '[Int]',
// //         generic: 'int[]'
// //       },
// //       'string[]': { 
// //         typescript: 'string[]',
// //         javascript: 'string[]', 
// //         java: 'String[]', 
// //         python: 'List[str]', 
// //         cpp: 'vector<string>',
// //         c: 'char**',
// //         csharp: 'string[]',
// //         go: '[]string',
// //         rust: 'Vec<String>',
// //         kotlin: 'Array<String>',
// //         swift: '[String]',
// //         generic: 'string[]'
// //       }
// //     };

// //     const validParams = params.filter(p => p.name.trim() && p.type);
// //     const paramStrings = validParams.map(p => {
// //       const mappedType = typeMap[p.type]?.[languageKey] || p.type;
// //       switch (languageKey) {
// //         case 'typescript':
// //         case 'javascript':
// //           return `${p.name}: ${mappedType}`;
// //         case 'java':
// //         case 'csharp':
// //         case 'cpp':
// //         case 'c':
// //         case 'kotlin':
// //           return `${mappedType} ${p.name}`;
// //         case 'python':
// //           return `${p.name}: ${mappedType}`;
// //         case 'go':
// //           return `${p.name} ${mappedType}`;
// //         case 'rust':
// //           return `${p.name}: ${mappedType}`;
// //         case 'swift':
// //           return `${p.name}: ${mappedType}`;
// //         default:
// //           return `${mappedType} ${p.name}`;
// //       }
// //     }).join(', ');

// //     const mappedReturnType = typeMap[retType]?.[languageKey] || retType;

// //     switch (languageKey) {
// //       case 'typescript':
// //         return `function ${funcName}(${paramStrings}): ${mappedReturnType}`;
// //       case 'javascript':
// //         return `function ${funcName}(${paramStrings})`;
// //       case 'java':
// //         return `public ${mappedReturnType} ${funcName}(${paramStrings})`;
// //       case 'python':
// //         return `def ${funcName}(self, ${paramStrings}) -> ${mappedReturnType}:`;
// //       case 'cpp':
// //         return `${mappedReturnType} ${funcName}(${paramStrings})`;
// //       case 'c':
// //         return `${mappedReturnType} ${funcName}(${paramStrings})`;
// //       case 'csharp':
// //         return `public ${mappedReturnType} ${funcName}(${paramStrings})`;
// //       case 'go':
// //         return `func ${funcName}(${paramStrings}) ${mappedReturnType}`;
// //       case 'rust':
// //         return `fn ${funcName}(${paramStrings}) -> ${mappedReturnType}`;
// //       case 'kotlin':
// //         return `fun ${funcName}(${paramStrings}): ${mappedReturnType}`;
// //       case 'swift':
// //         return `func ${funcName}(${paramStrings}) -> ${mappedReturnType}`;
// //       default:
// //         return `${mappedReturnType} ${funcName}(${paramStrings})`;
// //     }
// //   };

// //   const selectedLanguages = languages.filter(lang => selectedLanguageIds.includes(lang.id));

// //   return (
// //     <div className="space-y-6">
// //       {/* Basic Function Definition */}
// //       <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
// //         <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
// //           <Code className="w-6 h-6 mr-3 text-blue-600" />
// //           Function Definition
// //         </h2>

// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //           <div>
// //             <label className="block text-sm font-semibold text-gray-700 mb-3">
// //               Function Name *
// //             </label>
// //             <input
// //               type="text"
// //               value={functionName}
// //               onChange={(e) => setFunctionName(e.target.value)}
// //               className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono"
// //               placeholder="twoSum"
// //             />
// //           </div>

// //           <div>
// //             <label className="block text-sm font-semibold text-gray-700 mb-3">
// //               Return Type *
// //             </label>
// //             <select
// //               value={returnType}
// //               onChange={(e) => setReturnType(e.target.value)}
// //               className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
// //             >
// //               {SUPPORTED_TYPES.map(type => (
// //                 <option key={type} value={type}>{type}</option>
// //               ))}
// //             </select>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Parameters Section */}
// //       <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
// //         <div className="flex justify-between items-center mb-4">
// //           <h3 className="text-lg font-semibold text-gray-700">Parameters</h3>
// //           <button
// //             type="button"
// //             onClick={addParameter}
// //             className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
// //           >
// //             <Plus className="w-4 h-4 mr-2" />
// //             Add Parameter
// //           </button>
// //         </div>

// //         <div className="space-y-4">
// //           {parameters.map((param, index) => (
// //             <div key={param.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
// //               <div className="flex justify-between items-center mb-3">
// //                 <h4 className="font-medium text-gray-700">Parameter {index + 1}</h4>
// //                 {parameters.length > 1 && (
// //                   <button
// //                     type="button"
// //                     onClick={() => removeParameter(param.id)}
// //                     className="text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-50 rounded"
// //                   >
// //                     <X className="w-4 h-4" />
// //                   </button>
// //                 )}
// //               </div>

// //               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
// //                   <input
// //                     type="text"
// //                     value={param.name}
// //                     onChange={(e) => updateParameter(param.id, 'name', e.target.value)}
// //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
// //                     placeholder="nums"
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-600 mb-1">Type</label>
// //                   <select
// //                     value={param.type}
// //                     onChange={(e) => updateParameter(param.id, 'type', e.target.value)}
// //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                   >
// //                     {SUPPORTED_TYPES.map(type => (
// //                       <option key={type} value={type}>{type}</option>
// //                     ))}
// //                   </select>
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
// //                   <input
// //                     type="text"
// //                     value={param.description}
// //                     onChange={(e) => updateParameter(param.id, 'description', e.target.value)}
// //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                     placeholder="Array of integers"
// //                   />
// //                 </div>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       </div>

// //       {/* Language Selection */}
// //       <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
// //         <div className="flex justify-between items-center mb-4">
// //           <h3 className="text-lg font-semibold text-gray-700">Supported Languages</h3>
// //           <div className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
// //             {selectedLanguageIds.length} selected
// //           </div>
// //         </div>

// //         {isLoadingLanguages ? (
// //           <div className="flex items-center justify-center py-8 text-gray-500">
// //             <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
// //             Loading languages...
// //           </div>
// //         ) : (
// //           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
// //             {languages.map((language) => (
// //               <label key={language.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
// //                 <input
// //                   type="checkbox"
// //                   checked={selectedLanguageIds.includes(language.id)}
// //                   onChange={() => handleLanguageToggle(language.id)}
// //                   className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
// //                 />
// //                 <span className="text-sm font-medium text-gray-700 flex-1">
// //                   {language.name}
// //                 </span>
// //                 {selectedLanguageIds.includes(language.id) && templates[language.id] && (
// //                   <Check className="w-4 h-4 text-green-600" />
// //                 )}
// //               </label>
// //             ))}
// //           </div>
// //         )}
// //       </div>

// //       {/* Templates Section */}
// //       {selectedLanguages.length > 0 && (
// //         <div className="bg-white rounded-xl border-2 border-gray-200">
// //           <div className="p-6 border-b border-gray-200">
// //             <h3 className="text-lg font-semibold text-gray-700 flex items-center">
// //               <FileText className="w-5 h-5 mr-2" />
// //               Language Templates & Signatures
// //               <span className="text-sm font-normal text-gray-500 ml-2">
// //                 ({selectedLanguages.length} languages)
// //               </span>
// //             </h3>
// //           </div>

// //           {/* Language Template Tabs */}
// //           <div className="flex flex-wrap border-b border-gray-200 bg-gray-50 px-6">
// //             {selectedLanguages.map((language) => (
// //               <button
// //                 key={language.id}
// //                 onClick={() => setActiveTemplateTab(activeTemplateTab === language.id ? null : language.id)}
// //                 className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
// //                   activeTemplateTab === language.id
// //                     ? 'border-blue-500 text-blue-600 bg-white'
// //                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
// //                 }`}
// //               >
// //                 {language.name}
// //               </button>
// //             ))}
// //           </div>

// //           {/* Template Editor Content */}
// //           {activeTemplateTab && templates[activeTemplateTab] && (
// //             <div className="p-6">
// //               {(() => {
// //                 const language = languages.find(l => l.id === activeTemplateTab);
// //                 const template = templates[activeTemplateTab];
                
// //                 if (!language || !template) return null;

// //                 return (
// //                   <div className="space-y-6">
// //                     <div className="flex items-center justify-between">
// //                       <h4 className="text-lg font-medium text-gray-700">
// //                         {language.name} Configuration
// //                       </h4>
// //                       <div className="flex items-center space-x-2 text-sm text-gray-500">
// //                         <Edit3 className="w-4 h-4" />
// //                         <span>All fields are editable</span>
// //                       </div>
// //                     </div>

// //                     {/* Input/Output Configuration */}
// //                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// //                       <div>
// //                         <label className="block text-sm font-medium text-gray-600 mb-2">
// //                           Placeholder Text
// //                         </label>
// //                         <input
// //                           type="text"
// //                           value={template.placeholder}
// //                           onChange={(e) => updateTemplate(activeTemplateTab, 'placeholder', e.target.value)}
// //                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
// //                           placeholder="USER_FUNCTION_PLACEHOLDER"
// //                         />
// //                       </div>

// //                       <div>
// //                         <label className="block text-sm font-medium text-gray-600 mb-2">
// //                           Function Signature
// //                         </label>
// //                         <textarea
// //                           value={template.userFunctionSignature}
// //                           onChange={(e) => updateTemplate(activeTemplateTab, 'userFunctionSignature', e.target.value)}
// //                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono resize-none"
// //                           rows={2}
// //                           placeholder="Function signature..."
// //                         />
// //                       </div>
// //                     </div>

// //                     {/* Template Code Box */}
// //                     <div>
// //                       <label className="block text-sm font-medium text-gray-600 mb-2">
// //                         Template Code
// //                         <span className="text-xs text-gray-500 ml-2">
// //                           (This will wrap the user's solution)
// //                         </span>
// //                       </label>
// //                       <div className="relative">
// //                         <textarea
// //                           value={template.templateCode}
// //                           onChange={(e) => updateTemplate(activeTemplateTab, 'templateCode', e.target.value)}
// //                           className="w-full h-96 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none bg-gray-50"
// //                           placeholder={`Enter template code for ${language.name}...`}
// //                           style={{ 
// //                             fontFamily: 'Monaco, Consolas, "Lucida Console", monospace',
// //                             lineHeight: '1.5'
// //                           }}
// //                         />
// //                         <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white px-2 py-1 rounded border">
// //                           Lines: {template.templateCode.split('\n').length}
// //                         </div>
// //                       </div>
// //                     </div>

// //                     {/* Template Guide */}
// //                     <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
// //                       <h5 className="font-medium text-blue-800 mb-2">Template Guide for {language.name}:</h5>
// //                       <ul className="text-sm text-blue-700 space-y-1">
// //                         <li>• Include necessary imports and headers</li>
// //                         <li>• Add input parsing logic to read from stdin</li>
// //                         <li>• Place <code className="bg-blue-100 px-1 rounded">{template.placeholder}</code> where user's function goes</li>
// //                         <li>• Call the function with parsed parameters</li>
// //                         <li>• Format and print the output as expected</li>
// //                       </ul>
// //                     </div>
// //                   </div>
// //                 );
// //               })()}
// //             </div>
// //           )}

// //           {!activeTemplateTab && (
// //             <div className="p-12 text-center text-gray-500">
// //               <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
// //               <p className="text-lg">Click on a language tab above to edit its template and signature</p>
// //               <p className="text-sm mt-2">Templates are automatically generated and fully editable</p>
// //             </div>
// //           )}
// //         </div>
// //       )}

// //       {selectedLanguages.length === 0 && (
// //         <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
// //           <Languages className="w-16 h-16 mx-auto mb-4 text-gray-300" />
// //           <p className="text-lg">Select languages to configure templates</p>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default FunctionDefinitionTab;




// import React, { useState, useEffect } from 'react';
// import { Code, Plus, X, Check, Languages, FileText } from "lucide-react";
// import { SUPPORTED_TYPES, type Parameter, type Language, type ProblemTemplate, type LanguageTemplate } from "../../../../pages/admin/AddProblemPage";

// const FunctionDefinitionTab: React.FC<{
//   functionName: string;
//   setFunctionName: React.Dispatch<React.SetStateAction<string>>;
//   returnType: string;
//   setReturnType: React.Dispatch<React.SetStateAction<string>>;
//   parameters: Parameter[];
//   setParameters: React.Dispatch<React.SetStateAction<Parameter[]>>;
//   languages: Language[];
//   selectedLanguageIds: number[];
//   setSelectedLanguageIds: React.Dispatch<React.SetStateAction<number[]>>;
//   templates: ProblemTemplate;
//   setTemplates: React.Dispatch<React.SetStateAction<ProblemTemplate>>;
//   isLoadingLanguages: boolean;
//   errors: { [key: string]: string };
//   setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
// }> = ({ 
//   functionName, 
//   setFunctionName, 
//   returnType, 
//   setReturnType, 
//   parameters, 
//   setParameters,
//   languages,
//   selectedLanguageIds,
//   setSelectedLanguageIds,
//   templates,
//   setTemplates,
//   isLoadingLanguages,
//   errors, 
//   setErrors 
// }) => {
  
//   const [activeTemplateTab, setActiveTemplateTab] = useState<number | null>(null);

//   // Initialize empty templates for selected languages
//   useEffect(() => {
//     selectedLanguageIds.forEach(langId => {
//       if (!templates[langId]) {
//         setTemplates(prev => ({
//           ...prev,
//           [langId]: {
//             templateCode: '',
//             userFunctionSignature: '',
//             placeholder: 'USER_FUNCTION_PLACEHOLDER'
//           }
//         }));
//       }
//     });

//     // Remove templates for unselected languages
//     const updatedTemplates = { ...templates };
//     Object.keys(updatedTemplates).forEach(langIdStr => {
//       const langId = parseInt(langIdStr);
//       if (!selectedLanguageIds.includes(langId)) {
//         delete updatedTemplates[langId];
//       }
//     });
//     setTemplates(updatedTemplates);
//   }, [selectedLanguageIds]);

//   const addParameter = () => {
//     const newId = Date.now().toString();
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

//   const updateParameter = (id: string, field: keyof Parameter, value: string) => {
//     setParameters(prev => prev.map(param => {
//       if (param.id === id) {
//         return { ...param, [field]: value };
//       }
//       return param;
//     }));
//   };

//   const handleLanguageToggle = (languageId: number) => {
//     setSelectedLanguageIds(prev => {
//       if (prev.includes(languageId)) {
//         return prev.filter(id => id !== languageId);
//       } else {
//         return [...prev, languageId];
//       }
//     });
//   };

//   const updateTemplate = (languageId: number, field: keyof LanguageTemplate, value: string) => {
//     setTemplates(prev => ({
//       ...prev,
//       [languageId]: {
//         ...prev[languageId],
//         [field]: value
//       }
//     }));
//   };

//   const selectedLanguages = languages.filter(lang => selectedLanguageIds.includes(lang.id));

//   return (
//     <div className="space-y-6">
//       {/* Basic Function Definition */}
//       <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
//         <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
//           <Code className="w-6 h-6 mr-3 text-blue-600" />
//           Function Definition
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-3">
//               Function Name *
//             </label>
//             <input
//               type="text"
//               value={functionName}
//               onChange={(e) => setFunctionName(e.target.value)}
//               className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono"
//               placeholder="twoSum"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-3">
//               Return Type *
//             </label>
//             <select
//               value={returnType}
//               onChange={(e) => setReturnType(e.target.value)}
//               className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//             >
//               {SUPPORTED_TYPES.map(type => (
//                 <option key={type} value={type}>{type}</option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Parameters Section */}
//       <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-semibold text-gray-700">Parameters</h3>
//           <button
//             type="button"
//             onClick={addParameter}
//             className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
//           >
//             <Plus className="w-4 h-4 mr-2" />
//             Add Parameter
//           </button>
//         </div>

//         <div className="space-y-4">
//           {parameters.map((param, index) => (
//             <div key={param.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
//               <div className="flex justify-between items-center mb-3">
//                 <h4 className="font-medium text-gray-700">Parameter {index + 1}</h4>
//                 {parameters.length > 1 && (
//                   <button
//                     type="button"
//                     onClick={() => removeParameter(param.id)}
//                     className="text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-50 rounded"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 )}
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
//                   <input
//                     type="text"
//                     value={param.name}
//                     onChange={(e) => updateParameter(param.id, 'name', e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
//                     placeholder="nums"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">Type</label>
//                   <select
//                     value={param.type}
//                     onChange={(e) => updateParameter(param.id, 'type', e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     {SUPPORTED_TYPES.map(type => (
//                       <option key={type} value={type}>{type}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
//                   <input
//                     type="text"
//                     value={param.description}
//                     onChange={(e) => updateParameter(param.id, 'description', e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="Array of integers"
//                   />
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Language Selection */}
//       <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-semibold text-gray-700">Supported Languages</h3>
//           <div className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
//             {selectedLanguageIds.length} selected
//           </div>
//         </div>

//         {isLoadingLanguages ? (
//           <div className="flex items-center justify-center py-8 text-gray-500">
//             <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
//             Loading languages...
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
//             {languages.map((language) => (
//               <label key={language.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
//                 <input
//                   type="checkbox"
//                   checked={selectedLanguageIds.includes(language.id)}
//                   onChange={() => handleLanguageToggle(language.id)}
//                   className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
//                 />
//                 <span className="text-sm font-medium text-gray-700 flex-1">
//                   {language.name}
//                 </span>
//               </label>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Templates Section - Simple Input Boxes */}
//       {selectedLanguages.length > 0 && (
//         <div className="bg-white rounded-xl border-2 border-gray-200">
//           <div className="p-6 border-b border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-700 flex items-center">
//               <FileText className="w-5 h-5 mr-2" />
//               Language Templates
//               <span className="text-sm font-normal text-gray-500 ml-2">
//                 ({selectedLanguages.length} languages)
//               </span>
//             </h3>
//           </div>

//           {/* Language Template Tabs */}
//           <div className="flex flex-wrap border-b border-gray-200 bg-gray-50 px-6">
//             {selectedLanguages.map((language) => (
//               <button
//                 key={language.id}
//                 onClick={() => setActiveTemplateTab(activeTemplateTab === language.id ? null : language.id)}
//                 className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
//                   activeTemplateTab === language.id
//                     ? 'border-blue-500 text-blue-600 bg-white'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                 }`}
//               >
//                 {language.name}
//               </button>
//             ))}
//           </div>

//           {/* Simple Template Editor */}
//           {activeTemplateTab && templates[activeTemplateTab] && (
//             <div className="p-6">
//               {(() => {
//                 const language = languages.find(l => l.id === activeTemplateTab);
//                 const template = templates[activeTemplateTab];
                
//                 if (!language || !template) return null;

//                 return (
//                   <div className="space-y-6">
//                     <h4 className="text-lg font-medium text-gray-700 mb-4">
//                       {language.name} Template Configuration
//                     </h4>

//                     {/* Function Signature Input Box */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Function Signature
//                       </label>
//                       <input
//                         type="text"
//                         value={template.userFunctionSignature}
//                         onChange={(e) => updateTemplate(activeTemplateTab, 'userFunctionSignature', e.target.value)}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm bg-gray-50"
//                         placeholder="e.g., int* twoSum(int* nums, int numsSize, int target, int* returnSize)"
//                         style={{ fontFamily: 'Monaco, Consolas, "Lucida Console", monospace' }}
//                       />
//                     </div>

//                     {/* Template Code Box */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Template Code
//                         <span className="text-xs text-gray-500 ml-2">
//                           (Use {template.placeholder} as placeholder)
//                         </span>
//                       </label>
//                       <textarea
//                         value={template.templateCode}
//                         onChange={(e) => updateTemplate(activeTemplateTab, 'templateCode', e.target.value)}
//                         className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none bg-gray-50"
//                         placeholder={`Enter template code for ${language.name}...

// Example:
// #include <stdio.h>
// #include <stdlib.h>

// ${template.placeholder}

// int main() {
//     // Read input
//     // Call function
//     // Print result
//     return 0;
// }`}
//                         style={{ 
//                           fontFamily: 'Monaco, Consolas, "Lucida Console", monospace',
//                           lineHeight: '1.4'
//                         }}
//                       />
//                     </div>

//                     {/* Placeholder Input */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Placeholder Text
//                       </label>
//                       <input
//                         type="text"
//                         value={template.placeholder}
//                         onChange={(e) => updateTemplate(activeTemplateTab, 'placeholder', e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
//                         placeholder="USER_FUNCTION_PLACEHOLDER"
//                       />
//                     </div>
//                   </div>
//                 );
//               })()}
//             </div>
//           )}

//           {!activeTemplateTab && (
//             <div className="p-12 text-center text-gray-500">
//               <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
//               <p className="text-lg">Click on a language tab above to edit its template</p>
//             </div>
//           )}
//         </div>
//       )}

//       {selectedLanguages.length === 0 && (
//         <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
//           <Languages className="w-16 h-16 mx-auto mb-4 text-gray-300" />
//           <p className="text-lg">Select languages to create templates</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FunctionDefinitionTab;













import React, { useState, useEffect } from 'react';
import { Code, Plus, X, Check, Languages, FileText } from "lucide-react";
import { SUPPORTED_TYPES, type Parameter, type Language, type ProblemTemplate, type LanguageTemplate } from "../../../../pages/admin/AddProblemPage";

const FunctionDefinitionTab: React.FC<{
  functionName: string;
  setFunctionName: React.Dispatch<React.SetStateAction<string>>;
  returnType: string;
  setReturnType: React.Dispatch<React.SetStateAction<string>>;
  parameters: Parameter[];
  setParameters: React.Dispatch<React.SetStateAction<Parameter[]>>;
  languages: Language[];
  selectedLanguageIds: number[];
  setSelectedLanguageIds: React.Dispatch<React.SetStateAction<number[]>>;
  templates: ProblemTemplate;
  setTemplates: React.Dispatch<React.SetStateAction<ProblemTemplate>>;
  isLoadingLanguages: boolean;
  errors: { [key: string]: string };
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}> = ({ 
  functionName, 
  setFunctionName, 
  returnType, 
  setReturnType, 
  parameters, 
  setParameters,
  languages,
  selectedLanguageIds,
  setSelectedLanguageIds,
  templates,
  setTemplates,
  isLoadingLanguages,
  errors, 
  setErrors 
}) => {
  
  const [activeTemplateTab, setActiveTemplateTab] = useState<number | null>(null);

  const getLanguageKey = (languageName: string): string => {
    const name = languageName.toLowerCase();
    if (name.includes('c++') || name.includes('cpp')) return 'cpp';
    if (name.includes('c') && !name.includes('c++') && !name.includes('c#')) return 'c';
    if (name.includes('java') && !name.includes('javascript')) return 'java';
    if (name.includes('python')) return 'python';
    if (name.includes('javascript') || name.includes('node')) return 'javascript';
    if (name.includes('typescript')) return 'typescript';
    if (name.includes('c#') || name.includes('csharp')) return 'csharp';
    if (name.includes('go')) return 'go';
    if (name.includes('rust')) return 'rust';
    if (name.includes('kotlin')) return 'kotlin';
    if (name.includes('swift')) return 'swift';
    return 'generic';
  };

  const generateFunctionSignature = (languageKey: string, funcName: string, retType: string, params: Parameter[]) => {
    if (!funcName || params.some(p => !p.name || !p.type)) return '';
    
    const typeMap: { [key: string]: { [lang: string]: string } } = {
      'number': { 
        typescript: 'number', 
        javascript: 'number',
        java: 'int', 
        python: 'int', 
        cpp: 'int',
        c: 'int',
        csharp: 'int',
        go: 'int',
        rust: 'i32',
        kotlin: 'Int',
        swift: 'Int',
        generic: 'int'
      },
      'string': { 
        typescript: 'string',
        javascript: 'string', 
        java: 'String', 
        python: 'str', 
        cpp: 'string',
        c: 'char*',
        csharp: 'string',
        go: 'string',
        rust: 'String',
        kotlin: 'String',
        swift: 'String',
        generic: 'string'
      },
      'boolean': { 
        typescript: 'boolean',
        javascript: 'boolean', 
        java: 'boolean', 
        python: 'bool', 
        cpp: 'bool',
        c: 'int',
        csharp: 'bool',
        go: 'bool',
        rust: 'bool',
        kotlin: 'Boolean',
        swift: 'Bool',
        generic: 'bool'
      },
      'number[]': { 
        typescript: 'number[]',
        javascript: 'number[]', 
        java: 'int[]', 
        python: 'List[int]', 
        cpp: 'vector<int>',
        c: 'int*',
        csharp: 'int[]',
        go: '[]int',
        rust: 'Vec<i32>',
        kotlin: 'IntArray',
        swift: '[Int]',
        generic: 'int[]'
      },
      'string[]': { 
        typescript: 'string[]',
        javascript: 'string[]', 
        java: 'String[]', 
        python: 'List[str]', 
        cpp: 'vector<string>',
        c: 'char**',
        csharp: 'string[]',
        go: '[]string',
        rust: 'Vec<String>',
        kotlin: 'Array<String>',
        swift: '[String]',
        generic: 'string[]'
      }
    };

    const validParams = params.filter(p => p.name.trim() && p.type);
    const paramStrings = validParams.map(p => {
      const mappedType = typeMap[p.type]?.[languageKey] || p.type;
      switch (languageKey) {
        case 'typescript':
        case 'javascript':
          return `${p.name}: ${mappedType}`;
        case 'java':
        case 'csharp':
        case 'cpp':
        case 'c':
        case 'kotlin':
          return `${mappedType} ${p.name}`;
        case 'python':
          return `${p.name}: ${mappedType}`;
        case 'go':
          return `${p.name} ${mappedType}`;
        case 'rust':
          return `${p.name}: ${mappedType}`;
        case 'swift':
          return `${p.name}: ${mappedType}`;
        default:
          return `${mappedType} ${p.name}`;
      }
    }).join(', ');

    const mappedReturnType = typeMap[retType]?.[languageKey] || retType;

    switch (languageKey) {
      case 'typescript':
        return `function ${funcName}(${paramStrings}): ${mappedReturnType}`;
      case 'javascript':
        return `function ${funcName}(${paramStrings})`;
      case 'java':
        return `public ${mappedReturnType} ${funcName}(${paramStrings})`;
      case 'python':
        return `def ${funcName}(self, ${paramStrings}) -> ${mappedReturnType}:`;
      case 'cpp':
        return `${mappedReturnType} ${funcName}(${paramStrings})`;
      case 'c':
        return `${mappedReturnType} ${funcName}(${paramStrings})`;
      case 'csharp':
        return `public ${mappedReturnType} ${funcName}(${paramStrings})`;
      case 'go':
        return `func ${funcName}(${paramStrings}) ${mappedReturnType}`;
      case 'rust':
        return `fn ${funcName}(${paramStrings}) -> ${mappedReturnType}`;
      case 'kotlin':
        return `fun ${funcName}(${paramStrings}): ${mappedReturnType}`;
      case 'swift':
        return `func ${funcName}(${paramStrings}) -> ${mappedReturnType}`;
      default:
        return `${mappedReturnType} ${funcName}(${paramStrings})`;
    }
  };

  const generateDefaultTemplate = (language: Language, funcName: string, retType: string, params: Parameter[]): LanguageTemplate => {
    const languageKey = getLanguageKey(language.name);
    const placeholder = "USER_FUNCTION_PLACEHOLDER";
    const signature = generateFunctionSignature(languageKey, funcName, retType, params);
    
    const validParams = params.filter(p => p.name.trim() && p.type);

    switch (languageKey) {
      case 'c':
        return {
          templateCode: `#include <stdio.h>
#include <stdlib.h>

${placeholder}

int main() {
    // Read input from stdin
${validParams.map(p => `    // TODO: Read ${p.name} (${p.type})`).join('\n')}
    
    // Call your function
    // TODO: Call ${funcName} and print result
    
    return 0;
}`,
          userFunctionSignature: signature,
          placeholder
        };

      case 'cpp':
        return {
          templateCode: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

${placeholder}

int main() {
    // Read input from stdin
${validParams.map(p => `    // TODO: Read ${p.name} (${p.type})`).join('\n')}
    
    // Call your function
    // TODO: Call ${funcName} and print result
    
    return 0;
}`,
          userFunctionSignature: signature,
          placeholder
        };

      case 'java':
        return {
          templateCode: `import java.util.*;
import java.io.*;

public class Solution {
    ${placeholder}
    
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        
        // Read input from stdin
${validParams.map(p => `        // TODO: Read ${p.name} (${p.type})`).join('\n')}
        
        Solution solution = new Solution();
        // TODO: Call ${funcName} and print result
        
        br.close();
    }
}`,
          userFunctionSignature: signature,
          placeholder
        };

      case 'python':
        return {
          templateCode: `import sys
from typing import List, Optional

class Solution:
    ${placeholder}

if __name__ == "__main__":
    # Read input from stdin
    lines = sys.stdin.read().strip().split('\\n')
    
    # TODO: Parse input
${validParams.map(p => `    # ${p.name}: ${p.type}`).join('\n')}
    
    # Create solution instance and call function
    solution = Solution()
    # TODO: Call ${funcName} and print result`,
          userFunctionSignature: signature,
          placeholder
        };

      case 'javascript':
      case 'nodejs':
        return {
          templateCode: `const readline = require('readline');

${placeholder}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let lines = [];
rl.on('line', (line) => {
    lines.push(line.trim());
}).on('close', () => {
    // Parse input
${validParams.map(p => `    // TODO: Parse ${p.name} (${p.type})`).join('\n')}
    
    // Call function and print result
    // TODO: Call ${funcName} and print result
});`,
          userFunctionSignature: signature,
          placeholder
        };

      default:
        return {
          templateCode: `${placeholder}

// TODO: Implement main function and input/output handling
// Read from stdin, call your function, and print the result`,
          userFunctionSignature: signature,
          placeholder
        };
    }
  };

  // Initialize and cleanup templates
  useEffect(() => {
    setTemplates(prev => {
      const newTemplates = { ...prev };

      selectedLanguageIds.forEach(langId => {
        if (!newTemplates[langId]) {
          const language = languages.find(l => l.id === langId);
          if (language) {
            newTemplates[langId] = generateDefaultTemplate(language, functionName, returnType, parameters);
          }
        }
      });

      // Cleanup unselected
      Object.keys(newTemplates).forEach(langIdStr => {
        const langId = parseInt(langIdStr);
        if (!selectedLanguageIds.includes(langId)) {
          delete newTemplates[langId];
        }
      });

      return newTemplates;
    });
  }, [selectedLanguageIds, languages, functionName, returnType, parameters]);

  // Update signatures when function definition changes
  useEffect(() => {
    setTemplates(prev => {
      const newTemplates = { ...prev };
      selectedLanguageIds.forEach(langId => {
        const language = languages.find(l => l.id === langId);
        if (language && newTemplates[langId]) {
          const languageKey = getLanguageKey(language.name);
          const newSignature = generateFunctionSignature(languageKey, functionName, returnType, parameters);
          newTemplates[langId] = {
            ...newTemplates[langId],
            userFunctionSignature: newSignature
          };
        }
      });
      return newTemplates;
    });
  }, [functionName, returnType, parameters, selectedLanguageIds, languages]);

  const addParameter = () => {
    const newId = Date.now().toString();
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

  const updateParameter = (id: string, field: keyof Parameter, value: string) => {
    setParameters(prev => prev.map(param => {
      if (param.id === id) {
        return { ...param, [field]: value };
      }
      return param;
    }));
  };

  const handleLanguageToggle = (languageId: number) => {
    setSelectedLanguageIds(prev => {
      if (prev.includes(languageId)) {
        return prev.filter(id => id !== languageId);
      } else {
        return [...prev, languageId];
      }
    });
  };

  const updateTemplate = (languageId: number, field: keyof LanguageTemplate, value: string) => {
    setTemplates(prev => ({
      ...prev,
      [languageId]: {
        ...prev[languageId],
        [field]: value
      }
    }));
  };

  const selectedLanguages = languages.filter(lang => selectedLanguageIds.includes(lang.id));

  return (
    <div className="space-y-6">
      {/* Basic Function Definition */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <Code className="w-6 h-6 mr-3 text-blue-600" />
          Function Definition
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Function Name *
            </label>
            <input
              type="text"
              value={functionName}
              onChange={(e) => setFunctionName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono"
              placeholder="twoSum"
            />
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
        </div>
      </div>

      {/* Parameters Section */}
      <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Parameters</h3>
          <button
            type="button"
            onClick={addParameter}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Parameter
          </button>
        </div>

        <div className="space-y-4">
          {parameters.map((param, index) => (
            <div key={param.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-700">Parameter {index + 1}</h4>
                {parameters.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeParameter(param.id)}
                    className="text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-50 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                  <input
                    type="text"
                    value={param.name}
                    onChange={(e) => updateParameter(param.id, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    placeholder="nums"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Type</label>
                  <select
                    value={param.type}
                    onChange={(e) => updateParameter(param.id, 'type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {SUPPORTED_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                  <input
                    type="text"
                    value={param.description}
                    onChange={(e) => updateParameter(param.id, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Array of integers"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Language Selection */}
      <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Supported Languages</h3>
          <div className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
            {selectedLanguageIds.length} selected
          </div>
        </div>

        {isLoadingLanguages ? (
          <div className="flex items-center justify-center py-8 text-gray-500">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
            Loading languages...
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {languages.map((language) => (
              <label key={language.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={selectedLanguageIds.includes(language.id)}
                  onChange={() => handleLanguageToggle(language.id)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-sm font-medium text-gray-700 flex-1">
                  {language.name}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Templates Section - Simple Input Boxes */}
      {selectedLanguages.length > 0 && (
        <div className="bg-white rounded-xl border-2 border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Language Templates
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({selectedLanguages.length} languages)
              </span>
            </h3>
          </div>

          {/* Language Template Tabs */}
          <div className="flex flex-wrap border-b border-gray-200 bg-gray-50 px-6">
            {selectedLanguages.map((language) => (
              <button
                key={language.id}
                onClick={() => setActiveTemplateTab(activeTemplateTab === language.id ? null : language.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTemplateTab === language.id
                    ? 'border-blue-500 text-blue-600 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {language.name}
              </button>
            ))}
          </div>

          {/* Simple Template Editor */}
          {activeTemplateTab && templates[activeTemplateTab] && (
            <div className="p-6">
              {(() => {
                const language = languages.find(l => l.id === activeTemplateTab);
                const template = templates[activeTemplateTab];
                
                if (!language || !template) return null;

                return (
                  <div className="space-y-6">
                    <h4 className="text-lg font-medium text-gray-700 mb-4">
                      {language.name} Template Configuration
                    </h4>

                    {/* Function Signature Input Box */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Function Signature
                      </label>
                      <input
                        type="text"
                        value={template.userFunctionSignature}
                        onChange={(e) => updateTemplate(activeTemplateTab, 'userFunctionSignature', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm bg-gray-50"
                        placeholder="e.g., int* twoSum(int* nums, int numsSize, int target, int* returnSize)"
                        style={{ fontFamily: 'Monaco, Consolas, "Lucida Console", monospace' }}
                      />
                    </div>

                    {/* Template Code Box */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Template Code
                        <span className="text-xs text-gray-500 ml-2">
                          (Use {template.placeholder} as placeholder)
                        </span>
                      </label>
                      <textarea
                        value={template.templateCode}
                        onChange={(e) => updateTemplate(activeTemplateTab, 'templateCode', e.target.value)}
                        className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none bg-gray-50"
                        placeholder={`Enter template code for ${language.name}...

Example:
#include <stdio.h>
#include <stdlib.h>

${template.placeholder}

int main() {
    // Read input
    // Call function
    // Print result
    return 0;
}`}
                        style={{ 
                          fontFamily: 'Monaco, Consolas, "Lucida Console", monospace',
                          lineHeight: '1.4'
                        }}
                      />
                    </div>

                    {/* Placeholder Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Placeholder Text
                      </label>
                      <input
                        type="text"
                        value={template.placeholder}
                        onChange={(e) => updateTemplate(activeTemplateTab, 'placeholder', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                        placeholder="USER_FUNCTION_PLACEHOLDER"
                      />
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {!activeTemplateTab && (
            <div className="p-12 text-center text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Click on a language tab above to edit its template</p>
            </div>
          )}
        </div>
      )}

      {selectedLanguages.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <Languages className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">Select languages to create templates</p>
        </div>
      )}
    </div>
  );
};

export default FunctionDefinitionTab;