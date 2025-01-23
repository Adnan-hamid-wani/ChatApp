import React from 'react';
import { motion } from 'framer-motion';
import { X, Bell, Lock, Smartphone, Moon, Sun, Palette, Volume2 } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

function SettingsModal({ onClose, isDarkMode, onToggleDarkMode }: SettingsModalProps) {
  const settings = [
    { icon: <Bell className="h-5 w-5" />, title: 'Notifications', description: 'Message, group & call tones' },
    { icon: <Lock className="h-5 w-5" />, title: 'Privacy', description: 'Block contacts, disappearing messages' },
    { icon: <Palette className="h-5 w-5" />, title: 'Theme', description: 'Colors, wallpapers, chat themes' },
    { icon: <Volume2 className="h-5 w-5" />, title: 'Sound', description: 'Messages, calls, notifications' },
    { icon: <Smartphone className="h-5 w-5" />, title: 'App Language', description: 'English' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold dark:text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          {settings.map((setting, index) => (
            <button
              key={index}
              className="w-full flex items-center space-x-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <div className="text-emerald-600 dark:text-emerald-400">{setting.icon}</div>
              <div className="flex-1 text-left">
                <h3 className="font-medium dark:text-white">{setting.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{setting.description}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 dark:text-white">
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={isDarkMode}
                onChange={onToggleDarkMode}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
export default SettingsModal;