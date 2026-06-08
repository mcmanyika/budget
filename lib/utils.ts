import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string): string {
  return format(parseISO(date), "MMM d, yyyy");
}

export function formatShortDate(date: string): string {
  return format(parseISO(date), "MMM d");
}

export function getCurrentMonth(): string {
  return format(new Date(), "yyyy-MM");
}

export function getMonthRange(month: string) {
  const date = parseISO(`${month}-01`);
  return {
    start: startOfMonth(date).toISOString(),
    end: endOfMonth(date).toISOString(),
  };
}

export function getWeekRange(date: Date = new Date()) {
  return {
    start: startOfWeek(date, { weekStartsOn: 1 }).toISOString(),
    end: endOfWeek(date, { weekStartsOn: 1 }).toISOString(),
  };
}

export function isInRange(dateStr: string, start: string, end: string): boolean {
  const date = parseISO(dateStr).getTime();
  return date >= parseISO(start).getTime() && date <= parseISO(end).getTime();
}

export function getBudgetStatus(spent: number, budget: number): {
  percentage: number;
  remaining: number;
  status: "good" | "warning" | "exceeded";
} {
  const percentage = budget > 0 ? (spent / budget) * 100 : 0;
  const remaining = budget - spent;
  const status: "good" | "warning" | "exceeded" =
    percentage >= 100 ? "exceeded" : percentage >= 80 ? "warning" : "good";
  return { percentage, remaining, status };
}
