import { getCurrentMonth, getWeekRange, isInMonth, isInRange } from "./utils";
import type { Income } from "@/types";
import type { IncomePeriod } from "@/components/income/IncomeFilters";

export function filterIncome(
  income: Income[],
  period: IncomePeriod,
  source: string
): Income[] {
  let filtered = income;

  if (source !== "all") {
    filtered = filtered.filter((item) => item.source === source);
  }

  if (period === "week") {
    const { start, end } = getWeekRange();
    filtered = filtered.filter((item) => isInRange(item.date, start, end));
  } else if (period === "month") {
    filtered = filtered.filter((item) => isInMonth(item.date, getCurrentMonth()));
  }

  return filtered;
}

export function getIncomeSources(income: Income[]): { value: string; label: string }[] {
  const unique = Array.from(new Set(income.map((item) => item.source))).sort();
  return [
    { value: "all", label: "All Sources" },
    ...unique.map((source) => ({ value: source, label: source })),
  ];
}
