import heroImage from "@/assets/itrkunj-hero.jpg";
import sewaImage from "@/assets/thakur-sewa.jpg";
import duoImage from "@/assets/attar-duo.jpg";

export type Category = "thakur-sewa" | "men" | "women";
export type Product = {
  id: string;
  slug: string;
  name: string;
  category: Category;
  subtitle: string;
  price: number;
  image: string;
  hoverImage: string;
  rating: number;
  reviews: number;
  notes: { top: string[]; heart: string[]; base: string[] };
  sizes: number[];
  badge?: string;
  deity?: string;
  occasion?: string;
};

export const products: Product[] = [
  {
    id: "1",
    slug: "shri-chandan",
    name: "Shri Chandan",
    category: "thakur-sewa",
    subtitle: "Sacred sandalwood, saffron & lotus",
    price: 1290,
    image: sewaImage,
    hoverImage: heroImage,
    rating: 4.9,
    reviews: 128,
    notes: { top: ["Saffron", "Tulsi"], heart: ["Mysore Sandal"], base: ["Lotus", "Amber"] },
    sizes: [3, 6, 12],
    badge: "Bestseller",
    deity: "Krishna",
    occasion: "Daily Sewa",
  },
  {
    id: "2",
    slug: "vrindavan-pushp",
    name: "Vrindavan Pushp",
    category: "thakur-sewa",
    subtitle: "Jasmine garland and temple rose",
    price: 990,
    image: sewaImage,
    hoverImage: duoImage,
    rating: 4.8,
    reviews: 86,
    notes: { top: ["Mogra"], heart: ["Rose", "Kewra"], base: ["Sandalwood"] },
    sizes: [3, 6, 12],
    deity: "Radha Krishna",
    occasion: "Shringar",
  },
  {
    id: "3",
    slug: "kesar-tilak",
    name: "Kesar Tilak",
    category: "thakur-sewa",
    subtitle: "Pure saffron warmth for auspicious rituals",
    price: 1490,
    image: heroImage,
    hoverImage: sewaImage,
    rating: 4.9,
    reviews: 74,
    notes: { top: ["Kesar"], heart: ["Marigold"], base: ["Amber"] },
    sizes: [3, 6],
    badge: "Pure Extract",
    deity: "Hanuman",
    occasion: "Festivals",
  },
  {
    id: "4",
    slug: "oud-e-shahi",
    name: "Oud-e-Shahi",
    category: "men",
    subtitle: "Regal oud, leather and smoked cedar",
    price: 1890,
    image: duoImage,
    hoverImage: heroImage,
    rating: 4.8,
    reviews: 211,
    notes: { top: ["Bergamot", "Saffron"], heart: ["Oud", "Leather"], base: ["Cedar", "Musk"] },
    sizes: [6, 12],
    badge: "Iconic",
  },
  {
    id: "5",
    slug: "khus-sultan",
    name: "Khus Sultan",
    category: "men",
    subtitle: "Earthy vetiver cooled with green herbs",
    price: 1190,
    image: heroImage,
    hoverImage: duoImage,
    rating: 4.7,
    reviews: 94,
    notes: { top: ["Mint", "Lime"], heart: ["Khus"], base: ["Earth", "Musk"] },
    sizes: [3, 6, 12],
  },
  {
    id: "6",
    slug: "musk-darbar",
    name: "Musk Darbar",
    category: "men",
    subtitle: "Velvet musk, tobacco and amber resin",
    price: 1590,
    image: duoImage,
    hoverImage: sewaImage,
    rating: 4.9,
    reviews: 167,
    notes: { top: ["Cardamom"], heart: ["Tobacco", "Rose"], base: ["White Musk", "Amber"] },
    sizes: [6, 12],
    badge: "New",
  },
  {
    id: "7",
    slug: "gulab-noor",
    name: "Gulab Noor",
    category: "women",
    subtitle: "Dewy Kannauj rose and soft white musk",
    price: 1390,
    image: duoImage,
    hoverImage: sewaImage,
    rating: 4.9,
    reviews: 183,
    notes: { top: ["Pear", "Rosewater"], heart: ["Kannauj Rose"], base: ["White Musk"] },
    sizes: [3, 6, 12],
    badge: "Most Loved",
  },
  {
    id: "8",
    slug: "mogra-rani",
    name: "Mogra Rani",
    category: "women",
    subtitle: "Moonlit jasmine and creamy sandalwood",
    price: 1290,
    image: sewaImage,
    hoverImage: duoImage,
    rating: 4.8,
    reviews: 149,
    notes: { top: ["Mogra"], heart: ["Jasmine Sambac"], base: ["Sandalwood", "Vanilla"] },
    sizes: [3, 6, 12],
  },
  {
    id: "9",
    slug: "zafran-rose",
    name: "Zafran Rose",
    category: "women",
    subtitle: "Saffron threads, rose and honeyed amber",
    price: 1690,
    image: heroImage,
    hoverImage: duoImage,
    rating: 4.7,
    reviews: 72,
    notes: { top: ["Saffron"], heart: ["Damask Rose", "Honey"], base: ["Amber"] },
    sizes: [6, 12],
    badge: "Limited",
  },
];

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
export const categoryNames: Record<Category, string> = {
  "thakur-sewa": "Thakur Sewa",
  men: "Men's Attars",
  women: "Women's Attars",
};
