import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Save, Eye, Settings } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import QuestionEditor from '../components/survey/QuestionEditor';
import QuestionCard from '../components/survey/QuestionCard';
import QuestionLibrary from '../components/survey/QuestionLibrary';
import SurveyTemplates from '../components/survey/SurveyTemplates';
import SurveyLibrary from '../components/survey/SurveyLibrary';
import SaveSurveyModal from '../components/survey/SaveSurveyModal';
import AddTemplateModal from '../components/survey/AddTemplateModal';
import UnsavedChangesModal from '../components/survey/UnsavedChangesModal';
import SurveyPreview from '../components/survey/SurveyPreview';
import PublishConfirmationModal from '../components/survey/PublishConfirmationModal';
import SaveSurveyOptionsModal from '../components/survey/SaveSurveyOptionsModal';
import { Question } from '../types/survey';
import surveyService from '../services/surveyService';
import templateService from '../services/templateService';
import { getQuestionById } from '../data/questionLibrary';

const SurveyCreator = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  // Tab state
  const [activeMainTab, setActiveMainTab] = useState<'build' | 'preview' | 'settings'>('build');
  const [activeSubTab, setActiveSubTab] = useState<'templates' | 'library' | 'questions'>('templates');
  
  // State for survey details
  const [surveyName, setSurveyName] = useState('');
  const [surveyDescription, setSurveyDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  
  // State for question editing
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isNewQuestion, setIsNewQuestion] = useState(false);
  
  // State for template management
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showAddTemplateModal, setShowAddTemplateModal] = useState(false);
  const [templateRefreshTrigger, setTemplateRefreshTrigger] = useState(0);
  
  // State for survey management
  const [selectedSavedSurvey, setSelectedSavedSurvey] = useState<string | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveOptions, setShowSaveOptions] = useState(false);
  
  // State for preview
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishedSurveyId, setPublishedSurveyId] = useState<string | null>(null);

  // Handle adding template to library
  const handleAddToLibrary = async (templateId: string) => {
    try {
      const template = await templateService.getTemplateById(templateId);
      if (template) {
        // Create a new survey from the template
        const surveyData = {
          name: template.name,
          description: template.description,
          questionIds: template.questionIds,
          status: 'draft'
        };
        
        const savedSurvey = await surveyService.createSurvey(surveyData);
        if (savedSurvey) {
          // Switch to library tab to show the newly added survey
          setActiveSubTab('library');
        }
      }
    } catch (error) {
      console.error('Error adding template to library:', error);
    }
  };

  // Handle save options
  const handleSaveAsTemplate = async () => {
    setShowSaveOptions(false);
    setShowAddTemplateModal(true);
  };

  const handleSaveToLibrary = async () => {
    setShowSaveOptions(false);
    setShowSaveModal(true);
  };

  const handleSaveBoth = async () => {
    setShowSaveOptions(false);
    setIsSaving(true);
    
    try {
      // First save as template
      const templateData = {
        name: surveyName,
        description: surveyDescription,
        questionIds: selectedQuestionIds
      };
      
      await templateService.createTemplate(templateData);
      
      // Then save to library
      await surveyService.createSurvey({
        ...templateData,
        status: 'draft'
      });
      
      // Clear form and show success message
      setSurveyName('');
      setSurveyDescription('');
      setSelectedQuestionIds([]);
      setQuestions([]);
      
      // Switch to library tab to show the saved survey
      setActiveSubTab('library');
      
    } catch (error) {
      console.error('Error saving survey:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Update the save button click handler
  const handleSaveClick = () => {
    setShowSaveOptions(true);
  };

  // Load template questions when selected
  useEffect(() => {
    const loadTemplateQuestions = async () => {
      if (selectedTemplate) {
        const template = await templateService.getTemplateById(selectedTemplate);
        if (template) {
          const templateQuestions = template.questionIds
            .map(id => getQuestionById(id))
            .filter(q => q !== undefined) as Question[];
          
          setQuestions(templateQuestions);
          setSelectedQuestionIds(template.questionIds);
          setSurveyName(template.name);
          setSurveyDescription(template.description);
        }
      }
    };
    
    loadTemplateQuestions();
  }, [selectedTemplate]);
  
  // Load saved survey when selected
  useEffect(() => {
    const loadSavedSurvey = async () => {
      if (selectedSavedSurvey) {
        const survey = await surveyService.getSurveyById(selectedSavedSurvey);
        if (survey) {
          const surveyQuestions = await surveyService.getQuestionsForSurvey(survey.id);
          setQuestions(surveyQuestions);
          setSelectedQuestionIds(survey.questionIds);
          setSurveyName(survey.name);
          setSurveyDescription(survey.description || '');
        }
      }
    };
    
    loadSavedSurvey();
  }, [selectedSavedSurvey]);

  // Event handlers
  const handleAddQuestion = (questionId: string) => {
    const question = getQuestionById(questionId);
    if (question) {
      setQuestions(prev => [...prev, question]);
      setSelectedQuestionIds(prev => [...prev, questionId]);
    }
  };
  
  const handleRemoveQuestion = (questionId: string) => {
    setQuestions(prev => prev.filter(q => q.id !== questionId));
    setSelectedQuestionIds(prev => prev.filter(id => id !== questionId));
  };
  
  const handleEditQuestion = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      setEditingQuestion(question);
      setIsNewQuestion(false);
    }
  };
  
  const handleSaveQuestion = (updatedQuestion: Question) => {
    if (isNewQuestion) {
      setQuestions(prev => [...prev, updatedQuestion]);
      setSelectedQuestionIds(prev => [...prev, updatedQuestion.id]);
    } else {
      setQuestions(prev => 
        prev.map(q => q.id === updatedQuestion.id ? updatedQuestion : q)
      );
    }
    setEditingQuestion(null);
    setIsNewQuestion(false);
  };
  
  const handleToggleRequired = (questionId: string) => {
    setQuestions(prev => 
      prev.map(q => 
        q.id === questionId ? { ...q, required: !q.required } : q
      )
    );
  };
  
  const handleSaveSurvey = async (name: string, description: string) => {
    setIsSaving(true);
    try {
      const surveyData = {
        name,
        description,
        questionIds: selectedQuestionIds,
        status: 'draft'
      };
      
      const savedSurvey = await surveyService.createSurvey(surveyData);
      if (savedSurvey) {
        setShowSaveModal(false);
        // Clear form
        setSurveyName('');
        setSurveyDescription('');
        setSelectedQuestionIds([]);
        setQuestions([]);
        // Switch to library tab
        setActiveSubTab('library');
      }
    } catch (error) {
      console.error('Error saving survey:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSaveTemplate = async (name: string, description: string) => {
    try {
      const templateData = {
        name,
        description,
        questionIds: selectedQuestionIds
      };
      
      const savedTemplate = await templateService.createTemplate(templateData);
      if (savedTemplate) {
        setShowAddTemplateModal(false);
        setTemplateRefreshTrigger(prev => prev + 1);
        // Clear form
        setSurveyName('');
        setSurveyDescription('');
        setSelectedQuestionIds([]);
        setQuestions([]);
        // Switch to templates tab
        setActiveSubTab('templates');
      }
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };
  
  const handlePublishSurvey = async () => {
    setIsSaving(true);
    try {
      const surveyData = {
        name: surveyName,
        description: surveyDescription,
        questionIds: selectedQuestionIds,
        status: 'active'
      };
      
      const publishedSurvey = await surveyService.createSurvey(surveyData);
      if (publishedSurvey) {
        setPublishedSurveyId(publishedSurvey.id);
        setShowPublishModal(true);
      }
    } catch (error) {
      console.error('Error publishing survey:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderMainTabs = () => (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="-mb-px flex space-x-8">
        {[
          { id: 'build', label: 'Build' },
          { id: 'preview', label: 'Preview' },
          { id: 'settings', label: 'Settings' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveMainTab(tab.id as any)}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeMainTab === tab.id
                ? theme === 'dark'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-indigo-500 text-indigo-600'
                : theme === 'dark'
                  ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );

  const renderSubTabs = () => (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="-mb-px flex space-x-8">
        {[
          { id: 'templates', label: 'Templates' },
          { id: 'library', label: 'Library' },
          { id: 'questions', label: 'Questions' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeSubTab === tab.id
                ? theme === 'dark'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-indigo-500 text-indigo-600'
                : theme === 'dark'
                  ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );

  return (
    <div>
      <div className="sticky top-0 bg-gray-50 dark:bg-gray-900 z-30 pb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Create Survey</h1>
            <p className="text-gray-500 dark:text-gray-400">Design your survey using the tools below</p>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleSaveClick}
              className={`px-4 py-2 rounded-lg flex items-center ${
                theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              <Save size={18} className="mr-2" />
              Save
            </button>
            
            <button
              onClick={handlePublishSurvey}
              disabled={questions.length === 0 || isSaving}
              className={`px-4 py-2 rounded-lg flex items-center ${
                questions.length === 0 || isSaving
                  ? 'opacity-50 cursor-not-allowed'
                  : theme === 'dark'
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Publishing...
                </>
              ) : 'Publish Survey'}
            </button>
          </div>
        </div>

        {renderMainTabs()}
        {activeMainTab === 'build' && renderSubTabs()}
      </div>

      <div className="mt-6">
        {activeMainTab === 'preview' ? (
          <SurveyPreview
            questions={questions}
            title={surveyName || 'Untitled Survey'}
            description={surveyDescription}
            onFinishPreview={() => setActiveMainTab('build')}
          />
        ) : activeMainTab === 'settings' ? (
          <div className={`p-6 rounded-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
          }`}>
            <h2 className="text-lg font-semibold mb-6">Survey Settings</h2>
            {/* Add settings content here */}
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-4">
              {activeSubTab === 'templates' && (
                <div className="sticky top-[196px]">
                  <SurveyTemplates
                    onSelectTemplate={setSelectedTemplate}
                    selectedTemplate={selectedTemplate}
                    onAddToLibrary={handleAddToLibrary}
                    refreshTrigger={templateRefreshTrigger}
                  />
                </div>
              )}
              
              {activeSubTab === 'library' && (
                <div className="sticky top-[196px]">
                  <SurveyLibrary
                    onSelectSavedSurvey={setSelectedSavedSurvey}
                    selectedSurveyId={selectedSavedSurvey}
                  />
                </div>
              )}
              
              {activeSubTab === 'questions' && (
                <div className="sticky top-[196px]">
                  <QuestionLibrary
                    onAddQuestion={handleAddQuestion}
                    selectedQuestionIds={selectedQuestionIds}
                  />
                </div>
              )}
            </div>
            
            <div className="col-span-8 space-y-6">
              <div className={`p-6 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
              }`}>
                <div className="mb-6">
                  <label htmlFor="survey-name" className="block text-sm font-medium mb-1">
                    {activeSubTab === 'templates' ? 'Survey Template Name' : 'Survey Name'}
                  </label>
                  <input
                    id="survey-name"
                    type="text"
                    value={surveyName}
                    onChange={(e) => setSurveyName(e.target.value)}
                    placeholder={activeSubTab === 'templates' ? 'Enter template name' : 'Enter survey name'}
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
                    placeholder={activeSubTab === 'templates' ? 'Enter template description' : 'Enter survey description'}
                    className={`w-full p-2 rounded border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 focus:border-indigo-500' 
                        : 'border-gray-300 focus:border-indigo-500'
                    } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                  />
                </div>
              </div>
              
              <div className={`p-6 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
              }`}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">Survey Questions</h2>
                  <button
                    onClick={() => {
                      setEditingQuestion(null);
                      setIsNewQuestion(true);
                    }}
                    className={`flex items-center px-3 py-2 rounded ${
                      theme === 'dark' 
                        ? 'bg-gray-700 hover:bg-gray-600' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <PlusCircle size={18} className="mr-2" />
                    Add Question
                  </button>
                </div>
                
                <div className="space-y-4 max-h-[calc(100vh-500px)] overflow-y-auto">
                  {questions.length > 0 ? (
                    questions.map((question, index) => (
                      <QuestionCard
                        key={question.id}
                        question={question}
                        index={index}
                        onRemove={handleRemoveQuestion}
                        onToggleRequired={handleToggleRequired}
                        onEdit={handleEditQuestion}
                      />
                    ))
                  ) : (
                    <div className={`p-8 text-center rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                      <p className="text-gray-500 dark:text-gray-400">
                        No questions added yet. Add questions manually or select from the library.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {(editingQuestion !== null || isNewQuestion) && (
        <QuestionEditor
          question={editingQuestion}
          onSave={handleSaveQuestion}
          onClose={() => {
            setEditingQuestion(null);
            setIsNewQuestion(false);
          }}
          isNew={isNewQuestion}
        />
      )}
      
      {showSaveModal && (
        <SaveSurveyModal
          onSave={handleSaveSurvey}
          onClose={() => setShowSaveModal(false)}
          initialTitle={surveyName}
          initialDescription={surveyDescription}
          isSaving={isSaving}
        />
      )}
      
      {showAddTemplateModal && (
        <AddTemplateModal
          onConfirm={handleSaveTemplate}
          onClose={() => setShowAddTemplateModal(false)}
          initialTitle={surveyName}
          initialDescription={surveyDescription}
        />
      )}
      
      {showUnsavedChangesModal && (
        <UnsavedChangesModal
          onConfirm={() => {
            setShowUnsavedChangesModal(false);
            setSelectedTemplate(null);
          }}
          onClose={() => setShowUnsavedChangesModal(false)}
        />
      )}
      
      {showPublishModal && publishedSurveyId && (
        <PublishConfirmationModal
          surveyId={publishedSurveyId}
          surveyName={surveyName}
          onClose={() => {
            setShowPublishModal(false);
            navigate(`/results/${publishedSurveyId}`);
          }}
        />
      )}

      {showSaveOptions && (
        <SaveSurveyOptionsModal
          onSaveAsTemplate={handleSaveAsTemplate}
          onSaveToLibrary={handleSaveToLibrary}
          onSaveBoth={handleSaveBoth}
          onClose={() => setShowSaveOptions(false)}
        />
      )}
    </div>
  );
};

export default SurveyCreator;