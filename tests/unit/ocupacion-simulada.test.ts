// La agenda simulada parece viva y siempre da lo mismo para el mismo día (spec §5.2, plan §5).
import { describe, expect, it } from 'vitest';
import { ocupacionSimulada } from '../../src/lib/reservas/ocupacion-simulada';
import { proximosDias } from '../../src/lib/reservas/tiempo';

describe('ocupacionSimulada', () => {
  it('es determinista: la misma fecha y el mismo barbero dan la misma agenda', () => {
    expect(ocupacionSimulada('2026-11-24', 'ramon')).toEqual(ocupacionSimulada('2026-11-24', 'ramon'));
  });

  it('cambia de un día a otro y de un barbero a otro', () => {
    const base = ocupacionSimulada('2026-11-24', 'ramon');
    const otros = ['2026-11-25', '2026-11-26', '2026-11-27', '2026-11-28'].map((f) => ocupacionSimulada(f, 'ramon'));
    expect(otros.some((o) => o.join() !== base.join())).toBe(true);
    expect(ocupacionSimulada('2026-11-24', 'leo').join()).not.toBe(base.join());
  });

  it('solo ocupa celdas de 30 minutos dentro del horario del barbero', () => {
    for (const inicio of ocupacionSimulada('2026-11-24', 'ramon')) {
      expect(inicio % 30).toBe(0);
      expect((inicio >= 540 && inicio < 720) || (inicio >= 780 && inicio < 1140)).toBe(true);
    }
    expect(ocupacionSimulada('2026-11-23', 'ramon')).toEqual([]); // lunes
    expect(ocupacionSimulada('2026-11-24', 'jesus')).toEqual([]); // no trabaja los martes
  });

  it('ocupa entre un cuarto y algo más de la mitad de la agenda, nunca todo un día', () => {
    let ocupadas = 0;
    let total = 0;
    for (const fecha of proximosDias('2026-11-24', 60)) {
      const celdas = ocupacionSimulada(fecha, 'leo');
      const dia = new Date(`${fecha}T12:00:00Z`).getUTCDay();
      const posibles = dia === 1 ? 0 : dia === 0 ? 8 : 18;
      ocupadas += celdas.length;
      total += posibles;
      if (posibles > 0) expect(celdas.length, fecha).toBeLessThan(posibles);
    }
    expect(ocupadas / total).toBeGreaterThan(0.25);
    expect(ocupadas / total).toBeLessThan(0.55);
  });
});
