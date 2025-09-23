import React from 'react';
import { Link } from 'react-router-dom';

function Reports() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg">
          <span className="text-3xl">📊</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Financial Reports
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Gain deep insights into your financial health with comprehensive reports, analytics, and data visualization.
          </p>
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-full font-semibold shadow-lg">
            🚧 Coming Soon
          </div>
        </div>
      </div>

      {/* Report Categories */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Spending Analysis */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-pink-500 rounded-xl flex items-center justify-center mb-4">
            <span className="text-xl">💳</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Spending Analysis
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Detailed breakdown of your spending patterns by category, merchant, and time period with actionable insights.
          </p>
        </div>

        {/* Income Reports */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center mb-4">
            <span className="text-xl">💰</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Income Reports
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Track your income sources, analyze earning patterns, and monitor salary growth over time.
          </p>
        </div>

        {/* Budget Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-xl flex items-center justify-center mb-4">
            <span className="text-xl">📈</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Budget Performance
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Compare your actual spending against budgets with variance analysis and performance metrics.
          </p>
        </div>

        {/* Savings Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mb-4">
            <span className="text-xl">🎯</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Savings Progress
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Monitor your savings goals, track progress toward targets, and analyze savings rate trends.
          </p>
        </div>

        {/* Cash Flow Analysis */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center mb-4">
            <span className="text-xl">📊</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Cash Flow Analysis
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Understand your money movement with detailed cash flow statements and liquidity analysis.
          </p>
        </div>

        {/* Net Worth Tracking */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-green-500 rounded-xl flex items-center justify-center mb-4">
            <span className="text-xl">💎</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Net Worth Tracking
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Track your assets, liabilities, and net worth over time with comprehensive wealth analysis.
          </p>
        </div>

        {/* Category Trends */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-r from-violet-400 to-purple-500 rounded-xl flex items-center justify-center mb-4">
            <span className="text-xl">📉</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Category Trends
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Analyze spending trends by category over time to identify patterns and optimization opportunities.
          </p>
        </div>

        {/* Tax Reports */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-r from-gray-400 to-gray-600 rounded-xl flex items-center justify-center mb-4">
            <span className="text-xl">📋</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Tax Reports
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Generate tax-related reports with expense categorization and potential deduction tracking.
          </p>
        </div>

        {/* Custom Reports */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-rose-500 rounded-xl flex items-center justify-center mb-4">
            <span className="text-xl">⚙️</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Custom Reports
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Create personalized reports with custom date ranges, filters, and specific data points you want to track.
          </p>
        </div>
      </div>

      {/* Advanced Analytics Preview */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-center">📈 Advanced Analytics Coming Soon</h2>
        <p className="text-center opacity-90 mb-6">
          We're developing powerful analytics tools to give you unprecedented insights into your financial data.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">🤖</div>
            <div className="font-semibold">AI Insights</div>
            <div className="text-sm opacity-75">Smart recommendations</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">📱</div>
            <div className="font-semibold">Mobile Reports</div>
            <div className="text-sm opacity-75">Access anywhere</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">📤</div>
            <div className="font-semibold">Export Options</div>
            <div className="text-sm opacity-75">PDF, CSV, Excel</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">🔄</div>
            <div className="font-semibold">Real-time Data</div>
            <div className="text-sm opacity-75">Live updates</div>
          </div>
        </div>
      </div>

      {/* Visualization Preview */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 text-white shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-center">📊 Data Visualization Tools</h2>
        <p className="text-center opacity-90 mb-6">
          Beautiful charts, graphs, and interactive dashboards to visualize your financial data.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <span className="bg-white/20 px-4 py-2 rounded-full">Interactive Charts</span>
          <span className="bg-white/20 px-4 py-2 rounded-full">Pie Charts</span>
          <span className="bg-white/20 px-4 py-2 rounded-full">Bar Graphs</span>
          <span className="bg-white/20 px-4 py-2 rounded-full">Line Trends</span>
          <span className="bg-white/20 px-4 py-2 rounded-full">Heat Maps</span>
          <span className="bg-white/20 px-4 py-2 rounded-full">Dashboards</span>
        </div>
      </div>

      {/* Coming Soon Message */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-8 text-center text-white shadow-xl">
        <h2 className="text-2xl font-bold mb-4">🔍 Deep Financial Insights Coming Soon!</h2>
        <p className="text-lg opacity-90 mb-6">
          We're building comprehensive reporting tools that will transform how you understand your financial data.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <span className="bg-white/20 px-4 py-2 rounded-full">Advanced Analytics</span>
          <span className="bg-white/20 px-4 py-2 rounded-full">Interactive Dashboards</span>
          <span className="bg-white/20 px-4 py-2 rounded-full">Export Capabilities</span>
          <span className="bg-white/20 px-4 py-2 rounded-full">Custom Date Ranges</span>
          <span className="bg-white/20 px-4 py-2 rounded-full">AI-Powered Insights</span>
          <span className="bg-white/20 px-4 py-2 rounded-full">Mobile Responsive</span>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Want to be notified when Reports launches?
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Join our waitlist and be the first to access powerful financial analytics!
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
            to="/wallets"
            className="bg-white dark:bg-gray-700 p-4 rounded-xl hover:shadow-lg transition-all duration-300 text-center group"
          >
            <div className="text-2xl mb-2">💳</div>
            <div className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
              Wallets
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Manage accounts
            </div>
          </Link>

          <Link
            to="/goals"
            className="bg-white dark:bg-gray-700 p-4 rounded-xl hover:shadow-lg transition-all duration-300 text-center group"
          >
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
              Goals
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Set targets
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Reports;
