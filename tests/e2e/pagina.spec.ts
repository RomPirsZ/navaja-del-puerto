// La página (spec §4, R06): lo que se necesita está a la vista y funciona con teclado.
import { test, expect } from '@playwright/test';

test('el titular y la acción se ven sin hacer scroll', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeInViewport();
  await expect(page.getByRole('link', { name: /^Reservar( turno)?$/ }).first()).toBeInViewport();
});

// Decisión del usuario (2026-11-21): el aviso de concepto va solo en el pie, no sobre la cabecera
test('el aviso de concepto está en el pie y nada va antes de la cabecera', async ({ page }) => {
  await page.goto('/');
  expect(await page.evaluate(() => document.body.firstElementChild?.tagName)).toBe('HEADER');
  await expect(page.locator('.aviso')).toHaveCount(0);
  await expect(page.locator('footer')).toContainText('Navaja del Puerto no existe');
  await expect(page.locator('footer')).toContainText('[A]nkordev');
  await expect(page.locator('footer')).toContainText('la reserva es una demo');
});

test('los cinco servicios llevan duración y precio de ejemplo', async ({ page }) => {
  await page.goto('/');
  // Decisión del usuario (2026-11-21): el título es solo «Servicios», sin «Lado A»
  await expect(page.locator('#servicios-titulo')).toHaveText('Servicios');
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

test('el horario y el hero muestran el estado en vivo con la hora de Puerto Cabello', async ({ page }) => {
  // Martes 24 de noviembre, 10:00 en Puerto Cabello
  await page.clock.setFixedTime(new Date('2026-11-24T14:00:00Z'));
  await page.goto('/');
  await expect(page.locator('#horario [data-estado-apertura]')).toHaveText('Abierto hasta las 12');
  await expect(page.locator('.hero [data-estado-apertura]')).toHaveText('Abierto hasta las 12');
  await expect(page.locator('.semana-dia[aria-current="date"] dt')).toHaveText('martes');
});

// Hero del rediseño (2026-11-21): a sangre en cualquier ancho, con «NAVAJA» decorativa detrás
for (const ancho of [390, 768, 1440]) {
  test.describe(`hero a ${ancho} px`, () => {
    test.use({ viewport: { width: ancho, height: ancho < 600 ? 844 : 900 } });

    test('ocupa todo el ancho, sin scroll horizontal, y llena el primer pantallazo', async ({ page }) => {
      await page.goto('/');
      const hero = page.locator('.hero');
      const caja = await hero.boundingBox();
      expect(caja?.x).toBe(0);
      expect(caja?.width).toBe(ancho);
      const { anchoDoc, alto } = await page.evaluate(() => ({
        anchoDoc: document.documentElement.scrollWidth,
        alto: window.innerHeight,
      }));
      expect(anchoDoc).toBeLessThanOrEqual(ancho);
      // The hero reaches the bottom of the first screen
      expect((caja?.y ?? 0) + (caja?.height ?? 0)).toBeGreaterThanOrEqual(alto - 1);
      await expect(page.locator('.hero-retrato img')).toBeInViewport();
    });
  });
}

test('la palabra gigante es decorativa y los rasgos del hero son servicios reales', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.hero-palabra')).toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator('.hero-palabra')).toHaveText(/navaja/i);
  const rasgos = page.locator('.hero-rasgos li');
  await expect(rasgos).toHaveCount(3);
  await expect(rasgos.nth(1)).toHaveText('Afeitado con navaja');
  await expect(page.locator('.hero-rasgos svg[aria-hidden="true"]')).toHaveCount(3);
});

// R19: la navaja del fondo del hero es una foto generada con IA, decorativa (alt vacío)
test('la navaja del hero es una foto decorativa y no el dibujo SVG', async ({ page }) => {
  await page.goto('/');
  const foto = page.locator('.hero-fondo img');
  await expect(foto).toHaveCount(1);
  await expect(foto).toHaveAttribute('alt', '');
  await expect(page.locator('.hero svg.navaja')).toHaveCount(0);
  // Decorative: it must never outgrow Leo, or it would become the LCP element
  const [navaja, retrato] = await Promise.all([foto.boundingBox(), page.locator('.hero-retrato').boundingBox()]);
  expect((navaja?.width ?? 0) * (navaja?.height ?? 0)).toBeLessThan((retrato?.width ?? 0) * (retrato?.height ?? 0));
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
