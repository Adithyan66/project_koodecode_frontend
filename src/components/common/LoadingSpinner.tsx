

import React from 'react';
import SpinnerLogo from '../../assets/images/SpinnerLogo.png'

export const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <p className="text-white mt-4 text-lg">Loading problem data...</p>
        </div>
    </div>
);



export default function RotatingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-80">
      <div className="text-center">
        <div className="relative inline-block">
          {/* Rotating spinner */}
          <img
            src={SpinnerLogo}
            alt="Loading spinner"
            className="w-12 h-12 animate-spin"
            style={{ animationDuration: '2s' }}
          />
        </div>
        <p className="mt-3 text-gray-300 text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
}