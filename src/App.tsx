import { useState } from "react";
import MainLayout from "./layout/MainLayout";

import DashboardView from "./features/dashboard/DashboardView";
import TransactionsPage from "./features/transactions/TransactionsPage";
import AddTransactionForm from "./features/transactions/AddTransactionForm";
import { useTransactions } from "./features/transactions/hooks/useTransactions";

function App() {
  const [activeTab, setActiveTab] = useState<
    "Dashboard" | "Transactions" | "Analytics"
  >("Dashboard");
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddTransaction = () => setShowAddModal(true);
  const tx = useTransactions();

  const handleSaveComplete = () => {
    tx.refresh(); 
    setShowAddModal(false);
  };

  return (
    <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === "Dashboard" && <DashboardView transactions={tx.transactions} />}

      {activeTab === "Transactions" && (
        <TransactionsPage
          transactions={tx.transactions}
          remove={tx.remove}
          loading={tx.loading}
          onAddClick={handleAddTransaction}
        />
      )}

      {activeTab === "Analytics" && (
        <div className="bg-white rounded-2xl border border-border p-12 text-center">
          <h3 className="text-2xl font-semibold mb-4">Analytics</h3>
          <p className="text-text-secondary">
            Advanced charts and reports coming soon...
          </p>
        </div>
      )}

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
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
