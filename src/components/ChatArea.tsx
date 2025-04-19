import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, Image, Paperclip, Mic } from 'lucide-react';
import { motion } from 'framer-motion';
import { Socket } from 'socket.io-client';

interface Message {
  message: string;
  username: string;
  id: string;
  timestamp: Date;
}

interface ChatAreaProps {
  messages: Message[];
  currentUser: string;
  onSendMessage: (message: string) => void;
  searchTerm: string;
  typingUser: string | null;
  socket: Socket;
  room: string;
}

function ChatArea({ messages, currentUser, onSendMessage, searchTerm, typingUser, socket, room }: ChatAreaProps) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const highlightSearchTerm = (text: string) => {
    if (!searchTerm) return text;
    
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === searchTerm.toLowerCase() ? 
        <span key={index} className="bg-yellow-200 dark:bg-yellow-500">{part}</span> : 
        part
    );
  };
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    socket.emit('typing', { username: currentUser, room });
  
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit('stop_typing', { room });
    }, 1000);
  };
  
  
  

  return (
    <div className="flex-1 flex flex-col bg-[#efeae2] dark:bg-gray-900">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <motion.div
            key={`${msg.id}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.username === currentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                msg.username === currentUser
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white'
              } shadow-sm`}
            >
              {msg.username !== currentUser && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mb-1">
                  {msg.username}
                </p>
              )}
              <p className="text-sm">{highlightSearchTerm(msg.message)}</p>
              <p className="text-xs opacity-70 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </motion.div>
        ))}
        {typingUser && typingUser !== currentUser && (
  <div className="text-sm text-gray-500 dark:text-gray-300 italic">
    {typingUser} is typing...
  </div>
)}

        <div ref={messagesEndRef} />
        
      </div>


      <form
        onSubmit={handleSubmit}
        className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800"
      >
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <Smile className="h-6 w-6" />
          </button>
          <button
            type="button"
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <Paperclip className="h-6 w-6" />
          </button>
          <button
            type="button"
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <Image className="h-6 w-6" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 rounded-full border border-gray-300 dark:border-gray-600 px-4 py-2 focus:outline-none focus:border-emerald-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />
          {newMessage ? (
            <button
              type="submit"
              className="bg-emerald-600 text-white rounded-full p-2 hover:bg-emerald-700 transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          ) : (
            <button
              type="button"
              className="bg-emerald-600 text-white rounded-full p-2 hover:bg-emerald-700 transition-colors"
            >
              <Mic className="h-5 w-5" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ChatArea;