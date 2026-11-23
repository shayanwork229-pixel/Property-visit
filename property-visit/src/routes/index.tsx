import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Building2, CalendarCheck, MapPin, Search, ShieldCheck } from "lucide-react";
import { useState } from "react";

import heroImg from "@/assets/hero-villa.jpg";
import { HeroSearch } from "@/components/site/HeroSearch";
import { ProjectCard } from "@/components/site/ProjectCard";
import { PropertyCard } from "@/components/site/PropertyCard";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/data/categories";
import { ALL_CITIES, POPULAR_CITY_SLUGS } from "@/data/locations";
import { PROJECTS } from "@/data/projects";
import { PROPERTIES } from "@/data/properties";
import type { Purpose } from "@/data/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PROPERTY VISIT – Find Your Dream Property in Pakistan" },
      {
        name: "description",
        content:
          "Buy, rent, sell and book visits to verified houses, apartments, plots and commercial property in Karachi, Lahore, Islamabad and across Pakistan.",
      },
      { property: "og:title", content: "PROPERTY VISIT – Find Your Dream Property in Pakistan" },
      {
        property: "og:description",
        content: "Explore Pakistan's best houses, apartments, plots and commercial properties — and book a visit.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const popularCities = POPULAR_CITY_SLUGS.map((s) => ALL_CITIES.find((c) => c.slug === s)!);

function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <Featured />
      <HowItWorks />
      <Cities />
      <ProjectsTeaser />
      <SellCta />
    </>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-navy">
      <img
        src={heroImg}
        alt="Luxury modern villa at dusk"
        className="absolute inset-0 -z-10 size-full object-cover"
        fetchPriority="high"
      />
      <div className="absolute inset-0 -z-10 bg-hero-overlay" />
      <div className="container-page pb-16 pt-20 md:pb-24 md:pt-28">
        <div className="max-w-2xl animate-fade-up">
          <p className="eyebrow flex items-center gap-2">
            <span className="h-px w-8 bg-gold" /> Pakistan's Premium Property Platform
          </p>
          <h1 className="mt-4 font-display text-5xl leading-[1.05] text-on-dark md:text-7xl">
            Find Your Dream <span className="text-gold">Property.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-on-dark-muted">
            Explore Pakistan's best houses, apartments, plots and commercial properties.
          </p>
        </div>

        <div className="mt-10 animate-fade-up [animation-delay:150ms]">
          <HeroSearch />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2 animate-fade-up [animation-delay:300ms]">
          <span className="mr-1 text-sm font-semibold text-on-dark">Popular cities:</span>
          {popularCities.map((c) => (
            <Link
              key={c.slug}
              to="/properties"
              search={{ city: c.slug }}
              className="rounded-full border border-on-dark/25 bg-on-dark/10 px-3.5 py-1.5 text-sm font-medium text-on-dark backdrop-blur transition-colors hover:border-gold hover:bg-gold hover:text-gold-foreground"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-2 font-display text-3xl text-navy md:text-4xl">{title}</h2>
        {subtitle && <p className="mt-2 max-w-xl text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function Categories() {
  return (
    <section className="container-page py-20">
      <SectionHeading
        eyebrow="Browse by category"
        title="What are you looking for?"
        subtitle="From family homes to warehouses — every property type in one place."
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {CATEGORIES.map((c) => {
          const count = PROPERTIES.filter((p) => p.type === c.type).length;
          return (
            <Link
              key={c.type}
              to="/properties"
              search={{ type: c.type }}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl shadow-card sm:aspect-[4/3]"
            >
              <img
                src={c.image}
                alt={c.plural}
                loading="lazy"
                className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-card-fade" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
                <div>
                  <h3 className="font-bold text-on-dark">{c.plural}</h3>
                  <p className="text-xs text-on-dark-muted">
                    {count} {count === 1 ? "listing" : "listings"}
                  </p>
                </div>
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-on-dark/15 text-on-dark backdrop-blur transition-colors group-hover:bg-gold group-hover:text-gold-foreground">
                  <ArrowRight className="size-4" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function Featured() {
  const [purpose, setPurpose] = useState<Purpose>("buy");
  const list = PROPERTIES.filter((p) => p.featured && p.purpose === purpose).slice(0, 6);
  return (
    <section className="bg-surface py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="Handpicked"
          title="Featured properties"
          subtitle="Verified listings from trusted agents across Pakistan."
          action={
            <div className="flex items-center gap-3">
              <div className="flex gap-1 rounded-xl bg-background p-1 shadow-card">
                {(["buy", "rent"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPurpose(p)}
                    className={cn(
                      "rounded-lg px-4 py-2 text-sm font-bold transition-colors",
                      purpose === p ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-navy",
                    )}
                  >
                    For {p === "buy" ? "Sale" : "Rent"}
                  </button>
                ))}
              </div>
              <Button asChild variant="outline" className="hidden md:inline-flex">
                <Link to={purpose === "buy" ? "/buy" : "/rent"}>
                  View all <ArrowRight />
                </Link>
              </Button>
            </div>
          }
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
        <div className="mt-10 text-center md:hidden">
          <Button asChild variant="outline" size="lg">
            <Link to={purpose === "buy" ? "/buy" : "/rent"}>
              View all <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { Icon: Search, title: "Search & shortlist", text: "Filter by city, area, budget and size. Save favourites and compare up to 3 side by side." },
    { Icon: CalendarCheck, title: "Schedule a visit", text: "Pick a date and time that suits you. The agent confirms directly on WhatsApp." },
    { Icon: ShieldCheck, title: "Visit with confidence", text: "See verified properties in person with trusted agents before you decide." },
  ];
  return (
    <section className="relative overflow-hidden bg-navy-gradient py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-2 font-display text-3xl text-on-dark md:text-4xl">From search to site visit in 3 steps</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map(({ Icon, title, text }, i) => (
            <div key={title} className="rounded-2xl border border-on-dark/10 bg-on-dark/5 p-7 backdrop-blur">
              <div className="flex items-center justify-between">
                <span className="grid size-12 place-items-center rounded-xl bg-gold-gradient text-gold-foreground">
                  <Icon className="size-6" />
                </span>
                <span className="font-display text-5xl text-on-dark/15">0{i + 1}</span>
              </div>
              <h3 className="mt-5 text-lg font-bold text-on-dark">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-on-dark-muted">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cities() {
  return (
    <section className="container-page py-20">
      <SectionHeading eyebrow="Explore Pakistan" title="Property by city" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {popularCities.map((c) => {
          const count = PROPERTIES.filter((p) => p.citySlug === c.slug).length;
          return (
            <Link
              key={c.slug}
              to="/properties"
              search={{ city: c.slug }}
              className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary hover:shadow-card"
            >
              <span className="grid size-10 place-items-center rounded-lg bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <MapPin className="size-5" />
              </span>
              <span>
                <span className="block font-bold text-foreground">{c.name}</span>
                <span className="text-xs text-muted-foreground">
                  {count} {count === 1 ? "property" : "properties"}
                </span>
              </span>
            </Link>
          );
        })}
        <Link
          to="/properties"
          className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 p-4 text-sm font-bold text-primary hover:bg-accent"
        >
          All locations <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}

function ProjectsTeaser() {
  return (
    <section className="bg-surface py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="New developments"
          title="Featured projects"
          action={
            <Button asChild variant="outline">
              <Link to="/projects">
                All projects <ArrowRight />
              </Link>
            </Button>
          }
        />
        <div className="grid gap-6 md:grid-cols-2">
          {PROJECTS.slice(0, 2).map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SellCta() {
  return (
    <section className="container-page py-20">
      <div className="relative overflow-hidden rounded-3xl bg-navy-gradient p-8 shadow-elevated md:p-14">
        <div className="absolute -right-20 -top-20 size-72 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="eyebrow">For owners & agents</p>
            <h2 className="mt-2 font-display text-3xl text-on-dark md:text-4xl">Selling or renting out a property?</h2>
            <p className="mt-3 max-w-lg text-on-dark-muted">
              Reach serious buyers and tenants across Pakistan. Get your listing verified and receive visit requests directly.
            </p>
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-on-dark">
              {["Verified badge", "Visit bookings", "WhatsApp leads"].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <BadgeCheck className="size-4 text-gold" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <Button asChild variant="gold" size="xl">
              <Link to="/sell">
                <Building2 /> List your property
              </Link>
            </Button>
            <Button asChild variant="on-dark" size="xl">
              <Link to="/agents">Talk to an agent</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
