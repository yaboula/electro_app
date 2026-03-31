/**
 * Shared Playwright fixtures and helpers for the electro.ma test suite.
 */
import { test as base, expect, type Page } from "@playwright/test";

// ── Types ──────────────────────────────────────────────────────────────────

export interface AdminFixtures {
  adminPage: Page;
}

// ── Admin Auth Helper ──────────────────────────────────────────────────────

/**
 * Logs into the admin panel using environment credentials.
 * Falls back to placeholder values when env vars are not set (CI stub).
 */
export async function loginAsAdmin(page: Page) {
  const email = process.env.TEST_ADMIN_EMAIL ?? "admin@electro.ma";
  const password = process.env.TEST_ADMIN_PASSWORD ?? "test-password-123";

  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Mot de passe").fill(password);
  await page.getByRole("button", { name: "Se connecter" }).click();
  // Wait for redirect to dashboard
  await page.waitForURL("**/admin/dashboard", { timeout: 15_000 });
}

// ── Extended Test Fixture ──────────────────────────────────────────────────

export const test = base.extend<AdminFixtures>({
  adminPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await loginAsAdmin(page);
    await use(page);
    await context.close();
  },
});

export { expect };
