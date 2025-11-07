import React from 'react';

interface ChatHeaderProps {
    messagesCount: number;
    isSocketConnected: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ messagesCount, isSocketConnected }) => {
    return (
        <div className="px-4 py-3 border-b border-gray-800/80 flex-shrink-0 bg-black/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="h-7 w-1 bg-green-500 rounded-full" />
                    <div>
                        <h3 className="text-white font-semibold leading-tight">Room Chat</h3>
                        <p className="text-gray-400 text-xs mt-0.5">{messagesCount} messages</p>
                    </div>
                </div>
                <div className="flex items-center px-2.5 py-1 rounded-full text-xs border border-gray-700/70 bg-gray-800/60">
                    <span className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${isSocketConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                    <span className={`uppercase tracking-wide ${isSocketConnected ? 'text-green-400' : 'text-red-400'}`}>
                        {isSocketConnected ? 'Connected' : 'Offline'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;

