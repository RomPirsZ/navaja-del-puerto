// Constitución I: sin JavaScript se lee todo (spec §5.4).
import { test, expect } from '@playwright/test';

test.use({ javaScriptEnabled: false });

test('sin JavaScript se leen servicios, barberos, horario, zona y el aviso de la reserva', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#servicios .pista')).toHaveCount(5);
  await expect(page.locator('#barberos h3')).toHaveText(['Ramón', 'Leo', 'Jesús']);
  await expect(page.locator('.semana-dia')).toHaveCount(7);
  await expect(page.getByText('Zona colonial de Puerto Cabello')).toBeVisible();
  await expect(page.locator('[data-reserva]')).toContainText('necesita JavaScript');
  // El estado en vivo necesita el reloj del visitante: sin JS no aparece vacío, ni en el
  // horario ni en la franja del hero (que tampoco deja su nota suelta)
  const estados = page.locator('[data-estado-apertura]');
  await expect(estados).toHaveCount(2);
  for (const estado of await estados.all()) await expect(estado).toBeHidden();
  await expect(page.locator('.hero-estado')).toBeHidden();
});

test('sin JavaScript el menú del móvil sigue funcionando (popover nativo)', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Menú' }).click();
  await expect(page.locator('#menu-principal').getByRole('link', { name: 'Barberos' })).toBeVisible();
});
