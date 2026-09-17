-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_uses ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
-- Public tables (no RLS needed for reads): products, product_variants, product_images, fragrance_notes, categories, coupons

-- PROFILES
CREATE POLICY "users_select_own_profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "users_update_own_profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- ADDRESSES
CREATE POLICY "users_select_own_addresses" ON addresses FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "users_insert_own_addresses" ON addresses FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_update_own_addresses" ON addresses FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "users_delete_own_addresses" ON addresses FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ORDERS
CREATE POLICY "users_select_own_orders" ON orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "users_insert_own_orders" ON orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- ORDER_ITEMS
CREATE POLICY "users_select_own_order_items" ON order_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

-- PAYMENTS
CREATE POLICY "users_select_own_payments" ON payments FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = payments.order_id AND orders.user_id = auth.uid()));

-- SHIPMENTS
CREATE POLICY "users_select_own_shipments" ON shipments FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = shipments.order_id AND orders.user_id = auth.uid()));

-- WISHLIST
CREATE POLICY "users_select_own_wishlist" ON wishlist_items FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "users_insert_own_wishlist" ON wishlist_items FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_delete_own_wishlist" ON wishlist_items FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- REVIEWS (public read for approved, authenticated write)
CREATE POLICY "public_select_approved_reviews" ON reviews FOR SELECT TO anon, authenticated USING (is_approved = true);
CREATE POLICY "users_insert_own_reviews" ON reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_select_own_reviews" ON reviews FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- COUPON_USES
CREATE POLICY "users_select_own_coupon_uses" ON coupon_uses FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist_items(user_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
