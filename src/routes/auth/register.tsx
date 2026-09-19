import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, ArrowRight, ShieldCheck, Heart, Eye, EyeOff, Check } from "lucide-react";

export const Route = createFileRoute("/auth/register")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : "/account",
  }),
  head: () => ({
    meta: [
      { title: "Create Account — Itrkunj" },
      {
        name: "description",
        content: "Join Itrkunj to explore sacred artisanal attars and manage your orders.",
      },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { redirect: redirectPath } = Route.useSearch();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate({ href: redirectPath });
      }
    });
  }, [navigate, redirectPath]);

  const cleanPhone = phone.replace(/\D/g, "").slice(-10);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    if (cleanPhone.length !== 10) {
      toast.error("Please enter a valid 10-digit Indian mobile number");
      return;
    }

    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please verify.");
      return;
    }

    setIsLoading(true);
    const formattedPhone = `+91${cleanPhone}`;

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: formattedPhone,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectPath)}`,
        },
      });

      if (error) {
        toast.error(error.message || "Failed to create account");
      } else if (data.session) {
        // Upsert profile in case DB trigger had delay
        if (data.user?.id) {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            full_name: fullName.trim(),
            phone: formattedPhone,
            role: "customer",
          });
        }
        toast.success("Welcome to Itrkunj! Your account is ready.");
        navigate({ href: redirectPath });
      } else if (data.user && !data.session) {
        toast.success("Account created! Please check your email to confirm registration.");
        navigate({ href: `/auth/login?redirect=${encodeURIComponent(redirectPath)}` });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-gold-strong">
            <Sparkles className="size-3" />
            Join Itrkunj
          </div>
          <h1 className="mt-3 font-display text-3xl font-semibold text-primary sm:text-4xl">
            Create Your Account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Save your sacred selections, track shipments, and experience handcrafted perfumery.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8">
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label htmlFor="reg-name" className="text-xs font-semibold uppercase tracking-wider">
                Full Name
              </Label>
              <Input
                id="reg-name"
                type="text"
                placeholder="e.g. Radhika Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1.5"
                required
                autoFocus
              />
            </div>

            <div>
              <Label htmlFor="reg-phone" className="text-xs font-semibold uppercase tracking-wider">
                Mobile Number (India)
              </Label>
              <div className="mt-1.5 flex">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-xs font-medium text-muted-foreground">
                  +91
                </span>
                <Input
                  id="reg-phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="rounded-l-none text-sm tracking-wider"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="reg-email" className="text-xs font-semibold uppercase tracking-wider">
                Email Address
              </Label>
              <Input
                id="reg-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5"
                required
              />
            </div>

            <div>
              <Label
                htmlFor="reg-password"
                className="text-xs font-semibold uppercase tracking-wider"
              >
                Password
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label
                htmlFor="reg-confirm-password"
                className="text-xs font-semibold uppercase tracking-wider"
              >
                Confirm Password
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id="reg-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {confirmPassword.length > 0 && (
                <div className="mt-1.5 flex items-center gap-1.5 text-[11px]">
                  {password === confirmPassword ? (
                    <span className="text-emerald-600 flex items-center gap-1">
                      <Check className="size-3" /> Passwords match
                    </span>
                  ) : (
                    <span className="text-amber-600">Passwords do not match yet</span>
                  )}
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Complete Registration"}
            </Button>
          </form>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="size-3.5 text-gold-strong" />
            Your contact details are used strictly for order updates.
          </div>

          {/* Footer */}
          <div className="mt-6 border-t pt-4 text-center">
            <p className="text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/auth/login"
                search={{ redirect: redirectPath }}
                className="font-semibold text-primary hover:underline inline-flex items-center gap-1"
              >
                Sign In <ArrowRight className="size-3" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
