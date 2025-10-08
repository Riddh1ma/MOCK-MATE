import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  Home,
  BookOpen,
  Code,
  MessageCircle,
  Calendar,
  BarChart3,
  User,
  Settings,
  Moon,
  Sun,
  LogOut,
  Shield,
  X,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Practice', href: '/practice', icon: BookOpen },
    { name: 'Schedule Interview', href: '/schedule', icon: Calendar },
    { name: 'Performance', href: '/performance', icon: BarChart3 },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const adminNavigation = [
    { name: 'Admin Dashboard', href: '/admin', icon: Shield },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MM</span>
            </div>
          </div>
          <div className="ml-3">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Mock-Mate
            </h1>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <span className="text-primary-600 dark:text-primary-400 font-medium">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user?.role}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'}`
            }
            onClick={onClose}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}

        {/* Admin navigation */}
        {isAdmin && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Admin
            </p>
            <div className="mt-2 space-y-1">
              {adminNavigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `sidebar-item ${isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'}`
                  }
                  onClick={onClose}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Bottom actions */}
      <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full sidebar-item sidebar-item-inactive"
        >
          {isDark ? (
            <Sun className="mr-3 h-5 w-5" />
          ) : (
            <Moon className="mr-3 h-5 w-5" />
          )}
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
        
        <button
          onClick={handleLogout}
          className="w-full sidebar-item sidebar-item-inactive text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onClose} />
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800"
          >
            <SidebarContent />
          </motion.div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <SidebarContent />
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
