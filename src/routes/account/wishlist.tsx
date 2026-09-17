import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { products, formatPrice } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/account/wishlist")({
  head: () => ({
    meta: [{ title: "My Wishlist — Itrkunj" }],
  }),
  component: AccountWishlistPage,
});

function AccountWishlistPage() {
  const { wishlist, toggleWishlist, add, setCartOpen } = useStore();

  const savedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleMoveToBag = (productId: string) => {
    add(productId, 6);
    setCartOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-primary">Saved Fragrances</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Your sacred sanctuary of favorite attars, kept safe across all your visits.
          </p>
        </div>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-foreground">
          {savedProducts.length} {savedProducts.length === 1 ? "Fragrance" : "Fragrances"}
        </span>
      </div>

      {savedProducts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <Heart className="mx-auto size-12 text-muted-foreground/50" />
          <h3 className="mt-3 font-display text-xl font-semibold text-primary">
            Your Wishlist is Empty
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
            Explore our artisanal Thakur Sewa and bespoke perfume oils, and tap the heart icon to
            curate your sacred selections.
          </p>
          <Button className="mt-6" asChild>
            <Link to="/shop">Discover Attar Collection</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {savedProducts.map((product) => (
            <div
              key={product.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm"
            >
              <div>
                <Link to="/product/$slug" params={{ slug: product.slug }} className="block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded bg-muted">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {product.badge && (
                      <span className="absolute left-2.5 top-2.5 rounded-full bg-primary/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                        {product.badge}
                      </span>
                    )}
                  </div>
                </Link>

                <div className="mt-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <Link
                      to="/product/$slug"
                      params={{ slug: product.slug }}
                      className="font-display text-lg font-semibold text-primary hover:underline"
                    >
                      {product.name}
                    </Link>
                    <span className="font-semibold text-sm text-foreground">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">{product.subtitle}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 border-t pt-3">
                <Button
                  size="sm"
                  className="flex-1 gap-1.5 text-xs"
                  onClick={() => handleMoveToBag(product.id)}
                >
                  <ShoppingBag className="size-3.5" /> Move to Bag
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8 text-muted-foreground hover:text-destructive hover:border-destructive"
                  onClick={() => toggleWishlist(product.id)}
                  title="Remove from wishlist"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
