"use client";

import { useState } from "react";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { IncomeExpenseChart } from "@/components/reports/IncomeExpenseChart";
import { CategoryAnalysis } from "@/components/reports/CategoryAnalysis";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import { useIncome } from "@/hooks/useIncome";
import { useExpenses } from "@/hooks/useExpenses";
import {
  getWeeklyReportData,
  getMonthlyReportData,
  getCategorySpending,
} from "@/lib/reports";
import { getMonthRange, getCurrentMonth } from "@/lib/utils";
import { cn } from "@/lib/utils";

type ReportTab = "weekly" | "monthly";

export default function ReportsPage() {
  const { income, loading: incomeLoading } = useIncome();
  const { expenses, loading: expensesLoading } = useExpenses();
  const [tab, setTab] = useState<ReportTab>("weekly");

  const loading = incomeLoading || expensesLoading;
  const month = getCurrentMonth();
  const { start, end } = getMonthRange(month);

  const weeklyData = getWeeklyReportData(income, expenses);
  const monthlyData = getMonthlyReportData(income, expenses);
  const categoryData = getCategorySpending(expenses, start, end);

  if (loading) return <PageLoader />;

  return (
    <>
      <MobileHeader title="Reports" subtitle="Analyze your finances" />
      <div className="page-container space-y-4">
        <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          {(["weekly", "monthly"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 rounded-lg py-2.5 text-sm font-medium capitalize transition-colors",
                tab === t
                  ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400"
                  : "text-slate-500"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <IncomeExpenseChart
          data={tab === "weekly" ? weeklyData : monthlyData}
          title={tab === "weekly" ? "Weekly Overview" : "Monthly Overview"}
        />
        <CategoryAnalysis data={categoryData} />
      </div>
    </>
  );
}
