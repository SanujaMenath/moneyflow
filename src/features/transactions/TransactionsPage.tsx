import { Trash2 } from "lucide-react";
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
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border flex justify-between items-center">
        <h3 className="font-bold text-text-primary text-lg">
          All Transactions
        </h3>

        <button
          onClick={onAddClick}
          className="bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2"
        >
          + Add Transaction
        </button>
      </div>

      {/* Table Area */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-20 text-center text-gray-400">
            Loading transactions...
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-20 text-center text-gray-400">
            No transactions yet. Start tracking your cash flow!
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-text-secondary text-xs uppercase tracking-wider border-b border-border bg-gray-50">
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold text-right">Amount</th>
                <th className="p-4 font-semibold text-center">Recurring</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((t: Transaction) => (
                <tr
                  key={t.id}
                  className="border-b border-border hover:bg-bg/50 transition-colors"
                >
                  <td className="p-4 text-sm text-text-secondary">
                    {t.date}
                  </td>

                  <td className="p-4 text-sm font-medium text-text-primary">
                    {t.category}
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full Rs.{
                        t.type === "income"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {t.type.toUpperCase()}
                    </span>
                  </td>

                  <td
                    className={`p-4 text-sm font-bold text-right Rs.{
                      t.type === "income"
                        ? "text-text-income"
                        : "text-text-expense"
                    }`}
                  >
                    {t.type === "income" ? "+" : "-"}Rs.
                    {(t.amount / 100).toFixed(2)}
                  </td>

                  <td className="p-4 text-center text-sm text-text-secondary">
                    {t.recurringFrequency &&
                    t.recurringFrequency !== "none"
                      ? t.recurringFrequency
                      : "—"}
                  </td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() => remove(t.id!)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete Transaction"
                    >
                      <Trash2 size={18} />
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