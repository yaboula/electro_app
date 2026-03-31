# Sprint 5 — Catálogo Público: Productos, Items Usados y Búsqueda

## Objetivo

Construir toda la experiencia de navegación pública de la tienda: listado de productos con filtros, página de detalle de producto nuevo, página de detalle de item usado, sistema de búsqueda, y las cards de producto con diseño premium gaming.

**Dependencia:** Sprint 4 completado (productos e inventario creados en la DB).

---

## Tareas

### 5.1 — Componente ProductCard

**Archivo:** `components/store/product-card.tsx`

**Diseño (glassmorphism + motion):**
- Card con imagen del producto (aspect-ratio 4:3, `object-cover`).
- Overlay gradient de abajo hacia arriba para legibilidad.
- Badge de plataforma en la esquina superior izquierda.
- Nombre del producto (truncado a 2 líneas max).
- Rango de precio: "À partir de XXX MAD" (precio mínimo de los inventory_items activos).
- Si tiene items usados disponibles: badge "Occasion disponible".
- Animación: `whileHover={{ y: -4, transition: { duration: 0.2 } }}` con framer-motion.
- Borde sutil que brilla en hover: `hover:border-primary/30 hover:shadow-primary/5`.

**Props:**

```typescript
interface ProductCardProps {
  product: Product & {
    min_price: number;
    has_used: boolean;
    active_items_count: number;
  };
}
```

---

### 5.2 — Página de Catálogo (`/p`)

**Archivo:** `app/(storefront)/p/page.tsx`

**Diseño:**
- Título "Tous les Produits" con contador.
- Barra de filtros sticky bajo el header:
  - Plataforma: tabs horizontales scrolleables (Tous, PS5, PS4, Xbox Series, Xbox One, Nintendo, PC, Accessoires).
  - Tri: Select (Plus récent, Prix croissant, Prix décroissant).
- Grid responsivo de ProductCards:
  - Móvil: 2 columnas.
  - Tablet: 3 columnas.
  - Desktop: 4 columnas.
- Si no hay productos: empty state con ilustración y texto.

**Data fetching (Server Component):**

```sql
SELECT p.*,
  COALESCE(MIN(ii.price), 0) as min_price,
  BOOL_OR(ii.condition != 'NUEVO') as has_used,
  COUNT(ii.id) FILTER (WHERE ii.is_active AND ii.stock_quantity > 0) as active_items_count
FROM products p
INNER JOIN inventory_items ii ON ii.product_id = p.id AND ii.is_active = true
WHERE p.is_published = true
GROUP BY p.id
HAVING COUNT(ii.id) FILTER (WHERE ii.is_active AND ii.stock_quantity > 0) > 0
ORDER BY p.created_at DESC
```

**Filtros via URL searchParams:**
- `/p?platform=PS5` → filtra por plataforma.
- `/p?sort=price_asc` → ordena por precio.
- Los filtros se aplican como searchParams para que sean compartibles (URL bookmarkable).

---

### 5.3 — Página de Detalle de Producto (`/p/[slug]`)

**Archivo:** `app/(storefront)/p/[slug]/page.tsx`

**Diseño (dividido en secciones):**

**Sección 1: Hero del producto**
- Layout 2 columnas en desktop, stack en móvil.
- **Izquierda:** Imagen principal grande (aspect-ratio 1:1) con zoom on hover.
- **Derecha:**
  - Nombre del producto (h1).
  - Badge de plataforma.
  - Descripción.
  - Separador.
  - **Lista de opciones de compra** (inventory items disponibles):

```
┌──────────────────────────────────────────┐
│ ⚪ Neuf         │  1,500 MAD  │ En stock │  [Commander]
│ 🟡 Occasion A   │  1,200 MAD  │ #SN-4821 │  [Commander]
│ 🟠 Occasion B   │    900 MAD  │ #SN-7712 │  [Commander]
└──────────────────────────────────────────┘
```

  - Cada opción es un radio-button seleccionable.
  - Al seleccionar, el botón CTA inferior se actualiza con el precio.

**Sección 2: CTA Sticky (móvil)**
- Barra sticky en la parte inferior (encima del BottomNav):
  - Precio del item seleccionado.
  - Botón "Commander via WhatsApp" que lleva al checkout.
  - Siempre visible mientras scrolleas.

**Componentes:**

| Componente | Archivo |
|---|---|
| `ProductGallery` | `components/store/product-gallery.tsx` |
| `InventoryOptions` | `components/store/inventory-options.tsx` |
| `StickyCTA` | `components/store/sticky-cta.tsx` |

**SEO — generateMetadata:**

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  return {
    title: `${product.title} — ELECTRO.ma`,
    description: product.base_description,
    openGraph: {
      images: [product.main_image_url],
    },
  };
}
```

---

### 5.4 — Página de Item Usado (`/item/[serial]`)

**Archivo:** `app/(storefront)/item/[serial]/page.tsx`

**Contexto:** Los items usados son únicos. Cada uno tiene su propia URL basada en su serial_number, con fotos reales y notas de grado.

**Diseño:**
- Similar al detalle de producto pero enfocado en un único item.
- **Galería:** Imagen principal del producto + extra_images del item (carrusel swipeable en móvil).
- **Info del item:**
  - Nombre del producto padre.
  - Badge: "Occasion Grade A" o "Occasion Grade B".
  - Notas de grado (ej: "Légère rayure sur le côté droit, fonctionnel à 100%").
  - Precio en MAD (grande, destacado).
  - Serial number visible.
- **CTA:** Botón "Commander cet article — XXX MAD" → lleva a `/checkout?item={item_id}`.
- **Info box:** Card con icono que explica el sistema de grados:
  - Grade A: "Excellent état, traces d'utilisation minimes"
  - Grade B: "Bon état, signes d'usure visibles mais 100% fonctionnel"

---

### 5.5 — Listado de Occasions (`/item`)

**Archivo:** `app/(storefront)/item/page.tsx`

**Diseño:**
- Título "Articles d'Occasion" con subtítulo explicativo sobre los grados.
- Grid de cards similares a ProductCard pero adaptadas:
  - Foto principal.
  - Badge de grado (A/B con color).
  - Nombre del producto.
  - Precio.
  - Serial number (parcialmente oculto: `SN-****821`).
- Filtro por grado (Tous / Grade A / Grade B).
- Filtro por plataforma.

---

### 5.6 — Búsqueda (`/search`)

**Archivo:** `app/(storefront)/search/page.tsx`

**Diseño:**
- Input de búsqueda grande con autofocus al entrar.
- Busca en `products.title` y `products.platform` con `ilike`.
- Resultados en grid de ProductCards.
- Empty state si no hay resultados: "Aucun résultat pour «query»".
- Debounce de 300ms en el input para no saturar queries.

**Implementación:**
- searchParams: `/search?q=ps5`.
- Query Supabase con `.ilike('title', '%${query}%')` o full-text search si se configura.
- Server Component para el fetch, Client Component para el input con debounce.

**Componente:** `components/store/search-input.tsx`

---

### 5.7 — Data Fetching Helpers

**Archivo:** `lib/queries.ts`

Centralizar todas las queries de lectura pública:

```typescript
export async function getPublishedProducts(filters?: {
  platform?: string;
  sort?: string;
}) { ... }

export async function getProductBySlug(slug: string) { ... }

export async function getInventoryItemBySerial(serial: string) { ... }

export async function getUsedItems(filters?: {
  grade?: string;
  platform?: string;
}) { ... }

export async function searchProducts(query: string) { ... }
```

---

## Componentes Shadcn adicionales a instalar

```bash
npx shadcn@latest add radio-group aspect-ratio skeleton
```

---

## Archivos creados / modificados

| Acción | Archivo |
|--------|---------|
| Crear | `app/(storefront)/p/page.tsx` |
| Crear | `app/(storefront)/p/[slug]/page.tsx` |
| Crear | `app/(storefront)/item/page.tsx` |
| Crear | `app/(storefront)/item/[serial]/page.tsx` |
| Crear | `app/(storefront)/search/page.tsx` |
| Crear | `components/store/product-card.tsx` |
| Crear | `components/store/product-gallery.tsx` |
| Crear | `components/store/inventory-options.tsx` |
| Crear | `components/store/sticky-cta.tsx` |
| Crear | `components/store/search-input.tsx` |
| Crear | `lib/queries.ts` |
| Modificar | `app/(storefront)/page.tsx` (home: sección "Produits populaires" real) |

## Criterios de aceptación

- [ ] `/p` muestra grid de productos publicados con filtro por plataforma.
- [ ] `/p/[slug]` muestra detalle completo con opciones de inventario seleccionables.
- [ ] El CTA sticky aparece en móvil con precio del item seleccionado.
- [ ] `/item` lista todos los items usados con filtros de grado.
- [ ] `/item/[serial]` muestra el item único con galería, grado y precio.
- [ ] `/search?q=ps5` devuelve resultados relevantes.
- [ ] Todas las páginas tienen `generateMetadata` para SEO.
- [ ] Empty states visibles cuando no hay datos.
- [ ] Las imágenes usan `next/image` con `sizes` y `priority` apropiados.
- [ ] Las animaciones son fluidas y no bloquean el hilo principal.
- [ ] `npm run build` pasa sin errores.

## Commits sugeridos

```
feat(catalog): add product listing page with platform filters
feat(catalog): add product detail page with inventory options and sticky CTA
feat(catalog): add used items listing and detail pages with grade system
feat(catalog): add search page with debounced input
```
