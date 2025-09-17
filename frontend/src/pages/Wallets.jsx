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
  const [editingWallet, setEditingWallet] = useState(null);

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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Your Wallets
        </h1>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add New Wallet
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
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
                } catch (err) {
                  setError(err.response?.data?.message || 'Error deleting wallet');
                }
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Wallets;
