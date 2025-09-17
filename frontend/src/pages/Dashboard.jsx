import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import DonutChart from "../components/DonutChart";
import BarChart from "../components/BarChart";
import LineChart from "../components/LineChart";
import WalletCard from "../components/WalletCard";

function Dashboard() {
  const { user } = useAuth();

  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      const currentMonth = today.getMonth() + 1;
      const currentYear = today.getFullYear();

      const [walletsRes, transactionsRes, budgetsRes] = await Promise.all([
        api.get("/wallets"),
        api.get("/transactions", {
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            limit: 100,
          },
        }),
        api.get("/budgets/summary", {
          params: { month: currentMonth, year: currentYear },
        }),
      ]);

      // ✅ Parse wallets
      if (Array.isArray(walletsRes.data?.data?.wallets)) {
        setWallets(walletsRes.data.data.wallets);
      } else if (Array.isArray(walletsRes.data?.wallets)) {
        setWallets(walletsRes.data.wallets);
      } else if (Array.isArray(walletsRes.data)) {
        setWallets(walletsRes.data);
      } else {
        setWallets([]);
      }

      // ✅ Parse transactions
      let txns = [];
      if (Array.isArray(transactionsRes.data?.data?.transactions)) {
        txns = transactionsRes.data.data.transactions;
      } else if (Array.isArray(transactionsRes.data?.data)) {
        txns = transactionsRes.data.data;
      } else if (Array.isArray(transactionsRes.data?.transactions)) {
        txns = transactionsRes.data.transactions;
      } else if (Array.isArray(transactionsRes.data)) {
        txns = transactionsRes.data;
      }
      txns = txns.map((t) => ({
        ...t,
        type: t.type ? t.type.toLowerCase() : "",
        amount: Number(t.amount || 0),
      }));
      setTransactions(txns);

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
  };

  const calculateTotalBalance = () => {
    return wallets.reduce(
      (total, wallet) => total + Number(wallet.currentBalance || 0),
      0
    );
  };

  const prepareExpensesByCategory = () => {
    const expenses = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const categoryName = t.category?.name || t.category || "Uncategorized";
        expenses[categoryName] =
          Number(expenses[categoryName] || 0) + Number(t.amount || 0);
      });

    return Object.entries(expenses).map(([name, value]) => ({ name, value }));
  };

  const prepareBudgetVsSpent = () => {
    return budgets.map((b) => ({
      name: b.category || "Uncategorized",
      budget: parseFloat(b.budgeted) || 0,
      spent: parseFloat(b.spent) || 0,
    }));
  };

  const prepareIncomeVsExpense = () => {
    const dailyData = {};
    transactions.forEach((t) => {
      const rawDate = t.date || t.createdAt;
      if (!rawDate) return;
      const date = new Date(rawDate).toISOString().split("T")[0];
      if (!dailyData[date]) dailyData[date] = { date, income: 0, expense: 0 };
      if (t.type === "income") dailyData[date].income += Number(t.amount || 0);
      if (t.type === "expense") dailyData[date].expense += Number(t.amount || 0);
    });

    return Object.values(dailyData).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 mt-12 text-lg font-medium">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Total Balance */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 transition hover:shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          Total Balance
        </h2>
        <p className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
          ₹{calculateTotalBalance().toLocaleString()}
        </p>
      </div>

      {/* Wallets Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
          Your Wallets
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wallets.map((wallet) => (
            <div
              key={wallet._id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 transition hover:shadow-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                {wallet.name}
                <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-700 dark:text-white">
                  {wallet.type}
                </span>
              </h3>
              <div className="mt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Opening Balance
                </p>
                <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
                  ₹{wallet.openingBalance?.toLocaleString()}
                </p>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Current Balance
                </p>
                <p className="mt-1 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  ₹{wallet.currentBalance?.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 transition hover:shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Expenses by Category
          </h2>
          <DonutChart data={prepareExpensesByCategory()} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 transition hover:shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Budget vs Spent
          </h2>
          <BarChart data={prepareBudgetVsSpent()} />
        </div>
      </div>

      {/* Income vs Expense Trend */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 transition hover:shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Income vs Expense Trend
        </h2>
        <LineChart data={prepareIncomeVsExpense()} />
      </div>
    </div>
  );
}

export default Dashboard;
