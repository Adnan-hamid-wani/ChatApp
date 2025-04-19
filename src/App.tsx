import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import LoginModal from './components/LoginModal';
import SettingsModal from './components/SettingsModal';
import ProfileModal from './components/ProfileModal';

const socket = io('http://localhost:3000');

interface Message {
  message: string;
  username: string;
  id: string;
  timestamp: Date;
}

interface User {
  id: string;
  username: string;
  status?: string;
  avatar?: string;
}

function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [typingUser, setTypingUser] = useState<string | null>(null);

useEffect(() => {
  socket.on('user_typing', ({ username: typingUsername }) => {
    if (typingUsername !== username) {
      setTypingUser(typingUsername);
    }
  });

  socket.on('user_stopped_typing', () => {
    setTypingUser(null);
  });

  return () => {
    socket.off('user_typing');
    socket.off('user_stopped_typing');
  };
}, [username]);


  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    const handleReceiveMessage = (message: Message) => {
      setMessages(prev => [...prev, message]);
    };

    const handleUserJoined = ({ users: roomUsers }: { users: User[] }) => {
      console.log('Users in room:', roomUsers);
      setUsers(roomUsers);
    };

    const handleUserLeft = ({ users: roomUsers }: { users: User[] }) => {
      console.log('User left, remaining users:', roomUsers);
      setUsers(roomUsers);
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('user_joined', handleUserJoined);
    socket.on('user_left', handleUserLeft);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('user_joined', handleUserJoined);
      socket.off('user_left', handleUserLeft);
    };
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = messages.filter(msg => 
        msg.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMessages(filtered);
    } else {
      setFilteredMessages(messages);
    }
  }, [searchTerm, messages]);

  const handleJoinRoom = (username: string, room: string) => {
    if (username && room) {
      setUsername(username);
      setRoom(room);
      socket.emit('join_room', { username, room });
      setIsLoggedIn(true);
      setMessages([]); // Clear messages when joining a new room
    }
  };

  const handleLogout = () => {
    socket.disconnect();
    setIsLoggedIn(false);
    setUsername('');
    setRoom('');
    setMessages([]);
    setUsers([]);
    socket.connect(); // Reconnect socket for future use
  };

  const sendMessage = (message: string) => {
    if (message.trim()) {
      socket.emit('send_message', { message });
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <div className={`h-screen ${isDarkMode ? 'dark' : ''} bg-gray-100 dark:bg-gray-900`}>
      <AnimatePresence>
        {!isLoggedIn && (
          <LoginModal onJoin={handleJoinRoom} />
        )}
        {showSettings && (
          <SettingsModal 
            onClose={() => setShowSettings(false)} 
            isDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
          />
        )}
        {showProfile && (
          <ProfileModal 
            username={username} 
            onClose={() => setShowProfile(false)}
            onLogout={handleLogout}
          />
        )}
      </AnimatePresence>

      {isLoggedIn && (
        <div className="h-full flex flex-col">
          <Navbar 
            room={room} 
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
          />
          <div className="flex-1 flex overflow-hidden">
            <Sidebar 
              users={users} 
              currentUser={username}
              onSettingsClick={() => setShowSettings(true)}
              onProfileClick={() => setShowProfile(true)}
              isDarkMode={isDarkMode}
              onToggleDarkMode={toggleDarkMode}
            />
            <ChatArea
              messages={filteredMessages}
              currentUser={username}
              onSendMessage={sendMessage}
              searchTerm={searchTerm}
              typingUser={typingUser}
              socket={socket}
              room={room}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;