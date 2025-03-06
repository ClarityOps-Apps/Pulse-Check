import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { ClipboardList, Plus, Trash2, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import templateService from '../../services/templateService';
import DeleteTemplateModal from './DeleteTemplateModal';
import AddToLibraryModal from './AddToLibraryModal';
import { SurveyTemplate } from '../../types/survey';

interface SurveyTemplatesProps {
  onSelectTemplate: (templateId: string) => void;
  selectedTemplate: string | null;
  onAddToLibrary: (templateId: string) => void;
  isEditMode?: boolean;
  refreshTrigger?: number;
}

const SurveyTemplates: React.FC<SurveyTemplatesProps> = ({ 
  onSelectTemplate, 
  selectedTemplate, 
  onAddToLibrary,
  isEditMode = false,
  refreshTrigger = 0
}) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [templates, setTemplates] = useState<SurveyTemplate[]>([]);
  const [templateToDelete, setTemplateToDelete] = useState<SurveyTemplate | null>(null);
  const [templateToAdd, setTemplateToAdd] = useState<SurveyTemplate | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  // Load templates
  useEffect(() => {
    const loadTemplates = async () => {
      const allTemplates = await templateService.getAllTemplates();
      // Add question count to each template
      const templatesWithCount = allTemplates.map(template => ({
        ...template,
        questionCount: template.questionIds.length
      }));
      setTemplates(templatesWithCount);
    };
    
    loadTemplates();
  }, [refreshTrigger]);
  
  const handleDeleteClick = (e: React.MouseEvent, template: SurveyTemplate) => {
    e.stopPropagation();
    setTemplateToDelete(template);
  };
  
  const handleConfirmDelete = async () => {
    if (!templateToDelete || !user?.isSuperAdmin) return;
    
    setIsDeleting(true);
    try {
      const success = await templateService.deleteTemplate(templateToDelete.id, true);
      if (success) {
        // Refresh templates list
        const updatedTemplates = await templateService.getAllTemplates();
        const templatesWithCount = updatedTemplates.map(template => ({
          ...template,
          questionCount: template.questionIds.length
        }));
        setTemplates(templatesWithCount);
      }
    } catch (error) {
      console.error('Error deleting template:', error);
    } finally {
      setIsDeleting(false);
      setTemplateToDelete(null);
    }
  };

  const handleAddToLibrary = async (e: React.MouseEvent, template: SurveyTemplate) => {
    e.stopPropagation();
    setTemplateToAdd(template);
  };

  const handleConfirmAdd = async (name: string, description: string) => {
    if (!templateToAdd) return;
    
    setIsAdding(true);
    try {
      const success = await templateService.copyTemplateToLibrary(
        templateToAdd.id,
        name,
        description
      );
      
      if (success) {
        onAddToLibrary(templateToAdd.id);
      }
    } catch (error) {
      console.error('Error adding template to library:', error);
    } finally {
      setIsAdding(false);
      setTemplateToAdd(null);
    }
  };
  
  return (
    <div className={`p-4 rounded-lg ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
    }`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Survey Templates</h3>
      </div>
      
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Start with a pre-built template or create your own template.
      </p>
      
      <div className="grid grid-cols-1 gap-3">
        {templates.map((template) => (
          <div 
            key={template.id}
            onClick={() => onSelectTemplate(template.id)}
            className={`p-3 rounded-lg border ${
              selectedTemplate === template.id
                ? theme === 'dark'
                  ? 'border-indigo-500 bg-indigo-900/20'
                  : 'border-indigo-500 bg-indigo-50'
                : theme === 'dark'
                  ? 'border-gray-700 hover:border-gray-600 hover:bg-gray-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            } cursor-pointer transition-all`}
          >
            <div className="flex items-start">
              <div className={`p-2 rounded-lg mr-3 ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <ClipboardList size={20} className={
                  selectedTemplate === template.id
                    ? 'text-indigo-500'
                    : 'text-gray-500'
                } />
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium text-sm">{template.name}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {template.description}
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  {template.questionCount} questions
                </div>
              </div>
              
              <div className="flex space-x-1">
                <button
                  onClick={(e) => handleAddToLibrary(e, template)}
                  className={`p-2 rounded-lg ${
                    theme === 'dark'
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                  title="Add to My Library"
                >
                  <Plus size={16} />
                </button>
                
                {user?.isSuperAdmin && (
                  <button
                    onClick={(e) => handleDeleteClick(e, template)}
                    className={`p-2 rounded-lg ${
                      theme === 'dark'
                        ? 'hover:bg-gray-700 text-gray-400 hover:text-red-400'
                        : 'hover:bg-gray-100 text-gray-500 hover:text-red-500'
                    }`}
                    title="Delete template"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Delete Template Modal */}
      {templateToDelete && (
        <DeleteTemplateModal
          templateName={templateToDelete.name}
          onConfirm={handleConfirmDelete}
          onCancel={() => setTemplateToDelete(null)}
        />
      )}

      {/* Add to Library Modal */}
      {templateToAdd && (
        <AddToLibraryModal
          templateName={templateToAdd.name}
          description={templateToAdd.description}
          onConfirm={handleConfirmAdd}
          onCancel={() => setTemplateToAdd(null)}
        />
      )}
    </div>
  );
};

export default SurveyTemplates;