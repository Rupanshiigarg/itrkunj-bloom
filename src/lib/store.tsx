import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { products } from "./catalog";
import { supabase } from "@/integrations/supabase/client";

type CartItem = { id: string; size: number; quantity: number };
type Store = {
  cart: CartItem[];
  wishlist: string[];
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  add: (id: string, size?: number) => void;
  change: (id: string, size: number, delta: number) => void;
  toggleWishlist: (id: string) => void;
  count: number;
  subtotal: number;
};
const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setCart(JSON.parse(localStorage.getItem("itrkunj-cart") || "[]"));
      setWishlist(JSON.parse(localStorage.getItem("itrkunj-wishlist") || "[]"));
    } catch {
      // Ignore parse errors on corrupted or uninitialized localStorage
    }
    setReady(true);
  }, []);

  // Fetch DB wishlist for authenticated user and merge
  useEffect(() => {
    const fetchDbWishlist = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("wishlist_items")
        .select("product_id")
        .eq("user_id", user.id);

      if (!error && data) {
        const dbIds = data.map((row) => row.product_id);
        setWishlist((prev) => {
          const merged = Array.from(new Set([...prev, ...dbIds]));
          return merged;
        });
      }
    };

    fetchDbWishlist();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        fetchDbWishlist();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (ready) {
      localStorage.setItem("itrkunj-cart", JSON.stringify(cart));
      localStorage.setItem("itrkunj-wishlist", JSON.stringify(wishlist));
    }
  }, [cart, wishlist, ready]);

  const add = (id: string, size = 6) => {
    setCart((c) => {
      const found = c.find((i) => i.id === id && i.size === size);
      return found
        ? c.map((i) => (i === found ? { ...i, quantity: i.quantity + 1 } : i))
        : [...c, { id, size, quantity: 1 }];
    });
    toast.success("Added to your bag");
  };

  const change = (id: string, size: number, delta: number) =>
    setCart((c) =>
      c
        .map((i) => (i.id === id && i.size === size ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0),
    );

  const toggleWishlist = async (id: string) => {
    const isRemoving = wishlist.includes(id);
    const updated = isRemoving ? wishlist.filter((x) => x !== id) : [...wishlist, id];
    setWishlist(updated);
    toast(isRemoving ? "Removed from wishlist" : "Saved to wishlist");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        if (isRemoving) {
          await supabase
            .from("wishlist_items")
            .delete()
            .match({ user_id: user.id, product_id: id });
        } else {
          await supabase.from("wishlist_items").insert({
            user_id: user.id,
            product_id: id,
          });
        }
      }
    } catch (err) {
      console.warn("[StoreProvider] Error updating wishlist in DB:", err);
    }
  };

  const count = cart.reduce((s, i) => s + i.quantity, 0);
  const subtotal = cart.reduce(
    (s, i) => s + (products.find((p) => p.id === i.id)?.price || 0) * (i.size / 6) * i.quantity,
    0,
  );
  const value = useMemo(
    () => ({ cart, wishlist, cartOpen, setCartOpen, add, change, toggleWishlist, count, subtotal }),
    [cart, wishlist, cartOpen, count, subtotal],
  );
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
export const useStore = () => {
  const value = useContext(StoreContext);
  if (!value) throw new Error("StoreProvider missing");
  return value;
};
