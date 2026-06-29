import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SavingsGoalContextType {
  savingsGoalPercent: number;
  setSavingsGoalPercent: (percent: number) => void;
}

const SavingsGoalContext = createContext<SavingsGoalContextType | null>(null);

export const useSavingsGoal = () => {
  const ctx = useContext(SavingsGoalContext);
  if (!ctx) throw new Error("useSavingsGoal must be used within SavingsGoalProvider");
  return ctx;
};

export const SavingsGoalProvider = ({ children }: { children: ReactNode }) => {
  const [savingsGoalPercent, setSavingsGoalPercentState] = useState(20);

  useEffect(() => {
    AsyncStorage.getItem("mf_savings_goal").then((saved) => {
      if (saved) {
        const val = parseInt(saved, 10);
        if (!isNaN(val) && val >= 0 && val <= 50) setSavingsGoalPercentState(val);
      }
    });
  }, []);

  const setSavingsGoalPercent = (percent: number) => {
    const clamped = Math.max(0, Math.min(50, percent));
    setSavingsGoalPercentState(clamped);
    AsyncStorage.setItem("mf_savings_goal", String(clamped));
  };

  return (
    <SavingsGoalContext.Provider value={{ savingsGoalPercent, setSavingsGoalPercent }}>
      {children}
    </SavingsGoalContext.Provider>
  );
};
