"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import type { Expense } from "@/types";
import * as firestore from "@/lib/firestore";
import { useAuth } from "./useAuth";
import { useDataFetch } from "./useDataFetch";

export function useExpenses() {
  const { user } = useAuth();
  const fetcher = useCallback((userId: string) => firestore.getExpenses(userId), []);
  const { data: expenses, setData: setExpenses, loading, refetch } = useDataFetch<Expense>({
    fetcher,
    errorMessage: "Failed to load expenses",
  });

  const addExpense = async (data: Omit<Expense, "id" | "userId" | "createdAt" | "updatedAt">) => {
    if (!user) return;
    const optimistic: Expense = {
      ...data,
      id: `temp-${Date.now()}`,
      userId: user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setExpenses((prev) => [optimistic, ...prev]);
    try {
      const id = await firestore.createExpense(user.uid, data);
      setExpenses((prev) => prev.map((item) => (item.id === optimistic.id ? { ...item, id } : item)));
      toast.success("Expense added");
    } catch {
      setExpenses((prev) => prev.filter((item) => item.id !== optimistic.id));
      toast.error("Failed to add expense");
    }
  };

  const editExpense = async (id: string, data: Partial<Expense>) => {
    const previous = expenses;
    setExpenses((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...data, updatedAt: new Date().toISOString() } : item
      )
    );
    try {
      await firestore.updateExpense(id, data);
      toast.success("Expense updated");
    } catch {
      setExpenses(previous);
      toast.error("Failed to update expense");
    }
  };

  const removeExpense = async (id: string) => {
    const previous = expenses;
    setExpenses((prev) => prev.filter((item) => item.id !== id));
    try {
      await firestore.deleteExpense(id);
      toast.success("Expense deleted");
    } catch {
      setExpenses(previous);
      toast.error("Failed to delete expense");
    }
  };

  return { expenses, loading, addExpense, editExpense, removeExpense, refetch };
}
