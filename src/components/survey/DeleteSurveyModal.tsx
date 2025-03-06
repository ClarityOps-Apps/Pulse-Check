import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface DeleteSurveyModalProps {
  surveyName: string;
  onConfirm: () => void;
  onCancel: () => void;
  hasResponses: boolean;
}

const DeleteSurveyModal: React.FC<DeleteSurveyModalProps> = ({ 
  surveyName, 
  onConfirm, 
  onCancel,
  hasResponses
}) => {
  const { theme } = useTheme();
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-md rounded-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <AlertTriangle size={20} className="text-red-500 mr-2" />
            <h3 className="text-lg font-semibold">Delete Survey</h3>
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
          <p>
            Are you sure you want to delete <strong>"{surveyName}"</strong>?
          </p>
          
          <div className={`p-3 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <p className="text-sm">
              <strong>Warning:</strong> This action cannot be undone. The survey will be permanently deleted.
              {hasResponses && (
                <span className="block mt-2">
                  Note: Survey response data and analytics will be retained for reporting purposes.
                </span>
              )}
            </p>
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
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
          >
            Delete Survey
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteSurveyModal;