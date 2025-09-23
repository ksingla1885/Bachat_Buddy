import React from 'react';
import { Link } from 'react-router-dom';

function Achievements() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-warning-500 to-warning-600 rounded-2xl shadow-lg">
          <span className="text-3xl">🏆</span>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-heading-1 text-gray-900 dark:text-white">
            Achievements
          </h1>
          <p className="text-body-large max-w-3xl mx-auto">
            Unlock badges, earn rewards, and celebrate your financial milestones with our gamified achievement system.
          </p>
          <div className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-full font-medium shadow-sm">
            🚧 Coming Soon
          </div>
        </div>
      </div>

      {/* Achievement Categories */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Savings Badges */}
        <div className="card-professional hover-lift p-6">
          <div className="w-12 h-12 bg-gradient-to-r from-success-500 to-success-600 rounded-xl flex items-center justify-center mb-4">
            <span className="text-xl">💰</span>
          </div>
          <h3 className="text-heading-3 mb-3">
            Savings Badges
          </h3>
          <p className="text-body">
            Earn badges for consistent saving habits, reaching savings targets, and building your emergency fund.
          </p>
        </div>

        {/* Transaction Milestones */}
        <div className="card-professional hover-lift p-6">
          <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-4">
            <span className="text-xl">📊</span>
          </div>
          <h3 className="text-heading-3 mb-3">
            Transaction Milestones
          </h3>
          <p className="text-body">
            Celebrate tracking achievements like logging your first transaction, maintaining daily entries, or categorizing expenses perfectly.
          </p>
        </div>

        {/* Budget Mastery */}
        <div className="card-professional hover-lift p-6">
          <div className="w-12 h-12 bg-gradient-to-r from-warning-500 to-warning-600 rounded-xl flex items-center justify-center mb-4">
            <span className="text-xl">🎯</span>
          </div>
          <h3 className="text-heading-3 mb-3">
            Budget Mastery
          </h3>
          <p className="text-body">
            Unlock achievements for staying under budget, creating multiple budgets, and maintaining financial discipline.
          </p>
        </div>

        {/* Streak Rewards */}
        <div className="card-professional hover-lift p-6">
          <div className="w-12 h-12 bg-gradient-to-r from-warning-500 to-warning-600 rounded-xl flex items-center justify-center mb-4">
            <span className="text-xl">🔥</span>
          </div>
          <h3 className="text-heading-3 mb-3">
            Streak Rewards
          </h3>
          <p className="text-body">
            Build momentum with daily login streaks, consecutive saving days, and consistent money management habits.
          </p>
        </div>

        {/* Goal Achievements */}
        <div className="card-professional hover-lift p-6">
          <div className="w-12 h-12 bg-gradient-to-r from-success-500 to-success-600 rounded-xl flex items-center justify-center mb-4">
            <span className="text-xl">🎉</span>
          </div>
          <h3 className="text-heading-3 mb-3">
            Goal Achievements
          </h3>
          <p className="text-body">
            Celebrate reaching financial goals, whether it's paying off debt, saving for a vacation, or hitting investment targets.
          </p>
        </div>

        {/* Social Recognition */}
        <div className="card-professional hover-lift p-6">
          <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-4">
            <span className="text-xl">👥</span>
          </div>
          <h3 className="text-heading-3 mb-3">
            Social Recognition
          </h3>
          <p className="text-body">
            Share achievements with friends, compete on leaderboards, and motivate each other to reach financial success.
          </p>
        </div>
      </div>

      {/* Achievement Levels Preview */}
      <div className="bg-gradient-to-r from-neutral-800 to-neutral-900 rounded-2xl p-8 text-white shadow-xl">
        <h2 className="text-heading-2 mb-4 text-center">🏅 Achievement Levels</h2>
        <p className="text-body-large opacity-90 mb-6 text-center">
          Progress through different levels as you unlock more achievements and build better financial habits.
        </p>
        <div className="grid md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-neutral-400 to-neutral-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">🥉</span>
            </div>
            <div className="font-semibold">Bronze</div>
            <div className="text-caption opacity-75">Beginner</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-neutral-300 to-neutral-400 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">🥈</span>
            </div>
            <div className="font-semibold">Silver</div>
            <div className="text-caption opacity-75">Intermediate</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-warning-400 to-warning-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">🥇</span>
            </div>
            <div className="font-semibold">Gold</div>
            <div className="text-caption opacity-75">Advanced</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">💎</span>
            </div>
            <div className="font-semibold">Diamond</div>
            <div className="text-caption opacity-75">Expert</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-warning-400 to-warning-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">👑</span>
            </div>
            <div className="font-semibold">Legend</div>
            <div className="text-caption opacity-75">Master</div>
          </div>
        </div>
      </div>

      {/* Coming Soon Message */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-center text-white shadow-xl">
        <h2 className="text-heading-2 mb-4">🎮 Gamification Features Coming Soon!</h2>
        <p className="text-body-large opacity-90 mb-6">
          We're developing an exciting achievement system that will make managing your finances fun and rewarding.
        </p>
        <div className="flex flex-wrap justify-center gap-3 text-sm">
          <span className="bg-white/20 px-4 py-2 rounded-full">Achievement Badges</span>
          <span className="bg-white/20 px-4 py-2 rounded-full">Progress Tracking</span>
          <span className="bg-white/20 px-4 py-2 rounded-full">Leaderboards</span>
          <span className="bg-white/20 px-4 py-2 rounded-full">Daily Challenges</span>
          <span className="bg-white/20 px-4 py-2 rounded-full">Reward System</span>
          <span className="bg-white/20 px-4 py-2 rounded-full">Streak Bonuses</span>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center space-y-6">
        <div className="space-y-4 max-w-2xl mx-auto">
          <h3 className="text-heading-2 text-gray-900 dark:text-white">
            Want to be notified when Achievements launches?
          </h3>
          <p className="text-body">
            Join our waitlist and be the first to unlock badges and earn rewards!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/dashboard"
            className="btn-primary"
          >
            Back to Dashboard
          </Link>
          <button className="btn-secondary">
            Join Waitlist (Soon)
          </button>
        </div>
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
