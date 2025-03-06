import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThankYou = () => {
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
            theme === 'dark' ? 'bg-green-900' : 'bg-green-100'
          }`}>
            <CheckCircle size={48} className={theme === 'dark' ? 'text-green-400' : 'text-green-600'} />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Thank You!</h1>
        <p className="mb-6">Your feedback has been submitted successfully.</p>
        
        <div className={`p-4 rounded-lg mb-6 ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <p className="text-sm">
            {theme === 'dark' 
              ? 'If you chose to receive a copy of your responses, it will be sent to your email shortly.'
              : 'If you chose to receive a copy of your responses, it will be sent to your email shortly.'}
          </p>
        </div>
        
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

export default ThankYou;