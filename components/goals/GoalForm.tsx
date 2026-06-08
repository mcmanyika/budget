"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { positiveAmount, nonNegativeAmount } from "@/lib/validation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { SavingsGoal } from "@/types";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  targetAmount: positiveAmount,
  currentAmount: nonNegativeAmount,
  deadline: z.string().optional(),
});

type FormInput = z.input<typeof schema>;
type FormOutput = z.output<typeof schema>;

interface GoalFormProps {
  initial?: SavingsGoal;
  onSubmit: (data: FormOutput) => Promise<void>;
  onCancel: () => void;
}

export function GoalForm({ initial, onSubmit, onCancel }: GoalFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initial?.name ?? "",
      targetAmount: initial?.targetAmount ?? 0,
      currentAmount: initial?.currentAmount ?? 0,
      deadline: initial?.deadline ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Goal Name"
        placeholder="Emergency Fund, Vacation, etc."
        error={errors.name?.message}
        {...register("name")}
      />
      <Input
        label="Target Amount"
        type="number"
        step="0.01"
        error={errors.targetAmount?.message}
        {...register("targetAmount")}
      />
      <Input
        label="Current Amount"
        type="number"
        step="0.01"
        error={errors.currentAmount?.message}
        {...register("currentAmount")}
      />
      <Input
        label="Deadline (optional)"
        type="date"
        {...register("deadline")}
      />
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" fullWidth onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initial ? "Update" : "Create Goal"}
        </Button>
      </div>
    </form>
  );
}
