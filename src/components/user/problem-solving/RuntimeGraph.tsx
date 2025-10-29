import React from 'react';

interface RuntimeGraphProps {
    data: { runtime: number; percentage: number }[];
    userRuntime: number;
    beats: number;
    label: string;
    unit: string;
    color: 'green' | 'yellow';
}

const RuntimeGraph: React.FC<RuntimeGraphProps> = ({ data, userRuntime, beats, label, unit, color }) => {
    const maxPercentage = Math.max(...data.map(d => d.percentage));
    const threshold = unit === 's' ? 0.01 : 20;
    const userIndex = data.findIndex(d => Math.abs(d.runtime - userRuntime) < threshold);
    
    const colorClasses = {
        green: {
            bar: 'bg-green-600',
            highlight: 'bg-green-400',
            text: 'text-green-400',
            glow: 'shadow-green-400/50'
        },
        yellow: {
            bar: 'bg-yellow-600',
            highlight: 'bg-yellow-400',
            text: 'text-yellow-400',
            glow: 'shadow-yellow-400/50'
        }
    };

    const colors = colorClasses[color];

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${colors.bar}`}></div>
                    <span className="text-sm font-medium text-white">{label}</span>
                </div>
                <div className="text-right">
                    <div className={`text-lg font-bold ${colors.text}`}>{userRuntime}{unit}</div>
                    <div className="text-xs text-gray-400">Beats {beats}%</div>
                </div>
            </div>

            <div className="relative bg-gray-900 rounded-lg p-4 border border-gray-700/50">
                <div className="flex items-end justify-between space-x-1 h-24">
                    {data.map((point, index) => {
                        const height = (point.percentage / maxPercentage) * 100;
                        const isUserBar = index === userIndex;
                        
                        return (
                            <div key={index} className="flex-1 flex flex-col items-center space-y-1 group relative">
                                <div className="relative w-full flex items-end justify-center" style={{ height: '80px' }}>
                                    <div
                                        className={`w-full rounded-t transition-all duration-300 ${
                                            isUserBar 
                                                ? `${colors.highlight} shadow-lg ${colors.glow}` 
                                                : `${colors.bar} opacity-70 group-hover:opacity-100`
                                        }`}
                                        style={{ height: `${height}%` }}
                                    >
                                        {isUserBar && (
                                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-current animate-pulse"></div>
                                        )}
                                    </div>
                                </div>
                                <div className="text-[9px] text-gray-500 whitespace-nowrap">
                                    {point.runtime}{unit}
                                </div>
                                
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 px-2 py-1 rounded text-xs whitespace-nowrap z-10 pointer-events-none">
                                    {point.percentage}%
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
            </div>

            <div className="flex justify-between text-[10px] text-gray-500 px-4">
                <span>Slower</span>
                <span>Faster</span>
            </div>
        </div>
    );
};

export default RuntimeGraph;

