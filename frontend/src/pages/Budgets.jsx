import { useState, useEffect } from "react";
import * as api from "../services/api";
import BudgetForm from "../components/BudgetForm";

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [summary, setSummary] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBudgets();
  }, [currentMonth]);

  const fetchBudgets = async () => {
    try {
      setIsLoading(true);
      const [year, month] = currentMonth.split("-").map(Number);

      // Get only this month's transactions and budgets
      const [budgetsResponse, transactionsResponse] = await Promise.all([
        api.getBudgets({ month, year }),
        api.getTransactions({ month, year }),
      ]);

      const budgetsList = budgetsResponse.data.data?.budgets || [];
      const transactions = transactionsResponse.data.data?.transactions || [];

      // Only show categories that have budgets created by user
      const completeSummary = budgetsList.map((budget) => {
        const categoryTransactions = transactions.filter(
          (t) =>
            t.category === budget.category &&
            t.type.toLowerCase() === "expense" &&
            new Date(t.date).getMonth() + 1 === month
        );

        const spent = categoryTransactions.reduce(
          (sum, t) => sum + Number(t.amount),
          0
        );

        return {
          category: budget.category,
          budgeted: Number(budget.amount),
          spent: spent,
          _id: budget._id, // Keep the budget ID for delete functionality
        };
      });

      setBudgets(budgetsList);
      setSummary(completeSummary);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching budgets");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBudget = async (data) => {
    try {
      const [year, month] = currentMonth.split("-").map(Number);
      await api.createBudget({ ...data, month, year });
      setIsCreating(false);
      fetchBudgets();
    } catch (err) {
      setError(err.response?.data?.message || "Error creating budget");
    }
  };

  const handleDeleteBudget = async (id) => {
    try {
      await api.deleteBudget(id); // id must be the MongoDB ObjectId
      fetchBudgets();
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting budget");
    }
  };

  const formatAmount = (amount) => {
    // Ensure amount is a valid number
    const num = Number(amount);
    return Number.isFinite(num)
      ? new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }).format(num)
      : "₹0";
  };

  const calculateBudgetProgress = (budget, spent) => {
    const budgetAmount = Number(budget.amount);
    const spentAmount = Number(spent);
    const remaining = budgetAmount - spentAmount;
    const progress =
      budgetAmount > 0
        ? Math.min((spentAmount / budgetAmount) * 100, 100)
        : 0;

    return {
      remaining: remaining,
      progress: progress.toFixed(1),
    };
  };

  if (isLoading && !budgets.length) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Budgets</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
        >
          Create Budget
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Month Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">
          Select Month
        </label>
        <input
          type="month"
          value={currentMonth}
          onChange={(e) => setCurrentMonth(e.target.value)}
          className="mt-1 block w-48 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        />
      </div>

      {/* Create Budget Form */}
      {isCreating && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Create New Budget
          </h2>
          <BudgetForm onSubmit={handleCreateBudget} />
          <div className="mt-4">
            <button
              onClick={() => setIsCreating(false)}
              className="text-gray-600 hover:text-gray-800 dark:text-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Budgets Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {["Category", "Budgeted", "Spent", "Remaining", "Progress", "Actions"]
                .map((col) => (
                  <th
                    key={col}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {col}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {summary.map((item) => {
              const budgeted = Number(item.budgeted) || 0;
              const spent = Number(item.spent) || 0;
              const { remaining, progress } = calculateBudgetProgress(
                budgets.find((b) => b.category === item.category),
                spent
              );

              return (
                <tr key={item.category}>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 text-sm">{formatAmount(budgeted)}</td>
                  <td className="px-6 py-4 text-sm">{formatAmount(spent)}</td>
                  <td className="px-6 py-4 text-sm">{formatAmount(remaining)}</td>
                  <td className="px-6 py-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div
                        className={`h-2.5 rounded-full ${
                          progress >= 100
                            ? "bg-red-600"
                            : progress >= 80
                            ? "bg-yellow-400"
                            : "bg-green-600"
                        }`}
                        style={{ width: `${Math.min(100, progress)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {progress}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    {budgets.find((b) => b.category === item.category) && ( // Only show delete button if we have a budget ID
                      <button
                        onClick={() => handleDeleteBudget(budgets.find((b) => b.category === item.category)._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Budgets;
