import React from 'react';
import { Link } from 'react-router-dom';

function Goals() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg">
          <span className="text-3xl">🎯</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Saving Goals
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Set financial targets, track your progress, and achieve your dreams with our comprehensive goal-setting system.
          </p>
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold shadow-lg">
            🚧 Coming Soon
          </div>
        </div>
      </div>

      {/* Features Preview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Goal Setting */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center mb-4">
            <span className="text-xl">🎯</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Smart Goal Setting
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Create specific, measurable, achievable, relevant, and time-bound (SMART) financial goals with our intelligent goal-setting wizard.
          </p>
        </div>

        {/* Progress Tracking */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mb-4">
            <span className="text-xl">📊</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Progress Tracking
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Monitor your progress with beautiful charts and visualizations. See exactly how close you are to achieving your financial targets.
          </p>
        </div>

        {/* Automated Savings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center mb-4">
            <span className="text-xl">💰</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Automated Savings
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Set up automatic transfers to your goal accounts. Round-up transactions and save the difference effortlessly.
          </p>
        </div>

        {/* Milestone Celebrations */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mb-4">
            <span className="text-xl">🎉</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Milestone Celebrations
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Celebrate your achievements with badges, rewards, and gamification elements that make saving fun and motivating.
          </p>
        </div>

        {/* Goal Categories */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center mb-4">
            <span className="text-xl">🏷️</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Goal Categories
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Organize your goals by categories like emergency fund, vacation, home purchase, education, and custom categories.
          </p>
        </div>

        {/* Notifications & Reminders */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
            <span className="text-xl">🔔</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Smart Notifications
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Get reminded about your goals, receive progress updates, and stay motivated with personalized notifications.
          </p>
        </div>
      </div>

      {/* Coming Soon Message */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-center text-white shadow-xl">
        <h2 className="text-2xl font-bold mb-4">🚀 Exciting Features Coming Soon!</h2>
        <p className="text-lg opacity-90 mb-6">
          We're working hard to bring you the most comprehensive goal-setting and achievement tracking system.
          Stay tuned for these amazing features!
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <span className="bg-white/20 px-4 py-2 rounded-full">Multi-Goal Management</span>
          <span className="bg-white/20 px-4 py-2 rounded-full">Progress Analytics</span>
          <span className="bg-white/20 px-4 py-2 rounded-full">Automated Savings Plans</span>
          <span className="bg-white/20 px-4 py-2 rounded-full">Achievement Badges</span>
          <span className="bg-white/20 px-4 py-2 rounded-full">Social Goal Sharing</span>
          <span className="bg-white/20 px-4 py-2 rounded-full">Goal Templates</span>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Want to be notified when Goals launches?
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Join our waitlist and be the first to know when this feature becomes available!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/dashboard"
            className="btn-primary"
          >
            Back to Dashboard
          </Link>
          <button className="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300">
            Join Waitlist (Soon)
          </button>
        </div>
      </div>

      {/* Related Features */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
          💡 Meanwhile, explore these features:
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/wallets"
            className="bg-white dark:bg-gray-700 p-4 rounded-xl hover:shadow-lg transition-all duration-300 text-center group"
          >
            <div className="text-2xl mb-2">💳</div>
            <div className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
              Wallets
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Manage multiple accounts
            </div>
          </Link>

          <Link
            to="/budgets"
            className="bg-white dark:bg-gray-700 p-4 rounded-xl hover:shadow-lg transition-all duration-300 text-center group"
          >
            <div className="text-2xl mb-2">📈</div>
            <div className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
              Budgets
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Plan your spending
            </div>
          </Link>

          <Link
            to="/transactions"
            className="bg-white dark:bg-gray-700 p-4 rounded-xl hover:shadow-lg transition-all duration-300 text-center group"
          >
            <div className="text-2xl mb-2">💸</div>
            <div className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
              Transactions
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Track your money
            </div>
          </Link>

          <Link
            to="/debts"
            className="bg-white dark:bg-gray-700 p-4 rounded-xl hover:shadow-lg transition-all duration-300 text-center group"
          >
            <div className="text-2xl mb-2">💰</div>
            <div className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
              Debts
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Manage your debts
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Goals;
