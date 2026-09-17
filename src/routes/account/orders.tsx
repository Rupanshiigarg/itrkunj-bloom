import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useSession } from "@/hooks/use-session";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import { Package, ArrowRight, Clock, ShieldCheck, Loader2 } from "lucide-react";

export const Route = createFileRoute("/account/orders")({
  head: () => ({
    meta: [{ title: "My Orders — Itrkunj" }],
  }),
  component: OrdersListPage,
});

interface OrderItem {
  id: string;
  quantity: number;
  unit_price: number;
  product_snapshot: {
    name?: string;
    size_ml?: number;
    image_url?: string;
  };
}

interface OrderRecord {
  id: string;
  created_at: string;
  status: string;
  subtotal: number;
  discount: number;
  shipping_fee: number;
  total: number;
  order_items?: OrderItem[];
}

function OrdersListPage() {
  const { user } = useSession();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let isMounted = true;

    async function fetchOrders() {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select(
            "id, created_at, status, subtotal, discount, shipping_fee, total, order_items(id, quantity, unit_price, product_snapshot)",
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (!error && data && isMounted) {
          setOrders(data as unknown as OrderRecord[]);
        }
      } catch (err) {
        console.warn("[Orders] Error fetching orders:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            Paid & Confirmed
          </span>
        );
      case "shipped":
        return (
          <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
            Shipped
          </span>
        );
      case "delivered":
        return (
          <span className="rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-semibold text-green-600 dark:text-green-400">
            Delivered
          </span>
        );
      case "cancelled":
        return (
          <span className="rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-semibold text-destructive">
            Cancelled
          </span>
        );
      case "pending_cod":
        return (
          <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
            Pending COD
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
            Processing
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="font-display text-2xl font-semibold text-primary">Order History</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          View all your previous purchases, delivery updates, and tracking details.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">
            Fetching your orders…
          </p>
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <Package className="mx-auto size-12 text-muted-foreground/60" />
          <h3 className="mt-3 font-display text-xl font-semibold text-primary">No Orders Yet</h3>
          <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
            You haven't placed any orders yet. Discover our pure sandalwood, rose, and devotional
            attars.
          </p>
          <Button className="mt-6" asChild>
            <Link to="/shop">Explore Fragrance Collection</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-lg border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/50"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 text-xs">
                <div>
                  <span className="font-mono font-semibold text-foreground">
                    Order #{order.id.slice(0, 8).toUpperCase()}
                  </span>
                  <span className="mx-2 text-muted-foreground">•</span>
                  <span className="text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {getStatusBadge(order.status)}
              </div>

              {/* Items Preview */}
              <div className="my-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  {order.order_items && order.order_items.length > 0 ? (
                    order.order_items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        {item.product_snapshot?.image_url ? (
                          <img
                            src={item.product_snapshot.image_url}
                            alt={item.product_snapshot.name || "Attar"}
                            className="size-10 rounded border object-cover"
                          />
                        ) : (
                          <div className="flex size-10 items-center justify-center rounded border bg-secondary">
                            <Package className="size-5 text-muted-foreground" />
                          </div>
                        )}
                        <div className="text-xs">
                          <p className="font-medium text-foreground">
                            {item.product_snapshot?.name || "Attar"}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {item.product_snapshot?.size_ml
                              ? `${item.product_snapshot.size_ml}ml`
                              : "Standard"}{" "}
                            × {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">Handcrafted attar order</span>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-muted-foreground uppercase tracking-wider block">
                    Total
                  </span>
                  <span className="font-display text-lg font-bold text-primary">
                    {formatPrice(order.total || order.subtotal)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between border-t pt-3">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <ShieldCheck className="size-3 text-gold-strong" /> Authentic Kannauj
                  hydro-distillation
                </span>
                <Button size="sm" variant="outline" className="text-xs gap-1" asChild>
                  <Link to="/account/orders/$id" params={{ id: order.id }}>
                    View Details & Tracking <ArrowRight className="size-3" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
