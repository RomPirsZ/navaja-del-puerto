import { test, expect } from '@playwright/test';

test('la página carga en español con su título y su h1', async ({ page }) => {
  const respuesta = await page.goto('/');
  expect(respuesta?.status()).toBe(200);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page).toHaveTitle(/Navaja del Puerto/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Navaja del Puerto');
});

test('la isla de reserva se hidrata: el aviso sin JS da paso a la reserva', async ({ page }) => {
  await page.goto('/');
  const isla = page.locator('[data-reserva]');
  await isla.scrollIntoViewIfNeeded();
  await expect(isla).toHaveAttribute('data-lista', 'true');
  await expect(isla).not.toContainText('necesita JavaScript');
});

test.describe('sin JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('la reserva explica que necesita JavaScript', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-reserva]')).toContainText('necesita JavaScript');
  });
});
