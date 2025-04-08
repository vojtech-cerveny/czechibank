import { expect, test } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("https://czechibank.ostrava.digital/signin");
  await page.getByLabel("Email").click();
  await page.getByLabel("Email").fill("vojta@c");

  await page.getByLabel("Email").press("ControlOrMeta+a");
  await page.getByLabel("Email").fill("vojta@czechibank.ostrava.digital");
  await page.getByLabel("Email").press("Tab");
  await page.getByLabel("Password").fill("hello123456");
  await page.locator("form").getByRole("button", { name: "Sign in" }).click();
  await page.getByRole("link", { name: "Secret bank account" }).click();
  await page.getByRole("combobox").click();
  await page.getByText("[OSTRAVA!!!] Pejsek a Kočicka 🐶&🐱", { exact: true }).click();
  await page.getByPlaceholder("Amount").click();
  await page.getByPlaceholder("Amount").fill("0100");
  await page.getByRole("button", { name: "Transfer" }).click();
  await expect(page.getByRole("row", { name: "Vojta 🦊 Cerveny [OSTRAVA" }).getByRole("cell").first()).toBeVisible();
  await page.getByText("DUE to bad performance, you").click();
  await page.getByText("DUE to bad performance, you").click();
});
