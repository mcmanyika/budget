import { getCurrentMonth, getWeekRange, isInMonth, isInRange } from "./utils";
import { EXPENSE_CATEGORIES } from "@/types";
import type { Expense } from "@/types";

export type ExpensePeriod = "all" | "week" | "month";

export function filterExpenses(
  expenses: Expense[],
  period: ExpensePeriod,
  category: string
): Expense[] {
  let filtered = expenses;

  if (category !== "all") {
    filtered = filtered.filter((item) => item.category === category);
  }

  if (period === "week") {
    const { start, end } = getWeekRange();
    filtered = filtered.filter((item) => isInRange(item.date, start, end));
  } else if (period === "month") {
    filtered = filtered.filter((item) => isInMonth(item.date, getCurrentMonth()));
  }

  return filtered;
}

export function getExpenseCategoryOptions(): { value: string; label: string }[] {
  return [
    { value: "all", label: "All Categories" },
    ...EXPENSE_CATEGORIES.map((category) => ({ value: category, label: category })),
  ];
}
