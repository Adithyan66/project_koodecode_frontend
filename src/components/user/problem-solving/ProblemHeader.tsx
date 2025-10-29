import React from 'react';
import { ThumbsUp, Users, CheckCircle, BadgeCheck } from 'lucide-react';
import type { ProblemData } from '../../../types/problem';

interface ProblemHeaderProps {
    problemData: ProblemData;
    acceptanceRate: string;
    // isSolved?: boolean;
}

const ProblemHeader: React.FC<ProblemHeaderProps> = ({ problemData, acceptanceRate }) => (
    <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
            <span className={`px-2 py-1 text-white text-xs rounded font-medium ${problemData.difficulty.toLowerCase() === 'easy' ? 'bg-green-600' :
                problemData.difficulty.toLowerCase() === 'medium' ? 'bg-yellow-600' :
                    'bg-red-600'
                }`}>
                {problemData.difficulty}
            </span>
            {/* <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded font-medium">AI Assist</span> */}
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-400">
            {/* <div className="flex items-center space-x-1"> */}
                {/* <ThumbsUp size={14} /> */}
                {/* <span>{problemData.likes?.length || 0}</span> */}
            {/* </div> */}
            <div className="flex items-center space-x-1">
                <Users size={14} />
                <span>{problemData.totalSubmissions}</span>
            </div>
            <div className="flex items-center space-x-1">
                <CheckCircle size={14} />
                <span>{acceptanceRate}</span>
            </div>
            {problemData.isSolved && (
                <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-full">
                    <BadgeCheck size={16} className="text-green-400 " />
                    <span className="text-green-400 font-semibold text-xs">Solved</span>
                </div>
            )}
        </div>
    </div>
);

export default ProblemHeader;