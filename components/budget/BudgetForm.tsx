"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { positiveAmount } from "@/lib/validation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { EXPENSE_CATEGORIES } from "@/types";
import { getCurrentMonth } from "@/lib/utils";
import type { Budget } from "@/types";

const schema = z.object({
  category: z.enum(EXPENSE_CATEGORIES),
  amount: positiveAmount,
  month: z.string().min(1),
});

type FormInput = z.input<typeof schema>;
type FormOutput = z.output<typeof schema>;

interface BudgetFormProps {
  initial?: Budget;
  onSubmit: (data: FormOutput) => Promise<void>;
  onCancel: () => void;
}

export function BudgetForm({ initial, onSubmit, onCancel }: BudgetFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(schema),
    defaultValues: {
      category: initial?.category ?? "Groceries",
      amount: initial?.amount ?? 0,
      month: initial?.month ?? getCurrentMonth(),
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Select
        label="Category"
        options={EXPENSE_CATEGORIES.map((c) => ({ value: c, label: c }))}
        error={errors.category?.message}
        {...register("category")}
      />
      <Input
        label="Monthly Budget"
        type="number"
        step="0.01"
        placeholder="0.00"
        error={errors.amount?.message}
        {...register("amount")}
      />
      <Input
        label="Month"
        type="month"
        error={errors.month?.message}
        {...register("month")}
      />
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" fullWidth onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initial ? "Update" : "Set Budget"}
        </Button>
      </div>
    </form>
  );
}
