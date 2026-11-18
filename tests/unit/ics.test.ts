// Archivo de calendario (spec §5.1, plan §6): abre en cualquier calendario con la hora real.
import { describe, expect, it } from 'vitest';
import { generarIcs } from '../../src/lib/reservas/ics';

const base = {
  codigo: 'NP-4F7K',
  titulo: 'Corte y barba en Navaja del Puerto',
  descripcion: 'Con Leo. Demo: esta barbería no existe; nada se envió.',
  lugar: 'Zona colonial, Puerto Cabello',
  fecha: '2026-11-25',
  inicio: 600,
  duracion: 60,
  creado: new Date('2026-11-18T15:04:05Z'),
};

describe('generarIcs', () => {
  const ics = generarIcs(base);
  const lineas = ics.split('\r\n');

  it('es un VCALENDAR con un VEVENT y líneas separadas por CRLF', () => {
    expect(lineas[0]).toBe('BEGIN:VCALENDAR');
    expect(lineas).toContain('VERSION:2.0');
    expect(lineas).toContain('BEGIN:VEVENT');
    expect(lineas).toContain('END:VEVENT');
    expect(lineas.at(-2)).toBe('END:VCALENDAR');
    expect(ics.endsWith('\r\n')).toBe(true);
    expect(ics.replace(/\r\n/g, '')).not.toMatch(/\n/);
  });

  it('pone el inicio y el fin en UTC: las 10:00 de Puerto Cabello son las 14:00 UTC', () => {
    expect(lineas).toContain('DTSTART:20261125T140000Z');
    expect(lineas).toContain('DTEND:20261125T150000Z');
    expect(lineas).toContain('DTSTAMP:20261118T150405Z');
  });

  it('usa el código como identificador único', () => {
    expect(lineas).toContain('UID:NP-4F7K@navaja-del-puerto.demo');
  });

  it('escapa comas, punto y coma y barras en los textos', () => {
    const otro = generarIcs({ ...base, lugar: 'Calle 1; casa 2, \\ esquina' });
    expect(otro).toContain('LOCATION:Calle 1\; casa 2\\, \\\\ esquina');
  });

  it('pliega las líneas de más de 75 octetos', () => {
    const largo = generarIcs({ ...base, descripcion: 'ñ'.repeat(120) });
    for (const linea of largo.split('\r\n')) expect(new TextEncoder().encode(linea).length).toBeLessThanOrEqual(75);
    // Desplegado (RFC 5545: CRLF + espacio), el texto vuelve entero
    expect(largo.replace(/\r\n /g, '')).toContain(`DESCRIPTION:${'ñ'.repeat(120)}`);
  });
});
