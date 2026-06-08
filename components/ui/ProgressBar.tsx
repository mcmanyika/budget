import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  status?: "good" | "warning" | "exceeded";
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({ value, max = 100, status = "good", showLabel = true, className }: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const colors = {
    good: "bg-indigo-500",
    warning: "bg-amber-500",
    exceeded: "bg-red-500",
  };

  return (
    <div className={cn("space-y-1", className)}>
      {showLabel && (
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>{percentage.toFixed(0)}%</span>
          <span>{max > 0 ? `${value.toFixed(0)} / ${max}` : ""}</span>
        </div>
      )}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className={cn("h-full rounded-full transition-all duration-500", colors[status])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
