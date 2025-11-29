// tests/transactions.api.spec.ts
import { test, expect, request } from '@playwright/test';

test('Create transaction', async ({ request }) => {
    const response = await request.post('http://localhost:5000/transaction', {
        data : {
            Name: "TestTransaction",
            Amount: 34,
            Date: "2022-01-06",
            Frequency: 2
        }
    });

    const j = await response.json();
    expect(j.id).not.toBeNull();
});

test('Update transaction', async ({ request }) => {
  const initialData = {
            Name: "TestTransaction",
            Amount: 34,
            StartDate: "2022-01-06",
            Frequency: 2
  };
  const createResponse = await request.post('http://localhost:5000/transaction', {data:initialData});
  const createResponseJson = await createResponse.json();

  const updateData = {
          Id: createResponseJson.id,
          Name: "TestTransaction2",
          Amount: 100,
          StartDate: "2025-01-06T00:00:00",
          Frequency: 1
      };

  await request.put('http://localhost:5000/transaction', {data:updateData});
  const getResponse = await request.get(`http://localhost:5000/transaction/${createResponseJson.id}`);
  const getResponseJson = await getResponse.json();

  expect(getResponseJson.amount).toBe(updateData.Amount);
  expect(getResponseJson.startDate).toBe(updateData.StartDate);
  expect(getResponseJson.frequency).toBe(updateData.Frequency);
});