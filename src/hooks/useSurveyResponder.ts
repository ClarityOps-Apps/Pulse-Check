import { useState, useEffect } from 'react';
import { Question } from '../types/survey';
import surveyService from '../services/surveyService';

export const useSurveyResponder = (surveyId: string) => {
  const [survey, setSurvey] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Load survey and questions
  useEffect(() => {
    const loadSurvey = async () => {
      try {
        setLoading(true);
        const surveyData = await surveyService.getSurveyById(surveyId);
        
        if (!surveyData) {
          setError('Survey not found');
          return;
        }
        
        setSurvey(surveyData);
        
        // Load questions for this survey
        const questionData = await surveyService.getQuestionsForSurvey(surveyId);
        setQuestions(questionData);
        
      } catch (err) {
        setError('Failed to load survey');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (surveyId) {
      loadSurvey();
    } else {
      setError('Invalid survey ID');
      setLoading(false);
    }
  }, [surveyId]);

  // Handle input change
  const handleInputChange = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Check if current step is complete
  const isStepComplete = () => {
    if (currentStep < questions.length) {
      const question = questions[currentStep];
      return !question?.required || responses[question.id] !== undefined;
    }
    return true;
  };

  // Navigate to next question
  const handleNext = () => {
    if (currentStep < questions.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Navigate to previous question
  const handleBack = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  // Submit survey responses
  const submitResponses = async (metadata?: { isAnonymous: boolean; email?: string; sendCopy?: boolean }) => {
    try {
      setIsSubmitting(true);
      await surveyService.submitSurveyResponse(surveyId, responses, metadata);
      setIsComplete(true);
      return true;
    } catch (err) {
      console.error('Failed to submit survey responses:', err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
    totalSteps: questions.length
  };
};

export default useSurveyResponder;