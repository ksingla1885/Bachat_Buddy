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
    if (error.response?.status === 401) {
      // Token expired or invalid → logout
      localStorage.removeItem("token");
      window.location.href = "/login";
    } else if (error.response?.status >= 500) {
      console.error("Server error:", error.response.data);
    }
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
  api.put(`/transactions/${id}`, data);

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
  api.put(`/budgets/${id}`, data); // ✅ added update

export const deleteBudget = (id) =>
  api.delete(`/budgets/${id}`);

export default api;
