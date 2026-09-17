import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Droplets,
  HeartHandshake,
  Shield,
  Sparkles,
  Sun,
  ThermometerSnowflake,
} from "lucide-react";
import heroImage from "@/assets/itrkunj-hero.jpg";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/care-guide")({
  head: () => ({
    meta: [
      { title: "Attar Care & Application Rituals — Itrkunj" },
      {
        name: "description",
        content:
          "How to apply pure Indian attar, where to apply on pulse points, optimal storage, and understanding alcohol-free sillage.",
      },
      { property: "og:title", content: "Attar Care & Application Rituals — Itrkunj" },
      {
        property: "og:description",
        content:
          "How to apply pure Indian attar, where to apply on pulse points, optimal storage, and understanding alcohol-free sillage.",
      },
      { property: "og:image", content: "https://itrkunj.com/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CareGuidePage,
});

function CareGuidePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="relative overflow-hidden bg-ink py-20 text-center text-ink-foreground">
        <img
          src={heroImage}
          alt="Traditional attar glass bottle ritual"
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="relative z-10 mx-auto max-w-3xl px-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            The Ritual of Fragrance
          </p>
          <h1 className="mt-3 font-display text-5xl font-semibold sm:text-7xl">
            Attar Care & Application Guide
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-muted sm:text-base">
            Pure Indian attar behaves differently than commercial spray perfumes. Being concentrated
            and 100% alcohol-free, a single drop yields profound sillage that matures with body
            warmth.
          </p>
        </div>
      </section>

      {/* Main Principles */}
      <div className="mx-auto max-w-5xl px-4 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2">
          {/* Rule 1 */}
          <div className="rounded-sm border border-border bg-card p-8 shadow-sm">
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-full bg-secondary text-primary">
              <Droplets className="size-5" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-primary">1. Dab, Never Rub</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Rubbing your wrists together creates friction that crushes delicate volatile notes
              (like top saffron, bergamot, or rosewater). Instead, use the glass rod to gently dab
              the attar onto the skin and let it absorb naturally.
            </p>
          </div>

          {/* Rule 2 */}
          <div className="rounded-sm border border-border bg-card p-8 shadow-sm">
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-full bg-secondary text-primary">
              <Sparkles className="size-5" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-primary">
              2. Target Warm Pulse Points
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Attars activate with blood warmth. Apply to the inner wrists, base of the neck, behind
              the earlobes, and inside the elbows. For clothing, apply a micro-drop inside the cuff
              or lapel (test for staining on sheer silks).
            </p>
          </div>

          {/* Rule 3 */}
          <div className="rounded-sm border border-border bg-card p-8 shadow-sm">
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-full bg-secondary text-primary">
              <ThermometerSnowflake className="size-5" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-primary">
              3. Storage & Longevity
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Store bottles upright in a cool, shaded environment away from direct sunlight and
              heaters. Pure attars do not expire; in fact, vintage compositions rich in sandalwood,
              oud, and amber mellow and become more exquisite over the years.
            </p>
          </div>

          {/* Rule 4 */}
          <div className="rounded-sm border border-border bg-card p-8 shadow-sm">
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-full bg-secondary text-primary">
              <Shield className="size-5" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-primary">
              4. Why 100% Alcohol-Free?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Commercial sprays contain 80–90% denatured ethanol, giving an intense initial burst
              that evaporates rapidly. Pure attar contains zero alcohol: it sits close to the skin,
              leaves a divine aura, and stays safe for sacred temple rituals and sensitive skin.
            </p>
          </div>
        </div>

        {/* Thakur Sewa Application */}
        <div className="mt-16 rounded-sm border border-gold/40 bg-secondary/60 p-8">
          <div className="flex items-start gap-4">
            <HeartHandshake className="size-8 shrink-0 text-gold-strong" />
            <div>
              <h3 className="font-display text-3xl font-semibold text-primary">
                Sacred Thakur Sewa Application
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                In Vaishnav tradition, fragrant shringar is offered to Laddu Gopal and deities with
                deep devotion.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-foreground/90">
                <li>
                  • <b>Mangala Shringar:</b> Dab lightly on the lotus feet and cotton vastras.
                </li>
                <li>
                  • <b>Pushtimarg & Nitya Sewa:</b> Shri Chandan and Vrindavan Pushp are cooled with
                  rosewater on warm days.
                </li>
                <li>
                  • <b>Purity Assured:</b> No artificial chemical fixatives or synthetic animal
                  musks are ever used in Itrkunj formulas.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Button size="lg" asChild>
            <Link to="/shop">Explore Pure Attars</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
