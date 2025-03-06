import { User } from '../types/user';
import { v4 as uuidv4 } from 'uuid';
import { isSuperAdmin } from '../utils/superAdminConfig';

// Keys for localStorage
const KEYS = {
  USERS: 'pulsecheck_users',
  CURRENT_USER: 'pulsecheck_current_user',
  USER_ACTIVITIES: 'pulsecheck_user_activities'
};

// Authentication Service
const authService = {
  // User authentication methods
  login: async (email: string, password: string): Promise<User | null> => {
    try {
      // In a real app, this would be an API call
      const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
      const user = users.find((u: User) => u.email.toLowerCase() === email.toLowerCase());
      
      if (!user) {
        return null; // User not found
      }
      
      // In a real app, we would hash and compare passwords
      // For demo purposes, we're using a simple check
      const passwordsMatch = localStorage.getItem(`${KEYS.USERS}_${user.id}_password`) === password;
      
      if (!passwordsMatch) {
        return null; // Password doesn't match
      }
      
      if (!user.isActive) {
        return null; // User account is inactive
      }
      
      // Update last login time
      const updatedUser = {
        ...user,
        lastLogin: new Date().toISOString()
      };
      
      // Update user in storage
      const updatedUsers = users.map((u: User) => 
        u.id === updatedUser.id ? updatedUser : u
      );
      localStorage.setItem(KEYS.USERS, JSON.stringify(updatedUsers));
      
      // Set current user
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(updatedUser));
      
      // Log activity
      authService.logUserActivity(updatedUser.id, 'login', 'User logged in');
      
      return updatedUser;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  },
  
  register: async (userData: Partial<User>, password: string): Promise<User | null> => {
    try {
      // In a real app, this would be an API call
      const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
      
      // Check if email already exists
      const emailExists = users.some((u: User) => 
        u.email.toLowerCase() === userData.email?.toLowerCase()
      );
      
      if (emailExists) {
        throw new Error('Email already in use');
      }
      
      // Check if this is the super admin email
      const isSuperAdminUser = userData.email ? isSuperAdmin(userData.email) : false;
      
      // Create new user
      const newUser: User = {
        id: uuidv4(),
        email: userData.email || '',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        company: userData.company || '',
        position: userData.position || '',
        isAdmin: true, // All users are admins of their own surveys
        isSuperAdmin: isSuperAdminUser, // Only the super admin email gets super admin privileges
        isActive: true, // New users are active by default
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      
      // Save user
      users.push(newUser);
      localStorage.setItem(KEYS.USERS, JSON.stringify(users));
      
      // Save password separately (in a real app, this would be hashed)
      localStorage.setItem(`${KEYS.USERS}_${newUser.id}_password`, password);
      
      // Set current user
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(newUser));
      
      // Log activity
      authService.logUserActivity(newUser.id, 'register', 'User registered');
      
      return newUser;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  logout: () => {
    try {
      // Get current user before removing
      const currentUser = JSON.parse(localStorage.getItem(KEYS.CURRENT_USER) || 'null');
      
      // Log activity if user exists
      if (currentUser) {
        authService.logUserActivity(currentUser.id, 'logout', 'User logged out');
      }
      
      // Remove current user
      localStorage.removeItem(KEYS.CURRENT_USER);
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
  
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const currentUser = localStorage.getItem(KEYS.CURRENT_USER);
      return currentUser ? JSON.parse(currentUser) : null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },
  
  // User management methods
  getAllUsers: async (): Promise<User[]> => {
    try {
      const users = localStorage.getItem(KEYS.USERS);
      console.log('Raw users from localStorage:', users); // Debug log
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Get all users error:', error);
      return [];
    }
  },
  
  getUserById: async (id: string): Promise<User | null> => {
    try {
      const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
      return users.find((u: User) => u.id === id) || null;
    } catch (error) {
      console.error('Get user by ID error:', error);
      return null;
    }
  },
  
  updateProfile: async (id: string, updates: Partial<User>): Promise<User | null> => {
    try {
      const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
      const userIndex = users.findIndex((u: User) => u.id === id);
      
      if (userIndex === -1) {
        return null; // User not found
      }
      
      // Update user
      const updatedUser = {
        ...users[userIndex],
        ...updates
      };
      
      users[userIndex] = updatedUser;
      localStorage.setItem(KEYS.USERS, JSON.stringify(users));
      
      // Update current user if it's the same user
      const currentUser = JSON.parse(localStorage.getItem(KEYS.CURRENT_USER) || 'null');
      if (currentUser && currentUser.id === id) {
        localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(updatedUser));
      }
      
      // Log activity
      authService.logUserActivity(id, 'profile_update', 'User profile updated');
      
      return updatedUser;
    } catch (error) {
      console.error('Update profile error:', error);
      return null;
    }
  },
  
  updateUserStatus: async (id: string, isActive: boolean): Promise<User | null> => {
    try {
      const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
      const userIndex = users.findIndex((u: User) => u.id === id);
      
      if (userIndex === -1) {
        return null; // User not found
      }
      
      // Update user status
      users[userIndex].isActive = isActive;
      localStorage.setItem(KEYS.USERS, JSON.stringify(users));
      
      // Log activity
      const action = isActive ? 'user_activated' : 'user_deactivated';
      const details = isActive ? 'User account activated' : 'User account deactivated';
      authService.logUserActivity(id, action, details);
      
      return users[userIndex];
    } catch (error) {
      console.error('Update user status error:', error);
      return null;
    }
  },
  
  deleteUser: async (id: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
      const filteredUsers = users.filter((u: User) => u.id !== id);
      
      if (filteredUsers.length === users.length) {
        return false; // User not found
      }
      
      localStorage.setItem(KEYS.USERS, JSON.stringify(filteredUsers));
      
      // Remove password
      localStorage.removeItem(`${KEYS.USERS}_${id}_password`);
      
      // Log activity (using admin ID for now)
      const currentUser = JSON.parse(localStorage.getItem(KEYS.CURRENT_USER) || 'null');
      if (currentUser) {
        authService.logUserActivity(currentUser.id, 'user_deleted', `User ${id} deleted`);
      }
      
      return true;
    } catch (error) {
      console.error('Delete user error:', error);
      return false;
    }
  },
  
  // Admin methods
  setAdminStatus: async (id: string, isAdmin: boolean): Promise<User | null> => {
    try {
      const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
      const userIndex = users.findIndex((u: User) => u.id === id);
      
      if (userIndex === -1) {
        return null; // User not found
      }
      
      // Update admin status
      users[userIndex].isAdmin = isAdmin;
      localStorage.setItem(KEYS.USERS, JSON.stringify(users));
      
      // Update current user if it's the same user
      const currentUser = JSON.parse(localStorage.getItem(KEYS.CURRENT_USER) || 'null');
      if (currentUser && currentUser.id === id) {
        currentUser.isAdmin = isAdmin;
        localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(currentUser));
      }
      
      // Log activity
      const action = isAdmin ? 'admin_granted' : 'admin_revoked';
      const details = isAdmin ? 'Admin privileges granted' : 'Admin privileges revoked';
      authService.logUserActivity(id, action, details);
      
      return users[userIndex];
    } catch (error) {
      console.error('Set admin status error:', error);
      return null;
    }
  },
  
  // User activity logging
  logUserActivity: (userId: string, action: string, details: string): void => {
    try {
      const activities = JSON.parse(localStorage.getItem(KEYS.USER_ACTIVITIES) || '[]');
      
      const newActivity = {
        id: uuidv4(),
        userId,
        action,
        details,
        timestamp: new Date().toISOString()
      };
      
      activities.push(newActivity);
      localStorage.setItem(KEYS.USER_ACTIVITIES, JSON.stringify(activities));
    } catch (error) {
      console.error('Log user activity error:', error);
    }
  },
  
  getUserActivities: async (userId?: string): Promise<any[]> => {
    try {
      const activities = JSON.parse(localStorage.getItem(KEYS.USER_ACTIVITIES) || '[]');
      
      if (userId) {
        return activities.filter((a: any) => a.userId === userId);
      }
      
      return activities;
    } catch (error) {
      console.error('Get user activities error:', error);
      return [];
    }
  }
};

export default authService;