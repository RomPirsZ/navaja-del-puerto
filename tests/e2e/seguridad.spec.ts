// Cabeceras de seguridad (plan §10): la CSP de public/_headers solo admite scripts y estilos
// del propio sitio y los bloques en línea que Astro necesita para hidratar la isla, por su
// hash. Si uno cambia (por ejemplo, al actualizar Astro) y el hash no, en producción la isla
// no se hidrataría: estos tests lo detectan antes de desplegar.
import { test, expect, type APIRequestContext } from '@playwright/test';

// Sin tipos de Node (plan §2): el archivo se pide al servidor de pruebas, que sirve public/
// tal cual, y el hash se calcula con Web Crypto
async function leerCsp(request: APIRequestContext): Promise<string> {
  const texto = await (await request.get('/_headers')).text();
  return texto.match(/Content-Security-Policy: (.*)/)?.[1] ?? '';
}
async function sha256(texto: string): Promise<string> {
  const resumen = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto));
  return btoa(String.fromCharCode(...new Uint8Array(resumen)));
}

test('cada script y estilo en línea tiene su hash en la CSP, y no hay atributos style', async ({ request }) => {
  const csp = await leerCsp(request);
  expect(csp).toContain("script-src 'self'");
  expect(csp).toContain("style-src 'self'");
  const html = await (await request.get('/')).text();
  for (const [, codigo = ''] of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) {
    if (!codigo.trim()) continue;
    expect(csp, 'hash de un script en línea').toContain(`'sha256-${await sha256(codigo)}'`);
  }
  for (const [, codigo = ''] of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) {
    expect(csp, 'hash de un estilo en línea').toContain(`'sha256-${await sha256(codigo)}'`);
  }
  // style-src no admite atributos style="" (React no debe pintarlos en el servidor)
  expect(html).not.toMatch(/\sstyle="/);
});

test.describe('con movimiento', () => {
  test.use({ reducedMotion: 'no-preference' });

test('con la CSP de producción, la isla se hidrata y el movimiento corre sin violaciones', async ({ page, request }) => {
  const csp = await leerCsp(request);
  // astro preview no aplica public/_headers: se añade la CSP a la respuesta del HTML
  await page.route('**/*', async (ruta) => {
    const respuesta = await ruta.fetch();
    const esHtml = (respuesta.headers()['content-type'] ?? '').includes('text/html');
    await ruta.fulfill({ response: respuesta, headers: { ...respuesta.headers(), ...(esHtml ? { 'content-security-policy': csp } : {}) } });
  });
  await page.addInitScript(() => {
    (window as unknown as { violaciones: string[] }).violaciones = [];
    document.addEventListener('securitypolicyviolation', (e) =>
      (window as unknown as { violaciones: string[] }).violaciones.push(`${e.violatedDirective} ${e.blockedURI}`),
    );
  });
  await page.goto('/');
  const isla = page.locator('[data-reserva]');
  await isla.scrollIntoViewIfNeeded();
  await expect(isla).toHaveAttribute('data-lista', 'true');
  await expect(page.locator('html')).toHaveClass(/\bmotion-ready\b/);
  await page.locator('footer').scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => (window as unknown as { violaciones: string[] }).violaciones)).toEqual([]);
});
});
