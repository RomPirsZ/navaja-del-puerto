// Reglas de la spec §5.2: solo se ofrecen huecos de verdad libres.
import { describe, expect, it } from 'vitest';
import { celda, huecosLibres, proximoDiaConHueco, type Ahora } from '../../src/lib/reservas/disponibilidad';

// Martes 17 de noviembre de 2026, 8:00 en Puerto Cabello
const ahora: Ahora = { fecha: '2026-11-17', minutos: 480 };
const nada = new Set<string>();
const inicios = (h: { inicio: number }[]) => h.map((x) => x.inicio);
const horas = (desde: number, hasta: number) => Array.from({ length: (hasta - desde) / 30 + 1 }, (_, i) => desde + i * 30);

describe('huecosLibres', () => {
  it('un corte con Ramón un martes libre: de 9:00 a 11:30 y de 13:00 a 18:30', () => {
    const h = huecosLibres({ fecha: '2026-11-24', servicioId: 'corte', barberoId: 'ramon', ocupados: nada, ahora });
    expect(inicios(h)).toEqual([...horas(540, 690), ...horas(780, 1110)]);
    expect(h.every((x) => x.barberoIds.join() === 'ramon')).toBe(true);
  });

  it('un servicio de 60 minutos no cruza el almuerzo ni el cierre', () => {
    const h = huecosLibres({ fecha: '2026-11-24', servicioId: 'corte-barba', barberoId: 'ramon', ocupados: nada, ahora });
    expect(inicios(h)).toEqual([...horas(540, 660), ...horas(780, 1080)]);
  });

  it('una celda ocupada quita su hueco y, en 60 minutos, también el anterior', () => {
    const ocupados = new Set([celda('ramon', '2026-11-24', 600)]);
    const corte = huecosLibres({ fecha: '2026-11-24', servicioId: 'corte', barberoId: 'ramon', ocupados, ahora });
    expect(inicios(corte)).not.toContain(600);
    expect(inicios(corte)).toContain(570);
    const largo = huecosLibres({ fecha: '2026-11-24', servicioId: 'corte-barba', barberoId: 'ramon', ocupados, ahora });
    expect(inicios(largo)).not.toContain(570);
    expect(inicios(largo)).not.toContain(600);
    expect(inicios(largo)).toContain(540);
  });

  it('hoy solo ofrece huecos que empiezan dentro de 30 minutos o más', () => {
    const hoy: Ahora = { fecha: '2026-11-24', minutos: 610 };
    const h = huecosLibres({ fecha: '2026-11-24', servicioId: 'corte', barberoId: 'ramon', ocupados: nada, ahora: hoy });
    expect(inicios(h)[0]).toBe(660);
  });

  it('el lunes está cerrado', () => {
    expect(huecosLibres({ fecha: '2026-11-23', servicioId: 'corte', barberoId: 'cualquiera', ocupados: nada, ahora })).toEqual([]);
  });

  it('el domingo abre de 9:00 a 13:00', () => {
    const h = huecosLibres({ fecha: '2026-11-22', servicioId: 'corte', barberoId: 'leo', ocupados: nada, ahora });
    expect(inicios(h)).toEqual(horas(540, 750));
  });

  it('fuera de la ventana de 14 días o en el pasado no hay huecos', () => {
    // Hoy miércoles 18: el día 13 de la ventana es el martes 1 de diciembre (abierto)
    const miercoles: Ahora = { fecha: '2026-11-18', minutos: 480 };
    const args = { servicioId: 'corte', barberoId: 'leo', ocupados: nada, ahora: miercoles } as const;
    expect(huecosLibres({ ...args, fecha: '2026-12-01' })).not.toEqual([]); // hoy + 13
    expect(huecosLibres({ ...args, fecha: '2026-12-02' })).toEqual([]); // hoy + 14
    expect(huecosLibres({ ...args, fecha: '2026-11-17' })).toEqual([]); // ayer, martes abierto
  });

  it('un barbero no ofrece lo que no hace ni trabaja los días que no le tocan', () => {
    const base = { fecha: '2026-11-25', ocupados: nada, ahora } as const;
    expect(huecosLibres({ ...base, servicioId: 'afeitado', barberoId: 'jesus' })).toEqual([]);
    expect(huecosLibres({ ...base, servicioId: 'infantil', barberoId: 'leo' })).toEqual([]);
    expect(huecosLibres({ ...base, fecha: '2026-11-22', servicioId: 'corte', barberoId: 'ramon' })).toEqual([]);
    expect(huecosLibres({ ...base, fecha: '2026-11-24', servicioId: 'corte', barberoId: 'jesus' })).toEqual([]);
  });

  it('«el primero libre» une los huecos y dice qué barberos quedan libres en cada uno', () => {
    const ocupados = new Set([celda('ramon', '2026-11-24', 540), celda('leo', '2026-11-24', 540), celda('leo', '2026-11-24', 570)]);
    const h = huecosLibres({ fecha: '2026-11-24', servicioId: 'corte', barberoId: 'cualquiera', ocupados, ahora });
    expect(inicios(h)).not.toContain(540);
    expect(h.find((x) => x.inicio === 570)?.barberoIds).toEqual(['ramon']);
    expect(h.find((x) => x.inicio === 600)?.barberoIds).toEqual(['ramon', 'leo']);
  });

  it('«el primero libre» para un servicio que nadie hace ese día no ofrece nada', () => {
    expect(huecosLibres({ fecha: '2026-11-24', servicioId: 'infantil', barberoId: 'cualquiera', ocupados: nada, ahora })).toEqual([]);
  });

  it('rechaza servicios o barberos que no existen', () => {
    expect(huecosLibres({ fecha: '2026-11-24', servicioId: 'tinte', barberoId: 'ramon', ocupados: nada, ahora })).toEqual([]);
    expect(huecosLibres({ fecha: '2026-11-24', servicioId: 'corte', barberoId: 'pedro', ocupados: nada, ahora })).toEqual([]);
  });
});

describe('proximoDiaConHueco', () => {
  it('salta los días sin hueco y devuelve el siguiente que tenga', () => {
    // Infantil solo lo hace Jesús (miércoles a domingo): desde el martes, el siguiente es el miércoles
    const dia = proximoDiaConHueco({ desde: '2026-11-24', servicioId: 'infantil', barberoId: 'cualquiera', ocupadosDe: () => nada, ahora });
    expect(dia).toBe('2026-11-25');
  });

  it('devuelve null si no queda ninguno dentro de la ventana', () => {
    const todo = { has: () => true } as unknown as Set<string>;
    expect(proximoDiaConHueco({ desde: '2026-11-17', servicioId: 'corte', barberoId: 'leo', ocupadosDe: () => todo, ahora })).toBeNull();
  });
});
