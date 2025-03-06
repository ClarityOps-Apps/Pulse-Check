import authService from '../services/authService';

// Function to grant admin privileges to the current user
export const setupAdminAccess = async () => {
  try {
    // Get the current user
    const currentUser = await authService.getCurrentUser();
    
    if (!currentUser) {
      console.error('No user is currently logged in. Please log in first.');
      return false;
    }
    
    // Grant admin privileges to the current user
    const updatedUser = await authService.setAdminStatus(currentUser.id, true);
    
    if (updatedUser) {
      console.log('Admin privileges granted successfully!');
      return true;
    } else {
      console.error('Failed to grant admin privileges.');
      return false;
    }
  } catch (error) {
    console.error('Error setting up admin access:', error);
    return false;
  }
};

// Function to check if the current user has admin privileges
export const checkAdminStatus = async () => {
  try {
    const currentUser = await authService.getCurrentUser();
    return currentUser?.isAdmin || false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};