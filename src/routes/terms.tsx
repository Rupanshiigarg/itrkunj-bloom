import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Itrkunj" },
      {
        name: "description",
        content: "Terms of service, usage guidelines, and conditions for purchasing from Itrkunj.",
      },
      { property: "og:title", content: "Terms of Service — Itrkunj" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="border-b bg-secondary/50 px-4 py-14 text-center">
        <h1 className="font-display text-4xl font-semibold text-primary md:text-6xl">
          Terms of Service
        </h1>
        <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
          Last Updated: September 2026
        </p>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-16 lg:px-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-display text-2xl font-semibold text-foreground">1. Overview</h2>
          <p className="mt-2">
            By accessing or ordering from Itrkunj, you agree to be bound by these Terms of Service.
            All products are artisanal compositions distilled in Kannauj, India, subject to natural
            botanical variation.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold text-foreground">
            2. Products & Pricing
          </h2>
          <p className="mt-2">
            Prices for our attars are subject to change without notice. While we strive for complete
            accuracy in displaying colors and bottle presentations, natural distillates may exhibit
            subtle tonal differences between harvest seasons.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold text-foreground">
            3. Orders & Payment
          </h2>
          <p className="mt-2">
            We reserve the right to refuse or cancel any order for reasons including stock
            unavailability, inaccuracies in pricing, or suspected fraudulent activity. Payments are
            processed through authorized gateways or authorized Cash on Delivery (COD).
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold text-foreground">
            4. Limitation of Liability & Jurisdiction
          </h2>
          <p className="mt-2">
            All natural fragrances should be patch-tested on skin prior to full application. Any
            disputes arising in connection with our services shall be subject to the exclusive
            jurisdiction of the courts of Uttar Pradesh, India.
          </p>
        </section>
      </div>
    </div>
  );
}
