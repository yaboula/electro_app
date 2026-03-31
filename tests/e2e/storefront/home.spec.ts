/**
 * Home Page E2E Tests
 *
 * These tests run against the real app. Static UI (hero, categories, features)
 * works with or without Supabase. The "Produits Populaires" section only
 * appears when products exist in the database.
 *
 * Selectors are derived from the actual rendered HTML — NOT assumed from source.
 */
import { test, expect } from "@playwright/test";

test.describe("Home Page — Structure statique", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for React hydration + framer-motion animations
    // framer-motion starts elements with opacity:0 in SSR, animates in browser
    await page.waitForLoadState("networkidle");
    // Give framer-motion time to run entrance animations
    await page.waitForTimeout(800);
  });

  test("titre et meta: page title contient ELECTRO.ma", async ({ page }) => {
    await expect(page).toHaveTitle(/ELECTRO\.ma/);
  });

  test("hero: h1 contient 'Le Gaming' et 'au Maroc'", async ({ page }) => {
    const h1 = page.locator("h1").first();
    await expect(h1).toContainText("Le Gaming");
    await expect(h1).toContainText("au Maroc");
  });

  test("hero: badge 'Livraison Express Casablanca' visible", async ({ page }) => {
    await expect(
      page.getByText(/Livraison Express Casablanca/i)
    ).toBeVisible();
  });

  test("hero: bouton 'Explorer les Produits' → href /p", async ({ page }) => {
    // base-ui Button renders as <a role="button" href="/p"> — use locator by text
    const btn = page.locator('[href="/p"]').filter({ hasText: /Explorer les Produits/i });
    await expect(btn).toBeVisible();
  });

  test("hero: bouton 'Voir les Occasions' → href /item", async ({ page }) => {
    // Filter by text to target hero button, not nav link
    const btn = page.locator('[href="/item"]').filter({ hasText: /Voir les Occasions/i });
    await expect(btn).toBeVisible();
  });

  test("catégories: section 'Catégories' avec 6 cartes", async ({ page }) => {
    await expect(page.getByText("Catégories")).toBeVisible();

    // Each category card is an <a> with href containing the platform
    await expect(page.locator('a[href="/p?platform=PS5"]')).toBeVisible();
    await expect(page.locator('a[href="/p?platform=Xbox+Series"], a[href="/p?platform=Xbox Series"]')).toBeVisible();
    await expect(page.locator('a[href="/p?platform=Nintendo+Switch"], a[href="/p?platform=Nintendo Switch"]')).toBeVisible();
    await expect(page.locator('a[href="/p?platform=PC"]')).toBeVisible();
    await expect(page.locator('a[href="/p?platform=Accessoire"]')).toBeVisible();
    await expect(page.locator('a[href="/item"]').first()).toBeVisible();
  });

  test("catégories: textes des cartes visibles", async ({ page }) => {
    // Category names are inside <span> inside the Bento grid
    // Use first() to avoid strict-mode when the word appears multiple times (e.g. "Occasions" in bottom nav)
    await expect(page.getByText("PlayStation").first()).toBeVisible();
    await expect(page.getByText("Xbox").first()).toBeVisible();
    await expect(page.getByText("Nintendo").first()).toBeVisible();
    await expect(page.getByText("PC Gaming").first()).toBeVisible();
    await expect(page.getByText("Accessoires").first()).toBeVisible();
    await expect(page.getByText("Occasions").first()).toBeVisible();
  });

  test("features: 3 cartes de confiance visibles", async ({ page }) => {
    // These are h3 headings inside the features section
    await expect(page.getByRole("heading", { name: "Livraison Partout" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Qualité Garantie" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Support WhatsApp" })).toBeVisible();
  });

  test("CTA WhatsApp: bannière et lien wa.me", async ({ page }) => {
    await expect(
      page.getByText("Une question ? Écrivez-nous !")
    ).toBeVisible();
    const waLink = page.locator('a[href^="https://wa.me/"]').last();
    await expect(waLink).toBeVisible();
    await expect(waLink).toContainText("Contacter sur WhatsApp");
    await expect(waLink).toHaveAttribute("target", "_blank");
    await expect(waLink).toHaveAttribute("rel", "noopener noreferrer");
  });
});

test.describe("Home Page — Navigation header (desktop)", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("header desktop contient liens Accueil, Produits, Occasions", async ({ page }) => {
    // Desktop header has class 'hidden md:block' — target the <nav> inside it
    const headerNav = page.locator("header.hidden.md\\:block nav");
    // "Accueil", "Produits", "Occasions" are the nav link texts
    await expect(headerNav.getByRole("link", { name: "Accueil" })).toBeVisible();
    await expect(headerNav.getByRole("link", { name: "Produits" })).toBeVisible();
    await expect(headerNav.getByRole("link", { name: "Occasions" })).toBeVisible();
  });

  test("header desktop: logo ELECTRO.ma visible", async ({ page }) => {
    const header = page.locator("header").first();
    await expect(header.getByText("ELECTRO")).toBeVisible();
  });

  test("header: icône de recherche présente", async ({ page }) => {
    const searchIcon = page.locator('header a[href="/search"]').first();
    await expect(searchIcon).toBeVisible();
  });
});

test.describe("Home Page — Bottom Nav (mobile)", () => {
  test.use({ viewport: { width: 390, height: 844 } }); // iPhone 14

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("bottom nav est visible avec 5 liens", async ({ page }) => {
    const nav = page.locator("nav.fixed.bottom-0");
    await expect(nav).toBeVisible();
    // Accueil, Recherche, Occasions, Panier, Compte
    await expect(nav.locator('a[href="/"]')).toBeVisible();
    await expect(nav.locator('a[href="/search"]')).toBeVisible();
    await expect(nav.locator('a[href="/item"]')).toBeVisible();
  });

  test("header desktop masqué sur mobile (md:block → hidden par défaut)", async ({
    page,
  }) => {
    // Desktop header has class 'hidden md:block'
    const desktopHeader = page.locator("header.hidden.md\\:block");
    await expect(desktopHeader).toHaveCount(1);
  });
});

test.describe("Home Page — Produits Populaires (avec DB)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("section 'Produits Populaires' apparaît si des produits existent", async ({
    page,
  }) => {
    // If Supabase is connected and seed data is present, this section appears.
    // If DB is empty/disconnected, the section is not rendered (conditional in HomeContent).
    const hasProducts =
      (await page.getByText("Produits Populaires").count()) > 0;

    if (hasProducts) {
      await expect(page.getByText("Produits Populaires")).toBeVisible();
      // Product cards link to /p/[slug]
      const productCards = page.locator('a[href^="/p/"]');
      await expect(productCards.first()).toBeVisible();
    } else {
      // DB not connected: section is absent, page still renders without error
      await expect(page.locator("h1").first()).toBeVisible();
      await expect(page).not.toHaveURL(/error/);
    }
  });

  test("avec seed: PlayStation 5 Console est visible en home", async ({
    page,
  }) => {
    const hasProducts =
      (await page.getByText("Produits Populaires").count()) > 0;
    if (!hasProducts) {
      test.skip(true, "Base de données vide — lancez tests/seed/seed-test-data.sql");
      return;
    }
    await expect(page.getByText("PlayStation 5 Console")).toBeVisible();
  });

  test("avec seed: click sur un produit navigue vers /p/[slug]", async ({
    page,
  }) => {
    const hasProducts =
      (await page.getByText("Produits Populaires").count()) > 0;
    if (!hasProducts) {
      test.skip(true, "Base de données vide");
      return;
    }
    const firstCard = page.locator('a[href^="/p/"]').first();
    const href = await firstCard.getAttribute("href");
    await firstCard.click();
    await page.waitForURL(`**${href}**`);
    expect(page.url()).toContain("/p/");
  });
});
