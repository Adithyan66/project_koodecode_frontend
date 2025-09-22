import React from 'react';
import { ThumbsUp, Users, CheckCircle } from 'lucide-react';
import type { ProblemData } from '../../../types/problem';

interface ProblemHeaderProps {
    problemData: ProblemData;
    acceptanceRate: string;
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
            <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded font-medium">AI Assist</span>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
                <ThumbsUp size={14} />
                <span>{problemData.likes?.length || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
                <Users size={14} />
                <span>{problemData.totalSubmissions}</span>
            </div>
            <div className="flex items-center space-x-1">
                <CheckCircle size={14} />
                <span>{acceptanceRate}</span>
            </div>
        </div>
    </div>
);

export default ProblemHeader;