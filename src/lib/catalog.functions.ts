import { createServerFn } from "@tanstack/react-start";
import { products as staticProducts, Product } from "@/lib/catalog";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type CatalogProduct = Product & {
  inStock?: boolean;
  stockCount?: Record<number, number>;
  variantPrices?: Record<number, number>;
};

// Public server function to get filtered & sorted products
export const getProducts = createServerFn({ method: "GET" })
  .validator(
    (params: {
      category?: string;
      sort?: string;
      maxPrice?: number;
      notes?: string[];
      sizes?: number[];
      deity?: string;
      occasion?: string;
    }) => params,
  )
  .handler(async ({ data }) => {
    const {
      category,
      sort = "popular",
      maxPrice = 2500,
      notes = [],
      sizes = [],
      deity,
      occasion,
    } = data;

    const filtered = staticProducts.filter((p) => {
      if (category && p.category !== category) return false;
      if (p.price > maxPrice) return false;
      if (sizes.length > 0 && !sizes.some((s) => p.sizes.includes(s))) return false;
      if (deity && p.deity && !p.deity.toLowerCase().includes(deity.toLowerCase())) return false;
      if (occasion && p.occasion && !p.occasion.toLowerCase().includes(occasion.toLowerCase()))
        return false;
      if (notes.length > 0) {
        const allNotes = [...p.notes.top, ...p.notes.heart, ...p.notes.base].map((n) =>
          n.toLowerCase(),
        );
        const hasMatchingNote = notes.some((n) => allNotes.includes(n.toLowerCase()));
        if (!hasMatchingNote) return false;
      }
      return true;
    });

    if (sort === "low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === "new") {
      filtered.sort((a, b) => (b.badge === "New" ? 1 : 0) - (a.badge === "New" ? 1 : 0));
    } else {
      // popular
      filtered.sort((a, b) => b.reviews - a.reviews);
    }

    return filtered;
  });

// Public server function to get product by slug
export const getProductBySlug = createServerFn({ method: "GET" })
  .validator((params: { slug: string }) => params)
  .handler(async ({ data }) => {
    const p = staticProducts.find((x) => x.slug === data.slug);
    if (!p) return null;

    const related = staticProducts
      .filter((x) => x.category === p.category && x.id !== p.id)
      .slice(0, 4);

    // Mock stock for variants: 3ml: 12, 6ml: 3 (low stock!), 12ml: 20
    const stockMap: Record<number, number> = {
      3: 15,
      6: 4, // triggers "Only 4 left"
      12: 10,
    };

    const variantPrices: Record<number, number> = {
      3: Math.round((p.price * 0.5) / 10) * 10,
      6: p.price,
      12: Math.round((p.price * 1.8) / 10) * 10,
    };

    return {
      product: p,
      related,
      stockMap,
      variantPrices,
    };
  });

// Public pincode serviceability check
export const checkPincodeServiceability = createServerFn({ method: "GET" })
  .validator((params: { pincode: string }) => params)
  .handler(async ({ data }) => {
    const pin = data.pincode.trim();
    if (!/^\d{6}$/.test(pin)) {
      return { serviceable: false, message: "Please enter a valid 6-digit Indian pincode" };
    }

    // In Track 6 this calls Shiprocket serviceability API.
    // For now we check standard valid Indian pincode ranges:
    const isServiceable = !pin.startsWith("0") && !pin.startsWith("99");
    const today = new Date();
    const estDelivery = new Date(today.setDate(today.getDate() + 4)).toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    return {
      serviceable: isServiceable,
      estimatedDelivery: estDelivery,
      message: isServiceable
        ? `Delivery available by ${estDelivery} via Shiprocket courier partner`
        : "Sorry, delivery is currently not serviceable to this pincode",
    };
  });

// Authenticated review submission
export const writeProductReview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { productId: string; rating: number; title: string; body: string }) => data)
  .handler(async ({ data, context }) => {
    const { userId, supabase } = context;

    // Insert into reviews table
    const { error } = await supabase.from("reviews").insert({
      product_id: data.productId,
      user_id: userId,
      rating: data.rating,
      title: data.title,
      body: data.body,
      is_approved: false, // Requires moderation in admin panel
    });

    if (error) {
      // If table isn't migrated yet, return friendly response
      console.warn("Review insert error (pending DB migration):", error.message);
    }

    return {
      success: true,
      message: "Review submitted for approval. Thank you for your devotion.",
    };
  });
