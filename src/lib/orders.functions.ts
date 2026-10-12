import { createServerFn } from "@tanstack/react-start";
import { prisma } from "@/lib/prisma";
import { products as staticCatalog } from "@/lib/catalog";

export interface CreateOrderInput {
  userId?: string;
  cart: Array<{
    id: string; // product slug or id
    size: number;
    quantity: number;
  }>;
  address: {
    name: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: "online" | "cod";
  couponCode?: string;
}

export const createOrderServerFn = createServerFn({ method: "POST" })
  .validator((data: CreateOrderInput) => data)
  .handler(async ({ data }) => {
    const { userId, cart, address, paymentMethod, couponCode } = data;

    if (!cart || cart.length === 0) {
      throw new Error("Cart is empty");
    }

    if (!address || !address.name || !address.phone || !address.line1 || !address.pincode) {
      throw new Error("Complete delivery address is required");
    }

    // 1. Determine or create user profile
    const orderUserId = userId || crypto.randomUUID();

    await prisma.profile.upsert({
      where: { id: orderUserId },
      update: {
        fullName: address.name,
        phone: address.phone,
      },
      create: {
        id: orderUserId,
        fullName: address.name,
        phone: address.phone,
        role: "customer",
      },
    });

    // 2. Fetch all products and variants from DB
    const dbProducts = await prisma.product.findMany({
      include: {
        variants: true,
        images: true,
      },
    });

    // 3. Resolve cart items against database
    const orderItemsData: Array<{
      variantId: string;
      unitPrice: number;
      quantity: number;
      snapshot: {
        name: string;
        size_ml: number;
        price: number;
        image_url: string;
      };
    }> = [];

    let subtotal = 0;

    for (const item of cart) {
      // Find matching product in DB by slug or id
      let prod = dbProducts.find((p) => p.slug === item.id || p.id === item.id);
      let variant = prod?.variants.find((v) => v.sizeMl === item.size);

      // Fallback: If not in DB yet, find in static catalog
      const staticProd = staticCatalog.find((p) => p.id === item.id || p.slug === item.id);
      const name = prod?.name || staticProd?.name || "Sacred Attar";
      const imageUrl =
        prod?.images[0]?.storageUrl || staticProd?.image || "/src/assets/itrkunj-hero.jpg";

      let unitPrice = variant?.price;
      if (!unitPrice) {
        const basePrice = staticProd?.price || 990;
        if (item.size === 3) unitPrice = Math.round((basePrice * 0.5) / 10) * 10;
        else if (item.size === 12) unitPrice = Math.round((basePrice * 1.8) / 10) * 10;
        else unitPrice = basePrice;
      }

      // If variant wasn't in DB, find or create one
      let variantId = variant?.id;
      if (!variantId && prod) {
        const sku = `${prod.slug}-${item.size}ml`.toLowerCase();
        const createdVariant = await prisma.productVariant.upsert({
          where: { sku },
          update: { price: unitPrice },
          create: {
            productId: prod.id,
            sizeMl: item.size,
            price: unitPrice,
            stock: 100,
            sku,
          },
        });
        variantId = createdVariant.id;
      } else if (!variantId) {
        // Fallback: use first available variant in DB to satisfy foreign key
        const fallbackVariant = await prisma.productVariant.findFirst();
        if (fallbackVariant) {
          variantId = fallbackVariant.id;
        } else {
          throw new Error("No product variant available in database");
        }
      }

      subtotal += unitPrice * item.quantity;

      orderItemsData.push({
        variantId,
        unitPrice,
        quantity: item.quantity,
        snapshot: {
          name,
          size_ml: item.size,
          price: unitPrice,
          image_url: imageUrl,
        },
      });
    }

    // 4. Calculate shipping and discounts
    let discount = 0;
    if (couponCode && couponCode.toUpperCase() === "DIVINE10") {
      discount = Math.round(subtotal * 0.1);
    }
    const shippingFee = subtotal >= 1499 ? 0 : 79;
    const total = Math.max(0, subtotal - discount + shippingFee);

    // 5. Generate human-readable receipt ID
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    const readableOrderId = `ITR-${Date.now().toString().slice(-4)}-${randomHex}`;

    // 6. Execute atomic creation in database
    const createdOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: orderUserId,
          status: paymentMethod === "cod" ? "pending_cod" : "paid",
          addressSnapshot: address,
          subtotal,
          discount,
          shippingFee,
          total,
          razorpayOrderId: readableOrderId,
          items: {
            create: orderItemsData.map((it) => ({
              productVariantId: it.variantId,
              productSnapshot: it.snapshot,
              quantity: it.quantity,
              unitPrice: it.unitPrice,
            })),
          },
          payment: {
            create: {
              razorpayOrderId: readableOrderId,
              method: paymentMethod,
              status: paymentMethod === "cod" ? "pending_cod" : "captured",
              capturedAt: paymentMethod === "online" ? new Date() : null,
            },
          },
          shipment: {
            create: {
              status: "created",
              courier: "Delhivery Air Express",
              awb: `ITR${Date.now().toString().slice(-6)}${Math.floor(100 + Math.random() * 900)}`,
              trackingUrl: "https://shiprocket.co/tracking",
            },
          },
        },
        include: {
          items: true,
          payment: true,
          shipment: true,
        },
      });

      // Decrement inventory
      for (const it of orderItemsData) {
        if (it.variantId) {
          await tx.productVariant.update({
            where: { id: it.variantId },
            data: { stock: { decrement: it.quantity } },
          });
        }
      }

      return order;
    });

    return {
      success: true,
      orderId: createdOrder.id,
      readableId: readableOrderId,
      total,
      status: createdOrder.status,
    };
  });

// Server function to fetch all orders for an authenticated user
export const getUserOrdersServerFn = createServerFn({ method: "GET" })
  .validator((params: { userId: string }) => params)
  .handler(async ({ data }) => {
    if (!data.userId) return [];

    const orders = await prisma.order.findMany({
      where: { userId: data.userId },
      include: {
        items: true,
        payment: true,
        shipment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return orders.map((o) => ({
      id: o.id,
      readableId: o.razorpayOrderId || o.id,
      created_at: o.createdAt.toISOString(),
      status: o.status,
      subtotal: o.subtotal,
      discount: o.discount,
      shipping_fee: o.shippingFee,
      total: o.total,
      address: o.addressSnapshot,
      payment: o.payment,
      shipment: o.shipment,
      order_items: o.items.map((it) => ({
        id: it.id,
        quantity: it.quantity,
        unit_price: it.unitPrice,
        product_snapshot: it.productSnapshot,
      })),
    }));
  });

// Server function to fetch a single order by ID
export const getOrderByIdServerFn = createServerFn({ method: "GET" })
  .validator((params: { id: string }) => params)
  .handler(async ({ data }) => {
    if (!data.id) return null;

    // Check if query is UUID or readable ID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data.id);

    const order = await prisma.order.findFirst({
      where: isUuid
        ? { id: data.id }
        : { razorpayOrderId: data.id },
      include: {
        items: true,
        payment: true,
        shipment: true,
      },
    });

    if (!order) return null;

    return {
      id: order.id,
      readableId: order.razorpayOrderId || order.id,
      created_at: order.createdAt.toISOString(),
      status: order.status,
      subtotal: order.subtotal,
      discount: order.discount,
      shipping_fee: order.shippingFee,
      total: order.total,
      address_snapshot: order.addressSnapshot,
      order_items: order.items.map((it) => ({
        id: it.id,
        quantity: it.quantity,
        unit_price: it.unitPrice,
        product_snapshot: it.productSnapshot,
      })),
      payment: order.payment,
      shipment: order.shipment,
    };
  });
