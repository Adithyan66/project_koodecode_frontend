import React from 'react';

interface RoomTabNavigationProps {
    activeTab: 'problem' | 'video' | 'whiteboard';
    setActiveTab: (tab: 'problem' | 'video' | 'whiteboard') => void;
    hasVideo: boolean;
    hasWhiteboard: boolean;
}

const RoomTabNavigation: React.FC<RoomTabNavigationProps> = ({
    activeTab,
    setActiveTab,
    hasVideo,
    hasWhiteboard
}) => {
    const tabs = [
        { id: 'problem', label: 'Problem', icon: '📋' },
        { id: 'video', label: 'Video Call', icon: '🎥', enabled: hasVideo },
        { id: 'whiteboard', label: 'Whiteboard', icon: '📝', enabled: hasWhiteboard },
        { id: 'chat', label: 'Chat', icon: '📝'}
    ];

    return (
        <div className="bg-black border-b border-gray-700">
            <div className="flex">
                {tabs.map(tab => (
                    tab.enabled !== false && (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center space-x-2 px-6 py-3 border-b-2 transition-colors ${
                                activeTab === tab.id
                                    ? 'border-green-500 bg-gray-700 text-green-400'
                                    : 'border-transparent hover:bg-gray-700 text-gray-300 hover:text-white'
                            }`}
                        >
                            <span className="text-lg">{tab.icon}</span>
                            <span className="font-medium">{tab.label}</span>
                        </button>
                    )
                ))}
            </div>
        </div>
    );
};

export default RoomTabNavigation;
