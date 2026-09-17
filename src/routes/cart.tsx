import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { products, formatPrice } from "@/lib/catalog";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Shopping Bag — Itrkunj" },
      { name: "description", content: "Review selected artisanal attars reserved in your cart." },
      { property: "og:title", content: "Shopping Bag — Itrkunj" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cart, change, subtotal } = useStore();
  const freeShippingThreshold = 1499;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 79;
  const total = subtotal + shippingFee;

  return (
    <div className="min-h-[70vh] bg-background py-12">
      <div className="mx-auto max-w-5xl px-4 lg:px-8">
        <h1 className="font-display text-4xl font-semibold text-primary sm:text-5xl">
          Your Fragrance Bag
        </h1>
        <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
          {cart.length} unique {cart.length === 1 ? "item" : "items"} reserved
        </p>

        {cart.length === 0 ? (
          <div className="mt-16 rounded-sm border border-border bg-card p-12 text-center shadow-sm">
            <ShoppingBag className="mx-auto size-12 text-muted-foreground" />
            <h2 className="mt-4 font-display text-2xl font-semibold text-foreground">
              Your bag is currently empty
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Explore our artisanal attars distilled in Kannauj for your sacred rituals and personal
              wear.
            </p>
            <Button size="lg" className="mt-6" asChild>
              <Link to="/shop">
                Browse Fragrances <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="mt-10 grid gap-12 lg:grid-cols-[1.5fr_1fr]">
            {/* Items List */}
            <div className="divide-y border-y">
              {cart.map((item) => {
                const p = products.find((x) => x.id === item.id);
                if (!p) return null;
                const unitPrice = p.price * (item.size / 6);
                const itemTotal = unitPrice * item.quantity;

                return (
                  <div
                    key={`${item.id}-${item.size}`}
                    className="grid grid-cols-[90px_1fr_auto] items-center gap-6 py-6"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="aspect-[4/5] w-20 rounded-sm object-cover bg-muted"
                    />

                    <div>
                      <Link
                        to="/product/$slug"
                        params={{ slug: p.slug }}
                        className="font-display text-xl font-semibold text-foreground hover:text-primary"
                      >
                        {p.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">Size: {item.size} ml bottle</p>
                      <p className="mt-1 text-xs font-medium text-foreground">
                        {formatPrice(unitPrice)} each
                      </p>

                      <div className="mt-3 flex items-center gap-2">
                        <div className="inline-flex items-center rounded-sm border bg-background">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            onClick={() => change(item.id, item.size, -1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="size-3.5" />
                          </Button>
                          <span className="w-8 text-center text-xs font-semibold">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            onClick={() => change(item.id, item.size, 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus className="size-3.5" />
                          </Button>
                        </div>

                        <button
                          onClick={() => change(item.id, item.size, -item.quantity)}
                          className="p-1 text-muted-foreground hover:text-destructive"
                          aria-label="Remove item"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>

                    <div className="text-right font-display text-lg font-semibold text-foreground">
                      {formatPrice(itemTotal)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="rounded-sm border border-border bg-card p-6 shadow-sm h-fit">
              <h2 className="font-display text-2xl font-semibold text-primary">Order Summary</h2>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground font-medium">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between text-muted-foreground">
                  <span>Estimated Shipping</span>
                  <span className="text-foreground font-medium">
                    {shippingFee === 0 ? (
                      <span className="text-green-600 font-semibold">FREE</span>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>

                {subtotal < freeShippingThreshold && (
                  <p className="text-[11px] text-gold-strong">
                    Add {formatPrice(freeShippingThreshold - subtotal)} more to qualify for Free
                    Shipping!
                  </p>
                )}

                <div className="border-t pt-4 flex justify-between text-base font-bold text-foreground">
                  <span>Estimated Total</span>
                  <span className="font-display text-2xl text-primary">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <Button size="lg" className="w-full text-sm font-semibold tracking-wide" asChild>
                  <Link to="/checkout">
                    Proceed to Checkout <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>

                <p className="text-center text-[11px] text-muted-foreground">
                  Safe & encrypted checkout with Razorpay & Cash on Delivery.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
