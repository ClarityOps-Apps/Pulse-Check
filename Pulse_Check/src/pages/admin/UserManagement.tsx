import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Shield, 
  UserX, 
  UserCheck, 
  MoreHorizontal, 
  AlertTriangle,
  X,
  Check
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import authService from '../../services/authService';
import { User } from '../../types/user';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const UserManagement = () => {
  const { theme } = useTheme();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'user' | 'superadmin'>('all');
  const [userToModify, setUserToModify] = useState<User | null>(null);
  const [actionType, setActionType] = useState<'delete' | 'activate' | 'deactivate' | 'makeAdmin' | 'removeAdmin' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Load users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const usersData = await authService.getAllUsers();
        console.log('Loaded users:', usersData); // Debug log
        setUsers(usersData);
        setFilteredUsers(usersData);
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUsers();
  }, []);

  // Filter users based on search term and filters
  useEffect(() => {
    let result = users;
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.firstName.toLowerCase().includes(term) ||
        user.lastName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        (user.company && user.company.toLowerCase().includes(term))
      );
    }
    
    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(user => 
        filterStatus === 'active' ? user.isActive : !user.isActive
      );
    }
    
    // Apply role filter
    if (filterRole !== 'all') {
      if (filterRole === 'superadmin') {
        result = result.filter(user => user.isSuperAdmin);
      } else if (filterRole === 'admin') {
        result = result.filter(user => user.isAdmin && !user.isSuperAdmin);
      } else {
        result = result.filter(user => !user.isAdmin);
      }
    }
    
    setFilteredUsers(result);
  }, [users, searchTerm, filterStatus, filterRole]);

  // Handle user actions
  const handleUserAction = async () => {
    if (!userToModify || !actionType) return;
    
    setIsProcessing(true);
    try {
      let success = false;
      let message = '';
      
      switch (actionType) {
        case 'delete':
          success = await authService.deleteUser(userToModify.id);
          message = `User ${userToModify.firstName} ${userToModify.lastName} has been deleted`;
          break;
        case 'activate':
          const activatedUser = await authService.updateUserStatus(userToModify.id, true);
          success = !!activatedUser;
          message = `User ${userToModify.firstName} ${userToModify.lastName} has been activated`;
          break;
        case 'deactivate':
          const deactivatedUser = await authService.updateUserStatus(userToModify.id, false);
          success = !!deactivatedUser;
          message = `User ${userToModify.firstName} ${userToModify.lastName} has been deactivated`;
          break;
        case 'makeAdmin':
          const newAdmin = await authService.setAdminStatus(userToModify.id, true);
          success = !!newAdmin;
          message = `Admin privileges granted to ${userToModify.firstName} ${userToModify.lastName}`;
          break;
        case 'removeAdmin':
          const removedAdmin = await authService.setAdminStatus(userToModify.id, false);
          success = !!removedAdmin;
          message = `Admin privileges removed from ${userToModify.firstName} ${userToModify.lastName}`;
          break;
      }
      
      if (success) {
        // Refresh user list
        const updatedUsers = await authService.getAllUsers();
        setUsers(updatedUsers);
        setSuccessMessage(message);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error performing user action:', error);
    } finally {
      setIsProcessing(false);
      setUserToModify(null);
      setActionType(null);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterRole('all');
  };

  // Check if user is super admin
  if (!currentUser?.isSuperAdmin) {
    return (
      <div className="p-6 bg-red-100 text-red-700 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p>You do not have permission to access the User Management. This area is restricted to the system super administrator only.</p>
        <Link to="/" className="mt-4 inline-block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-red-500 dark:text-red-400">User Management</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage user accounts and permissions</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={`p-4 rounded-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users by name, email, or company..."
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 focus:border-red-500' 
                  : 'border-gray-300 focus:border-red-500'
              } focus:outline-none focus:ring-1 focus:ring-red-500`}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Filter size={18} className="mr-2 text-gray-500" />
              <span className="text-sm font-medium mr-2">Filters:</span>
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className={`p-2 rounded border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 focus:border-red-500' 
                  : 'border-gray-300 focus:border-red-500'
              } focus:outline-none focus:ring-1 focus:ring-red-500`}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              className={`p-2 rounded border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 focus:border-red-500' 
                  : 'border-gray-300 focus:border-red-500'
              } focus:outline-none focus:ring-1 focus:ring-red-500`}
            >
              <option value="all">All Roles</option>
              <option value="superadmin">Super Admin</option>
              <option value="admin">Admins</option>
              <option value="user">Regular Users</option>
            </select>
            
            {(searchTerm || filterStatus !== 'all' || filterRole !== 'all') && (
              <button
                onClick={clearFilters}
                className={`p-2 rounded ${
                  theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
                title="Clear filters"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className={`p-4 rounded-lg flex items-center ${
          theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
        }`}>
          <Check size={20} className="mr-2" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Users Table */}
      <div className={`rounded-lg overflow-hidden ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Registered</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className={theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                        }`}>
                          <span className="font-medium text-sm">
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{user.firstName} {user.lastName}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{user.position || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.company || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.isActive
                          ? theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                          : theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.isSuperAdmin
                          ? theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                          : user.isAdmin
                            ? theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                            : theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.isSuperAdmin ? 'Super Admin' : user.isAdmin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {!user.isSuperAdmin && (
                          <>
                            {user.isActive ? (
                              <button
                                onClick={() => {
                                  setUserToModify(user);
                                  setActionType('deactivate');
                                }}
                                className={`p-1.5 rounded ${
                                  theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                                }`}
                                title="Deactivate user"
                              >
                                <UserX size={18} className="text-red-500" />
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setUserToModify(user);
                                  setActionType('activate');
                                }}
                                className={`p-1.5 rounded ${
                                  theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                                }`}
                                title="Activate user"
                              >
                                <UserCheck size={18} className="text-green-500" />
                              </button>
                            )}
                            
                            {user.isAdmin && !user.isSuperAdmin ? (
                              <button
                                onClick={() => {
                                  setUserToModify(user);
                                  setActionType('removeAdmin');
                                }}
                                className={`p-1.5 rounded ${
                                  theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                                }`}
                                title="Remove admin privileges"
                              >
                                <Shield size={18} className="text-red-500" />
                              </button>
                            ) : !user.isAdmin && (
                              <button
                                onClick={() => {
                                  setUserToModify(user);
                                  setActionType('makeAdmin');
                                }}
                                className={`p-1.5 rounded ${
                                  theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                                }`}
                                title="Grant admin privileges"
                              >
                                <Shield size={18} className="text-gray-400" />
                              </button>
                            )}
                            
                            <button
                              onClick={() => {
                                setUserToModify(user);
                                setActionType('delete');
                              }}
                              className={`p-1.5 rounded ${
                                theme === 'dark' ? 'hover:bg-gray-700 text-gray-400 hover:text-red-400' : 'hover:bg-gray-100 text-gray-500 hover:text-red-500'
                              }`}
                              title="Delete user"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">
                    <p className="text-gray-500 dark:text-gray-400">No users found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {userToModify && actionType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <AlertTriangle size={20} className="text-red-500 mr-2" />
                <h3 className="text-lg font-semibold">Confirm Action</h3>
              </div>
              <button 
                onClick={() => {
                  setUserToModify(null);
                  setActionType(null);
                }}
                className={`p-1 rounded-full ${
                  theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <p>
                Are you sure you want to {actionType === 'delete' ? 'delete' : 
                                          actionType === 'activate' ? 'activate' : 
                                          actionType === 'deactivate' ? 'deactivate' : 
                                          actionType === 'makeAdmin' ? 'grant admin privileges to' : 
                                          'remove admin privileges from'} <strong>{userToModify.firstName} {userToModify.lastName}</strong>?
              </p>
              
              {actionType === 'delete' && (
                <div className={`p-3 rounded-lg ${
                  theme === 'dark' ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-100'
                }`}>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    <strong>Warning:</strong> This action cannot be undone. The user account will be permanently deleted.
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-2 p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setUserToModify(null);
                  setActionType(null);
                }}
                className={`px-4 py-2 rounded ${
                  theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleUserAction}
                disabled={isProcessing}
                className={`px-4 py-2 rounded ${
                  isProcessing ? 'opacity-70 cursor-not-allowed' : ''
                } ${
                  actionType === 'delete' || actionType === 'deactivate' || actionType === 'removeAdmin'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  actionType === 'delete' ? 'Delete User' : 
                  actionType === 'activate' ? 'Activate User' : 
                  actionType === 'deactivate' ? 'Deactivate User' : 
                  actionType === 'makeAdmin' ? 'Grant Admin Access' : 
                  'Remove Admin Access'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;