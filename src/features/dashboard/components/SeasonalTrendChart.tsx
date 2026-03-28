import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useCurrency } from "../../../context/CurrencyContext";
import type { Transaction } from "../../../types/transaction";

interface SeasonalTrendChartProps {
  transactions: Transaction[];
}

const SeasonalTrendChart = ({ transactions }: SeasonalTrendChartProps) => {
  const format = useCurrency();

  const chartData = useMemo(() => {
    const monthlyData: Record<string, any> = {};
    const categories = new Set<string>();

    const expenses = transactions.filter((t) => t.type === "expense");

    expenses.forEach((t) => {
      const date = new Date(t.date);
      const monthYear = date.toLocaleString("default", { month: "short" });
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { name: monthYear };
      }
      
      // Group by category
      monthlyData[monthYear][t.category] = (monthlyData[monthYear][t.category] || 0) + (t.amount / 100);
      categories.add(t.category);
    });


    return {
      data: Object.values(monthlyData),
      keys: Array.from(categories),
    };
  }, [transactions]);

  // Modern Color Palette
  const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

  return (
    <div className="w-full h-100 mt-8 bg-white p-4 sm:p-6 rounded-3xl border border-border">
      <div className="mb-6">
        <h4 className="text-text-primary font-bold text-lg">Expense Trends</h4>
        <p className="text-text-secondary text-xs">Category spending over time</p>
      </div>

      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={chartData.data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9ca3af', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            tickFormatter={(value) => `Rs.${value}`}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            formatter={(value: any) => `Rs.${value.toLocaleString()}`}
          />
          <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
          
          {chartData.keys.map((category, index) => (
            <Line
              key={category}
              type="monotone" // Creates the curved "modern" look
              dataKey={category}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SeasonalTrendChart;