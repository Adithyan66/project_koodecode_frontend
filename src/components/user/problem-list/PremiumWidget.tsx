

import React from 'react';
import { Crown } from 'lucide-react';

const PremiumWidget: React.FC = () => {
    return (
        <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <Crown size={16} className="text-yellow-500" />
                    <span className="text-sm text-yellow-500">Weekly Premium</span>
                </div>
                <span className="text-xs text-gray-400">5 days left</span>
            </div>

            <div className="grid grid-cols-5 gap-1">
                {['Mo', 'Tu', 'We', 'Th', 'Fr'].map((day, index) => (
                    <div key={day} className="text-center">
                        <div className="text-xs text-gray-400 mb-1">{day}</div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            index === 0 ? 'bg-yellow-500' : 'bg-gray-700'
                        }`}>
                            <Crown 
                                size={12} 
                                className={index === 0 ? 'text-black' : 'text-gray-500'} 
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PremiumWidget;