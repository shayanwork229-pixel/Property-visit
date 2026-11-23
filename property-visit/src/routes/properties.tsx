import { createFileRoute } from "@tanstack/react-router";

import { ListingView } from "@/components/site/ListingView";
import { PageHero } from "@/components/site/PageHero";
import { mergeSearch, parseListingSearch, type ListingSearch } from "@/lib/listing";

export const Route = createFileRoute("/properties")({
  validateSearch: (raw: Record<string, unknown>): ListingSearch => parseListingSearch(raw),
  head: () => ({
    meta: [
      { title: "All Properties in Pakistan | PROPERTY VISIT" },
      { name: "description", content: "Search every listing on PROPERTY VISIT by city, area, type, price, bedrooms and size." },
      { property: "og:title", content: "All Properties in Pakistan | PROPERTY VISIT" },
      { property: "og:description", content: "Search every listing on PROPERTY VISIT by city, area, type, price, bedrooms and size." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PropertiesPage,
});

function PropertiesPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <>
      <PageHero eyebrow="Explore" title="All Properties" subtitle="Search every listing by city, area, type, price and size." />
      <ListingView
        search={search}

        onChange={(patch) => navigate({ search: (prev) => mergeSearch(prev, patch), replace: true })}
        onReset={() => navigate({ search: {}, replace: true })}
      />
    </>
  );
}
