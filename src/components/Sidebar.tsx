import React from 'react';
import { User, Settings, MessageSquare, Moon, Bell, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  users: Array<{ id: string; username: string }>;
  currentUser: string;
  onSettingsClick: () => void;
  onProfileClick: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

function Sidebar({ users, currentUser, onSettingsClick, onProfileClick, isDarkMode, onToggleDarkMode }: SidebarProps) {
  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div 
        className="p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        onClick={onProfileClick}
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold dark:text-white">{currentUser}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Online</p>
          </div>
          <button 
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            onClick={(e) => {
              e.stopPropagation();
              onSettingsClick();
            }}
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-2 p-4 border-b border-gray-200 dark:border-gray-700">
        <button className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-emerald-50 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-800 transition-colors">
          <MessageSquare className="h-4 w-4" />
          <span>Chats</span>
        </button>
        <button className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <Bell className="h-4 w-4" />
          <span>Notifications</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <h3 className="px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
          Users in Room ({users.length})
        </h3>
        {users.map((user) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                <User className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium dark:text-white">
                  {user.username}
                  {user.username === currentUser && " (You)"}
                </p>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">Online</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button 
          onClick={onToggleDarkMode}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
        >
          {isDarkMode ? (
            <>
              <Sun className="h-5 w-5" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="h-5 w-5" />
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;