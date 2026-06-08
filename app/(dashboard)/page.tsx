"use client";

import Link from "next/link";
import { DollarSign, TrendingDown, Wallet, BarChart3 } from "lucide-react";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { ExpenseChart } from "@/components/dashboard/ExpenseChart";
import { SavingsProgress } from "@/components/dashboard/SavingsProgress";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import { useIncome } from "@/hooks/useIncome";
import { useExpenses } from "@/hooks/useExpenses";
import { useGoals } from "@/hooks/useGoals";
import { getCurrentMonth } from "@/lib/utils";
import { getMonthlyIncomeTotal, getMonthlyExpenseTotal, getCategorySpending } from "@/lib/reports";
import { getMonthRange } from "@/lib/utils";

export default function DashboardPage() {
  const { income, loading: incomeLoading } = useIncome();
  const { expenses, loading: expensesLoading } = useExpenses();
  const { goals, loading: goalsLoading } = useGoals();

  const loading = incomeLoading || expensesLoading || goalsLoading;
  const month = getCurrentMonth();
  const { start, end } = getMonthRange(month);

  const totalIncome = getMonthlyIncomeTotal(income, month);
  const totalExpenses = getMonthlyExpenseTotal(expenses, month);
  const remaining = totalIncome - totalExpenses;
  const categoryData = getCategorySpending(expenses, start, end);

  if (loading) return <PageLoader />;

  return (
    <>
      <MobileHeader
        title="Dashboard"
        subtitle={new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
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
          <StatCard label="Income" value={totalIncome} icon={DollarSign} trend="positive" />
          <StatCard label="Expenses" value={totalExpenses} icon={TrendingDown} trend="negative" />
        </div>
        <StatCard
          label="Remaining Balance"
          value={remaining}
          icon={Wallet}
          trend={remaining >= 0 ? "positive" : "negative"}
          className="col-span-2"
        />
        <SavingsProgress goals={goals} />
        <ExpenseChart data={categoryData} />
        <RecentTransactions income={income} expenses={expenses} />
      </div>
    </>
  );
}
