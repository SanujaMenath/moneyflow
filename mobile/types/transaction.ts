export type RecurringFrequency = "none" | "daily" | "weekly" | "monthly" | "yearly";

export interface Transaction {
  id?: number;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  createdAt: string;
  recurringFrequency?: RecurringFrequency;
  recurringEndDate?: string | null;
}

export interface TransactionDB {
  id: number;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  created_at: string;
  recurring_frequency?: RecurringFrequency;
  recurring_end_date?: string | null;
  user_id?: string;
}

export const incomeCategories = [
  "Salary", "Freelance", "Investment", "Business", "Gift", "Other Income",
] as const;

export const expenseCategories = [
  "Food & Dining", "Transport", "Housing & Rent", "Bills & Utilities",
  "Shopping", "Healthcare", "Entertainment", "Education", "Travel",
  "Installments/Loans", "Other Expense",
] as const;

export const frequencies: { value: RecurringFrequency; label: string }[] = [
  { value: "none", label: "One-time" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

export const toDB = (t: Transaction): any => ({
  amount: t.amount,
  type: t.type,
  category: t.category,
  date: t.date,
  created_at: t.createdAt,
  recurring_frequency: t.recurringFrequency || "none",
  recurring_end_date: t.recurringEndDate || null,
});

export const fromDB = (r: any): Transaction => ({
  id: r.id,
  amount: r.amount,
  type: r.type as "income" | "expense",
  category: r.category,
  date: r.date,
  createdAt: r.created_at,
  recurringFrequency: (r.recurring_frequency as RecurringFrequency) || "none",
  recurringEndDate: r.recurring_end_date || null,
});
