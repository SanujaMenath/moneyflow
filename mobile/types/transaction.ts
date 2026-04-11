export type RecurringFrequency = "none" | "weekly" | "monthly" | "yearly";

export interface Transaction {
  id: number;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  created_at: string;
  recurring_frequency?: RecurringFrequency;
  recurring_end_date?: string | null;
}