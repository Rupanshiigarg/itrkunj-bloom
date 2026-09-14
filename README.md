# Itrkunj Bloom

Build a modern, elegant e-commerce website for "Itrkunj" — a premium attar (traditional perfume oil) brand. The site should feel luxurious, warm, and rooted in Indian heritage, while being highly interactive, animated, and easy to use.

BRAND & VIBE

- Brand name: Itrkunj

- Positioning: Premium, authentic, alcohol-free attars with deep tradition and craftsmanship

- Color palette: Deep maroon/burgundy, gold/amber accents, ivory/cream background — evoke luxury, warmth, and spirituality (avoid generic e-commerce blue/white)

- Typography: An elegant serif or Devanagari-inspired display font for headings, clean sans-serif for body text

- Overall mood: Boutique perfumery meets temple aesthetic — rich textures, soft gradients, subtle gold foil/ornamental motifs (paisley, mandala line-art) used sparingly as design accents

CATEGORIES (core structure)

1. Thakur Sewa Attars — devotional attars for deity worship/puja rituals

2. Men's Attars — bold, woody, musky fragrances

3. Women's Attars — floral, sweet, delicate fragrances

(Also add an "All Attars" / "Shop All" view combining everything)

PAGES & SECTIONS

1. Home Page

   - Full-width animated hero section with a rotating/fading carousel of attar bottles and a tagline (e.g., "Fragrance of Devotion & Elegance")

   - Animated category cards (Thakur Sewa / Men / Women) that scale or glow on hover, linking to respective collections

   - "Bestsellers" or "Featured Attars" horizontal scrolling carousel

   - Brand story section with scroll-triggered fade-in/slide-in animations (why Itrkunj, craftsmanship, purity of ingredients)

   - Customer testimonials carousel with smooth auto-scroll

   - Instagram-style gallery section

   - Newsletter signup with animated input focus states

   - Sticky/animated "Add to Cart" mini-cart icon with item count badge

2. Category / Shop Pages

   - Filter sidebar (fragrance notes, price range, bottle size, gender/occasion) with smooth expand/collapse animations

   - Sort options (price, popularity, new arrivals)

   - Product grid with hover animations (image swap on hover, quick "Add to Cart" button that slides up)

   - Skeleton loading animations while products load

3. Product Detail Page

   - Image gallery with zoom-on-hover and smooth thumbnail switching

   - Animated "notes" breakdown (top/middle/base notes) shown as an interactive pyramid or expandable accordion

   - Size/quantity selector with live price update animation

   - "Add to Cart" button with a satisfying micro-animation (bounce, checkmark, or fly-to-cart effect)

   - Related products / "Pairs well with" carousel

   - Customer reviews with star ratings and expandable review cards

4. Thakur Sewa Special Section

   - Distinct devotional theme (subtle temple bell/diya iconography, soft gold shimmer animation)

   - Option to filter by deity or ritual occasion if applicable

   - Gift/bundle sets for pooja (e.g., attar + diya + incense combo)

5. Cart & Checkout

   - Slide-in cart drawer from the right with smooth open/close animation

   - Editable quantities with instant subtotal recalculation

   - Multi-step animated checkout (Cart → Address → Payment → Confirmation) with a progress indicator

   - Order confirmation page with a celebratory animation (confetti or gentle fade-in checkmark)

6. About Us Page

   - Storytelling layout with parallax or scroll-triggered image reveals

   - Timeline of brand journey (animated line/dot progression)

7. Contact Page

   - Simple animated contact form with input validation feedback

   - Embedded map (if physical store exists)

   - WhatsApp/quick contact floating button with pulse animation

GLOBAL INTERACTIONS & ANIMATIONS

- Smooth page transitions between routes (fade or slide)

- Sticky header that shrinks/changes background on scroll

- Scroll-triggered reveal animations (fade-up, stagger) for sections and product cards

- Hover micro-interactions on buttons, icons, and cards (scale, shadow, color shift)

- Animated mobile hamburger menu with slide-in navigation

- Loading states/skeletons for all async content (products, images)

- Toast notifications for "Added to cart," "Wishlist updated," etc. with slide-in/fade-out animation

- Wishlist feature (heart icon toggle with fill animation)

- Search bar with animated expand and live search suggestions

TECHNICAL & UX REQUIREMENTS

- Fully mobile-responsive, mobile-first design

- Fast-loading, optimized images with lazy loading

- Clear, intuitive navigation with breadcrumbs on deeper pages

- Accessible color contrast and readable font sizes

- Persistent cart (saved across sessions)

- Currency: Indian Rupees (₹)

- Include placeholder product data (attar names, prices, descriptions, images) across all three categories so the site looks fully populated for demo purposes

Please build this as a cohesive, production-quality design — polished, premium-feeling, and genuinely fun to browse, not a generic template.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e674c73c-a2ee-4367-bd83-373bc486b5c6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
