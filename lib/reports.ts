import { format, subWeeks, startOfWeek, endOfWeek, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { isInRange } from "./utils";
import type { Income, Expense, CategorySpending } from "@/types";
import { EXPENSE_CATEGORIES } from "@/types";

export function getMonthlyIncomeTotal(income: Income[], month: string): number {
  const start = startOfMonth(new Date(`${month}-01`)).toISOString();
  const end = endOfMonth(new Date(`${month}-01`)).toISOString();
  return income.filter((i) => isInRange(i.date, start, end)).reduce((sum, i) => sum + i.amount, 0);
}

export function getMonthlyExpenseTotal(expenses: Expense[], month: string): number {
  const start = startOfMonth(new Date(`${month}-01`)).toISOString();
  const end = endOfMonth(new Date(`${month}-01`)).toISOString();
  return expenses.filter((e) => isInRange(e.date, start, end)).reduce((sum, e) => sum + e.amount, 0);
}

export function getCategorySpending(expenses: Expense[], start: string, end: string): CategorySpending[] {
  const filtered = expenses.filter((e) => isInRange(e.date, start, end));
  return EXPENSE_CATEGORIES.map((category) => ({
    category,
    amount: filtered.filter((e) => e.category === category).reduce((sum, e) => sum + e.amount, 0),
  }));
}

export function getWeeklyReportData(income: Income[], expenses: Expense[], weeks = 4) {
  const data = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = startOfWeek(subWeeks(new Date(), i), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(subWeeks(new Date(), i), { weekStartsOn: 1 });
    const start = weekStart.toISOString();
    const end = weekEnd.toISOString();

    data.push({
      period: format(weekStart, "MMM d"),
      income: income.filter((item) => isInRange(item.date, start, end)).reduce((s, item) => s + item.amount, 0),
      expenses: expenses.filter((item) => isInRange(item.date, start, end)).reduce((s, item) => s + item.amount, 0),
    });
  }
  return data;
}

export function getMonthlyReportData(income: Income[], expenses: Expense[], months = 6) {
  const data = [];
  for (let i = months - 1; i >= 0; i--) {
    const monthDate = subMonths(new Date(), i);
    const month = format(monthDate, "yyyy-MM");
    data.push({
      period: format(monthDate, "MMM yyyy"),
      income: getMonthlyIncomeTotal(income, month),
      expenses: getMonthlyExpenseTotal(expenses, month),
    });
  }
  return data;
}
