
import React from 'react';
import { Building2, Lightbulb, ChevronDown, ChevronRight } from 'lucide-react';
import type { ProblemData } from '../../../types/problem';

interface DescriptionSectionProps {
    problemData: ProblemData;
    formattedConstraints: string[];
    showHints: boolean;
    setShowHints: (show: boolean) => void;
}

const DescriptionSection: React.FC<DescriptionSectionProps> = ({ problemData, formattedConstraints, showHints, setShowHints }) => (
    <div className="space-y-6 text-gray-300 leading-relaxed">
        <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: problemData.description }} />

        {problemData.tags && problemData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
                {problemData.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1.5 bg-gradient-to-r from-gray-800 to-gray-700 text-gray-300 text-xs font-medium rounded-full border border-gray-600 hover:border-gray-500 transition-colors">
                        {tag}
                    </span>
                ))}
            </div>
        )}

        {problemData.examples && problemData.examples.map((example, index) => (
            <div key={index} className="mt-8">
                <div className="flex items-center space-x-2 mb-3">
                    <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                    <h3 className="text-base font-semibold text-white">Example {index + 1}</h3>
                </div>
                <div className="bg-gradient-to-b from-white/5 via-white/2 to-transparent rounded-xl border border-gray-700/50 overflow-hidden shadow-lg">
                    <div className="p-5 space-y-4">
                        <div className="space-y-2">
                            <div className="text-xs uppercase tracking-wider text-blue-400 font-semibold">Input</div>
                            <div className="bg-gray-950/50 rounded-lg p-3 border border-gray-700/30">
                                {(() => {
                                    try {
                                        const parsedInput = JSON.parse(example.input);
                                        return (
                                            <div className="space-y-1">
                                                {Object.entries(parsedInput).map(([key, value]) => (
                                                    <div key={key} className="text-emerald-400 font-mono text-sm">
                                                        <span className="text-gray-400">{key}</span> = {JSON.stringify(value)}
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    } catch (e) {
                                        return <div className="text-emerald-400 font-mono text-sm">{example.input}</div>;
                                    }
                                })()}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-xs uppercase tracking-wider text-purple-400 font-semibold">Output</div>
                            <div className="bg-gray-950/50 rounded-lg p-3 border border-gray-700/30">
                                <span className="font-mono text-sm text-purple-400">{JSON.stringify(example.output)}</span>
                            </div>
                        </div>
                        {example.explanation && (
                            <div className="space-y-2 pt-2 border-t border-gray-700/50">
                                <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Explanation</div>
                                <p className="text-gray-300 text-sm leading-relaxed">{example.explanation}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        ))}

        {formattedConstraints.length > 0 && (
            <div className="mt-8">
                <div className="flex items-center space-x-2 mb-3">
                    <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-red-500 rounded-full" />
                    <h3 className="text-base font-semibold text-white">Constraints</h3>
                </div>
                <div className="bg-gradient-to-b from-white/5 via-white/2 to-transparent rounded-xl border border-gray-700/50 p-5 shadow-lg">
                    <ul className="space-y-2.5">
                        {formattedConstraints.map((constraint, index) => (
                            <li key={index} className="flex items-start space-x-2">
                                <span className="text-orange-400 mt-1">•</span>
                                <span className="font-mono text-sm text-gray-300">{constraint}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )}

        {problemData.hints && problemData.hints.length > 0 && (
            <div className="mt-8">
                <button
                    onClick={() => setShowHints(!showHints)}
                    className="w-full group"
                >
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-900/20 to-amber-900/20 hover:from-yellow-900/30 hover:to-amber-900/30 border border-yellow-600/30 hover:border-yellow-500/50 rounded-xl transition-all">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors">
                                <Lightbulb size={20} className="text-yellow-400" />
                            </div>
                            <div className="text-left">
                                <div className="text-sm font-semibold text-white">Hints Available</div>
                                <div className="text-xs text-yellow-300">{problemData.hints.length} hint{problemData.hints.length > 1 ? 's' : ''} to help you solve this problem</div>
                            </div>
                        </div>
                        {showHints ? <ChevronDown size={20} className="text-gray-400" /> : <ChevronRight size={20} className="text-gray-400" />}
                    </div>
                </button>
                {showHints && (
                    <div className="mt-3 space-y-3">
                        {problemData.hints.map((hint, index) => (
                            <div key={index} className="bg-gradient-to-br from-yellow-900/10 to-amber-900/10 border border-yellow-600/20 rounded-lg p-4 shadow-lg">
                                <div className="flex items-start space-x-3">
                                    <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-yellow-400 text-xs font-bold">{index + 1}</span>
                                    </div>
                                    <p className="text-yellow-100 text-sm leading-relaxed">{hint}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}

        {problemData.companies && problemData.companies.length > 0 && (
            <div className="mt-8 pb-4">
                <div className="flex items-center space-x-2 mb-3">
                    <Building2 size={16} className="text-gray-400" />
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Asked by Companies</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {problemData.companies.map((company, index) => (
                        <span key={index} className="px-3 py-1.5 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 text-blue-300 text-xs font-medium rounded-lg border border-blue-600/30 hover:border-blue-500/50 transition-colors">
                            {company}
                        </span>
                    ))}
                </div>
            </div>
        )}
    </div>
);

export default DescriptionSection;