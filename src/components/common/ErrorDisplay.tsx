import React from 'react';

interface ErrorDisplayProps {
    message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => (
    <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-white text-2xl mb-2">Error Loading Problem</h2>
            <p className="text-gray-400 mb-4">{message}</p>
            <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
            >
                Retry
            </button>
        </div>
    </div>
);

export default ErrorDisplay;