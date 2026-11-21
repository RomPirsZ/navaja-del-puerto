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

test('Archivo carga desde el propio origen', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  // document.fonts.check() da true también si la fuente no existe: se mira cada FontFace
  const cargadas = await page.evaluate(() =>
    [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/"/g, '')),
  );
  expect(cargadas).toContain('Archivo Variable');
});

test('theme-color coincide con el carbón de la barra superior', async ({ page }) => {
  // La meta no admite variables CSS: este test evita que se desincronice de --carbon
  await page.goto('/');
  const carbon = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--carbon').trim());
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', carbon);
});

test('la navaja es decorativa: no llega al árbol de accesibilidad', async ({ page }) => {
  await page.goto('/');
  const navaja = page.locator('svg.navaja').first();
  await expect(navaja).toHaveAttribute('aria-hidden', 'true');
});
