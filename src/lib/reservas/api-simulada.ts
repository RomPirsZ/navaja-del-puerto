// The simulated booking API (plan §5). It has the shape of a real client, so swapping in a
// real backend only touches this module. It validates everything again (constitution V),
// re-reads storage before confirming (another tab may have booked) and adds fake latency.
import { BARBEROS, buscarBarbero, type BarberoId } from '../../data/barberos';
import { HUECO } from '../../data/horario';
import { buscarServicio } from '../../data/servicios';
import type { Almacen, Reserva } from './almacen';
import { generarCodigo } from './codigo';
import { celda, huecosLibres, type Ahora, type Hueco } from './disponibilidad';
import { ocupacionSimulada } from './ocupacion-simulada';
import { ahoraEnPuerto } from './tiempo';
import { validarDatos, type ErroresDatos } from './validacion';

export const TOPE_PENDIENTES = 2;
const ALTERNATIVAS = 3;

export interface ConsultaApi {
  fecha: string;
  servicioId: string;
  /** A barber id or 'cualquiera' («el primero libre») */
  barberoId: string;
}

export interface EntradaReserva extends ConsultaApi {
  inicio: number;
  nombre: unknown;
  nota: unknown;
}

export type ResultadoReserva =
  | { ok: true; reserva: Reserva }
  | { ok: false; error: 'datos-invalidos'; campos?: ErroresDatos }
  | { ok: false; error: 'fuera-de-horario' }
  | { ok: false; error: 'tope-alcanzado' }
  | { ok: false; error: 'hueco-ocupado'; alternativas: Hueco[] };

export type CodigoError = Extract<ResultadoReserva, { ok: false }>['error'];

export interface OpcionesApi {
  almacen: Almacen;
  reloj?: () => Date;
  /** Milliseconds of fake latency per call; 0 in the tests */
  latencia?: () => number;
  azar?: () => number;
}

export function crearApi({ almacen, reloj = () => new Date(), latencia = () => 250 + Math.random() * 350, azar }: OpcionesApi) {
  const esperar = () => new Promise<void>((listo) => setTimeout(listo, latencia()));

  const ahora = (): Ahora => {
    const { fecha, minutos } = ahoraEnPuerto(reloj());
    return { fecha, minutos };
  };

  const pendiente = (r: Reserva, a: Ahora) => r.fecha > a.fecha || (r.fecha === a.fecha && r.inicio + r.duracion > a.minutos);

  /** Stored bookings, dropping the ones already over (spec §5.3) */
  const vigentes = (a: Ahora): Reserva[] => {
    const todas = almacen.leer();
    const quedan = todas.filter((r) => pendiente(r, a));
    if (quedan.length !== todas.length) almacen.escribir(quedan);
    return quedan;
  };

  const ocupadosDe = (fecha: string, turnos: Reserva[]): Set<string> => {
    const ocupados = new Set<string>();
    for (const b of BARBEROS) for (const m of ocupacionSimulada(fecha, b.id)) ocupados.add(celda(b.id, fecha, m));
    for (const t of turnos) {
      if (t.fecha !== fecha) continue;
      for (let m = t.inicio; m < t.inicio + t.duracion; m += HUECO) ocupados.add(celda(t.barberoId, fecha, m));
    }
    return ocupados;
  };

  /** Taken cells of a barber that day: decides «el primero libre» */
  const carga = (barberoId: BarberoId, fecha: string, turnos: Reserva[]) =>
    ocupacionSimulada(fecha, barberoId).length +
    turnos.filter((t) => t.barberoId === barberoId && t.fecha === fecha).reduce((n, t) => n + t.duracion / HUECO, 0);

  /** 31⁴ codes and at most a couple of bookings: a clash is rare, but never loop forever */
  const codigoNuevo = (turnos: Reserva[]): string => {
    const usados = new Set(turnos.map((t) => t.codigo));
    for (let intento = 0; intento < 20; intento++) {
      const codigo = generarCodigo(azar);
      if (!usados.has(codigo)) return codigo;
    }
    throw new Error('No free booking code after 20 attempts');
  };

  return {
    async obtenerDisponibilidad({ fecha, servicioId, barberoId }: ConsultaApi): Promise<Hueco[]> {
      await esperar();
      const a = ahora();
      return huecosLibres({ fecha, servicioId, barberoId, ocupados: ocupadosDe(fecha, vigentes(a)), ahora: a });
    },

    async crearReserva(entrada: EntradaReserva): Promise<ResultadoReserva> {
      await esperar();
      const servicio = buscarServicio(entrada.servicioId);
      const barberoValido = entrada.barberoId === 'cualquiera' || buscarBarbero(entrada.barberoId) !== undefined;
      const fechaValida = typeof entrada.fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(entrada.fecha);
      const inicioValido = Number.isInteger(entrada.inicio) && entrada.inicio % HUECO === 0;
      if (!servicio || !barberoValido || !fechaValida || !inicioValido) return { ok: false, error: 'datos-invalidos' };

      const datos = validarDatos({ nombre: entrada.nombre, nota: entrada.nota });
      if (!datos.ok) return { ok: false, error: 'datos-invalidos', campos: datos.errores };

      const a = ahora();
      // Fresh read right before confirming: catches a booking made in another tab
      const turnos = vigentes(a);
      if (turnos.length >= TOPE_PENDIENTES) return { ok: false, error: 'tope-alcanzado' };

      const consulta = { fecha: entrada.fecha, servicioId: servicio.id, barberoId: entrada.barberoId, ahora: a };
      const enHorario = huecosLibres({ ...consulta, ocupados: new Set() }).some((h) => h.inicio === entrada.inicio);
      if (!enHorario) return { ok: false, error: 'fuera-de-horario' };

      const libres = huecosLibres({ ...consulta, ocupados: ocupadosDe(entrada.fecha, turnos) });
      const hueco = libres.find((h) => h.inicio === entrada.inicio);
      if (!hueco) {
        const alternativas = [...libres]
          .sort((x, y) => Math.abs(x.inicio - entrada.inicio) - Math.abs(y.inicio - entrada.inicio) || x.inicio - y.inicio)
          .slice(0, ALTERNATIVAS)
          .sort((x, y) => x.inicio - y.inicio);
        return { ok: false, error: 'hueco-ocupado', alternativas };
      }

      // Stable sort: on a tie the first barber in the list wins
      const [barberoId] = [...hueco.barberoIds].sort((x, y) => carga(x, entrada.fecha, turnos) - carga(y, entrada.fecha, turnos));
      const reserva: Reserva = {
        codigo: codigoNuevo(almacen.leer()),
        servicioId: servicio.id,
        barberoId: barberoId!,
        fecha: entrada.fecha,
        inicio: entrada.inicio,
        duracion: servicio.duracion,
        nombre: datos.nombre,
        nota: datos.nota,
      };
      almacen.escribir([...turnos, reserva]);
      return { ok: true, reserva };
    },

    async cancelarReserva(codigo: string): Promise<{ ok: boolean }> {
      await esperar();
      const turnos = almacen.leer();
      const quedan = turnos.filter((t) => t.codigo !== codigo);
      if (quedan.length === turnos.length) return { ok: false };
      almacen.escribir(quedan);
      return { ok: true };
    },

    async misReservas(): Promise<Reserva[]> {
      await esperar();
      return vigentes(ahora()).sort((x, y) => x.fecha.localeCompare(y.fecha) || x.inicio - y.inicio);
    },
  };
}

export type ApiReservas = ReturnType<typeof crearApi>;
