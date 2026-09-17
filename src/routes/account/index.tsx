import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useSession } from "@/hooks/use-session";
import { useStore } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import {
  Package,
  MapPin,
  Heart,
  ArrowRight,
  Clock,
  Sparkles,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";

export const Route = createFileRoute("/account/")({
  head: () => ({
    meta: [{ title: "Account Dashboard — Itrkunj" }],
  }),
  component: AccountDashboardPage,
});

interface RecentOrder {
  id: string;
  created_at: string;
  status: string;
  total: number;
  subtotal: number;
}

interface DefaultAddress {
  name: string;
  city: string;
  state: string;
  pincode: string;
}

function AccountDashboardPage() {
  const { user } = useSession();
  const { wishlist } = useStore();

  const [orderCount, setOrderCount] = useState(0);
  const [activeShipmentsCount, setActiveShipmentsCount] = useState(0);
  const [addressCount, setAddressCount] = useState(0);
  const [recentOrder, setRecentOrder] = useState<RecentOrder | null>(null);
  const [defaultAddress, setDefaultAddress] = useState<DefaultAddress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    async function loadDashboardData() {
      try {
        // 1. Fetch Orders
        const { data: orders, error: ordersErr } = await supabase
          .from("orders")
          .select("id, created_at, status, total, subtotal")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (!ordersErr && orders && isMounted) {
          setOrderCount(orders.length);
          if (orders.length > 0) {
            setRecentOrder(orders[0] as RecentOrder);
          }
          const active = orders.filter((o) =>
            ["paid", "processing", "shipped"].includes(o.status),
          ).length;
          setActiveShipmentsCount(active);
        }

        // 2. Fetch Addresses
        const { data: addresses, error: addrErr } = await supabase
          .from("addresses")
          .select("name, city, state, pincode, is_default")
          .eq("user_id", user.id);

        if (!addrErr && addresses && isMounted) {
          setAddressCount(addresses.length);
          const def = addresses.find((a) => a.is_default) || addresses[0];
          if (def) {
            setDefaultAddress(def as DefaultAddress);
          }
        }
      } catch (err) {
        console.warn("[Dashboard] Error loading data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDashboardData();

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
            In Transit
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
      default:
        return (
          <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
            Processing
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Orders</span>
            <Package className="size-4 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {loading ? "…" : orderCount}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Active Shipments
            </span>
            <Clock className="size-4 text-gold-strong" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {loading ? "…" : activeShipmentsCount}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Saved Wishlist
            </span>
            <Heart className="size-4 text-rose-500" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {wishlist.length}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Addresses</span>
            <MapPin className="size-4 text-amber-600" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {loading ? "…" : addressCount}
          </p>
        </div>
      </div>

      {/* Recent Order & Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Order Card */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <Package className="size-4 text-primary" />
              <h2 className="font-display text-lg font-semibold text-primary">Recent Order</h2>
            </div>
            {orderCount > 0 && (
              <Link
                to="/account/orders"
                className="text-xs font-semibold text-primary hover:underline"
              >
                View all ({orderCount})
              </Link>
            )}
          </div>

          <div className="mt-4">
            {loading ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                Loading recent orders…
              </div>
            ) : recentOrder ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-mono text-muted-foreground">
                      Order #{recentOrder.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(recentOrder.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  {getStatusBadge(recentOrder.status)}
                </div>

                <div className="flex items-center justify-between border-t pt-3">
                  <div>
                    <span className="text-xs text-muted-foreground">Order Amount</span>
                    <p className="text-base font-semibold text-foreground">
                      {formatPrice(recentOrder.total || recentOrder.subtotal)}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link to="/account/orders/$id" params={{ id: recentOrder.id }}>
                      View Details & Tracking &rarr;
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center">
                <ShoppingBag className="mx-auto size-8 text-muted-foreground/60" />
                <p className="mt-2 text-sm font-medium text-foreground">No orders placed yet</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Your journey into Kannauj attars begins with your first selection.
                </p>
                <Button size="sm" className="mt-4" asChild>
                  <Link to="/shop">Explore Fragrances</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Shipping Address & Quick Actions Card */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" />
              <h2 className="font-display text-lg font-semibold text-primary">
                Primary Delivery Address
              </h2>
            </div>
            <Link
              to="/account/addresses"
              className="text-xs font-semibold text-primary hover:underline"
            >
              Manage
            </Link>
          </div>

          <div className="mt-4">
            {loading ? (
              <div className="py-8 text-center text-xs text-muted-foreground">Loading address…</div>
            ) : defaultAddress ? (
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground">{defaultAddress.name}</p>
                  <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-gold-strong">
                    Default
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {defaultAddress.city}, {defaultAddress.state} — {defaultAddress.pincode}
                </p>
                <div className="pt-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs text-primary px-0 hover:underline"
                    asChild
                  >
                    <Link to="/account/addresses">Edit or add another address &rarr;</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center">
                <MapPin className="mx-auto size-8 text-muted-foreground/60" />
                <p className="mt-2 text-sm font-medium text-foreground">No saved address</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Add a delivery address for seamless 1-click checkout.
                </p>
                <Button size="sm" variant="outline" className="mt-4" asChild>
                  <Link to="/account/addresses">Add New Address</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sacred Craftsmanship Notice */}
      <div className="rounded-lg border border-gold/30 bg-secondary/30 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-gold-strong">
              <Sparkles className="size-3" /> The Itrkunj Assurance
            </div>
            <h3 className="mt-1 font-display text-xl font-semibold text-primary">
              Hand-Bottled Kannauj Hydro-Distillations
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Every bottle undergoes slow wooden barrel maturation, completely alcohol-free. Sacred
              for Thakur Sewa, sublime for personal elegance.
            </p>
          </div>
          <Button variant="default" size="sm" className="shrink-0 gap-1.5" asChild>
            <Link to="/shop">
              Browse Attars <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
