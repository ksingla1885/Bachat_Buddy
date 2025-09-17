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
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferFrom, setTransferFrom] = useState(null);
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferNotes, setTransferNotes] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);

  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyWallet, setHistoryWallet] = useState(null);
  const [historyTransfers, setHistoryTransfers] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

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

  const openHistoryModal = async (wallet) => {
    setHistoryWallet(wallet);
    setShowHistoryModal(true);
    setIsLoadingHistory(true);
    try {
      // fetch transfers (get many and filter client-side for from/to matches)
      const response = await api.getTransactions({ type: 'Transfer', limit: 1000 });
      const all = response.data.data.transactions || [];
      const filtered = all.filter(t => t.walletId === wallet._id || t.toWallet === wallet._id);
      setHistoryTransfers(filtered);
      setError('');
    } catch (err) {
      console.error('Error fetching transfer history:', err.response?.data || err.message || err);
      setError(err.response?.data?.message || 'Error fetching transfer history');
      setHistoryTransfers([]);
    } finally {
      setIsLoadingHistory(false);
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
            onTransfer={() => openTransferModal(wallet)}
            onViewHistory={() => openHistoryModal(wallet)}
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
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-md shadow-lg w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Transfer History — {historyWallet?.name}</h3>
              <button onClick={() => setShowHistoryModal(false)} className="text-gray-500">Close</button>
            </div>
            {isLoadingHistory ? (
              <div className="text-center">Loading...</div>
            ) : (
              <div className="max-h-80 overflow-auto">
                {historyTransfers.length === 0 ? (
                  <div className="text-sm text-gray-600">No transfers found for this wallet.</div>
                ) : (
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 uppercase text-xs">
                        <th className="py-2">Date</th>
                        <th className="py-2">Amount</th>
                        <th className="py-2">From</th>
                        <th className="py-2">To</th>
                        <th className="py-2">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyTransfers.map(t => (
                        <tr key={t._id} className="border-t">
                          <td className="py-2">{new Date(t.date).toLocaleString()}</td>
                          <td className="py-2">₹{Number(t.amount).toLocaleString()}</td>
                          <td className="py-2">{wallets.find(w => w._id === t.walletId)?.name || t.walletId}</td>
                          <td className="py-2">{wallets.find(w => w._id === t.toWallet)?.name || t.toWallet}</td>
                          <td className="py-2">{t.notes || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallets;
