import type { BalanceSummary } from "../../../types/collaboration";
import { useCurrency } from "../../../context/CurrencyContext";

interface BalanceSummaryProps {
  balances: BalanceSummary[];
}

export const BalanceSummaryComponent = ({ balances }: BalanceSummaryProps) => {
  const { format } = useCurrency();
  const totalExpenses = balances.reduce((sum, b) => sum + b.paid, 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
      <div className="px-6 py-4 border-b border-slate-100">
        <h4 className="font-semibold text-slate-800 text-sm">Balance Summary</h4>
        <p className="text-slate-400 text-xs mt-0.5">Total shared: {format(totalExpenses)}</p>
      </div>

      {balances.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-slate-400 text-xs">No balance data available.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-50">
          {balances.map((b) => (
            <div key={b.member_id} className="px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-navy/5 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-navy/40">
                    {b.member_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">{b.member_name}</p>
                  <p className="text-[10px] text-slate-400">
                    Paid {format(b.paid)} · Owes {format(b.owes)}
                  </p>
                </div>
              </div>
              <span className={`text-sm font-semibold ${
                b.net >= 0 ? "text-emerald-600" : "text-rose-500"
              }`}>
                {b.net >= 0 ? "+" : ""}{format(b.net)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
