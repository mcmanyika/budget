"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Moon, Sun, Target, BarChart3, LogOut, User } from "lucide-react";
import { toast } from "sonner";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { logOut } from "@/lib/auth";

const menuItems = [
  { href: "/goals", label: "Savings Goals", icon: Target, description: "Track your savings targets" },
  { href: "/reports", label: "Reports", icon: BarChart3, description: "Weekly and monthly analysis" },
];

export default function ProfilePage() {
  const { user, profile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Signed out");
      router.push("/login");
    } catch {
      toast.error("Failed to sign out");
    }
  };

  return (
    <>
      <MobileHeader title="Profile" />
      <div className="page-container space-y-4">
        <Card className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
            <User className="h-7 w-7 text-indigo-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              {profile?.displayName ?? "User"}
            </p>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
        </Card>

        <div className="space-y-2">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                  <item.icon className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-slate-100">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.description}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <Card>
          <button
            onClick={toggleTheme}
            className="flex w-full items-center justify-between"
          >
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <Moon className="h-5 w-5 text-indigo-600" />
              ) : (
                <Sun className="h-5 w-5 text-indigo-600" />
              )}
              <span className="font-medium">Dark Mode</span>
            </div>
            <div
              className={`h-7 w-12 rounded-full transition-colors ${
                theme === "dark" ? "bg-indigo-600" : "bg-slate-200"
              }`}
            >
              <div
                className={`h-7 w-7 rounded-full bg-white shadow transition-transform ${
                  theme === "dark" ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
          </button>
        </Card>

        <Button variant="danger" fullWidth size="lg" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </>
  );
}
