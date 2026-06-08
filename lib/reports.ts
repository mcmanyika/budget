import { format, subWeeks, startOfWeek, endOfWeek, subMonths } from "date-fns";
import { isInRange, isInMonth } from "./utils";
import type { Income, Expense, CategorySpending } from "@/types";
import { EXPENSE_CATEGORIES } from "@/types";

export function getMonthlyIncomeTotal(income: Income[], month: string): number {
  return income
    .filter((i) => isInMonth(i.date, month))
    .reduce((sum, i) => sum + Number(i.amount), 0);
}

export function getMonthlyExpenseTotal(expenses: Expense[], month: string): number {
  return expenses
    .filter((e) => isInMonth(e.date, month))
    .reduce((sum, e) => sum + Number(e.amount), 0);
}

export function getWeeklyIncomeTotal(income: Income[], start: string, end: string): number {
  return income
    .filter((i) => isInRange(i.date, start, end))
    .reduce((sum, i) => sum + Number(i.amount), 0);
}

export function getWeeklyExpenseTotal(expenses: Expense[], start: string, end: string): number {
  return expenses
    .filter((e) => isInRange(e.date, start, end))
    .reduce((sum, e) => sum + Number(e.amount), 0);
}

export function getCategorySpending(expenses: Expense[], start: string, end: string): CategorySpending[] {
  const filtered = expenses.filter((e) => isInRange(e.date, start, end));
  return EXPENSE_CATEGORIES.map((category) => ({
    category,
    amount: filtered.filter((e) => e.category === category).reduce((sum, e) => sum + Number(e.amount), 0),
  }));
}

export function getWeeklyReportData(income: Income[], expenses: Expense[], weeks = 4) {
  const data = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = startOfWeek(subWeeks(new Date(), i), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(subWeeks(new Date(), i), { weekStartsOn: 1 });
    const start = format(weekStart, "yyyy-MM-dd");
    const end = format(weekEnd, "yyyy-MM-dd");

    data.push({
      period: format(weekStart, "MMM d"),
      income: income.filter((item) => isInRange(item.date, start, end)).reduce((s, item) => s + Number(item.amount), 0),
      expenses: expenses.filter((item) => isInRange(item.date, start, end)).reduce((s, item) => s + Number(item.amount), 0),
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
