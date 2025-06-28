import { test, expect } from '@playwright/test';
import { sendLogToLoki }  from './utils/lokiLogger';

test('Check homepage links', async ({ page }) => {
  await page.goto('/');
  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('link', { name: 'Money Manager' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Due Till Payday' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Transactions' })).toBeVisible();
});
