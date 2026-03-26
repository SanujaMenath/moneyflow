import React, { useState, useMemo } from "react";
import { createTransaction } from "./services/transactionService";
import { Transaction, RecurringFrequency } from "../types/transaction";

interface AddTransactionFormProps {
  onClose: () => void;
  onSave: (data: Transaction) => void;
}

// Define categories - easy to expand later
const incomeCategories = [
  "Salary",
  "Freelance",
  "Investment",
  "Business",
  "Gift",
  "Other Income",
] as const;

const expenseCategories = [
  "Food & Dining",
  "Transport",
  "Housing & Rent",
  "Bills & Utilities",
  "Shopping",
  "Healthcare",
  "Entertainment",
  "Education",
  "Travel",
  "Installments/Loans",
  "Other Expense",
] as const;

const frequencies: { value: RecurringFrequency; label: string }[] = [
  { value: "none", label: "One-time" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

const AddTransactionForm = ({ onClose, onSave }: AddTransactionFormProps) => {
  const today = new Date().toISOString().split("T")[0];

  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(today);
  const [recurringFrequency, setRecurringFrequency] = useState<RecurringFrequency>("none");
  const [recurringEndDate, setRecurringEndDate] = useState<string>("");

  // Dynamically filtered categories based on type
  const availableCategories = useMemo(() => {
    return type === "income" ? incomeCategories : expenseCategories;
  }, [type]);

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
      recurringFrequency,                    // new
      recurringEndDate: recurringEndDate || null, // new
    };

    await createTransaction(transactionData);
    onSave(transactionData);

    // Reset form
    setAmount("");
    setCategory("");
    setDate(today);
    setType("expense");
    setRecurringFrequency("none");
    setRecurringEndDate("");
    onClose();
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl max-w-md mx-auto">
      <h3 className="text-xl font-bold text-text-primary mb-6">
        New Transaction
      </h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Amount */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-secondary">Amount</label>
          <input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="p-3 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
            required
          />
        </div>

        {/* Type Toggle */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-secondary">Transaction Type</label>
          <div className="flex bg-bg p-1 rounded-xl border border-border">
            <button
              type="button"
              onClick={() => {
                setType("income");
                setCategory(""); // reset category when type changes
              }}
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
              onClick={() => {
                setType("expense");
                setCategory("");
              }}
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

        {/* Category - Dynamic */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-secondary">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-3 border border-border rounded-xl"
            required
          >
            <option value="">Select category</option>
            {availableCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-secondary">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-3 border border-border rounded-xl focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        {/* Recurring */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-secondary">Recurring</label>
          <select
            value={recurringFrequency}
            onChange={(e) => setRecurringFrequency(e.target.value as RecurringFrequency)}
            className="p-3 border border-border rounded-xl"
          >
            {frequencies.map((freq) => (
              <option key={freq.value} value={freq.value}>
                {freq.label}
              </option>
            ))}
          </select>
        </div>

        {/* Recurring End Date (only show if recurring is not "none") */}
        {recurringFrequency !== "none" && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-secondary">
              End Date (optional)
            </label>
            <input
              type="date"
              value={recurringEndDate}
              onChange={(e) => setRecurringEndDate(e.target.value)}
              className="p-3 border border-border rounded-xl focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-text-secondary">
              Leave empty for indefinite recurring
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-6">
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
            Save Transaction
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTransactionForm;