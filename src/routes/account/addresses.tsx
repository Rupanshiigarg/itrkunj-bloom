import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useSession } from "@/hooks/use-session";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { MapPin, Plus, Edit2, Trash2, CheckCircle2, Loader2 } from "lucide-react";

export const Route = createFileRoute("/account/addresses")({
  head: () => ({
    meta: [{ title: "Saved Addresses — Itrkunj" }],
  }),
  component: AddressesPage,
});

interface AddressItem {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
  created_at?: string;
}

function AddressesPage() {
  const { user } = useSession();
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog modal state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const fetchAddresses = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false });

      if (!error && data) {
        setAddresses(data as AddressItem[]);
      }
    } catch (err) {
      console.warn("[Addresses] Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  const openAddDialog = () => {
    setEditingAddress(null);
    setName(user?.user_metadata?.full_name || "");
    setPhone(user?.phone ? user.phone.replace("+91", "") : "");
    setLine1("");
    setLine2("");
    setCity("");
    setState("");
    setPincode("");
    setIsDefault(addresses.length === 0);
    setDialogOpen(true);
  };

  const openEditDialog = (addr: AddressItem) => {
    setEditingAddress(addr);
    setName(addr.name);
    setPhone(addr.phone.replace("+91", ""));
    setLine1(addr.line1);
    setLine2(addr.line2 || "");
    setCity(addr.city);
    setState(addr.state);
    setPincode(addr.pincode);
    setIsDefault(addr.is_default);
    setDialogOpen(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const cleanPincode = pincode.replace(/\D/g, "");
    if (cleanPincode.length !== 6) {
      toast.error("Please enter a valid 6-digit Indian Pincode");
      return;
    }

    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    if (cleanPhone.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    setSubmitting(true);
    const payload = {
      user_id: user.id,
      name: name.trim(),
      phone: `+91${cleanPhone}`,
      line1: line1.trim(),
      line2: line2.trim() || null,
      city: city.trim(),
      state: state.trim(),
      pincode: cleanPincode,
      is_default: isDefault,
      updated_at: new Date().toISOString(),
    };

    try {
      // If setting as default, clear default on other addresses
      if (isDefault) {
        await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id);
      }

      if (editingAddress) {
        const { error } = await supabase
          .from("addresses")
          .update(payload)
          .eq("id", editingAddress.id)
          .eq("user_id", user.id);

        if (error) throw error;
        toast.success("Address updated successfully");
      } else {
        const { error } = await supabase.from("addresses").insert(payload);

        if (error) throw error;
        toast.success("New address added successfully");
      }

      setDialogOpen(false);
      fetchAddresses();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save address";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetDefault = async (addrId: string) => {
    if (!user) return;
    try {
      await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id);

      const { error } = await supabase
        .from("addresses")
        .update({ is_default: true })
        .eq("id", addrId)
        .eq("user_id", user.id);

      if (error) throw error;
      toast.success("Default address updated");
      fetchAddresses();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to set default";
      toast.error(message);
    }
  };

  const handleDelete = async (addrId: string) => {
    if (!confirm("Are you sure you want to remove this address?")) return;
    try {
      const { error } = await supabase
        .from("addresses")
        .delete()
        .eq("id", addrId)
        .eq("user_id", user!.id);

      if (error) throw error;
      toast.success("Address removed");
      fetchAddresses();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete address";
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-primary">Saved Addresses</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Manage your delivery destinations for rapid checkout across India.
          </p>
        </div>
        <Button onClick={openAddDialog} size="sm" className="gap-1.5">
          <Plus className="size-4" /> Add New Address
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">
            Loading addresses…
          </p>
        </div>
      ) : addresses.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <MapPin className="mx-auto size-12 text-muted-foreground/60" />
          <h3 className="mt-3 font-display text-xl font-semibold text-primary">
            No Addresses Saved
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
            Add your primary shipping address so your sacred attars arrive swiftly without
            re-typing.
          </p>
          <Button onClick={openAddDialog} className="mt-6">
            Add Your First Address
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`relative rounded-lg border p-5 transition-all ${
                addr.is_default
                  ? "border-primary bg-secondary/20 shadow-sm"
                  : "border-border bg-card hover:border-border/80"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground text-sm">{addr.name}</h4>
                    {addr.is_default && (
                      <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Phone: {addr.phone}</p>
                </div>
              </div>

              <div className="mt-3 text-xs text-muted-foreground leading-relaxed space-y-0.5 border-t pt-3">
                <p>{addr.line1}</p>
                {addr.line2 && <p>{addr.line2}</p>}
                <p>
                  {addr.city}, {addr.state} —{" "}
                  <strong className="text-foreground">{addr.pincode}</strong>
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs">
                {!addr.is_default ? (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-primary hover:underline font-medium"
                  >
                    Set as Default
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                    <CheckCircle2 className="size-3.5 text-primary" /> Primary Address
                  </span>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditDialog(addr)}
                    className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    title="Edit address"
                  >
                    <Edit2 className="size-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    title="Delete address"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Address Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md bg-background">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-primary">
              {editingAddress ? "Edit Shipping Address" : "Add New Shipping Address"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Ensure accurate pincode and mobile number for seamless courier delivery.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveAddress} className="space-y-4 pt-2">
            <div>
              <Label htmlFor="addr-name" className="text-xs font-semibold uppercase tracking-wider">
                Full Name
              </Label>
              <Input
                id="addr-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Recipient name"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label
                htmlFor="addr-phone"
                className="text-xs font-semibold uppercase tracking-wider"
              >
                10-Digit Mobile Number
              </Label>
              <div className="mt-1 flex">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-xs text-muted-foreground">
                  +91
                </span>
                <Input
                  id="addr-phone"
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98765 43210"
                  className="rounded-l-none"
                  required
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="addr-line1"
                className="text-xs font-semibold uppercase tracking-wider"
              >
                Flat, House No., Building, Street
              </Label>
              <Input
                id="addr-line1"
                value={line1}
                onChange={(e) => setLine1(e.target.value)}
                placeholder="e.g. 104, Vrindavan Heights"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label
                htmlFor="addr-line2"
                className="text-xs font-semibold uppercase tracking-wider"
              >
                Area, Colony, Landmark (Optional)
              </Label>
              <Input
                id="addr-line2"
                value={line2}
                onChange={(e) => setLine2(e.target.value)}
                placeholder="Near Temple / Metro station"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label
                  htmlFor="addr-city"
                  className="text-xs font-semibold uppercase tracking-wider"
                >
                  City / Town
                </Label>
                <Input
                  id="addr-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Mathura"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor="addr-state"
                  className="text-xs font-semibold uppercase tracking-wider"
                >
                  State
                </Label>
                <Input
                  id="addr-state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Uttar Pradesh"
                  className="mt-1"
                  required
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="addr-pincode"
                className="text-xs font-semibold uppercase tracking-wider"
              >
                6-Digit Pincode
              </Label>
              <Input
                id="addr-pincode"
                inputMode="numeric"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                placeholder="281001"
                className="mt-1 tracking-wider"
                required
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                id="is-default-check"
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="size-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
              />
              <Label htmlFor="is-default-check" className="text-xs font-normal cursor-pointer">
                Set as default shipping address
              </Label>
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving…" : "Save Address"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
