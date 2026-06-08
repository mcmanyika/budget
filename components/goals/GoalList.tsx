"use client";

import { Pencil, Trash2, Target } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { SavingsGoal } from "@/types";

interface GoalListProps {
  goals: SavingsGoal[];
  onEdit: (goal: SavingsGoal) => void;
  onDelete: (id: string) => void;
}

export function GoalList({ goals, onEdit, onDelete }: GoalListProps) {
  if (goals.length === 0) {
    return (
      <EmptyState
        icon={Target}
        title="No savings goals"
        description="Create a goal to start tracking your savings progress."
      />
    );
  }

  return (
    <div className="space-y-3">
      {goals.map((goal) => {
        const percentage = goal.targetAmount > 0
          ? (goal.currentAmount / goal.targetAmount) * 100
          : 0;

        return (
          <Card key={goal.id}>
            <div className="mb-3 flex items-start justify-between">
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">{goal.name}</p>
                {goal.deadline && (
                  <p className="text-xs text-slate-500">Due {formatDate(goal.deadline)}</p>
                )}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => onEdit(goal)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  <Pencil className="h-4 w-4 text-slate-600 dark:text-slate-300" strokeWidth={2} />
                </button>
                <button
                  onClick={() => onDelete(goal.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <ProgressBar value={goal.currentAmount} max={goal.targetAmount} status="good" />
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-slate-500">
                {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
              </span>
              <span className="font-semibold text-indigo-600">{percentage.toFixed(0)}%</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
