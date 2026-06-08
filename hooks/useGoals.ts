"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import type { SavingsGoal } from "@/types";
import * as firestore from "@/lib/firestore";
import { useAuth } from "./useAuth";
import { useDataFetch } from "./useDataFetch";

export function useGoals() {
  const { user } = useAuth();
  const fetcher = useCallback((userId: string) => firestore.getGoals(userId), []);
  const { data: goals, setData: setGoals, loading, refetch } = useDataFetch<SavingsGoal>({
    fetcher,
    errorMessage: "Failed to load goals",
  });

  const addGoal = async (data: Omit<SavingsGoal, "id" | "userId" | "createdAt" | "updatedAt">) => {
    if (!user) return;
    const optimistic: SavingsGoal = {
      ...data,
      id: `temp-${Date.now()}`,
      userId: user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setGoals((prev) => [optimistic, ...prev]);
    try {
      const id = await firestore.createGoal(user.uid, data);
      setGoals((prev) => prev.map((item) => (item.id === optimistic.id ? { ...item, id } : item)));
      toast.success("Goal created");
    } catch {
      setGoals((prev) => prev.filter((item) => item.id !== optimistic.id));
      toast.error("Failed to create goal");
    }
  };

  const editGoal = async (id: string, data: Partial<SavingsGoal>) => {
    const previous = goals;
    setGoals((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...data, updatedAt: new Date().toISOString() } : item
      )
    );
    try {
      await firestore.updateGoal(id, data);
      toast.success("Goal updated");
    } catch {
      setGoals(previous);
      toast.error("Failed to update goal");
    }
  };

  const removeGoal = async (id: string) => {
    const previous = goals;
    setGoals((prev) => prev.filter((item) => item.id !== id));
    try {
      await firestore.deleteGoal(id);
      toast.success("Goal deleted");
    } catch {
      setGoals(previous);
      toast.error("Failed to delete goal");
    }
  };

  return { goals, loading, addGoal, editGoal, removeGoal, refetch };
}
