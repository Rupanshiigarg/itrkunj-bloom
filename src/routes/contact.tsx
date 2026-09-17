import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, MapPin, MessageSquare, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Itrkunj" },
      {
        name: "description",
        content:
          "Connect with the house of Itrkunj in Kannauj. Inquiries for devotional bulk orders, bespoke gifting, and order support.",
      },
      { property: "og:title", content: "Contact Us — Itrkunj" },
      {
        property: "og:description",
        content:
          "Connect with the house of Itrkunj in Kannauj. Inquiries for devotional bulk orders, bespoke gifting, and order support.",
      },
      { property: "og:image", content: "https://itrkunj.com/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    // Simulated submission until Track 7 Admin email webhook
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmitted(true);
    toast.success("Thank you for writing to Itrkunj. Our team will respond shortly.");
    reset();
  };

  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "+917527869894";

  return (
    <div className="min-h-screen bg-background">
      <section className="border-b bg-secondary/50 px-4 py-16 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold-strong">
          Reach Our House
        </p>
        <h1 className="font-display text-5xl font-semibold text-primary md:text-7xl">
          Get in Touch
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Whether you seek guidance on Thakur Sewa fragrances, bulk festive orders, or order
          assistance, we are here to assist you with reverence.
        </p>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          {/* Information Column */}
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-3xl font-semibold text-primary">Direct Inquiries</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                We welcome visits to our Kannauj distillation grounds and inquiries across India.
              </p>
            </div>

            <div className="space-y-6 text-sm">
              <div className="flex items-start gap-4">
                <MapPin className="size-5 shrink-0 text-gold-strong" />
                <div>
                  <p className="font-semibold text-foreground">Distillery & House</p>
                  <p className="text-muted-foreground">
                    Itrkunj Heritage Workshop, Saraimeera, Kannauj, Uttar Pradesh - 209727, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="size-5 shrink-0 text-gold-strong" />
                <div>
                  <p className="font-semibold text-foreground">Email Correspondence</p>
                  <a href="mailto:hello@itrkunj.com" className="text-primary hover:underline">
                    hello@itrkunj.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="size-5 shrink-0 text-gold-strong" />
                <div>
                  <p className="font-semibold text-foreground">Phone & Support</p>
                  <p className="text-muted-foreground">+91 98765 43210 (Mon–Sat, 10am–7pm IST)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MessageSquare className="size-5 shrink-0 text-green-600" />
                <div>
                  <p className="font-semibold text-foreground">Instant WhatsApp</p>
                  <a
                    href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=Jai%20Shree%20Krishna,%20I%20have%20an%20inquiry%20regarding%20Itrkunj`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Chat directly with our fragrance specialist →
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-sm border border-border bg-secondary/40 p-6">
              <p className="font-display text-xl font-semibold text-primary">
                Temple & Gifting Orders
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                For wedding shringars, temple trusts, or corporate hampers, we craft custom engraved
                crystal attardans with bespoke compositions.
              </p>
            </div>
          </div>

          {/* Form Column */}
          <div className="rounded-sm border border-border bg-card p-8 shadow-sm">
            <h3 className="font-display text-2xl font-semibold text-primary">Send a Message</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Please leave your details below and we will get back to you within 24 hours.
            </p>

            {submitted ? (
              <div className="mt-8 rounded-sm bg-secondary p-6 text-center">
                <h4 className="font-display text-xl font-semibold text-primary">
                  Message Received
                </h4>
                <p className="mt-2 text-xs text-muted-foreground">
                  Your inquiry has been passed to our Kannauj office. We will write back to you
                  shortly.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Full Name
                  </label>
                  <input
                    {...register("name")}
                    placeholder="e.g. Rameshwar Sharma"
                    className="mt-1.5 h-10 w-full rounded-sm border border-input bg-background px-3 text-sm outline-none focus:border-primary"
                  />
                  {errors.name && (
                    <p className="mt-1 text-[11px] text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Email Address
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="name@example.com"
                      className="mt-1.5 h-10 w-full rounded-sm border border-input bg-background px-3 text-sm outline-none focus:border-primary"
                    />
                    {errors.email && (
                      <p className="mt-1 text-[11px] text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Phone Number
                    </label>
                    <input
                      {...register("phone")}
                      placeholder="+91 98765 43210"
                      className="mt-1.5 h-10 w-full rounded-sm border border-input bg-background px-3 text-sm outline-none focus:border-primary"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-[11px] text-destructive">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Your Message / Inquiry
                  </label>
                  <textarea
                    {...register("message")}
                    rows={4}
                    placeholder="Tell us about your requirement (e.g. devotional ritual, daily fragrance, bulk order)..."
                    className="mt-1.5 w-full rounded-sm border border-input bg-background p-3 text-sm outline-none focus:border-primary"
                  />
                  {errors.message && (
                    <p className="mt-1 text-[11px] text-destructive">{errors.message.message}</p>
                  )}
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "Sending..." : "Send Message"} <Send className="ml-2 size-4" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
