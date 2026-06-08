"use client";

import { useMemo } from "react";
import { Pencil, Trash2, Receipt } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency, formatDate, sortByLatest } from "@/lib/utils";
import type { Expense } from "@/types";

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (item: Expense) => void;
  onDelete: (id: string) => void;
  hasFilters?: boolean;
}

export function ExpenseList({ expenses, onEdit, onDelete, hasFilters = false }: ExpenseListProps) {
  const sortedExpenses = useMemo(() => sortByLatest(expenses), [expenses]);

  if (sortedExpenses.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title={hasFilters ? "No matching expenses" : "No expenses yet"}
        description={
          hasFilters
            ? "Try changing the period or category filter."
            : "Start tracking your spending by adding an expense."
        }
      />
    );
  }

  return (
    <div className="space-y-3">
      {sortedExpenses.map((item) => (
        <Card key={item.id} className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-1">
              <Badge>{item.category}</Badge>
            </div>
            <p className="text-sm text-slate-500">{formatDate(item.date)}</p>
            {item.notes && <p className="mt-1 text-sm text-slate-400 truncate">{item.notes}</p>}
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-lg font-bold text-red-600">-{formatCurrency(item.amount)}</span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => onEdit(item)}
                aria-label="Edit expense"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <Pencil className="h-4 w-4 text-slate-600 dark:text-slate-300" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => onDelete(item.id)}
                aria-label="Delete expense"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30"
              >
                <Trash2 className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
