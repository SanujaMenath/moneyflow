import { useState } from "react";
import MainLayout from "./layout/MainLayout";
import AddTransactionForm from "./features/transactions/AddTransactionForm";
import type { Transaction } from "./types/transaction";

function App() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [showAddModal, setShowAddModal] = useState(false);

  // ✅ Add this
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // ✅ Handler function
  const handleAddTransaction = (data: Transaction) => {
    setTransactions((prev) => [...prev, data]);
  };

  return (
    <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      
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

          {/* ✅ Show transactions */}
          <div className="p-6">
            {transactions.length === 0 ? (
              <p className="text-gray-400 text-center">No transactions yet.</p>
            ) : (
              transactions.map((t, index) => (
                <div key={index} className="flex justify-between py-2 border-b">
                  <span>{t.category}</span>
                  <span className={t.type === "income" ? "text-income" : "text-expense"}>
                    {t.type === "income" ? "+" : "-"}${(t.amount / 100).toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative">
            <AddTransactionForm 
              onSave={handleAddTransaction}   // ✅ correct
              onClose={() => setShowAddModal(false)} 
            />
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default App;