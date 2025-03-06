import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useTheme } from '../contexts/ThemeContext';

interface LayoutProps {
  isAdmin?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ isAdmin = false }) => {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Header isAdmin={isAdmin} className="fixed top-0 left-0 right-0 z-50" />
      <div className="flex flex-1">
        <Sidebar isAdmin={isAdmin} className="fixed left-0 top-[64px] bottom-0 w-64 z-40 overflow-y-auto" />
        <main className="flex-1 pl-64 pt-[64px]">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;