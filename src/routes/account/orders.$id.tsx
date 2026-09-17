import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useSession } from "@/hooks/use-session";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import {
  Package,
  ArrowLeft,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  MessageSquare,
  ExternalLink,
  Loader2,
  ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/account/orders/$id")({
  head: () => ({
    meta: [{ title: "Order Details — Itrkunj" }],
  }),
  component: OrderDetailPage,
});

interface OrderItemDetail {
  id: string;
  quantity: number;
  unit_price: number;
  product_snapshot: {
    name?: string;
    size_ml?: number;
    image_url?: string;
  };
}

interface ShipmentDetail {
  id: string;
  awb?: string;
  courier?: string;
  tracking_url?: string;
  status: string;
  estimated_delivery?: string;
}

interface PaymentDetail {
  method?: string;
  status: string;
  razorpay_payment_id?: string;
}

interface FullOrder {
  id: string;
  created_at: string;
  status: string;
  subtotal: number;
  discount: number;
  shipping_fee: number;
  total: number;
  address_snapshot: {
    name?: string;
    phone?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  order_items: OrderItemDetail[];
  shipment?: ShipmentDetail | null;
  payment?: PaymentDetail | null;
}

function OrderDetailPage() {
  const { id } = Route.useParams();
  const { user } = useSession();
  const [order, setOrder] = useState<FullOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let isMounted = true;

    async function fetchOrderDetail() {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select(
            `
            id, created_at, status, subtotal, discount, shipping_fee, total, address_snapshot,
            order_items(id, quantity, unit_price, product_snapshot),
            shipments(id, awb, courier, tracking_url, status, estimated_delivery),
            payments(method, status, razorpay_payment_id)
          `,
          )
          .eq("id", id)
          .eq("user_id", user.id)
          .maybeSingle();

        if (!error && data && isMounted) {
          const rawShipment = Array.isArray(data.shipments) ? data.shipments[0] : data.shipments;
          const rawPayment = Array.isArray(data.payments) ? data.payments[0] : data.payments;
          setOrder({
            ...data,
            shipment: rawShipment || null,
            payment: rawPayment || null,
          } as unknown as FullOrder);
        }
      } catch (err) {
        console.warn("[OrderDetail] Error fetching:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchOrderDetail();

    return () => {
      isMounted = false;
    };
  }, [id, user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">
          Retrieving order details…
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="rounded-lg border border-border p-10 text-center">
        <Package className="mx-auto size-10 text-muted-foreground" />
        <h3 className="mt-3 font-display text-xl font-semibold text-primary">Order Not Found</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          We could not locate this order under your account.
        </p>
        <Button className="mt-5" variant="outline" asChild>
          <Link to="/account/orders">Back to Orders</Link>
        </Button>
      </div>
    );
  }

  // Calculate timeline milestone index
  // 0: Ordered, 1: Paid/Confirmed, 2: Packed, 3: Shipped/In Transit, 4: Delivered
  let stepIndex = 0;
  if (order.status === "pending_payment") stepIndex = 0;
  else if (order.status === "paid" || order.status === "pending_cod") stepIndex = 1;
  else if (order.status === "processing") stepIndex = 2;
  else if (order.status === "shipped") stepIndex = 3;
  else if (order.status === "delivered") stepIndex = 4;

  const milestones = [
    { label: "Ordered", desc: "Order recorded in system" },
    { label: "Confirmed", desc: "Payment verified" },
    { label: "Packed", desc: "Hand-bottled in Kannauj" },
    {
      label: "Shipped",
      desc: order.shipment?.courier ? `Via ${order.shipment.courier}` : "Handed to courier",
    },
    { label: "Delivered", desc: "Delivered to your address" },
  ];

  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "+917527869894";
  const whatsappMsg = `Namaste Itrkunj, I have a question regarding my Order #${order.id.slice(0, 8).toUpperCase()}`;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div>
          <Link
            to="/account/orders"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary mb-1"
          >
            <ArrowLeft className="size-3" /> Back to all orders
          </Link>
          <div className="flex items-center gap-3">
            <h2 className="font-display text-2xl font-semibold text-primary sm:text-3xl">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </h2>
            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-gold-strong uppercase tracking-wider">
              {order.status.replace("_", " ")}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Placed on{" "}
            {new Date(order.created_at).toLocaleDateString("en-IN", {
              weekday: "short",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <a
          href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(whatsappMsg)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted"
        >
          <MessageSquare className="size-3.5 text-[#25D366]" />
          Order Support on WhatsApp
        </a>
      </div>

      {/* 5-Step Milestone Progress Timeline */}
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h3 className="font-display text-base font-semibold text-primary mb-6">
          Shipment Progress Timeline
        </h3>

        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {milestones.map((milestone, idx) => {
            const isCompleted = idx <= stepIndex;
            const isCurrent = idx === stepIndex;
            return (
              <div
                key={idx}
                className="flex items-start gap-3 md:flex-col md:items-center md:text-center md:flex-1"
              >
                <div
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    isCompleted
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "border border-border bg-secondary text-muted-foreground"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="size-4" /> : idx + 1}
                </div>
                <div>
                  <p
                    className={`text-xs font-semibold uppercase tracking-wider ${
                      isCurrent
                        ? "text-primary font-bold"
                        : isCompleted
                          ? "text-foreground"
                          : "text-muted-foreground"
                    }`}
                  >
                    {milestone.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{milestone.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {order.shipment?.awb && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-md bg-secondary/50 p-3 text-xs">
            <div className="flex items-center gap-2">
              <Truck className="size-4 text-gold-strong" />
              <span>
                Courier: <strong>{order.shipment.courier || "Express Surface"}</strong> · AWB:{" "}
                <span className="font-mono">{order.shipment.awb}</span>
              </span>
            </div>
            {order.shipment.tracking_url && (
              <a
                href={order.shipment.tracking_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
              >
                Track on Courier Site <ExternalLink className="size-3" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Grid: Order Items & Order Summary */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items Table (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h3 className="font-display text-base font-semibold text-primary border-b pb-3 mb-4">
              Order Items ({order.order_items.reduce((s, i) => s + i.quantity, 0)})
            </h3>

            <div className="divide-y">
              {order.order_items.map((item) => (
                <div
                  key={item.id}
                  className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3.5">
                    {item.product_snapshot?.image_url ? (
                      <img
                        src={item.product_snapshot.image_url}
                        alt={item.product_snapshot.name || "Attar"}
                        className="size-14 rounded-md border object-cover"
                      />
                    ) : (
                      <div className="flex size-14 items-center justify-center rounded-md border bg-secondary">
                        <Package className="size-6 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <p className="font-display text-base font-semibold text-foreground">
                        {item.product_snapshot?.name || "Handcrafted Attar"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.product_snapshot?.size_ml
                          ? `${item.product_snapshot.size_ml} ml bottle`
                          : "6 ml"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Qty: {item.quantity} × {formatPrice(item.unit_price)}
                      </p>
                    </div>
                  </div>

                  <p className="font-semibold text-foreground text-sm">
                    {formatPrice(item.unit_price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address Card */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b pb-3 mb-3">
              <MapPin className="size-4 text-primary" />
              <h3 className="font-display text-base font-semibold text-primary">
                Delivery Address
              </h3>
            </div>
            {order.address_snapshot ? (
              <div className="text-xs leading-relaxed space-y-1 text-muted-foreground">
                <p className="font-semibold text-foreground text-sm">
                  {order.address_snapshot.name}
                </p>
                <p>{order.address_snapshot.line1}</p>
                {order.address_snapshot.line2 && <p>{order.address_snapshot.line2}</p>}
                <p>
                  {order.address_snapshot.city}, {order.address_snapshot.state} —{" "}
                  {order.address_snapshot.pincode}
                </p>
                {order.address_snapshot.phone && (
                  <p className="pt-1 text-foreground">Phone: {order.address_snapshot.phone}</p>
                )}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Address recorded at checkout.</p>
            )}
          </div>
        </div>

        {/* Pricing Summary (1 col) */}
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h3 className="font-display text-base font-semibold text-primary border-b pb-3 mb-4">
              Payment Summary
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-medium text-foreground">{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Coupon Discount</span>
                  <span>- {formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping Fee</span>
                <span>{order.shipping_fee === 0 ? "FREE" : formatPrice(order.shipping_fee)}</span>
              </div>

              <div className="border-t pt-3 flex justify-between font-display text-base font-bold text-primary">
                <span>Total Amount</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>

            <div className="mt-5 rounded-md bg-secondary/60 p-3 text-xs">
              <div className="flex items-center gap-2 text-foreground font-medium">
                <CreditCard className="size-4 text-gold-strong" />
                <span>
                  {order.payment?.method
                    ? `Paid via ${order.payment.method.toUpperCase()}`
                    : order.status === "pending_cod"
                      ? "Cash on Delivery (COD)"
                      : "Prepaid Online"}
                </span>
              </div>
              {order.payment?.razorpay_payment_id && (
                <p className="mt-1 text-[10px] font-mono text-muted-foreground">
                  Ref: {order.payment.razorpay_payment_id}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-gold/30 bg-secondary/20 p-5 text-center">
            <ShieldCheck className="mx-auto size-6 text-gold-strong" />
            <p className="mt-2 text-xs font-semibold text-foreground">
              Authentic Indian Hydro-Distillation
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              100% pure alcohol-free attars, matured in Kannauj wood vats.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
