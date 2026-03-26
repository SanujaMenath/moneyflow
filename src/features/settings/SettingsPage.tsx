import { Check, Coins, User, Palette, Calendar } from "lucide-react";
import { CURRENCIES, useCurrency } from "../../context/CurrencyContext";

const SettingsPage = () => {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="flex flex-col gap-6">
      {/* Currency */}
      <section className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Coins size={18} className="text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-text-primary text-sm sm:text-base">Currency</h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Choose the currency used across the entire app
            </p>
          </div>
        </div>

        <div className="p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {CURRENCIES.map((c) => {
            const isSelected = c.code === currency.code;
            return (
              <button
                key={c.code}
                onClick={() => setCurrency(c)}
                className={`relative flex flex-col items-center gap-1.5 p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 ${
                  isSelected
                    ? "border-primary bg-blue-50 shadow-sm"
                    : "border-border hover:border-primary/40 hover:bg-gray-50"
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 bg-primary rounded-full p-0.5">
                    <Check size={10} className="text-white" />
                  </span>
                )}
                <span className="text-xl sm:text-2xl font-bold text-text-primary">
                  {c.symbol}
                </span>
                <span className="text-xs font-semibold text-text-secondary">{c.code}</span>
              </button>
            );
          })}
        </div>

        <div className="px-5 py-3 bg-gray-50/60 border-t border-border">
          <p className="text-xs text-text-secondary">
            Currently using{" "}
            <span className="font-semibold text-text-primary">
              {currency.code} ({currency.symbol})
            </span>
            . Changes apply immediately across all views.
          </p>
        </div>
      </section>

      {/* Placeholder — Display Name */}
      <section className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden opacity-60">
        <div className="px-5 py-4 flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <User size={18} className="text-text-secondary" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-text-primary text-sm sm:text-base">Display Name</h3>
            <p className="text-xs text-text-secondary mt-0.5">Coming soon</p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
            Soon
          </span>
        </div>
      </section>

      {/* Placeholder — Theme */}
      <section className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden opacity-60">
        <div className="px-5 py-4 flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Palette size={18} className="text-text-secondary" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-text-primary text-sm sm:text-base">Theme</h3>
            <p className="text-xs text-text-secondary mt-0.5">Light / Dark mode — Coming soon</p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
            Soon
          </span>
        </div>
      </section>

      {/* Placeholder — Date Format */}
      <section className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden opacity-60">
        <div className="px-5 py-4 flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Calendar size={18} className="text-text-secondary" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-text-primary text-sm sm:text-base">Date Format</h3>
            <p className="text-xs text-text-secondary mt-0.5">DD/MM/YYYY · MM/DD/YYYY — Coming soon</p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
            Soon
          </span>
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;