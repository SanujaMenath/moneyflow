import { useMemo } from "react";
import type { Transaction } from "../../types/transaction";
import CategoryBarChart from "./components/CategoryBarChart";
import SeasonalTrendChart from "../dashboard/components/SeasonalTrendChart"; // Reusing the trend chart
import { PieChart, ListFilter, TrendingUp } from "lucide-react";

const AnalyticsPage = ({ transactions }: { transactions: Transaction[] }) => {
  const expensesOnly = useMemo(() => transactions.filter(t => t.type === "expense"), [transactions]);

  // Transform Data for Bar Chart (Category Totals)
  const categoryData = useMemo(() => {
    const totals: Record<string, number> = {};
    expensesOnly.forEach(t => {
      totals[t.category] = (totals[t.category] || 0) + t.amount;
    });
    return Object.entries(totals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [expensesOnly]);

  return (
    <div className="space-y-8 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Comparison Card */}
        <div className="bg-white p-6 rounded-3xl border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <ListFilter size={20} />
            </div>
            <div>
              <h3 className="font-bold text-text-primary">Expenses by Category</h3>
              <p className="text-xs text-text-secondary">Where is your money going?</p>
            </div>
          </div>
          <CategoryBarChart data={categoryData} />
        </div>

        {/* Top Insights Card */}
        <div className="bg-white p-6 rounded-3xl border border-border shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <TrendingUp size={20} />
            </div>
            <h3 className="font-bold text-text-primary">Key Spending Insights</h3>
          </div>
          
          <div className="flex-1 flex flex-col justify-center space-y-4">
            {categoryData.length > 0 ? (
              <>
                <div className="p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-xs text-text-secondary uppercase font-bold tracking-wider">Biggest Expense</p>
                  <p className="text-2xl font-black text-text-primary mt-1">{categoryData[0].category}</p>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Your spending in <span className="font-bold text-text-primary">{categoryData[0].category}</span> represents the largest portion of your monthly outgoings. 
                  Try to set a budget limit for this category in the next period.
                </p>
              </>
            ) : (
              <p className="text-center text-text-secondary italic">Add some expenses to see insights!</p>
            )}
          </div>
        </div>
      </div>

      {/* Seasonal Trends (Full Width) */}
      <div className="bg-white p-6 rounded-3xl border border-border shadow-sm">
        <div className="flex items-center gap-3 mb-2">
           <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <PieChart size={20} />
            </div>
            <h3 className="font-bold text-text-primary text-lg">Seasonal Spending Trends</h3>
        </div>
        <SeasonalTrendChart transactions={transactions} />
      </div>
    </div>
  );
};

export default AnalyticsPage;