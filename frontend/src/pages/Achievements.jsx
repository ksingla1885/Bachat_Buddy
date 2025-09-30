import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../services/api';

function Achievements() {
  const [achievements, setAchievements] = useState({});
  const [userPoints, setUserPoints] = useState(0);
  const [pointsHistory, setPointsHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('achievements');

  useEffect(() => {
    fetchAchievements();
    fetchUserPoints();
    fetchPointsHistory();
  }, []);

  const fetchAchievements = async () => {
    try {
      setIsLoading(true);
      const response = await api.getUserAchievements();
      setAchievements(response.data.data);
      setError('');
    } catch (err) {
      console.error('Fetch achievements error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Error fetching achievements');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserPoints = async () => {
    try {
      const response = await api.getUserPoints();
      setUserPoints(response.data.data.points);
    } catch (err) {
      console.error('Fetch user points error:', err.response?.data || err.message);
    }
  };

  const fetchPointsHistory = async () => {
    try {
      const response = await api.getPointsHistory({ limit: 10 });
      setPointsHistory(response.data.data);
    } catch (err) {
      console.error('Fetch points history error:', err.response?.data || err.message);
    }
  };

  const earnedAchievements = Array.isArray(achievements) 
    ? achievements.filter(achievement => achievement.earned) 
    : [];
    
  const totalAchievements = Array.isArray(achievements) ? achievements.length : 0;
  const completionPercentage = totalAchievements > 0 
    ? Math.round((earnedAchievements.length / totalAchievements) * 100) 
    : 0;

  const getAchievementColor = (earned) => {
    return earned
      ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
      : 'bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700';
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const getAchievementProgress = (achievement) => {
    // Progress should come from the API response
    return achievement?.progress || 0;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center py-8 px-4">
        <h1 className="text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Achievements
          </span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Unlock badges, earn rewards, and celebrate your financial milestones
        </p>
      </div>

      {/* Stats Overview - Enhanced Design */}
      {Array.isArray(achievements) && achievements.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Total Points Card */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800/95 dark:to-gray-900 p-0.5 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-900/20 dark:to-transparent rounded-2xl transition-opacity group-hover:opacity-100 opacity-0"></div>
            <div className="relative bg-white/90 dark:bg-gray-800/70 backdrop-blur-sm rounded-[15px] p-5 h-full border border-gray-100/50 dark:border-gray-700/30">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-300 mb-1">Total Points</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
                    {userPoints}
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 shadow-inner">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 flex items-center justify-center shadow-sm">
                    <span className="text-xl">💎</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-400 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(100, (userPoints / 1000) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Achievements Earned Card */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800/95 dark:to-gray-900 p-0.5 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-900/20 dark:to-transparent rounded-2xl transition-opacity group-hover:opacity-100 opacity-0"></div>
            <div className="relative bg-white/90 dark:bg-gray-800/70 backdrop-blur-sm rounded-[15px] p-5 h-full border border-gray-100/50 dark:border-gray-700/30">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-300 mb-1">Achievements</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-400 dark:from-green-400 dark:to-green-300 bg-clip-text text-transparent">
                    {earnedAchievements.length}
                    <span className="text-base font-normal text-gray-400 dark:text-gray-500 ml-1">/ {totalAchievements}</span>
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 shadow-inner">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 dark:from-green-400 dark:to-green-500 flex items-center justify-center shadow-sm">
                    <span className="text-xl">🏆</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-green-600 dark:from-green-500 dark:to-green-400 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Completion Rate Card */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800/95 dark:to-gray-900 p-0.5 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-900/20 dark:to-transparent rounded-2xl transition-opacity group-hover:opacity-100 opacity-0"></div>
            <div className="relative bg-white/90 dark:bg-gray-800/70 backdrop-blur-sm rounded-[15px] p-5 h-full border border-gray-100/50 dark:border-gray-700/30">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-300 mb-1">Completion</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 dark:from-purple-400 dark:to-purple-300 bg-clip-text text-transparent">
                    {completionPercentage}%
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 shadow-inner">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-400 dark:to-purple-500 flex items-center justify-center shadow-sm">
                    <span className="text-xl">📈</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-400 to-purple-600 dark:from-purple-500 dark:to-purple-400 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
        {['achievements', 'points'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              activeTab === tab
                ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab === 'achievements' ? 'Achievements' : 'Points History'}
          </button>
        ))}
      </div>

      {/* Related Features */}
      <div className="bg-neutral-50 dark:bg-neutral-800 rounded-2xl p-8">
        <h3 className="text-heading-2 text-center text-gray-900 dark:text-white mb-8">
          💡 Meanwhile, explore these features:
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/goals"
            className="card-professional p-4 hover-lift text-center group"
          >
            <div className="text-2xl mb-3">🎯</div>
            <div className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              Goals
            </div>
            <div className="text-caption">
              Set financial targets
            </div>
          </Link>

          <Link
            to="/budgets"
            className="card-professional p-4 hover-lift text-center group"
          >
            <div className="text-2xl mb-3">📈</div>
            <div className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              Budgets
            </div>
            <div className="text-caption">
              Plan your spending
            </div>
          </Link>

          <Link
            to="/transactions"
            className="card-professional p-4 hover-lift text-center group"
          >
            <div className="text-2xl mb-3">💸</div>
            <div className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              Transactions
            </div>
            <div className="text-caption">
              Track your money
            </div>
          </Link>

          <Link
            to="/wallets"
            className="card-professional p-4 hover-lift text-center group"
          >
            <div className="text-2xl mb-3">💳</div>
            <div className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              Wallets
            </div>
            <div className="text-caption">
              Manage accounts
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Achievements;
