import { useState, useEffect } from 'react';
import surveyService from '../services/surveyService';

export const useSurveyResults = (surveyId: string) => {
  const [survey, setSurvey] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSurveyResults = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load survey data
        const surveyData = await surveyService.getSurveyById(surveyId);
        
        if (!surveyData) {
          setError('Survey not found');
          return;
        }
        
        setSurvey(surveyData);
        
        // Load analytics data
        const analyticsData = await surveyService.getSurveyAnalytics(surveyId);
        setAnalytics(analyticsData);
        
      } catch (err) {
        console.error('Failed to load survey results:', err);
        setError('Failed to load survey results');
      } finally {
        setLoading(false);
      }
    };
    
    if (surveyId) {
      loadSurveyResults();
    } else {
      setError('Invalid survey ID');
      setLoading(false);
    }
  }, [surveyId]);

  return {
    survey,
    analytics,
    loading,
    error
  };
};

export default useSurveyResults;