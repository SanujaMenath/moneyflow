import { supabase } from "../../../lib/supabase";
import type { Transaction, RecurringFrequency } from "../../../types/transaction";

export const getTransactions = async (): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase Error (fetch):", error.message);
    throw error;
  }

  return (data || []).map((r) => ({
    id: r.id,
    amount: r.amount,
    type: r.type as "income" | "expense",
    category: r.category,
    date: r.date,
    createdAt: r.created_at,
    recurringFrequency: (r.recurring_frequency as RecurringFrequency) || "none",
    recurringEndDate: r.recurring_end_date || null,
  }));
};

 
export const createTransaction = async (data: Transaction) => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Authentication required to save transactions.");

  const { error } = await supabase.from("transactions").insert([
    {
      user_id: user.id,
      amount: data.amount,
      type: data.type,
      category: data.category,
      date: data.date,
      created_at: data.createdAt || new Date().toISOString(),
      recurring_frequency: data.recurringFrequency || "none",
      recurring_end_date: data.recurringEndDate || null,
    },
  ]);

  if (error) {
    console.error("Supabase Error (insert):", error.message);
    throw error;
  }
};


export const deleteTransaction = async (id: number) => {
  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Supabase Error (delete):", error.message);
    throw error;
  }
};


export const updateTransaction = async (id: number, updates: Partial<Transaction>) => {
  const dbUpdates: any = {};
  if (updates.amount !== undefined) dbUpdates.amount = updates.amount;
  if (updates.type !== undefined) dbUpdates.type = updates.type;
  if (updates.category !== undefined) dbUpdates.category = updates.category;
  if (updates.date !== undefined) dbUpdates.date = updates.date;
  if (updates.recurringFrequency !== undefined) dbUpdates.recurring_frequency = updates.recurringFrequency;
  if (updates.recurringEndDate !== undefined) dbUpdates.recurring_end_date = updates.recurringEndDate;

  const { error } = await supabase
    .from("transactions")
    .update(dbUpdates)
    .eq("id", id);

  if (error) {
    console.error("Supabase Error (update):", error.message);
    throw error;
  }
};