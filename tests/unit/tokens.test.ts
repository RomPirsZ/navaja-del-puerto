// Contraste de los tokens de color (constitución III, plan §8). Cada par que el sitio usa
// como texto sobre fondo tiene que llegar a AA (4,5:1).
import { describe, expect, it } from 'vitest';
// ?raw (Vite): el CSS como texto, sin depender de los tipos de Node
import css from '../../src/styles/global.css?raw';

const root = css.match(/:root\s*\{([^}]*)\}/)?.[1] ?? '';
const t: Record<string, string> = Object.fromEntries(
  [...root.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2]]),
);

function luminance(hex: string): number {
  const [r = 0, g = 0, b = 0] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

describe('tokens de color', () => {
  it('define los roles de la dirección «Lado A» (plan §8)', () => {
    expect(Object.keys(t).sort()).toEqual(
      ['arena', 'arena-clara', 'arena-oscura', 'funda', 'tinta', 'tinta-suave', 'vinilo', 'papel', 'papel-suave'].sort(),
    );
  });

  it('la escala tonal va de arena a negro: cada paso es más oscuro que el anterior', () => {
    const escala = ['papel', 'arena-clara', 'arena', 'arena-oscura', 'tinta-suave', 'vinilo', 'tinta'];
    const luces = escala.map((nombre) => luminance(t[nombre]!));
    for (let i = 1; i < luces.length; i++) expect(luces[i], escala[i]).toBeLessThan(luces[i - 1]!);
  });

  it.each([
    // Texto sobre el cartón arena y sus pasos
    ['tinta', 'arena'],
    ['tinta', 'arena-clara'],
    ['tinta', 'arena-oscura'],
    ['tinta-suave', 'arena'],
    ['tinta-suave', 'arena-clara'],
    // Texto sobre la funda naranja (la acción y los campos de color)
    ['tinta', 'funda'],
    // Texto sobre las bandas oscuras
    ['papel', 'tinta'],
    ['papel', 'vinilo'],
    ['papel-suave', 'tinta'],
    ['papel-suave', 'vinilo'],
    ['funda', 'tinta'],
    ['funda', 'vinilo'],
  ])('%s sobre %s cumple AA (4,5:1)', (texto, fondo) => {
    expect(contrast(t[texto]!, t[fondo]!)).toBeGreaterThanOrEqual(4.5);
  });

  it('ningún color fuera de :root: los componentes usan los roles', () => {
    const fuera = css.replace(/:root\s*\{[^}]*\}/, '').match(/#[0-9a-f]{3,8}\b/gi) ?? [];
    expect(fuera).toEqual([]);
  });
});
