"use client";

import { type ReactNode } from "react";
import { BottomNav } from "@/components/layout/BottomNav";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {children}
        <BottomNav />
      </div>
    </ProtectedRoute>
  );
}
