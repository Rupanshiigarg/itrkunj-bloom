# Itrkunj Premium Attar Store

## Goal
Build a polished, mobile-first demo storefront for Itrkunj that feels like a luxurious Indian perfumery: warm ivory surfaces, deep maroon, amber-gold details, elegant typography, restrained ornamental motifs, and smooth purposeful motion.

## Pages and navigation
- Shared shrinking header with Shop All, Thakur Sewa, Men, Women, About, Contact, search, wishlist, and persistent cart.
- Home page with an animated product-led opening carousel, three category gateways, horizontal bestsellers, brand story, testimonials, gallery, and newsletter.
- Shop All and category pages with breadcrumbs, collapsible filters, sorting, skeleton states, image-hover product cards, wishlist, and quick add.
- Product detail pages with image gallery, hover zoom, fragrance-note pyramid, size and quantity pricing, animated add-to-cart, related products, and reviews.
- Dedicated Thakur Sewa presentation with deity and ritual filters plus pooja gift bundles.
- About page with image-led storytelling and an animated brand timeline.
- Contact page with validated form and a floating WhatsApp action; no map will be shown because no physical store details were provided.
- Checkout flow with cart, address, payment, and confirmation steps plus a celebratory completion state.

## Shopping experience
- Populate all collections with believable demo attars, Indian Rupee pricing, sizes, notes, descriptions, reviews, and generated bottle photography.
- Add live search suggestions, wishlist toggles, quick add, quantity controls, subtotal updates, a slide-in cart, and toast feedback.
- Persist cart and wishlist in the browser across visits.
- Keep payment and order placement as a clearly presented demo flow; no real payment processor or order backend will be connected.

## Visual and motion system
- Use a refined serif display face paired with a readable sans-serif body face.
- Create semantic maroon, vermilion, saffron-gold, ivory, charcoal, and floral accent tokens.
- Generate a cohesive set of premium attar bottle and ritual still-life imagery rather than using placeholders.
- Add subtle foil lines, restrained mandala/paisley accents, page fades, scroll reveals, carousel motion, cart transitions, button feedback, and reduced-motion support.
- Ensure stable responsive layouts, accessible contrast, keyboard-friendly controls, descriptive image text, and optimized lazy-loaded media.

## Technical approach
- Build reusable catalog, product-card, header, cart, search, filtering, and checkout components around a typed local demo catalog.
- Create dedicated TanStack routes for each major page and unique search/social metadata per route.
- Use browser storage only for demo cart and wishlist persistence.
- Validate the key paths and interactions at desktop and mobile sizes in the running preview.
