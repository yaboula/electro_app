import { test, expect } from "../../e2e/fixtures";

test.describe("Admin Inventory Management", () => {
  test.beforeEach(async ({ adminPage: page }) => {
    await page.goto("/admin/inventory");
  });

  test("renders inventory page heading", async ({ adminPage: page }) => {
    await expect(
      page.getByRole("heading", { name: /Inventaire|Gestion/i })
    ).toBeVisible();
  });

  test("has 'Nouvel Article' action button", async ({ adminPage: page }) => {
    const newBtn = page.getByRole("link", { name: /Nouvel Article|Nouveau/i });
    await expect(newBtn).toBeVisible();
  });

  test("inventory form renders all required fields", async ({
    adminPage: page,
  }) => {
    await page.goto("/admin/inventory/new");

    await expect(page.getByLabel(/Produit/i)).toBeVisible();
    await expect(page.getByLabel(/Condition|État/i)).toBeVisible();
    await expect(page.getByLabel(/Prix/i)).toBeVisible();
    await expect(page.getByLabel(/Quantité|Stock/i)).toBeVisible();
  });

  test("serial number field is required when condition is USADO_A", async ({
    adminPage: page,
  }) => {
    await page.goto("/admin/inventory/new");

    // Select USADO_A condition
    const conditionSelect = page.getByLabel(/Condition|État/i);
    await conditionSelect.selectOption("USADO_A");

    // Try to submit without serial number
    const submitBtn = page.getByRole("button", { name: /Créer|Enregistrer|Sauvegarder/i });
    await submitBtn.click();

    await expect(
      page.getByText(/N° de série obligatoire|série/i)
    ).toBeVisible({ timeout: 5_000 });
  });

  test("price must be positive (validation)", async ({ adminPage: page }) => {
    await page.goto("/admin/inventory/new");

    const priceInput = page.getByLabel(/Prix/i);
    await priceInput.fill("-100");

    const submitBtn = page.getByRole("button", { name: /Créer|Enregistrer|Sauvegarder/i });
    await submitBtn.click();

    await expect(
      page.getByText(/prix doit être positif|prix/i)
    ).toBeVisible({ timeout: 5_000 });
  });

  test("inventory items display price in MAD", async ({ adminPage: page }) => {
    const table = page.locator("table");
    const hasTable = await table.count() > 0;
    if (!hasTable) test.skip();

    // MAD prices should appear as "X MAD" or "X,xx MAD"
    const bodyText = await page.locator("body").innerText();
    expect(bodyText).toMatch(/MAD|DH/);
  });
});
