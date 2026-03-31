# Sprint 2 — Supabase: Base de Datos, Storage y Clientes

## Objetivo

Configurar toda la infraestructura backend: crear el proyecto Supabase, definir las tablas según el ERD, aplicar Row Level Security (RLS), configurar Storage para imágenes, generar los tipos TypeScript y crear los clientes server/browser reutilizables.

**Dependencia:** Sprint 1 completado (shell de Next.js funcional).

---

## Tareas

### 2.1 — Crear proyecto Supabase

1. Crear un nuevo proyecto en [supabase.com](https://supabase.com) (región: EU West / Frankfurt).
2. Copiar las credenciales al proyecto:

```
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

3. Instalar las dependencias:

```bash
npm install @supabase/supabase-js @supabase/ssr
```

---

### 2.2 — Crear esquema de Base de Datos (SQL)

Ejecutar en el SQL Editor de Supabase:

```sql
-- ========================================
-- ENUM TYPES
-- ========================================
CREATE TYPE product_condition AS ENUM ('NUEVO', 'USADO_A', 'USADO_B');
CREATE TYPE order_status AS ENUM ('PENDIENTE', 'CONFIRMADO', 'ENVIADO', 'ENTREGADO', 'RTO');

-- ========================================
-- PRODUCTS (catálogo base / plantilla)
-- ========================================
CREATE TABLE products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  platform    TEXT NOT NULL,           -- 'PS5', 'Xbox', 'Nintendo', 'PC', 'Accessoire'
  type        TEXT NOT NULL DEFAULT 'console', -- 'console', 'game', 'accessory'
  base_description TEXT NOT NULL DEFAULT '',
  main_image_url   TEXT,
  is_published     BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_slug ON products (slug);
CREATE INDEX idx_products_platform ON products (platform);
CREATE INDEX idx_products_published ON products (is_published) WHERE is_published = true;

-- ========================================
-- INVENTORY ITEMS (stock físico)
-- ========================================
CREATE TABLE inventory_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  condition       product_condition NOT NULL DEFAULT 'NUEVO',
  serial_number   TEXT,                -- Obligatorio si condition != 'NUEVO'
  grade_notes     TEXT,                -- "Pequeño rayón en esquina", etc.
  stock_quantity  INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  price           NUMERIC(10,2) NOT NULL CHECK (price > 0),  -- en MAD
  extra_images    TEXT[] DEFAULT '{}',
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Constraint: serial_number obligatorio para items usados
ALTER TABLE inventory_items
  ADD CONSTRAINT chk_serial_for_used
  CHECK (
    (condition = 'NUEVO') OR (serial_number IS NOT NULL AND serial_number != '')
  );

CREATE INDEX idx_inventory_product ON inventory_items (product_id);
CREATE INDEX idx_inventory_condition ON inventory_items (condition);
CREATE INDEX idx_inventory_active ON inventory_items (is_active) WHERE is_active = true;

-- ========================================
-- CUSTOMERS
-- ========================================
CREATE TABLE customers (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone                 TEXT NOT NULL,            -- Formato normalizado: +212XXXXXXXXX
  full_name             TEXT NOT NULL,
  default_city          TEXT,
  successful_deliveries INTEGER NOT NULL DEFAULT 0,
  failed_deliveries     INTEGER NOT NULL DEFAULT 0,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índice único sobre teléfono normalizado (no UNIQUE constraint directo).
-- La normalización se hace en la función RPC y en el backend antes de buscar.
CREATE UNIQUE INDEX idx_customers_phone_unique ON customers (phone);
CREATE INDEX idx_customers_phone ON customers (phone);

-- ========================================
-- FUNCIÓN: Normalizar teléfonos marroquíes
-- ========================================
-- Convierte cualquier formato (06..., +212 6..., 00212-6...) al canónico +212XXXXXXXXX.
-- Se usa en la RPC de checkout y debe usarse siempre antes de buscar un customer.
CREATE OR REPLACE FUNCTION normalize_moroccan_phone(raw_phone TEXT)
RETURNS TEXT AS $$
DECLARE
  cleaned TEXT;
BEGIN
  -- Eliminar espacios, guiones, puntos y paréntesis
  cleaned := regexp_replace(raw_phone, '[\s\-\.\(\)]+', '', 'g');
  -- 00212... → +212...
  IF cleaned LIKE '00212%' THEN
    cleaned := '+212' || substring(cleaned from 6);
  -- 0X... → +212X...
  ELSIF cleaned LIKE '0%' AND length(cleaned) = 10 THEN
    cleaned := '+212' || substring(cleaned from 2);
  -- Si ya empieza con +212, dejarlo
  ELSIF cleaned LIKE '+212%' THEN
    -- noop
  END IF;
  RETURN cleaned;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ========================================
-- ORDERS
-- ========================================
CREATE TABLE orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id     UUID NOT NULL REFERENCES customers(id),
  delivery_name   TEXT NOT NULL,
  delivery_phone  TEXT NOT NULL,
  city            TEXT NOT NULL,
  address         TEXT NOT NULL,
  total_amount    NUMERIC(10,2) NOT NULL CHECK (total_amount >= 0),
  status          order_status NOT NULL DEFAULT 'PENDIENTE',
  dispatch_notes  TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_orders_customer ON orders (customer_id);
CREATE INDEX idx_orders_created ON orders (created_at DESC);

-- ========================================
-- ORDER ITEMS
-- ========================================
CREATE TABLE order_items (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id                UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  inventory_item_id       UUID NOT NULL REFERENCES inventory_items(id),
  quantity                INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price_at_purchase  NUMERIC(10,2) NOT NULL CHECK (unit_price_at_purchase >= 0)
);

CREATE INDEX idx_order_items_order ON order_items (order_id);

-- ========================================
-- UPDATED_AT TRIGGER (reutilizable)
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
```

---

### 2.3 — Row Level Security (RLS)

> **DECISIÓN DE SEGURIDAD CRÍTICA:** Las tablas `customers`, `orders` y `order_items`
> NO permiten INSERT anónimo. Un atacante con la `ANON_KEY` pública podría enviar
> peticiones REST directas a Supabase y crear millones de pedidos falsos saltándose
> el frontend. Toda escritura en estas tablas se hace exclusivamente desde Server
> Actions usando el cliente con `SUPABASE_SERVICE_ROLE_KEY` (que bypasea RLS).

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- ============================
-- PRODUCTS: lectura pública para publicados, escritura solo admin
-- ============================
CREATE POLICY "Public can read published products"
  ON products FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admin full access to products"
  ON products FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================
-- INVENTORY_ITEMS: lectura pública para activos, escritura solo admin
-- ============================
CREATE POLICY "Public can read active inventory"
  ON inventory_items FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin full access to inventory"
  ON inventory_items FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================
-- CUSTOMERS: solo admin (Service Role escribe desde Server Actions)
-- ============================
CREATE POLICY "Admin full access to customers"
  ON customers FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ⛔ NO hay policy de INSERT anónimo. La creación de clientes se hace
--    exclusivamente desde Server Actions con SUPABASE_SERVICE_ROLE_KEY.

-- ============================
-- ORDERS: solo admin (Service Role escribe desde Server Actions)
-- ============================
CREATE POLICY "Admin full access to orders"
  ON orders FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ⛔ NO hay policy de INSERT anónimo. Los pedidos se crean desde
--    la Server Action del checkout usando Service Role.

-- ============================
-- ORDER_ITEMS: solo admin (Service Role escribe desde Server Actions)
-- ============================
CREATE POLICY "Admin full access to order items"
  ON order_items FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ⛔ NO hay policy de INSERT anónimo.
```

**¿Por qué este diseño?** La clave pública `NEXT_PUBLIC_SUPABASE_ANON_KEY` es
visible en el frontend. Un atacante podría hacer `fetch("https://xxx.supabase.co/rest/v1/orders", { method: "POST", ... })`
directamente. Al denegar todo INSERT anónimo vía RLS, la única vía para crear
pedidos es la Server Action de Next.js, que valida con Zod, aplica rate limiting
y escribe usando el Service Role Key (que jamás se expone al navegador).

---

### 2.4 — Supabase Storage (Bucket de imágenes)

1. Crear bucket `product-images` en Supabase Dashboard → Storage.
2. Configurar como **público** para lectura (las URLs de imagen serán directas).
3. Policy de escritura: solo usuarios autenticados (admin).

```sql
-- Storage policies (ejecutar en SQL Editor)
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

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
```

---

### 2.5 — Función RPC Atómica para Checkout (PostgreSQL)

> **DECISIÓN DE ARQUITECTURA CRÍTICA:** La creación de pedidos NO se hace con
> queries secuenciales desde la Server Action. Se delega a una función RPC en
> PostgreSQL que ejecuta todo dentro de una transacción ACID con `SELECT ... FOR UPDATE`
> para evitar race conditions (dos usuarios comprando la última unidad simultáneamente).

```sql
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
  -- 1. Normalizar teléfono
  v_phone_normalized := normalize_moroccan_phone(p_phone);

  -- 2. Bloquear el inventory_item con FOR UPDATE (previene race conditions)
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

  -- 3. Buscar o crear customer (por teléfono normalizado)
  SELECT id INTO v_customer_id
  FROM customers
  WHERE phone = v_phone_normalized;

  IF NOT FOUND THEN
    INSERT INTO customers (phone, full_name, default_city)
    VALUES (v_phone_normalized, p_full_name, p_city)
    RETURNING id INTO v_customer_id;
  END IF;

  -- 4. Crear order
  INSERT INTO orders (customer_id, delivery_name, delivery_phone, city, address, total_amount, status)
  VALUES (v_customer_id, p_full_name, v_phone_normalized, p_city, p_address, v_item.price * p_quantity, 'PENDIENTE')
  RETURNING id INTO v_order_id;

  -- 5. Crear order_item
  INSERT INTO order_items (order_id, inventory_item_id, quantity, unit_price_at_purchase)
  VALUES (v_order_id, p_inventory_item_id, p_quantity, v_item.price);

  -- 6. Decrementar stock atómicamente
  UPDATE inventory_items
  SET stock_quantity = stock_quantity - p_quantity,
      is_active = CASE
        WHEN condition != 'NUEVO' THEN false  -- Item usado: desactivar tras venta
        WHEN stock_quantity - p_quantity <= 0 THEN false
        ELSE is_active
      END
  WHERE id = p_inventory_item_id;

  -- 7. Retornar resultado exitoso
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

-- Solo el service_role puede invocar esta función (no el anon key)
REVOKE EXECUTE ON FUNCTION create_order_atomic FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION create_order_atomic FROM anon;
GRANT EXECUTE ON FUNCTION create_order_atomic TO service_role;
```

**¿Por qué `SELECT ... FOR UPDATE`?** Si dos requests llegan al mismo milisegundo
para la última PS5 usada (stock=1), el primero bloquea la fila. El segundo espera.
Cuando el primero termina (stock→0, is_active→false), el segundo lee stock=0 y
recibe el error "Stock insuffisant". Sin esta técnica, ambos leerían stock=1 y
el inventario quedaría en -1.

**¿Por qué `SECURITY DEFINER`?** La función se ejecuta con los permisos de quien la
creó (superadmin), no del caller. Combinado con `REVOKE ... FROM anon`, solo el
Service Role puede invocarla, nunca un request directo con la anon key.

---

### 2.6 — Clientes Supabase (Server, Browser y Service Role)

**Archivos a crear:**

```
lib/supabase/
├── client.ts        → Cliente para componentes Client ("use client")
├── server.ts        → Cliente para Server Components (usa cookies, respeta RLS)
├── service-role.ts  → Cliente con Service Role Key (bypasea RLS, para Server Actions de checkout)
└── middleware.ts     → Cliente para el middleware de Next.js
```

**`lib/supabase/client.ts`** — Usa `createBrowserClient` de `@supabase/ssr`. Solo lectura pública (productos, inventario). No puede escribir en customers/orders por RLS.

**`lib/supabase/server.ts`** — Usa `createServerClient` de `@supabase/ssr` con acceso a `cookies()` de Next.js. Función asíncrona porque `cookies()` es async en Next.js 15+. Respeta RLS.

**`lib/supabase/service-role.ts`** — Cliente especial que usa `SUPABASE_SERVICE_ROLE_KEY`. **Bypasea RLS completamente.** Se usa EXCLUSIVAMENTE en:
- Server Action del checkout (invocar `create_order_atomic` RPC).
- Server Actions del admin (CRUD de productos cuando el admin está autenticado).

```typescript
import { createClient } from "@supabase/supabase-js";

export function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
```

> **SEGURIDAD:** Este archivo SOLO se importa en Server Actions / Route Handlers.
> Jamás en Client Components. La variable `SUPABASE_SERVICE_ROLE_KEY` no tiene
> prefijo `NEXT_PUBLIC_` y nunca llega al navegador.

**`lib/supabase/middleware.ts`** — Usa `createServerClient` con `request/response` para refresh de tokens en el middleware.

---

### 2.6 — Generar tipos TypeScript desde Supabase

```bash
npx supabase login
npx supabase gen types typescript --project-id <project-ref> > types/database.types.ts
```

Esto sobreescribe el placeholder creado en Sprint 1 con tipos reales auto-generados del esquema.

Actualizar `types/index.ts` para derivar los tipos de `database.types.ts`:

```typescript
import type { Database } from "./database.types";

type Tables = Database["public"]["Tables"];

export type Product = Tables["products"]["Row"];
export type ProductInsert = Tables["products"]["Insert"];
export type InventoryItem = Tables["inventory_items"]["Row"];
export type Customer = Tables["customers"]["Row"];
export type Order = Tables["orders"]["Row"];
export type OrderItem = Tables["order_items"]["Row"];
// ... etc
```

---

### 2.7 — Helper de formateo MAD

Añadir a `lib/utils.ts`:

```typescript
export function formatMAD(amount: number): string {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
```

---

## Archivos creados / modificados

| Acción | Archivo |
|--------|---------|
| Crear | `.env.local` |
| Crear | `lib/supabase/client.ts` |
| Crear | `lib/supabase/server.ts` |
| Crear | `lib/supabase/service-role.ts` |
| Crear | `lib/supabase/middleware.ts` |
| Modificar | `types/database.types.ts` (auto-generado) |
| Modificar | `types/index.ts` (derivar de DB types) |
| Modificar | `lib/utils.ts` (añadir `formatMAD`) |

## Criterios de aceptación

- [ ] `.env.local` con las 3 variables de entorno (URL, ANON_KEY, SERVICE_ROLE_KEY).
- [ ] Las 5 tablas existen en Supabase con los constraints e índices correctos.
- [ ] La función `normalize_moroccan_phone` normaliza correctamente todos los formatos (06→+212, 00212→+212, etc.).
- [ ] La función RPC `create_order_atomic` existe y solo es invocable por `service_role` (no por `anon`).
- [ ] RLS habilitado: las tablas customers/orders/order_items NO permiten INSERT anónimo.
- [ ] Bucket `product-images` creado y público para lectura.
- [ ] Los 3 clientes Supabase (browser, server, service-role) funcionan sin errores.
- [ ] `types/database.types.ts` generado con todos los tipos del esquema.
- [ ] `formatMAD(1500)` retorna `"1 500 MAD"` o similar.
- [ ] `npm run build` pasa sin errores de tipos.
- [ ] **Test de seguridad:** hacer un POST directo a `{SUPABASE_URL}/rest/v1/orders` con la anon key → debe retornar 403.

## Commit sugerido

```
feat(db): setup Supabase schema, RLS policies, storage and typed clients
```
