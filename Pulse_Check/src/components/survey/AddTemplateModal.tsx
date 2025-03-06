import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface AddTemplateModalProps {
  onConfirm: (name: string, description: string) => void;
  onClose: () => void;
  initialTitle?: string;
  initialDescription?: string;
}

const AddTemplateModal: React.FC<AddTemplateModalProps> = ({ 
  onConfirm, 
  onClose,
  initialTitle = '',
  initialDescription = ''
}) => {
  const { theme } = useTheme();
  const [name, setName] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [error, setError] = useState('');
  
  const handleSave = () => {
    if (!name.trim()) {
      setError('Template name is required');
      return;
    }
    
    onConfirm(name, description);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-md rounded-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold">Add Template</h3>
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
            <label htmlFor="template-name" className="block text-sm font-medium mb-1">
              Template Name <span className="text-red-500">*</span>
            </label>
            <input
              id="template-name"
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
              placeholder="Enter a name for your template"
            />
          </div>
          
          <div>
            <label htmlFor="template-description" className="block text-sm font-medium mb-1">
              Description (Optional)
            </label>
            <textarea
              id="template-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={`w-full p-2 rounded border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 focus:border-indigo-500' 
                  : 'border-gray-300 focus:border-indigo-500'
              } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
              placeholder="Briefly describe the purpose of this template"
            />
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
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`px-4 py-2 rounded ${
              theme === 'dark'
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            Add Template
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTemplateModal;