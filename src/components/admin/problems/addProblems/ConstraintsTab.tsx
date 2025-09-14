import { AlertCircle } from "lucide-react";
import type { ParameterConstraint } from "../../../../pages/admin/AddProblemPage";






const ConstraintsTab: React.FC<{
  parameterConstraints: ParameterConstraint[];
  setParameterConstraints: React.Dispatch<React.SetStateAction<ParameterConstraint[]>>;
}> = ({ parameterConstraints, setParameterConstraints }) => {
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

  return (
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
  );
};

















export default ConstraintsTab