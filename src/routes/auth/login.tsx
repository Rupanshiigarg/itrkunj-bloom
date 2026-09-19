import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, Mail, Sparkles, ArrowRight, ShieldCheck, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/auth/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : "/account",
  }),
  head: () => ({
    meta: [
      { title: "Sign In — Itrkunj" },
      {
        name: "description",
        content: "Sign in to your Itrkunj account to view your orders and saved attars.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { redirect: redirectPath } = Route.useSearch();
  const navigate = useNavigate();

  // Phone OTP state
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Email state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isMagicLinkSent, setIsMagicLinkSent] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate({ href: redirectPath });
      }
    });
  }, [navigate, redirectPath]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Clean 10-digit Indian phone number
  const cleanPhone = phone.replace(/\D/g, "").slice(-10);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cleanPhone.length !== 10) {
      toast.error("Please enter a valid 10-digit Indian mobile number");
      return;
    }

    setIsSendingOtp(true);
    const fullPhone = `+91${cleanPhone}`;

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: fullPhone,
      });

      if (error) {
        toast.error(error.message || "Could not send OTP. Please use email sign in.");
      } else {
        setOtpSent(true);
        setResendTimer(30);
        toast.success(`Verification code sent to ${fullPhone}`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send OTP";
      toast.error(message);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim().length !== 6) {
      toast.error("Please enter the 6-digit OTP code");
      return;
    }

    setIsVerifyingOtp(true);
    const fullPhone = `+91${cleanPhone}`;

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: fullPhone,
        token: otp.trim(),
        type: "sms",
      });

      if (error) {
        toast.error(error.message || "Invalid or expired OTP");
      } else if (data.session) {
        toast.success("Welcome back to Itrkunj!");
        navigate({ href: redirectPath });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Verification failed";
      toast.error(message);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsEmailLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password");
      } else if (data.session) {
        toast.success("Welcome back to Itrkunj!");
        navigate({ href: redirectPath });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign in failed";
      toast.error(message);
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleSendMagicLink = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsEmailLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectPath)}`,
        },
      });

      if (error) {
        toast.error(error.message || "Could not send magic link");
      } else {
        setIsMagicLinkSent(true);
        toast.success("Magic sign-in link sent to your email!");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send magic link";
      toast.error(message);
    } finally {
      setIsEmailLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-gold-strong">
            <Sparkles className="size-3" />
            Itrkunj Account
          </div>
          <h1 className="mt-3 font-display text-3xl font-semibold text-primary sm:text-4xl">
            Namaste & Welcome
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to access your orders, saved addresses, and sacred collection.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8">
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="email" className="gap-2 text-xs">
                <Mail className="size-3.5" /> Email
              </TabsTrigger>
              <TabsTrigger value="phone" className="gap-2 text-xs">
                <Phone className="size-3.5" /> Mobile OTP
              </TabsTrigger>
            </TabsList>

            {/* Email Tab */}
            <TabsContent value="email" className="space-y-4">
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div>
                  <Label
                    htmlFor="email-input"
                    className="text-xs font-semibold uppercase tracking-wider"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email-input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1.5"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="password-input"
                      className="text-xs font-semibold uppercase tracking-wider"
                    >
                      Password
                    </Label>
                    <Link
                      to="/auth/forgot-password"
                      className="text-xs font-medium text-gold-strong hover:text-primary transition-colors underline-offset-4 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative mt-1.5">
                    <Input
                      id="password-input"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isEmailLoading}>
                  {isEmailLoading ? "Signing in..." : "Sign In with Password"}
                </Button>

                <div className="relative my-4 text-center text-xs">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <span className="relative bg-card px-2 text-muted-foreground uppercase text-[10px]">
                    Or
                  </span>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleSendMagicLink}
                  disabled={isEmailLoading}
                >
                  {isMagicLinkSent ? "Magic link sent!" : "Send One-Click Magic Link"}
                </Button>
              </form>
            </TabsContent>

            {/* Phone OTP Tab */}
            <TabsContent value="phone" className="space-y-4">
              <div className="rounded-md bg-secondary/70 p-3 text-[11px] text-muted-foreground leading-relaxed">
                ℹ️ Mobile SMS OTP requires a registered SMS gateway in Supabase (e.g. Twilio /
                MSG91). For instant access, use <strong>Email login</strong>.
              </div>
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <Label
                      htmlFor="phone-input"
                      className="text-xs font-semibold uppercase tracking-wider"
                    >
                      Mobile Number (India)
                    </Label>
                    <div className="mt-2 flex">
                      <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-xs font-medium text-muted-foreground">
                        +91
                      </span>
                      <Input
                        id="phone-input"
                        type="tel"
                        inputMode="numeric"
                        placeholder="98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="rounded-l-none text-sm tracking-wider"
                        required
                        autoFocus
                      />
                    </div>
                    <p className="mt-1.5 text-[11px] text-muted-foreground">
                      We will send a 6-digit verification code via SMS.
                    </p>
                  </div>

                  <Button type="submit" className="w-full" disabled={isSendingOtp}>
                    {isSendingOtp ? "Sending code..." : "Send Verification Code"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="otp-input"
                        className="text-xs font-semibold uppercase tracking-wider"
                      >
                        Enter 6-Digit Code
                      </Label>
                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(false);
                          setOtp("");
                        }}
                        className="text-[11px] text-primary hover:underline"
                      >
                        Change number
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Sent to +91 {cleanPhone}</p>
                    <Input
                      id="otp-input"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="• • • • • •"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      className="mt-2 text-center text-xl font-bold tracking-[0.5em]"
                      required
                      autoFocus
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isVerifyingOtp}>
                    {isVerifyingOtp ? "Verifying..." : "Verify & Sign In"}
                  </Button>

                  <div className="text-center">
                    {resendTimer > 0 ? (
                      <span className="text-xs text-muted-foreground">
                        Resend code in {resendTimer}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        Resend code
                      </button>
                    )}
                  </div>
                </form>
              )}

              <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                <ShieldCheck className="size-3.5 text-gold-strong" />
                Quick & secure login. No password needed.
              </div>
            </TabsContent>
          </Tabs>

          {/* Footer inside card */}
          <div className="mt-6 border-t pt-4 text-center">
            <p className="text-xs text-muted-foreground">
              Don't have an account yet?{" "}
              <Link
                to="/auth/register"
                search={{ redirect: redirectPath }}
                className="font-semibold text-primary hover:underline inline-flex items-center gap-1"
              >
                Create Account <ArrowRight className="size-3" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
