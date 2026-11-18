// La página (spec §4, R06): lo que se necesita está a la vista y funciona con teclado.
import { test, expect } from '@playwright/test';

test('el aviso de concepto, el nombre y la acción se ven sin hacer scroll', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Concepto de [A]nkordev: esta barbería no existe')).toBeInViewport();
  await expect(page.getByRole('heading', { level: 1 })).toBeInViewport();
  await expect(page.getByRole('link', { name: /^Reservar( turno)?$/ }).first()).toBeInViewport();
});

test('los cinco servicios llevan duración y precio de ejemplo', async ({ page }) => {
  await page.goto('/');
  const pistas = page.locator('#servicios .pista');
  await expect(pistas).toHaveCount(5);
  await expect(pistas.nth(1)).toContainText('Corte y barba');
  await expect(pistas.nth(1)).toContainText('60 min');
  await expect(pistas.nth(1)).toContainText('$12');
  await expect(page.getByText('Precios de ejemplo, en dólares.')).toBeVisible();
});

test('elegir un servicio o un barbero lleva a la reserva y lo deja en la URL', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /^Reservar Afeitado con navaja/ }).click();
  await expect(page).toHaveURL(/\?servicio=afeitado#reservar$/);
  await page.getByRole('link', { name: 'Reservar con Leo' }).click();
  await expect(page).toHaveURL(/servicio=afeitado&barbero=leo#reservar$/);
});

test('los barberos dicen sus días en palabras', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#barberos')).toContainText('De martes a domingo');
});

test('el horario muestra el estado en vivo con la hora de Puerto Cabello', async ({ page }) => {
  // Martes 24 de noviembre, 10:00 en Puerto Cabello
  await page.clock.setFixedTime(new Date('2026-11-24T14:00:00Z'));
  await page.goto('/');
  await expect(page.locator('[data-estado-apertura]')).toHaveText('Abierto hasta las 12');
  await expect(page.locator('.semana-dia[aria-current="date"] dt')).toHaveText('martes');
});

test.describe('móvil', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('el menú se abre con el teclado, lleva a una sección y se cierra', async ({ page }) => {
    await page.goto('/');
    const boton = page.getByRole('button', { name: 'Menú' });
    await boton.focus();
    await page.keyboard.press('Enter');
    const horario = page.locator('#menu-principal').getByRole('link', { name: 'Horario' });
    await expect(horario).toBeVisible();
    await horario.click();
    await expect(page).toHaveURL(/#horario$/);
    await expect(horario).toBeHidden();
  });

  test('Escape cierra el menú', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Menú' }).click();
    await expect(page.locator('#menu-principal')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#menu-principal')).toBeHidden();
  });
});

test('ninguna petición sale del propio origen', async ({ page, baseURL }) => {
  const fuera: string[] = [];
  page.on('request', (r) => {
    if (!r.url().startsWith(baseURL!) && !r.url().startsWith('data:')) fuera.push(r.url());
  });
  await page.goto('/');
  await page.locator('#reservar').scrollIntoViewIfNeeded();
  await page.locator('footer').scrollIntoViewIfNeeded();
  expect(fuera).toEqual([]);
});
