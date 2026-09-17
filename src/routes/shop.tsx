import { createFileRoute } from "@tanstack/react-router";
import { ShopPage } from "@/components/shop-page";
export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>) => ({ wishlist: s.wishlist === true }),
  head: () => ({
    meta: [
      { title: "Shop All Attars — Itrkunj" },
      {
        name: "description",
        content: "Discover premium alcohol-free attars for devotion and everyday ritual.",
      },
      { property: "og:title", content: "Shop All Attars — Itrkunj" },
      {
        property: "og:description",
        content: "Discover premium alcohol-free attars for devotion and everyday ritual.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: function ShopRoute() {
    const { wishlist } = Route.useSearch();
    return <ShopPage wishlistOnly={wishlist} />;
  },
});
