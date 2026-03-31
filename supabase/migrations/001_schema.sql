-- =====================================================================
-- ELECTRO.ma — Full Database Schema
-- Execute this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- =====================================================================

-- ========================================
-- ENUM TYPES
-- ========================================
CREATE TYPE product_condition AS ENUM ('NUEVO', 'USADO_A', 'USADO_B');
CREATE TYPE order_status AS ENUM ('PENDIENTE', 'CONFIRMADO', 'ENVIADO', 'ENTREGADO', 'RTO');

-- ========================================
-- PRODUCTS (catálogo base / plantilla)
-- ========================================
CREATE TABLE products (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  platform         TEXT NOT NULL,
  type             TEXT NOT NULL DEFAULT 'console',
  base_description TEXT NOT NULL DEFAULT '',
  main_image_url   TEXT,
  is_published     BOOLEAN NOT NULL DEFAULT false,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_slug ON products (slug);
CREATE INDEX idx_products_platform ON products (platform);
CREATE INDEX idx_products_published ON products (is_published) WHERE is_published = true;

-- ========================================
-- INVENTORY ITEMS (stock físico)
-- ========================================
CREATE TABLE inventory_items (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id     UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  condition      product_condition NOT NULL DEFAULT 'NUEVO',
  serial_number  TEXT,
  grade_notes    TEXT,
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  price          NUMERIC(10,2) NOT NULL CHECK (price > 0),
  extra_images   TEXT[] DEFAULT '{}',
  is_active      BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE inventory_items
  ADD CONSTRAINT chk_serial_for_used
  CHECK (
    (condition = 'NUEVO') OR (serial_number IS NOT NULL AND serial_number != '')
  );

CREATE INDEX idx_inventory_product ON inventory_items (product_id);
CREATE INDEX idx_inventory_condition ON inventory_items (condition);
CREATE INDEX idx_inventory_active ON inventory_items (is_active) WHERE is_active = true;

-- ========================================
-- PHONE NORMALIZATION FUNCTION
-- ========================================
CREATE OR REPLACE FUNCTION normalize_moroccan_phone(raw_phone TEXT)
RETURNS TEXT AS $$
DECLARE
  cleaned TEXT;
BEGIN
  cleaned := regexp_replace(raw_phone, '[\s\-\.\(\)]+', '', 'g');
  IF cleaned LIKE '00212%' THEN
    cleaned := '+212' || substring(cleaned from 6);
  ELSIF cleaned LIKE '0%' AND length(cleaned) = 10 THEN
    cleaned := '+212' || substring(cleaned from 2);
  ELSIF cleaned LIKE '+212%' THEN
    NULL;
  END IF;
  RETURN cleaned;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ========================================
-- CUSTOMERS
-- ========================================
CREATE TABLE customers (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone                 TEXT NOT NULL,
  full_name             TEXT NOT NULL,
  default_city          TEXT,
  successful_deliveries INTEGER NOT NULL DEFAULT 0,
  failed_deliveries     INTEGER NOT NULL DEFAULT 0,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_customers_phone_unique ON customers (phone);

-- ========================================
-- ORDERS
-- ========================================
CREATE TABLE orders (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id    UUID NOT NULL REFERENCES customers(id),
  delivery_name  TEXT NOT NULL,
  delivery_phone TEXT NOT NULL,
  city           TEXT NOT NULL,
  address        TEXT NOT NULL,
  total_amount   NUMERIC(10,2) NOT NULL CHECK (total_amount >= 0),
  status         order_status NOT NULL DEFAULT 'PENDIENTE',
  dispatch_notes TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_orders_customer ON orders (customer_id);
CREATE INDEX idx_orders_created ON orders (created_at DESC);

-- ========================================
-- ORDER ITEMS
-- ========================================
CREATE TABLE order_items (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id               UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  inventory_item_id      UUID NOT NULL REFERENCES inventory_items(id),
  quantity               INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price_at_purchase NUMERIC(10,2) NOT NULL CHECK (unit_price_at_purchase >= 0)
);

CREATE INDEX idx_order_items_order ON order_items (order_id);

-- ========================================
-- UPDATED_AT TRIGGER
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_inventory_updated_at
  BEFORE UPDATE ON inventory_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- PRODUCTS: public read for published, admin full access
CREATE POLICY "Public can read published products"
  ON products FOR SELECT USING (is_published = true);

CREATE POLICY "Admin full access to products"
  ON products FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- INVENTORY: public read for active, admin full access
CREATE POLICY "Public can read active inventory"
  ON inventory_items FOR SELECT USING (is_active = true);

CREATE POLICY "Admin full access to inventory"
  ON inventory_items FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- CUSTOMERS: admin only (service role writes from Server Actions)
CREATE POLICY "Admin full access to customers"
  ON customers FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ORDERS: admin only (service role writes from Server Actions)
CREATE POLICY "Admin full access to orders"
  ON orders FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ORDER_ITEMS: admin only (service role writes from Server Actions)
CREATE POLICY "Admin full access to order items"
  ON order_items FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- =====================================================================
-- STORAGE BUCKET
-- =====================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

CREATE POLICY "Public can read product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Admin can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Admin can update product images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Admin can delete product images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- =====================================================================
-- RPC: ATOMIC ORDER CREATION (race-condition safe)
-- =====================================================================
CREATE OR REPLACE FUNCTION create_order_atomic(
  p_inventory_item_id UUID,
  p_quantity          INTEGER,
  p_full_name         TEXT,
  p_phone             TEXT,
  p_city              TEXT,
  p_address           TEXT
)
RETURNS JSON AS $$
DECLARE
  v_phone_normalized TEXT;
  v_customer_id      UUID;
  v_order_id         UUID;
  v_item             RECORD;
  v_product_title    TEXT;
BEGIN
  v_phone_normalized := normalize_moroccan_phone(p_phone);

  SELECT ii.*, p.title INTO v_item
  FROM inventory_items ii
  JOIN products p ON p.id = ii.product_id
  WHERE ii.id = p_inventory_item_id
  FOR UPDATE OF ii;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Article introuvable');
  END IF;

  IF NOT v_item.is_active THEN
    RETURN json_build_object('success', false, 'error', 'Article indisponible');
  END IF;

  IF v_item.stock_quantity < p_quantity THEN
    RETURN json_build_object('success', false, 'error', 'Stock insuffisant');
  END IF;

  v_product_title := v_item.title;

  SELECT id INTO v_customer_id
  FROM customers
  WHERE phone = v_phone_normalized;

  IF NOT FOUND THEN
    INSERT INTO customers (phone, full_name, default_city)
    VALUES (v_phone_normalized, p_full_name, p_city)
    RETURNING id INTO v_customer_id;
  END IF;

  INSERT INTO orders (customer_id, delivery_name, delivery_phone, city, address, total_amount, status)
  VALUES (v_customer_id, p_full_name, v_phone_normalized, p_city, p_address, v_item.price * p_quantity, 'PENDIENTE')
  RETURNING id INTO v_order_id;

  INSERT INTO order_items (order_id, inventory_item_id, quantity, unit_price_at_purchase)
  VALUES (v_order_id, p_inventory_item_id, p_quantity, v_item.price);

  UPDATE inventory_items
  SET stock_quantity = stock_quantity - p_quantity,
      is_active = CASE
        WHEN condition != 'NUEVO' THEN false
        WHEN stock_quantity - p_quantity <= 0 THEN false
        ELSE is_active
      END
  WHERE id = p_inventory_item_id;

  RETURN json_build_object(
    'success', true,
    'order_id', v_order_id,
    'customer_id', v_customer_id,
    'product_title', v_product_title,
    'condition', v_item.condition,
    'total', v_item.price * p_quantity
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

REVOKE EXECUTE ON FUNCTION create_order_atomic FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION create_order_atomic FROM anon;
GRANT EXECUTE ON FUNCTION create_order_atomic TO service_role;
