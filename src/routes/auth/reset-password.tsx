import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Eye, EyeOff, Check, ShieldCheck, Lock, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/auth/reset-password")({
  head: () => ({
    meta: [
      { title: "Set New Password — Itrkunj" },
      {
        name: "description",
        content: "Set a new secure password for your Itrkunj account.",
      },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasValidSession, setHasValidSession] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if recovery session or access token is active
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setHasValidSession(true);
      } else {
        // Wait briefly for hash-token authentication if redirect was immediate
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
          if (event === "PASSWORD_RECOVERY" || s) {
            setHasValidSession(true);
          }
        });

        setTimeout(() => {
          setHasValidSession((prev) => (prev === true ? true : false));
        }, 1500);

        return () => subscription.unsubscribe();
      }
    });
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        toast.error(error.message || "Failed to update password");
      } else {
        toast.success("Password updated successfully! Welcome back.");
        navigate({ to: "/account" });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error updating password";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (hasValidSession === false) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-background px-4 py-16">
        <div className="w-full max-w-md text-center p-6 border rounded-lg bg-card shadow-sm space-y-4">
          <div className="inline-flex size-12 items-center justify-center rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200">
            <AlertCircle className="size-6" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-primary">
            Session Expired or Invalid
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your password reset token has expired or has already been used. Please request a new
            recovery link.
          </p>
          <div className="pt-2">
            <Button asChild className="w-full">
              <Link to="/auth/forgot-password">Request New Reset Link</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-gold-strong">
            <Sparkles className="size-3" />
            Security Upgrade
          </div>
          <h1 className="mt-3 font-display text-3xl font-semibold text-primary sm:text-4xl">
            Choose New Password
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Please select a strong password for your sacred account.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8">
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <Label
                htmlFor="new-password"
                className="text-xs font-semibold uppercase tracking-wider"
              >
                New Password
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id="new-password"
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
                htmlFor="new-confirm-password"
                className="text-xs font-semibold uppercase tracking-wider"
              >
                Confirm New Password
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id="new-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-type new password"
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
              {isLoading ? "Saving password..." : "Update Password & Sign In"}
            </Button>

            <div className="flex items-center justify-center gap-1.5 pt-2 text-[11px] text-muted-foreground">
              <ShieldCheck className="size-3.5 text-gold-strong" />
              Credentials protected by cryptographic encryption
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
