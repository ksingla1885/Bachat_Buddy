import React, { useState, useEffect, useMemo, useCallback } from "react";
import api, { getTransactionsWithStats } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import DonutChart from "../components/DonutChart";
import BarChart from "../components/BarChart";
import LineChart from "../components/LineChart";

function Dashboard() {
  const { user } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [transactionStats, setTransactionStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const today = new Date();
      // Get first and last day of current month in local timezone
      const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      // Set time to start/end of day for proper date range (in local time)
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      
      console.log('Fetching transactions from', startDate.toISOString(), 'to', endDate.toISOString());

      const currentMonth = today.getMonth() + 1;
      const currentYear = today.getFullYear();

      // Use single API call with stats included
      const [transactionsRes, budgetsRes] = await Promise.all([
        getTransactionsWithStats({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          limit: 100, // Increased to ensure we get all transactions
        }),
        api.get("/budgets/summary", {
          params: { month: currentMonth, year: currentYear },
        }),
      ]);

      // Parse transactions and stats
      let txns = [];
      let stats = null;
      
      // Handle different API response formats
      if (transactionsRes.data?.status === 'success') {
        txns = Array.isArray(transactionsRes.data.data?.transactions) 
          ? transactionsRes.data.data.transactions 
          : [];
        stats = transactionsRes.data.data?.stats || null;
      } else if (Array.isArray(transactionsRes.data?.data?.transactions)) {
        txns = transactionsRes.data.data.transactions;
        stats = transactionsRes.data.data.stats;
      } else if (Array.isArray(transactionsRes.data?.data)) {
        txns = transactionsRes.data.data;
      } else if (Array.isArray(transactionsRes.data?.transactions)) {
        txns = transactionsRes.data.transactions;
      } else if (Array.isArray(transactionsRes.data)) {
        txns = transactionsRes.data;
      }
      
      // Normalize transaction data
      txns = txns.map((t) => {
        // Normalize type to lowercase
        const type = t.type ? t.type.toLowerCase().trim() : '';
        
        // Convert date string to Date object if it's a string
        const date = typeof t.date === 'string' ? new Date(t.date) : (t.date || new Date());
        
        return {
          ...t,
          type,
          amount: Number(t.amount) || 0,
          date,
        };
      });
      
      console.log('Processed transactions:', txns);
      console.log('Transaction types found:', [...new Set(txns.map(t => t.type))]);
      console.log('Transaction date range:', 
        txns.length > 0 
          ? [
              new Date(Math.min(...txns.map(t => t.date))).toISOString(), 
              new Date(Math.max(...txns.map(t => t.date))).toISOString()
            ] 
          : 'No transactions found'
      );
      console.log('Transaction stats from API:', stats);
      
      setTransactions(txns);
      setTransactionStats(stats); // Store stats separately

      // ✅ Parse budgets
      if (Array.isArray(budgetsRes.data?.data?.summary)) {
        setBudgets(budgetsRes.data.data.summary);
      } else if (Array.isArray(budgetsRes.data?.summary)) {
        setBudgets(budgetsRes.data.summary);
      } else if (Array.isArray(budgetsRes.data)) {
        setBudgets(budgetsRes.data);
      } else {
        setBudgets([]);
      }
    } catch (error) {
      console.error("Dashboard error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Error fetching dashboard data"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user, fetchDashboardData]);

  // ✅ OPTIMIZED: Memoized calculations to prevent unnecessary re-renders
  const totalBalance = 0; // Removed wallet-based balance calculation

  const expensesByCategory = useMemo(() => {
    const expenses = {};
    transactions
      .filter((t) => t.type && t.type.toLowerCase() === "expense")
      .forEach((t) => {
        const categoryName = t.category?.name || t.category || "Uncategorized";
        expenses[categoryName] =
          Number(expenses[categoryName] || 0) + Number(t.amount || 0);
      });

    return Object.entries(expenses).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const budgetVsSpent = useMemo(() => {
    console.log('Raw budgets data:', budgets);
    
    // First, create a map of category to spent amount from transactions
    const spentByCategory = {};
    
    // Process all expense transactions
    transactions
      .filter(t => t.type && t.type.toLowerCase() === 'expense')
      .forEach(t => {
        const categoryName = t.category?.name || t.category || "Uncategorized";
        spentByCategory[categoryName] = (spentByCategory[categoryName] || 0) + Math.abs(Number(t.amount) || 0);
      });
    
    console.log('Spent by category:', spentByCategory);
    
    // Process budgets and merge with spent amounts
    const processedBudgets = budgets.map((b) => {
      const category = b.category || b.name || "Uncategorized";
      const budget = typeof b.budgeted === 'number' ? b.budgeted : parseFloat(b.budgeted) || 0;
      
      // Use spent amount from transactions if available, otherwise from budget data
      const spent = category in spentByCategory 
        ? spentByCategory[category] 
        : (typeof b.spent === 'number' ? b.spent : parseFloat(b.spent) || 0);
      
      console.log(`Budget for ${category}:`, { budget, spent });
      
      return {
        name: category,
        budget: Math.max(0, budget), // Ensure non-negative values
        spent: Math.max(0, spent),   // Ensure non-negative values
      };
    });
    
    // Also include categories that have spending but no budget
    Object.entries(spentByCategory).forEach(([category, spent]) => {
      if (!processedBudgets.some(b => b.name === category)) {
        processedBudgets.push({
          name: category,
          budget: 0,
          spent: Math.max(0, spent)
        });
      }
    });
    
    console.log('Processed budget vs spent data:', processedBudgets);
    return processedBudgets;
  }, [budgets, transactions]);

  const incomeVsExpense = useMemo(() => {
    const dailyData = {};
    transactions.forEach((t) => {
      if (!t.type) return;
      const rawDate = t.date || t.createdAt;
      if (!rawDate) return;
      const date = new Date(rawDate).toISOString().split("T")[0];
      if (!dailyData[date]) dailyData[date] = { date, income: 0, expense: 0 };
      const type = t.type.toLowerCase();
      if (type === "income") dailyData[date].income += Number(t.amount || 0);
      if (type === "expense") dailyData[date].expense += Number(t.amount || 0);
    });

    return Object.values(dailyData).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [transactions]);

  // Calculate total income and expenses from transactions
  const { totalIncome, totalExpenses } = useMemo(() => {
    // First try to use stats from API if available
    if (transactionStats) {
      const apiIncome = Number(transactionStats.totalIncome) || 0;
      const apiExpenses = Number(transactionStats.totalExpenses) || 0;
      
      console.log('Using stats from API - Income:', apiIncome, 'Expenses:', apiExpenses);
      
      // Only use API stats if they have valid values
      if (apiIncome > 0 || apiExpenses > 0) {
        return {
          totalIncome: apiIncome,
          totalExpenses: apiExpenses
        };
      }
    }
    
    // Fallback to calculating from transactions if no valid stats from API
    console.log('Calculating stats from transactions...');
    
    const result = transactions.reduce((acc, t) => {
      if (!t.type) return acc;
      
      // Normalize type and amount
      const type = String(t.type || '').toLowerCase().trim();
      const amount = Math.abs(Number(t.amount) || 0);
      
      console.log('Processing transaction:', { 
        id: t._id || t.id, 
        type, 
        amount,
        date: t.date ? new Date(t.date).toISOString() : 'No date'
      });
      
      if (type === 'income') {
        acc.totalIncome += amount;
      } else if (type === 'expense') {
        acc.totalExpenses += amount;
      } else {
        console.warn('Unknown transaction type:', type, 'in transaction:', t);
      }
      
      return acc;
    }, { 
      totalIncome: 0, 
      totalExpenses: 0 
    });
    
    console.log('Calculated stats from transactions - Income:', result.totalIncome, 'Expenses:', result.totalExpenses);
    return result;
  }, [transactions, transactionStats]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-200 dark:border-gray-700 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Loading your financial data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center p-8 card-modern max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Oops! Something went wrong</h3>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-8 animate-fadeInUp">
      {/* Welcome Header */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-gradient mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Here's your financial overview for today
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income Card */}
        <div className="card-modern card-hover p-6 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">This Month's Income</p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                ₹{totalIncome.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            </div>
          </div>
        </div>

        {/* Expenses Card */}
        <div className="card-modern card-hover p-6 bg-gradient-to-br from-red-50 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">This Month's Expenses</p>
              <p className="text-3xl font-bold text-red-900 dark:text-red-100">
                ₹{totalExpenses.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
            </div>
          </div>
        </div>
      </div>


      {/* Enhanced Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Expenses by Category - Enhanced Donut Chart */}
        <div className="relative overflow-hidden">
          <div className="card-modern card-hover p-8 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-900/10 dark:via-pink-900/10 dark:to-rose-900/10 border-purple-200 dark:border-purple-800">
            {/* Animated Background Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full transform translate-x-16 -translate-y-16 animate-pulse"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-700 rounded-2xl flex items-center justify-center mr-4 shadow-lg animate-float3D">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                      Expenses by Category
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Breakdown of your spending</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Live Data</span>
                </div>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-4 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
                <DonutChart data={expensesByCategory} />
              </div>
            </div>
          </div>
        </div>

        {/* Budget vs Spent - Enhanced Bar Chart */}
        <div className="relative overflow-hidden">
          <div className="card-modern card-hover p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 dark:from-blue-900/10 dark:via-indigo-900/10 dark:to-cyan-900/10 border-blue-200 dark:border-blue-800">
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-0 w-28 h-28 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full transform -translate-x-14 -translate-y-14 animate-bounce" style={{animationDuration: '3s'}}></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tr from-cyan-200/20 to-blue-200/20 rounded-full transform translate-x-10 translate-y-10 animate-bounce" style={{animationDelay: '1.5s', animationDuration: '3s'}}></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mr-4 shadow-lg animate-float3D" style={{animationDelay: '0.5s'}}>
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                      Budget vs Spent
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Track your budget performance</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-pulse shadow-lg"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Updated</span>
                </div>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-4 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
                <BarChart data={budgetVsSpent} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Income vs Expense Trend - Enhanced Line Chart */}
      <div className="relative overflow-hidden">
        <div className="card-modern card-hover p-8 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900/10 dark:via-teal-900/10 dark:to-cyan-900/10 border-emerald-200 dark:border-emerald-800">
          {/* Animated Background Elements */}
          <div className="absolute top-1/2 left-0 w-40 h-40 bg-gradient-to-br from-emerald-200/15 to-teal-200/15 rounded-full transform -translate-x-20 -translate-y-20 animate-pulse"></div>
          <div className="absolute top-0 right-1/4 w-32 h-32 bg-gradient-to-br from-cyan-200/15 to-emerald-200/15 rounded-full transform translate-y-16 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-teal-200/15 to-cyan-200/15 rounded-full transform translate-x-12 translate-y-12 animate-pulse" style={{animationDelay: '1s'}}></div>
          
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl flex items-center justify-center mr-4 shadow-lg animate-float3D" style={{animationDelay: '1s'}}>
                  <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400">
                    Income vs Expense Trend
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Monitor your financial flow over time</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-md animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Income</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-pink-500 rounded-full shadow-md animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Expense</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full animate-pulse shadow-lg"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Real-time</span>
                </div>
              </div>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
              <LineChart data={incomeVsExpense} />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;
