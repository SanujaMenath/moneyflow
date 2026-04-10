import { useState, useEffect, useCallback } from "react";
import type { Transaction } from "../../../types/transaction";
import { supabase } from "../../../../../shared/supabase"; 
import {
  getTransactions,
  deleteTransaction,
  updateTransaction,
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

  useEffect(() => {
    refresh();

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        (payload) => {
          console.log("Change detected in Supabase:", payload);
          refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refresh]);


  const remove = useCallback(async (id: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this transaction?");
    if (!confirmed) return;

    try {
      await deleteTransaction(id);
    } catch (error) {
      console.error("Failed to delete transaction:", error);
      alert("Failed to delete transaction. Please try again.");
    }
  }, []);

  const stopRecurring = useCallback(async (id: number) => {
    const confirmed = window.confirm(
      "This will stop future occurrences of this transaction. Past records will remain. Continue?"
    );
    if (!confirmed) return;

    try {
      await updateTransaction(id, { recurringFrequency: "none" });
   
    } catch (error) {
      console.error("Failed to stop recurrence:", error);
      alert("Failed to stop recurrence. Please try again.");
    }
  }, []);

  return {
    transactions,
    loading,
    refresh,
    remove,
    stopRecurring, 
  };
};