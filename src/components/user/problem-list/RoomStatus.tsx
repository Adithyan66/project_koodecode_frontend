

import React from 'react';

const RoomStatus: React.FC = () => {
    return (
        <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-500">Random</span>
                <span className="text-xs text-gray-400 ml-auto">Rules</span>
            </div>
        </div>
    );
};

export default RoomStatus;