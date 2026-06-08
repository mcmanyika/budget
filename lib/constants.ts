export const CATEGORY_COLORS: Record<string, string> = {
  Housing: "#6366f1",
  Utilities: "#8b5cf6",
  Groceries: "#22c55e",
  Transportation: "#f59e0b",
  Gas: "#eab308",
  Tolls: "#a855f7",
  "Car Repair": "#64748b",
  Insurance: "#3b82f6",
  Medical: "#ef4444",
  Education: "#06b6d4",
  Entertainment: "#ec4899",
  Savings: "#10b981",
  "Debt Payments": "#f97316",
  Miscellaneous: "#94a3b8",
};

export const INCOME_SOURCES = [
  "Salary",
  "Freelance",
  "Lyft",
  "Business",
  "Side Hustle",
  "Investments",
  "Rental Income",
  "Gifts",
  "Refunds",
  "Benefits",
  "Other",
] as const;

export const NAV_ITEMS = [
  { href: "/", label: "Home", icon: "Home" },
  { href: "/income", label: "Income", icon: "TrendingUp" },
  { href: "/expenses", label: "Expenses", icon: "Receipt" },
  { href: "/budget", label: "Budget", icon: "PieChart" },
  { href: "/profile", label: "Profile", icon: "User" },
] as const;
