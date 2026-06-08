"use client";

import { cn } from "@/lib/utils";
import { Select } from "@/components/ui/Select";
import type { ExpensePeriod } from "@/lib/expenses";

interface ExpenseFiltersProps {
  period: ExpensePeriod;
  category: string;
  categories: { value: string; label: string }[];
  onPeriodChange: (period: ExpensePeriod) => void;
  onCategoryChange: (category: string) => void;
}

const PERIODS: { value: ExpensePeriod; label: string }[] = [
  { value: "all", label: "All" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
];

export function ExpenseFilters({
  period,
  category,
  categories,
  onPeriodChange,
  onCategoryChange,
}: ExpenseFiltersProps) {
  return (
    <div className="space-y-3">
      <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
        {PERIODS.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => onPeriodChange(item.value)}
            className={cn(
              "flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors",
              period === item.value
                ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <Select
        label="Category"
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        options={categories}
      />
    </div>
  );
}
