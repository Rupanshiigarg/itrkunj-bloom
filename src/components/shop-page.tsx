import { useEffect, useMemo, useState } from "react";
import { ChevronDown, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { ProductCard } from "@/components/site";
import { type Category, type Product } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/catalog.functions";

import { useStore } from "@/lib/store";
import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

const ALL_NOTES = [
  "Sandalwood",
  "Rose",
  "Oud",
  "Saffron",
  "Jasmine",
  "Mogra",
  "Khus",
  "Amber",
  "Musk",
  "Tulsi",
  "Lotus",
] as const;

interface ShopPageProps {
  category?: Category;
  initialDeity?: string;
  wishlistOnly?: boolean;
}

export function ShopPage({ category, initialDeity, wishlistOnly }: ShopPageProps) {
  const { wishlist } = useStore();
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("popular");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [selectedDeity, setSelectedDeity] = useState<string>(initialDeity || "all");
  const [selectedOccasion, setSelectedOccasion] = useState<string>("all");
  const [productList, setProductList] = useState<Product[]>([]);

  // Fetch products through server function
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getProducts({
      data: {
        category,
        sort,
        maxPrice,
        notes: selectedNotes,
        sizes: selectedSizes,
        deity: selectedDeity === "all" ? undefined : selectedDeity,
        occasion: selectedOccasion === "all" ? undefined : selectedOccasion,
      },
    })
      .then((res) => {
        if (!cancelled) {
          setProductList(res);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [category, sort, maxPrice, selectedNotes, selectedSizes, selectedDeity, selectedOccasion]);

  const toggleNote = (note: string) => {
    setSelectedNotes((prev) =>
      prev.includes(note) ? prev.filter((n) => n !== note) : [...prev, note],
    );
  };

  const toggleSize = (size: number) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  const clearAllFilters = () => {
    setSelectedNotes([]);
    setSelectedSizes([]);
    setMaxPrice(2000);
    setSelectedDeity("all");
    setSelectedOccasion("all");
  };

  const hasActiveFilters =
    selectedNotes.length > 0 ||
    selectedSizes.length > 0 ||
    maxPrice < 2000 ||
    selectedDeity !== "all" ||
    selectedOccasion !== "all";

  const displayedProducts = useMemo(() => {
    if (wishlistOnly) {
      return productList.filter((p) => wishlist.includes(p.id));
    }
    return productList;
  }, [wishlistOnly, productList, wishlist]);

  const title = wishlistOnly
    ? "Your Wishlist"
    : category === "men"
      ? "Men's Attars"
      : category === "women"
        ? "Women's Attars"
        : category === "thakur-sewa"
          ? "Thakur Sewa Attars"
          : "All Attars";

  return (
    <div className="min-h-screen bg-background">
      {/* Category Banner */}
      <section className="border-b bg-secondary/60 px-4 py-14 text-center">
        <p className="mb-3 text-xs uppercase tracking-[.25em] text-gold-strong">
          {wishlistOnly ? "Personal Sanctuary" : "Itrkunj Collections"}
        </p>
        <h1 className="font-display text-5xl font-semibold text-primary md:text-7xl">{title}</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {wishlistOnly
            ? "Your curated collection of sacred fragrances and personal signatures. Ready to accompany your rituals."
            : "Pure, alcohol-free hydro-distillations matured slowly in Kannauj and hand-bottled in small batches."}
        </p>
        {wishlistOnly && (
          <div className="mt-4">
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary hover:underline"
            >
              Browse All Fragrances &rarr;
            </Link>
          </div>
        )}
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        {/* Controls Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b pb-4">
          <p className="text-xs text-muted-foreground sm:text-sm">
            Home / {title} ·{" "}
            <span className="font-semibold text-foreground">
              {displayedProducts.length} fragrances
            </span>
          </p>

          <div className="flex items-center gap-3">
            <Button
              variant={filtersOpen ? "default" : "outline"}
              size="sm"
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="gap-2 text-xs"
            >
              <SlidersHorizontal className="size-3.5" />
              Filters {hasActiveFilters && "•"}
            </Button>

            <div className="relative">
              <span className="sr-only">Sort products</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-9 appearance-none rounded-sm border border-input bg-background pl-3 pr-8 text-xs font-semibold uppercase tracking-wider outline-none"
              >
                <option value="popular">Most Popular</option>
                <option value="new">New Releases</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-3 size-3.5 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Filter Panel (Slide Down) */}
        {filtersOpen && (
          <div className="mb-8 rounded-sm border border-border bg-card p-6 shadow-sm animate-fade-in">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-display text-lg font-semibold text-primary">Filter Fragrances</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-primary underline hover:text-primary/80"
                >
                  Reset all filters
                </button>
              )}
            </div>

            <div className="mt-6 grid gap-8 sm:grid-cols-3">
              {/* Price Filter */}
              <div>
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider">
                  <span>Price Range</span>
                  <span className="text-primary font-bold">Up to ₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="900"
                  max="2000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="mt-3 block w-full accent-primary"
                />
                <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                  <span>₹900</span>
                  <span>₹2,000+</span>
                </div>
              </div>

              {/* Sizes Filter */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider">Bottle Sizes</p>
                <div className="mt-3 flex gap-2">
                  {[3, 6, 12].map((s) => {
                    const active = selectedSizes.includes(s);
                    return (
                      <button
                        key={s}
                        onClick={() => toggleSize(s)}
                        className={`rounded-sm border px-3 py-1.5 text-xs font-medium transition-colors ${
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-input bg-background hover:bg-muted"
                        }`}
                      >
                        {s} ml
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fragrance Notes Chips */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider">Fragrance Notes</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {ALL_NOTES.map((note) => {
                    const active = selectedNotes.includes(note);
                    return (
                      <button
                        key={note}
                        onClick={() => toggleNote(note)}
                        className={`rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
                          active
                            ? "border-primary bg-primary text-primary-foreground font-semibold"
                            : "border-border bg-secondary/50 text-foreground/80 hover:bg-secondary"
                        }`}
                      >
                        {note}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Active Pills Display */}
            {hasActiveFilters && (
              <div className="mt-6 flex flex-wrap items-center gap-2 border-t pt-4 text-xs">
                <span className="text-muted-foreground text-[11px] uppercase tracking-wider">
                  Active Filters:
                </span>
                {selectedNotes.map((n) => (
                  <span
                    key={n}
                    className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs text-foreground"
                  >
                    {n}
                    <X className="size-3 cursor-pointer" onClick={() => toggleNote(n)} />
                  </span>
                ))}
                {selectedSizes.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs text-foreground"
                  >
                    {s}ml
                    <X className="size-3 cursor-pointer" onClick={() => toggleSize(s)} />
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[4/5] animate-pulse rounded-sm bg-muted" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
              </div>
            ))
          ) : displayedProducts.length === 0 ? (
            <div className="col-span-full py-16 text-center">
              <Sparkles className="mx-auto size-8 text-gold-strong" />
              <p className="mt-3 font-display text-2xl font-semibold text-primary">
                {wishlistOnly ? "Your wishlist is empty" : "No matching fragrances found"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {wishlistOnly
                  ? "Explore our collections and tap the heart icon to save your favorites."
                  : "Try widening your price range or clearing note selections."}
              </p>
              {wishlistOnly ? (
                <Button variant="default" size="sm" className="mt-4" asChild>
                  <Link to="/shop">Explore Collections</Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="mt-4" onClick={clearAllFilters}>
                  Clear All Filters
                </Button>
              )}
            </div>
          ) : (
            displayedProducts.map((p) => <ProductCard key={p.id} product={p} />)
          )}
        </div>
      </div>
    </div>
  );
}
