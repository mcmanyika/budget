"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type { Budget } from "@/types";
import * as firestore from "@/lib/firestore";
import { getCurrentMonth } from "@/lib/utils";
import { useAuth } from "./useAuth";

export function useBudgets(month?: string) {
  const { user, loading: authLoading } = useAuth();
  const currentMonth = month ?? getCurrentMonth();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBudgets = useCallback(async () => {
    if (authLoading) return;

    if (!user) {
      setBudgets([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await firestore.getBudgets(user.uid, currentMonth);
      setBudgets(data);
    } catch (error) {
      console.error("Failed to load budgets:", error);
      toast.error("Failed to load budgets", { id: "failed-budgets" });
    } finally {
      setLoading(false);
    }
  }, [user, authLoading, currentMonth]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const addBudget = async (data: Omit<Budget, "id" | "userId" | "createdAt" | "updatedAt">) => {
    if (!user) return;
    const optimistic: Budget = {
      ...data,
      id: `temp-${Date.now()}`,
      userId: user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setBudgets((prev) => [...prev, optimistic]);
    try {
      const id = await firestore.createBudget(user.uid, data);
      setBudgets((prev) => prev.map((item) => (item.id === optimistic.id ? { ...item, id } : item)));
      toast.success("Budget set");
    } catch {
      setBudgets((prev) => prev.filter((item) => item.id !== optimistic.id));
      toast.error("Failed to set budget");
    }
  };

  const editBudget = async (id: string, data: Partial<Budget>) => {
    const previous = budgets;
    setBudgets((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...data, updatedAt: new Date().toISOString() } : item
      )
    );
    try {
      await firestore.updateBudget(id, data);
      toast.success("Budget updated");
    } catch {
      setBudgets(previous);
      toast.error("Failed to update budget");
    }
  };

  const removeBudget = async (id: string) => {
    const previous = budgets;
    setBudgets((prev) => prev.filter((item) => item.id !== id));
    try {
      await firestore.deleteBudget(id);
      toast.success("Budget removed");
    } catch {
      setBudgets(previous);
      toast.error("Failed to remove budget");
    }
  };

  return { budgets, loading, addBudget, editBudget, removeBudget, refetch: fetchBudgets };
}
