import { v4 as uuidv4 } from 'uuid';
import { SurveyTemplate } from '../types/survey';
import { surveyTemplates } from '../data/questionLibrary';
import surveyService from './surveyService';

// Keys for localStorage
const KEYS = {
  TEMPLATES: 'pulsecheck_templates',
  BUILTIN_TEMPLATES: 'pulsecheck_builtin_templates'
};

// Template Service
const templateService = {
  // Initialize built-in templates if not exists
  initializeBuiltInTemplates: async () => {
    try {
      const builtInTemplates = localStorage.getItem(KEYS.BUILTIN_TEMPLATES);
      if (!builtInTemplates) {
        // Store initial built-in templates
        localStorage.setItem(KEYS.BUILTIN_TEMPLATES, JSON.stringify(surveyTemplates));
        console.log('Built-in templates initialized successfully');
      }
    } catch (error) {
      console.error('Error initializing built-in templates:', error);
    }
  },

  // Get all templates (both built-in and custom)
  getAllTemplates: async (): Promise<SurveyTemplate[]> => {
    try {
      // Get built-in templates
      const builtInTemplates = localStorage.getItem(KEYS.BUILTIN_TEMPLATES);
      const builtIn = builtInTemplates ? JSON.parse(builtInTemplates) : [];

      // Get custom templates
      const customTemplates = localStorage.getItem(KEYS.TEMPLATES);
      const custom = customTemplates ? JSON.parse(customTemplates) : [];

      // Combine and return all templates
      return [...builtIn, ...custom];
    } catch (error) {
      console.error('Error getting templates:', error);
      return [];
    }
  },

  // Get template by ID
  getTemplateById: async (id: string): Promise<SurveyTemplate | null> => {
    try {
      const templates = await templateService.getAllTemplates();
      return templates.find(template => template.id === id) || null;
    } catch (error) {
      console.error('Error getting template by ID:', error);
      return null;
    }
  },

  // Create a new template
  createTemplate: async (template: Partial<SurveyTemplate>): Promise<SurveyTemplate> => {
    try {
      const newTemplate: SurveyTemplate = {
        id: uuidv4(),
        name: template.name || 'Untitled Template',
        description: template.description || '',
        questionIds: template.questionIds || []
      };
      
      // Store in custom templates
      const customTemplates = JSON.parse(localStorage.getItem(KEYS.TEMPLATES) || '[]');
      customTemplates.push(newTemplate);
      localStorage.setItem(KEYS.TEMPLATES, JSON.stringify(customTemplates));
      
      return newTemplate;
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  },

  // Copy template to survey library
  copyTemplateToLibrary: async (templateId: string, name: string, description: string): Promise<boolean> => {
    try {
      const template = await templateService.getTemplateById(templateId);
      if (!template) {
        throw new Error('Template not found');
      }

      // Create a new survey from the template
      const surveyData = {
        name,
        description,
        questionIds: template.questionIds,
        status: 'draft'
      };

      const savedSurvey = await surveyService.createSurvey(surveyData);
      return !!savedSurvey;
    } catch (error) {
      console.error('Error copying template to library:', error);
      return false;
    }
  },

  // Update an existing template
  updateTemplate: async (id: string, updates: Partial<SurveyTemplate>): Promise<SurveyTemplate | null> => {
    try {
      // Check if it's a built-in template
      const builtInTemplates = JSON.parse(localStorage.getItem(KEYS.BUILTIN_TEMPLATES) || '[]');
      const builtInIndex = builtInTemplates.findIndex(t => t.id === id);

      if (builtInIndex !== -1) {
        // Update built-in template
        const updatedTemplate = {
          ...builtInTemplates[builtInIndex],
          ...updates
        };
        builtInTemplates[builtInIndex] = updatedTemplate;
        localStorage.setItem(KEYS.BUILTIN_TEMPLATES, JSON.stringify(builtInTemplates));
        return updatedTemplate;
      }

      // If not built-in, check custom templates
      const customTemplates = JSON.parse(localStorage.getItem(KEYS.TEMPLATES) || '[]');
      const customIndex = customTemplates.findIndex(t => t.id === id);

      if (customIndex !== -1) {
        const updatedTemplate = {
          ...customTemplates[customIndex],
          ...updates
        };
        customTemplates[customIndex] = updatedTemplate;
        localStorage.setItem(KEYS.TEMPLATES, JSON.stringify(customTemplates));
        return updatedTemplate;
      }

      return null;
    } catch (error) {
      console.error('Error updating template:', error);
      return null;
    }
  },

  // Delete a template
  deleteTemplate: async (id: string, isSuperAdmin: boolean = false): Promise<boolean> => {
    try {
      // Check if it's a built-in template
      const builtInTemplates = JSON.parse(localStorage.getItem(KEYS.BUILTIN_TEMPLATES) || '[]');
      const builtInIndex = builtInTemplates.findIndex(t => t.id === id);
      
      if (builtInIndex !== -1) {
        // Only Super Admin can delete built-in templates
        if (!isSuperAdmin) {
          console.error('Only Super Admin can delete built-in templates');
          return false;
        }
        
        builtInTemplates.splice(builtInIndex, 1);
        localStorage.setItem(KEYS.BUILTIN_TEMPLATES, JSON.stringify(builtInTemplates));
        return true;
      }

      // Handle custom templates
      const customTemplates = JSON.parse(localStorage.getItem(KEYS.TEMPLATES) || '[]');
      const customIndex = customTemplates.findIndex(t => t.id === id);
      
      if (customIndex !== -1) {
        customTemplates.splice(customIndex, 1);
        localStorage.setItem(KEYS.TEMPLATES, JSON.stringify(customTemplates));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error deleting template:', error);
      return false;
    }
  }
};

export default templateService;