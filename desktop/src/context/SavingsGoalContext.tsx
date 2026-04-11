import React, { createContext, useContext, useState } from "react";

interface SavingsGoalContextType {
  savingsGoalPercent: number;
  setSavingsGoalPercent: (percent: number) => void;
}

const SavingsGoalContext = createContext<SavingsGoalContextType | null>(null);

export const SavingsGoalProvider = ({ children }: { children: React.ReactNode }) => {
  const [savingsGoalPercent, setSavingsGoalPercentState] = useState<number>(() => {
    const saved = localStorage.getItem("mf_savings_goal");
    return saved ? parseInt(saved, 10) : 20;
  });

  const setSavingsGoalPercent = (percent: number) => {
    setSavingsGoalPercentState(percent);
    localStorage.setItem("mf_savings_goal", percent.toString());
  };

  return (
    <SavingsGoalContext.Provider value={{ savingsGoalPercent, setSavingsGoalPercent }}>
      {children}
    </SavingsGoalContext.Provider>
  );
};

export const useSavingsGoal = () => {
  const ctx = useContext(SavingsGoalContext);
  if (!ctx) throw new Error("useSavingsGoal must be used within SavingsGoalProvider");
  return ctx;
};