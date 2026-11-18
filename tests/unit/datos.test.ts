// Los datos ficticios de la spec §6 y el horario de la §5.2, coherentes entre sí.
import { describe, expect, it } from 'vitest';
import es from '../../src/i18n/es.json';
import { BARBEROS } from '../../src/data/barberos';
import { HORARIO } from '../../src/data/horario';
import { SERVICIOS } from '../../src/data/servicios';

const claves = Object.keys(es);

describe('servicios', () => {
  it('son los cinco de la spec, con su duración y su precio', () => {
    expect(SERVICIOS.map((s) => [s.id, s.duracion, s.precio])).toEqual([
      ['corte', 30, 8],
      ['corte-barba', 60, 12],
      ['barba', 30, 6],
      ['afeitado', 30, 7],
      ['infantil', 30, 6],
    ]);
  });

  it('cada uno dura un múltiplo de 30 minutos y lo hace al menos un barbero', () => {
    for (const s of SERVICIOS) {
      expect(s.duracion % 30, s.id).toBe(0);
      expect(BARBEROS.some((b) => b.servicios.includes(s.id)), s.id).toBe(true);
    }
  });

  it('cada uno tiene nombre y descripción en es.json', () => {
    for (const s of SERVICIOS) {
      expect(claves).toContain(`servicio.${s.id}.nombre`);
      expect(claves).toContain(`servicio.${s.id}.descripcion`);
    }
  });
});

describe('barberos', () => {
  it('son Ramón, Leo y Jesús con sus días y servicios de la spec', () => {
    expect(BARBEROS.map((b) => [b.id, b.dias, b.servicios])).toEqual([
      ['ramon', [2, 3, 4, 5, 6], ['corte', 'corte-barba', 'barba', 'afeitado']],
      ['leo', [0, 2, 3, 4, 5, 6], ['corte', 'corte-barba', 'barba']],
      ['jesus', [0, 3, 4, 5, 6], ['corte', 'barba', 'infantil']],
    ]);
  });

  it('solo trabajan los días que la barbería abre', () => {
    for (const b of BARBEROS) for (const d of b.dias) expect(HORARIO[d]?.length, `${b.id} ${d}`).toBeGreaterThan(0);
  });

  it('cada uno tiene nombre y especialidad en es.json', () => {
    for (const b of BARBEROS) {
      expect(claves).toContain(`barbero.${b.id}.nombre`);
      expect(claves).toContain(`barbero.${b.id}.especialidad`);
    }
  });
});

describe('horario', () => {
  it('lunes cerrado; de martes a sábado con almuerzo; domingo hasta la 1', () => {
    expect(HORARIO[1]).toEqual([]);
    for (const d of [2, 3, 4, 5, 6]) expect(HORARIO[d]).toEqual([{ desde: 540, hasta: 720 }, { desde: 780, hasta: 1140 }]);
    expect(HORARIO[0]).toEqual([{ desde: 540, hasta: 780 }]);
  });

  it('los tramos empiezan y acaban en huecos de 30 minutos', () => {
    for (const tramos of Object.values(HORARIO)) {
      for (const { desde, hasta } of tramos) {
        expect(desde % 30).toBe(0);
        expect(hasta % 30).toBe(0);
        expect(hasta).toBeGreaterThan(desde);
      }
    }
  });
});
