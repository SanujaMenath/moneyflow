import { useState } from "react";
import MainLayout from "./layout/MainLayout";

import DashboardView from "./features/dashboard/DashboardView";
import TransactionsPage from "./features/transactions/TransactionsPage";
import AddTransactionForm from "./features/transactions/AddTransactionForm";
import { useTransactions } from "./features/transactions/hooks/useTransactions";
import SettingsPage from "./features/settings/SettingsPage";

function App() {
  const [activeTab, setActiveTab] = useState<"Dashboard" | "Transactions" | "Analytics" |  "Settings">("Dashboard");
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddTransaction = () => setShowAddModal(true);
  const handleCloseModal = () => setShowAddModal(false);
  const tx = useTransactions();

  const handleSaveComplete = () => {
    tx.refresh();
    setShowAddModal(false);
  };

  return (
    <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="min-w-0 w-full animate-in fade-in duration-500">
        {activeTab === "Dashboard" && (
          <DashboardView transactions={tx.transactions} />
        )}

        {activeTab === "Transactions" && (
          <TransactionsPage
            transactions={tx.transactions}
            remove={tx.remove}
            loading={tx.loading}
            onAddClick={handleAddTransaction}
          />
        )}

        {activeTab === "Analytics" && (
          <div className="bg-white rounded-2xl border border-border p-6 md:p-12 text-center shadow-sm">
            <h3 className="text-xl md:text-2xl font-semibold mb-2 md:mb-4">Analytics</h3>
            <p className="text-text-secondary text-sm md:text-base">
              Advanced charts and reports coming soon...
            </p>
          </div>
        )}

        {activeTab === "Settings" && <SettingsPage />}
      </div>

      {/* Modal */}
      {showAddModal && (
        
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-6"
          onClick={handleCloseModal}
        >
        
          <div
            className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-y-auto flex-1 custom-scrollbar">
              <AddTransactionForm
                onSave={handleSaveComplete}
                onClose={handleCloseModal}
              />
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default App;