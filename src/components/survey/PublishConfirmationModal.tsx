import React, { useState } from 'react';
import { CheckCircle, Copy, X, Link as LinkIcon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface PublishConfirmationModalProps {
  surveyId: string;
  surveyName: string;
  onClose: () => void;
}

const PublishConfirmationModal: React.FC<PublishConfirmationModalProps> = ({ 
  surveyId, 
  surveyName, 
  onClose 
}) => {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);
  
  const surveyUrl = `${window.location.origin}/survey/${surveyId}`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(surveyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-md rounded-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <CheckCircle size={20} className="text-green-500 mr-2" />
            <h3 className="text-lg font-semibold">Survey Published</h3>
          </div>
          <button 
            onClick={onClose}
            className={`p-1 rounded-full ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <div className={`p-4 rounded-lg ${
            theme === 'dark' ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-100'
          }`}>
            <p className="text-green-600 dark:text-green-400">
              <strong>"{surveyName}"</strong> has been successfully published!
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Survey ID
            </label>
            <div className={`flex items-center p-2 rounded border ${
              theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
            }`}>
              <code className="flex-1 font-mono text-sm">{surveyId}</code>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Survey URL
            </label>
            <div className={`flex items-center p-2 rounded border ${
              theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
            }`}>
              <LinkIcon size={16} className="mr-2 text-gray-500" />
              <code className="flex-1 font-mono text-sm overflow-x-auto">{surveyUrl}</code>
              <button
                onClick={copyToClipboard}
                className={`ml-2 p-1.5 rounded ${
                  theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                }`}
                title="Copy to clipboard"
              >
                {copied ? (
                  <CheckCircle size={18} className="text-green-500" />
                ) : (
                  <Copy size={18} />
                )}
              </button>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <p className="text-sm">
              <strong>Next steps:</strong>
            </p>
            <ul className="list-disc ml-5 mt-2 text-sm space-y-1">
              <li>Share this URL with your respondents</li>
              <li>Monitor responses in the Dashboard</li>
              <li>View detailed analytics in the Results page</li>
            </ul>
          </div>
        </div>
        
        <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded ${
              theme === 'dark' 
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishConfirmationModal;