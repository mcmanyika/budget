"use client";

import Link from "next/link";
import { DollarSign, TrendingDown, Wallet, BarChart3 } from "lucide-react";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import { useIncome } from "@/hooks/useIncome";
import { useExpenses } from "@/hooks/useExpenses";
import { getWeekRange, formatWeekRange } from "@/lib/utils";
import { getWeeklyIncomeTotal, getWeeklyExpenseTotal } from "@/lib/reports";

export default function DashboardPage() {
  const { income, loading: incomeLoading } = useIncome();
  const { expenses, loading: expensesLoading } = useExpenses();

  const loading = incomeLoading || expensesLoading;
  const { start, end } = getWeekRange();

  const totalIncome = getWeeklyIncomeTotal(income, start, end);
  const totalExpenses = getWeeklyExpenseTotal(expenses, start, end);
  const remaining = totalIncome - totalExpenses;

  if (loading) return <PageLoader />;

  return (
    <>
      <MobileHeader
        title="Dashboard"
        subtitle={`This week · ${formatWeekRange()}`}
        action={
          <Link
            href="/reports"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/30"
          >
            <BarChart3 className="h-5 w-5 text-indigo-600" />
          </Link>
        }
      />
      <div className="page-container space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Income (This Week)" value={totalIncome} icon={DollarSign} trend="positive" />
          <StatCard label="Expenses (This Week)" value={totalExpenses} icon={TrendingDown} trend="negative" />
        </div>
        <StatCard
          label="Remaining Balance"
          value={remaining}
          icon={Wallet}
          trend={remaining >= 0 ? "positive" : "negative"}
          className="col-span-2"
        />
        <RecentTransactions income={income} expenses={expenses} start={start} end={end} />
      </div>
    </>
  );
}
