export interface Transaction {
  id?: number;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  createdAt: string;
}