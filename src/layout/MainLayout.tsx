import React from "react";
import {
  LayoutDashboard, ArrowLeftRight, BarChart3,
  Wallet, Settings,
} from "lucide-react";

type TabName = "Dashboard" | "Transactions" | "Analytics" | "Settings";

interface MainLayoutProps {
  children: React.ReactNode;
  activeTab: TabName;
  setActiveTab: (tab: TabName) => void;
}

const topMenuItems: { name: TabName; icon: React.ElementType }[] = [
  { name: "Dashboard",    icon: LayoutDashboard },
  { name: "Transactions", icon: ArrowLeftRight  },
  { name: "Analytics",    icon: BarChart3       },
];

const MainLayout = ({ children, activeTab, setActiveTab }: MainLayoutProps) => {
  const NavBtn = ({ name, icon: Icon }: { name: TabName; icon: React.ElementType }) => {
    const isActive = activeTab === name;
    return (
      <button
        key={name}
        onClick={() => setActiveTab(name)}
        title={name}
        className={`flex items-center justify-center lg:justify-start gap-3 px-2 lg:px-4 py-3 rounded-xl transition-all duration-200 ${
          isActive
            ? "bg-primary text-white shadow-lg shadow-blue-900/20"
            : "hover:bg-white/5 text-gray-400 hover:text-white"
        }`}
      >
        <Icon size={20} className="shrink-0" />
        <span className="font-medium hidden lg:block">{name}</span>
      </button>
    );
  };

  return (
    <div className="h-screen flex bg-bg text-text-primary overflow-hidden">
      <aside className="w-16 sm:w-20 lg:w-64 bg-navy text-white flex flex-col transition-all duration-300 shadow-xl overflow-hidden shrink-0">
        {/* Logo */}
        <div className="flex items-center justify-center lg:justify-start gap-3 mt-6 mb-10 px-3 lg:px-4">
          <div className="bg-primary p-2 rounded-lg shrink-0">
            <Wallet size={22} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight hidden lg:block">MoneyFlow</h1>
        </div>

        {/* Top nav */}
        <nav className="flex flex-col gap-1.5 px-2">
          {topMenuItems.map((item) => (
            <NavBtn key={item.name} name={item.name} icon={item.icon} />
          ))}
        </nav>

        {/* Settings tab */}
        <div className="mt-auto flex flex-col gap-1.5 px-2 pb-3">
          <NavBtn name="Settings" icon={Settings} />
          <div className="border-t border-white/10 pt-3 text-[10px] lg:text-xs text-center text-gray-500 font-semibold">
            <span className="hidden lg:inline">MoneyFlow v1.0.0</span>
            <span className="lg:hidden text-[9px]">v1.0</span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-border bg-white flex items-center justify-between px-4 lg:px-8 shrink-0">
          <h2 className="font-semibold text-base lg:text-lg text-text-primary truncate">
            {activeTab}
          </h2>
          <div className="flex items-center gap-4 text-xs lg:text-sm text-text-secondary shrink-0 ml-4">
            <span>March 2026</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-8 bg-gray-50/50">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>

        <footer className="py-2 px-4 border-t border-border bg-navy flex items-center justify-center gap-1 text-[10px] font-bold text-gray-500 text-center shrink-0 flex-wrap">
          <span>&copy; 2026 MoneyFlow. All rights reserved.</span>
          <span className="hidden sm:inline">·</span>
          <span>Designed &amp; Built by Sanuja Menath.</span>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;