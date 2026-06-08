"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { ExpenseList } from "@/components/expenses/ExpenseList";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { ExpenseFilters } from "@/components/expenses/ExpenseFilters";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import { useExpenses } from "@/hooks/useExpenses";
import { filterExpenses, getExpenseCategoryOptions, type ExpensePeriod } from "@/lib/expenses";
import { formatCurrency } from "@/lib/utils";
import type { Expense } from "@/types";

export default function ExpensesPage() {
  const { expenses, loading, addExpense, editExpense, removeExpense } = useExpenses();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | undefined>();
  const [period, setPeriod] = useState<ExpensePeriod>("all");
  const [category, setCategory] = useState("all");

  const categoryOptions = useMemo(() => getExpenseCategoryOptions(), []);
  const filteredExpenses = useMemo(
    () => filterExpenses(expenses, period, category),
    [expenses, period, category]
  );
  const filteredTotal = useMemo(
    () => filteredExpenses.reduce((sum, item) => sum + Number(item.amount), 0),
    [filteredExpenses]
  );
  const hasFilters = period !== "all" || category !== "all";

  const handleSubmit = async (data: Parameters<typeof addExpense>[0]) => {
    if (editing) {
      await editExpense(editing.id, data);
    } else {
      await addExpense(data);
    }
    setModalOpen(false);
    setEditing(undefined);
  };

  const handleEdit = (item: Expense) => {
    setEditing(item);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditing(undefined);
  };

  if (loading) return <PageLoader />;

  return (
    <>
      <MobileHeader
        title="Expenses"
        subtitle={`${filteredExpenses.length} of ${expenses.length} record${expenses.length !== 1 ? "s" : ""}`}
        action={
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Add
          </Button>
        }
      />
      <div className="page-container space-y-4">
        <ExpenseFilters
          period={period}
          category={category}
          categories={categoryOptions}
          onPeriodChange={setPeriod}
          onCategoryChange={setCategory}
        />
        {filteredExpenses.length > 0 && (
          <Card className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Filtered Total</span>
            <span className="text-xl font-bold text-red-600">{formatCurrency(filteredTotal)}</span>
          </Card>
        )}
        <ExpenseList
          expenses={filteredExpenses}
          onEdit={handleEdit}
          onDelete={removeExpense}
          hasFilters={hasFilters}
        />
      </div>
      <Modal open={modalOpen} onClose={handleClose} title={editing ? "Edit Expense" : "Add Expense"}>
        <ExpenseForm initial={editing} onSubmit={handleSubmit} onCancel={handleClose} />
      </Modal>
    </>
  );
}
