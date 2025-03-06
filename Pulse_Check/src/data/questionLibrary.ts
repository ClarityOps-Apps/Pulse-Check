// Standard question library with pre-written questions
export const standardQuestions = [
  {
    id: 'std-q1',
    text: 'Management keeps me informed about important issues and changes.',
    type: 'rating',
    required: true,
    category: 'Management Communication'
  },
  {
    id: 'std-q2',
    text: 'Management makes its expectations clear & we understand how our role contributes to the organization\'s goals',
    type: 'rating',
    required: true,
    category: 'Role Clarity'
  },
  {
    id: 'std-q3',
    text: 'I can ask management any reasonable question and get a straight answer.',
    type: 'rating',
    required: true,
    category: 'Management Communication'
  },
  {
    id: 'std-q4',
    text: 'Management does a good job of attracting talent who fit in well here.',
    type: 'rating',
    required: true,
    category: 'Talent Management'
  },
  {
    id: 'std-q5',
    text: 'Management does a good job of assigning and coordinating people.',
    type: 'rating',
    required: true,
    category: 'Management Effectiveness'
  },
  {
    id: 'std-q6',
    text: 'Management trusts people to do a good job without watching over their shoulders.',
    type: 'rating',
    required: true,
    category: 'Trust & Autonomy'
  },
  {
    id: 'std-q7',
    text: 'Management has a clear view of where the organization is going and how to get there.',
    type: 'rating',
    required: true,
    category: 'Strategic Direction'
  },
  {
    id: 'std-q8',
    text: 'Management\'s actions match its words.',
    type: 'rating',
    required: true,
    category: 'Management Integrity'
  },
  {
    id: 'std-q9',
    text: 'Management is honest and ethical in its business practices.',
    type: 'rating',
    required: true,
    category: 'Ethics'
  },
  {
    id: 'std-q10',
    text: 'Our People Managers fully embody the best characteristics of our company.',
    type: 'rating',
    required: true,
    category: 'Leadership'
  },
  {
    id: 'std-q11',
    text: 'I am offered training or development to further myself professionally.',
    type: 'rating',
    required: true,
    category: 'Professional Development'
  },
  {
    id: 'std-q12',
    text: 'I am given the resources and equipment to do my job.',
    type: 'rating',
    required: true,
    category: 'Resources'
  },
  {
    id: 'std-q13',
    text: 'Management shows appreciation for good work and extra effort.',
    type: 'rating',
    required: true,
    category: 'Recognition'
  },
  {
    id: 'std-q14',
    text: 'Management recognizes honest mistakes as part of doing business.',
    type: 'rating',
    required: true,
    category: 'Psychological Safety'
  },
  {
    id: 'std-q15',
    text: 'We celebrate people who try new and better ways of doing things, regardless of the outcome.',
    type: 'rating',
    required: true,
    category: 'Innovation'
  },
  {
    id: 'std-q16',
    text: 'Management involves people & genuinely seeks and responds to suggestions and ideas.',
    type: 'rating',
    required: true,
    category: 'Employee Voice'
  },
  {
    id: 'std-q17',
    text: 'This is a psychologically and emotionally healthy place to work.',
    type: 'rating',
    required: true,
    category: 'Work Environment'
  },
  {
    id: 'std-q18',
    text: 'People are encouraged to balance their work life and their personal life.',
    type: 'rating',
    required: true,
    category: 'Work-Life Balance'
  },
  {
    id: 'std-q19',
    text: 'Management shows a sincere interest in me as a person, not just an employee.',
    type: 'rating',
    required: true,
    category: 'Employee Care'
  },
  {
    id: 'std-q20',
    text: 'People here are paid fairly for the work they do.',
    type: 'rating',
    required: true,
    category: 'Compensation'
  },
  {
    id: 'std-q21',
    text: 'I am able to take time off from work when I think it\'s necessary.',
    type: 'rating',
    required: true,
    category: 'Work-Life Balance'
  },
  {
    id: 'std-q22',
    text: 'Promotions go to those who best deserve them.',
    type: 'rating',
    required: true,
    category: 'Career Growth'
  },
  {
    id: 'std-q23',
    text: 'People avoid politicking and backstabbing as ways to get things done and avoid playing favourites',
    type: 'rating',
    required: true,
    category: 'Workplace Politics'
  },
  {
    id: 'std-q24',
    text: 'People here are treated fairly regardless of their age, Caste, Gender, Sexual Orientation.',
    type: 'rating',
    required: true,
    category: 'Diversity & Inclusion'
  },
  {
    id: 'std-q25',
    text: 'If I am unfairly treated, I believe I\'ll be given a fair hearing if I raise a case/ reach out to our P&C Team',
    type: 'rating',
    required: true,
    category: 'Fairness'
  },
  {
    id: 'std-q26',
    text: 'I feel I make a difference here & this is not \'just a job\'.',
    type: 'rating',
    required: true,
    category: 'Purpose & Meaning'
  },
  {
    id: 'std-q27',
    text: 'When I look at what we accomplish, I feel a sense of pride.',
    type: 'rating',
    required: true,
    category: 'Pride'
  },
  {
    id: 'std-q28',
    text: 'People here are willing to put in extra effort to get the job done.',
    type: 'rating',
    required: true,
    category: 'Commitment'
  },
  {
    id: 'std-q29',
    text: 'People here quickly adapt to changes needed for our organization\'s success.',
    type: 'rating',
    required: true,
    category: 'Adaptability'
  },
  {
    id: 'std-q30',
    text: 'I want to work here for a long time.',
    type: 'rating',
    required: true,
    category: 'Retention'
  },
  {
    id: 'std-q31',
    text: 'I\'m proud to tell others I work here.',
    type: 'rating',
    required: true,
    category: 'Pride'
  },
  {
    id: 'std-q32',
    text: 'People care about each other here & cooperate with each other.',
    type: 'rating',
    required: true,
    category: 'Collaboration'
  },
  {
    id: 'std-q33',
    text: 'People look forward to coming to work here.',
    type: 'rating',
    required: true,
    category: 'Engagement'
  },
  {
    id: 'std-q34',
    text: 'I feel good about the ways we contribute to the society.',
    type: 'rating',
    required: true,
    category: 'Social Impact'
  },
  {
    id: 'std-q35',
    text: 'Our respective business lines would rate the service we deliver as "excellent".',
    type: 'rating',
    required: true,
    category: 'Service Excellence'
  },
  {
    id: 'std-q36',
    text: 'People celebrate special events around here.',
    type: 'rating',
    required: true,
    category: 'Culture'
  },
  {
    id: 'std-q37',
    text: 'This is a fun place to work.',
    type: 'rating',
    required: true,
    category: 'Work Environment'
  },
  {
    id: 'std-q38',
    text: 'When you join the organization, you are made to feel welcome.',
    type: 'rating',
    required: true,
    category: 'Onboarding'
  },
  {
    id: 'std-q39',
    text: 'When people change jobs or work units, they are made to feel right at home.',
    type: 'rating',
    required: true,
    category: 'Internal Mobility'
  },
  {
    id: 'std-q40',
    text: 'Management does a good job of developing managers for leadership positions.',
    type: 'rating',
    required: true,
    category: 'Leadership Development'
  },
  {
    id: 'std-q41',
    text: 'Performance of employees here is fairly evaluated.',
    type: 'rating',
    required: true,
    category: 'Performance Management'
  },
  {
    id: 'std-q42',
    text: 'Management takes action on feedback gathered from employees.',
    type: 'rating',
    required: true,
    category: 'Feedback Loop'
  },
  {
    id: 'std-q43',
    text: 'My manager gives me useful feedback on how well I am performing',
    type: 'rating',
    required: true,
    category: 'Manager Feedback'
  },
  {
    id: 'std-q44',
    text: 'My manager keeps me informed about what is happening at the company',
    type: 'rating',
    required: true,
    category: 'Manager Communication'
  },
  {
    id: 'std-q45',
    text: 'Workloads are divided fairly among people where I work',
    type: 'rating',
    required: true,
    category: 'Workload'
  },
  {
    id: 'std-q46',
    text: 'Most of the systems and processes here support us getting our work done effectively',
    type: 'rating',
    required: true,
    category: 'Systems & Processes'
  },
  {
    id: 'std-q47',
    text: 'We hold ourselves and our team members accountable for results',
    type: 'rating',
    required: true,
    category: 'Accountability'
  },
  {
    id: 'std-q48',
    text: 'I am happy with my current role relative to what was described to me.',
    type: 'rating',
    required: true,
    category: 'Role Satisfaction'
  },
  {
    id: 'std-q49',
    text: 'Taking everything into account, I would say this is a great place to work.',
    type: 'rating',
    required: true,
    category: 'Overall Satisfaction'
  },
  {
    id: 'std-q50',
    text: 'Based on your experience so far, how likely are you to recommend a friend or a family member to join our company? Please share your response with 10 being most likely and 1 being least likely.',
    type: 'rating',
    required: true,
    category: 'eNPS'
  },
  {
    id: 'std-q51',
    text: 'What do you like most about working at our company?',
    type: 'text',
    required: false,
    category: 'Open Feedback'
  },
  {
    id: 'std-q52',
    text: 'What would make our company an even better place to work?',
    type: 'text',
    required: false,
    category: 'Improvement Suggestions'
  }
];

// Categories for organizing questions
export const questionCategories = [
  { id: 'management', name: 'Management & Leadership' },
  { id: 'work-environment', name: 'Work Environment' },
  { id: 'development', name: 'Professional Development' },
  { id: 'compensation', name: 'Compensation & Benefits' },
  { id: 'culture', name: 'Company Culture' },
  { id: 'engagement', name: 'Employee Engagement' },
  { id: 'feedback', name: 'Open Feedback' }
];

// Template surveys for quick selection
export const surveyTemplates = [
  {
    id: 'comprehensive',
    name: 'Comprehensive Employee Happiness Survey',
    description: 'A complete assessment covering all aspects of employee experience',
    questionIds: standardQuestions.map(q => q.id)
  },
  {
    id: 'management-focus',
    name: 'Management Effectiveness Survey',
    description: 'Focus on leadership, management practices, and communication',
    questionIds: [
      'std-q1', 'std-q2', 'std-q3', 'std-q5', 'std-q6', 'std-q7', 'std-q8', 'std-q9', 'std-q10',
      'std-q13', 'std-q16', 'std-q40', 'std-q42', 'std-q43', 'std-q44'
    ]
  },
  {
    id: 'engagement',
    name: 'Employee Engagement Pulse Check',
    description: 'Quick assessment of current engagement levels',
    questionIds: [
      'std-q17', 'std-q26', 'std-q27', 'std-q28', 'std-q30', 'std-q31', 'std-q33', 'std-q49',
      'std-q50', 'std-q51'
    ]
  },
  {
    id: 'culture',
    name: 'Company Culture Survey',
    description: 'Evaluate the health of your organizational culture',
    questionIds: [
      'std-q15', 'std-q17', 'std-q23', 'std-q24', 'std-q32', 'std-q34', 'std-q36', 'std-q37',
      'std-q38'
    ]
  },
  {
    id: 'work-life',
    name: 'Work-Life Balance Assessment',
    description: 'Focus on wellbeing and balance between work and personal life',
    questionIds: ['std-q18', 'std-q19', 'std-q21', 'std-q17', 'std-q52']
  }
];

// Update the customQuestions Map to use localStorage
const CUSTOM_QUESTIONS_KEY = 'pulsecheck_custom_questions';

// Load custom questions from localStorage
const loadCustomQuestions = () => {
  try {
    const stored = localStorage.getItem(CUSTOM_QUESTIONS_KEY);
    return stored ? new Map(JSON.parse(stored)) : new Map();
  } catch (error) {
    console.error('Error loading custom questions:', error);
    return new Map();
  }
};

// Initialize custom questions from storage
const customQuestions = loadCustomQuestions();

// Save custom questions to localStorage
const persistCustomQuestions = () => {
  try {
    localStorage.setItem(
      CUSTOM_QUESTIONS_KEY, 
      JSON.stringify(Array.from(customQuestions.entries()))
    );
  } catch (error) {
    console.error('Error saving custom questions:', error);
  }
};

// Helper function to save a custom question
export const saveCustomQuestion = (question) => {
  // Ensure the question has a proper ID
  const questionToSave = {
    ...question,
    id: question.id || `custom-${Date.now()}`,
    text: question.text
  };
  
  // Save to Map
  customQuestions.set(questionToSave.id, questionToSave);
  
  // Persist to localStorage
  persistCustomQuestions();
  
  return questionToSave;
};

// Helper function to get question by ID
export const getQuestionById = (id: string) => {
  // First check if it's in the custom questions
  if (customQuestions.has(id)) {
    return customQuestions.get(id);
  }
  
  // If not found in custom questions, check if it's a standard question
  const standardQuestion = standardQuestions.find(q => q.id === id);
  if (standardQuestion) {
    return { ...standardQuestion }; // Return a copy to prevent modifying the original
  }
  
  // If it's a new custom question (starts with 'new-'), create a proper placeholder
  if (id.startsWith('new-')) {
    return {
      id,
      text: '', // Empty string instead of a placeholder
      type: 'rating',
      required: true
    };
  }
  
  return undefined;
};

// Get all questions (both standard and custom)
export const getAllQuestions = () => {
  return [
    ...standardQuestions,
    ...Array.from(customQuestions.values())
  ];
};

// Helper function to get questions by category
export const getQuestionsByCategory = (category: string) => {
  return standardQuestions.filter(q => q.category === category);
};

// Helper function to get questions by IDs
export const getQuestionsByIds = (ids: string[]) => {
  return ids.map(id => getQuestionById(id)).filter(q => q !== undefined);
};