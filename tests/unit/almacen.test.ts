// Los turnos se guardan solo en ese navegador (spec §5.3, plan §5): lo leído se valida,
// y si el almacenamiento falla o está corrupto la página sigue funcionando.
import { describe, expect, it } from 'vitest';
import { CLAVE, crearAlmacenLocal, crearAlmacenMemoria, type Reserva } from '../../src/lib/reservas/almacen';

function storageFalso(inicial: Record<string, string> = {}): Storage {
  const datos = new Map(Object.entries(inicial));
  return {
    get length() { return datos.size; },
    clear: () => datos.clear(),
    getItem: (k: string) => datos.get(k) ?? null,
    key: (i: number) => [...datos.keys()][i] ?? null,
    removeItem: (k: string) => void datos.delete(k),
    setItem: (k: string, v: string) => void datos.set(k, v),
  };
}

const reserva: Reserva = {
  codigo: 'NP-4F7K',
  servicioId: 'corte',
  barberoId: 'leo',
  fecha: '2026-11-25',
  inicio: 600,
  duracion: 30,
  nombre: 'Ana',
  nota: '',
};

describe('almacén local', () => {
  it('guarda y lee los turnos con versión', () => {
    const storage = storageFalso();
    const almacen = crearAlmacenLocal(storage);
    almacen.escribir([reserva]);
    expect(JSON.parse(storage.getItem(CLAVE)!)).toEqual({ v: 1, turnos: [reserva] });
    expect(crearAlmacenLocal(storage).leer()).toEqual([reserva]);
  });

  it('vacío, corrupto o de otra versión: devuelve una lista vacía sin romperse', () => {
    expect(crearAlmacenLocal(storageFalso()).leer()).toEqual([]);
    expect(crearAlmacenLocal(storageFalso({ [CLAVE]: '{no es json' })).leer()).toEqual([]);
    expect(crearAlmacenLocal(storageFalso({ [CLAVE]: JSON.stringify({ v: 99, turnos: [reserva] }) })).leer()).toEqual([]);
  });

  it('descarta los registros inválidos y conserva los buenos', () => {
    const malos = [
      { ...reserva, codigo: 'NP-0000' },
      { ...reserva, servicioId: 'tinte' },
      { ...reserva, barberoId: 'cualquiera' },
      { ...reserva, fecha: '25/11/2026' },
      { ...reserva, inicio: 601 },
      { ...reserva, duracion: 45 },
      { ...reserva, nombre: '' },
      { ...reserva, nombre: '<script>' + 'x'.repeat(80) },
      'texto',
      null,
    ];
    const storage = storageFalso({ [CLAVE]: JSON.stringify({ v: 1, turnos: [...malos, reserva] }) });
    expect(crearAlmacenLocal(storage).leer()).toEqual([reserva]);
  });

  it('si el navegador bloquea el almacenamiento, trabaja en memoria', () => {
    const roto = {
      getItem: () => { throw new DOMException('bloqueado', 'SecurityError'); },
      setItem: () => { throw new DOMException('lleno', 'QuotaExceededError'); },
    } as unknown as Storage;
    const almacen = crearAlmacenLocal(roto);
    expect(almacen.leer()).toEqual([]);
    almacen.escribir([reserva]);
    expect(almacen.leer()).toEqual([reserva]);
  });

  it('sin localStorage (por ejemplo, en el servidor) también trabaja en memoria', () => {
    const almacen = crearAlmacenLocal(undefined);
    almacen.escribir([reserva]);
    expect(almacen.leer()).toEqual([reserva]);
  });
});

describe('almacén en memoria', () => {
  it('devuelve copias: modificar lo leído no cambia lo guardado', () => {
    const almacen = crearAlmacenMemoria();
    almacen.escribir([reserva]);
    almacen.leer()[0]!.nombre = 'Otro';
    expect(almacen.leer()[0]!.nombre).toBe('Ana');
  });
});
