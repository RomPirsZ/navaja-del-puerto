// La reserva de punta a punta (spec §5, R07). Reloj fijo: martes 17 de noviembre de 2026,
// 8:00 en Puerto Cabello. La ocupación simulada es determinista, así que se calcula aquí.
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { ocupacionSimulada } from '../../src/lib/reservas/ocupacion-simulada';
import { formatearHora } from '../../src/lib/reservas/tiempo';

const MARTES_8AM = new Date('2026-11-17T12:00:00Z');

async function abrir(page: Page, ruta = '/#reservar', instante = MARTES_8AM) {
  await page.clock.setFixedTime(instante);
  await page.goto(ruta);
  await page.locator('#reservar').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-reserva]')).toHaveAttribute('data-lista', 'true');
}

const opcion = (page: Page, nombre: string | RegExp) => page.locator('[data-reserva]').getByRole('button', { name: nombre });

async function hastaLaHora(page: Page, servicio: RegExp, barbero: RegExp, dia: string) {
  await opcion(page, servicio).click();
  await opcion(page, barbero).click();
  await opcion(page, dia).click();
  await expect(page.locator('.opcion-hora').first()).toBeVisible();
}

async function sinViolaciones(page: Page) {
  const { violations } = await new AxeBuilder({ page }).include('#reservar').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  const graves = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  expect(graves.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
}

test('reserva completa: la ficha refleja cada elección y termina con un código', async ({ page }) => {
  await abrir(page);
  await sinViolaciones(page);
  await hastaLaHora(page, /^Corte y barba/, /^Leo/, 'mié 25 nov');
  const ficha = page.locator('.ficha');
  await expect(ficha).toContainText('Corte y barba');
  await expect(ficha).toContainText('Leo');
  await expect(ficha).toContainText('mié 25 nov');
  await expect(ficha).toContainText('60 min · $12');
  await sinViolaciones(page);
  const hora = page.locator('.opcion-hora').first();
  const texto = (await hora.textContent())!.trim();
  await hora.click();
  await expect(ficha).toContainText(texto);
  await page.getByLabel('Tu nombre').fill('Ana');
  await sinViolaciones(page);
  await page.getByRole('button', { name: 'Confirmar turno' }).click();
  await expect(page.getByRole('heading', { name: 'Turno confirmado' })).toBeFocused();
  await expect(page.locator('.confirmacion-codigo strong')).toHaveText(/^NP-[A-HJKMNP-Z2-9]{4}$/);
  await expect(page.locator('.turnos')).toContainText('Corte y barba');
  await sinViolaciones(page);
});

test('solo con teclado: el foco va al título de cada paso', async ({ page }) => {
  await abrir(page);
  await opcion(page, /^Corte clásico/).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Elige con quién' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(opcion(page, /^El primero libre/)).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Elige el día' })).toBeFocused();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Elige la hora' })).toBeFocused();
  await expect(page.locator('.opcion-hora').first()).toBeVisible();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'A nombre de quién' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByLabel('Tu nombre')).toBeFocused();
  await page.keyboard.type('Beto');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Turno confirmado' })).toBeFocused();
});

test('las horas ocupadas no se ofrecen', async ({ page }) => {
  await abrir(page);
  await hastaLaHora(page, /^Corte clásico/, /^Ramón/, 'mar 24 nov');
  const ofrecidas = await page.locator('.opcion-hora').allTextContents();
  for (const m of ocupacionSimulada('2026-11-24', 'ramon')) expect(ofrecidas).not.toContain(formatearHora(m));
  expect(ofrecidas.length).toBeGreaterThan(0);
});

test('los días cerrados o en que el barbero no trabaja no se pueden elegir', async ({ page }) => {
  await abrir(page, '/?servicio=infantil&barbero=jesus#reservar');
  await expect(page.getByRole('heading', { name: 'Elige el día' })).toBeVisible();
  await expect(opcion(page, /^lun 23/)).toBeDisabled();
  await expect(opcion(page, /^lun 23/)).toContainText('Cerrado');
  await expect(opcion(page, /^mar 24/)).toBeDisabled();
  await expect(opcion(page, /^mar 24/)).toContainText('No trabaja');
  await expect(page.locator('.ficha')).toContainText('Corte infantil');
});

test('sin horas ese día, propone el siguiente con hueco', async ({ page }) => {
  // Martes 17, 18:45: el último hueco (18:30) ya no cumple los 30 minutos de antelación
  await abrir(page, '/#reservar', new Date('2026-11-17T22:45:00Z'));
  await opcion(page, /^Corte clásico/).click();
  await opcion(page, /^Leo/).click();
  await opcion(page, 'mar 17 nov').click();
  await expect(page.locator('.horas-estado')).toHaveText('No quedan horas libres el martes, 17 de noviembre.');
  await expect(page.locator('[aria-live="polite"]')).toHaveText('No quedan horas libres el martes, 17 de noviembre.');
  await page.getByRole('button', { name: 'Ver el miércoles, 18 de noviembre' }).click();
  await expect(page.locator('.opcion-hora').first()).toBeVisible();
});

test('la ficha reabre un paso sin perder lo demás', async ({ page }) => {
  await abrir(page);
  await hastaLaHora(page, /^Corte clásico/, /^Leo/, 'mié 25 nov');
  await page.locator('.ficha').getByRole('button', { name: 'Corte clásico: cambiar' }).click();
  await expect(page.getByRole('heading', { name: 'Elige el servicio' })).toBeFocused();
  await opcion(page, /^Arreglo de barba/).click();
  // Leo hace barba: se conserva con el día, y se vuelve a la hora
  await expect(page.getByRole('heading', { name: 'Elige la hora' })).toBeFocused();
  await expect(page.locator('.ficha')).toContainText('Leo');
});

test('si otra pestaña ocupa la hora, no se confirma y ofrece alternativas', async ({ context }) => {
  const a = await context.newPage();
  const b = await context.newPage();
  for (const p of [a, b]) {
    await abrir(p);
    await hastaLaHora(p, /^Corte clásico/, /^Leo/, 'mié 25 nov');
  }
  const hora = (await a.locator('.opcion-hora').first().textContent())!.trim();
  for (const p of [a, b]) {
    await p.locator('.opcion-hora', { hasText: hora }).click();
    await p.getByLabel('Tu nombre').fill('Ana');
  }
  await a.getByRole('button', { name: 'Confirmar turno' }).click();
  await expect(a.getByRole('heading', { name: 'Turno confirmado' })).toBeVisible();
  await b.getByRole('button', { name: 'Confirmar turno' }).click();
  await expect(b.getByRole('alert')).toHaveText('Esa hora se acaba de ocupar. Estas siguen libres:');
  const alternativas = await b.locator('.opcion-hora').allTextContents();
  expect(alternativas.length).toBeGreaterThan(0);
  expect(alternativas).not.toContain(hora);
});

test('datos inválidos: el error se anuncia junto al campo y recibe el foco', async ({ page }) => {
  await abrir(page);
  await hastaLaHora(page, /^Corte clásico/, /^Leo/, 'mié 25 nov');
  await page.locator('.opcion-hora').first().click();
  await page.getByLabel('Tu nombre').fill('A');
  await page.getByRole('button', { name: 'Confirmar turno' }).click();
  const nombre = page.getByLabel('Tu nombre');
  await expect(nombre).toBeFocused();
  await expect(nombre).toHaveAttribute('aria-invalid', 'true');
  await expect(nombre).toHaveAccessibleDescription(/al menos 2 caracteres/);
  await sinViolaciones(page);
});

test('tope de 2 turnos y cancelar desde «Tus turnos»', async ({ page }) => {
  const turno = (codigo: string, fecha: string) => ({ codigo, servicioId: 'corte', barberoId: 'leo', fecha, inicio: 540, duracion: 30, nombre: 'Ana', nota: '' });
  await page.addInitScript((datos) => localStorage.setItem('navaja-del-puerto:turnos', datos), JSON.stringify({ v: 1, turnos: [turno('NP-AAAA', '2026-11-26'), turno('NP-BBBB', '2026-11-27')] }));
  await abrir(page);
  await expect(page.locator('.turno')).toHaveCount(2);
  await hastaLaHora(page, /^Corte clásico/, /^Leo/, 'mié 25 nov');
  await page.locator('.opcion-hora').first().click();
  await page.getByLabel('Tu nombre').fill('Ana');
  await page.getByRole('button', { name: 'Confirmar turno' }).click();
  const aviso = page.getByText('Ya tienes 2 turnos pendientes');
  await expect(aviso).toBeFocused();
  await page.getByRole('button', { name: 'Cancelar el turno NP-AAAA' }).click();
  await page.getByRole('button', { name: 'Sí, cancelar' }).click();
  await expect(page.locator('.turno')).toHaveCount(1);
  await expect(page.locator('[aria-live="polite"]')).toHaveText('Turno NP-AAAA cancelado.');
  await page.getByRole('button', { name: 'Confirmar turno' }).click();
  await expect(page.getByRole('heading', { name: 'Turno confirmado' })).toBeVisible();
});

test('elegir un servicio en «Lado A» lo deja elegido en la reserva', async ({ page }) => {
  await page.clock.setFixedTime(MARTES_8AM);
  await page.goto('/');
  await page.getByRole('link', { name: 'Reservar Afeitado con navaja' }).click();
  await expect(page.getByRole('heading', { name: 'Elige con quién' })).toBeVisible();
  await expect(page.locator('.ficha')).toContainText('Afeitado con navaja');
  // Solo Ramón hace el afeitado: Leo y Jesús no se ofrecen
  await expect(opcion(page, /^Ramón/)).toBeVisible();
  await expect(opcion(page, /^Leo/)).toHaveCount(0);
});

test('el comprobante descarga el archivo de calendario del turno', async ({ page }) => {
  // El contenido del .ics (horas en UTC, escapes, plegado) lo cubre tests/unit/ics.test.ts
  await abrir(page);
  await hastaLaHora(page, /^Corte clásico/, /^Leo/, 'mié 25 nov');
  await page.locator('.opcion-hora').first().click();
  await page.getByLabel('Tu nombre').fill('Ana');
  await page.getByRole('button', { name: 'Confirmar turno' }).click();
  const [descarga] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Añadir al calendario' }).click()]);
  expect(descarga.suggestedFilename()).toMatch(/^navaja-del-puerto-NP-[A-HJKMNP-Z2-9]{4}\.ics$/);
});
