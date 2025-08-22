import { test, expect } from '@playwright/test';

test('App test', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('h1')
  await expect(page.locator('h1')).toContainText('Vanilla JavaScript App');
})

test('API test', async ({ request }) => {
  const response = await request.get('http://localhost:7071/api/message');
  await expect(response).toBeOK();
});
