import { Survey, SurveyResponse, Question } from '../types/survey';
import localStorageService from './storage/localStorage';
import { standardQuestions, getQuestionById } from '../data/questionLibrary';
import { format, subDays } from 'date-fns';

interface AnalyticsResult {
  totalResponses: number;
  totalQuestions: number;
  responseRate: number;
  departmentAnalytics: {
    [department: string]: {
      responses: number;
      participationRate: number;
      totalEmployees: number;
    };
  };
  categoryDistribution: {
    [category: string]: {
      questions: number;
      averageRating?: number;
      totalResponses: number;
    };
  };
  questionAnalytics: {
    [questionId: string]: {
      type: string;
      results: any[];
      average?: number;
      responses?: string[];
      category?: string;
    };
  };
  trends: {
    daily: Array<{
      date: string;
      responses: number;
    }>;
  };
}

export const surveyService = {
  getAllSurveys: async (): Promise<Survey[]> => {
    const surveys = localStorageService.getSurveys();
    
    return surveys.map(survey => ({
      ...survey,
      questionCount: survey.questionIds.length
    }));
  },

  getSurveyById: async (id: string): Promise<Survey | null> => {
    const survey = localStorageService.getSurveyById(id);
    if (survey) {
      return {
        ...survey,
        questionCount: survey.questionIds.length
      };
    }
    return null;
  },

  createSurvey: async (survey: Partial<Survey>): Promise<Survey> => {
    const newSurvey: Survey = {
      id: `survey-${Date.now()}`,
      name: survey.name || 'Untitled Survey',
      description: survey.description || '',
      status: survey.status || 'draft',
      questionIds: survey.questionIds || [],
      questionCount: survey.questionIds?.length || 0,
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      responses: 0
    };
    
    return localStorageService.saveSurvey(newSurvey);
  },

  updateSurvey: async (id: string, updates: Partial<Survey>): Promise<Survey | null> => {
    const existingSurvey = localStorageService.getSurveyById(id);
    
    if (!existingSurvey) {
      return null;
    }
    
    const updatedSurvey = {
      ...existingSurvey,
      ...updates,
      questionCount: updates.questionIds?.length || existingSurvey.questionIds.length,
      lastModified: new Date().toISOString()
    };
    
    return localStorageService.saveSurvey(updatedSurvey);
  },

  deleteSurvey: async (id: string): Promise<boolean> => {
    return localStorageService.deleteSurvey(id);
  },

  publishSurvey: async (id: string): Promise<Survey | null> => {
    return surveyService.updateSurvey(id, { status: 'active' });
  },

  addQuestion: async (surveyId: string, questionId: string): Promise<Survey | null> => {
    const survey = await surveyService.getSurveyById(surveyId);
    if (!survey) return null;

    const updatedQuestionIds = [...survey.questionIds, questionId];
    return surveyService.updateSurvey(surveyId, { 
      questionIds: updatedQuestionIds,
      questionCount: updatedQuestionIds.length
    });
  },

  removeQuestion: async (surveyId: string, questionId: string): Promise<Survey | null> => {
    const survey = await surveyService.getSurveyById(surveyId);
    if (!survey) return null;

    const updatedQuestionIds = survey.questionIds.filter(id => id !== questionId);
    return surveyService.updateSurvey(surveyId, { 
      questionIds: updatedQuestionIds,
      questionCount: updatedQuestionIds.length
    });
  },

  updateQuestions: async (surveyId: string, questionIds: string[]): Promise<Survey | null> => {
    return surveyService.updateSurvey(surveyId, { 
      questionIds,
      questionCount: questionIds.length
    });
  },

  getSurveyResponses: async (surveyId: string): Promise<SurveyResponse[]> => {
    return localStorageService.getSurveyResponses(surveyId);
  },

  submitSurveyResponse: async (
    surveyId: string, 
    answers: Record<string, any>,
    metadata?: { isAnonymous: boolean; email?: string; sendCopy?: boolean }
  ): Promise<SurveyResponse> => {
    const response: Partial<SurveyResponse> = {
      answers,
      metadata
    };
    
    return localStorageService.saveSurveyResponse(surveyId, response as SurveyResponse);
  },

  getQuestionsForSurvey: async (surveyId: string): Promise<Question[]> => {
    const survey = await surveyService.getSurveyById(surveyId);
    
    if (!survey) {
      return [];
    }
    
    return survey.questionIds
      .map(id => getQuestionById(id))
      .filter(q => q !== undefined) as Question[];
  },

  getSurveyAnalytics: async (surveyId: string): Promise<AnalyticsResult> => {
    const survey = await surveyService.getSurveyById(surveyId);
    if (!survey) {
      throw new Error('Survey not found');
    }

    const responses = await surveyService.getSurveyResponses(surveyId);
    const questions = await surveyService.getQuestionsForSurvey(surveyId);
    
    // Initialize analytics object
    const analytics: AnalyticsResult = {
      totalResponses: responses.length,
      totalQuestions: questions.length,
      responseRate: 0,
      departmentAnalytics: {},
      categoryDistribution: {},
      questionAnalytics: {},
      trends: {
        daily: []
      }
    };

    // Process questions to get real category distribution
    const categoryCount: { [key: string]: number } = {};
    questions.forEach(question => {
      const category = question.category || 'Uncategorized';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    // Initialize category distribution with real data
    Object.entries(categoryCount).forEach(([category, count]) => {
      analytics.categoryDistribution[category] = {
        questions: count,
        totalResponses: 0
      };
    });

    // Get real departments from responses
    const departments = new Set<string>();
    responses.forEach(response => {
      if (response.metadata?.department) {
        departments.add(response.metadata.department);
      }
    });

    // Initialize department analytics with real departments
    departments.forEach(department => {
      analytics.departmentAnalytics[department] = {
        responses: 0,
        totalEmployees: 0,
        participationRate: 0
      };
    });

    // Process responses to calculate real analytics
    const dailyResponses: { [date: string]: number } = {};
    
    responses.forEach(response => {
      // Process department data
      const department = response.metadata?.department;
      if (department && analytics.departmentAnalytics[department]) {
        analytics.departmentAnalytics[department].responses++;
      }

      // Process daily trends
      const responseDate = format(new Date(response.submittedAt), 'yyyy-MM-dd');
      dailyResponses[responseDate] = (dailyResponses[responseDate] || 0) + 1;

      // Process answers
      Object.entries(response.answers).forEach(([questionId, answer]) => {
        const question = questions.find(q => q.id === questionId);
        if (!question) return;

        const category = question.category || 'Uncategorized';
        analytics.categoryDistribution[category].totalResponses++;

        // Initialize question analytics if not exists
        if (!analytics.questionAnalytics[questionId]) {
          analytics.questionAnalytics[questionId] = {
            type: question.type,
            results: question.type === 'rating' 
              ? Array(5).fill(0).map((_, i) => ({ rating: i + 1, count: 0 }))
              : [],
            category: category
          };
        }

        // Update question analytics based on type
        if (question.type === 'rating' && typeof answer === 'number') {
          analytics.questionAnalytics[questionId].results[answer - 1].count++;
        } else if (question.type === 'text' && typeof answer === 'string') {
          if (!analytics.questionAnalytics[questionId].responses) {
            analytics.questionAnalytics[questionId].responses = [];
          }
          analytics.questionAnalytics[questionId].responses?.push(answer);
        }
      });
    });

    // Calculate real participation rates
    Object.entries(analytics.departmentAnalytics).forEach(([department, data]) => {
      const deptData = localStorageService.getDepartments()[department] || { size: 50 };
      data.totalEmployees = deptData.size;
      data.participationRate = (data.responses / data.totalEmployees) * 100;
    });

    // Calculate overall response rate
    const totalEmployees = Object.values(analytics.departmentAnalytics)
      .reduce((sum, dept) => sum + dept.totalEmployees, 0);
    analytics.responseRate = totalEmployees > 0 ? (responses.length / totalEmployees) * 100 : 0;

    // Calculate averages for rating questions
    Object.values(analytics.questionAnalytics).forEach(qa => {
      if (qa.type === 'rating') {
        const totalResponses = qa.results.reduce((sum, r) => sum + r.count, 0);
        const totalScore = qa.results.reduce((sum, r) => sum + (r.rating * r.count), 0);
        qa.average = totalResponses > 0 ? totalScore / totalResponses : 0;
      }
    });

    // Process daily trends data
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), i);
      return format(date, 'yyyy-MM-dd');
    }).reverse();

    analytics.trends.daily = last30Days.map(date => ({
      date,
      responses: dailyResponses[date] || 0
    }));

    return analytics;
  }
};

export default surveyService;