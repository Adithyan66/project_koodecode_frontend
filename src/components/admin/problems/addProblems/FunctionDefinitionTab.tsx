




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