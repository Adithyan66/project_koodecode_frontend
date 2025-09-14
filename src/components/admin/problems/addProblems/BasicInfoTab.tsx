





const BasicInfoTab: React.FC<{
    title: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    difficulty: string;
    setDifficulty: React.Dispatch<React.SetStateAction<string>>;
    description: string;
    setDescription: React.Dispatch<React.SetStateAction<string>>;
    isActive: boolean;
    setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
    errors: { [key: string]: string };
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}> = ({ title, setTitle, difficulty, setDifficulty, description, setDescription, isActive, setIsActive, errors, setErrors }) => {
    return (
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
                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.title ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
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
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${errors.description ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
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
    );
};


export default BasicInfoTab