import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
    title?: string;
    message: string;
    onRetry?: () => void;
    showRetry?: boolean;
    fullScreen?: boolean;
    className?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
    title = 'Error',
    message,
    onRetry,
    showRetry = true,
    fullScreen = true,
    className = '',
}) => {
    const handleRetry = () => {
        if (onRetry) {
            onRetry();
        } else {
            window.location.reload();
        }
    };

    const containerClass = fullScreen
        ? 'flex justify-center items-center min-h-screen bg-black'
        : 'flex justify-center items-center py-12';

    return (
        <div className={`${containerClass} ${className}`}>
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-red-500/30 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl shadow-red-500/10">
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl"></div>
                            <AlertCircle className="relative h-16 w-16 text-red-400 animate-pulse" />
                        </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white mb-3 bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent">
                        {title}
                    </h2>
                    
                    <p className="text-gray-300 mb-6 leading-relaxed">{message}</p>
                    
                    {showRetry && (
                        <button
                            onClick={handleRetry}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-lg shadow-green-900/50 hover:shadow-green-500/40 flex items-center justify-center gap-2 mx-auto"
                        >
                            <span>Retry</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ErrorDisplay;