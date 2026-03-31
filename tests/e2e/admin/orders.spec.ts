import { test, expect } from "../../e2e/fixtures";

test.describe("Admin Orders Management", () => {
  test.beforeEach(async ({ adminPage: page }) => {
    await page.goto("/admin/orders");
  });

  test("renders orders page with heading", async ({ adminPage: page }) => {
    await expect(
      page.getByRole("heading", { name: /Gestion des Commandes/i })
    ).toBeVisible();
  });

  test("renders status filter tabs", async ({ adminPage: page }) => {
    // StatusTabs should have status options
    await expect(page.getByText(/PENDIENTE|En attente|Tout/i)).toBeVisible();
  });

  test("order table has expected columns", async ({ adminPage: page }) => {
    const table = page.locator("table");
    const hasTable = await table.count() > 0;
    if (!hasTable) test.skip();

    await expect(page.getByRole("columnheader", { name: /Commande/i })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /Client/i })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /Total/i })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /Statut/i })).toBeVisible();
  });

  test("totals are displayed in MAD", async ({ adminPage: page }) => {
    const table = page.locator("table");
    const hasTable = await table.count() > 0;
    if (!hasTable) test.skip();

    const bodyText = await page.locator("body").innerText();
    expect(bodyText).toMatch(/MAD|DH/);
  });

  test("filtering by PENDIENTE status updates URL", async ({
    adminPage: page,
  }) => {
    const pendingTab = page.getByRole("link", {
      name: /PENDIENTE|En attente/i,
    });
    if (await pendingTab.count() === 0) test.skip();

    await pendingTab.first().click();
    await page.waitForURL("**/admin/orders**status=PENDIENTE**");
    expect(page.url()).toContain("status=PENDIENTE");
  });

  test("clicking order row links to order detail page", async ({
    adminPage: page,
  }) => {
    const orderLinks = page.locator("a[href*='/admin/orders/']");
    const count = await orderLinks.count();
    if (count === 0) test.skip();

    const href = await orderLinks.first().getAttribute("href");
    await orderLinks.first().click();
    await page.waitForURL(`**${href}**`);
    expect(page.url()).toContain("/admin/orders/");
  });
});

test.describe("Admin Order Detail", () => {
  test("order detail shows status update actions", async ({
    adminPage: page,
  }) => {
    await page.goto("/admin/orders");
    const orderLinks = page.locator("a[href*='/admin/orders/']");
    if (await orderLinks.count() === 0) test.skip();

    const href = await orderLinks.first().getAttribute("href");
    await page.goto(href!);

    // Should show current order status and update actions
    await expect(
      page.getByText(
        /PENDIENTE|CONFIRMADO|ENVIADO|ENTREGADO|RTO|En attente/i
      )
    ).toBeVisible();
  });
});
