export interface Transaction {
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  createdAt: string;
}