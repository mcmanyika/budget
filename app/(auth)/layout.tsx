import { type ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-indigo-50 to-white px-4 dark:from-slate-900 dark:to-slate-950">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
