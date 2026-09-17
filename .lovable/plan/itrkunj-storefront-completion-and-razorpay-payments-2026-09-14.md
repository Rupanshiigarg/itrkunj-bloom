# Itrkunj Storefront Completion and Razorpay Payments

## Goal

Finish the Itrkunj premium attar storefront and add a secure Razorpay checkout flow for demo-ready orders that can later accept live payments.

## Remaining storefront work

- Replace the `/` placeholder with the product-led home page: animated opening carousel, category gateways, bestsellers, brand story, testimonials, gallery, and newsletter.
- Add a validated `/contact` page with inquiry form, contact details placeholders clearly marked for replacement, and WhatsApp action without inventing real business details.
- Add a `/checkout` flow connected to the existing cart: customer details, address, order summary, payment step, validation, success confirmation, and clear empty-cart handling.
- Finish shopping interactions across existing pages: search suggestions, wishlist filtering, quick add feedback, cart quantity controls, and responsive mobile navigation.
- Polish product and collection pages with reviews, note details, accessible image labels, loading/empty states, and consistent breadcrumbs.
- Add unique metadata to every content route, including the home page, with title, description, Open Graph title/description/type, and Twitter card values.
- Validate the complete experience on desktop and mobile, including navigation, cart persistence, checkout states, keyboard access, reduced-motion behavior, and runtime errors.

## Razorpay integration

- Enable Lovable Cloud because order/payment state and secure server-side payment verification require persistent storage and server functions.
- Add a server-side Razorpay order-creation endpoint that validates the cart and checkout details, calculates totals from the catalog, and creates a Razorpay order.
- Add Razorpay checkout to the payment step using the public key ID in the browser; keep the key secret server-only.
- Add a server-side payment verification endpoint using Razorpay signature verification before marking an order paid.
- Add a public webhook endpoint for Razorpay events, protected with a webhook signature/secret, with idempotent handling for payment success, failure, refunds, and order updates.
- Store orders, order items, payment status, Razorpay order/payment identifiers, customer details, and timestamps with row-level access controls and explicit grants.
- Add clear test/live configuration boundaries so test payments can be verified before enabling live collection.
- Add safe failure states for declined payments, abandoned checkout, duplicate webhook delivery, invalid signatures, and retrying payment verification.

## Credentials and setup

- After approval, request the Razorpay Key ID, Key Secret, and Webhook Secret through secure project secrets; never place private values in source code.
- Configure the webhook URL after the endpoint exists and document the Razorpay dashboard settings needed for test and live modes.
- Do not claim that live payments are active until Razorpay account verification and live credentials are configured.

## Technical details

- Keep TanStack Start file-based routing and the existing design tokens/components.
- Use server functions for app-internal order and payment operations, and a public server route for Razorpay webhooks.
- Validate all request bodies with Zod, recalculate totals server-side, and never trust client-provided prices or payment status.
- Persist cart and wishlist in browser storage as the existing demo behavior; persist orders and payment records in Lovable Cloud.
