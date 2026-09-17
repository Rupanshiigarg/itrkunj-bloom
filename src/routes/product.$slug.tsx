import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  Check,
  Info,
  MapPin,
  Sparkles,
} from "lucide-react";
import { formatPrice } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/site";
import { useStore } from "@/lib/store";
import {
  getProductBySlug,
  checkPincodeServiceability,
  writeProductReview,
} from "@/lib/catalog.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ params }) => {
    const data = await getProductBySlug({ data: { slug: params.slug } });
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    const minPrice = loaderData ? loaderData.variantPrices[3] || 645 : 645;
    const maxPrice = loaderData ? loaderData.variantPrices[12] || 2320 : 2320;

    return {
      meta: [
        { title: p ? `${p.name} Attar — Pure Kannauj Composition · Itrkunj` : "Attar — Itrkunj" },
        { name: "description", content: p?.subtitle || "Pure, alcohol-free Indian attar." },
        { property: "og:title", content: p ? `${p.name} Attar — Itrkunj` : "Attar — Itrkunj" },
        { property: "og:description", content: p?.subtitle || "Pure, alcohol-free Indian attar." },
        { property: "og:image", content: p ? p.image : "https://itrkunj.com/og-image.jpg" },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: p?.name,
            description: p?.subtitle,
            image: [p?.image, p?.hoverImage],
            brand: { "@type": "Brand", name: "Itrkunj" },
            offers: {
              "@type": "AggregateOffer",
              priceCurrency: "INR",
              lowPrice: minPrice,
              highPrice: maxPrice,
              offerCount: p?.sizes.length || 3,
              availability: "https://schema.org/InStock",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: p?.rating || 4.9,
              reviewCount: p?.reviews || 128,
            },
          }),
        },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product: p, related, stockMap, variantPrices } = Route.useLoaderData();
  const { add } = useStore();

  const [activeImage, setActiveImage] = useState(p.image);
  const [size, setSize] = useState<number>(p.sizes.includes(6) ? 6 : p.sizes[0] || 3);
  const [qty, setQty] = useState(1);

  // Sticky CTA bar detector
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Pincode serviceability widget
  const [pincode, setPincode] = useState("");
  const [checkingPin, setCheckingPin] = useState(false);
  const [pincodeResult, setPincodeResult] = useState<{
    checked: boolean;
    serviceable: boolean;
    message: string;
  }>({ checked: false, serviceable: false, message: "" });

  // Review submission state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Observer for sticky bottom action
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBar(!entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    if (heroSectionRef.current) {
      observer.observe(heroSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const price = variantPrices[size] || p.price;
  const currentStock = stockMap[size] ?? 10;
  const isLowStock = currentStock > 0 && currentStock <= 5;
  const isOutOfStock = currentStock === 0;

  const handlePincodeCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode) return;
    setCheckingPin(true);
    const res = await checkPincodeServiceability({ data: { pincode } });
    setPincodeResult({ checked: true, serviceable: res.serviceable, message: res.message });
    setCheckingPin(false);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      const res = await writeProductReview({
        data: {
          productId: p.id,
          rating: reviewRating,
          title: reviewTitle,
          body: reviewBody,
        },
      });
      toast.success(res.message);
      setReviewTitle("");
      setReviewBody("");
    } catch {
      toast.error("Please sign in to submit a review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Breadcrumb */}
      <p className="mb-6 text-xs text-muted-foreground">
        <Link to="/shop" className="hover:underline">
          Shop
        </Link>{" "}
        /{" "}
        <Link to="/shop" search={{ category: p.category }} className="capitalize hover:underline">
          {p.category.replace("-", " ")}
        </Link>{" "}
        / <span className="text-foreground">{p.name}</span>
      </p>

      {/* Main PDP Grid */}
      <div ref={heroSectionRef} className="grid gap-12 lg:grid-cols-[1.15fr_.85fr]">
        {/* Gallery */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[80px_1fr]">
          <div className="flex gap-2 sm:flex-col">
            {[p.image, p.hoverImage].map((imgUrl, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(imgUrl)}
                className={`aspect-square w-16 overflow-hidden rounded-sm border sm:w-full ${
                  activeImage === imgUrl ? "border-primary ring-1 ring-primary" : "border-border"
                }`}
              >
                <img src={imgUrl} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>

          <div className="group relative aspect-[4/5] overflow-hidden rounded-sm bg-muted shadow-sm">
            <img
              src={activeImage}
              alt={`${p.name} pure attar bottle`}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {p.badge && (
              <span className="absolute left-4 top-4 rounded bg-background/95 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary shadow-sm backdrop-blur">
                {p.badge}
              </span>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-strong">
            {p.deity ? `Devotional Seva for ${p.deity}` : "Kannauj Hydro-Distillate"}
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-primary sm:text-6xl">
            {p.name}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.subtitle}</p>

          {/* Ratings & Reviews */}
          <div className="mt-4 flex items-center gap-2 text-xs text-gold-strong">
            <span>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="inline size-4 fill-gold text-gold" />
              ))}
            </span>
            <span className="font-semibold text-foreground">{p.rating}</span>
            <span className="text-muted-foreground">({p.reviews} verified reviews)</span>
          </div>

          {/* Pricing */}
          <div className="mt-6 flex items-baseline gap-3">
            <p className="font-display text-3xl font-semibold text-foreground">
              {formatPrice(price)}
            </p>
            <span className="text-xs text-muted-foreground">Incl. of all taxes</span>
          </div>

          {/* Size Selector + Tooltip */}
          <div className="mt-6 border-t pt-6">
            <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
              <span>Select Quantity (Bottle Size)</span>
              <span className="text-[11px] text-muted-foreground">
                3ml ≈ 30 days | 6ml ≈ 60 days
              </span>
            </div>
            <div className="flex gap-2">
              {p.sizes.map((s) => (
                <Button
                  key={s}
                  variant={size === s ? "default" : "outline"}
                  onClick={() => setSize(s)}
                  className="px-5 font-semibold"
                >
                  {s} ml
                </Button>
              ))}
            </div>
          </div>

          {/* Stock Notification */}
          <div className="mt-4 text-xs font-medium">
            {isOutOfStock ? (
              <span className="text-destructive">Currently Out of Stock</span>
            ) : isLowStock ? (
              <span className="text-amber-600">
                ⚡ Only {currentStock} bottles left in this batch
              </span>
            ) : (
              <span className="text-green-600">✓ In Stock (Fresh Distillation)</span>
            )}
          </div>

          {/* Add to Bag Stepper */}
          <div className="mt-6 grid grid-cols-[110px_1fr] gap-3">
            <div className="flex items-center justify-between rounded-sm border border-input bg-background">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQty(Math.max(1, qty - 1))}
                aria-label="Decrease quantity"
              >
                <Minus className="size-4" />
              </Button>
              <span className="text-sm font-semibold">{qty}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQty(qty + 1)}
                aria-label="Increase quantity"
              >
                <Plus className="size-4" />
              </Button>
            </div>
            <Button
              size="lg"
              disabled={isOutOfStock}
              onClick={() => {
                for (let i = 0; i < qty; i++) add(p.id, size);
              }}
              className="h-12 text-sm font-semibold tracking-wide"
            >
              <ShoppingBag className="mr-2 size-4" /> Add to bag · {formatPrice(price * qty)}
            </Button>
          </div>

          {/* Pincode Serviceability Widget */}
          <div className="mt-6 rounded-sm border border-border bg-secondary/30 p-4">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-foreground">
              <MapPin className="size-3.5 text-gold-strong" /> Check Delivery Serviceability
            </p>
            <form onSubmit={handlePincodeCheck} className="mt-2 flex gap-2">
              <input
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                placeholder="Enter 6-digit Pincode"
                className="h-9 w-full rounded-sm border border-input bg-background px-3 text-xs outline-none focus:border-primary"
              />
              <Button type="submit" size="sm" variant="outline" disabled={checkingPin}>
                {checkingPin ? "..." : "Check"}
              </Button>
            </form>
            {pincodeResult.checked && (
              <p
                className={`mt-2 text-xs font-medium ${
                  pincodeResult.serviceable ? "text-green-600" : "text-destructive"
                }`}
              >
                {pincodeResult.message}
              </p>
            )}
          </div>

          {/* Trust Guarantees */}
          <div className="mt-6 grid grid-cols-2 gap-3 border-y py-4 text-xs">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Truck className="size-4 text-gold-strong" /> Free shipping over ₹1,499
            </span>
            <span className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="size-4 text-gold-strong" /> 100% Alcohol-Free Pure Itr
            </span>
          </div>

          {/* Olfactory Pyramid */}
          <div className="mt-8">
            <h2 className="font-display text-2xl font-semibold text-primary">
              The Fragrance Pyramid
            </h2>
            <div className="mt-4 grid gap-2 text-center text-xs">
              <div className="mx-auto w-3/5 rounded-sm bg-secondary p-3">
                <b className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Top Notes
                </b>
                <p className="mt-1 font-semibold text-foreground">{p.notes.top.join(" · ")}</p>
              </div>
              <div className="mx-auto w-4/5 rounded-sm bg-accent p-3">
                <b className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Heart Notes
                </b>
                <p className="mt-1 font-semibold text-foreground">{p.notes.heart.join(" · ")}</p>
              </div>
              <div className="w-full rounded-sm bg-primary p-3 text-primary-foreground">
                <b className="text-[11px] uppercase tracking-wider opacity-80">
                  Base Notes (Mysore Sandalwood & Resins)
                </b>
                <p className="mt-1 font-semibold">{p.notes.base.join(" · ")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="mt-24 border-t pt-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          {/* Left: Star Breakdown */}
          <div>
            <h2 className="font-display text-3xl font-semibold text-primary">Customer Reviews</h2>
            <div className="mt-4 flex items-center gap-3">
              <span className="font-display text-5xl font-bold text-foreground">{p.rating}</span>
              <div>
                <div className="flex text-gold">{"★".repeat(5)}</div>
                <p className="text-xs text-muted-foreground">
                  Based on {p.reviews} verified reviews
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-2 text-xs">
              {[
                { stars: 5, pct: "92%" },
                { stars: 4, pct: "6%" },
                { stars: 3, pct: "2%" },
                { stars: 2, pct: "0%" },
                { stars: 1, pct: "0%" },
              ].map((row) => (
                <div key={row.stars} className="flex items-center gap-3">
                  <span className="w-8 text-muted-foreground">{row.stars} ★</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full bg-gold" style={{ width: row.pct }} />
                  </div>
                  <span className="w-8 text-right text-muted-foreground">{row.pct}</span>
                </div>
              ))}
            </div>

            {/* Submit Review Form */}
            <form
              onSubmit={handleReviewSubmit}
              className="mt-8 rounded-sm border border-border p-6 bg-card"
            >
              <h3 className="font-display text-xl font-semibold text-primary">Write a Review</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Share your experience of this fragrance on skin or in puja.
              </p>

              <div className="mt-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Rating
                </label>
                <div className="mt-1 flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className={`text-lg ${star <= reviewRating ? "text-gold" : "text-muted"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Title
                </label>
                <input
                  required
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Divine fragrance for Laddu Gopal"
                  className="mt-1 h-9 w-full rounded-sm border border-input bg-background px-3 text-xs outline-none"
                />
              </div>

              <div className="mt-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Review
                </label>
                <textarea
                  required
                  rows={3}
                  value={reviewBody}
                  onChange={(e) => setReviewBody(e.target.value)}
                  placeholder="Longevity, projection, and devotional experience..."
                  className="mt-1 w-full rounded-sm border border-input bg-background p-3 text-xs outline-none"
                />
              </div>

              <Button type="submit" size="sm" className="mt-4 w-full" disabled={submittingReview}>
                {submittingReview ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          </div>

          {/* Right: Sample Reviews */}
          <div className="space-y-6">
            <div className="border-b pb-6">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">Acharya Krishna Gopal Sharma</p>
                <span className="text-xs text-muted-foreground">Verified Devotee</span>
              </div>
              <div className="flex text-gold mt-1 text-sm">{"★".repeat(5)}</div>
              <p className="mt-2 text-xs font-bold text-foreground">Absolute sacred purity</p>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                We have consecrated this attar for daily temple aarti. It has zero synthetic
                sharpness and the Mysore sandalwood base stays radiant until evening shayan bhog.
              </p>
            </div>

            <div className="border-b pb-6">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">Radhika Singhal</p>
                <span className="text-xs text-muted-foreground">Verified Purchase</span>
              </div>
              <div className="flex text-gold mt-1 text-sm">{"★".repeat(5)}</div>
              <p className="mt-2 text-xs font-bold text-foreground">
                Exquisite packaging and sillage
              </p>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                The 6ml bottle arrived in royal casing. Even two small dabs on inner wrists lasted
                through a full 10-hour festive wedding celebration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pairs Beautifully With */}
      <section className="py-24">
        <h2 className="mb-8 font-display text-4xl font-semibold text-primary">
          Pairs Beautifully With
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {related.map((x) => (
            <ProductCard key={x.id} product={x} />
          ))}
        </div>
      </section>

      {/* Sticky Bottom Add-to-Bag Action (Appears after hero scrolls) */}
      {showStickyBar && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 shadow-xl backdrop-blur animate-fade-in sm:py-4">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4">
            <div className="flex items-center gap-3">
              <img src={p.image} alt="" className="size-10 rounded-sm object-cover" />
              <div>
                <p className="font-display font-semibold leading-none text-foreground">{p.name}</p>
                <p className="text-xs text-muted-foreground">
                  {size}ml · {formatPrice(price)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                disabled={isOutOfStock}
                onClick={() => add(p.id, size)}
                className="font-semibold"
              >
                <ShoppingBag className="mr-1.5 size-4" /> Quick Add · {formatPrice(price)}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
