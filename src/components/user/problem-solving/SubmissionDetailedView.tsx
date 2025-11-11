import React from 'react';
import { X, AlertCircle, Trophy, Clock, Code2, ChevronLeft } from 'lucide-react';
import type { SubmissionResponse } from '../../../types/problem';
import RuntimeGraph from './RuntimeGraph';

interface SubmissionDetailedViewProps {
    submission: SubmissionResponse;
    onBack: () => void;
}

const SubmissionDetailedView: React.FC<SubmissionDetailedViewProps> = ({ submission, onBack }) => {
    const firstFailedTestCase = submission.testCaseResults && submission.testCaseResults.length > 0 
        ? submission.testCaseResults[0] 
        : null;
    const isAccepted = submission.overallVerdict === 'Accepted';

    const getVerdictIcon = (verdict: string) => {
        switch (verdict) {
            case 'Accepted':
                return <Trophy size={28} className="text-green-400" />;
            case 'Wrong Answer':
                return <X size={28} className="text-red-400" />;
            case 'Time Limit Exceeded':
                return <Clock size={28} className="text-yellow-400" />;
            case 'Runtime Error':
                return <AlertCircle size={28} className="text-orange-400" />;
            default:
                return <X size={28} className="text-gray-400" />;
        }
    };

    const getVerdictColor = (verdict: string) => {
        switch (verdict) {
            case 'Accepted':
                return {
                    bg: 'from-green-950/50 to-green-900/30',
                    border: 'border-green-500/50',
                    text: 'text-green-400',
                    iconBg: 'bg-green-500/20'
                };
            case 'Wrong Answer':
                return {
                    bg: 'from-red-950/50 to-red-900/30',
                    border: 'border-red-500/50',
                    text: 'text-red-400',
                    iconBg: 'bg-red-500/20'
                };
            case 'Time Limit Exceeded':
                return {
                    bg: 'from-yellow-950/50 to-yellow-900/30',
                    border: 'border-yellow-500/50',
                    text: 'text-yellow-400',
                    iconBg: 'bg-yellow-500/20'
                };
            case 'Runtime Error':
                return {
                    bg: 'from-orange-950/50 to-orange-900/30',
                    border: 'border-orange-500/50',
                    text: 'text-orange-400',
                    iconBg: 'bg-orange-500/20'
                };
            default:
                return {
                    bg: 'from-gray-950/50 to-gray-900/30',
                    border: 'border-gray-500/50',
                    text: 'text-gray-400',
                    iconBg: 'bg-gray-500/20'
                };
        }
    };

    const colors = getVerdictColor(submission.overallVerdict);
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-4">
            <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors group"
            >
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm">Back to submissions</span>
            </button>

            <div className={`bg-gradient-to-br ${colors.bg} border ${colors.border} p-6 rounded-xl shadow-2xl`}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                        <div className={`w-14 h-14 rounded-full ${colors.iconBg} flex items-center justify-center`}>
                            {getVerdictIcon(submission.overallVerdict)}
                        </div>
                        <div>
                            <h3 className={`text-2xl font-bold ${colors.text}`}>{submission.overallVerdict}</h3>
                            <p className="text-gray-400 text-sm">{formatDate(submission.submittedAt)}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-4 text-sm bg-black/20 rounded-lg p-4">
                    <div>
                        <span className="text-gray-400 block mb-1">Language</span>
                        <div className="text-white font-bold">{submission.language.name}</div>
                    </div>
                    <div>
                        <span className="text-gray-400 block mb-1">Test Cases</span>
                        <div className="text-white font-bold">{submission.testCasesPassed}/{submission.totalTestCases}</div>
                    </div>
                    <div>
                        <span className="text-gray-400 block mb-1">Runtime</span>
                        <div className="text-white font-bold">{submission.totalExecutionTime}s</div>
                    </div>
                    <div>
                        <span className="text-gray-400 block mb-1">Score</span>
                        <div className={`font-bold text-lg ${submission.score === 100 ? 'text-green-400' : 'text-yellow-400'}`}>
                            {submission.score}%
                        </div>
                    </div>
                </div>
            </div>

            {submission.overallVerdict === 'Accepted' && submission.runtimeDistribution && submission.memoryDistribution && (
                <div className="grid grid-cols-2 gap-4">
                    <RuntimeGraph
                        data={submission.runtimeDistribution.data}
                        userRuntime={submission.runtimeDistribution.userRuntime}
                        beats={submission.runtimeDistribution.beats}
                        label="Runtime"
                        unit="s"
                        color="green"
                    />
                    <RuntimeGraph
                        data={submission.memoryDistribution.data.map(({ memory, percentage }) => ({
                            runtime: memory,
                            percentage
                        }))}
                        userRuntime={submission.memoryDistribution.userMemory}
                        beats={submission.memoryDistribution.beats}
                        label="Memory"
                        unit="KB"
                        color="yellow"
                    />
                </div>
            )}

            <div className="bg-gradient-to-b from-white/5 via-white/2 to-transparent rounded-xl border border-gray-700/50 overflow-hidden">
                <div className="border-b border-gray-700/50 bg-gray-800/30 px-6 py-3">
                    <div className="flex items-center space-x-2">
                        <Code2 size={16} className="text-blue-400" />
                        <span className="text-sm font-medium text-white">Code</span>
                    </div>
                </div>

                <div className="p-5">
                    {submission.code ? (
                        <div className="bg-gray-950 rounded-lg p-4 border border-gray-800 overflow-x-auto">
                            <pre className="text-sm text-gray-300 font-mono leading-relaxed">
                                <code>{submission.code}</code>
                            </pre>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center py-12">
                            <span className="text-gray-500">Code not available</span>
                        </div>
                    )}
                </div>
            </div>

            {!isAccepted && firstFailedTestCase ? (
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-red-500/30 overflow-hidden">
                    <div className="border-b border-gray-700/50 bg-red-950/20 px-6 py-3">
                        <div className="flex items-center space-x-2">
                            <X size={16} className="text-red-400" />
                            <span className="text-sm font-medium text-red-400">First Failed Test Case</span>
                        </div>
                    </div>

                    <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between text-xs text-gray-400 px-1">
                            <span className="font-medium">Failed Test Case</span>
                            <div className="flex space-x-3">
                                <span>{firstFailedTestCase.executionTime}s</span>
                                <span>{firstFailedTestCase.memoryUsage}KB</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1.5 font-semibold">
                                Input
                            </label>
                            <div className="bg-gray-950 p-3 rounded-lg border border-gray-700/50">
                                <pre className="text-emerald-400 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words">
                                    {firstFailedTestCase.input}
                                </pre>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1.5 font-semibold">
                                Expected Output
                            </label>
                            <div className="bg-gray-950 p-3 rounded-lg border border-blue-500/30">
                                <pre className="text-blue-400 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words">
                                    {firstFailedTestCase.expectedOutput}
                                </pre>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1.5 font-semibold">
                                Your Output
                            </label>
                            <div className="bg-gray-950 p-3 rounded-lg border border-red-500/30">
                                <pre className="text-red-400 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words">
                                    {firstFailedTestCase.actualOutput || 'No output'}
                                </pre>
                            </div>
                        </div>

                        {firstFailedTestCase.errorMessage && (
                            <div>
                                <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1.5 font-semibold">
                                    Error Message
                                </label>
                                <div className="bg-gray-950 p-3 rounded-lg border border-red-500/30">
                                    <pre className="text-red-300 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words">
                                        {firstFailedTestCase.errorMessage}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default SubmissionDetailedView;

