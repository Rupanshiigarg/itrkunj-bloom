import { createFileRoute } from "@tanstack/react-router";
import { ShopPage } from "@/components/shop-page";
export const Route = createFileRoute("/men")({
  head: () => ({
    meta: [
      { title: "Men's Attars — Itrkunj" },
      { name: "description", content: "Bold oud, musk, vetiver and woody attars for men." },
      { property: "og:title", content: "Men's Attars — Itrkunj" },
      { property: "og:description", content: "Bold oud, musk, vetiver and woody attars for men." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ShopPage category="men" />,
});
