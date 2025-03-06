import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { ClipboardList, FileText, X, CheckCircle } from 'lucide-react';

interface SaveOptionsModalProps {
  questionId: string;
  onAddToSurvey: () => void;
  onClose: () => void;
}

const SaveOptionsModal: React.FC<SaveOptionsModalProps> = ({
  questionId,
  onAddToSurvey,
  onClose
}) => {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-md rounded-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <CheckCircle size={24} className="text-green-500 mr-2" />
            <h3 className="text-lg font-semibold">Question Created Successfully</h3>
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
        
        <div className="p-6 space-y-6">
          <div className={`p-4 rounded-lg ${
            theme === 'dark' 
              ? 'bg-indigo-900/20 border border-indigo-800' 
              : 'bg-indigo-50 border border-indigo-100'
          }`}>
            <div className="space-y-2">
              <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                Question added to library successfully
              </p>
              <p className="text-base font-medium text-indigo-500 dark:text-indigo-300">
                What would you like to do next?
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={onAddToSurvey}
              className={`flex items-center p-4 rounded-lg border transition-all ${
                theme === 'dark'
                  ? 'border-gray-700 hover:bg-gray-700 hover:border-indigo-500'
                  : 'border-gray-200 hover:bg-gray-50 hover:border-indigo-500'
              }`}
            >
              <FileText size={24} className="mr-4" />
              <div className="text-left">
                <h4 className="font-medium">Add to Current Survey</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Add this question to your current survey
                </p>
              </div>
            </button>

            <button
              onClick={onClose}
              className={`flex items-center p-4 rounded-lg border transition-all ${
                theme === 'dark'
                  ? 'border-gray-700 hover:bg-gray-700 hover:border-indigo-500'
                  : 'border-gray-200 hover:bg-gray-50 hover:border-indigo-500'
              }`}
            >
              <ClipboardList size={24} className="mr-4" />
              <div className="text-left">
                <h4 className="font-medium">I'm all set</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Close and return to the library
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveOptionsModal;