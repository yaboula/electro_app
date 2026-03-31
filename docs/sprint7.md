# Sprint 7 — Gestión de Pedidos y Dashboard con Métricas Reales

## Objetivo

Construir el sistema completo de gestión de pedidos en el panel admin: tabla de pedidos con filtros por estado, vista de detalle de cada pedido, flujo de cambio de estados (PENDIENTE → CONFIRMADO → ENVIADO → ENTREGADO / RTO), notas de despacho, y conectar el dashboard con métricas reales de la base de datos.

**Dependencia:** Sprint 6 completado (pedidos creándose en la DB desde el checkout).

---

## Tareas

### 7.1 — Listado de Pedidos (`/admin/orders`)

**Archivo:** `app/(backoffice)/admin/orders/page.tsx`

**Diseño:**
- Título "Gestion des Commandes" con contador total.
- **Tabs de estado** (arriba): Tous | Pendientes | Confirmés | Expédiés | Livrés | RTO
  - Cada tab muestra un badge con el count de pedidos en ese estado.
  - Tab activo resaltado con primary.
- **Tabla de pedidos:**

| Columna | Detalle |
|---------|---------|
| # Commande | ID corto (8 chars), clickeable → detalle |
| Date | Fecha de creación (format: "31 mars 2026, 14:30") |
| Client | Nombre + teléfono (clickeable → WhatsApp) |
| Ville | Ciudad de entrega |
| Total | Monto en MAD |
| Statut | Badge de color según estado |
| Actions | Botones de cambio de estado rápido |

**Colores de status badges:**

| Estado | Color | Icono |
|--------|-------|-------|
| PENDIENTE | Amarillo/amber | Clock |
| CONFIRMADO | Azul | CheckCircle |
| ENVIADO | Púrpura | Truck |
| ENTREGADO | Verde | PackageCheck |
| RTO | Rojo | XCircle |

**Ordenamiento:** Por fecha de creación descendente (más reciente arriba).

**Data fetching:**

```sql
SELECT o.*,
  c.full_name as customer_name,
  c.phone as customer_phone,
  c.successful_deliveries,
  c.failed_deliveries,
  json_agg(json_build_object(
    'id', oi.id,
    'quantity', oi.quantity,
    'unit_price', oi.unit_price_at_purchase,
    'product_title', p.title,
    'condition', ii.condition
  )) as items
FROM orders o
JOIN customers c ON c.id = o.customer_id
JOIN order_items oi ON oi.order_id = o.id
JOIN inventory_items ii ON ii.id = oi.inventory_item_id
JOIN products p ON p.id = ii.product_id
GROUP BY o.id, c.id
ORDER BY o.created_at DESC
```

---

### 7.2 — Detalle de Pedido (`/admin/orders/[id]`)

**Archivo:** `app/(backoffice)/admin/orders/[id]/page.tsx`

**Diseño (2 columnas en desktop, stack en móvil):**

**Columna izquierda:**
- **Card "Informations Client":**
  - Nom: valor
  - Téléphone: valor (con link `tel:` y link WhatsApp)
  - Ville: valor
  - Adresse: valor (completa)
  - Historique: "X livraisons réussies, Y échecs" con indicador de fiabilidad.

- **Card "Articles Commandés":**
  - Lista de items con miniatura, nombre, condición, cantidad, precio unitario.
  - Subtotal por item.
  - **Total de la commande** (bold, grande).

**Columna derecha:**
- **Card "Statut de la Commande":**
  - Estado actual (badge grande).
  - **Timeline visual** del pedido (stepper vertical):
    ```
    ✅ Commande créée — 31 mars 2026, 14:30
    ✅ Confirmée — 31 mars 2026, 15:00
    🔵 Expédiée — (en attente)
    ⚪ Livrée — (en attente)
    ```
  - Botones de acción según estado actual (ver 7.3).

- **Card "Notes de Dispatch":**
  - Textarea para añadir notas internas (tracking, transportista, etc.).
  - Botón "Enregistrer les notes".

---

### 7.3 — Flujo de estados (State Machine)

**Transiciones permitidas:**

```
PENDIENTE   → CONFIRMADO  (admin confirma tras llamada WhatsApp)
PENDIENTE   → RTO         (cliente no responde / cancela)
CONFIRMADO  → ENVIADO     (admin despacha el paquete)
CONFIRMADO  → RTO         (cliente cancela antes del envío)
ENVIADO     → ENTREGADO   (entrega exitosa)
ENVIADO     → RTO         (entrega fallida)
```

**Transiciones NO permitidas:**
- No se puede retroceder (CONFIRMADO → PENDIENTE).
- ENTREGADO y RTO son estados finales.

**Archivo:** `app/(backoffice)/admin/orders/actions.ts`

**Server Actions:**

```typescript
// updateOrderStatusAction(orderId: string, newStatus: OrderStatus)
// 1. Obtener pedido actual.
// 2. Validar transición (state machine).
// 3. UPDATE orders SET status = newStatus.
// 4. Side effects según transición:
//    - → ENTREGADO: INCREMENT customers.successful_deliveries
//    - → RTO: INCREMENT customers.failed_deliveries
//    - → RTO (desde PENDIENTE/CONFIRMADO): RESTAURAR stock del inventory_item
// 5. revalidatePath("/admin/orders")

// updateDispatchNotesAction(orderId: string, notes: string)
// 1. UPDATE orders SET dispatch_notes = notes
// 2. revalidatePath
```

**Restauración de stock en RTO:**
- Si el pedido se marca como RTO ANTES de ser entregado, el stock debe restaurarse.
- Para items usados: volver a `is_active = true`.
- Para items nuevos: `stock_quantity = stock_quantity + quantity`.

---

### 7.4 — Acciones rápidas en la tabla

Botones inline en la tabla de pedidos según estado:

| Estado actual | Acciones disponibles |
|---|---|
| PENDIENTE | ✅ Confirmer / ❌ Annuler (RTO) |
| CONFIRMADO | 📦 Expédier / ❌ Annuler (RTO) |
| ENVIADO | ✅ Livré / ❌ Retour (RTO) |
| ENTREGADO | — (estado final) |
| RTO | — (estado final) |

Cada acción abre un `ConfirmDialog` antes de ejecutar.

---

### 7.5 — Dashboard con Métricas Reales (`/admin/dashboard`)

**Archivo:** `app/(backoffice)/admin/dashboard/page.tsx` (reemplazar placeholder Sprint 3)

**Métricas (4 cards principales):**

1. **Commandes Aujourd'hui**
   - Query: `SELECT COUNT(*) FROM orders WHERE created_at >= CURRENT_DATE`
   - Icono: ShoppingBag, color amber.

2. **Revenus du Mois**
   - Query: `SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status = 'ENTREGADO' AND created_at >= date_trunc('month', CURRENT_DATE)`
   - Formato: `formatMAD(amount)`
   - Icono: TrendingUp, color green.

3. **Produits en Stock**
   - Query: `SELECT COUNT(*) FROM inventory_items WHERE is_active = true AND stock_quantity > 0`
   - Icono: Package, color blue.

4. **Taux de Livraison**
   - Query: `delivered / (delivered + rto) * 100` del último mes.
   - Formato: `XX%`
   - Icono: Truck, color según valor (verde >80%, amarillo 60-80%, rojo <60%).

**Sección "Commandes Récentes":**
- Tabla resumida de las últimas 10 pedidos (sin paginación).
- Columnas: #, Client, Total, Statut, Hace cuánto tiempo (ej: "il y a 2h").
- Link "Voir toutes les commandes" → `/admin/orders`.

**Sección "Alertes":**
- Card de alerta si hay pedidos PENDIENTE hace más de 24h sin confirmar.
- Card de alerta si hay items con stock = 1 (stock bajo).

---

### 7.6 — Enlace rápido a WhatsApp del cliente

En la tabla de pedidos y en el detalle, el teléfono del cliente es clickeable:

```typescript
function WhatsAppLink({ phone, orderId }: { phone: string; orderId: string }) {
  const message = encodeURIComponent(
    `Bonjour! Concernant votre commande #${orderId.slice(0, 8).toUpperCase()} sur ELECTRO.ma...`
  );
  return (
    <a href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${message}`}>
      {phone}
    </a>
  );
}
```

---

### 7.7 — Helper de tiempo relativo

**Añadir a `lib/utils.ts`:**

```typescript
export function timeAgo(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMin / 60);
  const diffD = Math.floor(diffH / 24);

  if (diffMin < 1) return "à l'instant";
  if (diffMin < 60) return `il y a ${diffMin}min`;
  if (diffH < 24) return `il y a ${diffH}h`;
  if (diffD < 7) return `il y a ${diffD}j`;
  return new Intl.DateTimeFormat("fr-MA", { dateStyle: "medium" }).format(past);
}
```

---

## Archivos creados / modificados

| Acción | Archivo |
|--------|---------|
| Crear | `app/(backoffice)/admin/orders/page.tsx` |
| Crear | `app/(backoffice)/admin/orders/[id]/page.tsx` |
| Crear | `app/(backoffice)/admin/orders/actions.ts` |
| Modificar | `app/(backoffice)/admin/dashboard/page.tsx` (métricas reales) |
| Crear | `components/admin/order-status-badge.tsx` |
| Crear | `components/admin/order-timeline.tsx` |
| Crear | `components/admin/whatsapp-link.tsx` |
| Crear | `lib/queries.ts` (añadir queries de orders y dashboard) |
| Modificar | `lib/utils.ts` (añadir `timeAgo`) |

## Criterios de aceptación

- [ ] La tabla de pedidos muestra todos los pedidos con filtro por estado.
- [ ] El detalle de pedido muestra info completa del cliente, items y timeline.
- [ ] Las transiciones de estado siguen la state machine definida (no se puede saltar).
- [ ] Al marcar ENTREGADO, se incrementa `successful_deliveries` del customer.
- [ ] Al marcar RTO, se incrementa `failed_deliveries` Y se restaura el stock.
- [ ] Las notas de despacho se guardan correctamente.
- [ ] El dashboard muestra las 4 métricas con datos reales de la DB.
- [ ] Las alertas de pedidos antiguos y stock bajo aparecen cuando corresponde.
- [ ] Los enlaces a WhatsApp del cliente funcionan con mensaje pre-armado.
- [ ] `npm run build` pasa sin errores.

## Commits sugeridos

```
feat(orders): add order listing with status tabs and quick actions
feat(orders): add order detail page with timeline and dispatch notes
feat(orders): implement order state machine with stock restoration on RTO
feat(dashboard): connect dashboard metrics to real database queries
```
