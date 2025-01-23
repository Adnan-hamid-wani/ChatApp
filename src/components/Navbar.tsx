import React from 'react';
import { Search, Users, Bell } from 'lucide-react';

interface NavbarProps {
  room: string;
  searchTerm: string;
  onSearch: (term: string) => void;
}

function Navbar({ room, searchTerm, onSearch }: NavbarProps) {
  return (
    <nav className="bg-emerald-600 dark:bg-emerald-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Users className="h-6 w-6" />
          <h1 className="text-xl font-semibold">{room}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-emerald-700 dark:bg-emerald-900 rounded-lg px-3 py-2 min-w-[300px]">
            <Search className="h-5 w-5 text-emerald-300" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search messages..."
              className="bg-transparent border-none focus:outline-none text-white placeholder-emerald-300 ml-2 w-full"
            />
          </div>
          
          <button className="p-2 hover:bg-emerald-700 dark:hover:bg-emerald-900 rounded-full transition-colors relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;