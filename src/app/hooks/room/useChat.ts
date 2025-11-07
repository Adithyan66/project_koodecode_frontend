import { useState, useEffect, useRef, useCallback } from 'react';
import type { KeyboardEvent } from 'react';
import { useAppSelector } from '../../hooks';
import { roomSocketService } from '../../../services/roomSocketService';

export type ChatMessage = {
    id: string;
    userId: string;
    username: string;
    profilePicture?: string | null;
    profilePicKey?: string;
    content: string;
    type: 'text' | 'code';
    language?: string;
    timestamp: Date;
};

export const useChat = (roomId: string) => {
    const user = useAppSelector(state => state.user.user);

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [messageType, setMessageType] = useState<'text' | 'code'>('text');
    const [codeLanguage, setCodeLanguage] = useState('javascript');
    const [codeInputHeight, setCodeInputHeight] = useState<number>(100);
    const [codeHeights, setCodeHeights] = useState<Record<string, number>>({});
    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const [isSocketConnected, setIsSocketConnected] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLTextAreaElement | null>(null);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    useEffect(() => {
        const checkSocketConnection = () => {
            const connected = roomSocketService.isConnected();
            setIsSocketConnected(connected);
        };

        checkSocketConnection();
        const connectionInterval = setInterval(checkSocketConnection, 1000);
        return () => {
            clearInterval(connectionInterval);
        };
    }, []);

    const loadInitialMessages = useCallback(() => {
        if (!roomSocketService.chatsocket || !isSocketConnected || !roomId) return;
        roomSocketService.chatsocket.emit('request-initial-messages', { roomId });
    }, [isSocketConnected, roomId]);

    useEffect(() => {
        if (!isSocketConnected || !user?.id) {
            return;
        }

        const handleMessageReceived = (message: any) => {
            setMessages(prev => {
                const exists = prev.some(msg => msg.id === message.id);
                if (exists) {
                    return prev;
                }
                return [...prev, { ...message, timestamp: new Date(message.timestamp) }];
            });
        };

        const handleUserTyping = (data: { userId: string; username: string; isTyping: boolean }) => {
            if (data.userId === user.id) return;
            setTypingUsers(prev => {
                if (data.isTyping) {
                    return prev.includes(data.username) ? prev : [...prev, data.username];
                }
                return prev.filter(username => username !== data.username);
            });
        };

        const handleConnect = () => {
            setIsSocketConnected(true);
        };

        const handleDisconnect = () => {
            setIsSocketConnected(false);
        };

        const handleReconnect = () => {
            setIsSocketConnected(true);
            loadInitialMessages();
        };

        const socket = roomSocketService.chatsocket;
        socket?.on('message-received', handleMessageReceived);
        socket?.on('user-typing', handleUserTyping);
        socket?.on('connect', handleConnect);
        socket?.on('disconnect', handleDisconnect);
        socket?.on('reconnect', handleReconnect);

        return () => {
            socket?.off('message-received', handleMessageReceived);
            socket?.off('user-typing', handleUserTyping);
            socket?.off('connect', handleConnect);
            socket?.off('disconnect', handleDisconnect);
            socket?.off('reconnect', handleReconnect);
        };
    }, [isSocketConnected, user?.id, loadInitialMessages]);

    useEffect(() => {
        if (isSocketConnected && roomId && user?.id) {
            roomSocketService.chatsocket?.emit('join-room', { roomId, userId: user.id });
        }
    }, [isSocketConnected, roomId, user?.id]);

    useEffect(() => {
        if (isSocketConnected && roomId) {
            loadInitialMessages();
        }
    }, [isSocketConnected, roomId, loadInitialMessages]);

    const sendMessage = useCallback(() => {
        if (!newMessage.trim() || !user || !isSocketConnected) {
            return;
        }
        roomSocketService.sendMessage(
            newMessage,
            messageType,
            messageType === 'code' ? codeLanguage : undefined
        );

        setNewMessage('');
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
        }
        roomSocketService.stopTyping();
    }, [newMessage, user, isSocketConnected, messageType, codeLanguage]);

    const handleInputChange = useCallback((value: string) => {
        setNewMessage(value);
        if (!isSocketConnected) return;
        if (value.trim()) {
            roomSocketService.startTyping();
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            typingTimeoutRef.current = window.setTimeout(() => {
                roomSocketService.stopTyping();
                typingTimeoutRef.current = null;
            }, 2000);
        } else {
            roomSocketService.stopTyping();
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
                typingTimeoutRef.current = null;
            }
        }
    }, [isSocketConnected]);

    const handleKeyPress = useCallback((e: KeyboardEvent, currentMessageType: 'text' | 'code') => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        } else if (e.key === 'Enter' && e.ctrlKey && currentMessageType === 'code') {
            e.preventDefault();
            sendMessage();
        }
    }, [sendMessage]);

    const handleCodeEditorMount = useCallback((editor: any) => {
        const updateHeight = () => {
            const contentHeight = editor.getContentHeight();
            const clamped = Math.max(80, Math.min(contentHeight + 16, 260));
            setCodeInputHeight(clamped);
        };
        editor.onDidContentSizeChange(updateHeight);
        updateHeight();
    }, []);

    const getCodeViewerMount = useCallback((messageId: string) => (editor: any) => {
        const updateHeight = () => {
            const contentHeight = editor.getContentHeight();
            const clamped = Math.max(80, Math.min(contentHeight + 12, 320));
            setCodeHeights(prev => ({ ...prev, [messageId]: clamped }));
        };
        editor.onDidContentSizeChange(updateHeight);
        updateHeight();
    }, []);

    return {
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
    };
};

export type UseChatReturn = ReturnType<typeof useChat>;
