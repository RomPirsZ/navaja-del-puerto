// La hora que cuenta es la de Puerto Cabello (spec §5.2), esté donde esté el visitante.
import { describe, expect, it } from 'vitest';
import {
  ahoraEnPuerto,
  aInstanteUtc,
  diaSemana,
  formatearFecha,
  formatearHora,
  proximosDias,
  sumarDias,
} from '../../src/lib/reservas/tiempo';

describe('ahoraEnPuerto', () => {
  it('convierte un instante a la fecha, los minutos y el día de Puerto Cabello', () => {
    expect(ahoraEnPuerto(new Date('2026-11-18T13:30:00Z'))).toEqual({ fecha: '2026-11-18', minutos: 570, diaSemana: 3 });
  });

  it('pasada la medianoche UTC, en Puerto Cabello sigue siendo el día anterior', () => {
    expect(ahoraEnPuerto(new Date('2026-11-19T02:00:00Z'))).toEqual({ fecha: '2026-11-18', minutos: 1320, diaSemana: 3 });
  });
});

describe('fechas de calendario', () => {
  it('suma días cruzando meses y años', () => {
    expect(sumarDias('2026-11-30', 1)).toBe('2026-12-01');
    expect(sumarDias('2026-12-31', 1)).toBe('2027-01-01');
    expect(sumarDias('2026-12-01', -1)).toBe('2026-11-30');
  });

  it('sabe qué día de la semana es (0 = domingo)', () => {
    expect(diaSemana('2026-11-23')).toBe(1);
    expect(diaSemana('2026-11-29')).toBe(0);
  });

  it('lista los próximos 14 días empezando hoy', () => {
    const dias = proximosDias('2026-11-18', 14);
    expect(dias).toHaveLength(14);
    expect(dias[0]).toBe('2026-11-18');
    expect(dias[13]).toBe('2026-12-01');
  });

  it('pasa una hora de Puerto Cabello a su instante UTC (UTC-4)', () => {
    expect(aInstanteUtc('2026-11-18', 570).toISOString()).toBe('2026-11-18T13:30:00.000Z');
    expect(aInstanteUtc('2026-11-18', 1320).toISOString()).toBe('2026-11-19T02:00:00.000Z');
  });
});

describe('formato en español', () => {
  it('escribe la hora en formato de 12 horas', () => {
    expect(formatearHora(540)).toMatch(/^9:00\s?a\.\s?m\.$/);
    expect(formatearHora(1110)).toMatch(/^6:30\s?p\.\s?m\.$/);
  });

  it('escribe la fecha con el día de la semana', () => {
    const texto = formatearFecha('2026-11-25');
    expect(texto).toContain('miércoles');
    expect(texto).toContain('25 de noviembre');
  });
});
