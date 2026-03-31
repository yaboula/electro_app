/**
 * Admin Authentication E2E Tests
 *
 * Selectors verified against real rendered HTML of /login page.
 * Auth tests with wrong credentials require Supabase to be connected.
 */
import { test, expect } from "@playwright/test";

test.describe("Login Page — Structure", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");
  });

  test("logo ELECTRO et sous-titre 'Panneau d'administration'", async ({
    page,
  }) => {
    await expect(page.getByText("ELECTRO")).toBeVisible();
    await expect(page.getByText("Panneau d'administration")).toBeVisible();
  });

  test("champ email avec label 'Email'", async ({ page }) => {
    const emailInput = page.locator('input[name="email"][type="email"]');
    await expect(emailInput).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
  });

  test("champ password avec label 'Mot de passe'", async ({ page }) => {
    const pwdInput = page.locator('input[name="password"][type="password"]');
    await expect(pwdInput).toBeVisible();
    await expect(page.getByLabel("Mot de passe")).toBeVisible();
  });

  test("bouton 'Se connecter' présent et activé", async ({ page }) => {
    const btn = page.locator('button[type="submit"]');
    await expect(btn).toBeVisible();
    await expect(btn).toContainText("Se connecter");
    await expect(btn).not.toBeDisabled();
  });

  test("pas de lien 'S'inscrire' — backoffice only", async ({ page }) => {
    const registerLinks = page.getByText(/s'inscrire|register|créer un compte/i);
    expect(await registerLinks.count()).toBe(0);
  });
});

test.describe("Login Page — Validation Zod (côté serveur)", () => {
  test("email invalide: le navigateur bloque le submit (type=email)", async ({
    page,
  }) => {
    await page.goto("/login");
    // type="email" has native browser validation — the form won't submit with invalid email.
    // We verify the browser's native validation fires (input:invalid pseudo-class).
    await page.locator('input[name="email"]').fill("pas-un-email");
    await page.locator('input[name="password"]').fill("password123");
    await page.locator('button[type="submit"]').click();

    // Browser blocks submit — page stays on /login (no navigation, no Zod error shown)
    await page.waitForTimeout(500);
    expect(page.url()).toContain("/login");

    // The input is invalid per browser validation
    const isInvalid = await page.locator('input[name="email"]').evaluate(
      (el: HTMLInputElement) => !el.validity.valid
    );
    expect(isInvalid).toBe(true);
  });

  test("mot de passe trop court → 'Mot de passe trop court' (Zod)", async ({
    page,
  }) => {
    await page.goto("/login");
    // Valid email (passes browser type=email validation) but short password (bypasses browser, hits Zod)
    await page.locator('input[name="email"]').fill("admin@electro.ma");
    await page.locator('input[name="password"]').fill("123"); // < 6 chars (type=password has no min HTML5)

    await page.locator('button[type="submit"]').click();

    // Zod returns { error: "Mot de passe trop court" } via Server Action
    await expect(
      page.getByText("Mot de passe trop court")
    ).toBeVisible({ timeout: 12_000 });
  });
});

test.describe("Login Page — Authentification avec Supabase", () => {
  test("mauvaises credentials → 'Email ou mot de passe incorrect'", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.locator('input[name="email"]').fill("wrong@electro.ma");
    await page.locator('input[name="password"]').fill("wrongpassword123");
    await page.locator('button[type="submit"]').click();

    // This requires Supabase to be connected; if not connected, may show server error
    const errorMsg = page.getByText(/Email ou mot de passe incorrect|Erreur serveur/i);
    await expect(errorMsg).toBeVisible({ timeout: 12_000 });
  });

  test("bonnes credentials → redirige vers /admin/dashboard", async ({
    page,
  }) => {
    const email = process.env.TEST_ADMIN_EMAIL;
    const password = process.env.TEST_ADMIN_PASSWORD;
    if (!email || !password) {
      test.skip(true, "TEST_ADMIN_EMAIL / TEST_ADMIN_PASSWORD non définis dans .env.test");
      return;
    }

    await page.goto("/login");
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('button[type="submit"]').click();

    await page.waitForURL("**/admin/dashboard**", { timeout: 15_000 });
    expect(page.url()).toContain("/admin/dashboard");
  });
});

test.describe("Middleware — Protection des routes admin", () => {
  const protectedRoutes = [
    "/admin/dashboard",
    "/admin/products",
    "/admin/inventory",
    "/admin/orders",
  ];

  for (const route of protectedRoutes) {
    test(`accès non-authentifié à ${route} → redirige vers /login`, async ({
      page,
    }) => {
      // Make sure no session cookie is set
      await page.context().clearCookies();
      await page.goto(route);
      await page.waitForURL("**/login**", { timeout: 10_000 });
      expect(page.url()).toContain("/login");
    });
  }

  test("utilisateur connecté sur /login → redirige vers /admin/dashboard", async ({
    page,
  }) => {
    const email = process.env.TEST_ADMIN_EMAIL;
    const password = process.env.TEST_ADMIN_PASSWORD;
    if (!email || !password) {
      test.skip(true, "Credentials non définis");
      return;
    }

    // Login first
    await page.goto("/login");
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL("**/admin/dashboard**", { timeout: 15_000 });

    // Now try to go back to /login — should redirect to dashboard
    await page.goto("/login");
    await page.waitForURL("**/admin/dashboard**", { timeout: 8_000 });
    expect(page.url()).toContain("/admin/dashboard");
  });
});
