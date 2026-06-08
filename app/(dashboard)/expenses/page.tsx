"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { ExpenseList } from "@/components/expenses/ExpenseList";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import { useExpenses } from "@/hooks/useExpenses";
import type { Expense } from "@/types";

export default function ExpensesPage() {
  const { expenses, loading, addExpense, editExpense, removeExpense } = useExpenses();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | undefined>();

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
        subtitle={`${expenses.length} record${expenses.length !== 1 ? "s" : ""}`}
        action={
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Add
          </Button>
        }
      />
      <div className="page-container">
        <ExpenseList
          expenses={expenses}
          onEdit={handleEdit}
          onDelete={removeExpense}
        />
      </div>
      <Modal open={modalOpen} onClose={handleClose} title={editing ? "Edit Expense" : "Add Expense"}>
        <ExpenseForm initial={editing} onSubmit={handleSubmit} onCancel={handleClose} />
      </Modal>
    </>
  );
}
