import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import useSurveyResponder from '../hooks/useSurveyResponder';

const SurveyResponder = () => {
  const { theme } = useTheme();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [email, setEmail] = useState('');
  const [sendCopy, setSendCopy] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);

  const {
    survey,
    questions,
    responses,
    loading,
    error,
    currentStep,
    isSubmitting,
    isComplete,
    handleInputChange,
    isStepComplete,
    handleNext,
    handleBack,
    submitResponses,
    totalSteps
  } = useSurveyResponder(id || '');

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
          
          // Auto-advance after rating
          if (autoAdvance) {
            setTimeout(() => {
              handleNext();
            }, 500);
          }
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, questions, handleInputChange, handleNext, handleBack, isStepComplete, autoAdvance]);

  const handleInputChangeWithAutoAdvance = (questionId: string, value: any) => {
    handleInputChange(questionId, value);
    
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

  const handleSubmit = async () => {
    const success = await submitResponses({
      isAnonymous,
      email: !isAnonymous ? email : undefined,
      sendCopy: !isAnonymous && sendCopy
    });
    
    if (success) {
      navigate('/thank-you');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className={`p-6 rounded-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
        }`}>
          <h2 className="text-xl font-bold text-red-500 mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className={`p-6 rounded-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
        }`}>
          <h2 className="text-xl font-bold text-red-500 mb-2">Survey Not Found</h2>
          <p>The survey you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  // Calculate progress percentage
  const progressPercentage = totalSteps > 0 
    ? Math.round((currentStep / totalSteps) * 100) 
    : 0;

  const renderQuestion = () => {
    if (currentStep >= questions.length) {
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-medium">Response Options</h2>
          
          <div>
             <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="anonymous">Submit anonymously</label>
            </div>
            
            {!isAnonymous && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`w-full p-2 rounded border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 focus:border-indigo-500' 
                      : 'border-gray-300 focus:border-indigo-500'
                  } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                />
              </div>
            )}
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="sendCopy"
              checked={sendCopy}
              onChange={(e) => setSendCopy(e.target.checked)}
              disabled={isAnonymous}
              className="mr-2"
            />
            <label 
              htmlFor="sendCopy" 
              className={isAnonymous ? 'opacity-50' : ''}
            >
              Send me a copy of my responses
            </label>
          </div>
        </div>
      );
    }

    const question = questions[currentStep];
    
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
                    onClick={() => handleInputChangeWithAutoAdvance(question.id, rating)}
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
                onClick={() => handleInputChangeWithAutoAdvance(question.id, option)}
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
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className={`rounded-lg overflow-hidden ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
        }`}>
          <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h1 className="text-xl font-bold">{survey?.name}</h1>
            <div className="flex items-center">
              <span className="text-sm font-medium mr-3">
                Question {currentStep < totalSteps ? currentStep + 1 : totalSteps} of {totalSteps}
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
              <p className="text-sm opacity-75">Your feedback helps us improve our workplace culture.</p>
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
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${
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
                onClick={currentStep < questions.length ? handleNext : handleSubmit}
                disabled={!isStepComplete() || isSubmitting}
                className={`px-6 py-3 rounded-lg flex items-center transition-colors ${
                  !isStepComplete() || isSubmitting
                    ? 'opacity-50 cursor-not-allowed'
                    : theme === 'dark'
                      ? 'bg-indigo-600 hover:bg-indigo-700'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : currentStep < questions.length ? (
                  <>
                    Next
                    <ChevronRight size={18} className="ml-2" />
                  </>
                ) : 'Submit'}
              </button>
            </div>
          </div>
          
          {/* Keyboard shortcuts hint */}
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
      </div>
    </div>
  );
};

export default SurveyResponder;