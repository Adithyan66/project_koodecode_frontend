import React from 'react';
import { useChat } from '../../../app/hooks/room/useChat';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

interface ChatComponentProps {
    roomId: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ roomId }) => {
    const {
        user,
        messages,
        newMessage,
        messageType,
        setMessageType,
        codeLanguage,
        setCodeLanguage,
        codeInputHeight,
        codeHeights,
        typingUsers,
        isSocketConnected,
        messagesEndRef,
        inputRef,
        sendMessage,
        handleInputChange,
        handleKeyPress,
        handleCodeEditorMount,
        getCodeViewerMount
    } = useChat(roomId);

    return (
        <div className="flex flex-col h-full bg-[#0b0d12]">
            <ChatHeader
                messagesCount={messages.length}
                isSocketConnected={isSocketConnected}
            />
            <MessageList
                messages={messages}
                typingUsers={typingUsers}
                codeHeights={codeHeights}
                getCodeViewerMount={getCodeViewerMount}
                messagesEndRef={messagesEndRef}
                userId={user?.id}
                isSocketConnected={isSocketConnected}
            />
            <MessageInput
                messageType={messageType}
                setMessageType={setMessageType}
                codeLanguage={codeLanguage}
                setCodeLanguage={setCodeLanguage}
                codeInputHeight={codeInputHeight}
                newMessage={newMessage}
                handleInputChange={handleInputChange}
                handleCodeEditorMount={handleCodeEditorMount}
                sendMessage={sendMessage}
                isSocketConnected={isSocketConnected}
                inputRef={inputRef}
                handleKeyPress={handleKeyPress}
            />
        </div>
    );
};

export default ChatComponent;

