import { z } from "zod";

/** Pakistani mobile: 03XXXXXXXXX or +923XXXXXXXXX (spaces/dashes allowed). */
export function normalizePkMobile(input: string): string | null {
  const digits = input.replace(/[\s-]/g, "");
  if (/^03\d{9}$/.test(digits)) return "92" + digits.slice(1);
  if (/^\+923\d{9}$/.test(digits)) return digits.slice(1);
  if (/^923\d{9}$/.test(digits)) return digits;
  return null;
}

export const pkPhoneSchema = z
  .string()
  .trim()
  .min(1, "Phone number is required")
  .refine((v) => normalizePkMobile(v) !== null, "Enter a valid Pakistani mobile number, e.g. 0300 1234567");

export const nameSchema = z
  .string()
  .trim()
  .min(2, "Please enter your full name")
  .max(80, "Name must be under 80 characters");

export const emailSchema = z.string().trim().email("Enter a valid email address").max(255);

export const VISIT_TIMES = ["10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"];

export function todayISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

export const visitSchema = z.object({
  name: nameSchema,
  phone: pkPhoneSchema,
  email: emailSchema,
  date: z
    .string()
    .min(1, "Pick a preferred date")
    .refine((v) => v >= todayISO(), "Date can't be in the past"),
  time: z.string().refine((v) => VISIT_TIMES.includes(v), "Pick a preferred time"),
  message: z.string().trim().max(500, "Message must be under 500 characters").optional(),
});

export type VisitInput = z.infer<typeof visitSchema>;
