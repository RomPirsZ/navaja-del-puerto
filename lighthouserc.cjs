// Lighthouse CI (constitución IV, R10): móvil, sobre el build servido por `astro preview`,
// mediana de 5 pasadas (el TBT varía mucho entre pasadas). Usa el Chromium de Playwright, o
// el del sistema con CHROMIUM_PATH=/usr/bin/chromium (como los e2e en esta máquina).
const { chromium } = require('playwright');

const PORT = 4369;

module.exports = {
  ci: {
    collect: {
      startServerCommand: `npx astro preview --ignore-lock --port ${PORT}`,
      startServerReadyPattern: String(PORT),
      url: [`http://localhost:${PORT}/`],
      numberOfRuns: 5,
      chromePath: process.env.CHROMIUM_PATH || chromium.executablePath(),
      // Sin preset: Lighthouse emula por defecto un móvil de gama media con red 4G lenta
      settings: { chromeFlags: '--headless=new --no-sandbox' },
    },
    assert: {
      aggregationMethod: 'median-run',
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
      },
    },
    // Informes solo en disco (y como artefacto en la CI): nada se publica fuera
    upload: { target: 'filesystem', outputDir: '.lighthouseci/reports' },
  },
};
