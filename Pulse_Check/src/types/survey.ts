// Survey Types
export interface Question {
  id: string;
  text: string;
  type: 'rating' | 'multiple-choice' | 'text';
  required: boolean;
  options?: string[];
  category?: string;
}

export interface Survey {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'completed';
  questionIds: string[];
  questionCount: number;
  created: string;
  lastModified: string;
  responses?: number;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  answers: Record<string, any>;
  metadata?: {
    isAnonymous: boolean;
    email?: string;
    sendCopy?: boolean;
    department?: string;
  };
  submittedAt: string;
}

export interface SurveyTemplate {
  id: string;
  name: string;
  description: string;
  questionIds: string[];
  questionCount?: number;
  isBuiltIn?: boolean;
}