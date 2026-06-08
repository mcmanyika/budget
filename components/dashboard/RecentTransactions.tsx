"use client";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Receipt } from "lucide-react";
import { formatCurrency, formatShortDate } from "@/lib/utils";
import type { Income, Expense } from "@/types";

interface Transaction {
  id: string;
  type: "income" | "expense";
  label: string;
  amount: number;
  date: string;
}

interface RecentTransactionsProps {
  income: Income[];
  expenses: Expense[];
  limit?: number;
}

export function RecentTransactions({ income, expenses, limit = 5 }: RecentTransactionsProps) {
  const transactions: Transaction[] = [
    ...income.map((i) => ({
      id: i.id,
      type: "income" as const,
      label: i.source,
      amount: i.amount,
      date: i.date,
    })),
    ...expenses.map((e) => ({
      id: e.id,
      type: "expense" as const,
      label: e.category,
      amount: e.amount,
      date: e.date,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      {transactions.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No transactions yet"
          description="Add income or expenses to see them here."
        />
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={`${tx.type}-${tx.id}`} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    tx.type === "income"
                      ? "bg-emerald-100 dark:bg-emerald-900/30"
                      : "bg-red-100 dark:bg-red-900/30"
                  }`}
                >
                  {tx.type === "income" ? (
                    <ArrowDownLeft className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <ArrowUpRight className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{tx.label}</p>
                  <p className="text-xs text-slate-500">{formatShortDate(tx.date)}</p>
                </div>
              </div>
              <span
                className={`text-sm font-semibold ${
                  tx.type === "income" ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {tx.type === "income" ? "+" : "-"}
                {formatCurrency(tx.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
