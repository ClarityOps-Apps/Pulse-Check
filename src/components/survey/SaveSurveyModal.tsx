import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface SaveSurveyModalProps {
  onSave: (name: string, description: string) => void;
  onClose: () => void;
  initialTitle?: string;
  initialDescription?: string;
  isSaving?: boolean;
}

const SaveSurveyModal: React.FC<SaveSurveyModalProps> = ({ 
  onSave, 
  onClose,
  initialTitle = '',
  initialDescription = '',
  isSaving = false
}) => {
  const { theme } = useTheme();
  const [name, setName] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [error, setError] = useState('');
  
  const handleSave = () => {
    if (!name.trim()) {
      setError('Survey name is required');
      return;
    }
    
    onSave(name, description);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-md rounded-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold">Save Survey</h3>
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
          {error && (
            <div className="p-3 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          <div>
            <label htmlFor="survey-name" className="block text-sm font-medium mb-1">
              Survey Name <span className="text-red-500">*</span>
            </label>
            <input
              id="survey-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.trim()) setError('');
              }}
              className={`w-full p-2 rounded border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 focus:border-indigo-500' 
                  : 'border-gray-300 focus:border-indigo-500'
              } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
              placeholder="Enter a name for your survey"
            />
          </div>
          
          <div>
            <label htmlFor="survey-description" className="block text-sm font-medium mb-1">
              Description (Optional)
            </label>
            <textarea
              id="survey-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
            onClick={onClose}
            disabled={isSaving}
            className={`px-4 py-2 rounded ${
              isSaving ? 'opacity-50 cursor-not-allowed' : ''
            } ${
              theme === 'dark' 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-4 py-2 rounded ${
              isSaving ? 'opacity-50 cursor-not-allowed' : ''
            } ${
              theme === 'dark'
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isSaving ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : 'Save Survey'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveSurveyModal;