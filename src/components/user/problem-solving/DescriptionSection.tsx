
import React from 'react';
import type { ProblemData } from '../../../types/problem';

interface DescriptionSectionProps {
    problemData: ProblemData;
    formattedConstraints: string[];
    showHints: boolean;
    setShowHints: (show: boolean) => void;
}

const DescriptionSection: React.FC<DescriptionSectionProps> = ({ problemData, formattedConstraints, showHints, setShowHints }) => (
    <div className="space-y-4 text-gray-300 leading-relaxed">
        <div dangerouslySetInnerHTML={{ __html: problemData.description }} />

        {problemData.tags && problemData.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
                {problemData.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                        {tag}
                    </span>
                ))}
            </div>
        )}

        {problemData.examples && problemData.examples.map((example, index) => (
            <div key={index} className="mt-8">
                <h3 className="text-lg font-semibold mb-4 text-white">Example {index + 1}:</h3>
                <div className="p-4 rounded-lg border-l-4 border-gray-500 bg-gray-950 space-y-2">
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

        {formattedConstraints.length > 0 && (
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 text-white">Constraints:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-400">
                    {formattedConstraints.map((constraint, index) => (
                        <li key={index} className="font-mono text-sm">{constraint}</li>
                    ))}
                </ul>
            </div>
        )}

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
                            <div key={index} className="p-3 bg-gray-900 bg-opacity-20 border-l-4 border-yellow-500 rounded">
                                <p className="text-yellow-200 text-sm">{hint}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}

        {problemData.companies && problemData.companies.length > 0 && (
            <div className="mt-6">
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
    </div>
);

export default DescriptionSection;