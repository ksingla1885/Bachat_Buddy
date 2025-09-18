import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const TransactionForm = ({ onSubmit, wallets, refreshWallets, initialData = null }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    defaultValues: initialData || {
      type: 'Expense',
      date: new Date().toISOString().split('T')[0]
    }
  });

  const transactionType = watch('type');

  const onSubmitForm = async (data) => {
    try {
      setIsLoading(true);

      const payload = {
        type: data.type,
        amount: Number(data.amount),
        walletId: data.walletId,        // ✅ backend expects walletId
        notes: data.description || '',    // ✅ map to notes
        date: data.date,
        category: data.category
      };

      await onSubmit(payload);

      // ✅ Refresh wallets after transaction so latest balance is fetched
      if (typeof refreshWallets === 'function') {
        await refreshWallets();
      }

      if (!initialData) reset();
    } catch (error) {
      console.error('Transaction error:', error);
      alert(error.response?.data?.message || 'Error creating transaction');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Transaction Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            {...register('type')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          >
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            step="0.01"
            {...register('amount', { required: true, min: 0.01 })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          />
          {errors.amount && <p className="text-red-500 text-xs">Amount is required</p>}
        </div>

        {/* Wallet */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Wallet</label>
          <select
            {...register('walletId', { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          >
            <option value="">Select Wallet</option>
            {wallets.map(wallet => (
              <option key={wallet._id} value={wallet._id}>
                {wallet.name} (₹{wallet.currentBalance})
              </option>
            ))}
          </select>
          {errors.walletId && <p className="text-red-500 text-xs">Please select a wallet</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            {...register('category', { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          >
            <option value="">Select Category</option>
            {transactionType === 'Income' ? (
              <>
                <option value="Salary">Salary</option>
                <option value="Investment">Investment</option>
                <option value="Business">Business</option>
                <option value="Other Income">Other Income</option>
              </>
            ) : (
              <>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Shopping">Shopping</option>
                <option value="Bills">Bills</option>
                <option value="Other Expense">Other Expense</option>
              </>
            )}
          </select>
          {errors.category && <p className="text-red-500 text-xs">Category is required</p>}
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            {...register('date', { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          />
          {errors.date && <p className="text-red-500 text-xs">Date is required</p>}
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <input
            type="text"
            {...register('description')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            placeholder="Optional notes"
          />
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={() => reset()}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Create Transaction'}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
