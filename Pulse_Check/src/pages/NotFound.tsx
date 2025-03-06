import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const NotFound = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen flex items-center justify-center ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className={`max-w-md w-full p-8 rounded-lg text-center ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'
      }`}>
        <div className="flex justify-center mb-6">
          <div className={`p-4 rounded-full ${
            theme === 'dark' ? 'bg-yellow-900' : 'bg-yellow-100'
          }`}>
            <AlertTriangle size={48} className={theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'} />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
        <p className="mb-6">The page you are looking for doesn't exist or has been moved.</p>
        
        <Link 
          to="/"
          className={`inline-block py-3 px-6 rounded-md font-medium ${
            theme === 'dark' 
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;