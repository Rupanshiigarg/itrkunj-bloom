import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Clock, HelpCircle, Package, ShieldAlert, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/shipping-returns")({
  head: () => ({
    meta: [
      { title: "Shipping & Return Policy — Itrkunj" },
      {
        name: "description",
        content:
          "Pan-India shipping rates, delivery timelines, tracking procedures via Shiprocket, and our 7-day replacement guarantee.",
      },
      { property: "og:title", content: "Shipping & Return Policy — Itrkunj" },
      {
        property: "og:description",
        content:
          "Pan-India shipping rates, delivery timelines, tracking procedures via Shiprocket, and our 7-day replacement guarantee.",
      },
      { property: "og:image", content: "https://itrkunj.com/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ShippingReturnsPage,
});

function ShippingReturnsPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="border-b bg-secondary/50 px-4 py-16 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold-strong">
          Transparent Service
        </p>
        <h1 className="font-display text-5xl font-semibold text-primary md:text-7xl">
          Shipping & Returns
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Every bottle of Itrkunj is cushioned in shockproof, tamper-evident packaging and
          dispatched from our Kannauj workshop.
        </p>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-16 lg:px-8 space-y-16">
        {/* Shipping Information */}
        <div>
          <div className="flex items-center gap-3 border-b pb-3">
            <Truck className="size-6 text-primary" />
            <h2 className="font-display text-3xl font-semibold text-primary">Shipping Policy</h2>
          </div>

          <div className="mt-6 space-y-4 text-sm text-muted-foreground leading-relaxed">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-sm border border-border p-5 bg-card">
                <p className="font-semibold text-foreground">Standard Delivery Timelines</p>
                <p className="mt-1 text-xs">
                  • <b>Metro Cities:</b> 2 to 4 business days
                  <br />• <b>Rest of India:</b> 4 to 7 business days
                  <br />• Dispatched within 24 hours of order verification.
                </p>
              </div>

              <div className="rounded-sm border border-border p-5 bg-card">
                <p className="font-semibold text-foreground">Shipping Rates</p>
                <p className="mt-1 text-xs">
                  • <b>Orders above ₹1,499:</b> Free shipping all across India.
                  <br />• <b>Orders under ₹1,499:</b> Flat nominal fee of ₹79.
                  <br />• Cash on Delivery (COD) supported pan-India.
                </p>
              </div>
            </div>

            <p>
              Shipments are handled via top-tier couriers (Blue Dart, Delhivery, DTDC, XpressBees)
              via our logistics partner <b>Shiprocket</b>. Once dispatched, you will receive an SMS
              and email containing your Air Waybill (AWB) number and real-time tracking link.
            </p>
          </div>
        </div>

        {/* Returns & Replacement */}
        <div>
          <div className="flex items-center gap-3 border-b pb-3">
            <CheckCircle2 className="size-6 text-primary" />
            <h2 className="font-display text-3xl font-semibold text-primary">
              7-Day Replacement Policy
            </h2>
          </div>

          <div className="mt-6 space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              Due to the devotional, personal, and hygienic nature of artisanal attars, opened and
              tested bottles cannot be accepted for general return. However, your complete
              satisfaction is guaranteed:
            </p>

            <ul className="list-disc pl-5 space-y-2 text-xs text-foreground/90">
              <li>
                <b>Damaged in Transit:</b> If you receive a leaking, broken, or defective bottle,
                please notify us within <b>48 hours</b> with photographs or an unboxing video. We
                will rush a free replacement immediately.
              </li>
              <li>
                <b>Unopened Boxes:</b> Unopened items with seals intact may be returned within
                <b> 7 days</b> of delivery for store credit or refund.
              </li>
              <li>
                <b>Incorrect Product:</b> If you received a different composition than ordered, we
                will promptly ship the correct item and arrange pickup.
              </li>
            </ul>
          </div>
        </div>

        {/* Guest Order Tracking CTA */}
        <div className="rounded-sm border border-border bg-secondary/40 p-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-2xl font-semibold text-primary">
              Have an Existing Order?
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Track live courier milestones with just your Order ID and registered phone number.
            </p>
          </div>
          <Button className="mt-4 sm:mt-0" asChild>
            <Link to="/contact">Need Assistance</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
