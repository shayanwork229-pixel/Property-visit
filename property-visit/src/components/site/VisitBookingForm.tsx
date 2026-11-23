import { CalendarCheck, CheckCircle2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Agent, Property } from "@/data/types";
import { whatsappLink } from "@/lib/site";
import { VISIT_TIMES, todayISO, visitSchema, type VisitInput } from "@/lib/validation";

type Errors = Partial<Record<keyof VisitInput, string>>;

export function VisitBookingForm({ property, agent }: { property: Property; agent: Agent }) {
  const [values, setValues] = useState({ name: "", phone: "", email: "", date: "", time: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState<VisitInput | null>(null);

  const set = (k: keyof typeof values) => (v: string) => {
    setValues((s) => ({ ...s, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = visitSchema.safeParse(values);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof VisitInput;
        next[k] ??= issue.message;
      }
      setErrors(next);
      return;
    }
    const d = parsed.data;
    const text = [
      `Assalam-o-Alaikum ${agent.name}, I'd like to schedule a property visit via PROPERTY VISIT.`,
      ``,
      `Property: ${property.title} (${property.id})`,
      `Preferred date: ${d.date} at ${d.time}`,
      `Name: ${d.name}`,
      `Phone: ${d.phone}`,
      `Email: ${d.email}`,
      d.message ? `Message: ${d.message}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    window.open(whatsappLink(agent.phone, text), "_blank", "noopener,noreferrer");
    setDone(d);
  }

  if (done) {
    return (
      <div className="rounded-xl bg-success/10 p-5 text-center">
        <CheckCircle2 className="mx-auto size-10 text-success" />
        <h4 className="mt-3 font-bold text-foreground">Visit request ready</h4>
        <p className="mt-1 text-sm text-muted-foreground">
          We opened WhatsApp with your request for <strong>{done.date}</strong> at <strong>{done.time}</strong>. Send
          the message and {agent.name} will confirm your visit.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => setDone(null)}>
          Book another time
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-3">
      <FormField id="v-name" label="Full name" error={errors.name}>
        <Input id="v-name" value={values.name} onChange={(e) => set("name")(e.target.value)} maxLength={80} autoComplete="name" />
      </FormField>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <FormField id="v-phone" label="Phone" error={errors.phone}>
          <Input
            id="v-phone"
            type="tel"
            placeholder="0300 1234567"
            value={values.phone}
            onChange={(e) => set("phone")(e.target.value)}
            maxLength={16}
            autoComplete="tel"
          />
        </FormField>
        <FormField id="v-email" label="Email" error={errors.email}>
          <Input
            id="v-email"
            type="email"
            value={values.email}
            onChange={(e) => set("email")(e.target.value)}
            maxLength={255}
            autoComplete="email"
          />
        </FormField>
      </div>
      <FormField id="v-prop" label="Property">
        <Input id="v-prop" value={`${property.title} · ${property.id}`} readOnly className="bg-muted" />
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField id="v-date" label="Preferred date" error={errors.date}>
          <Input id="v-date" type="date" min={todayISO()} value={values.date} onChange={(e) => set("date")(e.target.value)} />
        </FormField>
        <FormField id="v-time" label="Preferred time" error={errors.time}>
          <Select value={values.time} onValueChange={set("time")}>
            <SelectTrigger id="v-time" className="w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {VISIT_TIMES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </div>
      <FormField id="v-msg" label="Message (optional)" error={errors.message}>
        <Textarea
          id="v-msg"
          rows={3}
          value={values.message}
          onChange={(e) => set("message")(e.target.value)}
          maxLength={500}
          placeholder="Any questions for the agent?"
        />
      </FormField>
      <Button type="submit" size="lg" className="mt-1 w-full">
        <CalendarCheck /> Request Visit
      </Button>
    </form>
  );
}

export function FormField({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-xs font-semibold text-foreground">
        {label}
      </Label>
      {children}
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
