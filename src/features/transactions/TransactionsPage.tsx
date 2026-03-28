import { useState, useMemo } from "react";
import { Trash2, Plus, Calendar, FilterX, Clock } from "lucide-react";
import type { Transaction } from "../../types/transaction";
import { useCurrency } from "../../context/CurrencyContext";
import { getDatePresets } from "../../utils/date";


interface TransactionsPageProps {
  transactions: Transaction[];
  remove: (id: number) => Promise<void>;
  onAddClick: () => void;
  loading: boolean;
}

const TransactionsPage = ({
  onAddClick,
  transactions,
  remove,
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

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="min-w-0">
          <h3 className="font-bold text-text-primary text-base lg:text-lg truncate">
            All Transactions
          </h3>
          <p className="text-text-secondary text-xs mt-0.5">
            Showing {filteredTransactions.length} of {transactions.length} records
          </p>
        </div>

        <button
          onClick={onAddClick}
          className="w-full sm:w-auto shrink-0 bg-primary hover:bg-blue-700 text-white px-4 lg:px-5 py-2 lg:py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <Plus size={18} />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Filter Section */}
      <div className="p-4 bg-gray-50/50 border-b border-border space-y-4">
        {/* Quick Presets */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <Clock size={14} className="text-text-secondary shrink-0" />
          <span className="text-[10px] font-bold text-text-secondary uppercase whitespace-nowrap mr-2">Quick:</span>
          
          <button 
            onClick={() => handlePreset("all")}
            className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border ${
              !startDate && !endDate ? "bg-primary text-white border-primary" : "bg-white text-text-secondary border-border hover:border-primary"
            }`}
          >
            All Time
          </button>
          
          <button 
            onClick={() => handlePreset("this")}
            className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border ${
              startDate === presets.thisMonth.start ? "bg-primary text-white border-primary" : "bg-white text-text-secondary border-border hover:border-primary"
            }`}
          >
            This Month
          </button>
          
          <button 
            onClick={() => handlePreset("last")}
            className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border ${
              startDate === presets.lastMonth.start ? "bg-primary text-white border-primary" : "bg-white text-text-secondary border-border hover:border-primary"
            }`}
          >
            Last Month
          </button>
        </div>

        {/* Manual Date Inputs */}
        <div className="flex flex-col md:flex-row items-end gap-4">
          <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase px-1">From</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={14} />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-border rounded-xl text-xs focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase px-1">To</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={14} />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-border rounded-xl text-xs focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>
          </div>

          {isFiltered && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 text-text-expense hover:bg-rose-50 rounded-xl text-xs font-semibold transition-colors"
            >
              <FilterX size={14} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table Area */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-12 sm:p-20 text-center text-text-secondary animate-pulse text-sm">
            Loading transactions...
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-12 sm:p-20 text-center text-text-secondary text-sm">
            {isFiltered 
              ? "No transactions found for this date range." 
              : "No transactions yet. Start tracking your cash flow!"}
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-175">
            <thead>
              <tr className="text-text-secondary text-[10px] lg:text-xs uppercase tracking-wider border-b border-border bg-gray-50/50">
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold text-right">Amount</th>
                <th className="px-4 py-3 font-semibold text-center">Recurring</th>
                <th className="px-4 py-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {filteredTransactions.map((t: Transaction) => (
                <tr
                  key={t.id}
                  className="hover:bg-gray-50/40 transition-colors group"
                >
                  <td className="px-4 py-3.5 text-xs lg:text-sm text-text-secondary whitespace-nowrap">
                    {t.date}
                  </td>

                  <td className="px-4 py-3.5 text-xs lg:text-sm font-medium text-text-primary">
                    {t.category}
                  </td>

                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-block px-2.5 py-0.5 text-[10px] lg:text-xs font-bold rounded-md border ${
                        t.type === "income"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : "bg-rose-50 text-rose-700 border-rose-100"
                      }`}
                    >
                      {t.type.toUpperCase()}
                    </span>
                  </td>

                  <td
                    className={`px-4 py-3.5 text-xs lg:text-sm font-bold text-right whitespace-nowrap ${
                      t.type === "income" ? "text-text-income" : "text-text-expense"
                    }`}
                  >
                    {t.type === "income" ? "+" : "-"} {format(t.amount)}                   
                  </td>

                  <td className="px-4 py-3.5 text-center text-xs text-text-secondary">
                    <span className="bg-gray-100 px-2 py-1 rounded text-[10px] whitespace-nowrap">
                      {t.recurringFrequency && t.recurringFrequency !== "none"
                        ? t.recurringFrequency
                        : "—"}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-center">
                    <button
                      onClick={() => remove(t.id!)}
                      className="p-2 text-text-secondary hover:text-text-expense hover:bg-rose-50 rounded-lg transition-all"
                      title="Delete Transaction"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;