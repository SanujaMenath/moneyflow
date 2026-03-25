import Database from "@tauri-apps/plugin-sql";

let db: Database | null = null;

export const getDB = async () => {
  if (db) return db;

  db = await Database.load("sqlite:moneyflow.db");


  await db.execute(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount INTEGER NOT NULL,
      type TEXT NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  return db;
};