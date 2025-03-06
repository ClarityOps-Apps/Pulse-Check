import React from 'react';
import { Trash2, GripVertical, AlertCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface QuestionCardProps {
  question: {
    id: string;
    text: string;
    type: string;
    required: boolean;
    category?: string;
    options?: string[];
  };
  index: number;
  onRemove: (id: string) => void;
  onToggleRequired: (id: string) => void;
  onEdit: (id: string) => void;
  isDragging?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question, 
  index, 
  onRemove, 
  onToggleRequired,
  onEdit,
  isDragging = false 
}) => {
  const { theme } = useTheme();

  // Helper function to get question type display text
  const getQuestionTypeText = (type: string) => {
    switch (type) {
      case 'rating':
        return 'Rating Scale (1-5)';
      case 'multiple-choice':
        return 'Multiple Choice';
      case 'text':
        return 'Text Response';
      default:
        return type;
    }
  };
  
  return (
    <div 
      className={`p-4 mb-3 rounded-lg border ${
        isDragging 
          ? 'border-indigo-500 shadow-lg' 
          : theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200 shadow-sm'
      } transition-all`}
    >
      <div className="flex items-start">
        <div className="mr-3 mt-1 cursor-move">
          <GripVertical size={18} className="text-gray-400" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-2">
              Q{index + 1}
            </span>
            <div className="flex items-center">
              <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                Question Type:
              </span>
              <span className={`text-xs px-2 py-1 rounded ${
                question.type === 'rating' 
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                  : question.type === 'multiple-choice'
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              }`}>
                {getQuestionTypeText(question.type)}
              </span>
            </div>
            {question.category && (
              <span className="ml-2 text-xs px-2 py-1 rounded bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                {question.category}
              </span>
            )}
          </div>
          
          <p className="text-sm font-medium mb-3">{question.text}</p>
          
          {question.type === 'rating' && (
            <div className="flex items-center space-x-1 mb-3">
              {[1, 2, 3, 4, 5].map((num) => (
                <div 
                  key={num} 
                  className={`w-6 h-6 flex items-center justify-center text-xs rounded ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}
                >
                  {num}
                </div>
              ))}
            </div>
          )}
          
          {question.type === 'multiple-choice' && question.options && (
            <div className="space-y-1 mb-3">
              {question.options.map((option, i) => (
                <div 
                  key={i} 
                  className={`text-xs p-2 rounded ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
          
          {question.type === 'text' && (
            <div className={`h-8 rounded mb-3 ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
            </div>
          )}

          <div className="flex items-center mt-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={question.required}
                onChange={() => onToggleRequired(question.id)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                Required question
              </span>
            </label>
          </div>
        </div>
        
        <div className="flex flex-col space-y-2 ml-2">
          <button 
            onClick={() => onEdit(question.id)}
            className={`p-1.5 rounded ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
            title="Edit question"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
              <path d="m15 5 4 4"/>
            </svg>
          </button>
          
          <button 
            onClick={() => onRemove(question.id)}
            className={`p-1.5 rounded ${
              theme === 'dark' ? 'hover:bg-gray-700 text-gray-400 hover:text-red-400' : 'hover:bg-gray-100 text-gray-500 hover:text-red-500'
            }`}
            title="Remove question"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;