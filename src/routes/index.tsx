import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import heroImage from "@/assets/itrkunj-hero.jpg";
import sewaImage from "@/assets/thakur-sewa.jpg";
import duoImage from "@/assets/attar-duo.jpg";
import { products } from "@/lib/catalog";
import { ProductCard, Newsletter } from "@/components/site";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Itrkunj — Pure Indian Attars & Thakur Sewa Fragrances" },
      {
        name: "description",
        content:
          "Pure, alcohol-free hydro-distilled attars crafted in Kannauj. Sacred devotional fragrances for Thakur Sewa, personal worship, and daily elegance.",
      },
      { property: "og:title", content: "Itrkunj — Pure Indian Attars & Thakur Sewa Fragrances" },
      {
        property: "og:description",
        content:
          "Pure, alcohol-free hydro-distilled attars crafted in Kannauj. Sacred devotional fragrances for Thakur Sewa, personal worship, and daily elegance.",
      },
      { property: "og:image", content: "https://itrkunj.com/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const testimonials = [
  {
    name: "Acharya Raghavendra Ji",
    location: "Vrindavan Dham",
    quote:
      "Shri Chandan attar is truly pure and divine. Perfect for Thakurji's daily mangala shringar and sewa.",
    rating: 5,
  },
  {
    name: "Devendra Sharma",
    location: "Mathura",
    quote:
      "The fragrance of Vrindavan Pushp lingers softly through the entire day. No synthetic alcohol harshness.",
    rating: 5,
  },
  {
    name: "Vikramaditya Roy",
    location: "New Delhi",
    quote:
      "Oud-e-Shahi is unmatched. Deep, sophisticated, and regal. Truly speaks of genuine Kannauj artisanship.",
    rating: 5,
  },
  {
    name: "Sunaina Singhania",
    location: "Jaipur",
    quote:
      "Gulab Noor is the closest scent to fresh Kannauj damask roses in dew. Exceptional longevity on skin.",
    rating: 5,
  },
  {
    name: "Pt. Rameshwar Shastri",
    location: "Ayodhya",
    quote:
      "Kesar Tilak brings genuine temple warmth and sacredness into puja rituals. Highly recommended.",
    rating: 5,
  },
  {
    name: "Ananya Deshmukh",
    location: "Mumbai",
    quote:
      "Packaging, purity, and presentation are royal. Itrkunj is now my go-to house for all family gifting.",
    rating: 5,
  },
];

function HomePage() {
  const featured = products
    .filter((p) => p.badge && ["Bestseller", "Most Loved", "Iconic", "New"].includes(p.badge))
    .slice(0, 4);

  const thakurSewaProducts = products.filter((p) => p.category === "thakur-sewa").slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* ── 1. Hero Section ────────────────────────────────────────── */}
      <section className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden bg-ink text-ink-foreground">
        <img
          src={heroImage}
          alt="Itrkunj Attar artisan composition in Kannauj"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-45"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 py-24 text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold animate-fade-in">
            <Sparkles className="size-3.5" /> Kannauj · Est. 2018 · Pure Hydro-Distillate
          </p>

          <h1 className="font-display text-5xl font-semibold tracking-tight text-ink-foreground sm:text-7xl lg:text-8xl">
            Attars of Devotion
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
            Alcohol-free, small-batch attars distilled with slow patience in traditional copper
            degs. Composed for sacred Thakur Sewa, festive darshans, and intimate daily rituals.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="h-12 px-8 font-semibold tracking-wide" asChild>
              <Link to="/shop">
                Explore Collection <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 border-ink-line bg-ink/50 px-8 text-ink-foreground backdrop-blur hover:bg-ink hover:text-white"
              asChild
            >
              <Link to="/thakur-sewa">Thakur Sewa Collection</Link>
            </Button>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-xs tracking-widest text-ink-muted opacity-70">
          ↓ SCROLL TO DISCOVER
        </div>
      </section>

      {/* ── 2. Trust Bar ───────────────────────────────────────────── */}
      <section className="border-y border-border bg-secondary/70 py-6">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 text-center sm:grid-cols-4 lg:px-8">
          <div className="flex flex-col items-center">
            <span className="mb-2 text-xl">🌿</span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
              100% Alcohol-Free
            </h2>
            <p className="mt-1 text-[11px] text-muted-foreground">Skin-safe & sacred for worship</p>
          </div>
          <div className="flex flex-col items-center">
            <ShieldCheck className="mb-2 size-5 text-gold-strong" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Kannauj Deg-Bhapka
            </h2>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Centuries-old hydro-distillation
            </p>
          </div>
          <div className="flex flex-col items-center">
            <Truck className="mb-2 size-5 text-gold-strong" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Free Shipping ₹1,499+
            </h2>
            <p className="mt-1 text-[11px] text-muted-foreground">Pan-India insured delivery</p>
          </div>
          <div className="flex flex-col items-center">
            <RotateCcw className="mb-2 size-5 text-gold-strong" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
              7-Day Assurance
            </h2>
            <p className="mt-1 text-[11px] text-muted-foreground">Prompt replacement guarantee</p>
          </div>
        </div>
      </section>

      {/* ── 3. Featured Products ────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="mb-12 flex flex-col items-baseline justify-between gap-4 border-b pb-6 sm:flex-row">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-strong">
              Curated Masterpieces
            </p>
            <h2 className="mt-1 font-display text-4xl font-semibold text-primary sm:text-5xl">
              Our Most Beloved
            </h2>
          </div>
          <Link
            to="/shop"
            className="story-link text-xs font-semibold uppercase tracking-widest text-primary"
          >
            View All Fragrances →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ── 4. Category Teasers ─────────────────────────────────────── */}
      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-strong">
              Curations By Purpose
            </p>
            <h2 className="mt-2 font-display text-4xl font-semibold text-primary sm:text-6xl">
              Discover By Collection
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Card 1: Thakur Sewa */}
            <Link
              to="/thakur-sewa"
              className="group relative block aspect-[3/4] overflow-hidden rounded-sm bg-ink"
            >
              <img
                src={sewaImage}
                alt="Thakur Sewa Attars Collection"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:opacity-85"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-ink-foreground">
                <span className="text-[10px] uppercase tracking-[0.25em] text-gold">
                  Devotion & Puja
                </span>
                <h3 className="mt-1 font-display text-3xl font-semibold">Thakur Sewa</h3>
                <p className="mt-2 text-xs text-ink-muted">
                  Pure Mysore sandalwood, saffron & temple flowers for Laddu Gopal & Radha-Krishna.
                </p>
                <span className="mt-4 inline-flex items-center text-xs font-semibold uppercase tracking-wider text-gold group-hover:underline">
                  Explore Sacred Attars →
                </span>
              </div>
            </Link>

            {/* Card 2: Men's Attars */}
            <Link
              to="/men"
              className="group relative block aspect-[3/4] overflow-hidden rounded-sm bg-ink"
            >
              <img
                src={duoImage}
                alt="Men's Regal Attars"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:opacity-85"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-ink-foreground">
                <span className="text-[10px] uppercase tracking-[0.25em] text-gold">
                  Regal & Woody
                </span>
                <h3 className="mt-1 font-display text-3xl font-semibold">Men's Attars</h3>
                <p className="mt-2 text-xs text-ink-muted">
                  Smoked oudh, aged deer-free musk, and pure roots of vetiver (Khus).
                </p>
                <span className="mt-4 inline-flex items-center text-xs font-semibold uppercase tracking-wider text-gold group-hover:underline">
                  Explore Men's Range →
                </span>
              </div>
            </Link>

            {/* Card 3: Women's Attars */}
            <Link
              to="/women"
              className="group relative block aspect-[3/4] overflow-hidden rounded-sm bg-ink"
            >
              <img
                src={heroImage}
                alt="Women's Floral Attars"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:opacity-85"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-ink-foreground">
                <span className="text-[10px] uppercase tracking-[0.25em] text-gold">
                  Grace & Blooms
                </span>
                <h3 className="mt-1 font-display text-3xl font-semibold">Women's Attars</h3>
                <p className="mt-2 text-xs text-ink-muted">
                  Moonlit Mogra, fresh morning Damask roses, and honeyed saffron threads.
                </p>
                <span className="mt-4 inline-flex items-center text-xs font-semibold uppercase tracking-wider text-gold group-hover:underline">
                  Explore Florals →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. Brand Story Snippet ──────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-muted shadow-2xl">
            <img
              src={duoImage}
              alt="Traditional deg and bhapka distillation bottles"
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute bottom-4 right-4 rounded bg-background/90 p-4 text-xs backdrop-blur">
              <p className="font-display font-semibold text-primary">Handcrafted in Kannauj</p>
              <p className="text-muted-foreground">The Perfume Capital of India</p>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-strong">
              Centuries of Fragrance Heritage
            </p>
            <h2 className="font-display text-4xl font-semibold leading-tight text-primary sm:text-5xl">
              Where hydro-distillation is an act of prayer.
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Unlike industrial alcohol-based perfumes that evaporate into harsh fumes, true Indian
              attars are distilled drop-by-drop inside wood-fired copper cauldrons (Degs) and gently
              absorbed into pure Mysore sandalwood oil.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              At Itrkunj, our artisans hold ancestral formulations passed down through generations.
              Every bottle is hand-poured, matured in camel-hide kupis, and consecrated with
              reverence for divine rituals and mindful daily wear.
            </p>
            <div className="pt-2">
              <Button variant="outline" asChild>
                <Link to="/about">
                  Read Our Complete Story <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Testimonials Marquee ─────────────────────────────────── */}
      <section className="overflow-hidden border-y border-border bg-secondary/50 py-16">
        <div className="mx-auto mb-10 max-w-7xl px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-strong">
            Words of Devotees & Connoisseurs
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-primary sm:text-4xl">
            Cherished Across India
          </h2>
        </div>

        <div className="flex w-max animate-marquee gap-6">
          {[...testimonials, ...testimonials].map((t, idx) => (
            <div
              key={idx}
              className="w-80 shrink-0 rounded-sm border border-border/80 bg-card p-6 shadow-sm"
            >
              <div className="flex text-gold">{"★".repeat(t.rating)}</div>
              <p className="mt-3 text-sm italic text-foreground/90">"{t.quote}"</p>
              <div className="mt-4 border-t pt-3">
                <p className="text-xs font-bold text-primary">{t.name}</p>
                <p className="text-[11px] text-muted-foreground">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. Thakur Sewa Spotlight ────────────────────────────────── */}
      <section className="bg-ink py-24 text-ink-foreground">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              Specialized Vaishnav Collection
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold sm:text-6xl">
              For the Darshan That Deserves the Finest Itr
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted sm:text-base">
              In devotional seva, fragrance is offered as the highest shringar. Our Thakur Sewa
              collection is strictly 100% alcohol-free, vegetarian, and prepared with sacred intent.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {thakurSewaProducts.map((p) => (
              <div
                key={p.id}
                className="group rounded-sm border border-ink-line bg-ink/60 p-5 transition-all hover:border-gold/60"
              >
                <div className="aspect-[4/5] overflow-hidden bg-black/40">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="pt-4">
                  {p.deity && (
                    <span className="text-[10px] uppercase tracking-widest text-gold">
                      Seva for: {p.deity}
                    </span>
                  )}
                  <h4 className="mt-1 font-display text-2xl font-semibold text-ink-foreground">
                    {p.name}
                  </h4>
                  <p className="mt-1 line-clamp-2 text-xs text-ink-muted">{p.subtitle}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-semibold text-gold">₹{p.price}</span>
                    <Button size="sm" variant="outline" className="text-xs" asChild>
                      <Link to="/product/$slug" params={{ slug: p.slug }}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" className="bg-gold text-ink hover:bg-gold/90 font-semibold" asChild>
              <Link to="/thakur-sewa">
                View All Thakur Sewa Attars <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── 8. Newsletter Section ───────────────────────────────────── */}
      <section className="border-t border-border bg-background py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-strong">
            The Inner Circle
          </p>
          <h2 className="mt-2 font-display text-4xl font-semibold text-primary sm:text-5xl">
            Join the Itrkunj Circle
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground">
            Receive seasonal small-batch distillations, sacred festival release previews, and quiet
            reflections on the ritual of fragrance.
          </p>
          <Newsletter />
        </div>
      </section>
    </div>
  );
}
