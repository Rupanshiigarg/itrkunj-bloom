import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Itrkunj" },
      {
        name: "description",
        content: "Itrkunj privacy policy, customer data protection, and cookie usage guidelines.",
      },
      { property: "og:title", content: "Privacy Policy — Itrkunj" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="border-b bg-secondary/50 px-4 py-14 text-center">
        <h1 className="font-display text-4xl font-semibold text-primary md:text-6xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
          Last Updated: September 2026
        </p>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-16 lg:px-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-display text-2xl font-semibold text-foreground">1. Introduction</h2>
          <p className="mt-2">
            Itrkunj ("we", "our", "us") values your trust. This Privacy Policy outlines how your
            personal data is collected, used, protected, and stored when you visit or make a
            purchase from our website.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold text-foreground">
            2. Information We Collect
          </h2>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-xs text-foreground/90">
            <li>
              <b>Contact Details:</b> Name, email address, phone number, and postal address for
              order fulfillment.
            </li>
            <li>
              <b>Order History:</b> Products purchased, payment status, and delivery notes.
            </li>
            <li>
              <b>Payment Information:</b> Processed securely via PCI-DSS compliant gateways
              (Razorpay). We never store raw credit/debit card numbers or UPI MPINs.
            </li>
            <li>
              <b>Technical Data:</b> Browser type, IP address, and cookie identifiers for analytics
              and security.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold text-foreground">
            3. How We Use Your Information
          </h2>
          <p className="mt-2">
            We use your data solely to fulfill orders, provide shipment tracking via Shiprocket,
            communicate customer support responses, and send optional promotional newsletters if you
            opt-in. We do not sell or rent personal information to third-party data brokers.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold text-foreground">
            4. Data Security & Retention
          </h2>
          <p className="mt-2">
            Your data is stored in enterprise-grade encrypted databases (Supabase Postgres) with
            strict Row Level Security (RLS). You may request deletion or export of your account data
            at any time by contacting hello@itrkunj.com.
          </p>
        </section>
      </div>
    </div>
  );
}
