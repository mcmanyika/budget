import { type ReactNode } from "react";

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function MobileHeader({ title, subtitle, action }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
      <div className="mx-auto flex max-w-lg items-center justify-between md:max-w-2xl lg:max-w-4xl">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
        {action}
      </div>
    </header>
  );
}
