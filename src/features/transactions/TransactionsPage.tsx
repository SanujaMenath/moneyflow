import { Trash2, Plus } from "lucide-react";
import type { Transaction } from "../types/transaction";

interface TransactionsPageProps {
  transactions: Transaction[];
  remove: (id: number) => Promise<void>;
  onAddClick: () => void;
  loading: boolean;
}

const TransactionsPage = ({
  onAddClick,
  transactions,
  remove,
  loading,
}: TransactionsPageProps) => {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="min-w-0">
          <h3 className="font-bold text-text-primary text-base lg:text-lg truncate">
            All Transactions
          </h3>
          <p className="text-text-secondary text-xs mt-0.5">
            Showing {transactions.length} records
          </p>
        </div>

        <button
          onClick={onAddClick}
          className="w-full sm:w-auto shrink-0 bg-primary hover:bg-blue-700 text-white px-4 lg:px-5 py-2 lg:py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <Plus size={18} />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Table Area */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-12 sm:p-20 text-center text-text-secondary animate-pulse text-sm">
            Loading transactions...
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-12 sm:p-20 text-center text-text-secondary text-sm">
            No transactions yet. Start tracking your cash flow!
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-160">
            <thead>
              <tr className="text-text-secondary text-[10px] lg:text-xs uppercase tracking-wider border-b border-border bg-gray-50/50">
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold text-right">Amount</th>
                <th className="px-4 py-3 font-semibold text-center">Recurring</th>
                <th className="px-4 py-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {transactions.map((t: Transaction) => (
                <tr
                  key={t.id}
                  className="hover:bg-gray-50/40 transition-colors group"
                >
                  <td className="px-4 py-3.5 text-xs lg:text-sm text-text-secondary whitespace-nowrap">
                    {t.date}
                  </td>

                  <td className="px-4 py-3.5 text-xs lg:text-sm font-medium text-text-primary">
                    {t.category}
                  </td>

                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-block px-2.5 py-0.5 text-[10px] lg:text-xs font-bold rounded-md border ${
                        t.type === "income"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : "bg-rose-50 text-rose-700 border-rose-100"
                      }`}
                    >
                      {t.type.toUpperCase()}
                    </span>
                  </td>

                  <td
                    className={`px-4 py-3.5 text-xs lg:text-sm font-bold text-right whitespace-nowrap ${
                      t.type === "income" ? "text-text-income" : "text-text-expense"
                    }`}
                  >
                    {t.type === "income" ? "+" : "-"} Rs.
                    {(t.amount / 100).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </td>

                  <td className="px-4 py-3.5 text-center text-xs text-text-secondary">
                    <span className="bg-gray-100 px-2 py-1 rounded text-[10px] whitespace-nowrap">
                      {t.recurringFrequency && t.recurringFrequency !== "none"
                        ? t.recurringFrequency
                        : "—"}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-center">
                    <button
                      onClick={() => remove(t.id!)}
                      className="p-2 text-text-secondary hover:text-text-expense hover:bg-rose-50 rounded-lg transition-all"
                      title="Delete Transaction"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;