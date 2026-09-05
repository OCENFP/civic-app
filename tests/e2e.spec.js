const { test, expect } = require("@playwright/test");

test("home page renders", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Know Your Rights AI/i }).first()).toBeVisible();
});

test("learn shows the course and state-law lookup works", async ({ page }) => {
  await page.goto("/learn");
  await expect(page.getByRole("heading", { name: "Freedom 101" })).toBeVisible();

  await page.selectOption("select", "texas");
  await expect(page.getByText("Stop-and-identify state: Yes")).toBeVisible();

  await page.selectOption("select", "california");
  await expect(page.getByText("Searches: Warrant or probable cause required")).toBeVisible();
});

test("training scenario plays through to a win", async ({ page }) => {
  await page.goto("/train");
  await expect(page.getByRole("heading", { name: "Training" })).toBeVisible();

  await page
    .locator(".card", { hasText: "Traffic Stop" })
    .getByRole("button", { name: "Start" })
    .click();

  await page.getByRole("button", { name: "I do not consent to searches" }).click();
  await page.getByRole("button", { name: "I choose to remain silent" }).click();

  await expect(page.getByText("You protected your rights.")).toBeVisible();
  await expect(page.getByText("Correct choices: 2")).toBeVisible();
});

test("daily-challenge deep link preselects its scenario", async ({ page }) => {
  await page.goto("/train?scenario=door_knock_branching");
  await expect(page.getByRole("heading", { name: "Police at Your Door" })).toBeVisible();
  await expect(page.getByText("Mind if we come in")).toBeVisible();
});

test("onboarding ends on Start Training, not a blank step", async ({ page }) => {
  await page.goto("/onboarding");
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: "Next" }).click();

  await expect(page.getByText("Build confidence under pressure")).toBeVisible();
  await expect(page.getByRole("button", { name: "Start Training" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Next" })).toHaveCount(0);
});

test("leaderboard renders without crashing when the backend is unavailable", async ({ page }) => {
  await page.goto("/leaderboard");
  await expect(page.getByRole("heading", { name: "Leaderboard" })).toBeVisible();
  await expect(
    page.getByText(/unavailable|be the first/i)
  ).toBeVisible();
});

test("login page renders and links to signup", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByPlaceholder("Email")).toBeVisible();
  await expect(page.getByPlaceholder("Password")).toBeVisible();
  await expect(page.getByRole("link", { name: "Sign up" })).toBeVisible();
});

test("protected dashboard redirects logged-out visitors to login", async ({ page }) => {
  await page.goto("/dashboard");
  await page.waitForURL("**/login");
  await expect(page.getByPlaceholder("Email")).toBeVisible();
});
