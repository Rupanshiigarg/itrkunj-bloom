import {
  boolean,
  date,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ---------------------------------------------------------------------------
// profiles
// ---------------------------------------------------------------------------
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  // Note: id references auth.users — FK is managed by Supabase, not Drizzle
  full_name: text("full_name"),
  phone: text("phone"),
  role: text("role").default("customer").notNull(), // 'customer' | 'admin'
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// ---------------------------------------------------------------------------
// addresses
// ---------------------------------------------------------------------------
export const addresses = pgTable("addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  line1: text("line1").notNull(),
  line2: text("line2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  pincode: text("pincode").notNull(),
  is_default: boolean("is_default").default(false),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// ---------------------------------------------------------------------------
// categories
// ---------------------------------------------------------------------------
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").unique().notNull(),
  name: text("name").notNull(),
  description: text("description"),
  deity_tags: text("deity_tags").array().default([]),
  occasion_tags: text("occasion_tags").array().default([]),
  sort_order: integer("sort_order").default(0),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// ---------------------------------------------------------------------------
// products
// ---------------------------------------------------------------------------
export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").unique().notNull(),
  name: text("name").notNull(),
  category_id: uuid("category_id").notNull(),
  subtitle: text("subtitle"),
  description: text("description"),
  badge: text("badge"),
  is_published: boolean("is_published").default(true),
  sort_order: integer("sort_order").default(0),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// ---------------------------------------------------------------------------
// product_variants
// ---------------------------------------------------------------------------
export const productVariants = pgTable("product_variants", {
  id: uuid("id").primaryKey().defaultRandom(),
  product_id: uuid("product_id").notNull(),
  size_ml: integer("size_ml").notNull(), // 3, 6, or 12
  price: integer("price").notNull(), // in rupees (NOT paise)
  stock: integer("stock").default(100),
  sku: text("sku").unique().notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// ---------------------------------------------------------------------------
// product_images
// ---------------------------------------------------------------------------
export const productImages = pgTable("product_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  product_id: uuid("product_id").notNull(),
  storage_url: text("storage_url").notNull(),
  alt: text("alt"),
  sort_order: integer("sort_order").default(0),
  is_primary: boolean("is_primary").default(false),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// ---------------------------------------------------------------------------
// fragrance_notes
// ---------------------------------------------------------------------------
export const fragranceNotes = pgTable("fragrance_notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  product_id: uuid("product_id").notNull(),
  note: text("note").notNull(), // e.g. 'Saffron', 'Rose'
  type: text("type").notNull(), // 'top' | 'heart' | 'base'
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// ---------------------------------------------------------------------------
// orders
// ---------------------------------------------------------------------------
export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull(),
  status: text("status").default("pending_payment").notNull(),
  // pending_payment | pending_cod | paid | processing | shipped | delivered | cancelled | refunded
  address_snapshot: jsonb("address_snapshot").notNull(), // full address object at time of order
  subtotal: integer("subtotal").notNull(), // rupees
  discount: integer("discount").default(0), // rupees
  shipping_fee: integer("shipping_fee").default(0), // rupees
  total: integer("total").notNull(), // rupees
  coupon_id: uuid("coupon_id"), // nullable
  razorpay_order_id: text("razorpay_order_id").unique(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// ---------------------------------------------------------------------------
// order_items
// ---------------------------------------------------------------------------
export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  order_id: uuid("order_id").notNull(),
  product_variant_id: uuid("product_variant_id").notNull(),
  product_snapshot: jsonb("product_snapshot").notNull(), // { name, size_ml, price, image_url }
  quantity: integer("quantity").notNull(),
  unit_price: integer("unit_price").notNull(), // rupees
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// ---------------------------------------------------------------------------
// payments
// ---------------------------------------------------------------------------
export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  order_id: uuid("order_id").notNull().unique(),
  razorpay_order_id: text("razorpay_order_id").notNull(),
  razorpay_payment_id: text("razorpay_payment_id"),
  razorpay_signature: text("razorpay_signature"),
  method: text("method"), // 'upi' | 'card' | 'netbanking' | 'cod'
  status: text("status").default("created").notNull(), // created | captured | failed | refunded
  captured_at: timestamp("captured_at"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// ---------------------------------------------------------------------------
// shipments
// ---------------------------------------------------------------------------
export const shipments = pgTable("shipments", {
  id: uuid("id").primaryKey().defaultRandom(),
  order_id: uuid("order_id").notNull().unique(),
  shiprocket_order_id: text("shiprocket_order_id"),
  shiprocket_shipment_id: text("shiprocket_shipment_id"),
  awb: text("awb"),
  courier: text("courier"),
  tracking_url: text("tracking_url"),
  status: text("status").default("created").notNull(),
  // created | pickup_scheduled | in_transit | out_for_delivery | delivered | undelivered | rto
  estimated_delivery: date("estimated_delivery"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// ---------------------------------------------------------------------------
// coupons
// ---------------------------------------------------------------------------
export const coupons = pgTable("coupons", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").unique().notNull(), // uppercase e.g. 'DIVINE10'
  type: text("type").notNull(), // 'percent' | 'flat'
  value: integer("value").notNull(), // percentage (10 = 10%) or flat rupees
  min_order: integer("min_order").default(0),
  max_uses: integer("max_uses"), // null = unlimited
  used_count: integer("used_count").default(0),
  expires_at: timestamp("expires_at"), // null = never
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// ---------------------------------------------------------------------------
// coupon_uses
// ---------------------------------------------------------------------------
export const couponUses = pgTable("coupon_uses", {
  id: uuid("id").primaryKey().defaultRandom(),
  coupon_id: uuid("coupon_id").notNull(),
  user_id: uuid("user_id").notNull(),
  order_id: uuid("order_id").notNull().unique(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// ---------------------------------------------------------------------------
// reviews
// ---------------------------------------------------------------------------
export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  product_id: uuid("product_id").notNull(),
  user_id: uuid("user_id").notNull(),
  order_item_id: uuid("order_item_id").notNull().unique(),
  rating: integer("rating").notNull(), // 1-5
  title: text("title"),
  body: text("body"),
  is_approved: boolean("is_approved").default(false),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// ---------------------------------------------------------------------------
// wishlist_items — composite PK (user_id, product_id)
// ---------------------------------------------------------------------------
export const wishlistItems = pgTable(
  "wishlist_items",
  {
    user_id: uuid("user_id").notNull(),
    product_id: uuid("product_id").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.user_id, table.product_id] })],
);

// ---------------------------------------------------------------------------
// shiprocket_tokens — token cache for Shiprocket API (Track 6)
// ---------------------------------------------------------------------------
export const shiprocketTokens = pgTable("shiprocket_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  token: text("token").notNull(),
  expires_at: timestamp("expires_at").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// ===========================================================================
// RELATIONS
// ===========================================================================

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.category_id],
    references: [categories.id],
  }),
  variants: many(productVariants),
  images: many(productImages),
  fragranceNotes: many(fragranceNotes),
}));

export const productVariantsRelations = relations(productVariants, ({ one }) => ({
  product: one(products, {
    fields: [productVariants.product_id],
    references: [products.id],
  }),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.product_id],
    references: [products.id],
  }),
}));

export const fragranceNotesRelations = relations(fragranceNotes, ({ one }) => ({
  product: one(products, {
    fields: [fragranceNotes.product_id],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ many, one }) => ({
  items: many(orderItems),
  payment: one(payments, {
    fields: [orders.id],
    references: [payments.order_id],
  }),
  shipment: one(shipments, {
    fields: [orders.id],
    references: [shipments.order_id],
  }),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.order_id],
    references: [orders.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.order_id],
    references: [orders.id],
  }),
}));

export const shipmentsRelations = relations(shipments, ({ one }) => ({
  order: one(orders, {
    fields: [shipments.order_id],
    references: [orders.id],
  }),
}));
