// Estado en vivo del horario (spec §4.7): con la hora de Puerto Cabello, dice si está abierto
// y hasta cuándo, o cuándo abre. Y los días de cada barbero, en palabras.
import { describe, expect, it } from 'vitest';
import { describirDias, estadoApertura, horaHumana, textoApertura } from '../../src/lib/apertura';
import { ahoraEnPuerto } from '../../src/lib/reservas/tiempo';

// Instantes UTC: Puerto Cabello va 4 horas por detrás
const en = (iso: string) => ahoraEnPuerto(new Date(iso));

describe('estadoApertura', () => {
  it('martes a las 10:00: abierto hasta el almuerzo', () => {
    expect(estadoApertura(en('2026-11-24T14:00:00Z'))).toEqual({ abierto: true, hasta: 720 });
  });

  it('martes a las 12:30: cerrado por almuerzo, abre hoy a la 1', () => {
    expect(estadoApertura(en('2026-11-24T16:30:00Z'))).toEqual({ abierto: false, abre: { fecha: '2026-11-24', minutos: 780, enDias: 0 } });
  });

  it('martes a las 19:00 en punto ya está cerrado: abre mañana a las 9', () => {
    expect(estadoApertura(en('2026-11-24T23:00:00Z'))).toEqual({ abierto: false, abre: { fecha: '2026-11-25', minutos: 540, enDias: 1 } });
  });

  it('domingo a las 14:00: cerrado, el lunes también, abre el martes', () => {
    expect(estadoApertura(en('2026-11-22T18:00:00Z'))).toEqual({ abierto: false, abre: { fecha: '2026-11-24', minutos: 540, enDias: 2 } });
  });
});

describe('textos', () => {
  it('escribe las horas como se dicen: «la 1», «las 7», «las 12:30»', () => {
    expect(horaHumana(780)).toBe('la 1');
    expect(horaHumana(1140)).toBe('las 7');
    expect(horaHumana(720)).toBe('las 12');
    expect(horaHumana(750)).toBe('las 12:30');
    expect(horaHumana(540)).toBe('las 9');
  });

  it('abierto, cerrado hoy, mañana y otro día', () => {
    expect(textoApertura(estadoApertura(en('2026-11-24T14:00:00Z')))).toBe('Abierto hasta las 12');
    expect(textoApertura(estadoApertura(en('2026-11-22T14:00:00Z')))).toBe('Abierto hasta la 1');
    expect(textoApertura(estadoApertura(en('2026-11-24T16:30:00Z')))).toBe('Cerrado. Abre hoy a la 1');
    expect(textoApertura(estadoApertura(en('2026-11-24T23:00:00Z')))).toBe('Cerrado. Abre mañana a las 9');
    expect(textoApertura(estadoApertura(en('2026-11-22T18:00:00Z')))).toBe('Cerrado. Abre el martes a las 9');
  });
});

describe('describirDias', () => {
  it('une los días seguidos, con la semana empezando en lunes', () => {
    expect(describirDias([2, 3, 4, 5, 6])).toBe('De martes a sábado');
    expect(describirDias([0, 2, 3, 4, 5, 6])).toBe('De martes a domingo');
    expect(describirDias([0, 3, 4, 5, 6])).toBe('De miércoles a domingo');
  });

  it('un día suelto o días sueltos', () => {
    expect(describirDias([2])).toBe('Los martes');
    expect(describirDias([1, 3, 5])).toBe('Lunes, miércoles y viernes');
  });
});
