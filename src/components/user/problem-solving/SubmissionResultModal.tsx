
import React from 'react';
import { X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import type { ContestSubmissionData } from '../../../types/contest-problems';
import SubmissionDetailedView from './SubmissionDetailedView';

interface SubmissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    submissionData: ContestSubmissionData;
}

const SubmissionResultModal: React.FC<SubmissionModalProps> = ({ isOpen, onClose, submissionData }) => {
    if (!isOpen) return null;

    const navigate = useNavigate();
    const { contestNumber } = useParams();
    const { result, isCorrect, attemptNumber, penaltyApplied, totalScore, message, canContinue, rank, timeTaken } = submissionData as any;
    const isAccepted = isCorrect === true || result?.overallVerdict === 'Accepted';
    // const remainingAttempts = useMemo(() => {
    //     const match = String(message || '').match(/(\d+)\s+attempt\(s\)\s+remaining/);
    //     return match ? match[1] : '0';
    // }, [message]);

    const handleClose = () => {
        onClose?.();
        // Navigate only when cannot continue
        if (!canContinue) {
            if (contestNumber) {
                navigate(`/contest/${contestNumber}`, { replace: true });
            } else {
                navigate('/', { replace: true });
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-3">
            {/* Success confetti overlay */}
            {isAccepted && (
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    {Array.from({ length: 140 }).map((_, i) => (
                        <span
                            key={i}
                            className={`absolute ${i % 3 === 0 ? 'text-2xl' : 'w-1.5 h-3 bg-yellow-400'} opacity-90 animate-[fall_1800ms_linear_infinite]`}
                            style={{
                                left: `${(i * 7) % 100}%`,
                                top: `-${Math.random() * 120}px`,
                                transform: `rotate(${Math.random() * 360}deg)`
                            }}
                        >
                            {i % 3 === 0 ? (i % 2 === 0 ? '🎉' : '🏆') : ''}
                        </span>
                    ))}
                    <style>
                        {`@keyframes fall { 0% { transform: translateY(-10vh) rotate(0deg); } 100% { transform: translateY(110vh) rotate(360deg); } }`}
                    </style>
                </div>
            )}
            <div className="bg-gray-900/90 backdrop-blur rounded-xl border border-gray-700 w-full max-w-4xl max-h-[88vh] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-800/40">
                    <h2 className="text-white font-semibold">Submission Details</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors p-2">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-4 overflow-y-auto no-scrollbar" style={{ maxHeight: '75vh' }}>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-3 text-xs">
                        <div className="bg-gray-800/60 rounded-lg p-3 text-center">
                            <div className="text-gray-400">Verdict</div>
                            <div className={`font-bold ${isAccepted ? 'text-green-400' : 'text-red-400'}`}>{result.overallVerdict}</div>
                        </div>
                        <div className="bg-gray-800/60 rounded-lg p-3 text-center">
                            <div className="text-gray-400">Rank</div>
                            <div className="font-bold text-yellow-400">{rank ?? '-'}</div>
                        </div>
                        <div className="bg-gray-800/60 rounded-lg p-3 text-center">
                            <div className="text-gray-400">Attempts</div>
                            <div className="font-bold text-white">{attemptNumber}</div>
                        </div>
                        <div className="bg-gray-800/60 rounded-lg p-3 text-center">
                            <div className="text-gray-400">Penalty</div>
                            <div className="font-bold text-red-400">{penaltyApplied}</div>
                        </div>
                        <div className="bg-gray-800/60 rounded-lg p-3 text-center">
                            <div className="text-gray-400">Total Score</div>
                            <div className={`font-bold ${totalScore >= 0 ? 'text-green-400' : 'text-red-400'}`}>{totalScore}</div>
                        </div>
                        <div className="bg-gray-800/60 rounded-lg p-3 text-center">
                            <div className="text-gray-400">Time Taken</div>
                            <div className="font-bold text-white">{typeof timeTaken === 'number' ? timeTaken.toFixed(3) : timeTaken}s</div>
                        </div>
                    </div>

                    <SubmissionDetailedView submission={result} onBack={handleClose} />

                    <div className={`mt-3 p-3 rounded-lg border ${isAccepted ? 'border-green-600 bg-green-900/20 text-green-300' : 'border-red-600 bg-red-900/20 text-red-300'}`}>
                        {message}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmissionResultModal;