import { Survey, SurveyResponse } from '../../types/survey';

// Keys for localStorage
const KEYS = {
  SURVEYS: 'pulsecheck_surveys',
  RESPONSES: 'pulsecheck_responses',
  USER_SETTINGS: 'pulsecheck_settings',
  DEPARTMENTS: 'pulsecheck_departments'
};

// LocalStorage Service
export const localStorageService = {
  // Survey Methods
  getSurveys: (): Survey[] => {
    try {
      const surveys = localStorage.getItem(KEYS.SURVEYS);
      return surveys ? JSON.parse(surveys) : [];
    } catch (error) {
      console.error('Error getting surveys from localStorage:', error);
      return [];
    }
  },

  saveSurvey: (survey: Survey): Survey => {
    try {
      const surveys = localStorageService.getSurveys();
      const existingSurveyIndex = surveys.findIndex(s => s.id === survey.id);
      
      if (existingSurveyIndex >= 0) {
        // Update existing survey
        surveys[existingSurveyIndex] = {
          ...surveys[existingSurveyIndex],
          ...survey,
          lastModified: new Date().toISOString()
        };
      } else {
        // Add new survey
        surveys.push({
          ...survey,
          id: survey.id || `survey-${Date.now()}`,
          created: new Date().toISOString(),
          lastModified: new Date().toISOString()
        });
      }
      
      localStorage.setItem(KEYS.SURVEYS, JSON.stringify(surveys));
      return survey;
    } catch (error) {
      console.error('Error saving survey to localStorage:', error);
      throw error;
    }
  },

  getSurveyById: (id: string): Survey | null => {
    try {
      const surveys = localStorageService.getSurveys();
      return surveys.find(survey => survey.id === id) || null;
    } catch (error) {
      console.error('Error getting survey by ID from localStorage:', error);
      return null;
    }
  },

  deleteSurvey: (id: string): boolean => {
    try {
      const surveys = localStorageService.getSurveys();
      const filteredSurveys = surveys.filter(survey => survey.id !== id);
      
      if (filteredSurveys.length < surveys.length) {
        localStorage.setItem(KEYS.SURVEYS, JSON.stringify(filteredSurveys));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting survey from localStorage:', error);
      return false;
    }
  },

  // Survey Response Methods
  getSurveyResponses: (surveyId: string): SurveyResponse[] => {
    try {
      const allResponses = localStorage.getItem(KEYS.RESPONSES);
      const responses = allResponses ? JSON.parse(allResponses) : {};
      return responses[surveyId] || [];
    } catch (error) {
      console.error('Error getting survey responses from localStorage:', error);
      return [];
    }
  },

  saveSurveyResponse: (surveyId: string, response: SurveyResponse): SurveyResponse => {
    try {
      const allResponses = localStorage.getItem(KEYS.RESPONSES);
      const responses = allResponses ? JSON.parse(allResponses) : {};
      
      // Initialize array for this survey if it doesn't exist
      if (!responses[surveyId]) {
        responses[surveyId] = [];
      }
      
      // Add response with metadata
      const newResponse = {
        ...response,
        id: response.id || `response-${Date.now()}`,
        surveyId,
        submittedAt: new Date().toISOString()
      };
      
      responses[surveyId].push(newResponse);
      localStorage.setItem(KEYS.RESPONSES, JSON.stringify(responses));
      
      // Update survey response count
      const surveys = localStorageService.getSurveys();
      const surveyIndex = surveys.findIndex(s => s.id === surveyId);
      
      if (surveyIndex >= 0) {
        const currentResponses = surveys[surveyIndex].responses || 0;
        surveys[surveyIndex].responses = currentResponses + 1;
        localStorage.setItem(KEYS.SURVEYS, JSON.stringify(surveys));
      }
      
      return newResponse;
    } catch (error) {
      console.error('Error saving survey response to localStorage:', error);
      throw error;
    }
  },

  // Department Methods
  getDepartments: () => {
    try {
      const departments = localStorage.getItem(KEYS.DEPARTMENTS);
      return departments ? JSON.parse(departments) : {};
    } catch (error) {
      console.error('Error getting departments from localStorage:', error);
      return {};
    }
  },

  // User Settings
  getUserSettings: (): Record<string, any> => {
    try {
      const settings = localStorage.getItem(KEYS.USER_SETTINGS);
      return settings ? JSON.parse(settings) : {};
    } catch (error) {
      console.error('Error getting user settings from localStorage:', error);
      return {};
    }
  },

  saveUserSettings: (settings: Record<string, any>): Record<string, any> => {
    try {
      const currentSettings = localStorageService.getUserSettings();
      const updatedSettings = { ...currentSettings, ...settings };
      localStorage.setItem(KEYS.USER_SETTINGS, JSON.stringify(updatedSettings));
      return updatedSettings;
    } catch (error) {
      console.error('Error saving user settings to localStorage:', error);
      throw error;
    }
  }
};

export default localStorageService;