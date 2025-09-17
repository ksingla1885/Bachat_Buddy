import { useState, useEffect } from 'react';
import * as api from '../services/api';
import TransactionForm from '../components/TransactionForm';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
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

  // Fetch wallets once on mount (separate from transactions)
  useEffect(() => {
    fetchWallets();
  }, []);

  // Fetch transactions when filters or page change
  useEffect(() => {
    fetchTransactions();
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

  const handleCreateTransaction = async (data) => {
    try {
      await api.createTransaction(data);
      setIsCreating(false);
      await Promise.all([
        fetchTransactions(),
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

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await api.deleteTransaction(id);
        fetchTransactions();
      } catch (err) {
        setError(err.response?.data?.message || 'Error deleting transaction');
      }
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const renderTransactionRow = (transaction) => {
    const walletName = wallets.find(w => String(w._id) === String(transaction.walletId))?.name || transaction.walletName || 'Unknown';

    return (
      <tr key={transaction._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
        {/* Date */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
          {new Date(transaction.date).toLocaleDateString()}
        </td>

        {/* Type */}
        <td className="px-6 py-4 whitespace-nowrap text-sm">
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
            ${transaction.type === 'Income'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
            }`}>
            {transaction.type}
          </span>
        </td>

        {/* Amount */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-100">
          {formatAmount(transaction.amount)}
        </td>

        {/* Wallet */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
          {walletName}
        </td>

        {/* Category */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
          {transaction.category || '-'}
        </td>

        {/* Notes */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
          {transaction.notes || '-'}
        </td>

        {/* Actions */}
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
          <button
            onClick={() => handleDeleteTransaction(transaction._id)}
            className="text-red-600 hover:text-red-900 font-medium"
          >
            Delete
          </button>
        </td>
      </tr>
    );
  };

  if (isLoading && !transactions.length) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Transactions
        </h1>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Transaction
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Create Transaction Form */}
      {isCreating && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Add New Transaction
          </h2>
          <TransactionForm
            onSubmit={handleCreateTransaction}
            wallets={wallets}
          />
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

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Wallet Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Wallet
            </label>
            <select
              value={filters.walletId}
              onChange={(e) => setFilters({ ...filters, walletId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">All Types</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Wallet</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Notes</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {transactions.map(transaction => renderTransactionRow(transaction))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Transactions;
