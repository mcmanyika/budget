"use client";

import Link from "next/link";
import { Target } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatCurrency } from "@/lib/utils";
import type { SavingsGoal } from "@/types";

interface SavingsProgressProps {
  goals: SavingsGoal[];
}

export function SavingsProgress({ goals }: SavingsProgressProps) {
  const primary = goals[0];

  if (!primary) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Savings Goals</CardTitle>
          <Link href="/goals" className="text-sm font-medium text-indigo-600">
            Add goal
          </Link>
        </CardHeader>
        <p className="text-sm text-slate-500">Set a savings goal to track your progress.</p>
      </Card>
    );
  }

  const percentage = primary.targetAmount > 0
    ? (primary.currentAmount / primary.targetAmount) * 100
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-indigo-600" />
          {primary.name}
        </CardTitle>
        <Link href="/goals" className="text-sm font-medium text-indigo-600">
          View all
        </Link>
      </CardHeader>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">
            {formatCurrency(primary.currentAmount)} of {formatCurrency(primary.targetAmount)}
          </span>
          <span className="font-semibold text-indigo-600">{percentage.toFixed(0)}%</span>
        </div>
        <ProgressBar value={primary.currentAmount} max={primary.targetAmount} status="good" showLabel={false} />
      </div>
    </Card>
  );
}
