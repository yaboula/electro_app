# Sprint 4 — CRUD de Productos e Inventario (Panel Admin)

## Objetivo

Construir las páginas del panel admin para gestionar el catálogo completo: crear, editar, publicar y eliminar productos (plantillas), y gestionar los inventory items asociados (nuevos con stock, usados con serial number). Incluye subida de imágenes a Supabase Storage.

**Dependencia:** Sprint 3 completado (admin autenticado, sidebar funcional).

---

## Tareas

### 4.1 — Listado de Productos (`/admin/products`)

**Archivo:** `app/(backoffice)/admin/products/page.tsx`

**Diseño:**
- Título "Gestion des Produits" + botón "Nouveau Produit".
- Tabla/DataTable con columnas:
  - Imagen (thumbnail 48x48)
  - Titre
  - Plateforme (badge con color por plataforma)
  - Items en stock (count de inventory_items activos)
  - Statut (Publié / Brouillon) — badge verde/gris
  - Actions (Éditer, Supprimer)
- Filtro por plataforma (tabs o select).
- Ordenado por fecha de creación (más reciente primero).

**Data fetching:**
- Server Component que hace query a Supabase:

```sql
SELECT p.*, 
  COUNT(ii.id) FILTER (WHERE ii.is_active) as active_items,
  COALESCE(MIN(ii.price), 0) as min_price
FROM products p
LEFT JOIN inventory_items ii ON ii.product_id = p.id
GROUP BY p.id
ORDER BY p.created_at DESC
```

**Componente reutilizable:** `components/admin/data-table.tsx` — tabla genérica con Tanstack Table (opcional) o tabla HTML simple con Tailwind.

---

### 4.2 — Crear/Editar Producto (`/admin/products/new` y `/admin/products/[id]/edit`)

**Archivos:**
- `app/(backoffice)/admin/products/new/page.tsx`
- `app/(backoffice)/admin/products/[id]/edit/page.tsx`
- `app/(backoffice)/admin/products/actions.ts` (Server Actions)

**Formulario (React Hook Form + Zod):**

```typescript
const productSchema = z.object({
  title: z.string().min(3, "Minimum 3 caractères"),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Slug invalide (lettres minuscules, chiffres et tirets)"),
  platform: z.enum(["PS5", "PS4", "Xbox Series", "Xbox One", "Nintendo Switch", "PC", "Accessoire"]),
  type: z.enum(["console", "game", "accessory"]),
  base_description: z.string().min(10, "Description trop courte"),
  is_published: z.boolean().default(false),
});
```

**Campos del formulario:**
1. **Titre** — Input text.
2. **Slug** — Input text, auto-generado desde título (slugify), editable.
3. **Plateforme** — Select.
4. **Type** — Select (Console / Jeu / Accessoire).
5. **Description** — Textarea.
6. **Image principale** — Upload con preview. Sube a `product-images/{product_id}/main_{timestamp}.webp` (ver 4.5 para invalidación de caché).
7. **Publié** — Switch toggle.

**Server Actions:**

```typescript
// createProductAction(formData: FormData)
// 1. Validar con Zod
// 2. Upload imagen a Storage si existe
// 3. INSERT en products
// 4. revalidatePath("/admin/products")
// 5. redirect al producto creado

// updateProductAction(id: string, formData: FormData)
// 1. Validar con Zod
// 2. Upload nueva imagen si cambió
// 3. UPDATE en products
// 4. revalidatePath + redirect

// deleteProductAction(id: string)
// 1. DELETE de products (cascade elimina inventory_items)
// 2. Eliminar imágenes del Storage
// 3. revalidatePath("/admin/products")
```

**Helper de slug:**

```typescript
// lib/utils.ts
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
```

---

### 4.3 — Gestión de Inventario (`/admin/inventory`)

**Archivo:** `app/(backoffice)/admin/inventory/page.tsx`

**Diseño:**
- Título "Gestion de l'Inventaire".
- Tabla con columnas:
  - Produit (nombre del producto padre)
  - Condition (NUEVO / USADO_A / USADO_B) — badge con color
  - N° Série (si aplica)
  - Prix (MAD)
  - Stock
  - Statut (Actif/Inactif)
  - Actions
- Filtro por condición y por producto.

---

### 4.4 — Crear/Editar Inventory Item

**Archivos:**
- `app/(backoffice)/admin/inventory/new/page.tsx`
- `app/(backoffice)/admin/inventory/[id]/edit/page.tsx`
- `app/(backoffice)/admin/inventory/actions.ts`

**Formulario (Zod):**

```typescript
const inventoryItemSchema = z.object({
  product_id: z.string().uuid("Produit requis"),
  condition: z.enum(["NUEVO", "USADO_A", "USADO_B"]),
  serial_number: z.string().optional(),
  grade_notes: z.string().optional(),
  stock_quantity: z.number().int().min(0),
  price: z.number().positive("Le prix doit être positif"),
  is_active: z.boolean().default(true),
}).refine(
  (data) => data.condition === "NUEVO" || (data.serial_number && data.serial_number.length > 0),
  { message: "Numéro de série obligatoire pour les articles d'occasion", path: ["serial_number"] }
);
```

**Campos del formulario:**
1. **Produit** — Select (lista de productos existentes).
2. **Condition** — Radio group (Neuf / Occasion Grade A / Occasion Grade B).
3. **N° de Série** — Input text (aparece solo si condition !== "NUEVO").
4. **Notes de grade** — Textarea (aparece solo si condition !== "NUEVO").
5. **Prix (MAD)** — Input number.
6. **Quantité en stock** — Input number (para nuevos es editable, para usados forzar a 1).
7. **Photos supplémentaires** — Multi-upload (hasta 5 fotos). Suben a `product-images/{product_id}/items/{item_id}/`.
8. **Actif** — Switch.

**Lógica condicional importante:**
- Si `condition === "NUEVO"`: serial_number es hidden, stock_quantity es libre.
- Si `condition !== "NUEVO"`: serial_number es required, stock_quantity se fija en 1 (ítem único).

---

### 4.5 — Componente de Upload de Imágenes (con invalidación de caché)

**Archivo:** `components/admin/image-upload.tsx`

**Funcionalidad:**
- Drag & drop zone o click para seleccionar.
- Preview de la imagen seleccionada.
- Progress bar durante upload.
- Validación: solo `.jpg`, `.png`, `.webp`, max 5MB.
- Devuelve la URL pública de Supabase Storage.

> **DECISIÓN TÉCNICA — Invalidación de caché de imágenes:**
> Si se sube la imagen a una ruta estática como `main.webp` y luego se reemplaza,
> la URL no cambia. Las CDN de Vercel, Next.js Image Optimization y el navegador
> del cliente seguirán sirviendo la imagen antigua desde caché.
>
> **Solución:** Incluir un timestamp o hash corto en el nombre del archivo:
> `main_{Date.now()}.webp`. Cada nueva subida genera una URL diferente,
> forzando la invalidación de caché automáticamente.

**Implementación:**

```typescript
// Generar nombre de archivo único con timestamp
const timestamp = Date.now();
const filePath = `${productId}/main_${timestamp}.webp`;

const { data, error } = await supabase.storage
  .from("product-images")
  .upload(filePath, file, { upsert: false }); // upsert: false porque el nombre es siempre nuevo

// URL pública (siempre única, sin problemas de caché)
const { data: { publicUrl } } = supabase.storage
  .from("product-images")
  .getPublicUrl(filePath);

// IMPORTANTE: Si se reemplaza una imagen, eliminar la anterior del Storage
// para no acumular archivos huérfanos.
if (previousImageUrl) {
  const previousPath = extractPathFromUrl(previousImageUrl);
  await supabase.storage.from("product-images").remove([previousPath]);
}
```

**Lo mismo aplica a las fotos extra de inventory items:**
```
product-images/{product_id}/items/{item_id}/extra_{timestamp}_{index}.webp
```

---

### 4.6 — Componentes UI reutilizables del Admin

Instalar componentes Shadcn adicionales necesarios:

```bash
npx shadcn@latest add input textarea select switch label badge dialog alert-dialog separator table tabs
```

**Componentes custom a crear:**

| Componente | Archivo | Uso |
|---|---|---|
| `StatusBadge` | `components/admin/status-badge.tsx` | Badges de color para plataforma, condición, estado |
| `ImageUpload` | `components/admin/image-upload.tsx` | Upload con drag&drop y preview |
| `ConfirmDialog` | `components/admin/confirm-dialog.tsx` | AlertDialog de confirmación antes de eliminar |
| `PageHeader` | `components/admin/page-header.tsx` | Título + descripción + botón acción, reutilizable |

---

## Archivos creados / modificados

| Acción | Archivo |
|--------|---------|
| Crear | `app/(backoffice)/admin/products/page.tsx` |
| Crear | `app/(backoffice)/admin/products/new/page.tsx` |
| Crear | `app/(backoffice)/admin/products/[id]/edit/page.tsx` |
| Crear | `app/(backoffice)/admin/products/actions.ts` |
| Crear | `app/(backoffice)/admin/inventory/page.tsx` |
| Crear | `app/(backoffice)/admin/inventory/new/page.tsx` |
| Crear | `app/(backoffice)/admin/inventory/[id]/edit/page.tsx` |
| Crear | `app/(backoffice)/admin/inventory/actions.ts` |
| Crear | `components/admin/image-upload.tsx` |
| Crear | `components/admin/status-badge.tsx` |
| Crear | `components/admin/confirm-dialog.tsx` |
| Crear | `components/admin/page-header.tsx` |
| Modificar | `lib/utils.ts` (añadir `slugify`) |
| Modificar | `lib/validations.ts` (añadir schemas de product e inventory) |

## Criterios de aceptación

- [ ] El admin puede crear un producto nuevo con imagen y verlo en la lista.
- [ ] El admin puede editar cualquier campo de un producto existente.
- [ ] El admin puede eliminar un producto (con confirmación).
- [ ] El admin puede añadir inventory items (nuevos y usados) a un producto.
- [ ] Items usados requieren serial_number obligatoriamente (validado por Zod y DB).
- [ ] Items usados tienen stock fijado en 1.
- [ ] Las imágenes se suben correctamente a Supabase Storage.
- [ ] Los formularios muestran errores de validación claros en francés.
- [ ] El toggle "Publié" controla la visibilidad pública del producto.
- [ ] `npm run build` pasa sin errores.

## Commits sugeridos

```
feat(admin): add product CRUD with image upload and form validation
feat(admin): add inventory item management with conditional serial number logic
```
