"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { IncomeList } from "@/components/income/IncomeList";
import { IncomeForm } from "@/components/income/IncomeForm";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import { useIncome } from "@/hooks/useIncome";
import type { Income } from "@/types";

export default function IncomePage() {
  const { income, loading, addIncome, editIncome, removeIncome } = useIncome();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Income | undefined>();

  const handleSubmit = async (data: Parameters<typeof addIncome>[0]) => {
    if (editing) {
      await editIncome(editing.id, data);
    } else {
      await addIncome(data);
    }
    setModalOpen(false);
    setEditing(undefined);
  };

  const handleEdit = (item: Income) => {
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
        title="Income"
        subtitle={`${income.length} record${income.length !== 1 ? "s" : ""}`}
        action={
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Add
          </Button>
        }
      />
      <div className="page-container">
        <IncomeList
          income={income}
          onEdit={handleEdit}
          onDelete={removeIncome}
        />
      </div>
      <Modal open={modalOpen} onClose={handleClose} title={editing ? "Edit Income" : "Add Income"}>
        <IncomeForm initial={editing} onSubmit={handleSubmit} onCancel={handleClose} />
      </Modal>
    </>
  );
}
