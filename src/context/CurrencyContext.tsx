import React, { createContext, useContext, useState } from "react";

export interface Currency {
  code: string;
  symbol: string;
  locale: string;
}

export const CURRENCIES: Currency[] = [
  { code: "LKR", symbol: "Rs.", locale: "si-LK" },
  { code: "USD", symbol: "$",   locale: "en-US" },
  { code: "EUR", symbol: "€",   locale: "de-DE" },
  { code: "GBP", symbol: "£",   locale: "en-GB" },
  { code: "INR", symbol: "₹",   locale: "en-IN" },
  { code: "AUD", symbol: "A$",  locale: "en-AU" },
  { code: "JPY", symbol: "¥",   locale: "ja-JP" },
  { code: "CAD", symbol: "C$",  locale: "en-CA" },
];

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  format: (cents: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem("mf_currency");
    return saved ? JSON.parse(saved) : CURRENCIES[0]; // default LKR
  });

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("mf_currency", JSON.stringify(c));
  };

  // Centralised formatter — divide cents, format with locale
  const format = (cents: number) => {
    const value = cents / 100;
    return `${currency.symbol}${value.toLocaleString(currency.locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
};