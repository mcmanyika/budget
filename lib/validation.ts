import { z } from "zod";

export const positiveAmount = z
  .union([z.string(), z.number()])
  .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
  .pipe(z.number().positive("Amount must be greater than 0"));

export const nonNegativeAmount = z
  .union([z.string(), z.number()])
  .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
  .pipe(z.number().min(0, "Amount cannot be negative"));
