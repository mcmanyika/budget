"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { BudgetProgress } from "@/components/budget/BudgetProgress";
import { BudgetForm } from "@/components/budget/BudgetForm";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import { useBudgets } from "@/hooks/useBudgets";
import { useExpenses } from "@/hooks/useExpenses";
import { getCurrentMonth, getMonthRange, isInRange } from "@/lib/utils";
import type { Budget } from "@/types";

export default function BudgetPage() {
  const month = getCurrentMonth();
  const { budgets, loading: budgetsLoading, addBudget, editBudget } = useBudgets(month);
  const { expenses, loading: expensesLoading } = useExpenses();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Budget | undefined>();

  const { start, end } = getMonthRange(month);
  const monthExpenses = useMemo(
    () => expenses.filter((e) => isInRange(e.date, start, end)),
    [expenses, start, end]
  );

  const handleSubmit = async (data: Parameters<typeof addBudget>[0]) => {
    if (editing) {
      await editBudget(editing.id, data);
    } else {
      await addBudget(data);
    }
    setModalOpen(false);
    setEditing(undefined);
  };

  const handleEdit = (budget: Budget) => {
    setEditing(budget);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditing(undefined);
  };

  if (budgetsLoading || expensesLoading) return <PageLoader />;

  return (
    <>
      <MobileHeader
        title="Budget"
        subtitle={new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        action={
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Set
          </Button>
        }
      />
      <div className="page-container">
        <BudgetProgress
          budgets={budgets}
          expenses={monthExpenses}
          onEdit={handleEdit}
        />
      </div>
      <Modal open={modalOpen} onClose={handleClose} title={editing ? "Edit Budget" : "Set Budget"}>
        <BudgetForm initial={editing} onSubmit={handleSubmit} onCancel={handleClose} />
      </Modal>
    </>
  );
}
