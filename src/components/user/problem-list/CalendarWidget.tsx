

import React from 'react';
import { Settings } from 'lucide-react';

const CalendarWidget: React.FC = () => {
    const calendar = [
        [null, null, null, null, null, 1, 2],
        [3, 4, 5, 6, 7, 8, 9],
        [10, 11, 12, 13, 14, 15, 16],
        [17, 18, 19, 20, 21, 22, 23],
        [24, 25, 26, 27, 28, 29, 30],
        [31, null, null, null, null, null, null],
    ];

    return (
        <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-400">Day 2</span>
                <button>
                    <Settings size={16} className="text-gray-400" />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-xs text-center mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                    <div key={day} className="text-gray-500 p-1">{day}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-xs">
                {calendar.map((week, weekIndex) =>
                    week.map((day, dayIndex) => (
                        <div key={`${weekIndex}-${dayIndex}`} className="p-1 h-8 flex items-center justify-center">
                            {day && (
                                <div className={`w-6 h-6 rounded flex items-center justify-center ${
                                    day === 5 ? 'bg-green-500 text-white' :
                                    day === 6 ? 'bg-green-600 text-white' :
                                    'text-gray-400 hover:bg-gray-700'
                                }`}>
                                    {day}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CalendarWidget;