import { test, expect } from '@playwright/test';
import TransactionPage from '../page/TransactionPage';
import {describe} from 'node:test';


describe('Transaction Tests', async () => {
  const formData = {
      transactionId: undefined,
      transactionName: "TransactionTest",
      transactionAmount: "123",
      transactionDueDate: "2025-01-01"
    }
  test('Create transaction', async ({ page }) => {
    const transactionPage = new TransactionPage(page);
    await transactionPage.goto(undefined);

    await transactionPage.fillForm(formData);
    await transactionPage.submitTransaction();

    formData.transactionId = parseInt(await page.locator('#Id').textContent());
    await expect(transactionPage.transactionName).toHaveValue(formData.transactionName);
    await expect(transactionPage.transactionAmount).toHaveValue(formData.transactionAmount);
    await expect(transactionPage.transactionDueDate).toHaveValue(formData.transactionDueDate);
  });

  test('Edit transaction', async ({ page }) => {
    const transactionPage = new TransactionPage(page);
    await transactionPage.goto(formData.transactionName);

    await transactionPage.fillForm(formData);
    await transactionPage.submitTransaction();

    await expect(transactionPage.transactionName).toHaveValue(formData.transactionName);
    await expect(transactionPage.transactionAmount).toHaveValue(formData.transactionAmount);
    await expect(transactionPage.transactionDueDate).toHaveValue(formData.transactionDueDate);
  });

})