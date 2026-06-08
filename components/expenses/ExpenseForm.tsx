"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { positiveAmount } from "@/lib/validation";
import { format } from "date-fns";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { EXPENSE_CATEGORIES } from "@/types";
import type { Expense } from "@/types";

const schema = z.object({
  amount: positiveAmount,
  category: z.enum(EXPENSE_CATEGORIES),
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
});

type FormInput = z.input<typeof schema>;
type FormOutput = z.output<typeof schema>;

interface ExpenseFormProps {
  initial?: Expense;
  onSubmit: (data: FormOutput) => Promise<void>;
  onCancel: () => void;
}

export function ExpenseForm({ initial, onSubmit, onCancel }: ExpenseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: initial?.amount ?? 0,
      category: initial?.category ?? "Miscellaneous",
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
        label="Category"
        options={EXPENSE_CATEGORIES.map((c) => ({ value: c, label: c }))}
        error={errors.category?.message}
        {...register("category")}
      />
      <Input
        label="Date"
        type="date"
        error={errors.date?.message}
        {...register("date")}
      />
      <Textarea
        label="Notes (optional)"
        placeholder="What was this expense for?"
        {...register("notes")}
      />
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" fullWidth onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initial ? "Update" : "Add Expense"}
        </Button>
      </div>
    </form>
  );
}
