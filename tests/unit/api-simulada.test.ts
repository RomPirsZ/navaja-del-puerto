// La API simulada hace de servidor (plan §5): valida todo otra vez, decide los conflictos y
// guarda el turno. Reloj, almacén y latencia van inyectados.
import { describe, expect, it } from 'vitest';
import { crearAlmacenMemoria, type Reserva } from '../../src/lib/reservas/almacen';
import { crearApi } from '../../src/lib/reservas/api-simulada';
import { ocupacionSimulada } from '../../src/lib/reservas/ocupacion-simulada';

// Martes 17 de noviembre de 2026, 8:00 en Puerto Cabello (12:00 UTC)
const reloj = () => new Date('2026-11-17T12:00:00Z');

function api(almacen = crearAlmacenMemoria()) {
  return { almacen, api: crearApi({ almacen, reloj, latencia: () => 0 }) };
}

// Una hora libre de verdad para Leo el miércoles 25, según la ocupación simulada
const libreLeo = [540, 570, 600, 630, 660, 690].find((m) => !ocupacionSimulada('2026-11-25', 'leo').includes(m))!;
const ocupadaLeo = ocupacionSimulada('2026-11-25', 'leo')[0]!;

const entrada = { servicioId: 'corte' as const, barberoId: 'leo' as const, fecha: '2026-11-25', inicio: libreLeo, nombre: 'Ana', nota: '' };

describe('obtenerDisponibilidad', () => {
  it('quita las horas de la ocupación simulada', async () => {
    const huecos = await api().api.obtenerDisponibilidad({ fecha: '2026-11-25', servicioId: 'corte', barberoId: 'leo' });
    const inicios = huecos.map((h) => h.inicio);
    expect(inicios).toContain(libreLeo);
    expect(inicios).not.toContain(ocupadaLeo);
  });

  it('quita también las horas de los turnos ya reservados en ese navegador', async () => {
    const { api: a } = api();
    await a.crearReserva(entrada);
    const huecos = await a.obtenerDisponibilidad({ fecha: '2026-11-25', servicioId: 'corte', barberoId: 'leo' });
    expect(huecos.map((h) => h.inicio)).not.toContain(libreLeo);
  });
});

describe('crearReserva', () => {
  it('confirma un hueco libre, con código, y lo guarda', async () => {
    const { api: a, almacen } = api();
    const r = await a.crearReserva({ ...entrada, nombre: '  Ana  ' });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.reserva).toMatchObject({ servicioId: 'corte', barberoId: 'leo', fecha: '2026-11-25', inicio: libreLeo, duracion: 30, nombre: 'Ana' });
    expect(r.reserva.codigo).toMatch(/^NP-[A-HJKMNP-Z2-9]{4}$/);
    expect(almacen.leer()).toEqual([r.reserva]);
  });

  it('rechaza datos inválidos con el error de cada campo', async () => {
    const r = await api().api.crearReserva({ ...entrada, nombre: 'A' });
    expect(r).toEqual({ ok: false, error: 'datos-invalidos', campos: { nombre: 'nombre-corto' } });
    const s = await api().api.crearReserva({ ...entrada, servicioId: 'tinte' });
    expect(s).toMatchObject({ ok: false, error: 'datos-invalidos' });
  });

  it('rechaza horas fuera del horario: lunes, almuerzo, cierre, pasado o lejos', async () => {
    const { api: a } = api();
    for (const cambio of [
      { fecha: '2026-11-23' },
      { inicio: 720 },
      { inicio: 1140 },
      { fecha: '2026-11-16' },
      { fecha: '2026-12-15' },
      { inicio: 615 },
      { servicioId: 'infantil' },
    ]) {
      expect(await a.crearReserva({ ...entrada, ...cambio }), JSON.stringify(cambio)).toMatchObject({ ok: false });
    }
    expect(await a.crearReserva({ ...entrada, inicio: 720 })).toMatchObject({ ok: false, error: 'fuera-de-horario' });
  });

  it('si el hueco ya está ocupado, no confirma y ofrece las horas libres más cercanas', async () => {
    const r = await api().api.crearReserva({ ...entrada, inicio: ocupadaLeo });
    expect(r).toMatchObject({ ok: false, error: 'hueco-ocupado' });
    if (r.ok || r.error !== 'hueco-ocupado') return;
    expect(r.alternativas.length).toBeGreaterThan(0);
    expect(r.alternativas.length).toBeLessThanOrEqual(3);
    expect(r.alternativas.map((h) => h.inicio)).not.toContain(ocupadaLeo);
  });

  it('detecta el turno que otra pestaña reservó después de mostrar las horas', async () => {
    const compartido = crearAlmacenMemoria();
    const pestanaA = crearApi({ almacen: compartido, reloj, latencia: () => 0 });
    const pestanaB = crearApi({ almacen: compartido, reloj, latencia: () => 0 });
    expect((await pestanaB.obtenerDisponibilidad(entrada)).map((h) => h.inicio)).toContain(libreLeo);
    expect((await pestanaA.crearReserva(entrada)).ok).toBe(true);
    expect(await pestanaB.crearReserva({ ...entrada, nombre: 'Beto' })).toMatchObject({ ok: false, error: 'hueco-ocupado' });
  });

  it('como mucho 2 turnos pendientes por navegador', async () => {
    const { api: a } = api();
    const libres = (await a.obtenerDisponibilidad(entrada)).map((h) => h.inicio);
    expect((await a.crearReserva({ ...entrada, inicio: libres[0]! })).ok).toBe(true);
    expect((await a.crearReserva({ ...entrada, inicio: libres[1]! })).ok).toBe(true);
    expect(await a.crearReserva({ ...entrada, inicio: libres[2]! })).toEqual({ ok: false, error: 'tope-alcanzado' });
  });

  it('«el primero libre» asigna al barbero libre con menos turnos ese día', async () => {
    const { api: a } = api();
    const huecos = await a.obtenerDisponibilidad({ fecha: '2026-11-25', servicioId: 'corte', barberoId: 'cualquiera' });
    const conVarios = huecos.find((h) => h.barberoIds.length > 1)!;
    const r = await a.crearReserva({ ...entrada, barberoId: 'cualquiera', inicio: conVarios.inicio });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const carga = (id: string) => ocupacionSimulada('2026-11-25', id).length;
    const elegido = [...conVarios.barberoIds].sort((x, y) => carga(x) - carga(y))[0];
    expect(r.reserva.barberoId).toBe(elegido);
  });

  it('nunca repite un código ya guardado', async () => {
    const almacen = crearAlmacenMemoria();
    let n = 0;
    // El azar da primero el código de un turno existente y luego otro distinto
    const secuencia = [0, 0, 0, 0, 0.5, 0.5, 0.5, 0.5];
    const a = crearApi({ almacen, reloj, latencia: () => 0, azar: () => secuencia[n++ % secuencia.length]! });
    const existente: Reserva = { ...entrada, codigo: 'NP-AAAA', inicio: libreLeo, duracion: 30, barberoId: 'leo', fecha: '2026-11-26' };
    almacen.escribir([existente]);
    const libres = (await a.obtenerDisponibilidad(entrada)).map((h) => h.inicio);
    const r = await a.crearReserva({ ...entrada, inicio: libres[0]! });
    expect(r.ok && r.reserva.codigo).not.toBe('NP-AAAA');
  });
  it('si el azar nunca da un código libre, falla en vez de quedarse colgada', async () => {
    const almacen = crearAlmacenMemoria();
    const existente: Reserva = { ...entrada, codigo: 'NP-AAAA', inicio: libreLeo, duracion: 30, barberoId: 'leo', fecha: '2026-11-26' };
    almacen.escribir([existente]);
    const a = crearApi({ almacen, reloj, latencia: () => 0, azar: () => 0 });
    const libres = (await a.obtenerDisponibilidad(entrada)).map((h) => h.inicio);
    await expect(a.crearReserva({ ...entrada, inicio: libres[0]! })).rejects.toThrow();
  });
});

describe('misReservas y cancelarReserva', () => {
  it('lista los pendientes y borra los pasados', async () => {
    const almacen = crearAlmacenMemoria();
    const pasado: Reserva = { ...entrada, codigo: 'NP-PAST', fecha: '2026-11-14', duracion: 30, barberoId: 'leo' };
    almacen.escribir([pasado]);
    const { api: a } = api(almacen);
    const r = await a.crearReserva(entrada);
    expect(await a.misReservas()).toEqual(r.ok ? [r.reserva] : []);
    expect(almacen.leer().map((x) => x.codigo)).not.toContain('NP-PAST');
  });

  it('cancelar libera el hueco y borra los datos del turno', async () => {
    const { api: a, almacen } = api();
    const r = await a.crearReserva(entrada);
    if (!r.ok) throw new Error('no se creó');
    expect(await a.cancelarReserva(r.reserva.codigo)).toEqual({ ok: true });
    expect(almacen.leer()).toEqual([]);
    expect((await a.obtenerDisponibilidad(entrada)).map((h) => h.inicio)).toContain(libreLeo);
    expect(await a.cancelarReserva(r.reserva.codigo)).toEqual({ ok: false });
  });
});
