import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useSession } from "@/hooks/use-session";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone, Mail, ShieldCheck, Sparkles, Check } from "lucide-react";

export const Route = createFileRoute("/account/profile")({
  head: () => ({
    meta: [{ title: "Profile Details — Itrkunj" }],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, profile, refreshProfile } = useSession();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone ? profile.phone.replace("+91", "") : "");
    } else if (user) {
      setFullName(user.user_metadata?.full_name || "");
      const ph = user.phone || user.user_metadata?.phone || "";
      setPhone(ph.replace("+91", ""));
    }
  }, [profile, user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!fullName.trim()) {
      toast.error("Full name cannot be empty");
      return;
    }

    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    const formattedPhone = cleanPhone ? `+91${cleanPhone}` : null;

    setIsSaving(true);
    try {
      // 1. Update Supabase profile row
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: fullName.trim(),
        phone: formattedPhone,
        updated_at: new Date().toISOString(),
      });

      if (profileError) {
        throw profileError;
      }

      // 2. Update user metadata
      await supabase.auth.updateUser({
        data: {
          full_name: fullName.trim(),
          phone: formattedPhone,
        },
      });

      await refreshProfile();
      toast.success("Profile details updated successfully");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save profile changes";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <div className="border-b pb-4">
        <h2 className="font-display text-2xl font-semibold text-primary">Personal Details</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Update your contact details for personalized customer care and order communications.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="space-y-5 rounded-lg border border-border bg-card p-6 shadow-sm"
      >
        <div>
          <Label htmlFor="full-name" className="text-xs font-semibold uppercase tracking-wider">
            Full Name
          </Label>
          <div className="relative mt-1.5">
            <Input
              id="full-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Radhika Sharma"
              className="pl-9 text-sm"
              required
            />
            <User className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          </div>
        </div>

        <div>
          <Label htmlFor="profile-phone" className="text-xs font-semibold uppercase tracking-wider">
            Mobile Number (India)
          </Label>
          <div className="mt-1.5 flex">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-xs font-medium text-muted-foreground">
              +91
            </span>
            <Input
              id="profile-phone"
              type="tel"
              inputMode="numeric"
              placeholder="98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-l-none text-sm tracking-wider"
            />
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Used for delivery tracking SMS and order notifications.
          </p>
        </div>

        <div>
          <Label htmlFor="profile-email" className="text-xs font-semibold uppercase tracking-wider">
            Registered Email
          </Label>
          <div className="relative mt-1.5">
            <Input
              id="profile-email"
              type="email"
              value={user?.email || "No email linked (Mobile user)"}
              disabled
              className="pl-9 text-sm bg-muted/60 text-muted-foreground cursor-not-allowed"
            />
            <Mail className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Email address is tied to your login credentials.
          </p>
        </div>

        <div className="pt-3 border-t flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 text-gold-strong" />
            Stored securely
          </div>
          <Button type="submit" disabled={isSaving} className="gap-1.5">
            {isSaving ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
