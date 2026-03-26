import { useMemo } from "react";
import type { Transaction } from "../types/transaction";
import StatsCard from "./components/StatsCard";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

interface DashboardViewProps {
  transactions?: Transaction[];  
}

const DashboardView = ({ transactions = [] }: DashboardViewProps) => {
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
      { balance: 0, income: 0, expenses: 0 }
    );
  }, [transactions]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Balance"
          amount={stats.balance}
          type="balance"
          icon={Wallet}
        />
        <StatsCard
          title="Total Income"
          amount={stats.income}
          type="income"
          icon={TrendingUp}
        />
        <StatsCard
          title="Total Expenses"
          amount={stats.expenses}
          type="expense"
          icon={TrendingDown}
        />
      </div>

      {/* Analytics / Chart Area */}
      <div className="bg-white p-8 rounded-2xl border border-border shadow-sm min-h-95 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h4 className="text-text-primary font-semibold text-xl mb-2">
            Monthly Analytics
          </h4>
          <p className="text-text-secondary max-w-md">
            Interactive chart showing income vs expenses over time will appear here.
            <br />
            <span className="text-xs">(Coming in next iteration)</span>
          </p>
        </div>
      </div>

      {/* Quick Summary / Recent Activity Placeholder */}
      <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-text-primary">Quick Overview</h4>
          <span className="text-xs text-text-secondary">Last 30 days</span>
        </div>
        <p className="text-text-secondary text-sm">
          More insights and recent transactions will be shown here in future updates.
        </p>
      </div>
    </div>
  );
};

export default DashboardView;