import { createFileRoute, Outlet, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useSession } from "@/hooks/use-session";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Package,
  MapPin,
  Heart,
  User,
  LogOut,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account — Itrkunj" },
      {
        name: "description",
        content: "Manage your Itrkunj orders, addresses, and sacred collection.",
      },
    ],
  }),
  component: AccountLayout,
});

const navLinks = [
  { to: "/account", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/account/orders", label: "My Orders", icon: Package },
  { to: "/account/addresses", label: "Saved Addresses", icon: MapPin },
  { to: "/account/wishlist", label: "My Wishlist", icon: Heart },
  { to: "/account/profile", label: "Profile Details", icon: User },
] as const;

function AccountLayout() {
  const { user, profile, isLoading, signOut } = useSession();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate({ to: "/" });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="mx-auto size-8 animate-spin text-primary" />
          <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">
            Loading your sanctuary…
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-background px-4 text-center">
        <Sparkles className="size-8 text-gold-strong" />
        <h2 className="mt-3 font-display text-2xl font-semibold text-primary">Sign In Required</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Please sign in to view your Itrkunj account.
        </p>
        <Button className="mt-6" asChild>
          <Link to="/auth/login" search={{ redirect: "/account" }}>
            Sign In Now
          </Link>
        </Button>
      </div>
    );
  }

  const displayName =
    profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Patron";

  return (
    <div className="min-h-screen bg-background">
      {/* Account Hero Banner */}
      <section className="border-b bg-secondary/50 px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-strong">
                Customer Sanctuary
              </p>
              <h1 className="mt-1 font-display text-3xl font-semibold text-primary sm:text-4xl">
                Namaste, {displayName}
              </h1>
              <p className="mt-1 text-xs text-muted-foreground">
                {user.email || user.phone || "Itrkunj Member"} · Dedicated Attar Patron
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="gap-2 text-xs text-muted-foreground hover:text-destructive hover:border-destructive"
            >
              <LogOut className="size-3.5" />
              Sign Out
            </Button>
          </div>
        </div>
      </section>

      {/* Main Account Area */}
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
          {/* Navigation Sidebar */}
          <aside className="border-b pb-6 lg:border-b-0 lg:border-r lg:pr-6 lg:pb-0">
            <nav className="flex flex-row flex-wrap gap-1 lg:flex-col">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    activeOptions={{ exact: (item as { exact?: boolean }).exact ?? false }}
                    activeProps={{
                      className: "bg-primary text-primary-foreground font-semibold shadow-sm",
                    }}
                    inactiveProps={{
                      className: "text-foreground/80 hover:bg-secondary/80 hover:text-foreground",
                    }}
                    className="flex items-center gap-3 rounded-md px-3.5 py-2.5 text-xs font-medium transition-colors"
                  >
                    <Icon className="size-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Account Sub-route Content */}
          <main className="min-h-[500px]">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
