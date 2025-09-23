import { useState, useEffect } from 'react';
import * as api from '../services/api';

const DebtTracker = () => {
  const [debts, setDebts] = useState([]);
  const [stats, setStats] = useState({});
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [newDebt, setNewDebt] = useState({
    type: 'personal',
    title: '',
    amount: '',
    interestRate: '',
    dueDate: '',
    description: ''
  });

  const [paymentModal, setPaymentModal] = useState({
    show: false,
    debt: null,
    amount: ''
  });

  useEffect(() => {
    fetchDebts();
    fetchDebtStats();
  }, []);

  const fetchDebts = async () => {
    try {
      setIsLoading(true);
      const response = await api.getDebts();
      setDebts(response.data.data);
      setError('');
    } catch (err) {
      console.error("Fetch debts error:", err.response?.data || err.message);
      setError(err.response?.data?.message || 'Error fetching debts');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDebtStats = async () => {
    try {
      const response = await api.getDebtStats();
      setStats(response.data.data);
    } catch (err) {
      console.error("Fetch debt stats error:", err.response?.data || err.message);
    }
  };

  const handleCreateDebt = async (e) => {
    e.preventDefault();
    try {
      await api.createDebt(newDebt);
      setSuccessMessage('Debt created successfully!');
      setNewDebt({
        type: 'personal',
        title: '',
        amount: '',
        interestRate: '',
        dueDate: '',
        description: ''
      });
      setIsCreating(false);
      fetchDebts();
      fetchDebtStats();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error("Create debt error:", err.response?.data || err.message);
      setError(err.response?.data?.message || 'Error creating debt');
    }
  };

  const handleDeleteDebt = async (debtId) => {
    if (!confirm('Are you sure you want to delete this debt?')) return;

    try {
      await api.deleteDebt(debtId);
      setSuccessMessage('Debt deleted successfully!');
      fetchDebts();
      fetchDebtStats();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error("Delete debt error:", err.response?.data || err.message);
      setError(err.response?.data?.message || 'Error deleting debt');
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      await api.updateDebtPayment(paymentModal.debt._id, {
        paymentAmount: parseFloat(paymentModal.amount)
      });
      setSuccessMessage('Payment recorded successfully!');
      setPaymentModal({ show: false, debt: null, amount: '' });
      fetchDebts();
      fetchDebtStats();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error("Payment error:", err.response?.data || err.message);
      setError(err.response?.data?.message || 'Error recording payment');
    }
  };

  const getStatusBadge = (debt) => {
    if (debt.status === 'closed') {
      return <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs">Closed</span>;
    }

    const dueDate = new Date(debt.dueDate);
    const now = new Date();
    const daysUntilDue = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

    if (daysUntilDue < 0) {
      return <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-full text-xs">Overdue</span>;
    } else if (daysUntilDue <= 3) {
      return <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 rounded-full text-xs">Due Soon</span>;
    } else {
      return <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full text-xs">Active</span>;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Debt Tracker</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your loans and debts</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="btn-primary"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Debt
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Total Debts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalDebts || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <svg className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Active Debts</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.activeDebts || 0}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <svg className="h-6 w-6 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.totalAmount || 0)}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <svg className="h-6 w-6 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Remaining</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(stats.totalRemaining || 0)}</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
              <svg className="h-6 w-6 text-red-600 dark:text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded-xl">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Create Debt Form - Enhanced UI */}
      {isCreating && (
        <div className="card-modern p-8 animate-fadeInUp">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Debt</h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Enter the details of your debt or loan</p>
              </div>
            </div>
            <button
              onClick={() => setIsCreating(false)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200"
              title="Close"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleCreateDebt} className="space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3"></span>
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span>Debt Title *</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    value={newDebt.title}
                    onChange={(e) => setNewDebt({...newDebt, title: e.target.value})}
                    className="input-modern"
                    placeholder="e.g., Home Loan, Credit Card, Personal Loan"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span>Debt Type *</span>
                    </div>
                  </label>
                  <select
                    value={newDebt.type}
                    onChange={(e) => setNewDebt({...newDebt, type: e.target.value})}
                    className="input-modern"
                    required
                  >
                    <option value="personal">💰 Personal Loan</option>
                    <option value="creditCard">💳 Credit Card</option>
                    <option value="loan">🏠 Bank Loan</option>
                    <option value="business">💼 Business Loan</option>
                    <option value="education">🎓 Education Loan</option>
                    <option value="vehicle">🚗 Vehicle Loan</option>
                    <option value="other">📋 Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Financial Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <span className="w-1 h-6 bg-gradient-to-b from-green-500 to-teal-500 rounded-full mr-3"></span>
                Financial Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      <span>Total Amount (₹) *</span>
                    </div>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={newDebt.amount}
                      onChange={(e) => setNewDebt({...newDebt, amount: e.target.value})}
                      className="input-modern pl-8"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <span>Interest Rate (%)</span>
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={newDebt.interestRate}
                      onChange={(e) => setNewDebt({...newDebt, interestRate: e.target.value})}
                      className="input-modern pr-8"
                      placeholder="0.00"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Due Date *</span>
                    </div>
                  </label>
                  <input
                    type="date"
                    value={newDebt.dueDate}
                    onChange={(e) => setNewDebt({...newDebt, dueDate: e.target.value})}
                    className="input-modern"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-3"></span>
                Additional Information
              </h3>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-2 4h.01M9 5a4 4 0 014-4h2a4 4 0 014 4M9 5a4 4 0 004 4h2a4 4 0 004-4M9 5a4 4 0 014 4v11a4 4 0 004-4" />
                    </svg>
                    <span>Description</span>
                  </div>
                </label>
                <textarea
                  value={newDebt.description}
                  onChange={(e) => setNewDebt({...newDebt, description: e.target.value})}
                  className="input-modern"
                  rows="4"
                  placeholder="Add any additional notes or description about this debt..."
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                className="btn-primary flex-1 flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create Debt</span>
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Debts Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Debts</h2>
        </div>
        {debts.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No debts found. Click "Add Debt" to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Remaining
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Interest Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {debts.map((debt) => (
                  <tr key={debt._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {debt.title}
                      </div>
                      {debt.description && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {debt.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 dark:text-white capitalize">
                        {debt.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatCurrency(debt.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatCurrency(debt.remainingAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {debt.interestRate ? `${debt.interestRate}%` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatDate(debt.dueDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(debt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setPaymentModal({
                            show: true,
                            debt: debt,
                            amount: ''
                          })}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Pay
                        </button>
                        <button
                          onClick={() => handleDeleteDebt(debt._id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {paymentModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Record Payment - {paymentModal.debt?.title}
            </h3>
            <form onSubmit={handlePayment}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Amount (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={paymentModal.amount}
                  onChange={(e) => setPaymentModal({...paymentModal, amount: e.target.value})}
                  className="input-field"
                  placeholder="Enter payment amount"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="btn-primary">
                  Record Payment
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentModal({ show: false, debt: null, amount: '' })}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebtTracker;
