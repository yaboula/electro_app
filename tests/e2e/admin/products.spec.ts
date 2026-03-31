import { test, expect } from "../../e2e/fixtures";

test.describe("Admin Products Management", () => {
  test.beforeEach(async ({ adminPage: page }) => {
    await page.goto("/admin/products");
  });

  test("renders products page with header", async ({ adminPage: page }) => {
    await expect(
      page.getByRole("heading", { name: /Gestion des Produits/i })
    ).toBeVisible();
  });

  test("has 'Nouveau Produit' action button", async ({ adminPage: page }) => {
    const newBtn = page.getByRole("link", { name: /Nouveau Produit/i });
    await expect(newBtn).toBeVisible();
    await expect(newBtn).toHaveAttribute("href", "/admin/products/new");
  });

  test("new product form renders all required fields", async ({
    adminPage: page,
  }) => {
    await page.goto("/admin/products/new");

    await expect(page.getByLabel(/Titre/i)).toBeVisible();
    await expect(page.getByLabel(/Slug/i)).toBeVisible();
    await expect(page.getByLabel(/Plateforme/i)).toBeVisible();
    await expect(page.getByLabel(/Type/i)).toBeVisible();
    await expect(page.getByLabel(/Description/i)).toBeVisible();
  });

  test("new product form shows validation errors on empty submit", async ({
    adminPage: page,
  }) => {
    await page.goto("/admin/products/new");

    const submitBtn = page.getByRole("button", { name: /Créer|Enregistrer|Sauvegarder/i });
    await submitBtn.click();

    // Expect at least one validation error to appear
    await expect(page.locator("[class*='error'], [role='alert'], .text-destructive").first()).toBeVisible({
      timeout: 5_000,
    });
  });

  test("slug field rejects uppercase characters (validation)", async ({
    adminPage: page,
  }) => {
    await page.goto("/admin/products/new");

    await page.getByLabel(/Titre/i).fill("Test Product");
    await page.getByLabel(/Slug/i).fill("Invalid Slug With UPPERCASE");

    const submitBtn = page.getByRole("button", { name: /Créer|Enregistrer|Sauvegarder/i });
    await submitBtn.click();

    await expect(
      page.getByText(/Slug invalide/i)
    ).toBeVisible({ timeout: 5_000 });
  });

  test("product table renders platform and status columns when products exist", async ({
    adminPage: page,
  }) => {
    // Check table headers if products exist
    const table = page.locator("table");
    const hasTable = await table.count() > 0;
    if (!hasTable) test.skip();

    await expect(page.getByRole("columnheader", { name: /Plateforme/i })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /Statut/i })).toBeVisible();
  });
});

test.describe("Admin Products – Edit", () => {
  test("edit page loads for an existing product", async ({ adminPage: page }) => {
    await page.goto("/admin/products");

    const editLinks = page.locator("a[href*='/edit']");
    const count = await editLinks.count();
    if (count === 0) {
      test.skip();
      return;
    }

    const href = await editLinks.first().getAttribute("href");
    await page.goto(href!);

    // Should show a form with existing data
    await expect(page.getByLabel(/Titre/i)).toBeVisible();
    const titleValue = await page.getByLabel(/Titre/i).inputValue();
    expect(titleValue.length).toBeGreaterThan(0);
  });
});
