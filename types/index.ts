export const EXPENSE_CATEGORIES = [
  "Housing",
  "Utilities",
  "Groceries",
  "Transportation",
  "Gas",
  "Tolls",
  "Car Repair",
  "Insurance",
  "Medical",
  "Education",
  "Entertainment",
  "Savings",
  "Debt Payments",
  "Miscellaneous",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export interface BaseRecord {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Income extends BaseRecord {
  amount: number;
  source: string;
  date: string;
  notes?: string;
}

export interface Expense extends BaseRecord {
  amount: number;
  category: ExpenseCategory;
  date: string;
  notes?: string;
}

export interface Budget extends BaseRecord {
  category: ExpenseCategory;
  amount: number;
  month: string;
}

export interface SavingsGoal extends BaseRecord {
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
}

export type IncomeInput = Omit<Income, "id" | "userId" | "createdAt" | "updatedAt">;
export type ExpenseInput = Omit<Expense, "id" | "userId" | "createdAt" | "updatedAt">;
export type BudgetInput = Omit<Budget, "id" | "userId" | "createdAt" | "updatedAt">;
export type GoalInput = Omit<SavingsGoal, "id" | "userId" | "createdAt" | "updatedAt">;

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  remainingBalance: number;
}

export interface CategorySpending {
  category: ExpenseCategory;
  amount: number;
  budget?: number;
}
