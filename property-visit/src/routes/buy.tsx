import { createFileRoute } from "@tanstack/react-router";

import { ListingView } from "@/components/site/ListingView";
import { PageHero } from "@/components/site/PageHero";
import { mergeSearch, parseListingSearch, type ListingSearch } from "@/lib/listing";

export const Route = createFileRoute("/buy")({
  validateSearch: (raw: Record<string, unknown>): ListingSearch => parseListingSearch(raw),
  head: () => ({
    meta: [
      { title: "Property for Sale in Pakistan | PROPERTY VISIT" },
      { name: "description", content: "Browse verified houses, apartments, plots and commercial property for sale across Pakistan." },
      { property: "og:title", content: "Property for Sale in Pakistan | PROPERTY VISIT" },
      { property: "og:description", content: "Browse verified houses, apartments, plots and commercial property for sale across Pakistan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BuyPage,
});

function BuyPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <>
      <PageHero eyebrow="Buy" title="Property for Sale" subtitle="Verified houses, apartments, plots and commercial property for sale across Pakistan." />
      <ListingView
        search={search}
        fixedPurpose="buy"
        onChange={(patch) => navigate({ search: (prev) => mergeSearch(prev, patch), replace: true })}
        onReset={() => navigate({ search: {}, replace: true })}
      />
    </>
  );
}
