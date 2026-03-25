import React, { useState } from "react";
import { createTransaction } from "./transactionService";
import { Transaction } from "../../types/transaction";

interface AddTransactionFormProps {
  onClose: () => void;
  onSave: (data: Transaction) => void;
}
const AddTransactionForm = ({ onClose, onSave }: AddTransactionFormProps) => {
  const today = new Date().toISOString().split("T")[0];

  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(today);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert("Please enter a valid amount greater than 0.");
      return;
    }

    const transactionData: Transaction = {
      amount: Math.round(numericAmount * 100),
      type,
      category: category.trim(),
      date,
      createdAt: new Date().toISOString(),
    };

    await createTransaction(transactionData);
    onSave(transactionData);
    setAmount("");
    setCategory("");
    setDate(today);
    setType("expense");
    onClose();
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl">
      <h3 className="text-xl font-bold text-text-primary mb-6">
        New Transaction
      </h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Amount Field */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-secondary">
            Amount
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="p-3 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
            required
          />
        </div>

        {/* Type Toggle */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-secondary">
            Transaction Type
          </label>
          <div className="flex bg-bg p-1 rounded-xl border border-border">
            <button
              type="button"
              onClick={() => setType("income")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                type === "income"
                  ? "bg-white text-text-income shadow-sm"
                  : "text-text-secondary"
              }`}
            >
              Income
            </button>
            <button
              type="button"
              onClick={() => setType("expense")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                type === "expense"
                  ? "bg-white text-text-expense shadow-sm"
                  : "text-text-secondary"
              }`}
            >
              Expense
            </button>
          </div>
        </div>

        {/* Category Field */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-secondary">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-3 border border-border rounded-xl"
            required
          >
            <option value="">Select category</option>
            <option value="Salary">Salary</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Bills">Bills</option>
          </select>
        </div>

        {/* Date Field */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-secondary">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-3 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
            required
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-border text-text-secondary rounded-xl hover:bg-bg transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-primary text-white px-4 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/20 transition-all"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTransactionForm;
