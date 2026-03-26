import React from "react";
import { LayoutDashboard, ArrowLeftRight, BarChart3, Wallet } from "lucide-react";

type TabName = "Dashboard" | "Transactions" | "Analytics";

interface MainLayoutProps {
  children: React.ReactNode;
  activeTab: TabName;
  setActiveTab: (tab: TabName) => void;
}

const menuItems: { name: TabName; icon: React.ElementType }[] = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Transactions", icon: ArrowLeftRight },
  { name: "Analytics", icon: BarChart3 },
];

const MainLayout = ({ children, activeTab, setActiveTab }: MainLayoutProps) => {
  return (
    <div className="h-screen flex bg-bg text-text-primary">
      {/* Sidebar */}
      <aside className="w-64 bg-navy text-white flex flex-col p-4 shadow-xl">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-primary p-2 rounded-lg">
            <Wallet size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">MoneyFlow</h1>
        </div>

        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;

            return (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-blue-900/20"
                    : "hover:bg-white/5 text-gray-400 hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto p-4 border-t border-white/10 text-xs text-gray-500">
          MoneyFlow v1.0.0 Alpha
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-border bg-white flex items-center justify-between px-8">
          <h2 className="font-semibold text-lg text-text-primary">{activeTab}</h2>
          <div className="flex items-center gap-4 text-sm text-text-secondary">
            <span>March 2026</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;