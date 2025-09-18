import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

function Navbar() {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: '📊' },
    { path: '/wallets', name: 'Wallets', icon: '💳' },
    { path: '/transactions', name: 'Transactions', icon: '💸' },
    { path: '/budgets', name: 'Budgets', icon: '📈' },
  ];

  const isLandingPage = location.pathname === '/';

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-lg border-b shadow-soft transition-all duration-300 ${
      isLandingPage 
        ? 'bg-white/90 dark:bg-gray-900/90 border-gray-200/30 dark:border-gray-700/30' 
        : 'bg-white/80 dark:bg-gray-900/80 border-gray-200/20 dark:border-gray-700/20'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2 group"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-lg">₹</span>
              </div>
              <span className="text-2xl font-bold text-gradient">
                BachatBuddy
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-medium'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  } px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-2 group`}
                >
                  <span className="text-lg group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          )}

          {/* Right side controls */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 group"
            >
              {darkMode ? (
                <svg className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
                  />
                </svg>
              ) : (
                <svg className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            {user ? (
              <div className="flex items-center space-x-3">
                {/* User Avatar */}
                <div className="hidden sm:flex items-center space-x-3 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user.name}
                  </span>
                </div>
                
                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="btn-danger text-sm"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary text-sm"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            {user && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {user && isMobileMenuOpen && (
          <div className="md:hidden py-4 animate-fadeInUp">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  } px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-3`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
