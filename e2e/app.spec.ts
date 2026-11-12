import { expect, test } from '@playwright/test';

test('visits the app root url', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.splash')).toBeVisible();
  await expect(page.getByText('Get Started')).toBeVisible({ timeout: 10000 });
  await page.getByText('Get Started').click();
  await expect(page.getByText('Featured Gift Cards')).toBeVisible();
});
