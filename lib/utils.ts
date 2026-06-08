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
    start: format(startOfMonth(date), "yyyy-MM-dd"),
    end: format(endOfMonth(date), "yyyy-MM-dd"),
  };
}

export function getWeekRange(date: Date = new Date()) {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return {
    start: format(start, "yyyy-MM-dd"),
    end: format(end, "yyyy-MM-dd"),
  };
}

export function formatWeekRange(date: Date = new Date()): string {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  const sameYear = start.getFullYear() === end.getFullYear();
  const sameMonth = sameYear && start.getMonth() === end.getMonth();

  if (sameMonth) {
    return `${format(start, "MMM d")} – ${format(end, "d, yyyy")}`;
  }
  if (sameYear) {
    return `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}`;
  }
  return `${format(start, "MMM d, yyyy")} – ${format(end, "MMM d, yyyy")}`;
}

function parseDateOnly(dateStr: string): number {
  const dateOnly = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
  const time = parseISO(dateOnly).getTime();
  return Number.isNaN(time) ? 0 : time;
}

export function isInMonth(dateStr: string, month: string): boolean {
  const dateOnly = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
  return dateOnly.startsWith(month);
}

export function isInRange(dateStr: string, start: string, end: string): boolean {
  const date = parseDateOnly(dateStr);
  const startTime = parseDateOnly(start);
  const endTime = parseDateOnly(end);
  return date >= startTime && date <= endTime;
}

function toTimestamp(value?: string): number {
  if (!value) return 0;
  const time = parseISO(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

export function sortByLatest<T extends { date?: string; createdAt?: string }>(records: T[]): T[] {
  return [...records].sort((a, b) => {
    const dateDiff = toTimestamp(b.date) - toTimestamp(a.date);
    if (dateDiff !== 0) return dateDiff;
    return toTimestamp(b.createdAt) - toTimestamp(a.createdAt);
  });
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
