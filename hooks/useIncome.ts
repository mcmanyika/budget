"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import type { Income } from "@/types";
import * as firestore from "@/lib/firestore";
import { useAuth } from "./useAuth";
import { useDataFetch } from "./useDataFetch";

export function useIncome() {
  const { user } = useAuth();
  const fetcher = useCallback((userId: string) => firestore.getIncome(userId), []);
  const { data: income, setData: setIncome, loading, refetch } = useDataFetch<Income>({
    fetcher,
    errorMessage: "Failed to load income",
  });

  const addIncome = async (data: Omit<Income, "id" | "userId" | "createdAt" | "updatedAt">) => {
    if (!user) return;
    const optimistic: Income = {
      ...data,
      id: `temp-${Date.now()}`,
      userId: user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setIncome((prev) => [optimistic, ...prev]);
    try {
      const id = await firestore.createIncome(user.uid, data);
      setIncome((prev) => prev.map((item) => (item.id === optimistic.id ? { ...item, id } : item)));
      toast.success("Income added");
    } catch {
      setIncome((prev) => prev.filter((item) => item.id !== optimistic.id));
      toast.error("Failed to add income");
    }
  };

  const editIncome = async (id: string, data: Partial<Income>) => {
    const previous = income;
    setIncome((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...data, updatedAt: new Date().toISOString() } : item
      )
    );
    try {
      await firestore.updateIncome(id, data);
      toast.success("Income updated");
    } catch {
      setIncome(previous);
      toast.error("Failed to update income");
    }
  };

  const removeIncome = async (id: string) => {
    const previous = income;
    setIncome((prev) => prev.filter((item) => item.id !== id));
    try {
      await firestore.deleteIncome(id);
      toast.success("Income deleted");
    } catch {
      setIncome(previous);
      toast.error("Failed to delete income");
    }
  };

  return { income, loading, addIncome, editIncome, removeIncome, refetch };
}
