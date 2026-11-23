import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react";

import { Logo } from "./Logo";
import { CATEGORIES } from "@/data/categories";
import { ALL_CITIES, POPULAR_CITY_SLUGS } from "@/data/locations";
import { SITE } from "@/lib/site";

const QUICK = [
  { to: "/buy", label: "Buy Property" },
  { to: "/rent", label: "Rent Property" },
  { to: "/properties", label: "All Properties" },
] as const;

export function SiteFooter() {
  const cities = POPULAR_CITY_SLUGS.map((s) => ALL_CITIES.find((c) => c.slug === s)!).slice(0, 8);
  return (
    <footer className="bg-navy-gradient text-on-dark-muted">
      <div className="container-page grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.3fr]">
        <div>
          <Logo variant="light" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed">
            Pakistan's premium platform to buy, sell, rent and personally visit verified properties
            — from Karachi to Gilgit.
          </p>
          <div className="mt-6 flex gap-2">
            {[
              { href: SITE.socials.facebook, Icon: Facebook, label: "Facebook" },
              { href: SITE.socials.instagram, Icon: Instagram, label: "Instagram" },
              { href: SITE.socials.linkedin, Icon: Linkedin, label: "LinkedIn" },
              { href: SITE.socials.youtube, Icon: Youtube, label: "YouTube" },
            ].map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid size-9 place-items-center rounded-lg border border-on-dark/15 text-on-dark transition-colors hover:border-gold hover:text-gold"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <FooterCol title="Quick Links">
          {QUICK.map((l) => (
            <Link key={l.to} to={l.to} className="hover:text-gold">
              {l.label}
            </Link>
          ))}
        </FooterCol>

        <FooterCol title="Categories">
          {CATEGORIES.map((c) => (
            <Link
              key={c.type}
              to="/properties"
              search={{ type: c.type }}
              className="hover:text-gold"
            >
              {c.plural}
            </Link>
          ))}
        </FooterCol>

        <FooterCol title="Popular Cities">
          {cities.map((c) => (
            <Link
              key={c.slug}
              to="/properties"
              search={{ city: c.slug }}
              className="hover:text-gold"
            >
              Property in {c.name}
            </Link>
          ))}
        </FooterCol>

        <FooterCol title="Contact">
          <a href={`tel:+${SITE.phone}`} className="flex items-start gap-2.5 hover:text-gold">
            <Phone className="mt-0.5 size-4 shrink-0 text-gold" /> {SITE.phoneDisplay}
          </a>
          <a href={`mailto:${SITE.email}`} className="flex items-start gap-2.5 hover:text-gold">
            <Mail className="mt-0.5 size-4 shrink-0 text-gold" /> {SITE.email}
          </a>
          <span className="flex items-start gap-2.5">
            <MapPin className="mt-0.5 size-4 shrink-0 text-gold" /> {SITE.address}
          </span>
          <span className="text-xs">{SITE.hours}</span>
        </FooterCol>
      </div>
      <div className="border-t border-on-dark/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-xs sm:flex-row">
          <p>© {new Date().getFullYear()} PROPERTY VISIT. All rights reserved.</p>
          <p>Find Your Dream Property.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-on-dark">{title}</h3>
      <div className="flex flex-col gap-2.5 text-sm">{children}</div>
    </div>
  );
}
