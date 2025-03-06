import { useState, useEffect, useCallback } from 'react';
import { Survey } from '../types/survey';
import surveyService from '../services/surveyService';

export const useSurveys = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all surveys
  const loadSurveys = useCallback(async () => {
    try {
      setLoading(true);
      const data = await surveyService.getAllSurveys();
      setSurveys(data);
      setError(null);
    } catch (err) {
      setError('Failed to load surveys');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new survey
  const createSurvey = useCallback(async (surveyData: Partial<Survey>) => {
    try {
      const newSurvey = await surveyService.createSurvey(surveyData);
      setSurveys(prev => [...prev, newSurvey]);
      return newSurvey;
    } catch (err) {
      setError('Failed to create survey');
      console.error(err);
      throw err;
    }
  }, []);

  // Update an existing survey
  const updateSurvey = useCallback(async (id: string, updates: Partial<Survey>) => {
    try {
      const updatedSurvey = await surveyService.updateSurvey(id, updates);
      if (updatedSurvey) {
        setSurveys(prev => 
          prev.map(survey => survey.id === id ? updatedSurvey : survey)
        );
      }
      return updatedSurvey;
    } catch (err) {
      setError('Failed to update survey');
      console.error(err);
      throw err;
    }
  }, []);

  // Delete a survey
  const deleteSurvey = useCallback(async (id: string) => {
    try {
      const success = await surveyService.deleteSurvey(id);
      if (success) {
        setSurveys(prev => prev.filter(survey => survey.id !== id));
      }
      return success;
    } catch (err) {
      setError('Failed to delete survey');
      console.error(err);
      throw err;
    }
  }, []);

  // Publish a survey
  const publishSurvey = useCallback(async (id: string) => {
    try {
      const publishedSurvey = await surveyService.publishSurvey(id);
      if (publishedSurvey) {
        setSurveys(prev => 
          prev.map(survey => survey.id === id ? publishedSurvey : survey)
        );
      }
      return publishedSurvey;
    } catch (err) {
      setError('Failed to publish survey');
      console.error(err);
      throw err;
    }
  }, []);

  // Load surveys on initial render
  useEffect(() => {
    loadSurveys();
  }, [loadSurveys]);

  return {
    surveys,
    loading,
    error,
    loadSurveys,
    createSurvey,
    updateSurvey,
    deleteSurvey,
    publishSurvey
  };
};

export default useSurveys;