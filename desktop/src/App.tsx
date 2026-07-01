import { useState, useEffect } from "react";
import MainLayout from "./layout/MainLayout";
import { supabase } from "./lib/supabase"; 
import { Auth } from "./features/auth/components/Auth";

import DashboardView from "./features/dashboard/DashboardView";
import TransactionsPage from "./features/transactions/TransactionsPage";
import AddTransactionForm from "./features/transactions/AddTransactionForm";
import { useTransactions } from "./features/transactions/hooks/useTransactions";
import SettingsPage from "./features/settings/SettingsPage";
import AnalyticsPage from "./features/analytics/AnalyticsPage";
import CollaborationPage from "./features/collaboration/CollaborationPage";

function App() {
  const [session, setSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<
    "Dashboard" | "Transactions" | "Analytics" | "Settings" | "Collaboration"
  >("Dashboard");
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAddTransaction = () => setShowAddModal(true);
  const handleCloseModal = () => setShowAddModal(false);
  const tx = useTransactions();

  const handleSaveComplete = () => {
    tx.refresh();
    setShowAddModal(false);
  };

  if (!session) {
    return <Auth />;
  }

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
            stopRecurring={tx.stopRecurring} 
            loading={tx.loading}
            onAddClick={handleAddTransaction}
          />
        )}

        {activeTab === "Analytics" && (
          <AnalyticsPage transactions={tx.transactions} />
        )}

        {activeTab === "Collaboration" && <CollaborationPage />}

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