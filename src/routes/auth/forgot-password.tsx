import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, ArrowLeft, Mail, CheckCircle2, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/auth/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot Password — Itrkunj" },
      {
        name: "description",
        content: "Reset your Itrkunj account password with a secure authentication link.",
      },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/auth/callback?redirect=/auth/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });

      if (error) {
        toast.error(error.message || "Failed to send reset link");
      } else {
        setIsSubmitted(true);
        setResendTimer(60);
        toast.success("Password reset instructions sent!");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error sending reset request";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-gold-strong">
            <Sparkles className="size-3" />
            Security & Account
          </div>
          <h1 className="mt-3 font-display text-3xl font-semibold text-primary sm:text-4xl">
            Reset Password
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your registered email and we will send you a secure link to reset your credentials.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8">
          {isSubmitted ? (
            <div className="text-center space-y-4 py-2">
              <div className="inline-flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                <CheckCircle2 className="size-6" />
              </div>
              <h2 className="font-display text-xl font-semibold text-primary">
                Check Your Inbox
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We have dispatched a password recovery link to{" "}
                <span className="font-semibold text-foreground">{email}</span>. Please click the link
                in the email to choose a new password.
              </p>

              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetRequest}
                  disabled={resendTimer > 0 || isLoading}
                  className="w-full text-xs"
                >
                  {resendTimer > 0 ? `Resend link in ${resendTimer}s` : "Resend Reset Link"}
                </Button>
              </div>

              <div className="pt-4 border-t">
                <Link
                  to="/auth/login"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  <ArrowLeft className="size-3.5" /> Back to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleResetRequest} className="space-y-4">
              <div>
                <Label htmlFor="reset-email" className="text-xs font-semibold uppercase tracking-wider">
                  Registered Email Address
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                  <Mail className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending recovery link..." : "Send Password Reset Link"}
              </Button>

              <div className="flex items-center justify-center gap-1.5 pt-2 text-[11px] text-muted-foreground">
                <ShieldCheck className="size-3.5 text-gold-strong" />
                256-bit encrypted authentication link
              </div>

              <div className="pt-4 border-t text-center">
                <Link
                  to="/auth/login"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  <ArrowLeft className="size-3.5" /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
