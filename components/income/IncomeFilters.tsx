"use client";

import { cn } from "@/lib/utils";
import { Select } from "@/components/ui/Select";

export type IncomePeriod = "all" | "week" | "month";

interface IncomeFiltersProps {
  period: IncomePeriod;
  source: string;
  sources: { value: string; label: string }[];
  onPeriodChange: (period: IncomePeriod) => void;
  onSourceChange: (source: string) => void;
}

const PERIODS: { value: IncomePeriod; label: string }[] = [
  { value: "all", label: "All" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
];

export function IncomeFilters({
  period,
  source,
  sources,
  onPeriodChange,
  onSourceChange,
}: IncomeFiltersProps) {
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
        label="Source"
        value={source}
        onChange={(e) => onSourceChange(e.target.value)}
        options={sources}
      />
    </div>
  );
}
