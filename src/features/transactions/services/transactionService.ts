import { getDB } from "../../../lib/db";
import type { Transaction, RecurringFrequency } from "../../../types/transaction";

export const createTransaction = async (data: Transaction) => {
  const db = await getDB();

  await db.execute(
    `INSERT INTO transactions 
     (amount, type, category, date, created_at, recurring_frequency, recurring_end_date)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.amount,
      data.type,
      data.category,
      data.date,
      data.createdAt,
      data.recurringFrequency || "none",           
      data.recurringEndDate || null,               
    ]
  );
};

export const getTransactions = async (): Promise<Transaction[]> => {
  const db = await getDB();

  const results = await db.select<any[]>(
    `SELECT * FROM transactions 
     ORDER BY date DESC, created_at DESC`
  );

  return results.map((r) => ({
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

export const deleteTransaction = async (id: number) => {
  const db = await getDB();
  await db.execute("DELETE FROM transactions WHERE id = ?", [id]);
};

export const updateTransaction = async (id: number, updates: Partial<Transaction>) => {
  const db = await getDB();
  
  const sets: string[] = [];
  const params: any[] = [];

  if (updates.amount !== undefined) { sets.push("amount = ?"); params.push(updates.amount); }
  if (updates.type !== undefined) { sets.push("type = ?"); params.push(updates.type); }
  if (updates.category !== undefined) { sets.push("category = ?"); params.push(updates.category); }
  if (updates.date !== undefined) { sets.push("date = ?"); params.push(updates.date); }
  if (updates.recurringFrequency !== undefined) { sets.push("recurring_frequency = ?"); params.push(updates.recurringFrequency); }
  if (updates.recurringEndDate !== undefined) { sets.push("recurring_end_date = ?"); params.push(updates.recurringEndDate); }

  if (sets.length === 0) return;

  params.push(id);
  
  await db.execute(
    `UPDATE transactions SET ${sets.join(", ")} WHERE id = ?`,
    params
  );
};