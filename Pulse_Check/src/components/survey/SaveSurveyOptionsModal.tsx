import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { ClipboardList, FileText, X, Save } from 'lucide-react';

interface SaveSurveyOptionsModalProps {
  onSaveAsTemplate: () => void;
  onSaveToLibrary: () => void;
  onSaveBoth: () => void;
  onClose: () => void;
}

const SaveSurveyOptionsModal: React.FC<SaveSurveyOptionsModalProps> = ({
  onSaveAsTemplate,
  onSaveToLibrary,
  onSaveBoth,
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
            <Save size={24} className="text-indigo-500 mr-2" />
            <h3 className="text-lg font-semibold">Save Survey</h3>
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
              <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                How would you like to save this survey?
              </p>
              <p className="text-sm text-indigo-500 dark:text-indigo-300">
                Choose how you want to save and use this survey
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={onSaveAsTemplate}
              className={`flex items-center p-4 rounded-lg border transition-all ${
                theme === 'dark'
                  ? 'border-gray-700 hover:bg-gray-700 hover:border-indigo-500'
                  : 'border-gray-200 hover:bg-gray-50 hover:border-indigo-500'
              }`}
            >
              <ClipboardList size={24} className="mr-4" />
              <div className="text-left">
                <h4 className="font-medium">Save as Template</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Make this survey available as a reusable template
                </p>
              </div>
            </button>

            <button
              onClick={onSaveToLibrary}
              className={`flex items-center p-4 rounded-lg border transition-all ${
                theme === 'dark'
                  ? 'border-gray-700 hover:bg-gray-700 hover:border-indigo-500'
                  : 'border-gray-200 hover:bg-gray-50 hover:border-indigo-500'
              }`}
            >
              <FileText size={24} className="mr-4" />
              <div className="text-left">
                <h4 className="font-medium">Save to My Library</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Add this survey to your personal library
                </p>
              </div>
            </button>

            <button
              onClick={onSaveBoth}
              className={`flex items-center p-4 rounded-lg border transition-all ${
                theme === 'dark'
                  ? 'border-gray-700 hover:bg-gray-700 hover:border-indigo-500 bg-indigo-900/20'
                  : 'border-gray-200 hover:bg-gray-50 hover:border-indigo-500 bg-indigo-50'
              }`}
            >
              <div className="relative mr-4">
                <ClipboardList size={24} className="absolute -left-1 -top-1" />
                <FileText size={24} className="relative left-1 top-1" />
              </div>
              <div className="text-left">
                <h4 className="font-medium">Save Both Ways</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Save as template and add to your library
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveSurveyOptionsModal;