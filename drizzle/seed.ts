/**
 * drizzle/seed.ts
 *
 * Seeds all 9 products from the static catalog into the database.
 * Run with: bun drizzle/seed.ts
 *
 * Requires DATABASE_URL to be set in .env
 */
import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import * as schema from "./schema";

const { categories, products, productVariants, productImages, fragranceNotes } = schema;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Round price to nearest 10 */
function round10(n: number): number {
  return Math.round(n / 10) * 10;
}

/** Derive per-size price from base (6ml) price */
function variantPrice(basePrice: number, sizeMl: number): number {
  if (sizeMl === 3) return round10(basePrice * 0.5);
  if (sizeMl === 6) return basePrice;
  if (sizeMl === 12) return round10(basePrice * 1.8);
  throw new Error(`Unknown size: ${sizeMl}`);
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const CATEGORY_DATA = [
  {
    slug: "thakur-sewa",
    name: "Thakur Sewa",
    description: "Sacred attars crafted for divine worship and daily sewa rituals.",
    deity_tags: ["Krishna", "Radha Krishna", "Hanuman", "Vishnu"],
    occasion_tags: ["Daily Sewa", "Shringar", "Festivals", "Puja"],
    sort_order: 0,
  },
  {
    slug: "men",
    name: "Men's Attars",
    description: "Bold, earthy, and regal attars for the modern man.",
    deity_tags: [] as string[],
    occasion_tags: [] as string[],
    sort_order: 1,
  },
  {
    slug: "women",
    name: "Women's Attars",
    description: "Floral, delicate, and timeless attars for women.",
    deity_tags: [] as string[],
    occasion_tags: [] as string[],
    sort_order: 2,
  },
];

type ProductSeedData = {
  slug: string;
  name: string;
  categorySlug: string;
  subtitle: string;
  badge?: string;
  basePrice: number;
  sizes: number[];
  images: Array<{ url: string; alt: string; isPrimary: boolean }>;
  notes: { top: string[]; heart: string[]; base: string[] };
  sortOrder: number;
};

const PRODUCT_DATA: ProductSeedData[] = [
  {
    slug: "shri-chandan",
    name: "Shri Chandan",
    categorySlug: "thakur-sewa",
    subtitle: "Sacred sandalwood, saffron & lotus",
    badge: "Bestseller",
    basePrice: 1290,
    sizes: [3, 6, 12],
    images: [
      { url: "/src/assets/thakur-sewa.jpg", alt: "Shri Chandan primary", isPrimary: true },
      { url: "/src/assets/itrkunj-hero.jpg", alt: "Shri Chandan hero", isPrimary: false },
    ],
    notes: { top: ["Saffron", "Tulsi"], heart: ["Mysore Sandal"], base: ["Lotus", "Amber"] },
    sortOrder: 0,
  },
  {
    slug: "vrindavan-pushp",
    name: "Vrindavan Pushp",
    categorySlug: "thakur-sewa",
    subtitle: "Jasmine garland and temple rose",
    basePrice: 990,
    sizes: [3, 6, 12],
    images: [
      { url: "/src/assets/thakur-sewa.jpg", alt: "Vrindavan Pushp primary", isPrimary: true },
      { url: "/src/assets/attar-duo.jpg", alt: "Vrindavan Pushp duo", isPrimary: false },
    ],
    notes: { top: ["Mogra"], heart: ["Rose", "Kewra"], base: ["Sandalwood"] },
    sortOrder: 1,
  },
  {
    slug: "kesar-tilak",
    name: "Kesar Tilak",
    categorySlug: "thakur-sewa",
    subtitle: "Pure saffron warmth for auspicious rituals",
    badge: "Pure Extract",
    basePrice: 1490,
    sizes: [3, 6],
    images: [
      { url: "/src/assets/itrkunj-hero.jpg", alt: "Kesar Tilak primary", isPrimary: true },
      { url: "/src/assets/thakur-sewa.jpg", alt: "Kesar Tilak sewa", isPrimary: false },
    ],
    notes: { top: ["Kesar"], heart: ["Marigold"], base: ["Amber"] },
    sortOrder: 2,
  },
  {
    slug: "oud-e-shahi",
    name: "Oud-e-Shahi",
    categorySlug: "men",
    subtitle: "Regal oud, leather and smoked cedar",
    badge: "Iconic",
    basePrice: 1890,
    sizes: [6, 12],
    images: [
      { url: "/src/assets/attar-duo.jpg", alt: "Oud-e-Shahi primary", isPrimary: true },
      { url: "/src/assets/itrkunj-hero.jpg", alt: "Oud-e-Shahi hero", isPrimary: false },
    ],
    notes: { top: ["Bergamot", "Saffron"], heart: ["Oud", "Leather"], base: ["Cedar", "Musk"] },
    sortOrder: 0,
  },
  {
    slug: "khus-sultan",
    name: "Khus Sultan",
    categorySlug: "men",
    subtitle: "Earthy vetiver cooled with green herbs",
    basePrice: 1190,
    sizes: [3, 6, 12],
    images: [
      { url: "/src/assets/itrkunj-hero.jpg", alt: "Khus Sultan primary", isPrimary: true },
      { url: "/src/assets/attar-duo.jpg", alt: "Khus Sultan duo", isPrimary: false },
    ],
    notes: { top: ["Mint", "Lime"], heart: ["Khus"], base: ["Earth", "Musk"] },
    sortOrder: 1,
  },
  {
    slug: "musk-darbar",
    name: "Musk Darbar",
    categorySlug: "men",
    subtitle: "Velvet musk, tobacco and amber resin",
    badge: "New",
    basePrice: 1590,
    sizes: [6, 12],
    images: [
      { url: "/src/assets/attar-duo.jpg", alt: "Musk Darbar primary", isPrimary: true },
      { url: "/src/assets/thakur-sewa.jpg", alt: "Musk Darbar sewa", isPrimary: false },
    ],
    notes: { top: ["Cardamom"], heart: ["Tobacco", "Rose"], base: ["White Musk", "Amber"] },
    sortOrder: 2,
  },
  {
    slug: "gulab-noor",
    name: "Gulab Noor",
    categorySlug: "women",
    subtitle: "Dewy Kannauj rose and soft white musk",
    badge: "Most Loved",
    basePrice: 1390,
    sizes: [3, 6, 12],
    images: [
      { url: "/src/assets/attar-duo.jpg", alt: "Gulab Noor primary", isPrimary: true },
      { url: "/src/assets/thakur-sewa.jpg", alt: "Gulab Noor sewa", isPrimary: false },
    ],
    notes: { top: ["Pear", "Rosewater"], heart: ["Kannauj Rose"], base: ["White Musk"] },
    sortOrder: 0,
  },
  {
    slug: "mogra-rani",
    name: "Mogra Rani",
    categorySlug: "women",
    subtitle: "Moonlit jasmine and creamy sandalwood",
    basePrice: 1290,
    sizes: [3, 6, 12],
    images: [
      { url: "/src/assets/thakur-sewa.jpg", alt: "Mogra Rani primary", isPrimary: true },
      { url: "/src/assets/attar-duo.jpg", alt: "Mogra Rani duo", isPrimary: false },
    ],
    notes: { top: ["Mogra"], heart: ["Jasmine Sambac"], base: ["Sandalwood", "Vanilla"] },
    sortOrder: 1,
  },
  {
    slug: "zafran-rose",
    name: "Zafran Rose",
    categorySlug: "women",
    subtitle: "Saffron threads, rose and honeyed amber",
    badge: "Limited",
    basePrice: 1690,
    sizes: [6, 12],
    images: [
      { url: "/src/assets/itrkunj-hero.jpg", alt: "Zafran Rose primary", isPrimary: true },
      { url: "/src/assets/attar-duo.jpg", alt: "Zafran Rose duo", isPrimary: false },
    ],
    notes: { top: ["Saffron"], heart: ["Damask Rose", "Honey"], base: ["Amber"] },
    sortOrder: 2,
  },
];

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------

async function seed() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  const client = postgres(url, { max: 1 });
  const db = drizzle(client, { schema });

  console.log("🌱 Starting seed...");

  // ── 1. Insert categories ──────────────────────────────────────────────────
  console.log("  Inserting categories...");
  const insertedCategories = await db
    .insert(categories)
    .values(CATEGORY_DATA)
    .onConflictDoNothing({ target: categories.slug })
    .returning({ id: categories.id, slug: categories.slug });

  // Re-fetch all categories to build slug→id map (handles already-existing rows)
  const allCategories = await db
    .select({ id: categories.id, slug: categories.slug })
    .from(categories);
  const categoryMap = new Map(allCategories.map((c) => [c.slug, c.id]));
  console.log(
    `  ✓ ${insertedCategories.length} categories inserted (${allCategories.length} total)`,
  );

  // ── 2. Insert products, variants, images, fragrance notes ─────────────────
  for (const p of PRODUCT_DATA) {
    const categoryId = categoryMap.get(p.categorySlug);
    if (!categoryId) throw new Error(`Category not found: ${p.categorySlug}`);

    console.log(`  Inserting product: ${p.name}...`);

    // Product
    const [product] = await db
      .insert(products)
      .values({
        slug: p.slug,
        name: p.name,
        category_id: categoryId,
        subtitle: p.subtitle,
        badge: p.badge ?? null,
        is_published: true,
        sort_order: p.sortOrder,
      })
      .onConflictDoNothing({ target: products.slug })
      .returning({ id: products.id });

    // If already exists, fetch the existing product id
    let productId: string;
    if (product) {
      productId = product.id;
    } else {
      const [existing] = await db
        .select({ id: products.id })
        .from(products)
        .where(eq(products.slug, p.slug))
        .limit(1);
      if (!existing) throw new Error(`Product not found after insert: ${p.slug}`);
      productId = existing.id;
    }

    // Variants
    const variantRows = p.sizes.map((sizeMl) => ({
      product_id: productId,
      size_ml: sizeMl,
      price: variantPrice(p.basePrice, sizeMl),
      stock: 100,
      sku: `${p.slug}-${sizeMl}ml`,
    }));
    await db
      .insert(productVariants)
      .values(variantRows)
      .onConflictDoNothing({ target: productVariants.sku });

    // Images
    const imageRows = p.images.map((img, idx) => ({
      product_id: productId,
      storage_url: img.url,
      alt: img.alt,
      sort_order: idx,
      is_primary: img.isPrimary,
    }));
    await db.insert(productImages).values(imageRows).onConflictDoNothing();

    // Fragrance notes
    const noteRows: Array<{ product_id: string; note: string; type: string }> = [
      ...p.notes.top.map((note) => ({ product_id: productId, note, type: "top" })),
      ...p.notes.heart.map((note) => ({ product_id: productId, note, type: "heart" })),
      ...p.notes.base.map((note) => ({ product_id: productId, note, type: "base" })),
    ];
    await db.insert(fragranceNotes).values(noteRows).onConflictDoNothing();

    console.log(
      `  ✓ ${p.name} seeded (${p.sizes.length} variants, ${imageRows.length} images, ${noteRows.length} notes)`,
    );
  }

  console.log("\n✅ Seed complete!");
  await client.end();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
