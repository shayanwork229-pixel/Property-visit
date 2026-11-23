import { createFileRoute } from "@tanstack/react-router";

import { ListingView } from "@/components/site/ListingView";
import { PageHero } from "@/components/site/PageHero";
import { mergeSearch, parseListingSearch, type ListingSearch } from "@/lib/listing";

export const Route = createFileRoute("/rent")({
  validateSearch: (raw: Record<string, unknown>): ListingSearch => parseListingSearch(raw),
  head: () => ({
    meta: [
      { title: "Property for Rent in Pakistan | PROPERTY VISIT" },
      { name: "description", content: "Find houses, apartments, offices and shops for rent in Karachi, Lahore, Islamabad and more." },
      { property: "og:title", content: "Property for Rent in Pakistan | PROPERTY VISIT" },
      { property: "og:description", content: "Find houses, apartments, offices and shops for rent in Karachi, Lahore, Islamabad and more." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RentPage,
});

function RentPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <>
      <PageHero eyebrow="Rent" title="Property for Rent" subtitle="Houses, apartments, offices, shops and warehouses for rent across Pakistan." />
      <ListingView
        search={search}
        fixedPurpose="rent"
        onChange={(patch) => navigate({ search: (prev) => mergeSearch(prev, patch), replace: true })}
        onReset={() => navigate({ search: {}, replace: true })}
      />
    </>
  );
}
