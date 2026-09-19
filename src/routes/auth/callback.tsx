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
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          if (isMounted) setErrorMsg(error.message);
          return;
        }

        if (data.session) {
          navigate({ href: redirect });
        } else {
          // Listen for next auth event (e.g. hash token exchange)
          const {
            data: { subscription },
          } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "PASSWORD_RECOVERY") {
              subscription.unsubscribe();
              navigate({ to: "/auth/reset-password" });
            } else if (session) {
              subscription.unsubscribe();
              navigate({ href: redirect });
            }
          });

          // Fallback timeout
          setTimeout(() => {
            if (isMounted) {
              navigate({ href: `/auth/login?redirect=${encodeURIComponent(redirect)}` });
            }
          }, 3000);
        }
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
