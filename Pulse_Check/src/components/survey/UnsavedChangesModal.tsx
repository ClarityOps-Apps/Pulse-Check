import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface UnsavedChangesModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({ 
  onConfirm, 
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
            <AlertTriangle size={20} className="text-yellow-500 mr-2" />
            <h3 className="text-lg font-semibold">Unsaved Changes</h3>
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
          <p>
            You have unsaved changes to your template. If you leave without adding it to your library, your progress will be lost.
          </p>
          
          <div className={`p-3 rounded-lg ${
            theme === 'dark' ? 'bg-yellow-900/20 border border-yellow-800' : 'bg-yellow-50 border border-yellow-100'
          }`}>
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              <strong>Note:</strong> To save your work, click "Add Template" to add it to your library.
            </p>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded ${
              theme === 'dark' 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Go Back
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
          >
            Discard Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnsavedChangesModal;