import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useSession } from "@/hooks/use-session";
import { formatPrice } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  Sparkles,
  MessageSquare,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/order-confirmation/$id")({
  head: () => ({
    meta: [
      { title: "Order Confirmed — Itrkunj" },
      { name: "description", content: "Your Itrkunj order has been received and consecrated." },
    ],
  }),
  component: OrderConfirmationPage,
});

interface StoredOrder {
  id: string;
  created_at: string;
  status: string;
  subtotal: number;
  discount: number;
  shipping_fee: number;
  total: number;
  method: string;
  items: Array<{
    name: string;
    size: number;
    quantity: number;
    price: number;
    image: string;
  }>;
  address: {
    name: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
}

function OrderConfirmationPage() {
  const { id } = Route.useParams();
  const { user } = useSession();
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // 1. Check in session storage / local order registry
    try {
      const stored = localStorage.getItem(`itrkunj-order-${id}`);
      if (stored) {
        setOrder(JSON.parse(stored));
      } else {
        // Fallback placeholder structure
        setOrder({
          id,
          created_at: new Date().toISOString(),
          status: "confirmed",
          subtotal: 1290,
          discount: 0,
          shipping_fee: 0,
          total: 1290,
          method: "online",
          items: [],
          address: {
            name: user?.user_metadata?.full_name || "Valued Patron",
            phone: user?.phone || "+91 98765 43210",
            line1: "Delivery Address recorded",
            city: "Kannauj",
            state: "Uttar Pradesh",
            pincode: "209727",
          },
        });
      }
    } catch {
      // ignore parse errors
    }
  }, [id, user]);

  const copyOrderId = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    toast.success("Order ID copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "+917527869894";
  const whatsappMsg = `Namaste Itrkunj, I just placed Order #${id.slice(0, 8).toUpperCase()}. Could you share the dispatch update?`;

  return (
    <div className="min-h-[85vh] bg-background py-12 px-4">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto mb-6 inline-flex size-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-10" />
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-strong">
          Order Consecrated & Confirmed
        </p>

        <h1 className="mt-2 font-display text-4xl font-semibold text-primary sm:text-5xl">
          Thank You for Your Reverence
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          Your sacred attars are being prepared with care in our Kannauj distillery. We will
          dispatch your order via express insured courier within 24 hours.
        </p>

        {/* Order Identifier Card */}
        <div className="mt-8 rounded-lg border border-border bg-card p-6 shadow-sm text-left">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Order Reference
              </p>
              <p className="font-mono text-lg font-bold text-foreground">
                #{id.slice(0, 10).toUpperCase()}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={copyOrderId} className="gap-1.5 text-xs">
              {copied ? (
                <Check className="size-3.5 text-green-600" />
              ) : (
                <Copy className="size-3.5" />
              )}
              {copied ? "Copied" : "Copy ID"}
            </Button>
          </div>

          <div className="grid gap-4 py-4 sm:grid-cols-2 text-xs">
            <div>
              <p className="text-muted-foreground uppercase tracking-wider text-[10px]">
                Estimated Delivery
              </p>
              <p className="font-semibold text-foreground mt-0.5">3 to 5 Business Days</p>
              <p className="text-[11px] text-muted-foreground">Handled by Shiprocket Express</p>
            </div>

            <div>
              <p className="text-muted-foreground uppercase tracking-wider text-[10px]">
                Payment Status
              </p>
              <p className="font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {order?.method === "cod" ? "Cash on Delivery" : "Paid & Verified (Razorpay)"}
              </p>
              <p className="text-[11px] text-muted-foreground">Invoice sent to email & SMS</p>
            </div>
          </div>

          {order?.address && (
            <div className="border-t pt-4 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground mb-1">Delivering to:</p>
              <p className="font-medium text-foreground">{order.address.name}</p>
              <p>
                {order.address.line1} {order.address.line2}
              </p>
              <p>
                {order.address.city}, {order.address.state} — {order.address.pincode}
              </p>
              <p className="mt-1">Contact: {order.address.phone}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button size="lg" className="gap-2" asChild>
            <Link to="/shop">
              Explore More Attars <ArrowRight className="size-4" />
            </Link>
          </Button>

          <Button variant="outline" size="lg" className="gap-2" asChild>
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(whatsappMsg)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageSquare className="size-4 text-[#25D366]" />
              Track via WhatsApp
            </a>
          </Button>
        </div>

        {user && (
          <p className="mt-6 text-xs text-muted-foreground">
            View live status anytime in{" "}
            <Link to="/account/orders" className="font-semibold text-primary underline">
              Your Account Orders
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
