import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Download, Mail, Users, MessageSquare, TrendingUp, BarChart2, Calendar } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import useSurveys from '../hooks/useSurveys';
import surveyService from '../services/surveyService';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Analytics = () => {
  const { theme } = useTheme();
  const { surveys, loading } = useSurveys();
  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [dateRange, setDateRange] = useState<'all' | 'custom'>('all');
  const [customDateRange, setCustomDateRange] = useState({
    start: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd')
  });

  // Load analytics data when a survey is selected
  useEffect(() => {
    const loadAnalytics = async () => {
      if (!selectedSurveyId) {
        setAnalyticsData(null);
        return;
      }

      setIsLoadingAnalytics(true);
      try {
        const data = await surveyService.getSurveyAnalytics(selectedSurveyId);
        setAnalyticsData(data);
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setIsLoadingAnalytics(false);
      }
    };

    loadAnalytics();
  }, [selectedSurveyId]);

  // Set the first survey as selected by default
  useEffect(() => {
    if (surveys.length > 0 && !selectedSurveyId) {
      setSelectedSurveyId(surveys[0].id);
    }
  }, [surveys, selectedSurveyId]);

  const handleDateRangeChange = (range: 'all' | 'custom') => {
    setDateRange(range);
  };

  const handleCustomDateChange = (type: 'start' | 'end', value: string) => {
    setCustomDateRange(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const getFilteredTrendData = () => {
    if (!analyticsData?.trends?.daily) return [];

    if (dateRange === 'all') {
      return analyticsData.trends.daily;
    }

    const start = startOfDay(new Date(customDateRange.start));
    const end = endOfDay(new Date(customDateRange.end));

    return analyticsData.trends.daily.filter((item: any) => {
      const date = new Date(item.date);
      return date >= start && date <= end;
    });
  };

  const formatYAxisTick = (value: number) => {
    return Math.round(value);
  };

  if (loading || isLoadingAnalytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        
        <div className="flex space-x-2">
          <button
            onClick={() => handleDateRangeChange('all')}
            className={`px-4 py-2 rounded-lg flex items-center ${
              dateRange === 'all'
                ? theme === 'dark'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-600 text-white'
                : theme === 'dark'
                  ? 'bg-gray-700'
                  : 'bg-gray-200'
            }`}
          >
            <BarChart2 size={18} className="mr-2" />
            All Time
          </button>
          
          <button
            onClick={() => handleDateRangeChange('custom')}
            className={`px-4 py-2 rounded-lg flex items-center ${
              dateRange === 'custom'
                ? theme === 'dark'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-600 text-white'
                : theme === 'dark'
                  ? 'bg-gray-700'
                  : 'bg-gray-200'
            }`}
          >
            <Calendar size={18} className="mr-2" />
            Custom Range
          </button>
        </div>
      </div>

      {dateRange === 'custom' && (
        <div className={`p-4 rounded-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
        }`}>
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                value={customDateRange.start}
                onChange={(e) => handleCustomDateChange('start', e.target.value)}
                className={`p-2 rounded border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600'
                    : 'border-gray-300'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                value={customDateRange.end}
                onChange={(e) => handleCustomDateChange('end', e.target.value)}
                className={`p-2 rounded border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600'
                    : 'border-gray-300'
                }`}
              />
            </div>
          </div>
        </div>
      )}

      {/* Survey Selection */}
      <div className={`p-6 rounded-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
      }`}>
        <label htmlFor="survey-select" className="block text-lg font-semibold mb-4">
          Select Survey to Analyze
        </label>
        <select
          id="survey-select"
          value={selectedSurveyId || ''}
          onChange={(e) => setSelectedSurveyId(e.target.value)}
          className={`w-full p-3 rounded-lg border text-lg ${
            theme === 'dark' 
              ? 'bg-gray-700 border-gray-600 focus:border-indigo-500' 
              : 'border-gray-300 focus:border-indigo-500'
          } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
        >
          <option value="" disabled>Select a survey</option>
          {surveys.map(survey => (
            <option key={survey.id} value={survey.id}>
              {survey.name} ({survey.responses || 0} responses)
            </option>
          ))}
        </select>
      </div>

      {analyticsData ? (
        <div className="space-y-6">
          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Response Rate</h3>
                <div className={`p-2 rounded-full ${
                  theme === 'dark' ? 'bg-indigo-900' : 'bg-indigo-100'
                }`}>
                  <TrendingUp size={20} className={theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'} />
                </div>
              </div>
              <p className="text-3xl font-bold">{analyticsData.responseRate.toFixed(1)}%</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {analyticsData.totalResponses} total responses
              </p>
            </div>

            <div className={`p-6 rounded-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Questions</h3>
                <div className={`p-2 rounded-full ${
                  theme === 'dark' ? 'bg-green-900' : 'bg-green-100'
                }`}>
                  <MessageSquare size={20} className={theme === 'dark' ? 'text-green-400' : 'text-green-600'} />
                </div>
              </div>
              <p className="text-3xl font-bold">{analyticsData.totalQuestions}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Across {Object.keys(analyticsData.categoryDistribution).length} categories
              </p>
            </div>

            <div className={`p-6 rounded-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Departments</h3>
                <div className={`p-2 rounded-full ${
                  theme === 'dark' ? 'bg-yellow-900' : 'bg-yellow-100'
                }`}>
                  <Users size={20} className={theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'} />
                </div>
              </div>
              <p className="text-3xl font-bold">
                {Object.keys(analyticsData.departmentAnalytics).length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Participating departments
              </p>
            </div>
          </div>

          {/* Response Trends */}
          <div className={`p-6 rounded-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
          }`}>
            <h3 className="text-xl font-semibold mb-6">Response Trends</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={getFilteredTrendData()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tickFormatter={formatYAxisTick}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="responses" 
                    stroke="#4f46e5" 
                    strokeWidth={2}
                    dot={{ fill: '#4f46e5' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Question Analytics */}
          <div className={`p-6 rounded-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
          }`}>
            <h3 className="text-xl font-semibold mb-6">Question Analytics</h3>
            <div className="space-y-8">
              {Object.entries(analyticsData.questionAnalytics).map(([questionId, data]: [string, any]) => (
                <div key={questionId} className="space-y-4">
                  <h4 className="font-medium">{data.text || `Question ${questionId}`}</h4>
                  
                  {data.type === 'rating' && (
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.results}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="rating" 
                            tick={{ fontSize: 12 }}
                            label={{ value: 'Rating', position: 'bottom', offset: 0 }}
                          />
                          <YAxis 
                            tickFormatter={formatYAxisTick}
                            tick={{ fontSize: 12 }}
                            label={{ value: 'Responses', angle: -90, position: 'insideLeft', offset: 10 }}
                          />
                          <Tooltip 
                            formatter={(value: any) => [Math.round(value), 'Responses']}
                          />
                          <Bar dataKey="count" fill="#4f46e5" />
                        </BarChart>
                      </ResponsiveContainer>
                      {data.average && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          Average rating: {data.average.toFixed(1)}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {data.type === 'multiple-choice' && (
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={data.results}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          >
                            {data.results.map((_: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                  
                  {data.type === 'text' && data.responses && (
                    <div className={`max-h-48 overflow-y-auto p-4 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                      {data.responses.map((response: string, index: number) => (
                        <div 
                          key={index}
                          className={`p-3 mb-2 rounded ${
                            theme === 'dark' ? 'bg-gray-600' : 'bg-white shadow'
                          }`}
                        >
                          {response}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Department Analytics */}
          <div className={`p-6 rounded-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
          }`}>
            <h3 className="text-xl font-semibold mb-6">Department Analytics</h3>
            <div className="space-y-6">
              {Object.entries(analyticsData.departmentAnalytics).map(([department, data]: [string, any]) => (
                <div key={department} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{department}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                        ({data.responses} / {data.totalEmployees} responses)
                      </span>
                    </div>
                    <span className="font-semibold">
                      {data.participationRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${data.participationRate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className={`p-12 rounded-lg text-center ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
        }`}>
          <p className="text-xl text-gray-500 dark:text-gray-400">
            {selectedSurveyId ? 'No analytics data available for this survey' : 'Select a survey to view analytics'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Analytics;