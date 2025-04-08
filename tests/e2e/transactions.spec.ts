import { expect, test } from "@playwright/test";

// Co testuju
test.describe("transactions page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://czechibank.ostrava.digital/");
    await page.getByLabel("Email").fill("vojta@czechibank.ostrava.digital");
    await page.getByLabel("Password").fill("hello123456");
    // I need to add locator('form') because there are another buttons with same name "Sign in" so you need to be more specific. And parent locator is form. 🎉
    await page.locator("form").getByRole("button", { name: "Sign in" }).click();
  });

  // jak testuju (co ocekavam)
  test("can create new transaction", async ({ page }) => {
    // Expect a title "to contain" a substring.
    await page.getByRole("heading", { name: "Secret bank account" }).click();

    await page.getByRole("combobox").click();
    await page.getByText("[OSTRAVA!!!] Pejsek a Kočicka 🐶&🐱", { exact: true }).last().click();
    await page.getByLabel("Amount").click();
    await page.getByLabel("Amount").fill("100");
    await page.getByRole("button", { name: "Transfer" }).click();

    await expect(page.getByRole("row", { name: "Vojta 🦊 Cerveny [OSTRAVA" }).getByRole("cell").first()).toBeVisible();
    await expect(page.getByRole("row", { name: "Vojta 🦊 Cerveny [OSTRAVA" }).getByRole("cell").nth(1)).toHaveText(
      "[OSTRAVA!!!] Pejsek a Kočicka 🐶&🐱",
    );
    await expect(page.getByRole("row", { name: "Vojta 🦊 Cerveny [OSTRAVA" }).getByRole("cell").nth(3)).toHaveText(
      "100",
    );
  });

  test("redirects me to /signin", async ({ page }) => {
    // Expect a title "to contain" a substring.
    await expect(page).toHaveURL("https://czechibank.ostrava.digital/signin");
  });

  test("can login with correct credentials", async ({ page }) => {
    const EMAIL = "zachranNas+brno@pejsekAKocicka.cz";
    const PASSWORD = "PejsekAKocicka123";
    const NAME = "[BRNO] Pejsek a Kočička 🐶&🐱";

    await page.fill('input[name="email"]', EMAIL);
    await page.fill('input[name="password"]', PASSWORD);

    await page.click('button[type="submit"]');
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL("https://czechibank.ostrava.digital/");
    await expect(page.getByRole("heading", { name: `Hello ${NAME}!` })).toBeVisible();
  });
});
