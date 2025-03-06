import React, { useState } from 'react';
import { X, Copy } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface AddToLibraryModalProps {
  templateName: string;
  onConfirm: (name: string, description: string) => void;
  onCancel: () => void;
  description?: string;
}

const AddToLibraryModal: React.FC<AddToLibraryModalProps> = ({ 
  templateName, 
  description = '',
  onConfirm, 
  onCancel 
}) => {
  const { theme } = useTheme();
  const [name, setName] = useState(templateName);
  const [surveyDescription, setSurveyDescription] = useState(description);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-md rounded-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Copy size={20} className="mr-2" />
            <h3 className="text-lg font-semibold">Add to My Library</h3>
          </div>
          <button 
            onClick={onCancel}
            className={`p-1 rounded-full ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <p className="text-sm">
            You're adding <strong>"{templateName}"</strong> to your survey library.
          </p>
          
          <div>
            <label htmlFor="survey-name" className="block text-sm font-medium mb-1">
              Survey Name
            </label>
            <input
              id="survey-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-2 rounded border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 focus:border-indigo-500' 
                  : 'border-gray-300 focus:border-indigo-500'
              } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
            />
          </div>
          
          <div>
            <label htmlFor="survey-description" className="block text-sm font-medium mb-1">
              Description (Optional)
            </label>
            <textarea
              id="survey-description"
              value={surveyDescription}
              onChange={(e) => setSurveyDescription(e.target.value)}
              rows={3}
              className={`w-full p-2 rounded border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 focus:border-indigo-500' 
                  : 'border-gray-300 focus:border-indigo-500'
              } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
              placeholder="Briefly describe the purpose of this survey"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onCancel}
            className={`px-4 py-2 rounded ${
              theme === 'dark' 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(name, surveyDescription)}
            disabled={!name.trim()}
            className={`px-4 py-2 rounded ${
              !name.trim()
                ? 'opacity-50 cursor-not-allowed'
                : theme === 'dark'
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            Add to Library
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToLibraryModal;