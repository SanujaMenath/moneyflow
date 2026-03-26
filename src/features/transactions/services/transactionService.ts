import { getDB } from "../../../lib/db";
import type { Transaction, RecurringFrequency } from "../../types/transaction";

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