import React from 'react';
import Editor from '@monaco-editor/react';
import { Send, Code } from 'lucide-react';

interface MessageInputProps {
    messageType: 'text' | 'code';
    setMessageType: (type: 'text' | 'code') => void;
    codeLanguage: string;
    setCodeLanguage: (language: string) => void;
    codeInputHeight: number;
    newMessage: string;
    handleInputChange: (value: string) => void;
    handleCodeEditorMount: (editor: any) => void;
    sendMessage: () => void;
    isSocketConnected: boolean;
    inputRef: React.RefObject<HTMLTextAreaElement | null>;
    handleKeyPress: (event: React.KeyboardEvent, currentMessageType: 'text' | 'code') => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
    messageType,
    setMessageType,
    codeLanguage,
    setCodeLanguage,
    codeInputHeight,
    newMessage,
    handleInputChange,
    handleCodeEditorMount,
    sendMessage,
    isSocketConnected,
    inputRef,
    handleKeyPress
}) => {
    return (
        <div className="px-4 py-3 border-t border-gray-800/80 flex-shrink-0 bg-black/40 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
                <button
                    onClick={() => setMessageType('text')}
                    className={`px-3 py-1.5 text-xs rounded-full transition-all font-medium border ${messageType === 'text'
                        ? 'bg-green-600 text-white border-green-500'
                        : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                        }`}
                >
                    💬 Text
                </button>
                <button
                    onClick={() => setMessageType('code')}
                    className={`px-3 py-1.5 text-xs rounded-full transition-all font-medium border ${messageType === 'code'
                        ? 'bg-green-600 text-white border-green-500'
                        : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                        }`}
                >
                    <Code size={12} className="mr-1 inline" />
                    Code
                </button>

                {messageType === 'code' && (
                    <select
                        value={codeLanguage}
                        onChange={event => setCodeLanguage(event.target.value)}
                        className="bg-gray-900 text-white text-xs px-2 py-1.5 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 ml-auto"
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
                    <div className="rounded-xl overflow-hidden bg-gray-900 shadow-sm">
                        <Editor
                            height={`${codeInputHeight}px`}
                            language={codeLanguage}
                            value={newMessage}
                            onChange={value => handleInputChange(value || '')}
                            onMount={handleCodeEditorMount}
                            theme="vs-dark"
                            options={{
                                automaticLayout: true,
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                wordWrap: 'on',
                                fontSize: 13,
                                lineNumbers: 'off',
                                folding: false,
                                glyphMargin: false,
                                renderLineHighlight: 'none',
                                overviewRulerLanes: 0,
                                scrollbar: { vertical: 'hidden', horizontal: 'hidden' },
                                padding: { top: 8, bottom: 8 }
                            }}
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-400">
                            Press Ctrl+Enter to send code
                        </div>
                        <button
                            onClick={sendMessage}
                            disabled={!newMessage.trim() || !isSocketConnected}
                            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors flex items-center text-sm font-medium"
                        >
                            <Send size={14} className="mr-1" />
                            Send Code
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex items-end gap-3">
                    <div className="flex-1 relative">
                        <div className="flex items-center bg-gray-900 border border-gray-700 rounded-xl focus-within:ring-2 focus-within:ring-green-500">
                            <textarea
                                ref={inputRef}
                                value={newMessage}
                                onChange={event => handleInputChange(event.target.value)}
                                onKeyPress={event => handleKeyPress(event, messageType)}
                                placeholder={isSocketConnected ? 'Type a message...' : 'Connecting...'}
                                disabled={!isSocketConnected}
                                className="w-full bg-transparent text-white text-sm px-4 py-3 rounded-xl outline-none resize-none placeholder-gray-400 disabled:opacity-50"
                                rows={1}
                                style={{
                                    minHeight: '44px',
                                    maxHeight: '140px'
                                }}
                            />
                        </div>
                    </div>
                    <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim() || !isSocketConnected}
                        className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl transition-colors flex-shrink-0 shadow-sm"
                        title="Send message"
                    >
                        <Send size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default MessageInput;

