import React from 'react';
import { Moon, Sun, Bell, User, LogOut } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  isAdmin?: boolean;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ isAdmin = false, className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <header className={`h-[64px] py-4 px-6 flex justify-between items-center border-b ${
      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } ${className}`}>
      <div className="flex items-center space-x-2">
        <h1 className={`text-xl font-bold ${isAdmin ? 'text-red-500 dark:text-red-400' : ''}`}>
          {isAdmin ? 'PulseCheck Super Admin' : 'PulseCheck'}
        </h1>
        {isAdmin && (
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
          }`}>
            Super Admin
          </span>
        )}
      </div>
      <div className="flex items-center space-x-4">
        {user && (
          <div className="mr-4 text-sm">
            <span className="opacity-75 mr-1">Welcome,</span>
            <span className="font-medium">{user.firstName}</span>
            {user.isSuperAdmin && (
              <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                Super Admin
              </span>
            )}
          </div>
        )}
        <button 
          onClick={toggleTheme}
          className={`p-2 rounded-full ${
            theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
          }`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button 
          className={`p-2 rounded-full ${
            theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
          }`}
          aria-label="Notifications"
        >
          <Bell size={20} />
        </button>
        <button 
          onClick={() => navigate('/profile')}
          className={`p-2 rounded-full ${
            theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
          }`}
          aria-label="User profile"
        >
          <User size={20} />
        </button>
        <button 
          onClick={handleLogout}
          className={`p-2 rounded-full ${
            theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
          }`}
          aria-label="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;