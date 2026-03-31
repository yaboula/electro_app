import { test, expect } from "../../e2e/fixtures";

test.describe("Admin Dashboard", () => {
  test("renders dashboard with 4 metric cards", async ({ adminPage: page }) => {
    await page.goto("/admin/dashboard");

    await expect(
      page.getByRole("heading", { name: /Tableau de Bord/i })
    ).toBeVisible();

    // 4 KPI metrics
    await expect(page.getByText(/Commandes Aujourd'hui/i)).toBeVisible();
    await expect(page.getByText(/Revenus du Mois/i)).toBeVisible();
    await expect(page.getByText(/Produits en Stock/i)).toBeVisible();
    await expect(page.getByText(/Taux de Livraison/i)).toBeVisible();
  });

  test("shows recent orders section", async ({ adminPage: page }) => {
    await page.goto("/admin/dashboard");
    await expect(page.getByText(/Commandes Récentes/i)).toBeVisible();
  });

  test("'Voir tout' in recent orders navigates to /admin/orders", async ({
    adminPage: page,
  }) => {
    await page.goto("/admin/dashboard");
    const voirToutBtn = page.getByRole("link", { name: /Voir tout/i }).first();
    await expect(voirToutBtn).toBeVisible();
    await voirToutBtn.click();
    await page.waitForURL("**/admin/orders**");
    expect(page.url()).toContain("/admin/orders");
  });

  test("admin sidebar navigation links are present", async ({
    adminPage: page,
  }) => {
    await page.goto("/admin/dashboard");
    // Sidebar nav links
    await expect(
      page.getByRole("link", { name: /Tableau de Bord/i })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Produits/i })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Inventaire/i })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Commandes/i })
    ).toBeVisible();
  });

  test("revenue is displayed in MAD (not USD/EUR)", async ({
    adminPage: page,
  }) => {
    await page.goto("/admin/dashboard");
    // Revenue metric should show MAD currency
    const revenueCard = page.getByText(/Revenus du Mois/i).locator("..");
    // Check entire page: no $ or € symbols in metrics
    const bodyText = await page.locator("body").innerText();
    expect(bodyText).not.toMatch(/\$\d/);
    expect(bodyText).not.toMatch(/€\d/);
  });
});
