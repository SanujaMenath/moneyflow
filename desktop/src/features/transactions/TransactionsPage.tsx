import { useState, useMemo } from "react";
import { Trash2, Plus, Calendar, FilterX, Clock, XCircle, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import type { Transaction } from "../../types/transaction";
import { useCurrency } from "../../context/CurrencyContext";
import { getDatePresets } from "../../utils/date";

interface TransactionsPageProps {
  transactions: Transaction[];
  remove: (id: number) => Promise<void>;
  stopRecurring: (id: number) => Promise<void>;
  onAddClick: () => void;
  loading: boolean;
}

const TransactionsPage = ({
  onAddClick,
  transactions,
  remove,
  stopRecurring,
  loading,
}: TransactionsPageProps) => {
  const { format } = useCurrency();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const presets = getDatePresets();

  const handlePreset = (type: "this" | "last" | "all") => {
    if (type === "all") {
      setStartDate("");
      setEndDate("");
    } else if (type === "this") {
      setStartDate(presets.thisMonth.start);
      setEndDate(presets.thisMonth.end);
    } else if (type === "last") {
      setStartDate(presets.lastMonth.start);
      setEndDate(presets.lastMonth.end);
    }
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (startDate && t.date < startDate) return false;
      if (endDate && t.date > endDate) return false;
      return true;
    });
  }, [transactions, startDate, endDate]);

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
  };

  const isFiltered = startDate !== "" || endDate !== "";

  // Summary stats
  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-semibold text-slate-800 text-base tracking-tight">
            Transactions
          </h3>
          <p className="text-slate-400 text-xs mt-0.5">
            {filteredTransactions.length} of {transactions.length} records
          </p>
        </div>

        <button
          onClick={onAddClick}
          className="shrink-0 bg-navy text-white px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2"
        >
          <Plus size={15} />
          Add Transaction
        </button>
      </div>

      {/* ── Summary Strip ───────────────────────────────────────────── */}
      {filteredTransactions.length > 0 && (
        <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
          <div className="px-6 py-3.5 flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Income</span>
            <span className="text-sm font-semibold text-emerald-600">+ {format(totalIncome)}</span>
          </div>
          <div className="px-6 py-3.5 flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Expenses</span>
            <span className="text-sm font-semibold text-rose-500">− {format(totalExpense)}</span>
          </div>
          <div className="px-6 py-3.5 flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Saving</span>
            <span className={`text-sm font-semibold ${totalIncome - totalExpense >= 0 ? "text-slate-800" : "text-rose-500"}`}>
              {totalIncome - totalExpense >= 0 ? "+" : "−"} {format(Math.abs(totalIncome - totalExpense))}
            </span>
          </div>
        </div>
      )}

      {/* ── Filter Section ──────────────────────────────────────────── */}
      <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-end gap-4">

        {/* Preset pills */}
        <div className="flex items-center gap-1.5">
          <Clock size={13} className="text-slate-300 shrink-0" />
          {[
            { label: "All Time", type: "all" as const, active: !startDate && !endDate },
            { label: "This Month", type: "this" as const, active: startDate === presets.thisMonth.start },
            { label: "Last Month", type: "last" as const, active: startDate === presets.lastMonth.start },
          ].map(({ label, type, active }) => (
            <button
              key={type}
              onClick={() => handlePreset(type)}
              className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all border ${
                active
                  ? "bg-navy text-white border-slate-900"
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:text-slate-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Date inputs */}
        <div className="flex items-end gap-2 ml-auto">
          {(["From", "To"] as const).map((label) => {
            const val = label === "From" ? startDate : endDate;
            const setter = label === "From" ? setStartDate : setEndDate;
            return (
              <div key={label} className="flex flex-col gap-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-0.5">{label}</span>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={13} />
                  <input
                    type="date"
                    value={val}
                    onChange={(e) => setter(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 outline-none transition-all w-36"
                  />
                </div>
              </div>
            );
          })}

          {isFiltered && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 text-rose-400 hover:bg-rose-50 rounded-lg text-xs font-medium transition-colors border border-transparent hover:border-rose-100 mb-0"
            >
              <FilterX size={13} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────────────── */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm animate-pulse">
            Loading transactions…
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-slate-400 text-sm">
              {isFiltered
                ? "No transactions found for this date range."
                : "No transactions yet. Start tracking your cash flow!"}
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-160">
            <thead>
              <tr className="border-b border-slate-100">
                {["Date", "Category", "Type", "Amount", "Recurring", "Actions"].map((h, i) => (
                  <th
                    key={h}
                    className={`px-5 py-3 text-[10px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-50/60 ${
                      i === 3 ? "text-right" : i >= 4 ? "text-center" : ""
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.map((t: Transaction, idx) => (
                <tr
                  key={t.id}
                  className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors group"
                  style={{ animationDelay: `${idx * 20}ms` }}
                >
                  {/* Date */}
                  <td className="px-5 py-3.5 text-xs text-slate-400 whitespace-nowrap tabular-nums">
                    {t.date}
                  </td>

                  {/* Category */}
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-medium text-slate-700">{t.category}</span>
                  </td>

                  {/* Type badge */}
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-semibold rounded-md tracking-wide ${
                        t.type === "income"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-rose-50 text-rose-500"
                      }`}
                    >
                      {t.type === "income"
                        ? <ArrowDownLeft size={10} />
                        : <ArrowUpRight size={10} />}
                      {t.type.toUpperCase()}
                    </span>
                  </td>

                  {/* Amount */}
                  <td
                    className={`px-5 py-3.5 text-sm font-semibold text-right whitespace-nowrap tabular-nums ${
                      t.type === "income" ? "text-emerald-600" : "text-rose-500"
                    }`}
                  >
                    {t.type === "income" ? "+" : "−"} {format(t.amount)}
                  </td>

                  {/* Recurring */}
                  <td className="px-5 py-3.5 text-center">
                    {t.recurringFrequency && t.recurringFrequency !== "none" ? (
                      <span className="inline-block bg-slate-100 text-slate-500 text-[10px] font-semibold px-2.5 py-0.5 rounded-full capitalize tracking-wide">
                        {t.recurringFrequency}
                      </span>
                    ) : (
                      <span className="text-slate-200 text-sm select-none">—</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5 text-center">
                    <div className="flex items-center justify-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                      {t.recurringFrequency && t.recurringFrequency !== "none" && (
                        <button
                          onClick={() => stopRecurring(t.id!)}
                          title="Stop Recurrence"
                          className="p-1.5 text-slate-300 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all"
                        >
                          <XCircle size={15} />
                        </button>
                      )}
                      <button
                        onClick={() => remove(t.id!)}
                        title="Delete Transaction"
                        className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {filteredTransactions.length > 0 && (
        <div className="px-6 py-3 border-t border-slate-100 flex justify-end">
          <span className="text-[11px] text-slate-300 tabular-nums">
            {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;