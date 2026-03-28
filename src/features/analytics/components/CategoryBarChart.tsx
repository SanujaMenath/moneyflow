import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useCurrency } from "../../../context/CurrencyContext";

interface CategoryData {
  category: string;
  amount: number;
}

const CategoryBarChart = ({ data }: { data: CategoryData[] }) => {
  const { format } = useCurrency();
  const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#ef4444"];

  return (
    <div className="h-100 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 40, right: 40 }}>
          <XAxis type="number" hide />
          <YAxis 
            dataKey="category" 
            type="category" 
            axisLine={false} 
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }}
            width={100}
          />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            formatter={(value: any) => format(value)}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="amount" radius={[0, 8, 8, 0]} barSize={24}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryBarChart;