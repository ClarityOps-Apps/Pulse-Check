import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, BarChart2, AlertTriangle, Clock, Activity, Shield } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import authService from '../../services/authService';
import { User, UserActivity } from '../../types/user';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    admins: 0,
    newUsersToday: 0,
    activitiesToday: 0
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load users
        const usersData = await authService.getAllUsers();
        setUsers(usersData);
        
        // Load activities
        const activitiesData = await authService.getUserActivities();
        setActivities(activitiesData);
        
        // Calculate stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const activeUsers = usersData.filter(user => user.isActive).length;
        const admins = usersData.filter(user => user.isAdmin).length;
        const newUsersToday = usersData.filter(user => {
          const createdDate = new Date(user.createdAt);
          return createdDate >= today;
        }).length;
        
        const activitiesToday = activitiesData.filter(activity => {
          const activityDate = new Date(activity.timestamp);
          return activityDate >= today;
        }).length;
        
        setStats({
          totalUsers: usersData.length,
          activeUsers,
          admins,
          newUsersToday,
          activitiesToday
        });
      } catch (error) {
        console.error('Error loading admin dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Get recent activities (last 10)
  const recentActivities = activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  // Get recent users (last 5)
  const recentUsers = users
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  // Check if user is super admin
  if (!user?.isSuperAdmin) {
    return (
      <div className="p-6 bg-red-100 text-red-700 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p>You do not have permission to access the Super Admin Dashboard. This area is restricted to the system super administrator only.</p>
        <Link to="/" className="mt-4 inline-block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-red-500 dark:text-red-400">Super Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">System overview and management</p>
        </div>
        
        <Link 
          to="/admin/users" 
          className={`flex items-center px-4 py-2 rounded-lg ${
            theme === 'dark' 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          <Users size={18} className="mr-2" />
          <span>Manage Users</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Total Users</h3>
            <div className={`p-2 rounded-full ${
              theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'
            }`}>
              <Users size={20} className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {stats.activeUsers} active ({Math.round((stats.activeUsers / stats.totalUsers) * 100)}%)
          </p>
        </div>

        <div className={`p-6 rounded-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Admin Users</h3>
            <div className={`p-2 rounded-full ${
              theme === 'dark' ? 'bg-red-900' : 'bg-red-100'
            }`}>
              <Shield size={20} className={theme === 'dark' ? 'text-red-400' : 'text-red-600'} />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.admins}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {Math.round((stats.admins / stats.totalUsers) * 100)}% of total users
          </p>
        </div>

        <div className={`p-6 rounded-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Today's Activity</h3>
            <div className={`p-2 rounded-full ${
              theme === 'dark' ? 'bg-green-900' : 'bg-green-100'
            }`}>
              <Activity size={20} className={theme === 'dark' ? 'text-green-400' : 'text-green-600'} />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.activitiesToday}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {stats.newUsersToday} new users today
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className={`rounded-lg overflow-hidden ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
        }`}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold">Recent Activities</h2>
          </div>
          <div className="p-6">
            {recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const user = users.find(u => u.id === activity.userId);
                  const activityDate = new Date(activity.timestamp);
                  
                  // Determine icon and color based on action
                  let icon;
                  let bgColor;
                  
                  if (activity.action.includes('login')) {
                    icon = <Users size={16} />;
                    bgColor = theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100';
                  } else if (activity.action.includes('register')) {
                    icon = <Users size={16} />;
                    bgColor = theme === 'dark' ? 'bg-green-900' : 'bg-green-100';
                  } else if (activity.action.includes('admin')) {
                    icon = <Shield size={16} />;
                    bgColor = theme === 'dark' ? 'bg-red-900' : 'bg-red-100';
                  } else if (activity.action.includes('profile')) {
                    icon = <Users size={16} />;
                    bgColor = theme === 'dark' ? 'bg-purple-900' : 'bg-purple-100';
                  } else {
                    icon = <Activity size={16} />;
                    bgColor = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100';
                  }
                  
                  return (
                    <div key={activity.id} className="flex items-start">
                      <div className={`p-2 rounded-full mr-3 ${bgColor}`}>
                        {icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{user ? `${user.firstName} ${user.lastName}` : 'Unknown User'}</span>
                          {' '}
                          <span className="text-gray-500 dark:text-gray-400">{activity.details}</span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {activityDate.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">No recent activities</p>
            )}
          </div>
        </div>
        
        {/* Recent Users */}
        <div className={`rounded-lg overflow-hidden ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
        }`}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold">Recent Users</h2>
          </div>
          <div className="p-6">
            {recentUsers.length > 0 ? (
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <span className="font-medium text-sm">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                    <div className="flex items-center">
                      <span className={`text-xs px-2 py-1 rounded-full mr-2 ${
                        user.isSuperAdmin
                          ? theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                          : user.isAdmin
                            ? theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                            : theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.isSuperAdmin ? 'Super Admin' : user.isAdmin ? 'Admin' : 'User'}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        user.isActive
                          ? theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                          : theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">No recent users</p>
            )}
          </div>
        </div>
      </div>
      
      {/* System Alerts */}
      <div className={`p-6 rounded-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">System Alerts</h2>
          <span className={`text-xs px-2 py-1 rounded-full ${
            theme === 'dark' ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
          }`}>
            2 new alerts
          </span>
        </div>
        
        <div className="space-y-4">
          <div className={`p-4 rounded-lg border ${
            theme === 'dark' ? 'border-yellow-800 bg-yellow-900/20' : 'border-yellow-200 bg-yellow-50'
          }`}>
            <div className="flex items-start">
              <div className="p-1 rounded-full mr-3">
                <AlertTriangle size={20} className="text-yellow-500" />
              </div>
              <div>
                <p className="font-medium">System update scheduled</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  A system update is scheduled for June 15, 2025 at 2:00 AM UTC. The system will be unavailable for approximately 30 minutes.
                </p>
              </div>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg border ${
            theme === 'dark' ? 'border-red-800 bg-red-900/20' : 'border-red-200 bg-red-50'
          }`}>
            <div className="flex items-start">
              <div className="p-1 rounded-full mr-3">
                <AlertTriangle size={20} className="text-red-500" />
              </div>
              <div>
                <p className="font-medium">High server load detected</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  The server is experiencing higher than normal load. Performance may be affected. Our team is investigating.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;