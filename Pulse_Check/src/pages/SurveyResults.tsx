import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Mail, Users, MessageSquare, TrendingUp, BarChart2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import useSurveyResults from '../hooks/useSurveyResults';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const SurveyResults = () => {
  const { theme } = useTheme();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  
  const { survey, analytics, loading, error } = useSurveyResults(id || '');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !survey || !analytics) {
    return (
      <div className={`p-6 rounded-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
      }`}>
        <h2 className="text-xl font-bold text-red-500 mb-2">Error</h2>
        <p>{error || 'Failed to load survey results'}</p>
      </div>
    );
  }

  // Get key insights based on analytics data
  const getKeyInsights = () => {
    const insights = [];

    // Response rate insight
    if (analytics.responseRate > 0) {
      insights.push(`Overall response rate is ${analytics.responseRate.toFixed(1)}%`);
    }

    // Department participation insights
    const departments = Object.entries(analytics.departmentAnalytics);
    if (departments.length > 0) {
      const highestParticipation = departments.reduce((prev, curr) => 
        curr[1].participationRate > prev[1].participationRate ? curr : prev
      );
      insights.push(`${highestParticipation[0]} department has the highest participation rate at ${highestParticipation[1].participationRate.toFixed(1)}%`);
    }

    // Category insights
    const categories = Object.entries(analytics.categoryDistribution);
    if (categories.length > 0) {
      const highestRated = categories.reduce((prev, curr) => 
        (curr[1].averageRating || 0) > (prev[1].averageRating || 0) ? curr : prev
      );
      if (highestRated[1].averageRating) {
        insights.push(`${highestRated[0]} category has the highest average rating at ${highestRated[1].averageRating.toFixed(1)}/5`);
      }
    }

    // Trend insights
    if (analytics.trends.daily.length > 1) {
      const latestResponses = analytics.trends.daily[analytics.trends.daily.length - 1].responses;
      const previousResponses = analytics.trends.daily[analytics.trends.daily.length - 2].responses;
      const percentChange = ((latestResponses - previousResponses) / previousResponses) * 100;
      
      if (!isNaN(percentChange)) {
        insights.push(`Response rate has ${percentChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(percentChange).toFixed(1)}% compared to the previous day`);
      }
    }

    return insights;
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Total Responses</h3>
            <div className={`p-2 rounded-full ${
              theme === 'dark' ? 'bg-indigo-900' : 'bg-indigo-100'
            }`}>
              <Users size={20} className={theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'} />
            </div>
          </div>
          <p className="text-3xl font-bold">{analytics.totalResponses}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Response Rate: {analytics.responseRate.toFixed(1)}%
          </p>
        </div>

        <div className={`p-6 rounded-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Daily Trend</h3>
            <div className={`p-2 rounded-full ${
              theme === 'dark' ? 'bg-green-900' : 'bg-green-100'
            }`}>
              <TrendingUp size={20} className={theme === 'dark' ? 'text-green-400' : 'text-green-600'} />
            </div>
          </div>
          <p className="text-3xl font-bold">
            {analytics.trends.daily.length > 0 
              ? analytics.trends.daily[analytics.trends.daily.length - 1].responses 
              : 0}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Responses today
          </p>
        </div>

        <div className={`p-6 rounded-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Text Responses</h3>
            <div className={`p-2 rounded-full ${
              theme === 'dark' ? 'bg-yellow-900' : 'bg-yellow-100'
            }`}>
              <MessageSquare size={20} className={theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'} />
            </div>
          </div>
          <p className="text-3xl font-bold">
            {Object.values(analytics.questionAnalytics)
              .filter(q => q.type === 'text')
              .reduce((sum, q) => sum + (q.responses?.length || 0), 0)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-6 rounded-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
        }`}>
          <h2 className="text-xl font-semibold mb-4">Response Trend</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics.trends.daily}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="responses" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`p-6 rounded-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
        }`}>
          <h2 className="text-xl font-semibold mb-4">Category Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={Object.entries(analytics.categoryDistribution).map(([name, data]) => ({
                    name,
                    value: data.questions
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {Object.keys(analytics.categoryDistribution).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className={`p-6 rounded-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
      }`}>
        <h2 className="text-xl font-semibold mb-4">Department Participation</h2>
        <div className={`overflow-x-auto ${
          theme === 'dark' ? 'bg-gray-700 rounded-lg' : 'bg-gray-50 rounded-lg'
        }`}>
          <table className="w-full">
            <thead className={theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Responses</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Participation Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {Object.entries(analytics.departmentAnalytics).map(([department, data]) => (
                <tr key={department}>
                  <td className="px-6 py-4 whitespace-nowrap">{department}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{data.responses}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{data.participationRate.toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                      <div 
                        className="bg-indigo-600 h-2.5 rounded-full" 
                        style={{ width: `${data.participationRate}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`p-6 rounded-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
      }`}>
        <h2 className="text-xl font-semibold mb-4">Key Insights</h2>
        <div className={`p-4 rounded-lg ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <ul className="space-y-2">
            {getKeyInsights().map((insight, index) => (
              <li key={index} className="flex items-start">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                  theme === 'dark' ? 'bg-indigo-600' : 'bg-indigo-100 text-indigo-600'
                }`}>
                  {index + 1}
                </div>
                <p>{insight}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  const renderQuestions = () => (
    <div className="space-y-6">
      {Object.entries(analytics.questionAnalytics).map(([questionId, questionData], index) => {
        const question = survey.questions?.find((q: any) => q.id === questionId) || { text: 'Unknown Question' };
        
        return (
          <div 
            key={questionId} 
            className={`p-6 rounded-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
            }`}
          >
            <h2 className="text-xl font-semibold mb-4">
              Question {index + 1}: {question.text}
            </h2>
            
            {questionData.type === 'rating' && (
              <div className="space-y-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={questionData.results}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="rating" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#4f46e5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-between items-center">
                  <p>Average rating: <span className="font-bold">{questionData.average?.toFixed(1)}/5</span></p>
                  <p>Total responses: <span className="font-bold">{questionData.results.reduce((acc: number, curr: any) => acc + curr.count, 0)}</span></p>
                </div>
              </div>
            )}
            
            {questionData.type === 'multiple-choice' && (
              <div className="space-y-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={questionData.results}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {questionData.results.map((_: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <p>Total selections: <span className="font-bold">{questionData.results.reduce((acc: number, curr: any) => acc + curr.value, 0)}</span></p>
                </div>
              </div>
            )}
            
            {questionData.type === 'text' && (
              <div className="space-y-4">
                <p>Total comments: <span className="font-bold">{questionData.responses?.length || 0}</span></p>
                <div className={`max-h-64 overflow-y-auto p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  {questionData.responses && questionData.responses.length > 0 ? (
                    questionData.responses.map((response: string, i: number) => (
                      <div 
                        key={i} 
                        className={`p-3 mb-2 rounded ${
                          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                        }`}
                      >
                        <p>"{response}"</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center">No text responses for this question</p>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderResponses = () => (
    <div className={`p-6 rounded-lg ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
    }`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Individual Responses</h2>
        <button className={`flex items-center px-3 py-2 rounded ${
          theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
        }`}>
          <Download size={18} className="mr-2" />
          <span>Export CSV</span>
        </button>
      </div>
      
      {analytics.totalResponses > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Respondent</th>
                {Object.keys(analytics.questionAnalytics).slice(0, 3).map((questionId, index) => (
                  <th key={questionId} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Q{index + 1} Response
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {/* We'll implement real response data here in the next iteration */}
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  Individual response data will be implemented in the next update
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No responses yet</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{survey.name}</h1>
          <p className="text-sm opacity-75">Created on {new Date(survey.created).toLocaleDateString()}</p>
        </div>
        <div className="flex space-x-2">
          <button className={`flex items-center px-4 py-2 rounded-lg ${
            theme === 'dark' 
              ? 'bg-gray-700 hover:bg-gray-600' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}>
            <Download size={18} className="mr-2" />
            <span>Export</span>
          </button>
          <button className={`flex items-center px-4 py-2 rounded-lg ${
            theme === 'dark' 
              ? 'bg-indigo-600 hover:bg-indigo-700' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}>
            <Mail size={18} className="mr-2" />
            <span>Share Results</span>
          </button>
        </div>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'questions', 'responses'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? theme === 'dark'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-indigo-500 text-indigo-600'
                  : theme === 'dark'
                    ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'questions' && renderQuestions()}
      {activeTab === 'responses' && renderResponses()}
    </div>
  );
};

export default SurveyResults;