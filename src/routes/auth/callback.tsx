import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth/callback")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : "/account",
  }),
  head: () => ({
    meta: [{ title: "Authenticating — Itrkunj" }],
  }),
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function handleAuthCallback() {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const tokenHash = url.searchParams.get("token_hash");
        const type = url.searchParams.get("type");
        const errorDescription = url.searchParams.get("error_description");
        const error = url.searchParams.get("error");

        if (errorDescription || error) {
          const msg = errorDescription
            ? decodeURIComponent(errorDescription.replace(/\+/g, " "))
            : "Authentication link has expired or is invalid.";
          if (isMounted) setErrorMsg(msg);
          return;
        }

        // 1. PKCE flow: Exchange authorization code for session
        if (code) {
          const { data: exchangeData, error: exchangeErr } =
            await supabase.auth.exchangeCodeForSession(code);
          if (exchangeErr) {
            if (isMounted) setErrorMsg(exchangeErr.message);
            return;
          }
          if (exchangeData.session && isMounted) {
            if (redirect === "/auth/reset-password" || type === "recovery") {
              navigate({ to: "/auth/reset-password" });
            } else {
              navigate({ href: redirect });
            }
            return;
          }
        }

        // 2. Token hash OTP flow (email confirmation / recovery)
        if (tokenHash && type) {
          const { error: otpErr } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: type as any,
          });
          if (otpErr) {
            if (isMounted) setErrorMsg(otpErr.message);
            return;
          }
          if (isMounted) {
            if (type === "recovery" || redirect === "/auth/reset-password") {
              navigate({ to: "/auth/reset-password" });
            } else {
              navigate({ href: redirect });
            }
            return;
          }
        }

        // 3. Existing session check
        const { data, error: sessionErr } = await supabase.auth.getSession();
        if (sessionErr) {
          if (isMounted) setErrorMsg(sessionErr.message);
          return;
        }

        if (data.session) {
          if (
            redirect === "/auth/reset-password" ||
            window.location.hash.includes("type=recovery")
          ) {
            navigate({ to: "/auth/reset-password" });
          } else {
            navigate({ href: redirect });
          }
          return;
        }

        // 4. Listen for auth state change from implicit hash fragment
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === "PASSWORD_RECOVERY" || window.location.hash.includes("type=recovery")) {
            subscription.unsubscribe();
            navigate({ to: "/auth/reset-password" });
          } else if (session) {
            subscription.unsubscribe();
            navigate({ href: redirect });
          }
        });

        // 5. Fallback timeout
        const timeout = setTimeout(() => {
          if (isMounted) {
            subscription.unsubscribe();
            navigate({ href: `/auth/login?redirect=${encodeURIComponent(redirect)}` });
          }
        }, 4000);

        return () => {
          clearTimeout(timeout);
          subscription.unsubscribe();
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Authentication failed";
        if (isMounted) setErrorMsg(message);
      }
    }

    handleAuthCallback();

    return () => {
      isMounted = false;
    };
  }, [navigate, redirect]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <div className="inline-flex size-14 items-center justify-center rounded-full bg-secondary text-gold-strong mb-4 animate-pulse">
          <Sparkles className="size-7" />
        </div>
        <h1 className="font-display text-2xl font-semibold text-primary">
          Confirming your session…
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Preparing your Itrkunj experience.</p>
        {errorMsg ? (
          <p className="mt-4 text-xs text-destructive">{errorMsg}</p>
        ) : (
          <div className="mt-6 flex justify-center">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  );
}
