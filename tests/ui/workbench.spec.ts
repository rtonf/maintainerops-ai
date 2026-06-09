import { expect, test } from "@playwright/test";

test("security review workbench renders primary maintainer workflow", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("MaintainerOps AI");
  await expect(page.getByText("Security Review Workbench")).toBeVisible();
  await expect(page.getByRole("heading", { name: "PR #4821 feat: add S3 export and audit logging" })).toBeVisible();
  await expect(page.getByText("AI Assessment")).toBeVisible();
  await expect(page.getByText("Security Alerts", { exact: true })).toBeVisible();
});
