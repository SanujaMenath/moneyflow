CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
  category TEXT NOT NULL,
  date TEXT NOT NULL,                  
  created_at TEXT NOT NULL,              
  recurring_frequency TEXT DEFAULT 'none' CHECK(recurring_frequency IN ('none', 'weekly', 'monthly', 'yearly')),
  recurring_end_date TEXT                
);