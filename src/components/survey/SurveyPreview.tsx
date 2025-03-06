import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { getQuestionsByIds } from '../../data/questionLibrary';
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Question } from '../../types/survey';

interface SurveyPreviewProps {
  questionIds?: string[];
  questions?: Question[];
  title: string;
  description: string;
  onFinishPreview?: () => void;
}

const SurveyPreview: React.FC<SurveyPreviewProps> = ({ 
  questionIds, 
  questions: providedQuestions,
  title, 
  description,
  onFinishPreview
}) => {
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [autoAdvance, setAutoAdvance] = useState(true);
  
  // Use either provided questions or get them from IDs
  const questions = providedQuestions || (questionIds ? getQuestionsByIds(questionIds) : []);
  const totalQuestions = questions.length;
  
  const handleInputChange = (questionId: string, value: any) => {
    const updatedResponses = {
      ...responses,
      [questionId]: value
    };
    
    setResponses(updatedResponses);
    
    // Auto-advance to next question for rating and multiple-choice questions
    if (autoAdvance && currentStep < questions.length) {
      const currentQuestion = questions[currentStep];
      if (currentQuestion && (currentQuestion.type === 'rating' || currentQuestion.type === 'multiple-choice')) {
        setTimeout(() => {
          handleNext();
        }, 500); // Small delay for better UX
      }
    }
  };

  const isStepComplete = () => {
    if (currentStep < questions.length) {
      const question = questions[currentStep];
      return !question?.required || responses[question.id] !== undefined;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep < questions.length) {
      setCurrentStep(currentStep + 1);
    }
   };

  const handleBack = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };
  
  const handleFinish = () => {
    // Reset the preview state
    setCurrentStep(0);
    setResponses({});
    
    // Call the onFinishPreview callback if provided
    if (onFinishPreview) {
      onFinishPreview();
    }
  };
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && isStepComplete()) {
        handleNext();
      } else if (e.key === 'ArrowLeft' && currentStep > 0) {
        handleBack();
      } else if (e.key >= '1' && e.key <= '5') {
        const currentQuestion = questions[currentStep];
        if (currentQuestion && currentQuestion.type === 'rating') {
          handleInputChange(currentQuestion.id, parseInt(e.key));
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, isStepComplete, questions]);
  
  // Progress percentage calculation
  const progressPercentage = totalQuestions > 0 
    ? Math.round((currentStep / totalQuestions) * 100) 
    : 0;
  
  const renderQuestion = () => {
    if (currentStep >= questions.length) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className={`p-4 rounded-full mb-6 ${
            theme === 'dark' ? 'bg-green-900' : 'bg-green-100'
          }`}>
            <CheckCircle size={48} className={theme === 'dark' ? 'text-green-400' : 'text-green-600'} />
          </div>
          <h2 className="text-2xl font-bold mb-3">Preview Complete</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
            This is the end of the survey preview. In a real survey, respondents would see a thank you page.
          </p>
        </div>
      );
    }

    const question = questions[currentStep];
    if (!question) return null;
    
    return (
      <div>
        <h2 className="text-xl font-medium leading-relaxed mb-8">
          {question.text ? question.text : "No question text provided"}
        </h2>
        
        {question.type === 'rating' && (
          <div className="my-10">
            <div className="flex flex-col items-center">
              <div className="flex space-x-8 mb-4">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleInputChange(question.id, rating)}
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-lg transition-all ${
                      responses[question.id] === rating
                        ? 'bg-indigo-600 text-white scale-110 shadow-md'
                        : theme === 'dark'
                          ? 'bg-gray-700 hover:bg-gray-600'
                          : 'bg-gray-100 hover:bg-gray-200 hover:scale-105'
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
              <div className="flex justify-between w-full px-3 mt-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Not Satisfied</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">Very Satisfied</span>
              </div>
            </div>
          </div>
        )}
        
        {question.type === 'multiple-choice' && question.options && (
          <div className="space-y-3 my-8">
            {question.options.map((option, index) => (
              <div 
                key={index}
                onClick={() => handleInputChange(question.id, option)}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  responses[question.id] === option
                    ? 'bg-indigo-600 text-white shadow-md'
                    : theme === 'dark'
                      ? 'bg-gray-700 hover:bg-gray-600'
                      : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${
                    responses[question.id] === option
                      ? 'bg-white'
                      : theme === 'dark'
                        ? 'border border-gray-500'
                        : 'border border-gray-400'
                  }`}>
                    {responses[question.id] === option && (
                      <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {question.type === 'text' && (
          <div className="my-8">
            <textarea
              value={responses[question.id] || ''}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              placeholder="Type your answer here..."
              rows={5}
              className={`w-full p-4 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 focus:border-indigo-500' 
                  : 'border-gray-300 focus:border-indigo-500'
              } focus:outline-none focus:ring-1 focus:ring-indigo-500 text-base`}
            />
          </div>
        )}
      </div>
    );
  };
  
  const currentQuestion = currentStep < questions.length ? questions[currentStep] : null;
  const isRequired = currentQuestion?.required || false;
  
  return (
    <div className={`rounded-lg overflow-hidden relative ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
    }`}>
      <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Survey Preview</h3>
        <div className="flex items-center">
          <span className="text-sm font-medium mr-3">
            Question {currentStep < totalQuestions ? currentStep + 1 : totalQuestions} of {totalQuestions}
          </span>
          <span className={`px-2 py-0.5 text-xs rounded-full ${
            theme === 'dark' ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-100 text-indigo-800'
          }`}>
            {progressPercentage}% Complete
          </span>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700">
        <div 
          className="h-full bg-indigo-600 transition-all duration-300 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      <div className="px-10 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">
            {title || 'Untitled Survey'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {description || 'No description provided.'}
          </p>
        </div>
        
        {/* Question content */}
        <div className="min-h-[350px] flex flex-col justify-center">
          {renderQuestion()}
        </div>
        
        {/* Auto-advance toggle */}
        <div className="flex items-center justify-end">
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={autoAdvance}
                onChange={() => setAutoAdvance(!autoAdvance)}
              />
              <div className={`block w-10 h-6 rounded-full transition-colors ${
                autoAdvance 
                  ? theme === 'dark' 
                    ? 'bg-indigo-700' 
                    : 'bg-indigo-500'
                  : theme === 'dark' 
                    ? 'bg-gray-700' 
                    : 'bg-gray-300'
              }`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${
                autoAdvance ? 'transform translate-x-4' : ''
              }`}></div>
            </div>
            <div className="ml-3 text-sm font-medium">
              Auto-advance after selection
            </div>
          </label>
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-between mt-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`px-6 py-3 rounded-lg flex items-center transition-colors ${
              currentStep === 0
                ? 'opacity-50 cursor-not-allowed'
                : theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            <ChevronLeft size={18} className="mr-2" />
            Back
          </button>
          
          {/* Required message - centered between buttons */}
          {isRequired && (
            <div className="flex items-center">
              <p className="text-sm text-red-500">
                * This question is required
              </p>
            </div>
          )}
          
          <button
            onClick={currentStep < questions.length ? handleNext : handleFinish}
            disabled={!isStepComplete()}
            className={`px-6 py-3 rounded-lg flex items-center transition-colors ${
              !isStepComplete()
                ? 'opacity-50 cursor-not-allowed'
                : theme === 'dark'
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {currentStep < questions.length ? (
              <>
                Next
                <ChevronRight size={18} className="ml-2" />
              </>
            ) : 'Finish Preview'}
          </button>
        </div>
      </div>
      
      {/* Floating navigation buttons for rating questions */}
      {currentStep < questions.length && questions[currentStep]?.type === 'rating' && (
        <div className="fixed bottom-8 right-8 flex space-x-2">
          <div className={`p-2 text-xs rounded ${
            theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
          }`}>
            Keyboard: Use 1-5 to rate, ← → to navigate
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyPreview;