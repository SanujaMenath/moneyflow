import { getDB } from "../../lib/db";
import type { Transaction } from "../../types/transaction";

export const createTransaction = async (data: Transaction) => {
  const db = await getDB();

  await db.execute(
    `INSERT INTO transactions (amount, type, category, date, created_at)
     VALUES (?, ?, ?, ?, ?)`,
    [data.amount, data.type, data.category, data.date, data.createdAt]
  );
};

export const getTransactions = async (): Promise<Transaction[]> => {
  const db = await getDB();

  const results = await db.select<any[]>(
    "SELECT * FROM transactions ORDER BY date DESC, created_at DESC"
  );

  // ✅ map DB → frontend
  return results.map((r) => ({
    id: r.id,
    amount: r.amount,
    type: r.type,
    category: r.category,
    date: r.date,
    createdAt: r.created_at,
  }));
};

export const deleteTransaction = async (id: number) => {
  const db = await getDB();
  await db.execute("DELETE FROM transactions WHERE id = ?", [id]);
};