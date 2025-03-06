import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  BarChart2, 
  Settings, 
  HelpCircle, 
  Users, 
  Shield, 
  Activity,
  User
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  isAdmin?: boolean;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isAdmin = false, className = '' }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  
  const regularNavItems = [
    { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/create', icon: <PlusCircle size={20} />, label: 'Create Survey' },
    { path: '/analytics', icon: <BarChart2 size={20} />, label: 'Analytics' },
    { path: '/profile', icon: <User size={20} />, label: 'My Profile' },
    { path: '/settings', icon: <Settings size={20} />, label: 'Settings' },
    { path: '/help', icon: <HelpCircle size={20} />, label: 'Help' },
  ];

  const adminNavItems = [
    { path: '/admin', icon: <Shield size={20} />, label: 'Admin Dashboard' },
    { path: '/admin/users', icon: <Users size={20} />, label: 'User Management' },
    { path: '/analytics', icon: <Activity size={20} />, label: 'System Analytics' },
    { path: '/settings', icon: <Settings size={20} />, label: 'System Settings' },
  ];

  const navItems = isAdmin ? adminNavItems : regularNavItems;

  // Add admin panel link for super admin users when in regular view
  if (!isAdmin && user?.isSuperAdmin) {
    navItems.push({ 
      path: '/admin', 
      icon: <Shield size={20} />, 
      label: 'Super Admin Panel',
      highlight: true
    });
  }

  // Add regular dashboard link for super admin users when in admin view
  if (isAdmin && user?.isSuperAdmin) {
    navItems.push({ 
      path: '/', 
      icon: <LayoutDashboard size={20} />, 
      label: 'Regular Dashboard',
      highlight: true
    });
  }

  return (
    <aside className={`w-64 h-full ${
      theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-700'
    } border-r ${
      theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
    } ${className}`}>
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-lg transition-colors ${
                    isActive 
                      ? theme === 'dark' 
                        ? 'bg-gray-700 text-white' 
                        : 'bg-indigo-50 text-indigo-700'
                      : theme === 'dark'
                        ? 'hover:bg-gray-700'
                        : 'hover:bg-gray-100'
                  } ${
                    item.highlight 
                      ? isAdmin 
                        ? 'border border-blue-500 dark:border-blue-400' 
                        : 'border border-red-500 dark:border-red-400'
                      : ''
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;