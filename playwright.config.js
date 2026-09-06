const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  // e2e specs only — Vitest owns tests/*.test.js, so exclude those here
  // (Playwright's default matcher would otherwise pick up .test.js too).
  testMatch: "**/*.spec.js",
  timeout: 30_000,
  use: {
    baseURL: "http://localhost:3000",
    // Some environments preinstall Chromium at a fixed path (exposed via
    // PLAYWRIGHT_CHROMIUM_PATH); otherwise Playwright's own download is used.
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
      : {},
  },
  webServer: {
    command: "npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
