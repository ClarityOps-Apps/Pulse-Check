import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Search, Filter, Plus, X, Edit2 } from 'lucide-react';
import { getAllQuestions, questionCategories, saveCustomQuestion } from '../../data/questionLibrary';
import QuestionEditor from './QuestionEditor';
import SaveOptionsModal from './SaveOptionsModal';

interface QuestionLibraryProps {
  onAddQuestion: (questionId: string) => void;
  selectedQuestionIds: string[];
}

const QuestionLibrary: React.FC<QuestionLibraryProps> = ({ onAddQuestion, selectedQuestionIds }) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [showQuestionEditor, setShowQuestionEditor] = useState(false);
  const [showSaveOptions, setShowSaveOptions] = useState(false);
  const [newQuestionId, setNewQuestionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState(getAllQuestions());
  const [editingQuestion, setEditingQuestion] = useState<any>(null);

  useEffect(() => {
    setQuestions(getAllQuestions());
  }, [showQuestionEditor, showSaveOptions]);

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? question.category === selectedCategory : true;
    const isAvailable = showOnlyAvailable ? !selectedQuestionIds.includes(question.id) : true;
    
    return matchesSearch && matchesCategory && isAvailable;
  });

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const handleSaveQuestion = (question: any) => {
    const savedQuestion = saveCustomQuestion(question);
    
    if (editingQuestion) {
      setQuestions(getAllQuestions());
      setEditingQuestion(null);
    } else {
      setNewQuestionId(savedQuestion.id);
      setShowQuestionEditor(false);
      setShowSaveOptions(true);
    }
  };

  const handleEditQuestion = (question: any) => {
    setEditingQuestion(question);
    setShowQuestionEditor(true);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setShowOnlyAvailable(false);
  };

  const hasFilters = searchTerm || selectedCategory || showOnlyAvailable;

  return (
    <div className={`p-4 rounded-lg ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
    }`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Question Library</h3>
        <button
          onClick={() => {
            setEditingQuestion(null);
            setShowQuestionEditor(true);
          }}
          className={`flex items-center px-3 py-2 rounded ${
            theme === 'dark' 
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          <Plus size={18} className="mr-2" />
          Create Question
        </button>
      </div>
      
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search questions..."
            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 focus:border-indigo-500' 
                : 'border-gray-300 focus:border-indigo-500'
            } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
          />
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Filter size={16} className="mr-2 text-gray-500" />
            <span className="text-sm font-medium">Filters</span>
          </div>
          
          {hasFilters && (
            <button 
              onClick={clearFilters}
              className="text-xs flex items-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X size={14} className="mr-1" />
              Clear all
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-2">
          {questionCategories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.name)}
              className={`text-xs px-3 py-1.5 rounded-full ${
                selectedCategory === category.name
                  ? theme === 'dark'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-indigo-100 text-indigo-800'
                  : theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="show-available"
            checked={showOnlyAvailable}
            onChange={() => setShowOnlyAvailable(!showOnlyAvailable)}
            className="mr-2"
          />
          <label htmlFor="show-available" className="text-xs">
            Show only available questions
          </label>
        </div>
      </div>

      <div className={`max-h-[calc(100vh-400px)] overflow-y-auto rounded-lg ${
        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
      }`}>
        {filteredQuestions.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredQuestions.map((question) => {
              const isSelected = selectedQuestionIds.includes(question.id);
              const isCustomQuestion = question.id.startsWith('custom-');
              
              return (
                <div 
                  key={question.id} 
                  className={`p-4 ${
                    isSelected
                      ? theme === 'dark'
                        ? 'bg-indigo-900/20'
                        : 'bg-indigo-50'
                      : theme === 'dark'
                        ? 'hover:bg-gray-600'
                        : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm mb-1">{question.text}</p>
                      <div className="text-xs text-gray-500">
                        Question Type: <span className="text-gray-700 dark:text-gray-300">
                          {question.type === 'rating' ? 'Rating Scale (1-5)' : question.type}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {isCustomQuestion && (
                        <button
                          onClick={() => handleEditQuestion(question)}
                          className={`p-2 rounded-lg ${
                            theme === 'dark'
                              ? 'hover:bg-gray-500 text-gray-400 hover:text-gray-200'
                              : 'hover:bg-gray-200 text-gray-600 hover:text-gray-800'
                          }`}
                          title="Edit question"
                        >
                          <Edit2 size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => onAddQuestion(question.id)}
                        disabled={isSelected}
                        className={`p-2 rounded-full ${
                          isSelected
                            ? 'opacity-50 cursor-not-allowed'
                            : theme === 'dark'
                              ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                        title={isSelected ? "Already added" : "Add question"}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 text-center">
            <p className="text-sm text-gray-500">No questions match your filters</p>
          </div>
        )}
      </div>

      {showQuestionEditor && (
        <QuestionEditor
          question={editingQuestion}
          onSave={handleSaveQuestion}
          onClose={() => {
            setShowQuestionEditor(false);
            setEditingQuestion(null);
          }}
          isNew={!editingQuestion}
        />
      )}

      {showSaveOptions && newQuestionId && (
        <SaveOptionsModal
          questionId={newQuestionId}
          onAddToSurvey={() => {
            onAddQuestion(newQuestionId);
            setShowSaveOptions(false);
            setNewQuestionId(null);
          }}
          onClose={() => {
            setShowSaveOptions(false);
            setNewQuestionId(null);
          }}
        />
      )}
    </div>
  );
};

export default QuestionLibrary;