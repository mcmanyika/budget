"use client";

import { AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { PieChart } from "lucide-react";
import { formatCurrency, getBudgetStatus } from "@/lib/utils";
import type { Budget, Expense } from "@/types";

interface BudgetProgressProps {
  budgets: Budget[];
  expenses: Expense[];
  onEdit: (budget: Budget) => void;
}

export function BudgetProgress({ budgets, expenses, onEdit }: BudgetProgressProps) {
  if (budgets.length === 0) {
    return (
      <EmptyState
        icon={PieChart}
        title="No budgets set"
        description="Set monthly budgets by category to track your spending."
      />
    );
  }

  return (
    <div className="space-y-3">
      {budgets.map((budget) => {
        const spent = expenses
          .filter((e) => e.category === budget.category)
          .reduce((sum, e) => sum + e.amount, 0);
        const { percentage, remaining, status } = getBudgetStatus(spent, budget.amount);

        return (
          <Card key={budget.id} onClick={() => onEdit(budget)}>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900 dark:text-slate-100">{budget.category}</span>
                {status === "exceeded" && <Badge variant="danger">Over budget</Badge>}
                {status === "warning" && <Badge variant="warning">Near limit</Badge>}
              </div>
              {status !== "good" && <AlertTriangle className="h-4 w-4 text-amber-500" />}
            </div>
            <ProgressBar value={spent} max={budget.amount} status={status} />
            <div className="mt-2 flex justify-between text-xs text-slate-500">
              <span>Spent: {formatCurrency(spent)}</span>
              <span className={remaining < 0 ? "text-red-500 font-medium" : ""}>
                {remaining < 0 ? "Over by " : "Left: "}
                {formatCurrency(Math.abs(remaining))}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
