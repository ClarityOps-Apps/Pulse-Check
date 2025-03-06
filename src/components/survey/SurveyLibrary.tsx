import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Search, Trash2, HelpCircle } from 'lucide-react';
import surveyService from '../../services/surveyService';
import { Survey } from '../../types/survey';
import DeleteSurveyModal from './DeleteSurveyModal';

interface SurveyLibraryProps {
  onSelectSavedSurvey: (surveyId: string) => void;
  selectedSurveyId?: string;
}

const SurveyLibrary: React.FC<SurveyLibraryProps> = ({ 
  onSelectSavedSurvey,
  selectedSurveyId 
}) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [savedSurveys, setSavedSurveys] = useState<Survey[]>([]);
  const [surveyToDelete, setSurveyToDelete] = useState<Survey | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Load saved surveys from storage
  const loadSavedSurveys = async () => {
    try {
      const surveys = await surveyService.getAllSurveys();
      setSavedSurveys(surveys);
    } catch (error) {
      console.error('Error loading saved surveys:', error);
    }
  };
  
  useEffect(() => {
    loadSavedSurveys();
  }, []);
  
  const filteredSavedSurveys = savedSurveys.filter(survey => 
    survey.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (survey.description && survey.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleDeleteClick = (e: React.MouseEvent, survey: Survey) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    setSurveyToDelete(survey);
  };
  
  const handleConfirmDelete = async () => {
    if (!surveyToDelete) return;
    
    setIsDeleting(true);
    try {
      const success = await surveyService.deleteSurvey(surveyToDelete.id);
      if (success) {
        // Refresh the survey list
        loadSavedSurveys();
      }
    } catch (error) {
      console.error('Error deleting survey:', error);
    } finally {
      setIsDeleting(false);
      setSurveyToDelete(null);
    }
  };
  
  return (
    <div className={`p-4 rounded-lg ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
    }`}>
      <h3 className="text-lg font-semibold mb-4">My Saved Surveys</h3>
      
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search saved surveys..."
            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 focus:border-indigo-500' 
                : 'border-gray-300 focus:border-indigo-500'
            } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
          />
        </div>
      </div>
      
      <div className="space-y-3">
        {filteredSavedSurveys.length > 0 ? (
          filteredSavedSurveys.map((survey) => (
            <div 
              key={survey.id}
              onClick={() => onSelectSavedSurvey(survey.id)}
              className={`p-3 rounded-lg border ${
                selectedSurveyId === survey.id
                  ? theme === 'dark'
                    ? 'border-indigo-500 bg-indigo-900/20'
                    : 'border-indigo-500 bg-indigo-50'
                  : theme === 'dark'
                    ? 'border-gray-700 hover:border-gray-600 hover:bg-gray-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              } cursor-pointer transition-all`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-sm mb-1">{survey.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {survey.description || 'No description provided'}
                  </p>
                  <div className="flex items-center text-xs">
                    <div className="flex items-center">
                      <HelpCircle size={14} className="mr-1" />
                      <span>{survey.questionIds.length} questions</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <button 
                    onClick={(e) => handleDeleteClick(e, survey)}
                    className={`p-2 rounded ${
                      theme === 'dark' 
                        ? 'hover:bg-gray-600 text-gray-400 hover:text-red-400' 
                        : 'hover:bg-gray-200 text-gray-500 hover:text-red-500'
                    }`}
                    title="Delete survey"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">No saved surveys found</p>
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {surveyToDelete && (
        <DeleteSurveyModal
          surveyName={surveyToDelete.name}
          hasResponses={(surveyToDelete.responses || 0) > 0}
          onConfirm={handleConfirmDelete}
          onCancel={() => setSurveyToDelete(null)}
        />
      )}
    </div>
  );
};

export default SurveyLibrary;