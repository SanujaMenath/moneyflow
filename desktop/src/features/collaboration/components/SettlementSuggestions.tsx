import { ArrowRight, DollarSign } from "lucide-react";
import type { SettlementSuggestion } from "../../../types/collaboration";
import { useCurrency } from "../../../context/CurrencyContext";

interface SettlementSuggestionsProps {
  settlements: SettlementSuggestion[];
}

export const SettlementSuggestionsComponent = ({ settlements }: SettlementSuggestionsProps) => {
  const { format } = useCurrency();

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
      <div className="px-6 py-4 border-b border-slate-100">
        <h4 className="font-semibold text-slate-800 text-sm">Suggested Settlements</h4>
      </div>

      {settlements.length === 0 ? (
        <div className="py-8 text-center">
          <DollarSign size={24} className="mx-auto text-slate-200 mb-2" />
          <p className="text-slate-400 text-xs">All settled up!</p>
          <p className="text-slate-300 text-[10px] mt-0.5">No payments needed.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-50">
          {settlements.map((s, i) => (
            <div key={i} className="px-6 py-3.5 flex items-center gap-3 hover:bg-slate-50/40 transition-colors">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-sm font-medium text-slate-700 truncate">{s.from_user_name}</span>
                <ArrowRight size={14} className="text-slate-300 shrink-0" />
                <span className="text-sm font-medium text-slate-700 truncate">{s.to_user_name}</span>
              </div>
              <span className="text-sm font-bold text-emerald-600 shrink-0">
                {format(s.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
