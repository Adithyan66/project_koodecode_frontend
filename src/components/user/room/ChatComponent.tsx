



import React, { useState, useRef, useEffect } from 'react';
import { Send, Code, User } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { useAppSelector } from '../../../app/hooks';
import { roomSocketService } from '../../../services/roomSocketService';

interface Message {
  id: string;
  userId: string;
  username: string;
  profilePicture?: string | null;
  content: string;
  type: 'text' | 'code';
  language?: string;
  timestamp: Date;
}

interface ChatComponentProps {
  roomId: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ roomId }) => {
  const user = useAppSelector(state => state.user.user);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [messageType, setMessageType] = useState<'text' | 'code'>('text');
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Socket event listeners
  useEffect(() => {
    const handleMessageReceived = (message: any) => {
      setMessages(prev => [...prev, {
        ...message,
        timestamp: new Date(message.timestamp)
      }]);
      console.log("✅ Message received:", message);
    };

    const handleUserTyping = (data: { userId: string; username: string; isTyping: boolean }) => {
      if (data.userId === user?.id) return;

      setTypingUsers(prev => {
        if (data.isTyping) {
          return prev.includes(data.username) ? prev : [...prev, data.username];
        } else {
          return prev.filter(username => username !== data.username);
        }
      });
    };

    if (roomSocketService.isConnected()) {
      roomSocketService.chatsocket?.on('message-received', handleMessageReceived);
      roomSocketService.chatsocket?.on('user-typing', handleUserTyping);
    }

    return () => {
      roomSocketService.chatsocket?.off('message-received', handleMessageReceived);
      roomSocketService.chatsocket?.off('user-typing', handleUserTyping);
    };
  }, [user?.id]);

  const sendMessage = () => {
    if (!newMessage.trim() || !user) return;

    roomSocketService.sendMessage(
      newMessage,
      messageType,
      messageType === 'code' ? codeLanguage : undefined
    );

    setNewMessage('');
    roomSocketService.stopTyping();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (value: string) => {
    setNewMessage(value);

    if (value.trim()) {
      roomSocketService.startTyping();

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        roomSocketService.stopTyping();
      }, 2000);
    } else {
      roomSocketService.stopTyping();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const UserAvatar: React.FC<{ profilePicture?: string | null; username: string; size?: number }> = ({
    profilePicture,
    username,
    size = 32
  }) => {
    if (profilePicture) {
      return (
        <img
          src={"https://media.gettyimages.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?s=612x612&w=gi&k=20&c=LsB3LmCoN69U82LEYU78IC2tNwOMjy7LJlmEj30UOSs="}
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

  const renderMessage = (message: Message) => {
    const isOwn = message.userId === user?.id;

    return (
      <div
        key={message.id}
        className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4 group`}
      >
        {!isOwn && (
          <div className="flex-shrink-0 mr-3">
            <UserAvatar
              profilePicture={"https://media.gettyimages.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?s=612x612&w=gi&k=20&c=LsB3LmCoN69U82LEYU78IC2tNwOMjy7LJlmEj30UOSs="}
              username={message.username}
              size={32}
            />
          </div>
        )}

        <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-1' : 'order-2'}`}>
          {!isOwn && (
            <div className="text-xs text-gray-400 mb-1 ml-1">{message.username}</div>
          )}

          <div
            className={`px-4 py-3 rounded-lg shadow-sm ${isOwn
                ? 'bg-green-600 text-white rounded-br-sm'
                : 'bg-gray-700 text-gray-100 rounded-bl-sm'
              }`}
          >
            {message.type === 'code' ? (
              <div>
                <div className="text-xs text-gray-300 mb-2 flex items-center">
                  <Code size={12} className="mr-1" />
                  <span className="font-medium">{message.language}</span>
                </div>
                <div className="bg-gray-900 rounded p-3 overflow-hidden">
                  <Editor
                    height="120px"
                    width={"400px"}
                    language={message.language}
                    value={message.content}
                    theme="vs-dark"
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      wordWrap: 'on',
                      fontSize: 12,
                      lineNumbers: 'off',
                      folding: false,
                      scrollbar: {
                        vertical: 'hidden',
                        horizontal: 'hidden'
                      }
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
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="bg-gray-800 px-4 py-3 border-b border-gray-700 flex-shrink-0">
        <h3 className="text-white font-medium">Room Chat</h3>
        <p className="text-gray-400 text-sm mt-1">{messages.length} messages</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 min-h-0">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 text-sm py-8">
            <div className="mb-4">💬</div>
            <div>No messages yet. Start the conversation!</div>
          </div>
        ) : (
          messages.map(renderMessage)
        )}

        {typingUsers.length > 0 && (
          <div className="flex items-center text-gray-400 text-sm px-4 py-2">
            <div className="flex space-x-1 mr-2">
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            {typingUsers.length === 1
              ? `${typingUsers[0]} is typing...`
              : `${typingUsers.slice(0, 2).join(', ')}${typingUsers.length > 2 ? ` and ${typingUsers.length - 2} others` : ''} are typing...`
            }
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="px-4 py-3 border-t border-gray-700 flex-shrink-0 bg-gray-800">
        <div className="flex space-x-2 mb-3">
          <button
            onClick={() => setMessageType('text')}
            className={`px-3 py-1.5 text-xs rounded-md transition-colors font-medium ${messageType === 'text'
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
          >
            💬 Text
          </button>
          <button
            onClick={() => setMessageType('code')}
            className={`px-3 py-1.5 text-xs rounded-md transition-colors font-medium ${messageType === 'code'
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
          >
            <Code size={12} className="mr-1 inline" />
            Code
          </button>

          {messageType === 'code' && (
            <select
              value={codeLanguage}
              onChange={(e) => setCodeLanguage(e.target.value)}
              className="bg-gray-700 text-white text-xs px-2 py-1.5 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="go">Go</option>
            </select>
          )}
        </div>

        {messageType === 'code' ? (
          <div className="space-y-3">
            <div className="border border-gray-600 rounded-lg overflow-hidden">
              <Editor
                height="100px"
                language={codeLanguage}
                value={newMessage}
                onChange={(value) => handleInputChange(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  fontSize: 13,
                  lineNumbers: 'off',
                  folding: false,
                }}
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-400">
                Press Ctrl+Enter to send code
              </div>
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors flex items-center text-sm font-medium"
              >
                <Send size={14} className="mr-1" />
                Send Code
              </button>
            </div>
          </div>
        ) : (
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={newMessage}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="w-full bg-gray-700 text-white text-sm px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none placeholder-gray-400"
                rows={1}
                style={{
                  minHeight: '44px',
                  maxHeight: '120px'
                }}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-colors flex-shrink-0"
              title="Send message"
            >
              <Send size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatComponent;
