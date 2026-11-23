import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Logo({ variant = "dark", className }: { variant?: "dark" | "light"; className?: string }) {
  const light = variant === "light";
  return (
    <Link to="/" className={cn("flex items-center gap-2.5", className)} aria-label="PROPERTY VISIT home">
      <span className="relative grid size-10 place-items-center rounded-xl bg-navy-gradient shadow-glow">
        <svg viewBox="0 0 24 24" className="size-5 text-on-dark" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M3 11.5 12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 10v9h12v-9" strokeLinejoin="round" />
        </svg>
        <span className="absolute -right-0.5 -top-0.5 size-3 rounded-full border-2 border-background bg-gold" />
      </span>
      <span className="leading-none">
        <span className={cn("block text-[15px] font-extrabold tracking-[0.12em]", light ? "text-on-dark" : "text-navy")}>
          PROPERTY
        </span>
        <span className={cn("block text-[11px] font-bold tracking-[0.42em]", light ? "text-gold" : "text-primary")}>
          VISIT
        </span>
      </span>
    </Link>
  );
}
