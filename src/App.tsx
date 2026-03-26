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
      {/* WRAPPER: min-w-0 prevents flex items from breaking the layout 
          when content (like a table) is wider than the screen.
      */}
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
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6">
         
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="overflow-y-auto flex-1 custom-scrollbar">
              <AddTransactionForm
                onSave={handleSaveComplete}
                onClose={() => setShowAddModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default App;