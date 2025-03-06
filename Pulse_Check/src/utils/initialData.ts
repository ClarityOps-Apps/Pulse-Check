import { Survey } from '../types/survey';
import { User } from '../types/user';
import localStorageService from '../services/storage/localStorage';
import { mockSurveys } from '../data/mockData';
import { standardQuestions, surveyTemplates } from '../data/questionLibrary';
import { SUPER_ADMIN_EMAIL } from './superAdminConfig';
import { v4 as uuidv4 } from 'uuid';
import templateService from '../services/templateService';

// Department data
const DEPARTMENTS = {
  'Engineering': { size: 50 },
  'Marketing': { size: 30 },
  'Sales': { size: 40 },
  'HR': { size: 15 },
  'Finance': { size: 25 }
};

// Initialize the application with sample data
export const initializeAppData = () => {
  // Check if data has ever been initialized
  const hasBeenInitialized = localStorage.getItem('pulsecheck_initialized');
  
  // Initialize super admin user if not exists
  initializeSuperAdmin();
  
  // Initialize templates storage if not exists
  initializeTemplatesStorage();
  
  // Initialize built-in templates
  templateService.initializeBuiltInTemplates();

  // Initialize departments if not exists
  const departmentsData = localStorage.getItem('pulsecheck_departments');
  if (!departmentsData) {
    localStorage.setItem('pulsecheck_departments', JSON.stringify(DEPARTMENTS));
    console.log('Departments data initialized');
  }
  
  // Only initialize sample surveys if this is the first time EVER
  if (!hasBeenInitialized) {
    // Convert mock surveys to the proper format and save them
    mockSurveys.forEach(mockSurvey => {
      const survey: Survey = {
        id: mockSurvey.id,
        name: mockSurvey.name,
        description: 'Sample survey for demonstration purposes',
        status: mockSurvey.status as 'draft' | 'active' | 'completed',
        questionIds: standardQuestions.slice(0, 10).map(q => q.id), // Use first 10 questions
        questionCount: 10,
        created: mockSurvey.created,
        lastModified: mockSurvey.created,
        responses: mockSurvey.responses
      };
      
      localStorageService.saveSurvey(survey);
      
      // Add some sample responses for active surveys
      if (mockSurvey.status === 'active' && mockSurvey.responses > 0) {
        for (let i = 0; i < mockSurvey.responses; i++) {
          const answers: Record<string, any> = {};
          
          // Generate random answers for each question
          survey.questionIds.forEach(questionId => {
            const question = standardQuestions.find(q => q.id === questionId);
            
            if (question) {
              if (question.type === 'rating') {
                answers[questionId] = Math.floor(Math.random() * 5) + 1;
              } else if (question.type === 'multiple-choice' && question.options) {
                const randomIndex = Math.floor(Math.random() * question.options.length);
                answers[questionId] = question.options[randomIndex];
              } else if (question.type === 'text') {
                // Only add text responses to some questions
                if (Math.random() > 0.7) {
                  const textResponses = [
                    "I really enjoy the work environment.",
                    "More flexible working hours would be great.",
                    "I'd like to see more team-building activities.",
                    "Better communication between departments would help a lot.",
                    "More recognition for achievements would boost morale."
                  ];
                  answers[questionId] = textResponses[Math.floor(Math.random() * textResponses.length)];
                }
              }
            }
          });

          // Add random department to metadata
          const departments = Object.keys(DEPARTMENTS);
          const randomDepartment = departments[Math.floor(Math.random() * departments.length)];
          
          // Add the response
          localStorageService.saveSurveyResponse(survey.id, {
            id: `response-${Date.now()}-${i}`,
            surveyId: survey.id,
            answers,
            metadata: {
              isAnonymous: Math.random() > 0.5,
              department: randomDepartment
            },
            submittedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() // Random date in the last 30 days
          });
        }
      }
    });
    
    // Mark as initialized so we never add sample data again
    localStorage.setItem('pulsecheck_initialized', 'true');
    console.log('Sample data initialized successfully');
  }
};

// Initialize super admin user if not exists
const initializeSuperAdmin = () => {
  const USERS_KEY = 'pulsecheck_users';
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  
  // Check if super admin already exists
  const superAdminExists = users.some((user: User) => 
    user.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()
  );
  
  if (!superAdminExists) {
    // Create super admin user
    const superAdmin: User = {
      id: uuidv4(),
      email: SUPER_ADMIN_EMAIL,
      firstName: 'Garrett',
      lastName: 'Admin',
      company: 'ClarityOps',
      position: 'Super Admin',
      isAdmin: true,
      isSuperAdmin: true,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    
    // Add super admin to users
    users.push(superAdmin);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Set a temporary password for the super admin (in a real app, this would be set by the user)
    localStorage.setItem(`${USERS_KEY}_${superAdmin.id}_password`, 'admin123');
    
    console.log('Super admin user initialized');
  }
};

// Initialize templates storage if not exists
const initializeTemplatesStorage = () => {
  const TEMPLATES_KEY = 'pulsecheck_templates';
  const templates = localStorage.getItem(TEMPLATES_KEY);
  
  if (!templates) {
    // Create empty templates array
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify([]));
    console.log('Templates storage initialized');
  }
};

export default initializeAppData;