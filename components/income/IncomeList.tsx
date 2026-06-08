"use client";

import { Pencil, Trash2, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Income } from "@/types";

interface IncomeListProps {
  income: Income[];
  onEdit: (item: Income) => void;
  onDelete: (id: string) => void;
}

export function IncomeList({ income, onEdit, onDelete }: IncomeListProps) {
  if (income.length === 0) {
    return (
      <EmptyState
        icon={TrendingUp}
        title="No income recorded"
        description="Track your earnings by adding your first income entry."
      />
    );
  }

  return (
    <div className="space-y-3">
      {income.map((item) => (
        <Card key={item.id} className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-slate-900 dark:text-slate-100">{item.source}</p>
            <p className="text-sm text-slate-500">{formatDate(item.date)}</p>
            {item.notes && <p className="mt-1 text-sm text-slate-400 truncate">{item.notes}</p>}
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-lg font-bold text-emerald-600">{formatCurrency(item.amount)}</span>
            <div className="flex gap-1">
              <button
                onClick={() => onEdit(item)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
