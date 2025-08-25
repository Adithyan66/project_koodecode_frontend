import React, { useState } from 'react';
import { Plus, Minus, Check, X } from 'lucide-react';

interface Example {
  id: string;
  input: string;
  output: string;
  explanation: string;
}

interface TestCase {
  id: string;
  input: string;
  output: string;
  showInExample: boolean;
}

const AddProblem = () => {
  const [problemName, setProblemName] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [problemDescription, setProblemDescription] = useState('');
  
  const [examples, setExamples] = useState<Example[]>([
    { id: '1', input: '', output: '', explanation: '' }
  ]);
  
  const [constraints, setConstraints] = useState(['']);
  
  const [testCases, setTestCases] = useState<TestCase[]>([
    { id: '1', input: '', output: '', showInExample: false },
    { id: '2', input: '', output: '', showInExample: false },
    { id: '3', input: '', output: '', showInExample: false },
    { id: '4', input: '', output: '', showInExample: false },
    { id: '5', input: '', output: '', showInExample: false }
  ]);

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Generate random problem ID
  const generateProblemId = () => {
    return 'PROB_' + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  // Example management
  const addExample = () => {
    if (examples.length < 3) {
      const newId = (examples.length + 1).toString();
      setExamples([...examples, { id: newId, input: '', output: '', explanation: '' }]);
    }
  };

  const removeExample = (id: string) => {
    if (examples.length > 1) {
      setExamples(examples.filter(example => example.id !== id));
    }
  };

  const updateExample = (id: string, field: keyof Example, value: string) => {
    setExamples(examples.map(example => 
      example.id === id ? { ...example, [field]: value } : example
    ));
  };

  // Constraint management
  const addConstraint = () => {
    setConstraints([...constraints, '']);
  };

  const removeConstraint = (index: number) => {
    if (constraints.length > 1) {
      setConstraints(constraints.filter((_, i) => i !== index));
    }
  };

  const updateConstraint = (index: number, value: string) => {
    setConstraints(constraints.map((constraint, i) => 
      i === index ? value : constraint
    ));
  };

  // Test case management
  const addTestCase = () => {
    const newId = (testCases.length + 1).toString();
    setTestCases([...testCases, { id: newId, input: '', output: '', showInExample: false }]);
  };

  const removeTestCase = (id: string) => {
    if (testCases.length > 5) {
      setTestCases(testCases.filter(testCase => testCase.id !== id));
    }
  };

  const updateTestCase = (id: string, field: keyof TestCase, value: string | boolean) => {
    setTestCases(testCases.map(testCase => 
      testCase.id === id ? { ...testCase, [field]: value } : testCase
    ));
  };

  // Validation
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!problemName.trim()) {
      newErrors.problemName = 'Problem name is required';
    }

    if (!problemDescription.trim()) {
      newErrors.problemDescription = 'Problem description is required';
    }

    // Validate examples
    examples.forEach((example, index) => {
      if (!example.input.trim()) {
        newErrors[`example_${index}_input`] = 'Input is required';
      }
      if (!example.output.trim()) {
        newErrors[`example_${index}_output`] = 'Output is required';
      }
      if (!example.explanation.trim()) {
        newErrors[`example_${index}_explanation`] = 'Explanation is required';
      }
    });

    // Validate constraints
    const nonEmptyConstraints = constraints.filter(c => c.trim());
    if (nonEmptyConstraints.length === 0) {
      newErrors.constraints = 'At least one constraint is required';
    }

    // Validate test cases
    const nonEmptyTestCases = testCases.filter(tc => tc.input.trim() && tc.output.trim());
    if (nonEmptyTestCases.length < 5) {
      newErrors.testCases = 'At least 5 complete test cases are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const problemData = {
        problemId: generateProblemId(),
        problemName: problemName.trim(),
        difficulty,
        problemDescription: problemDescription.trim(),
        examples: examples.filter(ex => ex.input.trim() && ex.output.trim()),
        constraints: constraints.filter(c => c.trim()),
        testCases: testCases.filter(tc => tc.input.trim() && tc.output.trim())
      };
      
      console.log('Problem created:', problemData);
      alert('Problem created successfully! (Check console for details)');
    }
  };

  return (
    <div className=" mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Add New Problem</h1>
      
      <div className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Basic Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Problem Name *
            </label>
            <input
              type="text"
              value={problemName}
              onChange={(e) => setProblemName(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.problemName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter problem name"
            />
            {errors.problemName && (
              <p className="text-red-500 text-sm mt-1">{errors.problemName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level *
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Problem Description *
            </label>
            <textarea
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              rows={6}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.problemDescription ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe the problem in detail..."
            />
            {errors.problemDescription && (
              <p className="text-red-500 text-sm mt-1">{errors.problemDescription}</p>
            )}
          </div>
        </div>

        {/* Examples */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Examples (1-3 required)</h2>
            {examples.length < 3 && (
              <button
                type="button"
                onClick={addExample}
                className="flex items-center px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Example
              </button>
            )}
          </div>

          {examples.map((example, index) => (
            <div key={example.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-700">Example {index + 1}</h3>
                {examples.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExample(example.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Input *</label>
                  <textarea
                    value={example.input}
                    onChange={(e) => updateExample(example.id, 'input', e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors[`example_${index}_input`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Input for this example"
                  />
                  {errors[`example_${index}_input`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`example_${index}_input`]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Output *</label>
                  <textarea
                    value={example.output}
                    onChange={(e) => updateExample(example.id, 'output', e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors[`example_${index}_output`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Expected output"
                  />
                  {errors[`example_${index}_output`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`example_${index}_output`]}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Explanation *</label>
                <textarea
                  value={example.explanation}
                  onChange={(e) => updateExample(example.id, 'explanation', e.target.value)}
                  rows={2}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors[`example_${index}_explanation`] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Explain how the output is derived from the input"
                />
                {errors[`example_${index}_explanation`] && (
                  <p className="text-red-500 text-xs mt-1">{errors[`example_${index}_explanation`]}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Constraints */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Constraints</h2>
            <button
              type="button"
              onClick={addConstraint}
              className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Constraint
            </button>
          </div>

          {errors.constraints && (
            <p className="text-red-500 text-sm">{errors.constraints}</p>
          )}

          {constraints.map((constraint, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={constraint}
                onChange={(e) => updateConstraint(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter constraint (e.g., 1 ≤ n ≤ 10^5)"
              />
              {constraints.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeConstraint(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Minus className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Test Cases */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
              Test Cases (minimum 5 required)
            </h2>
            <button
              type="button"
              onClick={addTestCase}
              className="flex items-center px-3 py-1 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Test Case
            </button>
          </div>

          {errors.testCases && (
            <p className="text-red-500 text-sm">{errors.testCases}</p>
          )}

          <div className="grid gap-4">
            {testCases.map((testCase, index) => (
              <div key={testCase.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-700">Test Case {index + 1}</h3>
                  <div className="flex items-center space-x-2">
                    <label className="flex items-center space-x-2 text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={testCase.showInExample}
                        onChange={(e) => updateTestCase(testCase.id, 'showInExample', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span>Show in Example (run without submit)</span>
                    </label>
                    {testCases.length > 5 && (
                      <button
                        type="button"
                        onClick={() => removeTestCase(testCase.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Input</label>
                    <textarea
                      value={testCase.input}
                      onChange={(e) => updateTestCase(testCase.id, 'input', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Test case input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Expected Output</label>
                    <textarea
                      value={testCase.output}
                      onChange={(e) => updateTestCase(testCase.id, 'output', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Expected output"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t">
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <Check className="w-5 h-5 mr-2" />
            Create Problem
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProblem;