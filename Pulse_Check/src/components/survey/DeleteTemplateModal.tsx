import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface DeleteTemplateModalProps {
  templateName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteTemplateModal: React.FC<DeleteTemplateModalProps> = ({ 
  templateName, 
  onConfirm, 
  onCancel
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
            <h3 className="text-lg font-semibold">Delete Template</h3>
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
            Are you sure you want to delete <strong>"{templateName}"</strong>?
          </p>
          
          <div className={`p-3 rounded-lg ${
            theme === 'dark' ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-100'
          }`}>
            <p className="text-sm text-red-600 dark:text-red-400">
              <strong>Warning:</strong> This action cannot be undone. The template will be permanently deleted.
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
            Delete Template
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTemplateModal;