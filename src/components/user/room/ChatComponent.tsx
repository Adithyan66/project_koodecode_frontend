// import React, { useState, useRef, useEffect } from 'react';
// import { Send, Code, Smile } from 'lucide-react';
// import { useSelector } from 'react-redux';
// import type { RootState } from '../../../app/store';
// import { useAppSelector } from '../../../app/hooks';

// interface Message {
//   id: string;
//   userId: string;
//   username: string;
//   content: string;
//   type: 'text' | 'code';
//   language?: string;
//   timestamp: Date;
// }

// interface ChatComponentProps {
//   roomId: string;
// }

// const ChatComponent: React.FC<ChatComponentProps> = ({ roomId }) => {
//   // const { user } = useSelector((state: RootState) => state.auth);
//   const user = useAppSelector(state => state.user.user);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [messageType, setMessageType] = useState<'text' | 'code'>('text');
//   const [codeLanguage, setCodeLanguage] = useState('javascript');
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLTextAreaElement>(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const sendMessage = () => {
//     if (!newMessage.trim() || !user) return;

//     const message: Message = {
//       id: Date.now().toString(),
//       userId: user.id,
//       username: user.userName,
//       content: newMessage,
//       type: messageType,
//       language: messageType === 'code' ? codeLanguage : undefined,
//       timestamp: new Date()
//     };

//     setMessages(prev => [...prev, message]);
//     setNewMessage('');

//     // TODO: Send via Socket.IO
//     // roomSocketService.sendMessage(message);
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   const formatTime = (date: Date) => {
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   const renderMessage = (message: Message) => {
//     const isOwn = message.userId === user?.id;

//     return (
//       <div
//         key={message.id}
//         className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}
//       >
//         <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-1' : 'order-2'}`}>
//           {!isOwn && (
//             <div className="text-xs text-gray-400 mb-1">{message.username}</div>
//           )}

//           <div
//             className={`px-3 py-2 rounded-lg ${isOwn
//                 ? 'bg-green-600 text-white'
//                 : 'bg-gray-700 text-gray-100'
//               }`}
//           >
//             {message.type === 'code' ? (
//               <div>
//                 <div className="text-xs text-gray-300 mb-1 flex items-center">
//                   <Code size={12} className="mr-1" />
//                   {message.language}
//                 </div>
//                 <pre className="text-sm font-mono bg-gray-800 p-2 rounded overflow-x-auto">
//                   <code>{message.content}</code>
//                 </pre>
//               </div>
//             ) : (
//               <p className="text-sm whitespace-pre-wrap">{message.content}</p>
//             )}
//           </div>

//           <div className={`text-xs text-gray-500 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
//             {formatTime(message.timestamp)}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="flex flex-col">
//       {/* Chat Header */}
//       <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
//         <h3 className="text-white font-medium">Room Chat</h3>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-2">
//         {messages.length === 0 ? (
//           <div className="text-center text-gray-400 text-sm py-8">
//             No messages yet. Start the conversation!
//           </div>
//         ) : (
//           messages.map(renderMessage)
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Message Type Selector */}
//       <div className="px-4 py-2 border-t border-gray-700">
//         <div className="flex space-x-2 mb-2">
//           <button
//             onClick={() => setMessageType('text')}
//             className={`px-3 py-1 text-xs rounded transition-colors ${messageType === 'text'
//                 ? 'bg-green-600 text-white'
//                 : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
//               }`}
//           >
//             Text
//           </button>
//           <button
//             onClick={() => setMessageType('code')}
//             className={`px-3 py-1 text-xs rounded transition-colors ${messageType === 'code'
//                 ? 'bg-green-600 text-white'
//                 : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
//               }`}
//           >
//             <Code size={12} className="mr-1 inline" />
//             Code
//           </button>

//           {messageType === 'code' && (
//             <select
//               value={codeLanguage}
//               onChange={(e) => setCodeLanguage(e.target.value)}
//               className="bg-gray-700 text-white text-xs px-2 py-1 rounded border border-gray-600"
//             >
//               <option value="javascript">JavaScript</option>
//               <option value="python">Python</option>
//               <option value="java">Java</option>
//               <option value="cpp">C++</option>
//               <option value="go">Go</option>
//             </select>
//           )}
//         </div>

//         {/* Message Input */}
//         <div className="flex space-x-2">
//           <textarea
//             ref={inputRef}
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             onKeyPress={handleKeyPress}
//             placeholder={messageType === 'code' ? 'Share your code...' : 'Type a message...'}
//             className="flex-1 bg-gray-700 text-white text-sm px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
//             rows={messageType === 'code' ? 3 : 1}
//           />
//           <button
//             onClick={sendMessage}
//             disabled={!newMessage.trim()}
//             className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded transition-colors"
//           >
//             <Send size={16} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatComponent;
















import React, { useState, useRef, useEffect } from 'react';
import { Send, Code, Smile } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../app/store';
import { useAppSelector } from '../../../app/hooks';

interface Message {
  id: string;
  userId: string;
  username: string;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !user) return;

    const message: Message = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.userName,
      content: newMessage,
      type: messageType,
      language: messageType === 'code' ? codeLanguage : undefined,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // TODO: Send via Socket.IO
    // roomSocketService.sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (message: Message) => {
    const isOwn = message.userId === user?.id;

    return (
      <div
        key={message.id}
        className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}
      >
        <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-1' : 'order-2'}`}>
          {!isOwn && (
            <div className="text-xs text-gray-400 mb-1">{message.username}</div>
          )}

          <div
            className={`px-3 py-2 rounded-lg ${
              isOwn
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-gray-100'
            }`}
          >
            {message.type === 'code' ? (
              <div>
                <div className="text-xs text-gray-300 mb-1 flex items-center">
                  <Code size={12} className="mr-1" />
                  {message.language}
                </div>
                <pre className="text-sm font-mono bg-gray-800 p-2 rounded overflow-x-auto">
                  <code>{message.content}</code>
                </pre>
              </div>
            ) : (
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            )}
          </div>

          <div className={`text-xs text-gray-500 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full"> {/* Added h-full here */}
      {/* Chat Header */}
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex-shrink-0">
        <h3 className="text-white font-medium">Room Chat</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 min-h-0"> {/* Added flex-1 and min-h-0 */}
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 text-sm py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map(renderMessage)
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Type Selector and Input */}
      <div className="px-4 py-2 border-t border-gray-700 flex-shrink-0"> {/* Added flex-shrink-0 */}
        <div className="flex space-x-2 mb-2">
          <button
            onClick={() => setMessageType('text')}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              messageType === 'text'
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Text
          </button>
          <button
            onClick={() => setMessageType('code')}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              messageType === 'code'
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
              className="bg-gray-700 text-white text-xs px-2 py-1 rounded border border-gray-600"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="go">Go</option>
            </select>
          )}
        </div>

        {/* Message Input */}
        <div className="flex space-x-2">
          <textarea
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={messageType === 'code' ? 'Share your code...' : 'Type a message...'}
            className="flex-1 bg-gray-700 text-white text-sm px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            rows={messageType === 'code' ? 3 : 1}
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
