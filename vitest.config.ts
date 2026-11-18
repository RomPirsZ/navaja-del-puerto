/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
    passWithNoTests: true,
    // tokens.test.ts reads global.css with ?raw: without this Vitest hands over empty CSS
    css: { include: [/global\.css/] },
  },
});
