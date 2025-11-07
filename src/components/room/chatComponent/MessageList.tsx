import React from 'react';
import Editor from '@monaco-editor/react';
import { Code } from 'lucide-react';
import { imageKitService } from '../../../services/ImageKitService';
import type { ChatMessage } from '../../../app/hooks/room/useChat';

interface MessageListProps {
    messages: ChatMessage[];
    typingUsers: string[];
    codeHeights: Record<string, number>;
    getCodeViewerMount: (messageId: string) => (editor: any) => void;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    userId?: string;
    isSocketConnected: boolean;
}

const MessageList: React.FC<MessageListProps> = ({
    messages,
    typingUsers,
    codeHeights,
    getCodeViewerMount,
    messagesEndRef,
    userId,
    isSocketConnected
}) => {
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 min-h-0 space-y-3 tiny-scrollbar">
            {messages.length === 0 ? (
                <div className="h-full w-full flex items-center justify-center">
                    <div className="text-center text-gray-400 text-sm py-8">
                        <div className="mb-4 text-2xl">💬</div>
                        <div className="text-gray-300">
                            {isSocketConnected ? 'No messages yet. Start the conversation.' : 'Connecting to chat...'}
                        </div>
                    </div>
                </div>
            ) : (
                messages.map(message => {
                    const isOwn = message.userId === userId;
                    return (
                        <div
                            key={message.id}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4 group`}
                        >
                            {!isOwn && (
                                <div className="flex-shrink-0 mr-3">
                                    <UserAvatar
                                        profilePicture={message.profilePicture}
                                        username={message.username}
                                        size={32}
                                    />
                                </div>
                            )}
                            <div className={`${message.type === 'code' ? 'max-w-2xl w-full' : 'max-w-xs lg:max-w-md'} ${isOwn ? 'order-1' : 'order-2'}`}>
                                {!isOwn && (
                                    <div className="text-xs text-gray-400 mb-1 ml-1">{message.username}</div>
                                )}
                                <div
                                    className={`${message.type === 'code'
                                        ? 'p-0 bg-transparent shadow-none'
                                        : `px-4 py-3 rounded-lg shadow-sm ${isOwn
                                            ? 'bg-green-600 text-white rounded-br-sm'
                                            : 'bg-gray-700 text-gray-100 rounded-bl-sm'
                                        }`
                                        }`}
                                >
                                    {message.type === 'code' ? (
                                        <div>
                                            <div className="text-xs text-gray-300 mb-2 flex items-center">
                                                <Code size={12} className="mr-1" />
                                                <span className="font-medium">{message.language}</span>
                                            </div>
                                            <div className="bg-gray-900/80 rounded-lg p-2.5 overflow-hidden shadow-sm">
                                                <Editor
                                                    height={`${codeHeights[message.id] ?? 100}px`}
                                                    language={message.language}
                                                    value={message.content}
                                                    onMount={getCodeViewerMount(message.id)}
                                                    theme="vs-dark"
                                                    options={{
                                                        readOnly: true,
                                                        automaticLayout: true,
                                                        minimap: { enabled: false },
                                                        scrollBeyondLastLine: false,
                                                        wordWrap: 'off',
                                                        fontSize: 12,
                                                        lineNumbers: 'off',
                                                        folding: false,
                                                        glyphMargin: false,
                                                        renderLineHighlight: 'none',
                                                        overviewRulerLanes: 0,
                                                        scrollbar: { vertical: 'hidden', horizontal: 'auto', horizontalScrollbarSize: 6 },
                                                        padding: { top: 6, bottom: 6 }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                                    )}
                                </div>
                                <div className={`text-xs text-gray-500 mt-1 px-1 ${isOwn ? 'text-right' : 'text-left'}`}>
                                    {formatTime(message.timestamp)}
                                </div>
                            </div>
                        </div>
                    );
                })
            )}

            {typingUsers.length > 0 && (
                <div className="flex items-center text-emerald-300 text-sm px-4 py-2 bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-emerald-500/10 rounded-full w-fit backdrop-blur-sm border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                    <div className="flex space-x-1 mr-3">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce shadow-sm shadow-emerald-400/50" />
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce shadow-sm shadow-green-400/50" style={{ animationDelay: '0.15s' }} />
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce shadow-sm shadow-emerald-400/50" style={{ animationDelay: '0.3s' }} />
                    </div>
                    <span className="font-medium">
                        {typingUsers.length === 1
                            ? `${typingUsers[0]} is typing...`
                            : `${typingUsers.slice(0, 2).join(', ')}${typingUsers.length > 2 ? ` and ${typingUsers.length - 2} others` : ''} are typing...`}
                    </span>
                </div>
            )}

            <div ref={messagesEndRef} />
        </div>
    );
};

interface UserAvatarProps {
    profilePicture?: string | null;
    username: string;
    size?: number;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ profilePicture, username, size = 32 }) => {
    if (profilePicture) {
        return (
            <img
                src={imageKitService.getImageBySize(profilePicture, 'small')}
                alt={username}
                className="rounded-full object-cover"
                style={{ width: size, height: size }}
            />
        );
    }

    return (
        <div
            className="rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold"
            style={{ width: size, height: size, fontSize: size * 0.4 }}
        >
            {username.charAt(0).toUpperCase()}
        </div>
    );
};

export default MessageList;

