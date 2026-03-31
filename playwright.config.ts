import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["list"],
  ],

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "on-first-retry",
    // Dark mode preference (project uses dark by default)
    colorScheme: "dark",
  },

  projects: [
    // Storefront tests – desktop
    {
      name: "storefront-desktop",
      testMatch: "**/storefront/**/*.spec.ts",
      use: { ...devices["Desktop Chrome"] },
    },
    // Storefront tests – mobile (App-Like experience)
    {
      name: "storefront-mobile",
      testMatch: "**/storefront/**/*.spec.ts",
      use: { ...devices["Pixel 7"] },
    },
    // Admin back-office (desktop only)
    {
      name: "admin",
      testMatch: "**/admin/**/*.spec.ts",
      use: { ...devices["Desktop Chrome"] },
    },
    // Checkout flow (critical path – both viewports)
    {
      name: "checkout-desktop",
      testMatch: "**/checkout/**/*.spec.ts",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "checkout-mobile",
      testMatch: "**/checkout/**/*.spec.ts",
      use: { ...devices["Pixel 7"] },
    },
  ],

  // Reuse existing dev server if already running; start it otherwise.
  // Set PLAYWRIGHT_BASE_URL env var to override the port (e.g. 3001).
  webServer: {
    command: "npm run dev",
    url: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
