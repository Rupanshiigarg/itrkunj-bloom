import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShopPage } from "@/components/shop-page";

export const Route = createFileRoute("/thakur-sewa")({
  head: () => ({
    meta: [
      { title: "Thakur Sewa Attars — Itrkunj Pure Devotional Fragrances" },
      {
        name: "description",
        content:
          "Sacred sandalwood, saffron, and temple flower attars crafted for Laddu Gopal, Radha-Krishna, and divine shringar.",
      },
      { property: "og:title", content: "Thakur Sewa Attars — Itrkunj" },
      {
        property: "og:description",
        content: "Sacred sandalwood, saffron, and temple flower attars crafted for divine worship.",
      },
      { property: "og:image", content: "https://itrkunj.com/og-image.jpg" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ThakurSewaRoute,
});

const DEITY_OPTIONS = [
  { id: "all", label: "All Devotional" },
  { id: "Krishna", label: "For Shri Krishna" },
  { id: "Radha Krishna", label: "Radha Krishna Shringar" },
  { id: "Hanuman", label: "For Hanuman Ji" },
];

function ThakurSewaRoute() {
  const [selectedDeity, setSelectedDeity] = useState("all");

  return (
    <div>
      {/* Deity Sub-Navigation Tabs */}
      <div className="border-b bg-card py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 overflow-x-auto px-4 text-xs">
          <span className="mr-2 hidden text-[11px] font-semibold uppercase tracking-widest text-gold-strong sm:inline">
            Seva Purpose:
          </span>
          {DEITY_OPTIONS.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDeity(d.id)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 font-medium transition-all ${
                selectedDeity === d.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary/60 text-foreground/80 hover:bg-secondary"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <ShopPage key={selectedDeity} category="thakur-sewa" initialDeity={selectedDeity} />
    </div>
  );
}
