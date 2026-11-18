// El flujo de la reserva (spec §5.1, plan §6): se puede volver a cualquier paso sin perder
// lo que sigue siendo compatible, y lo que deja de serlo se limpia.
import { describe, expect, it } from 'vitest';
import { ESTADO_INICIAL, reducir, type Accion, type Estado } from '../../src/lib/reservas/estado';
import type { Reserva } from '../../src/lib/reservas/almacen';

const aplicar = (acciones: Accion[], desde: Estado = ESTADO_INICIAL) => acciones.reduce(reducir, desde);

const completo = aplicar([
  { tipo: 'elegir-servicio', servicioId: 'corte' },
  { tipo: 'elegir-barbero', barberoId: 'leo' },
  { tipo: 'elegir-dia', fecha: '2026-11-25' },
  { tipo: 'elegir-hora', inicio: 600 },
]);

describe('avanzar', () => {
  it('empieza en el servicio y cada elección lleva al siguiente paso que falta', () => {
    expect(ESTADO_INICIAL.paso).toBe('servicio');
    const s = aplicar([{ tipo: 'elegir-servicio', servicioId: 'corte' }]);
    expect(s.paso).toBe('barbero');
    expect(aplicar([{ tipo: 'elegir-barbero', barberoId: 'cualquiera' }], s).paso).toBe('dia');
    expect(completo).toMatchObject({ paso: 'datos', servicioId: 'corte', barberoId: 'leo', fecha: '2026-11-25', inicio: 600 });
  });

  it('una preselección desde Servicios o Barberos salta a lo que falta', () => {
    expect(aplicar([{ tipo: 'preseleccionar', servicioId: 'afeitado' }]).paso).toBe('barbero');
    const s = aplicar([{ tipo: 'preseleccionar', barberoId: 'jesus' }]);
    expect(s).toMatchObject({ paso: 'servicio', barberoId: 'jesus' });
    // Con barbero ya elegido, elegir un servicio que hace salta directo al día
    expect(aplicar([{ tipo: 'elegir-servicio', servicioId: 'infantil' }], s).paso).toBe('dia');
  });

  it('ignora ids que no existen', () => {
    expect(aplicar([{ tipo: 'elegir-servicio', servicioId: 'tinte' }])).toEqual(ESTADO_INICIAL);
    expect(aplicar([{ tipo: 'preseleccionar', barberoId: 'pedro' }])).toEqual(ESTADO_INICIAL);
  });
});

describe('volver atrás', () => {
  it('editar un paso lo reabre sin borrar nada', () => {
    const s = reducir(completo, { tipo: 'editar', paso: 'barbero' });
    expect(s).toMatchObject({ paso: 'barbero', barberoId: 'leo', fecha: '2026-11-25', inicio: 600 });
  });

  it('no se puede abrir un paso cuyo anterior falta', () => {
    expect(reducir(ESTADO_INICIAL, { tipo: 'editar', paso: 'hora' }).paso).toBe('servicio');
  });

  it('cambiar el servicio conserva al barbero si lo hace, y siempre limpia la hora', () => {
    const s = reducir(completo, { tipo: 'elegir-servicio', servicioId: 'barba' });
    expect(s).toMatchObject({ servicioId: 'barba', barberoId: 'leo', fecha: '2026-11-25', inicio: null, paso: 'hora' });
  });

  it('cambiar a un servicio que el barbero no hace lo quita', () => {
    const s = reducir(completo, { tipo: 'elegir-servicio', servicioId: 'infantil' });
    expect(s).toMatchObject({ servicioId: 'infantil', barberoId: null, inicio: null, paso: 'barbero' });
  });

  it('cambiar a un barbero que no trabaja ese día quita el día', () => {
    // El martes 24 trabaja Leo pero no Jesús
    const martes = aplicar([{ tipo: 'elegir-dia', fecha: '2026-11-24' }, { tipo: 'elegir-hora', inicio: 600 }], completo);
    const s = reducir(martes, { tipo: 'elegir-barbero', barberoId: 'jesus' });
    expect(s).toMatchObject({ barberoId: 'jesus', fecha: null, inicio: null, paso: 'dia' });
  });

  it('cambiar el día limpia la hora', () => {
    expect(reducir(completo, { tipo: 'elegir-dia', fecha: '2026-11-26' })).toMatchObject({ inicio: null, paso: 'hora' });
  });
});

describe('horas', () => {
  it('pasa por cargando y listo, y limpia la lista al cambiar de día', () => {
    const cargando = reducir(completo, { tipo: 'huecos-cargando' });
    expect(cargando.huecos).toEqual({ estado: 'cargando', lista: [] });
    const listo = reducir(cargando, { tipo: 'huecos-listos', lista: [{ inicio: 600, barberoIds: ['leo'] }] });
    expect(listo.huecos.estado).toBe('listo');
    expect(reducir(listo, { tipo: 'elegir-dia', fecha: '2026-11-26' }).huecos).toEqual({ estado: 'inactivo', lista: [] });
  });

  it('un error al cargar se puede reintentar', () => {
    expect(reducir(completo, { tipo: 'huecos-error' }).huecos.estado).toBe('error');
  });
});

describe('datos y envío', () => {
  it('guarda lo que se escribe y limpia el error de ese campo', () => {
    const conError = reducir(completo, { tipo: 'envio-fallido', resultado: { ok: false, error: 'datos-invalidos', campos: { nombre: 'nombre-corto' } } });
    expect(conError.envio).toMatchObject({ estado: 'error', error: 'datos-invalidos', campos: { nombre: 'nombre-corto' } });
    const s = reducir(conError, { tipo: 'escribir', campo: 'nombre', valor: 'Ana' });
    expect(s.nombre).toBe('Ana');
    expect(s.envio.campos?.nombre).toBeUndefined();
  });

  it('hueco ocupado: vuelve a la hora con las alternativas', () => {
    const alternativas = [{ inicio: 630, barberoIds: ['leo' as const] }];
    const s = reducir(completo, { tipo: 'envio-fallido', resultado: { ok: false, error: 'hueco-ocupado', alternativas } });
    expect(s).toMatchObject({ paso: 'hora', inicio: null, envio: { estado: 'error', error: 'hueco-ocupado', alternativas } });
    // Elegir una alternativa vuelve a los datos y quita el aviso
    const t = reducir(s, { tipo: 'elegir-hora', inicio: 630 });
    expect(t).toMatchObject({ paso: 'datos', inicio: 630, envio: { estado: 'inactivo' } });
  });

  it('tope alcanzado: se queda en los datos con el aviso', () => {
    const s = reducir(completo, { tipo: 'envio-fallido', resultado: { ok: false, error: 'tope-alcanzado' } });
    expect(s).toMatchObject({ paso: 'datos', envio: { estado: 'error', error: 'tope-alcanzado' } });
  });

  it('un fallo inesperado al confirmar deja reintentar, sin culpar a los datos', () => {
    const s = aplicar([{ tipo: 'enviando' }, { tipo: 'envio-interrumpido' }], completo);
    expect(s).toMatchObject({ paso: 'datos', envio: { estado: 'error' } });
    expect(s.envio.error).toBeUndefined();
  });

  it('confirmado: guarda el turno y pasa al comprobante', () => {
    const reserva: Reserva = { codigo: 'NP-4F7K', servicioId: 'corte', barberoId: 'leo', fecha: '2026-11-25', inicio: 600, duracion: 30, nombre: 'Ana', nota: '' };
    const s = aplicar([{ tipo: 'enviando' }, { tipo: 'confirmado', reserva }], completo);
    expect(s).toMatchObject({ paso: 'confirmado', reserva, envio: { estado: 'inactivo' } });
  });

  it('reservar otro empieza de cero pero recuerda el nombre', () => {
    const s = aplicar([{ tipo: 'escribir', campo: 'nombre', valor: 'Ana' }, { tipo: 'escribir', campo: 'nota', valor: 'x' }, { tipo: 'reiniciar' }], completo);
    expect(s).toEqual({ ...ESTADO_INICIAL, nombre: 'Ana' });
  });
});
