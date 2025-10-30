import React from 'react';

type TabId = 'problem' | 'video' | 'whiteboard' | 'chat';

interface RoomTabNavigationProps {
    activeTab: TabId;
    setActiveTab: (tab: TabId) => void;
    hasVideo: boolean;
    hasWhiteboard: boolean;
    showCreatorButton?: boolean;
    creatorControlsOpen?: boolean;
    onToggleCreatorControls?: () => void;
    onLeaveRoom?: () => void;
}

const RoomTabNavigation: React.FC<RoomTabNavigationProps> = ({
    activeTab,
    setActiveTab,
    hasVideo,
    hasWhiteboard,
    showCreatorButton = false,
    creatorControlsOpen,
    onToggleCreatorControls,
    onLeaveRoom
}) => {
    const tabs: { id: TabId; label: string; icon: string; enabled?: boolean }[] = [
        { id: 'problem', label: 'Problem', icon: '📋' },
        { id: 'video', label: 'Video', icon: '🎥', enabled: hasVideo },
        { id: 'whiteboard', label: 'Whiteboard', icon: '📝', enabled: hasWhiteboard },
        { id: 'chat', label: 'Chat', icon: '💬' }
    ];

    return (
        <div className="bg-black/80 border-b border-gray-800">
            <div className="px-4 py-2 flex items-center justify-between">
                <div className="inline-flex items-center gap-2 bg-gray-900/70 rounded-full p-1 border border-gray-800">
                    {tabs.map(tab => (
                        tab.enabled !== false && (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500/50 ${
                                    activeTab === tab.id
                                        ? 'bg-gray-800 text-white shadow-inner border border-gray-700'
                                        : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
                                }`}
                                aria-current={activeTab === tab.id ? 'page' : undefined}
                            >
                                <span className="mr-2 text-base leading-none">{tab.icon}</span>
                                <span>{tab.label}</span>
                            </button>
                        )
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    {showCreatorButton && (
                        <button
                            onClick={onToggleCreatorControls}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                                creatorControlsOpen
                                    ? 'bg-purple-600 text-white border-purple-500'
                                    : 'bg-gray-900 text-gray-200 border-gray-700 hover:bg-gray-800'
                            }`}
                            title="Creator Controls"
                        >
                            {creatorControlsOpen ? 'Close Controls' : 'Creator Controls'}
                        </button>
                    )}
                    {onLeaveRoom && (
                        <button
                            onClick={onLeaveRoom}
                            className="px-3 py-1.5 rounded-full text-sm font-semibold transition-colors bg-red-600 text-white hover:bg-red-700"
                            title="Leave Room"
                        >
                            Leave Room
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RoomTabNavigation;
