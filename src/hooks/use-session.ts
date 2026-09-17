import { useEffect, useState, useCallback } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface UserProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: string;
  created_at?: string;
  updated_at?: string;
}

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.warn("[useSession] Error fetching profile:", error.message);
        return null;
      }

      if (data) {
        setProfile(data as UserProfile);
        return data as UserProfile;
      }
      return null;
    } catch (err) {
      console.warn("[useSession] Unexpected error in fetchProfile:", err);
      return null;
    }
  }, []);

  const syncGuestWishlistToDb = useCallback(async (userId: string) => {
    try {
      const guestWishlistStr = localStorage.getItem("itrkunj-wishlist");
      if (!guestWishlistStr) return;

      const guestWishlist: string[] = JSON.parse(guestWishlistStr);
      if (!Array.isArray(guestWishlist) || guestWishlist.length === 0) return;

      // Upsert into wishlist_items
      const rows = guestWishlist.map((productId) => ({
        user_id: userId,
        product_id: productId,
      }));

      await supabase.from("wishlist_items").upsert(rows, {
        onConflict: "user_id,product_id",
      });
    } catch (err) {
      console.warn("[useSession] Failed to sync guest wishlist:", err);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    // Fetch initial session
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (!isMounted) return;
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
          syncGuestWishlistToDb(session.user.id);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("[useSession] Failed to get session:", err);
        if (isMounted) setIsLoading(false);
      });

    // Listen to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!isMounted) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        fetchProfile(newSession.user.id);
        if (event === "SIGNED_IN") {
          syncGuestWishlistToDb(newSession.user.id);
        }
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile, syncGuestWishlistToDb]);

  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  }, [user?.id, fetchProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
  }, []);

  return {
    session,
    user,
    profile,
    isLoading,
    isAuthenticated: !!user,
    signOut,
    refreshProfile,
  };
}
