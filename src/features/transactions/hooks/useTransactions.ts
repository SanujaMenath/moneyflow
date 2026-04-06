import { useState, useEffect, useCallback } from "react";
import type { Transaction } from "../../../types/transaction";
import {
  getTransactions,
  deleteTransaction,
  updateTransaction, // Ensure this is exported from your service
} from "../services/transactionService";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (id: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this transaction?");
    if (!confirmed) return;

    try {
      await deleteTransaction(id);
      await refresh();
    } catch (error) {
      console.error("Failed to delete transaction:", error);
      alert("Failed to delete transaction. Please try again.");
    }
  }, [refresh]);


  const stopRecurring = useCallback(async (id: number) => {
    const confirmed = window.confirm(
      "This will stop future occurrences of this transaction. Past records will remain. Continue?"
    );
    if (!confirmed) return;

    try {
  
      await updateTransaction(id, { recurringFrequency: "none" });
      await refresh();
    } catch (error) {
      console.error("Failed to stop recurrence:", error);
      alert("Failed to stop recurrence. Please try again.");
    }
  }, [refresh]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    transactions,
    loading,
    refresh,
    remove,
    stopRecurring, 
  };
};