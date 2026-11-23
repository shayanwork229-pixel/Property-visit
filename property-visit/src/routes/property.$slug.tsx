import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import {
  BadgeCheck,
  Bath,
  BedDouble,
  CalendarDays,
  Check,
  ChevronRight,
  Hash,
  Home,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Ruler,
  Star,
  Tag,
} from "lucide-react";
import { useState } from "react";

import { PropertyCard } from "@/components/site/PropertyCard";
import { CompareButton, FavoriteButton } from "@/components/site/SaveButtons";
import { VisitBookingForm } from "@/components/site/VisitBookingForm";
import { Button } from "@/components/ui/button";
import { findAgent } from "@/data/agents";
import { categoryLabel } from "@/data/categories";
import { findCity } from "@/data/locations";
import { findProperty, similarProperties } from "@/data/properties";
import { formatDate, formatPKR, formatPKRFull, formatSize, toSqft } from "@/lib/format";
import { whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/property/$slug")({
  loader: ({ params }) => {
    const property = findProperty(params.slug);
    if (!property) throw notFound();
    return { property };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.property;
    if (!p) {
      return { meta: [{ title: "Property not found | PROPERTY VISIT" }, { name: "robots", content: "noindex" }] };
    }
    const city = findCity(p.citySlug)?.name ?? "";
    const title = `${p.title} – ${p.area}, ${city} | PROPERTY VISIT`;
    const desc = `${formatPKR(p.price, p.purpose)} · ${formatSize(p.size.value, p.size.unit)} ${categoryLabel(p.type).toLowerCase()} for ${p.purpose === "buy" ? "sale" : "rent"} in ${p.block}, ${p.area}, ${city}. Schedule a visit today.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="font-display text-4xl text-navy">Property not found</h1>
      <p className="mt-2 text-muted-foreground">This listing may have been sold, rented or removed.</p>
      <Button asChild className="mt-6">
        <Link to="/properties">Browse properties</Link>
      </Button>
    </div>
  ),
  component: PropertyDetail,
});

function PropertyDetail() {
  const { property: p } = Route.useLoaderData();
  const [active, setActive] = useState(0);
  const city = findCity(p.citySlug);
  const agent = findAgent(p.agentId)!;
  const similar = similarProperties(p);
  const { lat, lng } = p.coords;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.012},${lat - 0.007},${lng + 0.012},${lat + 0.007}&layer=mapnik&marker=${lat},${lng}`;
  const waText = `Assalam-o-Alaikum ${agent.name}, I'm interested in "${p.title}" (${p.id}) listed on PROPERTY VISIT.`;

  const facts = [
    p.beds > 0 && { Icon: BedDouble, label: "Bedrooms", value: p.beds },
    p.baths > 0 && { Icon: Bath, label: "Bathrooms", value: p.baths },
    { Icon: Ruler, label: "Area", value: formatSize(p.size.value, p.size.unit) },
    { Icon: Ruler, label: "Covered (approx.)", value: `${toSqft(p.size.value, p.size.unit).toLocaleString("en-PK")} sq ft` },
    { Icon: Home, label: "Type", value: categoryLabel(p.type) },
    { Icon: Tag, label: "Purpose", value: p.purpose === "buy" ? "For Sale" : "For Rent" },
    { Icon: CalendarDays, label: "Listed", value: formatDate(p.listedAt) },
    { Icon: Hash, label: "Listing ID", value: p.id },
  ].filter(Boolean) as { Icon: typeof Home; label: string; value: string | number }[];

  return (
    <div className="bg-surface pb-20">
      <div className="container-page pt-6">
        <nav className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="size-3" />
          <Link to={p.purpose === "buy" ? "/buy" : "/rent"} className="hover:text-primary">
            {p.purpose === "buy" ? "Buy" : "Rent"}
          </Link>
          <ChevronRight className="size-3" />
          <Link to="/properties" search={{ city: p.citySlug }} className="hover:text-primary">{city?.name}</Link>
          <ChevronRight className="size-3" />
          <span className="text-foreground">{p.title}</span>
        </nav>

        {/* Gallery */}
        <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_200px]">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted shadow-card">
            <img src={p.images[active]} alt={`${p.title} – photo ${active + 1}`} className="size-full object-cover" />
            <div className="absolute left-4 top-4 flex gap-2">
              {p.featured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-xs font-bold text-gold-foreground">
                  <Star className="size-3 fill-current" /> Featured
                </span>
              )}
              {p.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-success px-3 py-1 text-xs font-bold text-success-foreground">
                  <BadgeCheck className="size-3.5" /> Verified
                </span>
              )}
            </div>
            <span className="absolute bottom-4 right-4 rounded-md bg-navy/80 px-2.5 py-1 text-xs font-semibold text-on-dark">
              {active + 1} / {p.images.length}
            </span>
          </div>
          <div className="flex gap-3 overflow-x-auto lg:flex-col">
            {p.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Show photo ${i + 1}`}
                className={cn(
                  "aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-xl border-2 transition-all lg:w-full",
                  i === active ? "border-primary shadow-glow" : "border-transparent opacity-70 hover:opacity-100",
                )}
              >
                <img src={img} alt="" loading="lazy" className="size-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="flex flex-col gap-6">
            <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-3xl font-extrabold text-primary">{formatPKR(p.price, p.purpose)}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatPKRFull(p.price)}
                    {p.purpose === "rent" && " per month"}
                  </p>
                  <h1 className="mt-3 font-display text-3xl text-navy md:text-4xl">{p.title}</h1>
                  <p className="mt-2 flex items-start gap-1.5 text-muted-foreground">
                    <MapPin className="mt-0.5 size-4 shrink-0" /> {p.address}
                  </p>
                </div>
                <div className="flex gap-2">
                  <FavoriteButton id={p.id} withLabel className="h-10 border border-border px-4" />
                  <CompareButton id={p.id} withLabel className="h-10 border border-border px-4" />
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {facts.map(({ Icon, label, value }) => (
                  <div key={label} className="rounded-xl bg-surface p-3">
                    <Icon className="size-4 text-primary" />
                    <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
                    <p className="text-sm font-bold text-foreground">{value}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm">
                Status:{" "}
                <span className={cn("font-bold", p.status === "Available" ? "text-success" : "text-gold-foreground")}>
                  {p.status}
                </span>
              </p>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h2 className="text-xl font-bold text-navy">Description</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{p.description}</p>
              <h3 className="mt-6 text-lg font-bold text-navy">Features & amenities</h3>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {p.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-sm">
                    <span className="grid size-5 place-items-center rounded-full bg-success/15 text-success">
                      <Check className="size-3" />
                    </span>
                    {a}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-bold text-navy">Location</h2>
                <a
                  href={`https://www.google.com/maps?q=${lat},${lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Open in Google Maps
                </a>
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-4">
                {[
                  ["Province", city?.province.name],
                  ["City", city?.name],
                  ["Area", p.area],
                  ["Society / Block", `${p.society}, ${p.block}`],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs text-muted-foreground">{k}</dt>
                    <dd className="font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-4 aspect-[16/8] overflow-hidden rounded-xl border border-border">
                <iframe title={`Map of ${p.title}`} src={mapSrc} className="size-full" loading="lazy" />
              </div>
            </section>
          </div>

          <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
            <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-center gap-4">
                <span className="grid size-14 place-items-center rounded-full bg-navy-gradient text-lg font-bold text-on-dark">
                  {agent.name.split(" ").map((s) => s[0]).join("")}
                </span>
                <div>
                  <p className="font-bold text-foreground">{agent.name}</p>
                  <p className="text-sm text-muted-foreground">{agent.agency}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs">
                    <Star className="size-3.5 fill-gold text-gold" /> {agent.rating} · {agent.reviews} reviews
                  </p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <Button asChild variant="navy">
                  <a href={`tel:+${agent.phone}`}>
                    <Phone /> Call
                  </a>
                </Button>
                <Button asChild variant="success">
                  <a href={whatsappLink(agent.phone, waText)} target="_blank" rel="noreferrer">
                    <MessageCircle /> WhatsApp
                  </a>
                </Button>
                <Button asChild variant="outline" className="col-span-2">
                  <a href={`mailto:${agent.email}?subject=${encodeURIComponent(`Enquiry: ${p.title} (${p.id})`)}`}>
                    <Mail /> Contact Seller by Email
                  </a>
                </Button>
              </div>
            </section>

            <section id="visit" className="scroll-mt-24 rounded-2xl border-2 border-primary/20 bg-card p-6 shadow-card">
              <p className="eyebrow">Property Visit</p>
              <h2 className="mt-1 text-xl font-bold text-navy">Schedule a visit</h2>
              <p className="mb-4 mt-1 text-sm text-muted-foreground">Pick a time and see this property in person.</p>
              <VisitBookingForm property={p} agent={agent} />
            </section>
          </aside>
        </div>

        {similar.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-3xl text-navy">Similar properties</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((s) => (
                <PropertyCard key={s.id} property={s} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
