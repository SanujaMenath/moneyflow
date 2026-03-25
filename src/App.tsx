import { useState, useEffect, useMemo } from "react";
import MainLayout from "./layout/MainLayout";
import AddTransactionForm from "./features/transactions/AddTransactionForm";
import type { Transaction } from "./types/transaction";
import {
  getTransactions,
  deleteTransaction,
} from "./features/transactions/transactionService";
import { Trash2 } from "lucide-react";

function App() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [showAddModal, setShowAddModal] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // 1. Fetch data from SQLite
  const refreshData = async () => {
    const data = await getTransactions();
    setTransactions(data);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const stats = useMemo(() => {
    return transactions.reduce(
      (acc, t) => {
        if (t.type === "income") {
          acc.income += t.amount;
          acc.balance += t.amount;
        } else {
          acc.expenses += t.amount;
          acc.balance -= t.amount;
        }
        return acc;
      },
      { balance: 0, income: 0, expenses: 0 },
    );
  }, [transactions]);

  // 3. Consolidated Save Handler
  const handleSaveComplete = () => {
    refreshData();
    setShowAddModal(false);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?",
    );

    if (confirmed) {
      await deleteTransaction(id);
      refreshData();
    }
  };

  return (
    <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {/* Dashboard View */}
      {activeTab === "Dashboard" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
              <p className="text-text-secondary text-sm">Total Balance</p>
              <h3 className="text-3xl font-bold mt-1 text-text-primary">
                $
                {(stats.balance / 100).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </h3>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
              <p className="text-text-secondary text-sm">Monthly Income</p>
              <h3 className="text-3xl font-bold mt-1 text-text-income">
                +$
                {(stats.income / 100).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </h3>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
              <p className="text-text-secondary text-sm">Monthly Expenses</p>
              <h3 className="text-3xl font-bold mt-1 text-text-expense">
                -$
                {(stats.expenses / 100).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </h3>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-border h-64 flex items-center justify-center text-gray-400">
            Analytics Chart Placeholder
          </div>
        </div>
      )}

      {/* Transactions View */}
      {activeTab === "Transactions" && (
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h3 className="font-bold text-text-primary">Recent History</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              + Add Transaction
            </button>
          </div>

          <div className="overflow-x-auto">
            {transactions.length === 0 ? (
              <div className="p-20 text-center text-gray-400">
                No transactions yet.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-text-secondary text-xs uppercase tracking-wider border-b border-border">
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold">Category</th>
                    <th className="p-4 font-semibold text-right">Amount</th>
                    <th className="p-4 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
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
                      <td
                        className={`p-4 text-sm font-bold text-right ${
                          t.type === "income"
                            ? "text-text-income"
                            : "text-text-expense"
                        }`}
                      >
                        {t.type === "income" ? "+" : "-"}$
                        {(t.amount / 100).toFixed(2)}
                      </td>
                      <td className="p-4 text-center text-red-500">
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="p-2  hover:text-text-expense hover:bg-gray-100 rounded-lg transition-all"
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
      )}

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <AddTransactionForm
              onSave={handleSaveComplete}
              onClose={() => setShowAddModal(false)}
            />
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default App;
