import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://192.168.0.205:4400');

  // Send log to Seq using HTTP ingestion API
  await fetch('http://192.168.0.186:5341/api/events/raw', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Seq-ApiKey': '6zOMr8Kqg7CqxOb3BkgV'
    },
    body: JSON.stringify({
      Events: [
        {
          Timestamp: new Date().toISOString(),
          Level: 'Warning',
          MessageTemplate: 'Hello {name}',
          Properties: { name: 'World', thing:"theng" }
        }
      ]
    })
  });

  // Expect a title "to contain" a substring.
  //await expect(page).toHaveTitle(/Money Manager/);
});
