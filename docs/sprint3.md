# Sprint 3 — Autenticación Admin y Middleware de Protección

## Objetivo

Implementar el flujo completo de autenticación para el administrador: página de login, middleware de protección de rutas `/admin/*`, layout del backoffice con sidebar de navegación, y lógica de sign-out. Solo un admin (tú) accede al backoffice — no hay registro público.

**Dependencia:** Sprint 2 completado (Supabase configurado con clientes funcionando).

---

## Tareas

### 3.1 — Crear usuario admin en Supabase

No hay registro público. El admin se crea manualmente:

1. Ir a Supabase Dashboard → Authentication → Users → "Add user".
2. Crear con email/password (ej: `admin@electro.ma` / contraseña segura).
3. Este será el único usuario autenticado del sistema.

---

### 3.2 — Página de Login (`/login`)

**Archivo:** `app/(backoffice)/login/page.tsx`

**Diseño:**
- Centrada verticalmente, card con glassmorphism sobre fondo dark.
- Logo ELECTRO.ma arriba.
- Formulario con 2 campos: Email y Contraseña.
- Botón "Se connecter" (francés para UI).
- Manejo de errores visible (credenciales incorrectas).
- Redirige a `/admin/dashboard` tras login exitoso.

**Lógica:**
- Usar `react-hook-form` + `zod` para validación del formulario.
- Schema Zod:

```typescript
const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe trop court"),
});
```

- Server Action `loginAction(formData)`:
  1. Validar con Zod.
  2. Llamar `supabase.auth.signInWithPassword({ email, password })`.
  3. Si error → retornar `{ success: false, error: message }`.
  4. Si ok → `redirect("/admin/dashboard")`.

**Archivo de la action:** `app/(backoffice)/login/actions.ts`

---

### 3.3 — Middleware de protección de rutas

**Archivo:** `middleware.ts` (raíz del proyecto)

**Lógica:**
1. Interceptar TODAS las requests.
2. Usar `lib/supabase/middleware.ts` para refrescar la sesión (tokens).
3. Si la ruta empieza por `/admin`:
   - Obtener `supabase.auth.getUser()`.
   - Si NO hay usuario autenticado → `redirect("/login")`.
4. Si la ruta es `/login` y el usuario YA está autenticado → `redirect("/admin/dashboard")`.
5. Para cualquier otra ruta → pasar sin bloquear (es la tienda pública).

**Matcher config:**

```typescript
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

---

### 3.4 — Layout del Backoffice (Admin)

**Archivo:** `app/(backoffice)/layout.tsx` (reemplazar el placeholder del Sprint 1)

**Diseño:**
- **Desktop:** Sidebar fija a la izquierda (240px) + área de contenido a la derecha.
- **Móvil:** Sidebar oculta, accesible via Sheet (hamburger menu).
- Sidebar con fondo dark/glassmorphism, consistente con la estética gaming.

**Elementos del Sidebar:**
```
Logo ELECTRO.ma (link a /)
─────────────────
📊 Dashboard         → /admin/dashboard
📦 Produits           → /admin/products
🗃️ Inventaire        → /admin/inventory
📋 Commandes          → /admin/orders
─────────────────
🚪 Déconnexion        → action sign-out
```

- Cada enlace muestra estado activo (highlight primary) basado en `usePathname()`.
- El sidebar es un Client Component (`"use client"`).

**Componente:** `components/admin/admin-sidebar.tsx`

---

### 3.5 — Server Action de Sign-Out

**Archivo:** `app/(backoffice)/admin/actions.ts`

```typescript
"use server";
export async function signOutAction() {
  const supabase = await createClient(); // server client
  await supabase.auth.signOut();
  redirect("/login");
}
```

---

### 3.6 — Página Dashboard placeholder

**Archivo:** `app/(backoffice)/admin/dashboard/page.tsx`

Página simple que muestra:
- Título "Tableau de Bord".
- 4 Cards con métricas placeholder (se conectarán a queries reales en Sprint 7):
  - Commandes Aujourd'hui: `--`
  - Revenus du Mois: `-- MAD`
  - Produits en Stock: `--`
  - Taux de Livraison: `--%`

Cada card con icono, valor grande y label. Animadas con framer-motion fade-in.

---

## Archivos creados / modificados

| Acción | Archivo |
|--------|---------|
| Crear | `app/(backoffice)/login/page.tsx` |
| Crear | `app/(backoffice)/login/actions.ts` |
| Crear | `app/(backoffice)/admin/dashboard/page.tsx` |
| Crear | `app/(backoffice)/admin/actions.ts` |
| Crear | `components/admin/admin-sidebar.tsx` |
| Modificar | `app/(backoffice)/layout.tsx` (sidebar + auth check) |
| Crear | `middleware.ts` (protección de rutas) |
| Modificar | `lib/validations.ts` (añadir `loginSchema`) |

## Flujo de usuario

```
[Visitante] → /admin/* → middleware detecta sin sesión → redirect /login
[Admin] → /login → formulario → signInWithPassword → redirect /admin/dashboard
[Admin] → sidebar "Déconnexion" → signOut → redirect /login
[Admin] → /login (ya autenticado) → redirect /admin/dashboard
```

## Criterios de aceptación

- [ ] El usuario admin puede hacer login con email/password.
- [ ] Tras login exitoso, se redirige a `/admin/dashboard`.
- [ ] Acceder a `/admin/*` sin sesión redirige a `/login`.
- [ ] Acceder a `/login` con sesión activa redirige a `/admin/dashboard`.
- [ ] El sidebar muestra correctamente el enlace activo.
- [ ] El botón "Déconnexion" destruye la sesión y redirige a `/login`.
- [ ] La tienda pública (`/`, `/p`, `/item`) NO requiere autenticación.
- [ ] `npm run build` pasa sin errores.

## Commit sugerido

```
feat(auth): add admin login, route protection middleware and backoffice sidebar
```
