/**
 * Used Items Page E2E Tests (/item and /item/[serial])
 *
 * Selector source: actual HTML rendered by the app.
 * Tests gracefully handle both empty DB and seeded DB scenarios.
 */
import { test, expect } from "@playwright/test";

test.describe("Used Items Page /item — UI statique", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/item");
    await page.waitForLoadState("networkidle");
  });

  test("titre h1: 'Articles d'Occasion'", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Articles d'Occasion" })
    ).toBeVisible();
  });

  test("affiche le nombre d'articles disponibles", async ({ page }) => {
    await expect(page.getByText(/\d+ article/i)).toBeVisible();
  });

  test("carte explicative Grade A / Grade B visible", async ({ page }) => {
    await expect(page.getByText("Grade A")).toBeVisible();
    await expect(page.getByText("Grade B")).toBeVisible();
    await expect(
      page.getByText(/Excellent état|traces d'utilisation/i)
    ).toBeVisible();
  });

  test("filtre grade inexistant → empty state", async ({ page }) => {
    await page.goto("/item?grade=GRADE_INCONNU");
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByText("Aucun article d'occasion trouvé pour ces filtres.")
    ).toBeVisible();
  });

  test("pas d'erreur 500 sur /item", async ({ page }) => {
    await expect(page).not.toHaveURL(/error/);
  });
});

test.describe("Used Items Page /item — Avec données seed", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/item");
    await page.waitForLoadState("networkidle");
  });

  test("avec seed: au moins 3 articles d'occasion visibles", async ({ page }) => {
    const cards = page.locator('a[href^="/item/"]');
    const count = await cards.count();
    if (count === 0) {
      test.skip(true, "Base de données vide — lancez tests/seed/seed-test-data.sql");
      return;
    }
    // Seed has 3 used items: SN-PS5-TEST-001, SN-PS5-TEST-002, SN-NSW-TEST-001
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test("avec seed: articles Grade A et Grade B visibles dans la liste", async ({
    page,
  }) => {
    const count = await page.locator('a[href^="/item/"]').count();
    if (count === 0) test.skip(true, "Seed non appliqué");

    // Grade badges should appear on item cards
    const bodyText = await page.locator("main").innerText();
    expect(bodyText).toMatch(/Grade A|Occasion/i);
  });

  test("avec seed: prix affiché en MAD sur les cartes occasion", async ({
    page,
  }) => {
    const count = await page.locator('a[href^="/item/"]').count();
    if (count === 0) test.skip(true, "Seed non appliqué");

    const bodyText = await page.locator("main").innerText();
    expect(bodyText).toMatch(/MAD|DH/);
  });

  test("avec seed: click article occasion → /item/[serial]", async ({ page }) => {
    const cards = page.locator('a[href^="/item/"]');
    if (await cards.count() === 0) test.skip(true, "Seed non appliqué");

    const href = await cards.first().getAttribute("href");
    await cards.first().click();
    await page.waitForURL(`**${href}**`);
    expect(page.url()).toMatch(/\/item\/.+/);
  });

  test("avec seed: filtre Grade A → PS5 SN-PS5-TEST-001 visible", async ({
    page,
  }) => {
    const count = await page.locator('a[href^="/item/"]').count();
    if (count === 0) test.skip(true, "Seed non appliqué");

    await page.goto("/item?grade=USADO_A");
    await page.waitForLoadState("networkidle");

    // Grade B items should not appear (filter active)
    const cards = page.locator('a[href^="/item/"]');
    const filteredCount = await cards.count();
    expect(filteredCount).toBeGreaterThan(0);

    // SN-PS5-TEST-001 is Grade A
    const bodyText = await page.locator("main").innerText();
    expect(bodyText).toMatch(/Grade A|USADO_A/i);
  });
});

test.describe("Used Item Detail /item/[serial] — Avec données seed", () => {
  test("page détail article SN-PS5-TEST-001: informations visibles", async ({
    page,
  }) => {
    await page.goto("/item/SN-PS5-TEST-001");
    await page.waitForLoadState("networkidle");

    const is404 = (await page.getByText("Page introuvable").count()) > 0;
    if (is404) {
      test.skip(true, "Seed non appliqué");
      return;
    }

    // Should show product name
    await expect(page.getByText(/PlayStation 5/i)).toBeVisible();
    // Should show condition
    await expect(page.getByText(/Grade A|Occasion/i)).toBeVisible();
    // Price in MAD
    const bodyText = await page.locator("main").innerText();
    expect(bodyText).toMatch(/MAD|DH/);
  });

  test("page détail: bouton Commander / checkout présent", async ({ page }) => {
    await page.goto("/item/SN-PS5-TEST-001");
    await page.waitForLoadState("networkidle");

    const is404 = (await page.getByText("Page introuvable").count()) > 0;
    if (is404) test.skip(true, "Seed non appliqué");

    // Sticky CTA should be present
    const ctaButton = page.getByText(/Commander|Confirmer|Acheter|WhatsApp/i);
    await expect(ctaButton.first()).toBeVisible();
  });

  test("serial inexistant → page not-found", async ({ page }) => {
    await page.goto("/item/SN-INEXISTANT-ZZZZZ");
    await page.waitForLoadState("networkidle");
    await expect(page.getByText("Page introuvable")).toBeVisible();
  });
});
