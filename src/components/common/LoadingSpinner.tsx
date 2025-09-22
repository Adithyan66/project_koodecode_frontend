

import React from 'react';

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <p className="text-white mt-4 text-lg">Loading problem data...</p>
        </div>
    </div>
);

export default LoadingSpinner;