import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  amount: number;
  type?: "balance" | "income" | "expense";
  icon?: LucideIcon;
}

const StatsCard = ({ title, amount, type = "balance", icon: Icon }: StatsCardProps) => {
  const formattedAmount = (amount / 100).toLocaleString(undefined, {
    minimumFractionDigits: 2,
  });

  const getTextColor = () => {
    if (type === "income") return "text-text-income";
    if (type === "expense") return "text-text-expense";
    return "text-text-primary"; 
  };

  const getSign = () => {
    if (type === "income") return "+";
    if (type === "expense") return "-";
    return "";
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-text-secondary text-sm font-medium">{title}</p>
          <h3 className={`text-3xl font-bold mt-3 Rs.{getTextColor()}`}>
            {getSign()}Rs.{formattedAmount}
          </h3>
        </div>

        {Icon && (
          <div className="p-3 bg-gray-100 rounded-xl">
            <Icon size={24} className="text-text-secondary" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;