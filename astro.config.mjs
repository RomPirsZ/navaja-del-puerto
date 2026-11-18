// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Static output: no server, the booking API is simulated in the browser (plan §5)
  output: 'static',
  // React only for the booking island (plan §6)
  integrations: [react()],
  // Scripts and styles always as files, so the CSP only needs hashes for Astro's island loader
  build: { inlineStylesheets: 'never' },
  vite: {
    plugins: [tailwindcss()],
    build: { assetsInlineLimit: 0 },
  },
});
