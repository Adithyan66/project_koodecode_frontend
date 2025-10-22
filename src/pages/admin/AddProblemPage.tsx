

import React, { useState, useEffect } from 'react';
import { Plus, Minus, Check, X, Tag, Lightbulb, Building, Code, Settings, Eye, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import httpClient from '../../services/axios/httpClient';
import { useNavigate } from 'react-router-dom';
import BasicInfoTab from '../../components/admin/problems/addProblems/BasicInfoTab';
import FunctionDefinitionTab from '../../components/admin/problems/addProblems/FunctionDefinitionTab';
import ConstraintsTab from '../../components/admin/problems/addProblems/ConstraintsTab';
import ExamplesTab from '../../components/admin/problems/addProblems/ExamplesTab';
import TestCasesTab from '../../components/admin/problems/addProblems/TestCasesTab';
import MetadataTab from '../../components/admin/problems/addProblems/MetadataTab';
import { AdminPanel } from '../../components/admin/AdminPanel';

export interface Parameter {
  id: string;
  name: string;
  type: string;
  description: string;
}

export interface ParameterConstraint {
  parameterName: string;
  type: string;
  minValue?: number;
  maxValue?: number;
  minLength?: number;
  maxLength?: number;
  allowedChars?: string;
  arrayMinLength?: number;
  arrayMaxLength?: number;
  elementConstraints?: {
    minValue?: number;
    maxValue?: number;
    minLength?: number;
    maxLength?: number;
  };
}

export interface ParameterValue {
  [parameterName: string]: any;
}

export interface Example {
  id: string;
  inputs: ParameterValue;
  expectedOutput: any;
  explanation: string;
}

export interface TestCase {
  id: string;
  inputs: ParameterValue;
  expectedOutput: any;
  isSample: boolean;
}

export const SUPPORTED_TYPES = [
  'number', 'string', 'boolean', 'number[]', 'string[]', 'boolean[]',
  'number[][]', 'string[][]', 'TreeNode', 'ListNode', 'object'
];

export const TAB_SEQUENCE = [
  { id: 'basic', title: 'Basic Info', icon: Settings },
  { id: 'function', title: 'Function Definition', icon: Code },
  { id: 'constraints', title: 'Constraints', icon: AlertCircle },
  { id: 'examples', title: 'Examples', icon: Eye },
  { id: 'testcases', title: 'Test Cases', icon: Check },
  { id: 'metadata', title: 'Tags & Metadata', icon: Tag }
];


export interface Language {
  id: number;
  name: string;
  is_archived?: boolean;
  source_file?: string;
  compile_cmd?: string;
  run_cmd?: string;
}

export interface LanguageTemplate {
  templateCode: string;
  userFunctionSignature: string;
  placeholder: string;
}

export interface ProblemTemplate {
  [languageId: number]: LanguageTemplate;
}


const AddProblemPage: React.FC = () => {
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

  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguageIds, setSelectedLanguageIds] = useState<number[]>([]);
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(false);

  const [templates, setTemplates] = useState<ProblemTemplate>({});


  useEffect(() => {
    const fetchLanguages = async () => {
      setIsLoadingLanguages(true);
      try {
        const response = await httpClient.get('/user/problems/languages');
        if (response.data.success) {
          // Filter out archived languages and sort by name
          const availableLanguages = response.data.data
            .filter((lang: Language) => !lang.is_archived)
            .sort((a: Language, b: Language) => a.name.localeCompare(b.name));
          setLanguages(availableLanguages);

          // Pre-select common languages (optional)
          const commonLanguageNames = ['JavaScript', 'Python', 'Java', 'C++'];
          const commonLanguageIds = availableLanguages
            .filter((lang: Language) =>
              commonLanguageNames.some(name => lang.name.includes(name))
            )
            .map((lang: Language) => lang.id);
          setSelectedLanguageIds(commonLanguageIds);
        }
      } catch (error) {
        console.error('Failed to fetch languages:', error);
        toast.error('Failed to load supported languages');
      } finally {
        setIsLoadingLanguages(false);
      }
    };

    fetchLanguages();
  }, []);


  // Auto-generate constraints when parameters change
  useEffect(() => {
    if (parameters.length > 0 && parameters.some(p => p.name.trim())) {
      const newConstraints = parameters
        .filter(p => p.name.trim())
        .map(p => {
          const existingConstraint = parameterConstraints.find(c => c.parameterName === p.name);

          if (existingConstraint) {
            return { ...existingConstraint, type: p.type };
          }

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

      if (examples.length > 0) {
        const updatedExamples = examples.map(example => {
          const newInputs: ParameterValue = {};
          validParams.forEach(p => {
            newInputs[p.name] = example.inputs[p.name] !== undefined ? example.inputs[p.name] : '';
          });
          return { ...example, inputs: newInputs };
        });
        setExamples(updatedExamples);
      } else {
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

      if (testCases.length > 0) {
        const updatedTestCases = testCases.map(testCase => {
          const newInputs: ParameterValue = {};
          validParams.forEach(p => {
            newInputs[p.name] = testCase.inputs[p.name] !== undefined ? testCase.inputs[p.name] : '';
          });
          return { ...testCase, inputs: newInputs };
        });
        setTestCases(updatedTestCases);
      } else {
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

  const isValidName = (name: string) => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);

  const isEmpty = (value: any): boolean => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (typeof value === 'number') return isNaN(value);
    if (Array.isArray(value)) return value.length === 0;
    return false;
  };

  const validateExamples = () => {
    if (examples.length === 0) return false;

    return examples.some(example => {
      const validParams = parameters.filter(p => p.name.trim());
      const allInputsFilled = validParams.every(param => !isEmpty(example.inputs[param.name]));
      const outputFilled = !isEmpty(example.expectedOutput);
      const explanationFilled = !isEmpty(example.explanation);

      return allInputsFilled && outputFilled && explanationFilled;
    });
  };

  const canGoNext = () => {
    switch (currentTabIndex) {
      case 0:
        return title.trim() && description.trim();
      case 1:
        return functionName.trim() && isValidName(functionName) &&
          parameters.every(p => p.name.trim() && isValidName(p.name) && p.type);
      case 2:
        return parameterConstraints.length > 0;
      case 3:
        return validateExamples();
      case 4:
        return testCases.filter(tc => {
          const validParams = parameters.filter(p => p.name.trim());
          const allInputsFilled = validParams.every(param => !isEmpty(tc.inputs[param.name]));
          return allInputsFilled && !isEmpty(tc.expectedOutput);
        }).length >= 5;
      default:
        return true;
    }
  };

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
      case 3:
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

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) newErrors.title = 'Problem name is required';
    if (!description.trim()) newErrors.description = 'Problem description is required';
    if (!functionName.trim()) newErrors.functionName = 'Function name is required';
    if (!isValidName(functionName)) newErrors.functionName = 'Function name can only contain letters, numbers, and underscore (no spaces)';

    if (selectedLanguageIds.length === 0) {
      newErrors.languages = 'At least one programming language must be selected';
    }

    parameters.forEach((param, index) => {
      if (!param.name.trim()) newErrors[`param_${index}_name`] = 'Parameter name is required';
      if (!isValidName(param.name)) newErrors[`param_${index}_name`] = 'Parameter name can only contain letters, numbers, and underscore (no spaces)';
      if (!param.type) newErrors[`param_${index}_type`] = 'Parameter type is required';
    });

    if (!validateExamples()) newErrors.examples = 'At least one complete example is required';

    const missingTemplates = selectedLanguageIds.filter(langId =>
      !templates[langId] ||
      !templates[langId].templateCode.trim() ||
      !templates[langId].templateCode.includes(templates[langId].placeholder)
    );

    if (missingTemplates.length > 0) {
      const missingLangNames = languages
        .filter(lang => missingTemplates.includes(lang.id))
        .map(lang => lang.name)
        .join(', ');
      newErrors.templates = `Templates missing or invalid for: ${missingLangNames}`;
    }

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
        supportedLanguages: selectedLanguageIds,
        returnType,
        templates: templates,
        parameters: parameters.filter(p => p.name.trim()),
        constraints: parameterConstraints,
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

      try {
        const res = await httpClient.post(`admin/problems/create-problem`, problemData);

        if (res.data.success) {
          toast.success("Problem created successfully!");
          navigate("/admin/problems");
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.message || "Failed to create problem");
        } else {
          console.log("Unexpected error:", error);
        }
      }
    }
  };

  const currentTab = TAB_SEQUENCE[currentTabIndex];

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-100">
        <AdminPanel />
      </div>
      <div className="flex-1 p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        <div className="bg-white w-full max-w-7xl mx-auto rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <h1 className="text-3xl font-bold text-white mb-2">Create New Problem</h1>
            <p className="text-blue-100">Step {currentTabIndex + 1} of {TAB_SEQUENCE.length}: {currentTab.title}</p>
          </div>

          <div className="p-6 bg-gray-50 border-b">
            <div className="flex items-center justify-between mb-4">
              {TAB_SEQUENCE.map((tab, index) => (
                <div key={tab.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${index <= currentTabIndex
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                    }`}>
                    <tab.icon className="w-5 h-5" />
                  </div>
                  {index < TAB_SEQUENCE.length - 1 && (
                    <div className={`h-1 w-20 ml-2 transition-colors ${index < currentTabIndex ? 'bg-blue-600' : 'bg-gray-300'
                      }`} />
                  )}
                </div>
              ))}
            </div>
            <h2 className="text-xl font-semibold text-gray-700">{currentTab.title}</h2>
          </div>

          <div className="p-8 min-h-96">
            {currentTabIndex === 0 && (
              <BasicInfoTab
                title={title}
                setTitle={setTitle}
                difficulty={difficulty}
                setDifficulty={setDifficulty}
                description={description}
                setDescription={setDescription}
                isActive={isActive}
                setIsActive={setIsActive}
                errors={errors}
                setErrors={setErrors}
              />
            )}

         
            {currentTabIndex === 1 && (
    <FunctionDefinitionTab
      functionName={functionName}
      setFunctionName={setFunctionName}
      returnType={returnType}
      setReturnType={setReturnType}
      parameters={parameters}
      setParameters={setParameters}
      languages={languages}
      selectedLanguageIds={selectedLanguageIds}
      setSelectedLanguageIds={setSelectedLanguageIds}
      templates={templates}
      setTemplates={setTemplates}
      isLoadingLanguages={isLoadingLanguages}
      errors={errors}
      setErrors={setErrors}
    />
  )}
            {currentTabIndex === 2 && (
              <ConstraintsTab
                parameterConstraints={parameterConstraints}
                setParameterConstraints={setParameterConstraints}
              />
            )}
            {currentTabIndex === 3 && (
              <ExamplesTab
                examples={examples}
                setExamples={setExamples}
                parameters={parameters}
                returnType={returnType}
                parameterConstraints={parameterConstraints}
                errors={errors}
              />
            )}
            {currentTabIndex === 4 && (
              <TestCasesTab
                testCases={testCases}
                setTestCases={setTestCases}
                parameters={parameters}
                returnType={returnType}
                parameterConstraints={parameterConstraints}
                errors={errors}
              />
            )}
            {currentTabIndex === 5 && (
              <MetadataTab
                tags={tags}
                setTags={setTags}
                hints={hints}
                setHints={setHints}
                companies={companies}
                setCompanies={setCompanies}
                errors={errors}
              />
            )}
          </div>

          <div className="p-6 bg-gray-50 border-t flex justify-between items-center">
            <button
              type="button"
              onClick={prevTab}
              disabled={currentTabIndex === 0}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${currentTabIndex === 0
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
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${canGoNext()
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
    </div>
  );
};

export default AddProblemPage;