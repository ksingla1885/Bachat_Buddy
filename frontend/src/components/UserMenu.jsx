import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function UserMenu() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center space-x-2 sm:space-x-3">
        <Link
          to="/login"
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-medium px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hidden sm:inline"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="btn-primary text-sm px-3 py-2"
        >
          <span className="hidden sm:inline">Sign up</span>
          <span className="sm:hidden">Join</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 sm:space-x-3">
      {/* User Avatar - Responsive */}
      <div className="hidden lg:flex items-center space-x-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 max-w-32">
        <div className="w-7 h-7 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-semibold text-xs">
            {user.name?.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
          {user.name}
        </span>
      </div>

      {/* User Avatar Icon - For medium screens */}
      <div className="lg:hidden w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center cursor-pointer flex-shrink-0">
        <span className="text-white font-semibold text-sm" title={user.name}>
          {user.name?.charAt(0).toUpperCase()}
        </span>
      </div>

      {/* Logout Button - Responsive */}
      <button
        onClick={logout}
        className="btn-danger text-sm px-3 py-2 hidden sm:flex items-center space-x-2 flex-shrink-0"
        title="Logout"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span className="hidden lg:inline">Logout</span>
      </button>

      {/* Mobile Logout Icon */}
      <button
        onClick={logout}
        className="sm:hidden p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 flex-shrink-0"
        title="Logout"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </div>
  );
}

export default UserMenu;
