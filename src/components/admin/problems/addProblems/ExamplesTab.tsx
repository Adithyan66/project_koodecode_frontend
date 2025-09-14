import { Plus, X } from "lucide-react";
import type { Example, Parameter, ParameterConstraint, ParameterValue } from "../../../../pages/admin/AddProblemPage";





const ExamplesTab: React.FC<{
  examples: Example[];
  setExamples: React.Dispatch<React.SetStateAction<Example[]>>;
  parameters: Parameter[];
  returnType: string;
  parameterConstraints: ParameterConstraint[];
  errors: { [key: string]: string };
}> = ({ examples, setExamples, parameters, returnType, parameterConstraints, errors }) => {
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

  return (
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
  );
};


export default ExamplesTab