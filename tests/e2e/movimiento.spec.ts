// Movimiento (spec §8, plan §7, constitución II): entra, termina en su sitio y desaparece con
// reduced-motion. Sin reloj fijo: Anime.js mide el tiempo con el reloj real.
import { test, expect } from '@playwright/test';

test.describe('con movimiento', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('el nombre entra letra a letra y termina en su sitio, legible para lectores de pantalla', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/\bmotion-ready\b/);
    await expect.poll(async () => page.locator('.funda-nombre').evaluate((h) => h.querySelectorAll('span').length)).toBeGreaterThan(10);
    // Al terminar, ninguna letra queda girada ni transparente
    await expect
      .poll(() =>
        page.locator('.funda-nombre').evaluate((h) =>
          [...h.querySelectorAll<HTMLElement>('.linea span')].every((s) => {
            const estilo = getComputedStyle(s);
            return estilo.opacity === '1' && (estilo.transform === 'none' || estilo.transform === 'matrix(1, 0, 0, 1, 0, 0)');
          }),
        ),
      )
      .toBe(true);
    await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(/Navaja\s*del\s*Puerto/);
  });

  test('las secciones se revelan al entrar y quedan visibles', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/\bmotion-ready\b/);
    const titulo = page.locator('#barberos-titulo');
    await titulo.scrollIntoViewIfNeeded();
    await expect.poll(() => titulo.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
  });
});

test('con reduced-motion no hay animaciones: nada se parte ni se oculta', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).not.toHaveClass(/\bmotion\b/);
  expect(await page.locator('.funda-nombre .linea span').count()).toBe(0);
  await page.locator('#horario').scrollIntoViewIfNeeded();
  const opacidades = await page.locator('[data-revelar]').evaluateAll((els) => els.map((el) => getComputedStyle(el).opacity));
  expect(opacidades.every((o) => o === '1')).toBe(true);
});

test.describe('sin el módulo de movimiento', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('si el módulo no llega, el contenido aparece igual a los 2,5 s', async ({ page }) => {
    await page.route(/animations.*\.js$|Base\.astro.*\.js$/, (ruta) => ruta.abort());
    await page.route('**/_astro/*.js', async (ruta) => {
      const cuerpo = await (await ruta.fetch()).text();
      // Only the motion module is dropped; the island keeps working
      if (cuerpo.includes('iniciarMovimiento') || cuerpo.includes('motion-ready')) return ruta.abort();
      return ruta.continue();
    });
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/\bmotion\b/);
    await expect(page.locator('html')).not.toHaveClass(/\bmotion-ready\b/);
    await expect.poll(() => page.locator('.funda-nombre').evaluate((el) => getComputedStyle(el).opacity), { timeout: 5000 }).toBe('1');
  });
});
