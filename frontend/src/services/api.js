import axios from "axios";

// ✅ Create axios instance
const api = axios.create({
  // Default to backend port 5001 (matches backend/server.js). If you use a different port
  // set VITE_API_URL in the frontend environment (.env) to override.
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request interceptor → attach token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Response interceptor (global error handling)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status >= 500) {
      console.error("Server error:", error.response.data);
    }
    // Don't auto-redirect on 401 - let components handle auth errors
    return Promise.reject(error);
  }
);

//
// ----------------- Wallet API -----------------
//
export const getWallets = () => api.get("/wallets");
export const createWallet = (data) => api.post("/wallets", data);
export const deleteWallet = (id) => api.delete(`/wallets/${id}`);
export const updateWallet = (id, data) => api.put(`/wallets/${id}`, data);

//
// ----------------- Transaction API (Optimized) -----------------
//
export const getTransactions = (params) =>
  api.get("/transactions", { params });

// New optimized endpoint for transaction stats
export const getTransactionStats = (params) =>
  api.get("/transactions/stats", { params });

// Get transactions with stats in single call
export const getTransactionsWithStats = (params) =>
  api.get("/transactions", { params: { ...params, includeStats: true } });

export const createTransaction = (data) =>
  api.post("/transactions", data);

export const updateTransaction = (id, data) =>
  api.patch(`/transactions/${id}`, data);

export const deleteTransaction = (id) =>
  api.delete(`/transactions/${id}`);

//
// ----------------- Budget API -----------------
//
export const getBudgets = (params) =>
  api.get("/budgets", { params });

export const getBudgetSummary = (params) =>
  api.get("/budgets/summary", { params });

export const createBudget = (data) =>
  api.post("/budgets", data);

export const updateBudget = (id, data) =>
  api.patch(`/budgets/${id}`, data); // ✅ changed to PATCH

export const deleteBudget = (id) =>
  api.delete(`/budgets/${id}`);

//
// ----------------- Debt API -----------------
//
export const getDebts = (params) =>
  api.get("/debts", { params });

export const getDebtStats = () =>
  api.get("/debts/stats/overview");

export const createDebt = (data) =>
  api.post("/debts", data);

export const updateDebt = (id, data) =>
  api.patch(`/debts/${id}`, data);

export const deleteDebt = (id) =>
  api.delete(`/debts/${id}`);

export const updateDebtPayment = (id, data) =>
  api.patch(`/debts/${id}/payment`, data);

export const updateDebtInterest = (id, data) =>
  api.patch(`/debts/${id}/interest`, data);

//
// ----------------- Goal API -----------------
//
export const getGoals = (params) =>
  api.get("/goals", { params });

export const getGoalStats = () =>
  api.get("/goals/stats/overview");

export const createGoal = (data) =>
  api.post("/goals", data);

export const updateGoal = (id, data) =>
  api.patch(`/goals/${id}`, data);

export const deleteGoal = (id) =>
  api.delete(`/goals/${id}`);

export const addSavingsToGoal = (id, data) =>
  api.patch(`/goals/${id}/savings`, data);

//
// ----------------- Report API -----------------
//
export const getSpendingAnalysis = (params) =>
  api.get('/spending-analysis', { params });

export const getIncomeReport = (params) =>
  api.get('/income-report', { params });

export const getBudgetReport = (params) =>
  api.get('/budget-report', { params });

export const exportTransactionsCSV = (params) =>
  api.get("/reports/csv/transactions", { params });

export const exportComprehensiveCSV = () =>
  api.get("/reports/csv/comprehensive");

export const exportPDFReport = () =>
  api.get("/reports/pdf/comprehensive");

export const getReportSummary = () =>
  api.get("/reports/summary");

//
// ----------------- User Points API -----------------
//
export const getUserPoints = () =>
  api.get("/users/points");

export const getPointsHistory = (params) =>
  api.get("/users/points/history", { params });

export const getUserAchievements = () =>
  api.get("/users/achievements");

// ----------------- Monthly Savings Tiers API -----------------
//
export const getCurrentMonthTier = () =>
  api.get("/monthly-tiers/current");

export const getMonthlyTiersHistory = (params) =>
  api.get("/monthly-tiers/history", { params });

export const calculateCurrentMonthTier = () =>
  api.post("/monthly-tiers/calculate");

export const getTierStats = () =>
  api.get("/monthly-tiers/stats");

export default api;
