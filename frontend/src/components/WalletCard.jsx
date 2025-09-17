import React from 'react';

function WalletCard({ wallet, onEdit = () => {}, onDelete = () => {} }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{wallet.name}</h3>
        <span className="px-3 py-1 text-sm rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
          {wallet.type}
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Opening Balance</span>
          <span className="font-medium text-gray-900 dark:text-white">
            ₹{wallet.openingBalance.toLocaleString()}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Current Balance</span>
          <span className="font-medium text-gray-900 dark:text-white">
            ₹{wallet.currentBalance.toLocaleString()}
          </span>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={() => onEdit(wallet)}
          className="px-3 py-1 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(wallet)}
          className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default WalletCard;
