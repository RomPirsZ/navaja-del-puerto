// Constitución VII: versiones fijadas. Un rango (^, ~, *) dejaría entrar versiones nuevas
// sin pasar por la regla de los 7 días ni por la revisión.
import { describe, expect, it } from 'vitest';
import paquete from '../../package.json';

const todas = { ...paquete.dependencies, ...paquete.devDependencies, ...paquete.overrides };

describe('dependencias', () => {
  it('todas las versiones están fijadas, sin rangos', () => {
    for (const [nombre, version] of Object.entries(todas)) {
      expect(version, nombre).toMatch(/^\d+\.\d+\.\d+$/);
    }
  });

  it('solo las del plan §2: sin backend, sin GSAP ni librerías de fechas o formularios', () => {
    const prohibidas = ['@supabase/supabase-js', 'gsap', 'lenis', 'date-fns', 'dayjs', 'react-hook-form', '@testing-library/react'];
    for (const nombre of prohibidas) expect(Object.keys(todas), nombre).not.toContain(nombre);
  });
});
