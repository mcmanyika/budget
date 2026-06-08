"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { GoalList } from "@/components/goals/GoalList";
import { GoalForm } from "@/components/goals/GoalForm";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import { useGoals } from "@/hooks/useGoals";
import type { SavingsGoal } from "@/types";

export default function GoalsPage() {
  const { goals, loading, addGoal, editGoal, removeGoal } = useGoals();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SavingsGoal | undefined>();

  const handleSubmit = async (data: Parameters<typeof addGoal>[0]) => {
    if (editing) {
      await editGoal(editing.id, data);
    } else {
      await addGoal(data);
    }
    setModalOpen(false);
    setEditing(undefined);
  };

  const handleEdit = (goal: SavingsGoal) => {
    setEditing(goal);
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
        title="Savings Goals"
        subtitle={`${goals.length} goal${goals.length !== 1 ? "s" : ""}`}
        action={
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Add
          </Button>
        }
      />
      <div className="page-container">
        <GoalList goals={goals} onEdit={handleEdit} onDelete={removeGoal} />
      </div>
      <Modal open={modalOpen} onClose={handleClose} title={editing ? "Edit Goal" : "New Goal"}>
        <GoalForm initial={editing} onSubmit={handleSubmit} onCancel={handleClose} />
      </Modal>
    </>
  );
}
