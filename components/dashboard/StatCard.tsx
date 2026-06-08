import { type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn, formatCurrency } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  trend?: "positive" | "negative" | "neutral";
  className?: string;
}

export function StatCard({ label, value, icon: Icon, trend = "neutral", className }: StatCardProps) {
  const trendColors = {
    positive: "text-emerald-600 dark:text-emerald-400",
    negative: "text-red-600 dark:text-red-400",
    neutral: "text-slate-900 dark:text-slate-100",
  };

  return (
    <Card className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/30">
          <Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        </div>
      </div>
      <p className={cn("text-2xl font-bold", trendColors[trend])}>{formatCurrency(value)}</p>
    </Card>
  );
}
