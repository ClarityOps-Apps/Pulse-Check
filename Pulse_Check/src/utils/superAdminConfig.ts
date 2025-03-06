// Super admin configuration
export const SUPER_ADMIN_EMAIL = 'garrett@clarityops.co';

// Function to check if a user is the super admin
export const isSuperAdmin = (email: string): boolean => {
  return email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
};