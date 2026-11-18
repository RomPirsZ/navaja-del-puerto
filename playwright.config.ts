import { defineConfig, devices } from '@playwright/test';

// Sin @types/node en el proyecto (plan §2): basta con declarar lo que se lee del entorno
declare const process: { env: Record<string, string | undefined> };

// Puerto propio, distinto del de `astro dev` (4321) y de los e2e del portafolio (4329),
// Molienda (4339) y la tienda (4349): con reuseExistingServer, compartir puerto haría
// probar el sitio equivocado.
const PORT = 4359;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
    // Sin los navegadores de Playwright descargados, se puede usar el Chromium del sistema:
    // CHROMIUM_PATH=/usr/bin/chromium npm test
    launchOptions: process.env['CHROMIUM_PATH'] ? { executablePath: process.env['CHROMIUM_PATH'] } : {},
  },
  projects: [
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
  ],
  // Se prueba el build real, no el servidor de desarrollo
  webServer: {
    command: `npm run build && npx astro preview --ignore-lock --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
