/**
 * Checkout E2E Tests
 *
 * Tests the checkout form, validation messages, and confirmation page.
 * Checkout form fields/selectors are verified against real rendered HTML.
 *
 * For tests requiring a real inventory item, the seed must be applied.
 * The confirmation page tests are fully static (use URL params).
 */
import { test, expect } from "@playwright/test";

// ── Helper ─────────────────────────────────────────────────────────────────

/**
 * Navigate to checkout for inventory item bbbbbbbb-0001 (PS5 Neuf, from seed).
 * Returns false if that item doesn't exist yet.
 */
async function gotoCheckoutForPS5(page: import("@playwright/test").Page): Promise<boolean> {
  // The checkout page is /checkout?item=[inventoryItemId]
  // Seed item id: bbbbbbbb-0001-4000-b000-000000000001
  const seedItemId = "bbbbbbbb-0001-4000-b000-000000000001";
  await page.goto(`/checkout?item=${seedItemId}`);
  await page.waitForLoadState("networkidle");

  // If the item doesn't exist, the page may redirect or show not-found
  const url = page.url();
  const isOnCheckout = url.includes("/checkout") && !url.includes("/confirmation");
  const hasForm = (await page.locator('form').count()) > 0;
  return isOnCheckout && hasForm;
}

/**
 * Navigate to checkout via product detail page (works with any available item).
 */
async function gotoCheckoutViaStorefront(page: import("@playwright/test").Page): Promise<boolean> {
  // Try used items first (they have direct checkout buttons)
  await page.goto("/item");
  await page.waitForLoadState("networkidle");

  const itemCards = page.locator('a[href^="/item/"]');
  if (await itemCards.count() === 0) return false;

  const href = await itemCards.first().getAttribute("href");
  await page.goto(href!);
  await page.waitForLoadState("networkidle");

  // Look for checkout/commander link or sticky CTA
  const checkoutLink = page.locator('a[href*="checkout"]').first();
  const commanderBtn = page.getByRole("button", { name: /Commander|Confirmer|Acheter/i }).first();

  if (await checkoutLink.count() > 0) {
    const checkoutHref = await checkoutLink.getAttribute("href");
    await page.goto(checkoutHref!);
    await page.waitForLoadState("networkidle");
  } else if (await commanderBtn.count() > 0) {
    await commanderBtn.click();
    await page.waitForLoadState("networkidle");
  } else {
    return false;
  }

  const hasForm = (await page.locator('input[name="fullName"]').count()) > 0;
  return hasForm;
}

// ── Checkout Form — Structure ──────────────────────────────────────────────

test.describe("Checkout Form — Champs requis", () => {
  test("formulaire a 4 champs: nom, téléphone, ville, adresse", async ({
    page,
  }) => {
    const onCheckout = await gotoCheckoutForPS5(page);
    if (!onCheckout) {
      // Try via storefront navigation
      const viaStorefront = await gotoCheckoutViaStorefront(page);
      if (!viaStorefront) {
        test.skip(true, "Pas d'article disponible — lancez tests/seed/seed-test-data.sql");
        return;
      }
    }

    // Verify all 4 form fields from actual HTML
    await expect(page.locator('input[name="fullName"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
    await expect(page.locator('select[name="city"]')).toBeVisible();
    await expect(page.locator('textarea[name="address"]')).toBeVisible();
  });

  test("formulaire: labels htmlFor correspondent aux inputs", async ({
    page,
  }) => {
    const onCheckout = await gotoCheckoutForPS5(page);
    if (!onCheckout) test.skip(true, "Seed non appliqué");

    await expect(page.getByLabel("Nom complet")).toBeVisible();
    await expect(page.getByLabel("Téléphone")).toBeVisible();
    await expect(page.getByLabel("Ville")).toBeVisible();
    await expect(page.getByLabel("Adresse complète")).toBeVisible();
  });

  test("formulaire: select ville contient les villes marocaines", async ({
    page,
  }) => {
    const onCheckout = await gotoCheckoutForPS5(page);
    if (!onCheckout) test.skip(true, "Seed non appliqué");

    const citySelect = page.locator('select[name="city"]');
    const options = await citySelect.locator("option").allInnerTexts();
    expect(options).toContain("Casablanca");
    expect(options).toContain("Rabat");
    expect(options).toContain("Marrakech");
    expect(options).toContain("Autre");
  });

  test("résumé: produit et prix affichés dans le panneau latéral", async ({
    page,
  }) => {
    const onCheckout = await gotoCheckoutForPS5(page);
    if (!onCheckout) test.skip(true, "Seed non appliqué");

    // Summary card should show product title and price
    const bodyText = await page.locator("main").innerText();
    expect(bodyText).toMatch(/Résumé/);
    expect(bodyText).toMatch(/MAD|DH/);
    expect(bodyText).toMatch(/Livraison/);
    expect(bodyText).toMatch(/Gratuite/);
    expect(bodyText).toMatch(/Total/);
  });

  test("badge COD visible: 'Paiement à la livraison'", async ({ page }) => {
    const onCheckout = await gotoCheckoutForPS5(page);
    if (!onCheckout) test.skip(true, "Seed non appliqué");

    await expect(
      page.getByText(/Paiement à la livraison|Cash on Delivery/i)
    ).toBeVisible();
  });
});

// ── Checkout Form — Validation ─────────────────────────────────────────────

test.describe("Checkout Form — Validation côté serveur", () => {
  test("numéro de téléphone invalide → message d'erreur", async ({ page }) => {
    const onCheckout = await gotoCheckoutForPS5(page);
    if (!onCheckout) test.skip(true, "Seed non appliqué");

    await page.locator('input[name="fullName"]').fill("Mohammed Test");
    await page.locator('input[name="phone"]').fill("1234"); // invalide
    await page.locator('select[name="city"]').selectOption("Casablanca");
    await page.locator('textarea[name="address"]').fill("123 Rue de Test, Ain Sebaa");

    // Submit the form
    await page.locator('button[type="submit"]').click();

    await expect(
      page.getByText(/Numéro de téléphone marocain invalide/i)
    ).toBeVisible({ timeout: 10_000 });
  });

  test("adresse trop courte → message d'erreur", async ({ page }) => {
    const onCheckout = await gotoCheckoutForPS5(page);
    if (!onCheckout) test.skip(true, "Seed non appliqué");

    await page.locator('input[name="fullName"]').fill("Mohammed Test");
    await page.locator('input[name="phone"]').fill("0612345678");
    await page.locator('select[name="city"]').selectOption("Casablanca");
    await page.locator('textarea[name="address"]').fill("Court"); // < 10 chars

    await page.locator('button[type="submit"]').click();

    await expect(
      page.getByText(/Adresse trop courte/i)
    ).toBeVisible({ timeout: 10_000 });
  });

  test("nom trop court → message d'erreur", async ({ page }) => {
    const onCheckout = await gotoCheckoutForPS5(page);
    if (!onCheckout) test.skip(true, "Seed non appliqué");

    await page.locator('input[name="fullName"]').fill("Mo"); // < 3 chars
    await page.locator('input[name="phone"]').fill("0612345678");
    await page.locator('select[name="city"]').selectOption("Casablanca");
    await page.locator('textarea[name="address"]').fill("123 Rue de Test, Ain Sebaa");

    await page.locator('button[type="submit"]').click();

    await expect(
      page.getByText(/au moins 3 caractères/i)
    ).toBeVisible({ timeout: 10_000 });
  });

  test("aucun widget de paiement en ligne (pas de Stripe/PayPal)", async ({
    page,
  }) => {
    const onCheckout = await gotoCheckoutForPS5(page);
    if (!onCheckout) test.skip(true, "Seed non appliqué");

    await expect(page.locator("iframe[src*='stripe']")).toHaveCount(0);
    await expect(page.locator("iframe[src*='paypal']")).toHaveCount(0);
    await expect(page.locator("[data-stripe]")).toHaveCount(0);
  });
});

// ── Checkout Confirmation Page ─────────────────────────────────────────────

test.describe("Checkout Confirmation Page /checkout/confirmation", () => {
  test("redirige vers /p si pas de orderId", async ({ page }) => {
    await page.goto("/checkout/confirmation");
    await page.waitForURL("**/p**", { timeout: 10_000 });
    expect(page.url()).toContain("/p");
  });

  test("redirige vers /p si pas de whatsappUrl", async ({ page }) => {
    await page.goto("/checkout/confirmation?order=test-order-123");
    await page.waitForURL("**/p**", { timeout: 10_000 });
    expect(page.url()).toContain("/p");
  });

  test("page complète avec paramètres valides", async ({ page }) => {
    const orderId = "12345678-abcd-4321-efab-000000000001";
    const waUrl = encodeURIComponent("https://wa.me/212600000000?text=Test+Commande");

    await page.goto(`/checkout/confirmation?order=${orderId}&wa=${waUrl}`);
    await page.waitForLoadState("networkidle");

    // Heading
    await expect(
      page.getByRole("heading", { name: "Commande enregistrée !" })
    ).toBeVisible();

    // Order ID (first 8 chars uppercased)
    await expect(page.getByText(/12345678/i)).toBeVisible();

    // WhatsApp button with correct href
    const waBtn = page.locator('a[href="https://wa.me/212600000000?text=Test+Commande"]');
    await expect(waBtn).toBeVisible();
    await expect(waBtn).toContainText("Ouvrir WhatsApp");
    await expect(waBtn).toHaveAttribute("target", "_blank");
    await expect(waBtn).toHaveAttribute("rel", "noopener noreferrer");

    // Back button
    const backBtn = page.locator('a[href="/p"]').last();
    await expect(backBtn).toBeVisible();
    await expect(backBtn).toContainText("Retour à la boutique");
  });

  test("aucun iframe de paiement sur la page de confirmation", async ({
    page,
  }) => {
    const orderId = "00000000-0000-4000-0000-000000000001";
    const waUrl = encodeURIComponent("https://wa.me/212600000000");

    await page.goto(`/checkout/confirmation?order=${orderId}&wa=${waUrl}`);
    await page.waitForLoadState("networkidle");

    await expect(page.locator("iframe[src*='stripe']")).toHaveCount(0);
    await expect(page.locator("iframe[src*='paypal']")).toHaveCount(0);
    await expect(page.locator("iframe[src*='adyen']")).toHaveCount(0);
  });

  test("message 'conseiller va vous contacter sur WhatsApp' visible", async ({
    page,
  }) => {
    const orderId = "00000000-0000-4000-0000-000000000001";
    const waUrl = encodeURIComponent("https://wa.me/212600000000");

    await page.goto(`/checkout/confirmation?order=${orderId}&wa=${waUrl}`);
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByText(/conseiller va vous contacter/i)
    ).toBeVisible();
  });
});

// ── Checkout Complet avec DB ───────────────────────────────────────────────

test.describe("Checkout Complet — Flux réel (avec DB et seed)", () => {
  test("commande réelle: remplir formulaire et être redirigé vers confirmation", async ({
    page,
  }) => {
    const onCheckout = await gotoCheckoutForPS5(page);
    if (!onCheckout) {
      test.skip(true, "Seed non appliqué ou item non disponible");
      return;
    }

    await page.locator('input[name="fullName"]').fill("Test E2E Playwright");
    await page.locator('input[name="phone"]').fill("0612345678");
    await page.locator('select[name="city"]').selectOption("Casablanca");
    await page.locator('textarea[name="address"]').fill(
      "123 Boulevard Hassan II, Quartier Test, Ain Sebaa"
    );

    await page.locator('button[type="submit"]').click();

    // Should redirect to confirmation page
    await page.waitForURL("**/checkout/confirmation**", { timeout: 20_000 });
    expect(page.url()).toContain("/checkout/confirmation");
    expect(page.url()).toContain("order=");
    expect(page.url()).toContain("wa=");

    // WhatsApp button should be present
    await expect(page.getByText("Commande enregistrée !")).toBeVisible();
    const waBtn = page.getByText("Ouvrir WhatsApp");
    await expect(waBtn).toBeVisible();
  });
});
