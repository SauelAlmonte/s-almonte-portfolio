import { test, expect } from "@playwright/test";

test.describe("public site", () => {
  test("homepage loads with hero heading and correct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Sauel Almonte/);
    // Hero <h1> — animated in via GSAP, but present + accessible immediately.
    await expect(page.getByRole("heading", { level: 1, name: /Almonte/i })).toBeVisible();
  });

  test("a skills card navigates to its category page", async ({ page }) => {
    await page.goto("/");
    const card = page.getByRole("button", {
      name: /Explore Full-Stack Web Dev projects/i,
    });
    await card.scrollIntoViewIfNeeded();
    await card.click();
    await expect(page).toHaveURL(/\/skills\/fullstack/);
    await expect(
      page.getByRole("heading", { name: /Full-Stack Projects/i }),
    ).toBeVisible();
  });

  test("skills category page renders its heading directly", async ({ page }) => {
    await page.goto("/skills/backend");
    await expect(
      page.getByRole("heading", { name: /Backend & AI Projects/i }),
    ).toBeVisible();
  });
});