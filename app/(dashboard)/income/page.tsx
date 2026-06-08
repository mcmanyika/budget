"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { IncomeList } from "@/components/income/IncomeList";
import { IncomeForm } from "@/components/income/IncomeForm";
import { IncomeFilters, type IncomePeriod } from "@/components/income/IncomeFilters";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import { useIncome } from "@/hooks/useIncome";
import { filterIncome, getIncomeSources } from "@/lib/income";
import { formatCurrency } from "@/lib/utils";
import type { Income } from "@/types";

export default function IncomePage() {
  const { income, loading, addIncome, editIncome, removeIncome } = useIncome();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Income | undefined>();
  const [period, setPeriod] = useState<IncomePeriod>("all");
  const [source, setSource] = useState("all");

  const sourceOptions = useMemo(() => getIncomeSources(income), [income]);
  const filteredIncome = useMemo(
    () => filterIncome(income, period, source),
    [income, period, source]
  );
  const filteredTotal = useMemo(
    () => filteredIncome.reduce((sum, item) => sum + Number(item.amount), 0),
    [filteredIncome]
  );
  const hasFilters = period !== "all" || source !== "all";

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
        subtitle={`${filteredIncome.length} of ${income.length} record${income.length !== 1 ? "s" : ""}`}
        action={
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Add
          </Button>
        }
      />
      <div className="page-container space-y-4">
        <IncomeFilters
          period={period}
          source={source}
          sources={sourceOptions}
          onPeriodChange={setPeriod}
          onSourceChange={setSource}
        />
        {filteredIncome.length > 0 && (
          <Card className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Filtered Total</span>
            <span className="text-xl font-bold text-emerald-600">{formatCurrency(filteredTotal)}</span>
          </Card>
        )}
        <IncomeList
          income={filteredIncome}
          onEdit={handleEdit}
          onDelete={removeIncome}
          hasFilters={hasFilters}
        />
      </div>
      <Modal open={modalOpen} onClose={handleClose} title={editing ? "Edit Income" : "Add Income"}>
        <IncomeForm initial={editing} onSubmit={handleSubmit} onCancel={handleClose} />
      </Modal>
    </>
  );
}
