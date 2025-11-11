import React from 'react';
import { CheckCircle, X, Clock, AlertCircle, ChevronRight } from 'lucide-react';
import type { SubmissionResponse } from '../../../types/problem';

interface SubmissionsListProps {
    submissions: SubmissionResponse[];
    onSelectSubmission: (submission: SubmissionResponse) => void;
}

const SubmissionsList: React.FC<SubmissionsListProps> = ({ submissions, onSelectSubmission }) => {
    const getVerdictIcon = (verdict: string) => {
        switch (verdict) {
            case 'Accepted':
                return <CheckCircle size={20} className="text-green-400" />;
            case 'Wrong Answer':
                return <X size={20} className="text-red-400" />;
            case 'Time Limit Exceeded':
                return <Clock size={20} className="text-yellow-400" />;
            case 'Runtime Error':
                return <AlertCircle size={20} className="text-orange-400" />;
            default:
                return <X size={20} className="text-gray-400" />;
        }
    };

    const getVerdictColor = (verdict: string) => {
        switch (verdict) {
            case 'Accepted':
                return 'text-green-400 bg-green-500/10 border-green-500/30';
            case 'Wrong Answer':
                return 'text-red-400 bg-red-500/10 border-red-500/30';
            case 'Time Limit Exceeded':
                return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
            case 'Runtime Error':
                return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
            default:
                return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    if (submissions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
                    <AlertCircle size={28} className="text-gray-600" />
                </div>
                <div className="text-center">
                    <p className="text-gray-400 font-medium">No submissions yet</p>
                    <p className="text-gray-600 text-sm mt-2 max-w-md">
                        Submit your solution to see your submission history here.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {submissions.map((submission) => (
                <button
                    key={submission.id}
                    onClick={() => onSelectSubmission(submission)}
                    className="w-full group"
                >
                    <div className="bg-gradient-to-b from-white/5 via-white/2 to-transparent hover:from-white-5 hover:to-gray-900 border border-gray-700/50 hover:border-gray-600 rounded-xl p-4 transition-all duration-200 shadow-lg hover:shadow-xl">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1">
                                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform">
                                    {getVerdictIcon(submission.overallVerdict)}
                                </div>      
                                
                                <div className="flex-1 text-left space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getVerdictColor(submission.overallVerdict)}`}>
                                            {submission.overallVerdict}
                                        </span>
                                        <span className="text-xs text-gray-500">{formatDate(submission.submittedAt)}</span>
                                    </div>
                                    
                                    <div className="grid grid-cols-5 gap-3 text-xs">
                                         <div className="flex items-center space-x-2 text-xs text-gray-400">
                                        <span>Test Cases: {submission.testCasesPassed}/{submission.totalTestCases}</span>
                                    </div>
                                        <div>
                                            <div className="text-gray-500">Language</div>
                                            <div className="text-white font-medium">{submission.language.name}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500">Runtime</div>
                                            <div className="text-white font-medium">{submission.totalExecutionTime}s</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500">Memory</div>
                                            <div className="text-white font-medium">
                                                {submission.testCaseResults && submission.testCaseResults.length > 0
                                                    ? `${Math.max(...submission.testCaseResults.map(r => r.memoryUsage))}KB`
                                                    : submission.maxMemoryUsage ? `${submission.maxMemoryUsage}KB` : 'N/A'}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500">Score</div>
                                            <div className={`font-bold ${submission.score === 100 ? 'text-green-400' : 'text-yellow-400'}`}>
                                                {submission.score}%
                                            </div>
                                        </div>
                                    </div>

                                   
                                </div>
                            </div>

                            <ChevronRight size={20} className="text-gray-600 group-hover:text-gray-400 group-hover:translate-x-1 transition-all flex-shrink-0 mt-2" />
                        </div>
                    </div>
                </button>
            ))}
        </div>
    );
};

export default SubmissionsList;

