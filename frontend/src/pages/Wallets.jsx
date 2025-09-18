import { useState, useEffect } from 'react';
import * as api from '../services/api';
import WalletCard from '../components/WalletCard';

const Wallets = () => {
  const [wallets, setWallets] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newWallet, setNewWallet] = useState({
    name: '',
    type: 'Cash',
    openingBalance: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [editingWallet, setEditingWallet] = useState(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferFrom, setTransferFrom] = useState(null);
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferNotes, setTransferNotes] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      setIsLoading(true);
      const response = await api.getWallets();
      setWallets(response.data.data.wallets);
      setError('');
    } catch (err) {
      console.error("Fetch wallets error:", err.response?.data || err.message);
      setError(err.response?.data?.message || 'Error fetching wallets');
    } finally {
      setIsLoading(false);
    }
  };

  const openTransferModal = (wallet) => {
    setTransferFrom(wallet._id);
    setTransferTo('');
    setTransferAmount('');
    setTransferNotes('');
    setShowTransferModal(true);
  };

  const submitTransfer = async (e) => {
    e.preventDefault();
    if (!transferFrom || !transferTo || !transferAmount) {
      setError('Please fill all transfer fields');
      return;
    }
    if (transferFrom === transferTo) {
      setError('Source and destination wallets must be different');
      return;
    }
    if (!wallets.find(w => w._id === transferTo)) {
      setError('Please select a valid destination wallet');
      return;
    }

    try {
      setIsTransferring(true);
      const payload = {
        type: 'Transfer',
        amount: Number(transferAmount),
        walletId: transferFrom,
        notes: transferNotes,
        date: new Date()
      };
      // Only add toWallet if valid
      if (transferTo) {
        payload.toWallet = transferTo;
      }

      await api.createTransaction(payload);
      await fetchWallets();
      setShowTransferModal(false);
      setError('');
    } catch (err) {
      console.error('Transfer error:', err.response?.data || err.message || err);
      setError(err.response?.data?.message || 'Error creating transfer');
    } finally {
      setIsTransferring(false);
    }
  };

  const handleCreateWallet = async (e) => {
    e.preventDefault();
    try {
      // Send correct field names as required by backend (openingBalance)
      const payload = {
        name: newWallet.name,
        type: newWallet.type,
        openingBalance: newWallet.openingBalance
      };

      const response = await api.createWallet(payload);

      // Option 1: Re-fetch wallets to ensure correct data
      await fetchWallets();

      // Option 2 (if you want instant UI update without re-fetching):
      // setWallets([...wallets, response.data.data.wallet]);

      setIsCreating(false);
      setNewWallet({ name: '', type: 'Cash', openingBalance: 0 });
      setError('');
    } catch (err) {
      console.error("Wallet creation error:", err.response?.data || err.message);
      setError(err.response?.data?.message || 'Error creating wallet');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Banner Section */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-gradient mb-2 flex items-center justify-center">
          <span className="mr-3">💳</span>
          My Wallets
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Manage and track all your financial accounts in one place
        </p>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Wallets Overview</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add Wallet</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {infoMessage && (
        <div className="relative mb-6 animate-fadeInUp">
          {/* 3D Animated Container */}
          <div className="relative bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden">
            
            {/* Animated Background Particles */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-400/20 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
              <div className="absolute top-8 right-8 w-6 h-6 bg-indigo-400/20 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute bottom-4 left-1/3 w-4 h-4 bg-purple-400/20 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
              <div className="absolute top-1/2 right-4 w-3 h-3 bg-blue-300/30 rounded-full animate-pulse"></div>
            </div>

            {/* Floating 3D Icon */}
            <div className="flex items-start space-x-4 relative z-10">
              <div className="relative animate-float3D">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-6 transition-transform duration-300 animate-glow3D">
                  {/* 3D Shadow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl transform translate-x-1 translate-y-1 -z-10 opacity-50"></div>
                  
                  {/* Animated Clock Icon */}
                  <div className="relative animate-wiggle">
                    <svg className="w-8 h-8 text-white animate-spin" style={{animationDuration: '3s'}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    
                    {/* Glowing Ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping"></div>
                  </div>
                </div>
                
                {/* Floating Sparkles */}
                <div className="absolute -top-2 -right-2 w-4 h-4 animate-sparkle">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                </div>
                <div className="absolute -bottom-1 -left-1 w-3 h-3 animate-sparkle" style={{animationDelay: '1s'}}>
                  <div className="w-1 h-1 bg-blue-300 rounded-full"></div>
                </div>
                <div className="absolute top-1 left-8 w-2 h-2 animate-sparkle" style={{animationDelay: '0.5s'}}>
                  <div className="w-1 h-1 bg-purple-300 rounded-full"></div>
                </div>
              </div>

              {/* Content with 3D Text Effect */}
              <div className="flex-1">
                <div className="relative">
                  <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 mb-2 transform hover:scale-105 transition-transform duration-300">
                    ⏰ Wallet Protection Active
                  </h3>
                  {/* Text Shadow Effect */}
                  <div className="absolute inset-0 text-xl font-bold text-blue-200 dark:text-blue-800 transform translate-x-0.5 translate-y-0.5 -z-10 mb-2">
                    ⏰ Wallet Protection Active
                  </div>
                </div>
                
                <div className="relative">
                  <p className="text-blue-800 dark:text-blue-200 leading-relaxed transform hover:translate-x-1 transition-transform duration-300">
                    {infoMessage}
                  </p>
                  {/* Subtle text shadow */}
                  <div className="absolute inset-0 text-blue-300 dark:text-blue-700 transform translate-x-0.5 translate-y-0.5 -z-10">
                    {infoMessage}
                  </div>
                </div>

                {/* Animated Progress Bar */}
                <div className="mt-4 relative">
                  <div className="w-full h-2 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 rounded-full animate-pulse transform origin-left animate-slideInLeft"></div>
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-300 mt-1 animate-fadeInUp">
                    🛡️ Security cooldown period active
                  </p>
                </div>
              </div>

              {/* 3D Close Button */}
              <button 
                onClick={() => setInfoMessage('')}
                className="relative group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 hover:rotate-12 transition-all duration-300 group-hover:shadow-2xl">
                  {/* 3D Shadow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-pink-700 rounded-xl transform translate-x-0.5 translate-y-0.5 -z-10 opacity-50 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform duration-300"></div>
                  
                  <svg className="w-5 h-5 text-white transform group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-xl bg-red-400/20 scale-0 group-hover:scale-150 transition-transform duration-300 -z-20"></div>
              </button>
            </div>

            {/* Animated Border Glow */}
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 opacity-20 animate-pulse"></div>
            
            {/* Corner Decorations */}
            <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-blue-300 dark:border-blue-600 rounded-tl-lg"></div>
            <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-indigo-300 dark:border-indigo-600 rounded-tr-lg"></div>
            <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-purple-300 dark:border-purple-600 rounded-bl-lg"></div>
            <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-blue-300 dark:border-blue-600 rounded-br-lg"></div>
          </div>
        </div>
      )}


      {(isCreating || editingWallet) && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {editingWallet ? 'Edit Wallet' : 'Create New Wallet'}
          </h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (editingWallet) {
                try {
                  const payload = {
                    name: editingWallet.name,
                    type: editingWallet.type,
                    openingBalance: editingWallet.openingBalance
                  };
                  await api.updateWallet(editingWallet._id, payload);
                  await fetchWallets();
                  setEditingWallet(null);
                  setError('');
                } catch (err) {
                  setError(err.response?.data?.message || 'Error updating wallet');
                }
              } else {
                await handleCreateWallet(e);
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Wallet Name
              </label>
              <input
                type="text"
                value={editingWallet ? editingWallet.name : newWallet.name}
                onChange={(e) => {
                  if (editingWallet) {
                    setEditingWallet({ ...editingWallet, name: e.target.value });
                  } else {
                    setNewWallet({ ...newWallet, name: e.target.value });
                  }
                }}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Type
              </label>
              <select
                value={editingWallet ? editingWallet.type : newWallet.type}
                onChange={(e) => {
                  if (editingWallet) {
                    setEditingWallet({ ...editingWallet, type: e.target.value });
                  } else {
                    setNewWallet({ ...newWallet, type: e.target.value });
                  }
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="Cash">Cash</option>
                <option value="Bank">Bank</option>
                <option value="Card">Card</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Opening Balance (₹)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={editingWallet ? editingWallet.openingBalance : newWallet.openingBalance}
                onChange={(e) => {
                  const val = e.target.value;
                  if (editingWallet) {
                    setEditingWallet({
                      ...editingWallet,
                      openingBalance: val === '' ? 0 : parseFloat(val)
                    });
                  } else {
                    setNewWallet({
                      ...newWallet,
                      openingBalance: val === '' ? 0 : parseFloat(val)
                    });
                  }
                }}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  if (editingWallet) {
                    setEditingWallet(null);
                  } else {
                    setIsCreating(false);
                  }
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {editingWallet ? 'Update Wallet' : 'Create Wallet'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wallets.map(wallet => (
          <WalletCard
            key={wallet._id}
            wallet={wallet}
            onEdit={() => setEditingWallet(wallet)}
            onDelete={async () => {
              if (window.confirm('Are you sure you want to delete this wallet?')) {
                try {
                  await api.deleteWallet(wallet._id);
                  setWallets(wallets.filter(w => w._id !== wallet._id));
                  setError(''); // Clear any previous errors
                  setInfoMessage(''); // Clear any previous info messages
                } catch (err) {
                  const errorMessage = err.response?.data?.message || 'Error deleting wallet';
                  
                  // Check if it's a time-based restriction (12 hours or 24 hours)
                  if (errorMessage.includes('12 hours') || errorMessage.includes('24 hours')) {
                    setInfoMessage(errorMessage);
                    setError(''); // Clear error state
                  } else {
                    setError(errorMessage);
                    setInfoMessage(''); // Clear info state
                  }
                }
              }
            }}
            onTransfer={() => openTransferModal(wallet)}
            // Removed onViewHistory
          />
        ))}
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-md shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Create Transfer</h3>
            <form onSubmit={submitTransfer} className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700">From</label>
                <select value={transferFrom} onChange={(e) => setTransferFrom(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                  <option value="">Select source</option>
                  {wallets.map(w => <option key={w._id} value={w._id}>{w.name} (₹{w.currentBalance})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700">To</label>
                <select value={transferTo} onChange={(e) => setTransferTo(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                  <option value="">Select destination</option>
                  {wallets.filter(w => w._id !== transferFrom).map(w => <option key={w._id} value={w._id}>{w.name} (₹{w.currentBalance})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700">Amount</label>
                <input type="number" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
              <div>
                <label className="block text-sm text-gray-700">Notes</label>
                <input type="text" value={transferNotes} onChange={(e) => setTransferNotes(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setShowTransferModal(false)} className="px-3 py-1 border rounded">Cancel</button>
                <button type="submit" disabled={isTransferring} className="px-3 py-1 bg-indigo-600 text-white rounded">{isTransferring ? 'Sending...' : 'Send Transfer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {/* Removed transfer history modal */}
    </div>
  );
};

export default Wallets;
