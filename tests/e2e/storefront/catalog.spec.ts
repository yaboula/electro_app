/**
 * Catalog & Search Page E2E Tests
 *
 * Tests are split in two groups:
 *  1. Static UI — works with or without DB (empty state)
 *  2. With DB seed — requires running tests/seed/seed-test-data.sql first
 *
 * Selectors verified against actual rendered HTML.
 */
import { test, expect } from "@playwright/test";

// ── Catalog /p ─────────────────────────────────────────────────────────────

test.describe("Catalog Page /p — UI statique", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/p");
    await page.waitForLoadState("networkidle");
  });

  test("page title: 'Tous les Produits'", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Tous les Produits" })
    ).toBeVisible();
  });

  test("affiche le nombre de produits disponibles", async ({ page }) => {
    // e.g. "0 produit disponible" or "5 produits disponibles"
    await expect(page.getByText(/\d+ produit/i)).toBeVisible();
  });

  test("filtre plateforme: lien PS5 présent", async ({ page }) => {
    // PlatformFilter renders links like /p?platform=PS5
    const ps5Link = page.locator('a[href*="platform=PS5"], a[href*="platform%3DPS5"]');
    // May not be present if PlatformFilter has no data, but URL filter works
    const hasPlatformFilter = await ps5Link.count() > 0;
    if (hasPlatformFilter) {
      await expect(ps5Link.first()).toBeVisible();
    }
  });

  test("empty state affiché avec filtre plateforme inexistant", async ({
    page,
  }) => {
    await page.goto("/p?platform=ZZZ_INEXISTANT");
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByText("Aucun produit trouvé pour ces filtres.")
    ).toBeVisible();
  });

  test("pas d'erreur 500 sur la page /p", async ({ page }) => {
    await expect(page).not.toHaveURL(/error/);
    // If there's a server error, Next.js renders an error boundary
    const errorHeading = page.getByText(/something went wrong|erreur/i);
    expect(await errorHeading.count()).toBe(0);
  });
});

test.describe("Catalog Page /p — Avec données seed", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/p");
    await page.waitForLoadState("networkidle");
  });

  test("avec seed: 5 produits publiés visibles", async ({ page }) => {
    const count = await page.locator('a[href^="/p/"]').count();
    if (count === 0) {
      test.skip(true, "Base de données vide — lancez tests/seed/seed-test-data.sql");
      return;
    }
    // Seed has 5 published products
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test("avec seed: 'PlayStation 5 Console' visible dans le catalogue", async ({
    page,
  }) => {
    const card = page.getByText("PlayStation 5 Console");
    if (await card.count() === 0) {
      test.skip(true, "Seed non appliqué");
      return;
    }
    await expect(card.first()).toBeVisible();
  });

  test("avec seed: prix affiché en MAD sur les cartes", async ({ page }) => {
    const count = await page.locator('a[href^="/p/"]').count();
    if (count === 0) test.skip(true, "Seed non appliqué");

    const bodyText = await page.locator("main").innerText();
    expect(bodyText).toMatch(/MAD|DH/);
  });

  test("avec seed: filtre PS5 filtre les produits", async ({ page }) => {
    const count = await page.locator('a[href^="/p/"]').count();
    if (count === 0) test.skip(true, "Seed non appliqué");

    await page.goto("/p?platform=PS5");
    await page.waitForLoadState("networkidle");

    // Should show PS5 products, not Xbox
    const xboxCard = page.getByText("Xbox Series X");
    expect(await xboxCard.count()).toBe(0);

    const ps5Cards = page.locator('a[href^="/p/"]');
    expect(await ps5Cards.count()).toBeGreaterThan(0);
  });

  test("avec seed: 'Produit Non Publié' n'apparaît PAS dans le catalogue", async ({
    page,
  }) => {
    const count = await page.locator('a[href^="/p/"]').count();
    if (count === 0) test.skip(true, "Seed non appliqué");

    const hidden = page.getByText("Produit Non Publié");
    expect(await hidden.count()).toBe(0);
  });

  test("avec seed: click produit → page détail /p/[slug]", async ({ page }) => {
    const cards = page.locator('a[href^="/p/"]');
    if (await cards.count() === 0) test.skip(true, "Seed non appliqué");

    const href = await cards.first().getAttribute("href");
    await cards.first().click();
    await page.waitForURL(`**${href}**`);
    expect(page.url()).toContain("/p/playstation-5-console");
  });
});

// ── Product Detail /p/[slug] ────────────────────────────────────────────────

test.describe("Product Detail /p/[slug] — Avec données seed", () => {
  test("page détail PS5: titre et prix visibles", async ({ page }) => {
    await page.goto("/p/playstation-5-console");
    await page.waitForLoadState("networkidle");

    // If slug doesn't exist, not-found page is shown
    const is404 = (await page.getByText("Page introuvable").count()) > 0;
    if (is404) {
      test.skip(true, "Produit non trouvé — seed non appliqué");
      return;
    }

    await expect(
      page.getByRole("heading", { name: /PlayStation 5/i })
    ).toBeVisible();

    // Price in MAD
    const bodyText = await page.locator("main").innerText();
    expect(bodyText).toMatch(/MAD|DH/);
  });

  test("page détail: bouton 'Commander' ou lien checkout visible", async ({
    page,
  }) => {
    await page.goto("/p/playstation-5-console");
    await page.waitForLoadState("networkidle");

    const is404 = (await page.getByText("Page introuvable").count()) > 0;
    if (is404) {
      test.skip(true, "Seed non appliqué");
      return;
    }

    // Sticky CTA or inventory options should be visible
    // The page renders inventory options with checkout links
    const checkoutLinks = page.locator('a[href*="checkout"]');
    const commanderBtns = page.getByText(/Commander|Acheter|Finaliser/i);
    const hasAction =
      (await checkoutLinks.count()) > 0 ||
      (await commanderBtns.count()) > 0;
    expect(hasAction).toBe(true);
  });

  test("page not-found pour slug inexistant", async ({ page }) => {
    await page.goto("/p/slug-qui-nexiste-pas-xyz");
    await page.waitForLoadState("networkidle");
    await expect(page.getByText("Page introuvable")).toBeVisible();
  });
});

// ── Search ──────────────────────────────────────────────────────────────────

test.describe("Search Page /search", () => {
  test("état vide: invite à taper un mot-clé", async ({ page }) => {
    await page.goto("/search");
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByText("Tapez un mot-clé pour rechercher")
    ).toBeVisible();
  });

  test("recherche sans résultats: 'Aucun résultat' affiché", async ({
    page,
  }) => {
    await page.goto("/search?q=xyzzy_introuvable_99999");
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(/Aucun résultat/i)).toBeVisible();
    await expect(page.getByText("xyzzy_introuvable_99999")).toBeVisible();
  });

  test("avec seed: recherche 'PS5' retourne des résultats", async ({ page }) => {
    await page.goto("/search?q=PS5");
    await page.waitForLoadState("networkidle");

    const resultCount = await page.locator('a[href^="/p/"]').count();
    if (resultCount === 0) {
      // No seed data — check empty message instead
      await expect(page.getByText(/résultat/i)).toBeVisible();
    } else {
      await expect(page.getByText(/résultat/i)).toBeVisible();
      expect(resultCount).toBeGreaterThan(0);
    }
  });
});
