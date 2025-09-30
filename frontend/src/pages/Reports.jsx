import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
function Reports() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'desc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    category: '',
    type: 'all'
  });
  const [spendingMonth, setSpendingMonth] = useState('');
  const [spendingYear, setSpendingYear] = useState(new Date().getFullYear().toString());
  const [errorMessage, setErrorMessage] = useState('');
  const [lastErrorTime, setLastErrorTime] = useState(0);

  useEffect(() => {
    if (selectedReport) {
      fetchReportData();
    }
  }, [selectedReport]); // Removed filters from dependency array to prevent infinite loops

  // Separate effect for spending analysis filters
  useEffect(() => {
    if (selectedReport === 'spending') {
      fetchSpendingAnalysis();
    }
  }, [spendingMonth, spendingYear, filters.category]);

  const fetchReportData = async () => {
    setIsLoading(true);
    try {
      switch (selectedReport) {
        case 'spending':
          await fetchSpendingAnalysis();
          break;
        case 'income':
          await fetchTransactions('income');
          break;
        case 'budget':
          await fetchBudgets();
          break;
        case 'savings':
          await fetchGoals();
          break;
        case 'cashflow':
          await fetchTransactions();
          break;
        case 'networth':
          await fetchNetWorthData();
          break;
        case 'category':
          await fetchTransactions('expense'); // Only expenses for category analysis
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error fetching report data:', error);

      if (error.response?.status === 401) {
        // Handle authentication error - show message but don't redirect
        alert('Your session has expired. Please refresh the page and log in again.');
      } else {
        alert('Error fetching report data. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTransactions = async (type = 'all') => {
    try {
      const params = {
        ...filters,
        type: type === 'all' ? undefined : type
      };
      const response = await api.getTransactions(params);

      // Handle the correct response structure from backend
      const transactionsData = response.data?.data?.transactions || [];
      const paginationData = response.data?.data?.pagination || {};

      setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
      setTotalPages(paginationData.pages || 1);
      setCurrentPage(paginationData.page || 1);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      console.error('Error details:', error.response?.data || error.message);

      if (error.response?.status === 401) {
        // Handle authentication error - show message but don't redirect
        const currentTime = Date.now();
        if (currentTime - lastErrorTime > 5000) { // Only show error every 5 seconds max
          setErrorMessage('Your session has expired. Please refresh the page and log in again.');
          setLastErrorTime(currentTime);
        }
      } else {
        const currentTime = Date.now();
        if (currentTime - lastErrorTime > 2000) { // Only show error every 2 seconds max for other errors
          setErrorMessage('Error fetching transactions. Please try again.');
          setLastErrorTime(currentTime);
        }
      }

      setTransactions([]);
      setTotalPages(1);
      setCurrentPage(1);
    }
  };

  const fetchSpendingAnalysis = async () => {
    try {
      console.log('Fetching spending analysis for:', spendingMonth, spendingYear);
      const monthParam = spendingMonth ? `${spendingYear}-${spendingMonth.padStart(2, '0')}` : '';
      const params = {
        type: 'expense',
        ...(monthParam && { month: monthParam }),
        ...(filters.category && { category: filters.category })
      };

      const response = await api.getTransactions(params);
      console.log('Spending analysis response:', response);

      // Handle different possible response structures
      let transactionsData = [];

      if (response.data?.data?.transactions) {
        transactionsData = Array.isArray(response.data.data.transactions) ? response.data.data.transactions : [];
      } else if (response.data?.data) {
        transactionsData = Array.isArray(response.data.data) ? response.data.data : [];
      } else if (Array.isArray(response.data)) {
        transactionsData = response.data;
      }

      console.log('Processed spending data:', transactionsData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error fetching spending analysis:', error);
      console.error('Error details:', error.response?.data || error.message);

      if (error.response?.status === 401) {
        const currentTime = Date.now();
        if (currentTime - lastErrorTime > 5000) {
          setErrorMessage('Your session has expired. Please refresh the page and log in again.');
          setLastErrorTime(currentTime);
        }
      } else {
        const currentTime = Date.now();
        if (currentTime - lastErrorTime > 2000) {
          setErrorMessage('Error fetching spending analysis. Please try again.');
          setLastErrorTime(currentTime);
        }
      }

      setTransactions([]);
    }
  };

  const fetchBudgets = async () => {
    try {
      console.log('Fetching budgets...');
      const response = await api.getBudgets();
      console.log('Budgets API response:', response);

      // Handle different possible response structures
      let budgetsData = [];

      if (response.data?.data?.budgets) {
        budgetsData = Array.isArray(response.data.data.budgets) ? response.data.data.budgets : [];
      } else if (response.data?.budgets) {
        budgetsData = Array.isArray(response.data.budgets) ? response.data.budgets : [];
      } else if (Array.isArray(response.data?.data)) {
        budgetsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        budgetsData = response.data;
      }

      console.log('Processed budgets data:', budgetsData);
      setBudgets(budgetsData);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      console.error('Error details:', error.response?.data || error.message);

      if (error.response?.status === 401) {
        const currentTime = Date.now();
        if (currentTime - lastErrorTime > 5000) {
          setErrorMessage('Your session has expired. Please refresh the page and log in again.');
          setLastErrorTime(currentTime);
        }
      } else {
        const currentTime = Date.now();
        if (currentTime - lastErrorTime > 2000) {
          setErrorMessage('Error fetching budgets. Please try again.');
          setLastErrorTime(currentTime);
        }
      }

      setBudgets([]);
    }
  };

  const fetchGoals = async () => {
    try {
      console.log('Fetching goals...');
      const response = await api.getGoals();
      console.log('Goals API response:', response);

      // Handle different possible response structures
      let goalsData = [];

      if (response.data?.data) {
        goalsData = Array.isArray(response.data.data) ? response.data.data : [];
      } else if (Array.isArray(response.data)) {
        goalsData = response.data;
      } else if (response.data?.goals) {
        goalsData = Array.isArray(response.data.goals) ? response.data.goals : [];
      }

      console.log('Processed goals data:', goalsData);
      setGoals(goalsData);
    } catch (error) {
      console.error('Error fetching goals:', error);
      console.error('Error details:', error.response?.data || error.message);

      if (error.response?.status === 401) {
        // Handle authentication error - show message but don't redirect
        const currentTime = Date.now();
        if (currentTime - lastErrorTime > 5000) { // Only show error every 5 seconds max
          setErrorMessage('Your session has expired. Please refresh the page and log in again.');
          setLastErrorTime(currentTime);
        }
      } else {
        const currentTime = Date.now();
        if (currentTime - lastErrorTime > 2000) { // Only show error every 2 seconds max for other errors
          setErrorMessage('Error fetching goals. Please try again.');
          setLastErrorTime(currentTime);
        }
      }

      setGoals([]);
    }
  };

  const fetchNetWorthData = async () => {
    // This would need a new API endpoint for net worth calculation
    // For now, we'll show a placeholder
    setTransactions([]);
  };

  const fetchCategoryData = async () => {
    try {
      const response = await api.getTransactions({ groupBy: 'category' });
      const transactionsData = response.data?.data?.transactions || [];
      setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
    } catch (error) {
      console.error('Error fetching category data:', error);
      console.error('Error details:', error.response?.data || error.message);

      if (error.response?.status === 401) {
        // Handle authentication error - show message but don't redirect
        const currentTime = Date.now();
        if (currentTime - lastErrorTime > 5000) { // Only show error every 5 seconds max
          setErrorMessage('Your session has expired. Please refresh the page and log in again.');
          setLastErrorTime(currentTime);
        }
      } else {
        const currentTime = Date.now();
        if (currentTime - lastErrorTime > 2000) { // Only show error every 2 seconds max for other errors
          setErrorMessage('Error fetching category data. Please try again.');
          setLastErrorTime(currentTime);
        }
      }

      setTransactions([]);
    }
  };

  // Check if any filters are applied
  const hasActiveFilters = () => {
    if (selectedReport === 'spending') {
      return spendingMonth !== '' || spendingYear !== new Date().getFullYear().toString() || filters.category !== '';
    }
    return filters.category !== '' ||
           (selectedReport === 'spending' && filters.category !== '');
  };

  const handleDownloadReport = async (format) => {
    // Check if filters are applied
    if (!hasActiveFilters()) {
      alert('Please apply filters (month/year or category) before exporting the report.');
      return;
    }

    try {
      if (format === 'csv') {
        // Use report-specific CSV export
        const exportParams = {
          ...filters,
          reportType: selectedReport,
          type: selectedReport === 'spending' || selectedReport === 'category' ? 'expense' : selectedReport === 'income' ? 'income' : 'all'
        };

        // Add spending analysis specific filters
        if (selectedReport === 'spending') {
          if (spendingMonth) exportParams.month = `${spendingYear}-${spendingMonth.padStart(2, '0')}`;
          if (spendingYear) exportParams.year = spendingYear;
        }

        const response = await api.exportTransactionsCSV(exportParams);

        // Create blob and download
        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${selectedReport}_report_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      } else if (format === 'pdf') {
        try {
          // Use report-specific PDF export
          console.log('Attempting PDF export for report type:', selectedReport);
          const response = await api.exportPDFReport({
            reportType: selectedReport
          });
          console.log('PDF export response received:', response);

          // Create blob and open in new tab or download
          const blob = new Blob([response.data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          window.open(url, '_blank');
          window.URL.revokeObjectURL(url);

          console.log('PDF export successful');
        } catch (pdfError) {
          console.error('PDF export failed:', pdfError);
          console.error('PDF Error details:', {
            status: pdfError.response?.status,
            statusText: pdfError.response?.statusText,
            data: pdfError.response?.data,
            message: pdfError.message
          });

          // Show more specific error message for PDF
          alert('PDF export failed. This might be due to server configuration. Please try CSV export instead or contact support.');
          return;
        }
      }

      // Show success message
      alert(`Report downloaded successfully as ${format.toUpperCase()}!`);
    } catch (error) {
      console.error('Error downloading report:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });

      if (error.response?.status === 401) {
        // Handle authentication error - show message but don't redirect
        const currentTime = Date.now();
        if (currentTime - lastErrorTime > 5000) { // Only show error every 5 seconds max
          setErrorMessage('Your session has expired. Please refresh the page and log in again.');
          setLastErrorTime(currentTime);
        }
      } else {
        const currentTime = Date.now();
        if (currentTime - lastErrorTime > 2000) { // Only show error every 2 seconds max for other errors
          setErrorMessage('Error downloading report. Please try again.');
          setLastErrorTime(currentTime);
        }
      }
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedTransactions = React.useMemo(() => {
    let sortableItems = Array.isArray(transactions) ? [...transactions] : [];

    // Apply category filter
    if (filters.category) {
      sortableItems = sortableItems.filter(transaction =>
        transaction.category === filters.category
      );
    }

    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [transactions, sortConfig, filters]);

  // Pagination calculations
  const paginationData = React.useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTransactions = sortedTransactions.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);

    return {
      indexOfLastItem,
      indexOfFirstItem,
      currentTransactions,
      totalPages
    };
  }, [currentPage, itemsPerPage, sortedTransactions]);

  const resetFilters = () => {
    setFilters({
      category: '',
      type: 'all'
    });
    setCurrentPage(1);
    setTotalPages(1);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const reportCards = [
    {
      id: 'spending',
      title: 'Spending Analysis',
      icon: '💳',
      gradient: 'from-red-400 to-pink-500',
      description: 'Detailed breakdown of spending patterns by category, merchant, and time period',
      available: true
    },
    {
      id: 'income',
      title: 'Income Reports',
      icon: '💰',
      gradient: 'from-green-400 to-blue-500',
      description: 'Track income sources, analyze earning patterns, and monitor growth',
      available: true
    },
    {
      id: 'budget',
      title: 'Budget Performance',
      icon: '📈',
      gradient: 'from-orange-400 to-yellow-500',
      description: 'Compare actual spending against budgets with variance analysis',
      available: true
    },
    {
      id: 'savings',
      title: 'Savings Progress',
      icon: '🎯',
      gradient: 'from-cyan-400 to-blue-500',
      description: 'Monitor savings goals, track progress toward targets',
      available: true
    },
    {
      id: 'cashflow',
      title: 'Cash Flow Analysis',
      icon: '📊',
      gradient: 'from-purple-400 to-indigo-500',
      description: 'Understand money movement with detailed cash flow statements',
      available: true
    },
    {
      id: 'category',
      title: 'Category Trends',
      icon: '📉',
      gradient: 'from-violet-400 to-purple-500',
      description: 'Analyze spending trends by category over time',
      available: true
    },
    {
      id: 'networth',
      title: 'Network Tracking',
      icon: '💎',
      gradient: 'from-emerald-400 to-green-500',
      description: 'Track your financial network and connections',
      available: false
    }
  ];

  const renderSpendingAnalysisTable = () => {
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">💳</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Spending Data Found</h3>
          <p className="text-gray-600 dark:text-gray-400">No expense transactions found for the selected period</p>
        </div>
      );
    }

    // Calculate spending summary
    const totalSpending = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const avgTransaction = transactions.length > 0 ? totalSpending / transactions.length : 0;
    const topCategory = transactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {});

    const topCategoryName = Object.entries(topCategory).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';
    const topCategoryAmount = Object.entries(topCategory).sort(([,a], [,b]) => b - a)[0]?.[1] || 0;

    return (
      <div className="space-y-6">
        {/* Spending Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-red-50 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 p-4 rounded-lg">
            <div className="text-sm text-red-600 dark:text-red-400 mb-1">Total Spending</div>
            <div className="text-2xl font-bold text-red-900 dark:text-red-100">
              ₹{totalSpending.toLocaleString()}
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg">
            <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">Transactions</div>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {transactions.length}
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg">
            <div className="text-sm text-green-600 dark:text-green-400 mb-1">Avg per Transaction</div>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              ₹{avgTransaction.toFixed(0)}
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg">
            <div className="text-sm text-purple-600 dark:text-purple-400 mb-1">Top Category</div>
            <div className="text-lg font-bold text-purple-900 dark:text-purple-100 truncate">
              {topCategoryName}
            </div>
          </div>
        </div>

        {/* Spending Analysis Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Wallet
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.map((transaction) => (
                <tr key={transaction._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div className="flex flex-col">
                      <span className="font-medium">{new Date(transaction.date).toLocaleDateString('en-IN')}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(transaction.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div className="max-w-xs truncate" title={transaction.description}>
                      {transaction.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.category === 'food' ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200' :
                      transaction.category === 'transport' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                      transaction.category === 'shopping' ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' :
                      transaction.category === 'entertainment' ? 'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200' :
                      transaction.category === 'bills' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                      transaction.category === 'healthcare' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}>
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600 dark:text-red-400">
                    ₹{Math.abs(transaction.amount).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span>{transaction.walletId?.name || 'N/A'}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Spending Insights */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">💡 Spending Insights</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Expenses:</span>
                <span className="font-medium text-red-600 dark:text-red-400">
                  ₹{totalSpending.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Number of Transactions:</span>
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  {transactions.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Average per Transaction:</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  ₹{avgTransaction.toFixed(0)}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Analysis:</strong>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {topCategoryAmount > totalSpending * 0.4
                  ? `🎯 Your biggest expense category is ${topCategoryName}, representing ${(topCategoryAmount / totalSpending * 100).toFixed(1)}% of total spending.`
                  : `📊 Your spending is well-distributed across ${Object.keys(topCategory).length} categories.`
                }
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {avgTransaction > 1000
                  ? `💰 You're making relatively large transactions (avg: ₹${avgTransaction.toFixed(0)}). Consider breaking larger expenses into smaller amounts.`
                  : `✨ Your transaction sizes are reasonable and manageable.`
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderReportContent = () => {
    if (!selectedReport) {
      return (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">📊</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Select a Report</h3>
          <p className="text-gray-600 dark:text-gray-400">Choose a report type above to view detailed analytics</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-red-400">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800 dark:text-red-200">{errorMessage}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setErrorMessage('')}
                  className="text-red-400 hover:text-red-600 dark:text-red-300 dark:hover:text-red-100"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Report Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {reportCards.find(card => card.id === selectedReport)?.title}
            </h2>
            <div className="flex space-x-3">
              <button
                onClick={() => handleDownloadReport('csv')}
                disabled={!hasActiveFilters()}
                className={`btn-secondary flex items-center space-x-2 ${
                  !hasActiveFilters()
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title={!hasActiveFilters() ? 'Apply filters first to enable export' : 'Export as CSV'}
              >
                <span>📄</span>
                <span>CSV</span>
              </button>
              <button
                onClick={() => handleDownloadReport('pdf')}
                disabled={!hasActiveFilters()}
                className={`btn-primary flex items-center space-x-2 ${
                  !hasActiveFilters()
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-blue-600 dark:hover:bg-blue-500'
                }`}
                title={!hasActiveFilters() ? 'Apply filters first to enable export' : 'Export as PDF'}
              >
                <span>📋</span>
                <span>PDF</span>
              </button>
            </div>
            {/* {!hasActiveFilters() && (
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                💡 Apply filters (category) to enable export options
              </div>
            )} */}
          </div>

          {/* Spending Analysis Specific Filters */}
          {selectedReport === 'spending' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Month
                </label>
                <select
                  value={spendingMonth}
                  onChange={(e) => setSpendingMonth(e.target.value)}
                  className="input-modern w-full"
                >
                  <option value="">All Months</option>
                  <option value="01">January</option>
                  <option value="02">February</option>
                  <option value="03">March</option>
                  <option value="04">April</option>
                  <option value="05">May</option>
                  <option value="06">June</option>
                  <option value="07">July</option>
                  <option value="08">August</option>
                  <option value="09">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Year
                </label>
                <select
                  value={spendingYear}
                  onChange={(e) => setSpendingYear(e.target.value)}
                  className="input-modern w-full"
                >
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSpendingMonth('');
                    setSpendingYear(new Date().getFullYear().toString());
                    setFilters({ category: '', type: 'all' });
                  }}
                  className="btn-secondary w-full"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}

          {/* General Filters for other reports */}
          {selectedReport !== 'spending' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {selectedReport === 'spending' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                    className="input-modern w-full"
                  >
                    <option value="">All Categories</option>
                    <option value="food">🍽️ Food & Dining</option>
                    <option value="transport">🚗 Transport</option>
                    <option value="shopping">🛍️ Shopping</option>
                    <option value="entertainment">🎬 Entertainment</option>
                    <option value="bills">💡 Bills & Utilities</option>
                    <option value="healthcare">🏥 Healthcare</option>
                    <option value="education">📚 Education</option>
                    <option value="other">📦 Other</option>
                  </select>
                </div>
              )}
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="btn-secondary w-full"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Report Data */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            {selectedReport === 'spending' && renderSpendingAnalysisTable()}
            {selectedReport === 'income' && renderTransactionTable()}
            {selectedReport === 'budget' && renderBudgetTable()}
            {selectedReport === 'savings' && renderGoalsTable()}
            {selectedReport === 'cashflow' && renderCashFlowAnalysis()}
            {selectedReport === 'networth' && renderNetWorthReport()}
            {selectedReport === 'category' && renderCategoryAnalysis()}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-8 px-4">
        <h1 className="text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Financial Reports
          </span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Gain deep insights into your financial health with comprehensive reports
        </p>
      </div>

      {/* Report Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportCards.map((card) => (
          <div
            key={card.id}
            onClick={() => card.available && setSelectedReport(card.id)}
            className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border transition-all duration-300 cursor-pointer ${
              selectedReport === card.id
                ? 'border-blue-500 dark:border-blue-400 shadow-xl ring-2 ring-blue-500/20 bg-blue-50 dark:bg-blue-900/10'
                : 'border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            } ${!card.available ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:-translate-y-1'} ${
              isLoading && selectedReport === card.id ? 'animate-pulse' : ''
            }`}
          >
            <div className={`w-12 h-12 bg-gradient-to-r ${card.gradient} rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 ${
              selectedReport === card.id ? 'scale-110' : 'hover:scale-105'
            }`}>
              <span className="text-xl">{card.icon}</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              {card.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {card.description}
            </p>
            {!card.available && (
              <div className="mt-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                Coming Soon
              </div>
            )}
            {selectedReport === card.id && (
              <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                <span className="mr-1">📊</span>
                Active Report
              </div>
            )}
            {isLoading && selectedReport === card.id && (
              <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                <div className="w-3 h-3 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                Loading Data...
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Report Content */}
      {renderReportContent()}

      {/* Back Button */}
      {selectedReport && (
        <div className="text-center">
          <button
            onClick={() => setSelectedReport(null)}
            className="btn-secondary"
          >
            ← Back to Reports
          </button>
        </div>
      )}
    </div>
  );
}

  const renderTransactionTable = () => (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {sortedTransactions.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Filtered Results</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            ₹{sortedTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Total Income</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            ₹{sortedTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Total Expenses</div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center space-x-1">
                  <span>Date</span>
                  {sortConfig.key === 'date' && (
                    <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort('description')}
              >
                <div className="flex items-center space-x-1">
                  <span>Description</span>
                  {sortConfig.key === 'description' && (
                    <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Category
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center space-x-1">
                  <span>Amount</span>
                  {sortConfig.key === 'amount' && (
                    <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Wallet
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {paginationData.currentTransactions.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  <div className="space-y-2">
                    <div className="text-4xl">📊</div>
                    <div>No transactions found for the selected filters</div>
                    <div className="text-sm">Try adjusting your filters or select a different date range</div>
                  </div>
                </td>
              </tr>
            ) : (
              paginationData.currentTransactions.map((transaction) => (
                <tr key={transaction._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div className="flex flex-col">
                      <span className="font-medium">{new Date(transaction.date).toLocaleDateString('en-IN')}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(transaction.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div className="max-w-xs truncate" title={transaction.description}>
                      {transaction.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.category === 'food' ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200' :
                      transaction.category === 'transport' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                      transaction.category === 'shopping' ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' :
                      transaction.category === 'entertainment' ? 'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200' :
                      transaction.category === 'bills' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                      transaction.category === 'healthcare' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}>
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex flex-col">
                      <span className={`font-bold text-lg ${transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {transaction.type === 'income' ? '+' : '-'}₹{Math.abs(transaction.amount).toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {transaction.type === 'income' ? 'Income' : 'Expense'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span>{transaction.walletId?.name || 'N/A'}</span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {paginationData.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing {paginationData.indexOfFirstItem + 1} to {Math.min(paginationData.indexOfLastItem, sortedTransactions.length)} of {sortedTransactions.length} results
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Previous
            </button>
            {[...Array(paginationData.totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`px-3 py-1 text-sm border rounded-md ${
                  currentPage === i + 1
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === paginationData.totalPages}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderBudgetTable = () => {
    if (!Array.isArray(budgets) || budgets.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📈</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Budgets Found</h3>
          <p className="text-gray-600 dark:text-gray-400">Create some budgets to see performance analysis</p>
        </div>
      );
    }

    const totalBudgeted = budgets.reduce((sum, budget) => sum + budget.amount, 0);
    const totalSpent = budgets.reduce((sum, budget) => sum + (budget.spent || 0), 0);
    const totalRemaining = totalBudgeted - totalSpent;
    const avgUtilization = budgets.length > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

    return (
      <div className="space-y-6">
        {/* Budget Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg">
            <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">Total Budgeted</div>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              ₹{totalBudgeted.toLocaleString()}
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 p-4 rounded-lg">
            <div className="text-sm text-orange-600 dark:text-orange-400 mb-1">Total Spent</div>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              ₹{totalSpent.toLocaleString()}
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg">
            <div className="text-sm text-green-600 dark:text-green-400 mb-1">Remaining</div>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              ₹{totalRemaining.toLocaleString()}
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg">
            <div className="text-sm text-purple-600 dark:text-purple-400 mb-1">Avg Utilization</div>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {avgUtilization.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Budget Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Budgeted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Remaining
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Utilization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {budgets.map((budget) => {
                const spent = budget.spent || 0;
                const remaining = budget.amount - spent;
                const utilization = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;

                return (
                  <tr key={budget._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {budget.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ₹{budget.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ₹{spent.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ₹{remaining.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              utilization >= 100 ? 'bg-red-500' :
                              utilization >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(100, utilization)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {utilization.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        utilization >= 100 ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                        utilization >= 80 ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                        'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      }`}>
                        {utilization >= 100 ? 'Over Budget' :
                         utilization >= 80 ? 'Near Limit' : 'On Track'}
                      </span>
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

  const renderGoalsTable = () => {
    if (!Array.isArray(goals) || goals.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎯</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Savings Goals Found</h3>
          <p className="text-gray-600 dark:text-gray-400">Create some savings goals to track your progress</p>
        </div>
      );
    }

    const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const totalSaved = goals.reduce((sum, goal) => sum + (goal.currentAmount || 0), 0);
    const totalProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;
    const completedGoals = goals.filter(goal => (goal.currentAmount || 0) >= goal.targetAmount).length;

    return (
      <div className="space-y-6">
        {/* Goals Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-lg">
            <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">Total Goals</div>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {goals.length}
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg">
            <div className="text-sm text-green-600 dark:text-green-400 mb-1">Completed</div>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {completedGoals}
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 p-4 rounded-lg">
            <div className="text-sm text-purple-600 dark:text-purple-400 mb-1">Total Target</div>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              ₹{totalTarget.toLocaleString()}
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 p-4 rounded-lg">
            <div className="text-sm text-orange-600 dark:text-orange-400 mb-1">Total Saved</div>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              ₹{totalSaved.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Overall Progress</h4>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {totalProgress.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, totalProgress)}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
            <span>₹{totalSaved.toLocaleString()} saved</span>
            <span>₹{totalTarget.toLocaleString()} target</span>
          </div>
        </div>

        {/* Goals Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Goal Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Target
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Saved
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Deadline
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {goals.map((goal) => {
                const current = goal.currentAmount || 0;
                const progress = goal.targetAmount > 0 ? (current / goal.targetAmount) * 100 : 0;
                const isCompleted = current >= goal.targetAmount;

                return (
                  <tr key={goal._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {goal.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ₹{goal.targetAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ₹{current.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              isCompleted ? 'bg-green-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${Math.min(100, progress)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {progress.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isCompleted
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          : progress >= 75
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                          : progress >= 50
                          ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      }`}>
                        {isCompleted ? 'Completed' :
                         progress >= 75 ? 'On Track' :
                         progress >= 50 ? 'In Progress' : 'Just Started'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'No deadline'}
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

  const renderCashFlowAnalysis = () => {
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">💰</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Transactions Found</h3>
          <p className="text-gray-600 dark:text-gray-400">Add some transactions to analyze cash flow patterns</p>
        </div>
      );
    }

    // Group transactions by date
    const groupedByDate = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { income: 0, expenses: 0, transactions: [] };
      }
      acc[date].transactions.push(transaction);
      if (transaction.type === 'income') {
        acc[date].income += transaction.amount;
      } else {
        acc[date].expenses += Math.abs(transaction.amount);
      }
      return acc;
    }, {});

    const totalIncome = Object.values(groupedByDate).reduce((sum, day) => sum + day.income, 0);
    const totalExpenses = Object.values(groupedByDate).reduce((sum, day) => sum + day.expenses, 0);
    const netFlow = totalIncome - totalExpenses;
    const avgDailyIncome = Object.keys(groupedByDate).length > 0 ? totalIncome / Object.keys(groupedByDate).length : 0;
    const avgDailyExpenses = Object.keys(groupedByDate).length > 0 ? totalExpenses / Object.keys(groupedByDate).length : 0;

    return (
      <div className="space-y-6">
        {/* Cash Flow Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg">
            <div className="text-sm text-green-600 dark:text-green-400 mb-1">Total Income</div>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              ₹{totalIncome.toLocaleString()}
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-900/20 dark:to-rose-900/20 p-4 rounded-lg">
            <div className="text-sm text-red-600 dark:text-red-400 mb-1">Total Expenses</div>
            <div className="text-2xl font-bold text-red-900 dark:text-red-100">
              ₹{totalExpenses.toLocaleString()}
            </div>
          </div>
          <div className={`p-4 rounded-lg ${
            netFlow >= 0
              ? 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20'
              : 'bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-900/20'
          }`}>
            <div className={`text-sm mb-1 ${
              netFlow >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'
            }`}>
              Net Flow
            </div>
            <div className={`text-2xl font-bold ${
              netFlow >= 0 ? 'text-blue-900 dark:text-blue-100' : 'text-orange-900 dark:text-orange-100'
            }`}>
              {netFlow >= 0 ? '+' : ''}₹{netFlow.toLocaleString()}
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg">
            <div className="text-sm text-purple-600 dark:text-purple-400 mb-1">Days Analyzed</div>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {Object.keys(groupedByDate).length}
            </div>
          </div>
        </div>

        {/* Daily Cash Flow */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Transactions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Income
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Expenses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Net Flow
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {Object.entries(groupedByDate)
                .sort(([a], [b]) => new Date(b) - new Date(a))
                .map(([date, data]) => {
                  const dailyNet = data.income - data.expenses;
                  return (
                    <tr key={date} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(date).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {data.transactions.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">
                        ₹{data.income.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400">
                        ₹{data.expenses.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`font-medium ${
                          dailyNet >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {dailyNet >= 0 ? '+' : ''}₹{dailyNet.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Cash Flow Insights */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">💡 Cash Flow Insights</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Average Daily Income:</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  ₹{avgDailyIncome.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Average Daily Expenses:</span>
                <span className="font-medium text-red-600 dark:text-red-400">
                  ₹{avgDailyExpenses.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Average Daily Net Flow:</span>
                <span className={`font-medium ${
                  (avgDailyIncome - avgDailyExpenses) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  ₹{(avgDailyIncome - avgDailyExpenses).toFixed(2)}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Analysis:</strong>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {netFlow >= 0
                  ? `🎉 You're maintaining positive cash flow! This is excellent for financial health.`
                  : `⚠️ You have negative cash flow. Consider reducing expenses or increasing income.`
                }
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {avgDailyExpenses > avgDailyIncome * 1.2
                  ? `📊 Your expenses are ${((avgDailyExpenses / avgDailyIncome) * 100).toFixed(0)}% of your income. Consider budgeting.`
                  : `✨ Your spending is well-controlled relative to your income.`
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderNetWorthReport = () => (
    <div className="p-6">
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📈</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Net Worth Tracking</h3>
        <p className="text-gray-600 dark:text-gray-400">Track your assets and liabilities</p>
      </div>
    </div>
  );

  const renderCategoryAnalysis = () => {
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Transactions Found</h3>
          <p className="text-gray-600 dark:text-gray-400">Add some transactions to analyze category trends</p>
        </div>
      );
    }

    // Group transactions by category
    const categoryData = transactions.reduce((acc, transaction) => {
      if (transaction.type === 'expense') {
        const category = transaction.category;
        if (!acc[category]) {
          acc[category] = {
            total: 0,
            count: 0,
            transactions: [],
            avgTransaction: 0
          };
        }
        acc[category].total += Math.abs(transaction.amount);
        acc[category].count += 1;
        acc[category].transactions.push(transaction);
        return acc;
      }
      return acc;
    }, {});

    // Calculate averages and sort by total spending
    const sortedCategories = Object.entries(categoryData)
      .map(([category, data]) => ({
        category,
        ...data,
        avgTransaction: data.total / data.count
      }))
      .sort((a, b) => b.total - a.total);

    const totalSpending = sortedCategories.reduce((sum, cat) => sum + cat.total, 0);
    const topCategory = sortedCategories[0];
    const topCategoryPercentage = totalSpending > 0 ? (topCategory?.total / totalSpending) * 100 : 0;

    return (
      <div className="space-y-6">
        {/* Category Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg">
            <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">Categories</div>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {sortedCategories.length}
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg">
            <div className="text-sm text-green-600 dark:text-green-400 mb-1">Total Spending</div>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              ₹{totalSpending.toLocaleString()}
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 p-4 rounded-lg">
            <div className="text-sm text-orange-600 dark:text-orange-400 mb-1">Top Category</div>
            <div className="text-lg font-bold text-orange-900 dark:text-orange-100 truncate">
              {topCategory?.category || 'N/A'}
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg">
            <div className="text-sm text-purple-600 dark:text-purple-400 mb-1">Top % of Total</div>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {topCategoryPercentage.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category List */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📊 Category Breakdown</h4>
            <div className="space-y-3">
              {sortedCategories.map((category, index) => {
                const percentage = totalSpending > 0 ? (category.total / totalSpending) * 100 : 0;
                const isTopCategory = index === 0;

                return (
                  <div
                    key={category.category}
                    className={`p-4 rounded-lg border transition-all duration-200 ${
                      isTopCategory
                        ? 'border-yellow-200 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          category.category === 'food' ? 'bg-orange-500' :
                          category.category === 'transport' ? 'bg-blue-500' :
                          category.category === 'shopping' ? 'bg-purple-500' :
                          category.category === 'entertainment' ? 'bg-pink-500' :
                          category.category === 'bills' ? 'bg-red-500' :
                          category.category === 'healthcare' ? 'bg-green-500' :
                          'bg-gray-500'
                        }`} />
                        <span className={`font-medium ${
                          isTopCategory ? 'text-yellow-800 dark:text-yellow-200' : 'text-gray-900 dark:text-white'
                        }`}>
                          {category.category}
                          {isTopCategory && ' 👑'}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900 dark:text-white">
                          ₹{category.total.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            isTopCategory ? 'bg-yellow-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${Math.min(100, percentage)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{category.count} transactions</span>
                        <span>Avg: ₹{category.avgTransaction.toFixed(0)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Insights */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">💡 Spending Insights</h4>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">🎯 Top Spending Category</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {topCategory ? (
                    `Your biggest expense category is ${topCategory.category}, accounting for ${topCategoryPercentage.toFixed(1)}% of total spending.`
                  ) : (
                    'No spending data available yet.'
                  )}
                </p>
                {topCategory && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {topCategory.count} transactions • Avg: ₹{topCategory.avgTransaction.toFixed(0)} per transaction
                  </div>
                )}
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">📈 Spending Distribution</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {sortedCategories.length <= 3
                    ? 'You have good spending focus with few categories dominating your expenses.'
                    : 'Your spending is spread across many categories. Consider consolidating to track expenses better.'
                  }
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {sortedCategories.length} categories • {totalSpending.toLocaleString()} total spending
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">💡 Recommendations</h5>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  {topCategoryPercentage > 40 && (
                    <div>• Consider setting a budget limit for your top spending category</div>
                  )}
                  {sortedCategories.length > 7 && (
                    <div>• Try to consolidate spending into fewer categories for better tracking</div>
                  )}
                  {sortedCategories.some(cat => cat.avgTransaction > 5000) && (
                    <div>• Some transactions are quite large - consider breaking them into smaller amounts</div>
                  )}
                  <div>• Review your spending patterns monthly to identify saving opportunities</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Transactions Table */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📋 Recent Transactions by Category</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {transactions
                  .filter(t => t.type === 'expense')
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .slice(0, 20)
                  .map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(transaction.date).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div className="max-w-xs truncate" title={transaction.description}>
                          {transaction.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.category === 'food' ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200' :
                          transaction.category === 'transport' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                          transaction.category === 'shopping' ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' :
                          transaction.category === 'entertainment' ? 'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200' :
                          transaction.category === 'bills' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                          transaction.category === 'healthcare' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                          'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                        }`}>
                          {transaction.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600 dark:text-red-400">
                        ₹{Math.abs(transaction.amount).toLocaleString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-8 px-4">
        <h1 className="text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Financial Reports
          </span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Gain deep insights into your financial health with comprehensive reports
        </p>
      </div>

      {/* Report Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportCards.map((card) => (
          <div
            key={card.id}
            onClick={() => card.available && setSelectedReport(card.id)}
            className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border transition-all duration-300 cursor-pointer ${
              selectedReport === card.id
                ? 'border-blue-500 dark:border-blue-400 shadow-xl ring-2 ring-blue-500/20 bg-blue-50 dark:bg-blue-900/10'
                : 'border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            } ${!card.available ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:-translate-y-1'} ${
              isLoading && selectedReport === card.id ? 'animate-pulse' : ''
            }`}
          >
            <div className={`w-12 h-12 bg-gradient-to-r ${card.gradient} rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 ${
              selectedReport === card.id ? 'scale-110' : 'hover:scale-105'
            }`}>
              <span className="text-xl">{card.icon}</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              {card.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {card.description}
            </p>
            {!card.available && (
              <div className="mt-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                Coming Soon
              </div>
            )}
            {selectedReport === card.id && (
              <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                <span className="mr-1">📊</span>
                Active Report
              </div>
            )}
            {isLoading && selectedReport === card.id && (
              <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                <div className="w-3 h-3 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                Loading Data...
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Report Content */}
      {renderReportContent()}

      {/* Back Button */}
      {selectedReport && (
        <div className="text-center">
          <button
            onClick={() => setSelectedReport(null)}
            className="btn-secondary"
          >
            ← Back to Reports
          </button>
        </div>
      )}
    </div>
  );
}

export default Reports;
