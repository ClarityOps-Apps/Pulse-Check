import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const UserProfile = () => {
  const { theme } = useTheme();
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    company: user?.company || '',
    position: user?.position || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError('Please fill in all required fields');
      setSuccess('');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const success = await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        company: formData.company,
        position: formData.position
      });
      
      if (success) {
        setSuccess('Profile updated successfully');
      } else {
        setError('Failed to update profile');
      }
    } catch (err) {
      setError('An error occurred while updating your profile');
      console.error('Profile update error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('Please fill in all password fields');
      setSuccess('');
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      setSuccess('');
      return;
    }
    
    if (formData.newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      setSuccess('');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    // In a real app, this would call an API to update the password
    // For this demo, we'll just simulate a successful update
    setTimeout(() => {
      setSuccess('Password updated successfully');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your account settings and preferences</p>
      </div>
      
      <div className={`rounded-lg overflow-hidden ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
      }`}>
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex">
            {['profile', 'security', 'preferences'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 font-medium text-sm ${
                  activeTab === tab
                    ? theme === 'dark'
                      ? 'border-b-2 border-indigo-500 text-indigo-400'
                      : 'border-b-2 border-indigo-500 text-indigo-600'
                    : theme === 'dark'
                      ? 'text-gray-400 hover:text-gray-300'
                      : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              {error && (
                <div className="p-3 rounded flex items-start bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200">
                  <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              
              {success && (
                <div className="p-3 rounded flex items-start bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200">
                  <CheckCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                  <span>{success}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-4">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <User size={40} className="text-gray-400" />
                </div>
                <div>
                  <h2 className="text-lg font-medium">{user?.firstName} {user?.lastName}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                  {user?.isAdmin && (
                    <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
                      theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                    }`}>
                      Admin
                    </span>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full p-2.5 rounded border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 focus:border-indigo-500' 
                        : 'border-gray-300 focus:border-indigo-500'
                    } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full p-2.5 rounded border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 focus:border-indigo-500' 
                        : 'border-gray-300 focus:border-indigo-500'
                    } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled
                    className={`w-full p-2.5 rounded border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 opacity-70' 
                        : 'bg-gray-100 border-gray-300 opacity-70'
                    } cursor-not-allowed`}
                  />
                  <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium mb-1">
                    Company
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleChange}
                    className={`w-full p-2.5 rounded border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 focus:border-indigo-500' 
                        : 'border-gray-300 focus:border-indigo-500'
                    } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                  />
                </div>
                
                <div>
                  <label htmlFor="position" className="block text-sm font-medium mb-1">
                    Position
                  </label>
                  <input
                    id="position"
                    name="position"
                    type="text"
                    value={formData.position}
                    onChange={handleChange}
                    className={`w-full p-2.5 rounded border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 focus:border-indigo-500' 
                        : 'border-gray-300 focus:border-indigo-500'
                    } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-lg flex items-center ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  } ${
                    theme === 'dark' 
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} className="mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
          
          {activeTab === 'security' && (
            <form onSubmit={handlePasswordUpdate} className="space-y-6">
              {error && (
                <div className="p-3 rounded flex items-start bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200">
                  <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              
              {success && (
                <div className="p-3 rounded flex items-start bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200">
                  <CheckCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                  <span>{success}</span>
                </div>
              )}
              
              <h2 className="text-lg font-medium">Change Password</h2>
              
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">
                  Current Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className={`w-full p-2.5 rounded border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 focus:border-indigo-500' 
                      : 'border-gray-300 focus:border-indigo-500'
                  } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                  placeholder="••••••••"
                />
              </div>
              
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                  New Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={`w-full p-2.5 rounded border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 focus:border-indigo-500' 
                      : 'border-gray-300 focus:border-indigo-500'
                  } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                  placeholder="••••••••"
                />
                <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters long</p>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full p-2.5 rounded border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 focus:border-indigo-500' 
                      : 'border-gray-300 focus:border-indigo-500'
                  } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                  placeholder="••••••••"
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-lg flex items-center ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  } ${
                    theme === 'dark' 
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : 'Update Password'}
                </button>
              </div>
            </form>
          )}
          
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium">Notification Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive email notifications for survey responses</p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input type="checkbox" className="sr-only" defaultChecked />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${
                        theme === 'dark' ? 'bg-indigo-600' : 'bg-indigo-600'
                      }`}></div>
                      <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-4"></div>
                    </div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Survey Completion Reminders</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive reminders for incomplete surveys</p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input type="checkbox" className="sr-only" defaultChecked />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${
                        theme === 'dark' ? 'bg-indigo-600' : 'bg-indigo-600'
                      }`}></div>
                      <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-4"></div>
                    </div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Weekly Reports</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive weekly summary reports</p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input type="checkbox" className="sr-only" />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                      }`}></div>
                      <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                    </div>
                  </label>
                </div>
              </div>
              
              <h2 className="text-lg font-medium pt-4 border-t border-gray-200 dark:border-gray-700">Display Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Dark Mode</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark theme</p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={theme === 'dark'}
                        onChange={() => {}}
                      />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${
                        theme === 'dark' ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${
                        theme === 'dark' ? 'transform translate-x-4' : ''
                      }`}></div>
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg ${
                    theme === 'dark' 
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;