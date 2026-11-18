// Constitución III: cero violaciones serias o críticas de axe (WCAG 2.2 AA).
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('la página no tiene violaciones serias ni críticas', async ({ page }) => {
  await page.goto('/');
  await page.locator('#reservar').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-reserva]')).toHaveAttribute('data-lista', 'true');
  const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  const graves = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  expect(graves.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
});
