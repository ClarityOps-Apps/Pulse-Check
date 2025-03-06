import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { saveCustomQuestion } from '../../data/questionLibrary';
import { questionCategories } from '../../data/questionLibrary';

interface QuestionEditorProps {
  question: {
    id: string;
    text: string;
    type: string;
    required: boolean;
    options?: string[];
    category?: string;
  } | null;
  onSave: (question: any) => void;
  onClose: () => void;
  isNew?: boolean;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({ 
  question, 
  onSave, 
  onClose,
  isNew = false
}) => {
  const { theme } = useTheme();
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState('rating');
  const [isRequired, setIsRequired] = useState(true);
  const [options, setOptions] = useState<string[]>([]);
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (question) {
      setQuestionText(question.text);
      setQuestionType(question.type);
      setIsRequired(question.required);
      setOptions(question.options || []);
      setCategory(question.category || '');
    } else {
      // Default values for new question
      setQuestionText('');
      setQuestionType('rating');
      setIsRequired(true);
      setOptions(['Option 1', 'Option 2', 'Option 3']);
      setCategory('');
    }
  }, [question]);
  
  const handleSave = () => {
    // Validate question text
    if (!questionText.trim()) {
      setError('Question text is required');
      return;
    }
    
    const updatedQuestion = {
      id: question?.id || `new-${Date.now()}`,
      text: questionText,
      type: questionType,
      required: isRequired,
      category: category || undefined,
      ...(questionType === 'multiple-choice' && { options })
    };

    // Save to custom questions store first
    const savedQuestion = saveCustomQuestion(updatedQuestion);
    
    // Then call the onSave callback with the saved question
    onSave(savedQuestion);
  };
  
  const addOption = () => {
    setOptions([...options, `Option ${options.length + 1}`]);
  };
  
  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };
  
  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  // Get all unique categories from the question library
  const allCategories = Array.from(new Set([
    ...questionCategories.map(cat => cat.name),
    'Work Environment',
    'Management Communication',
    'Role Clarity',
    'Talent Management',
    'Trust & Autonomy',
    'Strategic Direction',
    'Management Integrity',
    'Ethics',
    'Leadership',
    'Resources',
    'Recognition',
    'Psychological Safety',
    'Innovation',
    'Employee Voice',
    'Employee Care',
    'Work-Life Balance',
    'Career Growth',
    'Workplace Politics',
    'Diversity & Inclusion',
    'Fairness',
    'Purpose & Meaning',
    'Pride',
    'Commitment',
    'Adaptability',
    'Retention',
    'Collaboration',
    'Engagement',
    'Social Impact',
    'Service Excellence',
    'Culture',
    'Onboarding',
    'Internal Mobility',
    'Leadership Development',
    'Performance Management',
    'Feedback Loop',
    'Manager Feedback',
    'Manager Communication',
    'Workload',
    'Systems & Processes',
    'Accountability',
    'Role Satisfaction',
    'Overall Satisfaction',
    'eNPS',
    'Open Feedback',
    'Improvement Suggestions'
  ])).sort();
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-2xl rounded-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold">
            {isNew ? 'Add New Question' : 'Edit Question'}
          </h3>
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
            <label htmlFor="question-text" className="block text-sm font-medium mb-1">
              Question Text <span className="text-red-500">*</span>
            </label>
            <textarea
              id="question-text"
              value={questionText}
              onChange={(e) => {
                setQuestionText(e.target.value);
                setError('');
              }}
              rows={3}
              className={`w-full p-2 rounded border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 focus:border-indigo-500' 
                  : 'border-gray-300 focus:border-indigo-500'
              } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
              placeholder="Enter your question here..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="question-type" className="block text-sm font-medium mb-1">
                Question Type
              </label>
              <select
                id="question-type"
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 focus:border-indigo-500' 
                    : 'border-gray-300 focus:border-indigo-500'
                } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
              >
                <option value="rating">Rating Scale (1-5)</option>
                <option value="multiple-choice">Multiple Choice</option>
                <option value="text">Text Response</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="question-category" className="block text-sm font-medium mb-1">
                Category
              </label>
              <select
                id="question-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 focus:border-indigo-500' 
                    : 'border-gray-300 focus:border-indigo-500'
                } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
              >
                <option value="">Select a category</option>
                {allCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          
          {questionType === 'multiple-choice' && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Answer Options
              </label>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      className={`flex-1 p-2 rounded border ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 focus:border-indigo-500' 
                          : 'border-gray-300 focus:border-indigo-500'
                      } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                    />
                    <button 
                      onClick={() => removeOption(index)}
                      disabled={options.length <= 2}
                      className={`p-1.5 rounded ${
                        options.length <= 2
                          ? 'opacity-50 cursor-not-allowed'
                          : theme === 'dark'
                            ? 'hover:bg-gray-700 text-red-400'
                            : 'hover:bg-gray-100 text-red-500'
                      }`}
                      title="Remove option"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                
                <button 
                  onClick={addOption}
                  className={`flex items-center text-sm mt-2 ${
                    theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                  }`}
                >
                  <Plus size={16} className="mr-1" />
                  <span>Add Option</span>
                </button>
              </div>
            </div>
          )}
          
          {questionType === 'rating' && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Rating Scale Preview
              </label>
              <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="text-sm">Not Satisfied</div>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <div 
                      key={num} 
                      className={`w-8 h-8 flex items-center justify-center rounded-full ${
                        theme === 'dark' 
                          ? 'bg-gray-600' 
                          : 'bg-gray-200'
                      }`}
                    >
                      {num}
                    </div>
                  ))}
                </div>
                <div className="text-sm">Very Satisfied</div>
              </div>
            </div>
          )}
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="required"
              checked={isRequired}
              onChange={(e) => setIsRequired(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="required" className="text-sm">
              Required question
            </label>
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
            {isNew ? 'Add Question' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionEditor;