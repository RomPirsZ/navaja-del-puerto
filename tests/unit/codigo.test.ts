// Código del turno (spec §5.1): NP- y 4 caracteres sin ambigüedades (sin 0/O, 1/I/L).
import { describe, expect, it } from 'vitest';
import { esCodigo, generarCodigo } from '../../src/lib/reservas/codigo';

describe('código del turno', () => {
  it('tiene la forma NP-XXXX con el alfabeto sin ambigüedades', () => {
    for (let i = 0; i < 200; i++) expect(generarCodigo()).toMatch(/^NP-[A-HJKMNP-Z2-9]{4}$/);
  });

  it('con el mismo azar da el mismo código', () => {
    expect(generarCodigo(() => 0)).toBe('NP-AAAA');
    expect(generarCodigo(() => 0.9999)).toBe('NP-9999');
  });

  it('esCodigo reconoce los válidos y rechaza el resto', () => {
    expect(esCodigo('NP-4F7K')).toBe(true);
    expect(esCodigo('NP-0OIL')).toBe(false);
    expect(esCodigo('np-4f7k')).toBe(false);
    expect(esCodigo('NP-4F7K ')).toBe(false);
  });
});
