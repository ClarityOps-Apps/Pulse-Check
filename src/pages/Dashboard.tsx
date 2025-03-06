import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, BarChart2, Users, Mail, Link as LinkIcon, Copy, CheckCircle, Trash2, Shield } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import useSurveys from '../hooks/useSurveys';
import { initializeAppData } from '../utils/initialData';
import DeleteSurveyModal from '../components/survey/DeleteSurveyModal';
import { Survey } from '../types/survey';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { surveys, loading, error, loadSurveys, deleteSurvey } = useSurveys();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [surveyToDelete, setSurveyToDelete] = useState<Survey | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Initialize app data on first load
  useEffect(() => {
    initializeAppData();
  }, []);

  const copyToClipboard = (surveyId: string) => {
    const surveyLink = `${window.location.origin}/survey/${surveyId}`;
    navigator.clipboard.writeText(surveyLink);
    setCopiedId(surveyId);
    setTimeout(() => setCopiedId(null), 2000);
  };
  
  const handleDeleteClick = (survey: Survey) => {
    setSurveyToDelete(survey);
  };
  
  const handleConfirmDelete = async () => {
    if (!surveyToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteSurvey(surveyToDelete.id);
      // Survey list will be updated automatically through the useSurveys hook
    } catch (error) {
      console.error('Error deleting survey:', error);
    } finally {
      setIsDeleting(false);
      setSurveyToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-100 text-red-700 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  const activeSurveys = surveys.filter(s => s.status === 'active');
  const totalResponses = surveys.reduce((acc, survey) => acc + (survey.responses || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex space-x-2">
          {user?.isSuperAdmin && (
            <Link 
              to="/admin" 
              className={`flex items-center px-4 py-2 rounded-lg ${
                theme === 'dark' 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              <Shield size={18} className="mr-2" />
              <span>Super Admin Panel</span>
            </Link>
          )}
          
          <Link 
            to="/create" 
            className={`flex items-center px-4 py-2 rounded-lg ${
              theme === 'dark' 
                ? 'bg-indigo-600 hover:bg-indigo-700' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            <PlusCircle size={20} className="mr-2" />
            <span>Create Survey</span>
          </Link>
        </div>
      </div>

      {user?.isSuperAdmin && (
        <div className="p-4 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 flex items-center">
          <Shield size={20} className="mr-2" />
          <div>
            <p className="font-medium">Super Admin Access</p>
            <p className="text-sm">You have super admin privileges. You can access all system data and manage all users.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Active Surveys</h3>
            <div className={`p-2 rounded-full ${
              theme === 'dark' ? 'bg-indigo-900' : 'bg-indigo-100'
            }`}>
              <BarChart2 size={20} className={theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'} />
            </div>
          </div>
          <p className="text-3xl font-bold">{activeSurveys.length}</p>
        </div>

        <div className={`p-6 rounded-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Total Responses</h3>
            <div className={`p-2 rounded-full ${
              theme === 'dark' ? 'bg-green-900' : 'bg-green-100'
            }`}>
              <Users size={20} className={theme === 'dark' ? 'text-green-400' : 'text-green-600'} />
            </div>
          </div>
          <p className="text-3xl font-bold">{totalResponses}</p>
        </div>

        <div className={`p-6 rounded-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Pending Invitations</h3>
            <div className={`p-2 rounded-full ${
              theme === 'dark' ? 'bg-yellow-900' : 'bg-yellow-100'
            }`}>
              <Mail size={20} className={theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'} />
            </div>
          </div>
          <p className="text-3xl font-bold">24</p>
        </div>
      </div>

      <div className={`rounded-lg overflow-hidden ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
      }`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">Recent Surveys</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Survey Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Responses</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {surveys.map((survey) => (
                <tr key={survey.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/results/${survey.id}`} className="font-medium hover:underline">
                      {survey.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      survey.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : survey.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {survey.status.charAt(0).toUpperCase() + survey.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{survey.responses || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(survey.created).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => copyToClipboard(survey.id)}
                        className={`p-1 rounded ${
                          theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                        title="Copy survey link"
                      >
                        {copiedId === survey.id ? (
                          <CheckCircle size={18} className="text-green-500" />
                        ) : (
                          <LinkIcon size={18} />
                        )}
                      </button>
                      <Link 
                        to={`/results/${survey.id}`}
                        className={`p-1 rounded ${
                          theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                        title="View results"
                      >
                        <BarChart2 size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDeleteClick(survey)}
                        className={`p-1 rounded ${
                          theme === 'dark' ? 'hover:bg-gray-700 text-gray-400 hover:text-red-400' : 'hover:bg-gray-100 text-gray-500 hover:text-red-500'
                        }`}
                        title="Delete survey"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {surveyToDelete && (
        <DeleteSurveyModal
          surveyName={surveyToDelete.name}
          hasResponses={(surveyToDelete.responses || 0) > 0}
          onConfirm={handleConfirmDelete}
          onCancel={() => setSurveyToDelete(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;