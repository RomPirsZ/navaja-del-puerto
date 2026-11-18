// Datos mínimos de la reserva (spec §5.1): nombre de 2 a 60 caracteres y nota opcional de 140.
import { describe, expect, it } from 'vitest';
import { validarDatos } from '../../src/lib/reservas/validacion';

describe('validarDatos', () => {
  it('acepta un nombre normal y limpia los espacios de más', () => {
    expect(validarDatos({ nombre: '  José   Pérez ', nota: '' })).toEqual({ ok: true, nombre: 'José Pérez', nota: '' });
  });

  it('exige un nombre de 2 a 60 caracteres con al menos una letra', () => {
    expect(validarDatos({ nombre: 'A', nota: '' })).toEqual({ ok: false, errores: { nombre: 'nombre-corto' } });
    expect(validarDatos({ nombre: '   ', nota: '' })).toEqual({ ok: false, errores: { nombre: 'nombre-corto' } });
    expect(validarDatos({ nombre: 'x'.repeat(61), nota: '' })).toEqual({ ok: false, errores: { nombre: 'nombre-largo' } });
    expect(validarDatos({ nombre: '12345', nota: '' })).toEqual({ ok: false, errores: { nombre: 'nombre-sin-letras' } });
    expect(validarDatos({ nombre: 'x'.repeat(60), nota: '' }).ok).toBe(true);
  });

  it('cuenta caracteres, no unidades de código: los acentos y los emojis cuentan uno', () => {
    expect(validarDatos({ nombre: 'Ñó', nota: '' }).ok).toBe(true);
    expect(validarDatos({ nombre: `Ana ${'😀'.repeat(56)}`, nota: '' }).ok).toBe(true);
  });

  it('la nota es opcional y como mucho de 140 caracteres', () => {
    expect(validarDatos({ nombre: 'Ana', nota: 'Degradado bajo, por favor' })).toEqual({ ok: true, nombre: 'Ana', nota: 'Degradado bajo, por favor' });
    expect(validarDatos({ nombre: 'Ana', nota: 'n'.repeat(141) })).toEqual({ ok: false, errores: { nota: 'nota-larga' } });
  });

  it('quita caracteres de control y saltos de línea', () => {
    expect(validarDatos({ nombre: 'Ana\u0000\nMaría', nota: 'a\tb' })).toEqual({ ok: true, nombre: 'Ana María', nota: 'a b' });
  });

  it('informa de los dos campos a la vez', () => {
    expect(validarDatos({ nombre: '', nota: 'n'.repeat(200) })).toEqual({ ok: false, errores: { nombre: 'nombre-corto', nota: 'nota-larga' } });
  });

  it('no se rompe con valores que no son texto', () => {
    expect(validarDatos({ nombre: 42 as unknown as string, nota: null as unknown as string })).toEqual({ ok: false, errores: { nombre: 'nombre-corto' } });
  });
});
