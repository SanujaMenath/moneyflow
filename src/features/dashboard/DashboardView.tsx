import { useMemo } from "react";
import type { Transaction } from "../types/transaction";
import StatsCard from "./components/StatsCard";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import AnalyticsDonut from "./components/AnalyticsDonut";

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

     {/* Analytics Area */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-border shadow-sm overflow-hidden">
        <div className="mb-8">
          <h4 className="text-text-primary font-bold text-xl">Monthly Overview</h4>
          <p className="text-text-secondary text-sm">Visualizing your income vs expense ratio.</p>
        </div>

        {/* Replace your old placeholder with this: */}
        <AnalyticsDonut 
          income={stats.income} 
          expenses={stats.expenses} 
        />
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