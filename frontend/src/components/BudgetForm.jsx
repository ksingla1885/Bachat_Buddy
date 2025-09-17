import React, { useState } from "react";
import { useForm } from "react-hook-form";

function BudgetForm({ onSubmit, initialData = null }) {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || { alertThreshold: 80 }, // % instead of fraction
  });

  const categories = [
    "Groceries", "Transportation", "Dining", "Shopping",
    "Entertainment", "Bills", "Health", "Education", "Others"
  ];

  const handleFormSubmit = async (data) => {
    setIsLoading(true);
    try {
      const [year, month] = data.monthYear.split("-").map(Number);

      const payload = {
        category: data.category,
        amount: Number(data.amount),
        alertThreshold: Number(data.alertThreshold) / 100, // convert % → fraction
        month,
        year,
      };

      await onSubmit(payload);
    } catch (error) {
      console.error("Error submitting budget:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Category */}
      <div>
        <label className="block text-sm font-medium">Category</label>
        <select
          {...register("category", { required: "Category is required" })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 dark:bg-gray-700"
        >
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {errors.category && <p className="text-sm text-red-600">{errors.category.message}</p>}
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium">Amount</label>
        <input
          type="number"
          {...register("amount", { required: "Amount is required", min: 0 })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 dark:bg-gray-700"
          placeholder="0.00"
        />
        {errors.amount && <p className="text-sm text-red-600">{errors.amount.message}</p>}
      </div>

      {/* Month */}
      <div>
        <label className="block text-sm font-medium">Month</label>
        <input
          type="month"
          {...register("monthYear", { required: "Month is required" })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 dark:bg-gray-700"
        />
        {errors.monthYear && <p className="text-sm text-red-600">{errors.monthYear.message}</p>}
      </div>

      {/* Threshold */}
      <div>
        <label className="block text-sm font-medium">Alert Threshold (%)</label>
        <input
          type="number"
          {...register("alertThreshold", { min: 0, max: 100 })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 dark:bg-gray-700"
          placeholder="80"
        />
        {errors.alertThreshold && (
          <p className="text-sm text-red-600">{errors.alertThreshold.message}</p>
        )}
      </div>

      {/* Submit */}
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
        >
          {isLoading ? "Processing..." : initialData ? "Update Budget" : "Add Budget"}
        </button>
      </div>
    </form>
  );
}

export default BudgetForm;
