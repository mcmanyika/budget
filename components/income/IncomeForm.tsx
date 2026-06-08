"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { positiveAmount } from "@/lib/validation";
import { INCOME_SOURCES } from "@/lib/constants";
import { format } from "date-fns";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import type { Income } from "@/types";

const schema = z.object({
  amount: positiveAmount,
  source: z.string().min(1, "Source is required"),
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
});

type FormInput = z.input<typeof schema>;
type FormOutput = z.output<typeof schema>;

interface IncomeFormProps {
  initial?: Income;
  onSubmit: (data: FormOutput) => Promise<void>;
  onCancel: () => void;
}

export function IncomeForm({ initial, onSubmit, onCancel }: IncomeFormProps) {
  const sourceOptions = useMemo(() => {
    const sources: string[] = [...INCOME_SOURCES];
    if (initial?.source && !sources.includes(initial.source)) {
      sources.unshift(initial.source);
    }
    return sources.map((s) => ({ value: s, label: s }));
  }, [initial?.source]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: initial?.amount ?? ("" as unknown as number),
      source: initial?.source ?? "Salary",
      date: initial?.date ?? format(new Date(), "yyyy-MM-dd"),
      notes: initial?.notes ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Amount"
        type="number"
        step="0.01"
        placeholder="0.00"
        error={errors.amount?.message}
        {...register("amount")}
      />
      <Select
        label="Source"
        options={sourceOptions}
        error={errors.source?.message}
        {...register("source")}
      />
      <Input
        label="Date"
        type="date"
        error={errors.date?.message}
        {...register("date")}
      />
      <Textarea
        label="Notes (optional)"
        placeholder="Additional details..."
        {...register("notes")}
      />
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" fullWidth onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initial ? "Update" : "Add Income"}
        </Button>
      </div>
    </form>
  );
}
