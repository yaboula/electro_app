# Sprint 6 — Checkout COD + Redirección WhatsApp

## Objetivo

Implementar el flujo completo de compra: formulario rápido de checkout sin registro, creación del pedido en base de datos con estado PENDIENTE, y redirección a WhatsApp con un mensaje pre-armado para que el admin confirme el pedido por teléfono. Este es el corazón del flujo anti-RTO (Return To Origin).

**Dependencia:** Sprint 5 completado (catálogo público con precios y CTAs funcionales).

---

## Tareas

### 6.1 — Página de Checkout (`/checkout`)

**Archivo:** `app/(storefront)/checkout/page.tsx`

**Flujo de entrada:**
El usuario llega desde:
- `/p/[slug]` → con `?item={inventory_item_id}` (seleccionó un item específico).
- Futuro: desde un carrito (Sprint 8+ si se decide).

**Diseño (mobile-first):**
- Título "Finaliser la Commande".
- **Resumen del pedido** (arriba): Card con miniatura, nombre, condición, precio.
- **Formulario** (debajo):
  - Nom complet — Input text
  - Téléphone — Input tel (placeholder: `06 XX XX XX XX`)
  - Ville — Select con ciudades principales de Marruecos
  - Adresse complète — Textarea
- **Resumen de precio:**
  - Sous-total: XXX MAD
  - Livraison: Gratuite (o tarifa fija si aplica)
  - **Total: XXX MAD**
- **Botón CTA:** "Confirmer via WhatsApp — XXX MAD" (verde, estilo WhatsApp, sticky bottom en móvil).
- **Nota:** Texto pequeño: "Paiement à la livraison (Cash on Delivery)".

**NO hay registro de cuenta.** El cliente solo da nombre + teléfono + dirección.

---

### 6.2 — Schema de validación del Checkout

**Archivo:** `lib/validations.ts` (ampliar el existente)

```typescript
const moroccanCities = [
  "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir",
  "Meknès", "Oujda", "Kénitra", "Tétouan", "Salé", "Nador",
  "Mohammédia", "El Jadida", "Béni Mellal", "Taza", "Khouribga",
  "Settat", "Laâyoune", "Safi", "Khémisset", "Guelmim",
  "Berrechid", "Errachidia", "Taourirt", "Autre",
] as const;

const checkoutSchema = z.object({
  fullName: z.string()
    .min(3, "Le nom doit contenir au moins 3 caractères")
    .max(100, "Nom trop long"),
  phone: z.string()
    .regex(/^(?:\+212|0)([ \-]?)(?:5|6|7)\d{8}$/, "Numéro de téléphone invalide"),
  city: z.enum(moroccanCities, { errorMap: () => ({ message: "Ville requise" }) }),
  address: z.string()
    .min(10, "Adresse trop courte (minimum 10 caractères)")
    .max(500, "Adresse trop longue"),
});
```

---

### 6.3 — Server Action: Crear Pedido (via RPC atómica)

**Archivo:** `app/(storefront)/checkout/actions.ts`

> **SEGURIDAD:** Esta Server Action usa el cliente `service-role` (no el anon client)
> porque las tablas customers/orders/order_items NO permiten INSERT anónimo vía RLS.
> La validación de datos se hace con Zod ANTES de invocar la RPC.

**Flujo `createOrderAction(formData)`:**

```
1. Validar formData con checkoutSchema (Zod).
2. Normalizar el teléfono en el backend (lib/utils.ts → normalizePhone).
3. Invocar la función RPC de PostgreSQL `create_order_atomic` via service-role client.
   → La RPC ejecuta todo en una transacción ACID con SELECT ... FOR UPDATE:
     a. Bloquea la fila del inventory_item (previene race conditions).
     b. Verifica stock > 0 (si no, retorna error).
     c. Busca o crea customer (por teléfono normalizado).
     d. Crea order + order_items.
     e. Decrementa stock atómicamente.
     f. Si item usado → desactiva (is_active = false).
4. Si la RPC retorna { success: false } → mostrar error al usuario.
5. Si éxito → construir URL de WhatsApp.
6. Retornar { success: true, whatsappUrl, orderId }.
```

**Implementación:**

```typescript
"use server";

import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { checkoutSchema } from "@/lib/validations";
import { normalizePhone } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export async function createOrderAction(formData: FormData, inventoryItemId: string) {
  const parsed = checkoutSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    city: formData.get("city"),
    address: formData.get("address"),
  });

  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0].message };
  }

  const supabase = createServiceRoleClient();
  const normalizedPhone = normalizePhone(parsed.data.phone);

  const { data, error } = await supabase.rpc("create_order_atomic", {
    p_inventory_item_id: inventoryItemId,
    p_quantity: 1,
    p_full_name: parsed.data.fullName,
    p_phone: normalizedPhone,
    p_city: parsed.data.city,
    p_address: parsed.data.address,
  });

  if (error || !data?.success) {
    return { success: false as const, error: data?.error ?? "Erreur lors de la création de la commande" };
  }

  const whatsappUrl = buildWhatsAppUrl({
    id: data.order_id,
    customerName: parsed.data.fullName,
    phone: normalizedPhone,
    city: parsed.data.city,
    items: [{ name: data.product_title, condition: data.condition, price: data.total }],
    total: data.total,
  });

  return { success: true as const, whatsappUrl, orderId: data.order_id };
}
```

**¿Por qué no queries secuenciales?** Si dos usuarios compran la última PS5 usada
al mismo milisegundo, sin `SELECT ... FOR UPDATE`, ambos leerían stock=1, ambos
restarían 1, y el stock quedaría en -1. La RPC usa bloqueo de fila, garantizando
que solo uno gana y el otro recibe "Stock insuffisant".

---

### 6.4 — Construcción de URL de WhatsApp

**Archivo:** `lib/whatsapp.ts`

```typescript
const ADMIN_WHATSAPP = "212600000000"; // Sin + ni espacios

export function buildWhatsAppUrl(order: {
  id: string;
  customerName: string;
  phone: string;
  city: string;
  items: { name: string; condition: string; price: number }[];
  total: number;
}): string {
  const message = [
    `🎮 *Nouvelle Commande ELECTRO.ma*`,
    ``,
    `📋 *Commande:* #${order.id.slice(0, 8).toUpperCase()}`,
    `👤 *Client:* ${order.customerName}`,
    `📞 *Tél:* ${order.phone}`,
    `🏙️ *Ville:* ${order.city}`,
    ``,
    `📦 *Articles:*`,
    ...order.items.map(
      (item) => `  • ${item.name} (${item.condition}) — ${item.price} MAD`
    ),
    ``,
    `💰 *Total: ${order.total} MAD*`,
    `💳 *Paiement:* À la livraison (COD)`,
    ``,
    `✅ Merci de confirmer cette commande.`,
  ].join("\n");

  return `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`;
}
```

**Configuración:** `ADMIN_WHATSAPP` se almacena en `.env.local`:

```
NEXT_PUBLIC_ADMIN_WHATSAPP=212600000000
```

---

### 6.5 — Página de Confirmación

**Archivo:** `app/(storefront)/checkout/confirmation/page.tsx`

**Flujo post-checkout:**

1. Tras submit exitoso, el usuario es redirigido a `/checkout/confirmation?order={orderId}`.
2. Esta página muestra:
   - Checkmark animado (framer-motion).
   - "Commande enregistrée avec succès !"
   - Resumen del pedido (número, artículos, total).
   - Explicación: "Un conseiller va vous contacter sur WhatsApp pour confirmer votre commande."
   - **Botón principal:** Enlace `<a>` nativo "Ouvrir WhatsApp" con `href={whatsappUrl}`.
   - **Botón secundario:** "Retour à la boutique".

> **DECISIÓN UX CRÍTICA — NO usar `window.open()` con delay.**
> Safari iOS y Chrome Android bloquean `window.open` si no es invocado por un clic
> directo y síncrono del usuario. Un `setTimeout(() => window.open(...), 1000)`
> será bloqueado silenciosamente, dejando al usuario sin acción.
>
> **Solución:** El botón "Ouvrir WhatsApp" es un enlace `<a>` estándar:
> ```tsx
> <a
>   href={whatsappUrl}
>   target="_blank"
>   rel="noopener noreferrer"
>   className="... (estilo botón verde WhatsApp)"
> >
>   💬 Ouvrir WhatsApp
> </a>
> ```
> En móvil, el OS intercepta el esquema `https://wa.me/...` y abre la app
> nativa de WhatsApp directamente. No se necesita `window.open`.

---

### 6.6 — API Route alternativa (opcional)

**Archivo:** `app/api/orders/route.ts`

En caso de que se prefiera un API route en vez de Server Action (para uso externo futuro):

```typescript
export async function POST(request: Request) {
  // 1. Parse body
  // 2. Validar con Zod
  // 3. Misma lógica que createOrderAction
  // 4. Retornar JSON { success, orderId, whatsappUrl }
}
```

---

### 6.7 — Componente de selección de ciudad

**Archivo:** `components/store/city-select.tsx`

- Combobox o Select con búsqueda.
- Lista de 25+ ciudades principales de Marruecos.
- Opción "Autre" al final para ciudades no listadas (muestra input adicional).

---

### 6.8 — Normalización de teléfono (Backend)

**Añadir a `lib/utils.ts`:**

```typescript
export function normalizePhone(raw: string): string {
  let cleaned = raw.replace(/[\s\-\.\(\)]/g, "");
  if (cleaned.startsWith("00212")) {
    cleaned = "+212" + cleaned.slice(5);
  } else if (cleaned.startsWith("0") && cleaned.length === 10) {
    cleaned = "+212" + cleaned.slice(1);
  } else if (!cleaned.startsWith("+212")) {
    cleaned = "+212" + cleaned;
  }
  return cleaned;
}
```

Esta función DEBE aplicarse en el backend (Server Action) antes de pasar el
teléfono a la RPC, para garantizar consistencia con la función SQL
`normalize_moroccan_phone`. Dos entradas distintas (`06 12 34 56 78` y
`+212612345678`) deben resolver al mismo customer.

---

## Flujo completo del usuario

```
[Detalle Producto] → Selecciona item → Clic "Commander"
       ↓
[/checkout?item=uuid] → Rellena formulario rápido (30 segundos)
       ↓
[Submit] → Server Action valida (Zod) → normaliza teléfono → invoca RPC atómica
       ↓
RPC PostgreSQL: bloquea fila → verifica stock → crea customer/order → decrementa stock
       ↓
[/checkout/confirmation] → Ve resumen + botón <a> para abrir WhatsApp
       ↓
[WhatsApp] → Admin recibe mensaje → Llama al cliente → Confirma
       ↓
[Admin Panel] → Cambia status a CONFIRMADO → Gestiona envío
```

---

## Archivos creados / modificados

| Acción | Archivo |
|--------|---------|
| Crear | `app/(storefront)/checkout/page.tsx` |
| Crear | `app/(storefront)/checkout/actions.ts` |
| Crear | `app/(storefront)/checkout/confirmation/page.tsx` |
| Crear | `app/api/orders/route.ts` |
| Crear | `lib/whatsapp.ts` |
| Crear | `components/store/city-select.tsx` |
| Modificar | `lib/validations.ts` (checkoutSchema + ciudades) |
| Modificar | `lib/utils.ts` (añadir `normalizePhone`) |
| Modificar | `.env.local` (añadir NEXT_PUBLIC_ADMIN_WHATSAPP) |

## Componentes Shadcn a instalar

```bash
npx shadcn@latest add form combobox
```

Nota: `form` de Shadcn integra react-hook-form automáticamente.

## Criterios de aceptación

- [ ] El formulario de checkout valida teléfono marroquí correctamente.
- [ ] El teléfono se normaliza en el backend (`06 12...` → `+212612...`) antes de cualquier operación.
- [ ] Un pedido se crea exclusivamente via RPC `create_order_atomic` con el Service Role client.
- [ ] **Test de concurrencia:** dos requests simultáneas para el último item usado → solo una gana, la otra recibe error.
- [ ] Items usados (stock=1) se marcan como inactivos tras la compra.
- [ ] Se crea o reutiliza el customer por teléfono normalizado (sin duplicados por formato).
- [ ] La URL de WhatsApp se genera correctamente con el resumen del pedido.
- [ ] La página de confirmación muestra un enlace `<a>` nativo hacia WhatsApp (NO `window.open`).
- [ ] El enlace WhatsApp abre la app nativa en iOS y Android sin ser bloqueado.
- [ ] El flujo completo funciona en menos de 45 segundos (experiencia rápida).
- [ ] `npm run build` pasa sin errores.

## Commits sugeridos

```
feat(checkout): add COD checkout form with Zod validation and city selector
feat(checkout): implement atomic order creation via PostgreSQL RPC with race condition protection
feat(checkout): add WhatsApp native link with pre-built order message
feat(checkout): add confirmation page with order summary
```
