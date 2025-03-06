export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  position?: string;
  isAdmin: boolean;
  isSuperAdmin?: boolean;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
}