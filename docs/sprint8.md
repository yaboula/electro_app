# Sprint 8 — Polish, SEO, Performance y Deploy a Producción

## Objetivo

Pulir toda la aplicación para producción: optimización SEO completa, loading states y skeletons, error boundaries, manejo de edge cases, responsive fine-tuning, accesibilidad básica, analytics, y deploy final a Vercel con dominio personalizado.

**Dependencia:** Sprint 7 completado (toda la funcionalidad core implementada).

---

## Tareas

### 8.1 — SEO y Metadata

**8.1.1 — Metadata global (`app/layout.tsx`):**

```typescript
export const metadata: Metadata = {
  metadataBase: new URL("https://electro.ma"),
  title: {
    default: "ELECTRO.ma — Gaming & Tech au Maroc",
    template: "%s | ELECTRO.ma",
  },
  description: "Consoles, jeux et accessoires gaming neufs et d'occasion. Livraison partout au Maroc. Paiement à la livraison.",
  keywords: ["gaming maroc", "ps5 maroc", "xbox maroc", "console occasion maroc", "jeux vidéo maroc"],
  openGraph: {
    type: "website",
    locale: "fr_MA",
    siteName: "ELECTRO.ma",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

**8.1.2 — Metadata por página:**

| Página | Título | Descripción |
|--------|--------|-------------|
| `/` | (default) | (default) |
| `/p` | "Tous les Produits" | "Découvrez notre catalogue de consoles, jeux..." |
| `/p/[slug]` | `{product.title}` (dinámico) | `{product.base_description}` (dinámico) |
| `/item` | "Articles d'Occasion" | "Consoles et jeux d'occasion testés et vérifiés..." |
| `/item/[serial]` | `{product.title} — Occasion Grade {X}` | Dinámico |
| `/search` | "Recherche" | "Rechercher dans notre catalogue gaming..." |
| `/checkout` | "Finaliser la Commande" | noindex |
| `/login` | "Connexion Admin" | noindex |

**8.1.3 — Archivos SEO estáticos:**

| Archivo | Contenido |
|---------|-----------|
| `app/sitemap.ts` | Generar sitemap dinámico con todas las URLs de productos e items |
| `app/robots.ts` | Allow all, disallow `/admin/*` y `/checkout/*` |
| `app/manifest.ts` | Web App Manifest (nombre, colores, iconos) para PWA-like |
| `public/og-image.jpg` | Imagen OpenGraph por defecto (1200x630) |
| `public/favicon.ico` | Favicon del proyecto |

**Sitemap dinámico:**

```typescript
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  
  const { data: products } = await supabase
    .from("products")
    .select("slug, updated_at")
    .eq("is_published", true);

  const { data: items } = await supabase
    .from("inventory_items")
    .select("serial_number, updated_at")
    .neq("condition", "NUEVO")
    .eq("is_active", true);

  return [
    { url: "https://electro.ma", lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: "https://electro.ma/p", lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: "https://electro.ma/item", lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    ...products.map((p) => ({
      url: `https://electro.ma/p/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...items.map((i) => ({
      url: `https://electro.ma/item/${i.serial_number}`,
      lastModified: new Date(i.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
```

---

### 8.2 — Loading States y Skeletons

**Archivos `loading.tsx`** en cada ruta con contenido async:

| Archivo | Skeleton |
|---------|----------|
| `app/(storefront)/p/loading.tsx` | Grid de 8 skeleton cards |
| `app/(storefront)/p/[slug]/loading.tsx` | Skeleton imagen + texto |
| `app/(storefront)/item/loading.tsx` | Grid de 6 skeleton cards |
| `app/(storefront)/item/[serial]/loading.tsx` | Skeleton detalle |
| `app/(storefront)/search/loading.tsx` | Skeleton input + grid |
| `app/(backoffice)/admin/orders/loading.tsx` | Skeleton tabla |
| `app/(backoffice)/admin/products/loading.tsx` | Skeleton tabla |
| `app/(backoffice)/admin/dashboard/loading.tsx` | Skeleton 4 cards + tabla |

**Componente reutilizable:**

```bash
npx shadcn@latest add skeleton
```

**Archivo:** `components/store/product-card-skeleton.tsx`

```typescript
export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden border-white/5">
      <Skeleton className="aspect-[4/3] w-full" />
      <CardContent className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  );
}
```

---

### 8.3 — Error Boundaries

**Archivos `error.tsx`** en rutas principales:

| Archivo | Comportamiento |
|---------|---------------|
| `app/(storefront)/error.tsx` | Mensaje amigable + botón "Réessayer" + link "Retour à l'accueil" |
| `app/(backoffice)/admin/error.tsx` | Mensaje + botón retry + link dashboard |
| `app/global-error.tsx` | Fallback global si todo falla |

**`not-found.tsx`** personalizado:

| Archivo | Diseño |
|---------|--------|
| `app/(storefront)/not-found.tsx` | "Page introuvable" + ilustración + link home |
| `app/(storefront)/p/[slug]/not-found.tsx` | "Produit introuvable" |
| `app/(storefront)/item/[serial]/not-found.tsx` | "Article introuvable" |

---

### 8.4 — Optimización de Imágenes

1. **Todas las imágenes** usan `next/image` con:
   - `sizes` prop apropiado para cada contexto (card, gallery, thumbnail).
   - `priority` en las imágenes above-the-fold.
   - `placeholder="blur"` donde sea posible (generar blurDataURL).

2. **Formatos:** Asegurar que Storage sirva WebP (Supabase lo hace si se sube en WebP).

3. **Configuración `next.config.ts`:**

```typescript
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};
```

---

### 8.5 — Responsive Fine-Tuning

**Checklist de responsive por página:**

- [ ] **Home:** Bento grid se adapta de 1 → 2 → 3 → 6 cols.
- [ ] **Catálogo:** Grid de cards 2 → 3 → 4 cols.
- [ ] **Detalle producto:** Stack → 2 cols. CTA sticky solo en móvil.
- [ ] **Checkout:** Formulario full-width en móvil, card lateral en desktop.
- [ ] **Admin tablas:** Scroll horizontal en móvil, columnas ocultas según breakpoint.
- [ ] **Admin sidebar:** Hidden en móvil → Sheet. Visible en desktop.
- [ ] **Bottom Nav:** Visible solo en móvil (< md).
- [ ] **Header desktop:** Visible solo en desktop (>= md).

**Touch targets:** Todos los botones y links tienen mínimo 44x44px en móvil.

---

### 8.6 — Accesibilidad (a11y) básica

- [ ] Todos los inputs tienen `<label>` asociado.
- [ ] Las imágenes tienen `alt` descriptivo.
- [ ] Los botones de icono tienen `<span className="sr-only">`.
- [ ] El contraste de colores cumple WCAG AA (verificar primary sobre backgrounds).
- [ ] Focus ring visible en todos los elementos interactivos (Shadcn lo maneja por defecto).
- [ ] Skip-to-content link oculto (accesible con Tab).
- [ ] `aria-live` en mensajes de error del formulario.
- [ ] `role="status"` en loading spinners.

---

### 8.7 — Seguridad adicional

1. **Rate Limiting en Checkout (Upstash Redis):**

> **DECISIÓN DE SEGURIDAD:** NO usar `x-forwarded-for` para rate limiting.
> Este header puede ser falsificado por un atacante inyectando su propio valor
> en la petición HTTP. Un bot puede rotar IPs falsas infinitamente.

**Solución: Upstash Redis + @upstash/ratelimit**

```bash
npm install @upstash/ratelimit @upstash/redis
```

```
# .env.local (añadir)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

**Archivo:** `lib/rate-limit.ts`

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const checkoutRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 h"), // 5 pedidos por ventana de 1 hora
  analytics: true,
  prefix: "ratelimit:checkout",
});
```

**Uso en la Server Action del checkout:**

```typescript
import { checkoutRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

export async function createOrderAction(...) {
  // En Vercel, 'x-real-ip' es inyectado por la infraestructura (no falsificable).
  // Combinarlo con el teléfono normalizado como fingerprint secundario.
  const headersList = await headers();
  const ip = headersList.get("x-real-ip") ?? headersList.get("x-forwarded-for") ?? "unknown";
  const identifier = `${ip}:${normalizedPhone}`;

  const { success, remaining } = await checkoutRateLimit.limit(identifier);
  if (!success) {
    return {
      success: false as const,
      error: "Trop de commandes. Veuillez réessayer dans une heure.",
    };
  }

  // ... continuar con la creación del pedido
}
```

**¿Por qué Upstash?** Es un Redis serverless que funciona nativamente con Vercel
Edge y Serverless Functions. No necesita un servidor Redis propio. El tier gratuito
cubre hasta 10,000 requests/día, más que suficiente para un MVP.

**¿Por qué combinar IP + teléfono?** Un atacante puede falsificar teléfonos pero
no la IP real (en Vercel). Un usuario legítimo puede compartir IP (WiFi público)
pero tendrá un teléfono distinto. La combinación reduce falsos positivos.

2. **Sanitización:**
   - Todos los inputs de usuario pasan por Zod (ya cubierto).
   - HTML entities escapeados por defecto en React (ya cubierto).
   - Teléfonos normalizados en backend antes de cualquier operación DB (Sprint 6).

3. **Headers de seguridad** en `next.config.ts`:

```typescript
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];
```

4. **Variables de entorno:** Verificar que `SUPABASE_SERVICE_ROLE_KEY` NUNCA se expone al cliente (no tiene prefijo `NEXT_PUBLIC_`).

5. **Protección RLS verificada:** Las tablas customers/orders/order_items NO permiten INSERT anónimo (Sprint 2). Solo el Service Role puede escribir.

---

### 8.8 — Analytics (opcional pero recomendado)

**Opción 1: Vercel Analytics (más simple)**

```bash
npm install @vercel/analytics @vercel/speed-insights
```

Añadir al root layout:

```typescript
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Dentro del body:
<Analytics />
<SpeedInsights />
```

**Opción 2: Evento custom para conversiones**

Trackear evento cada vez que se completa un checkout:

```typescript
import { track } from "@vercel/analytics";
track("order_created", { city, total, itemCount });
```

---

### 8.9 — Deploy a Vercel

**Pasos:**

1. **Crear repositorio GitHub** (si no existe):
   ```bash
   git remote add origin https://github.com/<user>/gaming-ecommerce-maroc.git
   git push -u origin master
   ```

2. **Conectar en Vercel:**
   - Ir a [vercel.com](https://vercel.com) → New Project → Import desde GitHub.
   - Framework: Next.js (auto-detectado).
   - Root directory: `.` (default).

3. **Environment Variables en Vercel:**
   Copiar todas las variables de `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_ADMIN_WHATSAPP`
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

4. **Custom Domain:**
   - Añadir `electro.ma` (o el dominio elegido).
   - Configurar DNS (A record o CNAME según proveedor).

5. **Deploy inicial:**
   - Vercel detecta Next.js y hace build automático.
   - Verificar que las rutas funcionan.
   - Verificar que las imágenes de Supabase cargan.

6. **Configurar Supabase para producción:**
   - En Supabase Dashboard → Settings → API:
     - Verificar que `Site URL` apunta al dominio de producción.
     - Añadir dominio de producción a `Redirect URLs`.

---

### 8.10 — Testing manual (Checklist pre-launch)

**Storefront (público):**
- [ ] Home carga con animaciones fluidas.
- [ ] Catálogo muestra productos publicados con precios correctos.
- [ ] Filtros de plataforma funcionan.
- [ ] Detalle de producto muestra opciones de inventario.
- [ ] CTA sticky funciona en móvil.
- [ ] Detalle de item usado muestra galería, grado, serial.
- [ ] Búsqueda devuelve resultados relevantes.
- [ ] Checkout valida teléfono marroquí (+212 / 06...).
- [ ] Pedido se crea en DB con status PENDIENTE.
- [ ] Stock se decrementa.
- [ ] El enlace `<a>` de WhatsApp abre la app nativa en iOS/Android.
- [ ] 404 personalizado para slugs inexistentes.

**Backoffice (admin):**
- [ ] Login funciona con credenciales correctas.
- [ ] Login rechaza credenciales incorrectas con error claro.
- [ ] Middleware redirige `/admin/*` a `/login` sin sesión.
- [ ] Dashboard muestra métricas reales.
- [ ] CRUD de productos funciona (crear, editar, publicar, eliminar).
- [ ] Upload de imágenes funciona.
- [ ] CRUD de inventario funciona (serial number requerido para usados).
- [ ] Tabla de pedidos muestra filtros por estado.
- [ ] Cambio de estado de pedidos sigue la state machine.
- [ ] RTO restaura el stock.
- [ ] ENTREGADO incrementa successful_deliveries.
- [ ] Notas de despacho se guardan.
- [ ] Sign-out destruye sesión y redirige.

**Performance:**
- [ ] Lighthouse score > 90 en Performance (mobile).
- [ ] Lighthouse score > 90 en SEO.
- [ ] LCP < 2.5s.
- [ ] CLS < 0.1.
- [ ] No JS bundle > 200KB (verificar con `next build` output).

**Cross-browser:**
- [ ] Chrome (desktop + Android).
- [ ] Safari (iOS — crítico para Marruecos).
- [ ] Firefox.

---

## Archivos creados / modificados

| Acción | Archivo |
|--------|---------|
| Crear | `app/sitemap.ts` |
| Crear | `app/robots.ts` |
| Crear | `app/manifest.ts` |
| Crear | `app/global-error.tsx` |
| Crear | `app/(storefront)/error.tsx` |
| Crear | `app/(storefront)/not-found.tsx` |
| Crear | `app/(storefront)/p/loading.tsx` |
| Crear | `app/(storefront)/p/[slug]/loading.tsx` |
| Crear | `app/(storefront)/p/[slug]/not-found.tsx` |
| Crear | `app/(storefront)/item/loading.tsx` |
| Crear | `app/(storefront)/item/[serial]/loading.tsx` |
| Crear | `app/(storefront)/item/[serial]/not-found.tsx` |
| Crear | `app/(storefront)/search/loading.tsx` |
| Crear | `app/(backoffice)/admin/error.tsx` |
| Crear | `app/(backoffice)/admin/orders/loading.tsx` |
| Crear | `app/(backoffice)/admin/products/loading.tsx` |
| Crear | `app/(backoffice)/admin/dashboard/loading.tsx` |
| Crear | `components/store/product-card-skeleton.tsx` |
| Crear | `public/og-image.jpg` |
| Crear | `public/favicon.ico` |
| Crear | `lib/rate-limit.ts` |
| Modificar | `app/layout.tsx` (metadata completo, analytics) |
| Modificar | `next.config.ts` (images, security headers) |
| Modificar | `.env.local` (añadir UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN) |

## Criterios de aceptación

- [ ] Todas las páginas tienen metadata SEO apropiado.
- [ ] Sitemap dinámico genera URLs de todos los productos publicados.
- [ ] robots.txt bloquea `/admin/*` de indexación.
- [ ] Loading skeletons aparecen durante la carga de datos.
- [ ] Error boundaries capturan errores sin crash total.
- [ ] 404 personalizados para rutas inexistentes.
- [ ] Imágenes optimizadas con next/image en todas las páginas.
- [ ] La app se siente fluida en iPhone y Android.
- [ ] Deploy en Vercel funciona con dominio personalizado.
- [ ] Variables de entorno configuradas correctamente en Vercel.
- [ ] Lighthouse Mobile: Performance > 90, SEO > 90.
- [ ] Checklist de testing manual completamente verde.

## Commits sugeridos

```
feat(seo): add sitemap, robots.txt, manifest and page metadata
feat(ux): add loading skeletons and error boundaries across all routes
feat(perf): optimize images, add security headers and analytics
chore(deploy): configure Vercel deployment with environment variables
```
