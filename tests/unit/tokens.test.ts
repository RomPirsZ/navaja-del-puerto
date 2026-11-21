// Contraste de los tokens de color (constitución III, plan §8). Cada par que el sitio usa
// como texto sobre fondo tiene que llegar a AA (4,5:1). Paleta del usuario (2026-11-21):
// Charcoal Black #1C1C1C, Bone White #EDE6D8 y Barber Red #B3261E.
import { describe, expect, it } from 'vitest';
// ?raw (Vite): el CSS como texto, sin depender de los tipos de Node
import css from '../../src/styles/global.css?raw';

const root = css.match(/:root\s*\{([^}]*)\}/)?.[1] ?? '';
const t: Record<string, string> = Object.fromEntries(
  [...root.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2]!.toLowerCase()]),
);

// Todos los estilos del sitio (componentes y hojas), para comprobar cómo se usan los roles
const fuentes = import.meta.glob<string>('../../src/**/*.{astro,css}', {
  query: '?raw',
  import: 'default',
  eager: true,
});

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
  it('define los roles de la paleta carbón, hueso y rojo', () => {
    expect(Object.keys(t).sort()).toEqual(
      [
        'hueso-claro',
        'hueso',
        'hueso-oscuro',
        'carbon-suave',
        'carbon-alto',
        'carbon',
        'hueso-suave',
        'rojo',
        'rojo-claro',
      ].sort(),
    );
  });

  it('los tres colores del usuario son exactos', () => {
    expect(t['carbon']).toBe('#1c1c1c');
    expect(t['hueso']).toBe('#ede6d8');
    expect(t['rojo']).toBe('#b3261e');
  });

  it('la escala tonal va de hueso a carbón: cada paso es más oscuro que el anterior', () => {
    const escala = ['hueso-claro', 'hueso', 'hueso-oscuro', 'carbon-suave', 'carbon-alto', 'carbon'];
    const luces = escala.map((nombre) => luminance(t[nombre]!));
    for (let i = 1; i < luces.length; i++) expect(luces[i], escala[i]).toBeLessThan(luces[i - 1]!);
  });

  it.each([
    // Texto sobre el fondo hueso y sus pasos
    ['carbon', 'hueso'],
    ['carbon', 'hueso-claro'],
    ['carbon', 'hueso-oscuro'],
    ['carbon-suave', 'hueso'],
    ['carbon-suave', 'hueso-claro'],
    ['rojo', 'hueso'],
    // Texto sobre el rojo (la acción y los campos de color)
    ['hueso', 'rojo'],
    // Texto sobre las bandas carbón
    ['hueso', 'carbon'],
    ['hueso', 'carbon-alto'],
    ['hueso-suave', 'carbon'],
    ['hueso-suave', 'carbon-alto'],
    ['rojo-claro', 'carbon'],
    ['rojo-claro', 'carbon-alto'],
  ])('%s sobre %s cumple AA (4,5:1)', (texto, fondo) => {
    expect(contrast(t[texto]!, t[fondo]!)).toBeGreaterThanOrEqual(4.5);
  });

  it('el carbón sobre el rojo no llega a AA: por eso sobre el rojo se escribe en hueso', () => {
    expect(contrast(t['carbon']!, t['rojo']!)).toBeLessThan(4.5);
  });

  it('ningún bloque con fondo rojo pone el texto en carbón', () => {
    const malos: string[] = [];
    for (const [archivo, texto] of Object.entries(fuentes)) {
      for (const bloque of texto.match(/\{[^{}]*\}/g) ?? []) {
        const fondoRojo = /background(-color)?:\s*var\(--rojo\)/.test(bloque);
        const textoCarbon = /(^|[\s;{])color:\s*var\(--carbon(-suave)?\)/.test(bloque);
        if (fondoRojo && textoCarbon) malos.push(`${archivo}: ${bloque.replace(/\s+/g, ' ').slice(0, 120)}`);
      }
    }
    expect(malos).toEqual([]);
  });

  it('ningún componente usa los roles de la paleta anterior', () => {
    const viejos = /var\(--(funda|tinta|tinta-suave|papel|papel-suave|arena|arena-clara|arena-oscura|vinilo)\)/;
    const conViejos = Object.entries(fuentes)
      .filter(([, texto]) => viejos.test(texto))
      .map(([archivo]) => archivo);
    expect(conViejos).toEqual([]);
  });

  it('ningún color fuera de :root: los componentes usan los roles', () => {
    const fuera = css.replace(/:root\s*\{[^}]*\}/, '').match(/#[0-9a-f]{3,8}\b/gi) ?? [];
    expect(fuera).toEqual([]);
  });
});
