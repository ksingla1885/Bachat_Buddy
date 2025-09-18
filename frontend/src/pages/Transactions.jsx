import { useState, useEffect, useMemo, useCallback } from 'react';
import * as api from '../services/api';
import TransactionForm from '../components/TransactionForm';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]); // For stats calculation
  const [wallets, setWallets] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [filters, setFilters] = useState({
    walletId: '',
    type: '',
    category: '',
    startDate: '',
    endDate: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    transactionId: null,
    transactionDetails: null,
    isDeleting: false
  });

  // Fetch wallets once on mount (separate from transactions)
  useEffect(() => {
    fetchWallets();
  }, []);

  // Fetch transactions when filters or page change
  useEffect(() => {
    fetchTransactions();
    fetchAllTransactions(); // Fetch all transactions for stats
  }, [currentPage, filters]);

  const fetchWallets = async () => {
    try {
      const response = await api.getWallets();
      setWallets(response.data.data.wallets || []);
      setError('');
    } catch (err) {
      console.error('Error fetching wallets:', err.response?.data || err.message || err);
      setWallets([]);
      setError(err.response?.data?.message || 'Error fetching wallets');
    }
  };

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await api.getTransactions({
        ...filters,
        page: currentPage,
        limit: 10
      });

      const txns = (response.data.data.transactions || []).map(t => ({
        ...t,
        type: t.type ? t.type.charAt(0).toUpperCase() + t.type.slice(1).toLowerCase() : '',
        amount: Number(t.amount) || 0
      }));

      setTransactions(txns);
      setTotalPages(response.data.data.pagination.pages);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching transactions');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all transactions for stats calculation (without pagination)
  const fetchAllTransactions = async () => {
    try {
      const response = await api.getTransactions({
        ...filters,
        limit: 10000, // Large limit to get all transactions
        page: 1
      });

      // Safely handle the response data
      const responseData = response?.data?.data;
      const transactionsData = Array.isArray(responseData?.transactions) 
        ? responseData.transactions 
        : [];

      const allTxns = transactionsData.map(t => ({
        ...t,
        type: t.type ? t.type.charAt(0).toUpperCase() + t.type.slice(1).toLowerCase() : '',
        amount: Number(t.amount) || 0
      }));

      setAllTransactions(allTxns || []);
    } catch (err) {
      console.error('Error fetching all transactions for stats:', err);
      // Fallback to paginated transactions if all transactions fetch fails
      setAllTransactions(transactions || []);
    }
  };

  const handleCreateTransaction = async (data) => {
    try {
      await api.createTransaction(data);
      setIsCreating(false);
      await Promise.all([
        fetchTransactions(),
        fetchAllTransactions(), // Refresh all transactions for stats
        refreshWallets()
      ]);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating transaction');
    }
  };

  const refreshWallets = async () => {
    try {
      const response = await api.getWallets();
      setWallets(response.data.data.wallets);
    } catch (err) {
      console.error('Error refreshing wallets:', err);
    }
  };

  const handleDeleteTransaction = (transaction) => {
    setDeleteDialog({
      isOpen: true,
      transactionId: transaction._id,
      transactionDetails: transaction,
      isDeleting: false
    });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.transactionId) return;
    
    try {
      setDeleteDialog(prev => ({ ...prev, isDeleting: true }));
      setError(''); // Clear any previous errors
      
      await api.deleteTransaction(deleteDialog.transactionId);
      
      // Refresh data
      await Promise.all([
        fetchTransactions(),
        fetchAllTransactions(),
        refreshWallets() // Also refresh wallets to update balances
      ]);
      
      // Show success message
      setInfoMessage('Transaction deleted successfully!');
      setTimeout(() => setInfoMessage(''), 3000);
      
    } catch (err) {
      // Only show error if it's not a 404 (already deleted)
      if (err.response?.status !== 404) {
        setError(err.response?.data?.message || 'Error deleting transaction');
      } else {
        // If 404, just refresh the data
        await Promise.all([
          fetchTransactions(),
          fetchAllTransactions(),
          refreshWallets()
        ]);
        setInfoMessage('Transaction was already removed');
        setTimeout(() => setInfoMessage(''), 3000);
      }
    } finally {
      setDeleteDialog({
        isOpen: false,
        transactionId: null,
        transactionDetails: null,
        isDeleting: false
      });
    }
  };
  
  const cancelDelete = () => {
    setDeleteDialog({
      isOpen: false,
      transactionId: null,
      transactionDetails: null,
      isDeleting: false
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const renderTransactionRow = (transaction) => {
    console.log(wallets);
    const walletName = wallets.find(w => String(w._id) === String(transaction.walletId._id))?.name || transaction.walletName || 'Unknown';

    return (
      <tr key={transaction._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
        {/* Date */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {new Date(transaction.date).toLocaleDateString('en-IN', { 
                  day: '2-digit', 
                  month: 'short' 
                })}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(transaction.date).getFullYear()}
              </div>
            </div>
          </div>
        </td>

        {/* Type */}
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            transaction.type === 'Income'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
          }`}>
            {transaction.type === 'Income' ? '📈' : '📉'} {transaction.type}
          </span>
        </td>

        {/* Amount */}
        <td className="px-6 py-4 whitespace-nowrap text-right">
          <div className={`text-lg font-bold ${
            transaction.type === 'Income' 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {transaction.type === 'Income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
          </div>
        </td>

        {/* Wallet */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center mr-2">
              <span className="text-white text-xs font-bold">💳</span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{walletName}</span>
          </div>
        </td>

        {/* Category */}
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            {transaction.category || 'Uncategorized'}
          </span>
        </td>

        {/* Notes */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-600 dark:text-gray-400 max-w-32 truncate" title={transaction.notes}>
            {transaction.notes || '-'}
          </div>
        </td>

        {/* Actions */}
        <td className="px-6 py-4 whitespace-nowrap text-right">
          <button
            onClick={() => handleDeleteTransaction(transaction)}
            className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors duration-200 group"
          >
            <svg className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="group-hover:scale-105 transition-transform">Delete</span>
          </button>
        </td>
      </tr>
    );
  };

  if (isLoading && !transactions.length) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-200 dark:border-gray-700 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Loading your transactions...</p>
        </div>
      </div>
    );
  }

  // Calculate stats from ALL transactions, not just paginated ones
  const totalIncome = allTransactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = allTransactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
  const netFlow = totalIncome - totalExpenses;

  return (
    <div className="space-y-8 animate-fadeInUp">
      {/* Header Section */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-gradient mb-2 flex items-center justify-center">
          <span className="mr-3">💸</span>
          Transaction History
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Track and manage all your financial transactions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Income */}
        <div className="card-modern card-hover p-6 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">Total Income</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
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

        {/* Total Expenses */}
        <div className="card-modern card-hover p-6 bg-gradient-to-br from-red-50 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">Total Expenses</p>
              <p className="text-2xl font-bold text-red-900 dark:text-red-100">
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

        {/* Net Flow */}
        <div className={`card-modern card-hover p-6 bg-gradient-to-br ${netFlow >= 0 ? 'from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800' : 'from-orange-50 to-yellow-100 dark:from-orange-900/20 dark:to-yellow-900/20 border-orange-200 dark:border-orange-800'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium mb-1 ${netFlow >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`}>Net Flow</p>
              <p className={`text-2xl font-bold ${netFlow >= 0 ? 'text-blue-900 dark:text-blue-100' : 'text-orange-900 dark:text-orange-100'}`}>
                {netFlow >= 0 ? '+' : ''}₹{netFlow.toLocaleString()}
              </p>
            </div>
            <div className={`w-12 h-12 ${netFlow >= 0 ? 'bg-blue-500' : 'bg-orange-500'} rounded-xl flex items-center justify-center`}>
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={netFlow >= 0 ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-end gap-4 mb-8">
        <button
          onClick={() => setIsCreating(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 animate-fadeIn">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
          </div>
        </div>
      )}
      
      {infoMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6 animate-fadeIn">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm font-medium text-green-800 dark:text-green-200">{infoMessage}</p>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 hover:scale-100">
            <div className="p-6 text-center">
              {/* Animated Trash Icon */}
              <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <div className="relative">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  {/* Pulse effect */}
                  <div className="absolute inset-0 rounded-full bg-red-400 opacity-0 group-hover:opacity-40 transition-opacity duration-300 animate-ping"></div>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Transaction</h3>
              
              {deleteDialog.transactionDetails && (
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mb-6 text-left">
                  <p className="text-gray-600 dark:text-gray-300 mb-1">
                    <span className="font-medium">Amount:</span> 
                    <span className={`ml-2 font-semibold ${
                      deleteDialog.transactionDetails.type === 'Income' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {deleteDialog.transactionDetails.type === 'Income' ? '+' : '-'}
                      ₹{deleteDialog.transactionDetails.amount.toLocaleString()}
                    </span>
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-1">
                    <span className="font-medium">Category:</span> 
                    <span className="ml-2">{deleteDialog.transactionDetails.category || 'Uncategorized'}</span>
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Date:</span> 
                    <span className="ml-2">
                      {new Date(deleteDialog.transactionDetails.date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </p>
                </div>
              )}

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete this transaction? This action cannot be undone.
              </p>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={cancelDelete}
                  disabled={deleteDialog.isDeleting}
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleteDialog.isDeleting}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center disabled:opacity-50"
                >
                  {deleteDialog.isDeleting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Transaction Form */}
      {isCreating && (
        <div className="card-modern p-8 mb-8 animate-fadeInUp">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              💰 Add New Transaction
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Record your income or expense transaction
            </p>
          </div>
          <TransactionForm
            onSubmit={handleCreateTransaction}
            wallets={wallets}
          />
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setIsCreating(false)}
              className="btn-secondary flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card-modern p-6 mb-8">
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">🔍 Filter Transactions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Wallet Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              💳 Wallet
            </label>
            <select
              value={filters.walletId}
              onChange={(e) => setFilters({ ...filters, walletId: e.target.value })}
              className="input-modern"
            >
              <option value="">All Wallets</option>
              {wallets.map(wallet => (
                <option key={wallet._id} value={wallet._id}>
                  {wallet.name}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🏷️ Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="input-modern"
            >
              <option value="">All Types</option>
              <option value="Income">📈 Income</option>
              <option value="Expense">📉 Expense</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              📅 Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="input-modern"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              📅 End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="input-modern"
            />
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card-modern overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <span className="mr-2">📋</span>
            Recent Transactions
          </h3>
        </div>
        
        {transactions.filter(t => t.type !== 'Transfer').length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No transactions found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Start by adding your first transaction</p>
            <button
              onClick={() => setIsCreating(true)}
              className="btn-primary"
            >
              Add Transaction
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    📅 Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    🏷️ Type
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    💰 Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    💳 Wallet
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    📂 Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    📝 Notes
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    ⚡ Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {transactions.filter(t => t.type !== 'Transfer').map(transaction => renderTransactionRow(transaction))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Previous</span>
          </button>
          
          <div className="flex items-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === page
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-medium'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default Transactions;
