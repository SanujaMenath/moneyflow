import { useMemo } from "react";
import type { Transaction } from "../../types/transaction";
import StatsCard from "./components/StatsCard";
import { TrendingUp, TrendingDown, Wallet, Lightbulb } from "lucide-react";
import AnalyticsDonut from "./components/AnalyticsDonut";
import SeasonalTrendChart from "./components/SeasonalTrendChart"; // New Import

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
    <div className="space-y-6 pb-10">
      {/* 1. Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* 2. Ratio & Insights Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Donut Chart (Takes up 3/5 of space on large screens) */}
        <div className="xl:col-span-3 bg-white p-6 sm:p-10 rounded-3xl border border-border shadow-sm">
          <div className="mb-8">
            <h4 className="text-text-primary font-bold text-xl">Monthly Ratio</h4>
            <p className="text-text-secondary text-sm">Income vs Expense balance</p>
          </div>
          <AnalyticsDonut income={stats.income} expenses={stats.expenses} />
        </div>

        {/* Dynamic Insight Card (Takes up 2/5 of space) */}
        <div className="xl:col-span-2 bg-primary text-white p-8 rounded-3xl shadow-lg shadow-blue-900/10 flex flex-col justify-between">
          <div>
            <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
              <Lightbulb className="text-white" size={24} />
            </div>
            <h4 className="text-xl font-bold mb-3">AI Insight</h4>
            <p className="text-blue-50 text-sm leading-relaxed">
              {stats.expenses > stats.income 
                ? "Your spending this period has exceeded your income. Try identifying non-essential recurring expenses to balance your flow." 
                : "Great job! You are living below your means. This is a perfect time to set aside your surplus for long-term investments."}
            </p>
          </div>
          <div className="mt-6 pt-6 border-t border-white/10">
             <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Financial Health Score</span>
             <div className="text-2xl font-black mt-1">
               {stats.income > 0 ? Math.round(((stats.income - stats.expenses) / stats.income) * 100) : 0}%
             </div>
          </div>
        </div>
      </div>

      {/* 3. Seasonal Trends (Full Width) */}
      <div className="bg-white p-1 rounded-3xl border border-border shadow-sm">
        <SeasonalTrendChart transactions={transactions} />
      </div>
    </div>
  );
};

export default DashboardView;