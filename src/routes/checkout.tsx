import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useSession } from "@/hooks/use-session";
import { useStore } from "@/lib/store";
import { products, formatPrice } from "@/lib/catalog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  ArrowRight,
  ArrowLeft,
  Tag,
  CheckCircle2,
  Lock,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Itrkunj Pure Indian Attars" },
      { name: "description", content: "Secure encrypted checkout for your Itrkunj order." },
    ],
  }),
  component: CheckoutPage,
});

interface CheckoutAddress {
  id?: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

function CheckoutPage() {
  const navigate = useNavigate();
  const { user, profile } = useSession();
  const { cart, subtotal, setCartOpen } = useStore();

  // Multi-step: 1 = Address, 2 = Review & Coupon, 3 = Payment
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Address State
  const [savedAddresses, setSavedAddresses] = useState<CheckoutAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | "new">("new");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");

  // Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online");
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate pricing
  const freeShippingThreshold = 1499;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 79;
  const total = Math.max(0, subtotal - discount + shippingFee);

  // Load saved addresses if logged in
  useEffect(() => {
    if (!user) return;
    supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setSavedAddresses(data as CheckoutAddress[]);
          const def = data.find((a: { is_default?: boolean }) => a.is_default) || data[0];
          setSelectedAddressId(def.id || "new");
          setName(def.name);
          setPhone(def.phone.replace("+91", ""));
          setLine1(def.line1);
          setLine2(def.line2 || "");
          setCity(def.city);
          setStateName(def.state);
          setPincode(def.pincode);
        } else {
          setName(profile?.full_name || user.user_metadata?.full_name || "");
          setPhone(user.phone ? user.phone.replace("+91", "") : "");
        }
      });
  }, [user, profile]);

  const handleSelectAddress = (addrId: string) => {
    setSelectedAddressId(addrId);
    if (addrId === "new") {
      setName(profile?.full_name || user?.user_metadata?.full_name || "");
      setPhone(user?.phone ? user.phone.replace("+91", "") : "");
      setLine1("");
      setLine2("");
      setCity("");
      setStateName("");
      setPincode("");
    } else {
      const found = savedAddresses.find((a) => a.id === addrId);
      if (found) {
        setName(found.name);
        setPhone(found.phone.replace("+91", ""));
        setLine1(found.line1);
        setLine2(found.line2 || "");
        setCity(found.city);
        setStateName(found.state);
        setPincode(found.pincode);
      }
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === "DIVINE10" || code === "WELCOME10" || code === "ITRKUNJ10") {
      const disc = Math.round(subtotal * 0.1);
      setDiscount(disc);
      setCouponApplied(true);
      toast.success(`Coupon ${code} applied! ₹${disc} discount added.`);
    } else if (code === "KESHAV50" && subtotal >= 1000) {
      setDiscount(50);
      setCouponApplied(true);
      toast.success("Coupon KESHAV50 applied! ₹50 discount added.");
    } else {
      toast.error("Invalid or expired coupon code. Try DIVINE10 for 10% off!");
    }
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Please enter delivery recipient name");
    if (phone.replace(/\D/g, "").length < 10)
      return toast.error("Please enter a valid 10-digit mobile number");
    if (!line1.trim()) return toast.error("Please enter your street address");
    if (!city.trim() || !stateName.trim()) return toast.error("Please enter city and state");
    if (pincode.replace(/\D/g, "").length !== 6)
      return toast.error("Please enter a valid 6-digit Pincode");

    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    const orderId = "ITR-" + Math.random().toString(36).substring(2, 9).toUpperCase();
    const orderItems = cart.map((item) => {
      const p = products.find((x) => x.id === item.id);
      return {
        name: p?.name || "Attar",
        size: item.size,
        quantity: item.quantity,
        price: p ? p.price * (item.size / 6) : 990,
        image: p?.image || "",
      };
    });

    const deliveryAddress = {
      name: name.trim(),
      phone: `+91${phone.replace(/\D/g, "").slice(-10)}`,
      line1: line1.trim(),
      line2: line2.trim(),
      city: city.trim(),
      state: stateName.trim(),
      pincode: pincode.trim(),
    };

    const orderRecord = {
      id: orderId,
      created_at: new Date().toISOString(),
      status: paymentMethod === "cod" ? "pending_cod" : "paid",
      subtotal,
      discount,
      shipping_fee: shippingFee,
      total,
      method: paymentMethod,
      items: orderItems,
      address: deliveryAddress,
    };

    // Store in localStorage for instant tracking
    localStorage.setItem(`itrkunj-order-${orderId}`, JSON.stringify(orderRecord));

    // Try saving to DB if table is active
    if (user) {
      try {
        await supabase.from("orders").insert({
          id: crypto.randomUUID ? crypto.randomUUID() : undefined,
          user_id: user.id,
          status: paymentMethod === "cod" ? "pending_cod" : "paid",
          address_snapshot: deliveryAddress,
          subtotal,
          discount,
          shipping_fee: shippingFee,
          total,
          razorpay_order_id: orderId,
        });
      } catch {
        // graceful offline/mock fallback
      }
    }

    // Clear cart
    localStorage.removeItem("itrkunj-cart");
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Order consecrated & confirmed!");
      navigate({ to: "/order-confirmation/$id", params: { id: orderId } });
    }, 1000);
  };

  if (cart.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-background px-4 text-center">
        <Sparkles className="size-10 text-gold-strong" />
        <h1 className="mt-3 font-display text-3xl font-semibold text-primary">Your Bag is Empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Select your sacred attars before proceeding to checkout.
        </p>
        <Button className="mt-6" asChild>
          <Link to="/shop">Discover Collection</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="mx-auto max-w-5xl px-4 lg:px-8">
        {/* Step Indicator */}
        <div className="mb-10 flex items-center justify-center gap-4 text-xs font-semibold uppercase tracking-wider">
          <button
            onClick={() => setStep(1)}
            className={`flex items-center gap-1.5 ${step >= 1 ? "text-primary font-bold" : "text-muted-foreground"}`}
          >
            <span
              className={`flex size-6 items-center justify-center rounded-full text-[11px] ${step >= 1 ? "bg-primary text-primary-foreground" : "border"}`}
            >
              1
            </span>
            Delivery Address
          </button>
          <span className="text-muted-foreground">———</span>
          <button
            onClick={() => step > 2 && setStep(2)}
            disabled={step < 2}
            className={`flex items-center gap-1.5 ${step >= 2 ? "text-primary font-bold" : "text-muted-foreground"}`}
          >
            <span
              className={`flex size-6 items-center justify-center rounded-full text-[11px] ${step >= 2 ? "bg-primary text-primary-foreground" : "border"}`}
            >
              2
            </span>
            Review & Bag
          </button>
          <span className="text-muted-foreground">———</span>
          <button
            disabled={step < 3}
            className={`flex items-center gap-1.5 ${step === 3 ? "text-primary font-bold" : "text-muted-foreground"}`}
          >
            <span
              className={`flex size-6 items-center justify-center rounded-full text-[11px] ${step === 3 ? "bg-primary text-primary-foreground" : "border"}`}
            >
              3
            </span>
            Payment
          </button>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          {/* Main Step Body */}
          <div>
            {/* STEP 1: Address */}
            {step === 1 && (
              <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between border-b pb-4 mb-6">
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-primary">
                      Delivery Address
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Where should we deliver your consecrated attars?
                    </p>
                  </div>
                  {!user && (
                    <Link
                      to="/auth/login"
                      search={{ redirect: "/checkout" }}
                      className="text-xs text-primary underline"
                    >
                      Have an account? Sign in
                    </Link>
                  )}
                </div>

                {/* Saved addresses selector */}
                {savedAddresses.length > 0 && (
                  <div className="mb-6 space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Select Saved Address
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {savedAddresses.map((addr) => (
                        <div
                          key={addr.id}
                          onClick={() => handleSelectAddress(addr.id || "new")}
                          className={`cursor-pointer rounded-md border p-3 text-xs transition-all ${
                            selectedAddressId === addr.id
                              ? "border-primary bg-primary/5 ring-1 ring-primary"
                              : "border-border hover:bg-muted/50"
                          }`}
                        >
                          <p className="font-semibold text-foreground">{addr.name}</p>
                          <p className="text-muted-foreground truncate">{addr.line1}</p>
                          <p className="text-muted-foreground">
                            {addr.city}, {addr.pincode}
                          </p>
                        </div>
                      ))}
                      <div
                        onClick={() => handleSelectAddress("new")}
                        className={`cursor-pointer rounded-md border border-dashed p-3 text-center text-xs transition-all ${
                          selectedAddressId === "new"
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border hover:bg-muted/50"
                        }`}
                      >
                        + Add / Enter Different Address
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div>
                    <Label
                      htmlFor="c-name"
                      className="text-xs font-semibold uppercase tracking-wider"
                    >
                      Recipient Full Name *
                    </Label>
                    <Input
                      id="c-name"
                      required
                      placeholder="e.g. Radhika Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label
                        htmlFor="c-phone"
                        className="text-xs font-semibold uppercase tracking-wider"
                      >
                        10-Digit Mobile Number *
                      </Label>
                      <div className="mt-1 flex">
                        <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-xs text-muted-foreground">
                          +91
                        </span>
                        <Input
                          id="c-phone"
                          required
                          type="tel"
                          placeholder="98765 43210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="rounded-l-none"
                        />
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="c-pin"
                        className="text-xs font-semibold uppercase tracking-wider"
                      >
                        6-Digit Pincode *
                      </Label>
                      <Input
                        id="c-pin"
                        required
                        maxLength={6}
                        placeholder="209727"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="c-line1"
                      className="text-xs font-semibold uppercase tracking-wider"
                    >
                      Flat / House No. / Street Address *
                    </Label>
                    <Input
                      id="c-line1"
                      required
                      placeholder="House/Apartment number, building name, lane"
                      value={line1}
                      onChange={(e) => setLine1(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="c-line2"
                      className="text-xs font-semibold uppercase tracking-wider"
                    >
                      Landmark / Locality (Optional)
                    </Label>
                    <Input
                      id="c-line2"
                      placeholder="Near Temple / landmark"
                      value={line2}
                      onChange={(e) => setLine2(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label
                        htmlFor="c-city"
                        className="text-xs font-semibold uppercase tracking-wider"
                      >
                        City / Town *
                      </Label>
                      <Input
                        id="c-city"
                        required
                        placeholder="Kannauj / Mathura"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="c-state"
                        className="text-xs font-semibold uppercase tracking-wider"
                      >
                        State *
                      </Label>
                      <Input
                        id="c-state"
                        required
                        placeholder="Uttar Pradesh"
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full mt-4">
                    Continue to Order Review <ArrowRight className="ml-2 size-4" />
                  </Button>
                </form>
              </div>
            )}

            {/* STEP 2: Review & Coupon */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-center justify-between border-b pb-4 mb-4">
                    <h2 className="font-display text-2xl font-semibold text-primary">
                      Review Selected Fragrances
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStep(1)}
                      className="text-xs text-muted-foreground"
                    >
                      Edit Address
                    </Button>
                  </div>

                  <div className="divide-y">
                    {cart.map((item) => {
                      const p = products.find((x) => x.id === item.id);
                      if (!p) return null;
                      const unitPrice = p.price * (item.size / 6);
                      return (
                        <div
                          key={`${item.id}-${item.size}`}
                          className="flex items-center justify-between py-3"
                        >
                          <div className="flex items-center gap-3">
                            <img src={p.image} alt="" className="size-12 rounded-sm object-cover" />
                            <div>
                              <p className="font-display font-semibold text-foreground text-sm">
                                {p.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {item.size}ml · Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <p className="font-semibold text-sm">
                            {formatPrice(unitPrice * item.quantity)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Coupon Box */}
                <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                    <Tag className="size-3.5" /> Have a Devotional Promo Code?
                  </p>
                  <form onSubmit={handleApplyCoupon} className="mt-3 flex gap-2">
                    <Input
                      placeholder="e.g. DIVINE10"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="text-xs uppercase"
                    />
                    <Button type="submit" variant="outline" size="sm">
                      Apply
                    </Button>
                  </form>
                  {couponApplied && (
                    <p className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      ✓ Coupon applied successfully! ₹{discount} discount reflected.
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" size="lg" onClick={() => setStep(1)} className="w-1/3">
                    <ArrowLeft className="mr-2 size-4" /> Back
                  </Button>
                  <Button size="lg" onClick={() => setStep(3)} className="w-2/3">
                    Proceed to Payment <ArrowRight className="ml-2 size-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: Payment */}
            {step === 3 && (
              <div className="rounded-lg border border-border bg-card p-6 shadow-sm space-y-6">
                <div className="border-b pb-4">
                  <h2 className="font-display text-2xl font-semibold text-primary">
                    Select Payment Method
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    All transactions are encrypted with 256-bit bank-grade SSL.
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Online Payment option */}
                  <label
                    onClick={() => setPaymentMethod("online")}
                    className={`flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-all ${
                      paymentMethod === "online"
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:bg-muted/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "online"}
                      onChange={() => setPaymentMethod("online")}
                      className="mt-1 text-primary accent-primary"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="size-4 text-gold-strong" />
                        <span className="font-semibold text-foreground text-sm">
                          Prepaid Online (Razorpay / UPI / Cards / Netbanking)
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        Instant confirmation, zero convenience charges. Supports GPay, PhonePe,
                        Paytm, and all major Indian cards.
                      </p>
                    </div>
                  </label>

                  {/* Cash on Delivery option */}
                  <label
                    onClick={() => setPaymentMethod("cod")}
                    className={`flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-all ${
                      paymentMethod === "cod"
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:bg-muted/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="mt-1 text-primary accent-primary"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <Banknote className="size-4 text-gold-strong" />
                        <span className="font-semibold text-foreground text-sm">
                          Cash on Delivery (COD)
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        Pay cash or UPI upon delivery at your doorstep. Verified pan-India via
                        Shiprocket.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="rounded-md bg-secondary/40 p-4 text-xs text-muted-foreground space-y-1">
                  <p className="font-semibold text-foreground">Delivering to:</p>
                  <p>
                    {name} · +91 {phone.replace(/\D/g, "").slice(-10)}
                  </p>
                  <p>
                    {line1}, {city}, {stateName} — {pincode}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" size="lg" onClick={() => setStep(2)} className="w-1/3">
                    <ArrowLeft className="mr-2 size-4" /> Back
                  </Button>
                  <Button
                    size="lg"
                    disabled={isProcessing}
                    onClick={handlePlaceOrder}
                    className="w-2/3 text-sm font-semibold tracking-wide"
                  >
                    {isProcessing
                      ? "Consecrating Order..."
                      : paymentMethod === "cod"
                        ? `Place COD Order · ${formatPrice(total)}`
                        : `Pay Online · ${formatPrice(total)}`}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Summary */}
          <div className="h-fit space-y-4">
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <h3 className="font-display text-xl font-semibold text-primary border-b pb-3 mb-4">
                Order Summary
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Bag Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Devotional Discount</span>
                    <span>- {formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-muted-foreground">
                  <span>Insured Shipping</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="font-semibold text-green-600">FREE</span>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>

                <div className="border-t pt-3 flex justify-between font-display text-base font-bold text-foreground">
                  <span>Payable Total</span>
                  <span className="text-xl text-primary">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-secondary/30 p-4 text-xs space-y-2 text-muted-foreground">
              <div className="flex items-center gap-2 text-foreground font-medium">
                <Truck className="size-4 text-gold-strong" /> Free shipping on orders ₹1,499+
              </div>
              <div className="flex items-center gap-2 text-foreground font-medium">
                <ShieldCheck className="size-4 text-gold-strong" /> 100% Pure Kannauj Attars
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
