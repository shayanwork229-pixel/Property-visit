import { Link } from "@tanstack/react-router";
import { ArrowRight, Menu } from "lucide-react";
import { useState } from "react";

import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/buy", label: "Buy" },
  { to: "/rent", label: "Rent" },
  { to: "/properties", label: "All properties" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="container-page flex h-[72px] items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-navy data-[status=active]:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <Button asChild variant="gold" className="hidden sm:inline-flex">
            <Link to="/properties">
              Explore homes <ArrowRight />
            </Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-navy lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] p-0">
              <SheetHeader className="border-b border-border p-5">
                <SheetTitle asChild>
                  <div>
                    <Logo />
                  </div>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col p-3" aria-label="Mobile">
                {NAV.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    activeOptions={{ exact: item.to === "/" }}
                    className="rounded-lg px-4 py-3 text-base font-medium text-foreground hover:bg-accent data-[status=active]:bg-accent data-[status=active]:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-2 border-t border-border p-5">
                <Button asChild variant="gold" size="lg">
                  <Link to="/properties" onClick={() => setOpen(false)}>
                    Explore homes <ArrowRight />
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
