"use client";

import { ArrowDownLeft, ArrowUpRight, Receipt } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency, formatShortDate, isInRange, sortByLatest } from "@/lib/utils";
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
  start?: string;
  end?: string;
  limit?: number;
}

export function RecentTransactions({ income, expenses, start, end, limit = 5 }: RecentTransactionsProps) {
  const filterByRange = <T extends { date: string }>(records: T[]) => {
    if (!start || !end) return records;
    return records.filter((record) => isInRange(record.date, start, end));
  };

  const transactions: Transaction[] = sortByLatest([
    ...filterByRange(income).map((i) => ({
      id: i.id,
      type: "income" as const,
      label: i.source,
      amount: i.amount,
      date: i.date,
      createdAt: i.createdAt,
    })),
    ...filterByRange(expenses).map((e) => ({
      id: e.id,
      type: "expense" as const,
      label: e.category,
      amount: e.amount,
      date: e.date,
      createdAt: e.createdAt,
    })),
  ]).slice(0, limit);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{start && end ? "This Week's Transactions" : "Recent Transactions"}</CardTitle>
      </CardHeader>
      {transactions.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title={start && end ? "No transactions this week" : "No transactions yet"}
          description={
            start && end
              ? "Add income or expenses for this week to see them here."
              : "Add income or expenses to see them here."
          }
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
