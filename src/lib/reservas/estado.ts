// State of the booking flow (spec §5.1, plan §6), as a pure reducer for `useReducer`.
// Any step can be reopened; data that stays compatible is kept and the rest is cleared.
import { buscarBarbero, type BarberoId } from '../../data/barberos';
import { buscarServicio, type ServicioId } from '../../data/servicios';
import type { Reserva } from './almacen';
import type { ResultadoReserva } from './api-simulada';
import type { Hueco } from './disponibilidad';
import { diaSemana } from './tiempo';
import type { ErroresDatos } from './validacion';

export type Paso = 'servicio' | 'barbero' | 'dia' | 'hora' | 'datos' | 'confirmado';
export const PASOS: readonly Paso[] = ['servicio', 'barbero', 'dia', 'hora', 'datos'];

type Fallo = Extract<ResultadoReserva, { ok: false }>;

export interface Estado {
  paso: Paso;
  servicioId: ServicioId | null;
  barberoId: BarberoId | 'cualquiera' | null;
  fecha: string | null;
  inicio: number | null;
  nombre: string;
  nota: string;
  huecos: { estado: 'inactivo' | 'cargando' | 'listo' | 'error'; lista: Hueco[] };
  envio: { estado: 'inactivo' | 'enviando' | 'error'; error?: Fallo['error']; campos?: ErroresDatos; alternativas?: Hueco[] };
  reserva: Reserva | null;
}

export type Accion =
  | { tipo: 'preseleccionar'; servicioId?: string; barberoId?: string }
  | { tipo: 'elegir-servicio'; servicioId: string }
  | { tipo: 'elegir-barbero'; barberoId: string }
  | { tipo: 'elegir-dia'; fecha: string }
  | { tipo: 'elegir-hora'; inicio: number }
  | { tipo: 'editar'; paso: Paso }
  | { tipo: 'escribir'; campo: 'nombre' | 'nota'; valor: string }
  | { tipo: 'huecos-cargando' }
  | { tipo: 'huecos-listos'; lista: Hueco[] }
  | { tipo: 'huecos-error' }
  | { tipo: 'enviando' }
  | { tipo: 'envio-fallido'; resultado: Fallo }
  | { tipo: 'confirmado'; reserva: Reserva }
  | { tipo: 'reiniciar' };

const SIN_HUECOS: Estado['huecos'] = { estado: 'inactivo', lista: [] };
const SIN_ENVIO: Estado['envio'] = { estado: 'inactivo' };

export const ESTADO_INICIAL: Estado = {
  paso: 'servicio',
  servicioId: null,
  barberoId: null,
  fecha: null,
  inicio: null,
  nombre: '',
  nota: '',
  huecos: SIN_HUECOS,
  envio: SIN_ENVIO,
  reserva: null,
};

/** The first step whose choice is still missing */
export function siguientePaso(e: Pick<Estado, 'servicioId' | 'barberoId' | 'fecha' | 'inicio'>): Paso {
  if (!e.servicioId) return 'servicio';
  if (!e.barberoId) return 'barbero';
  if (!e.fecha) return 'dia';
  if (e.inicio === null) return 'hora';
  return 'datos';
}

/** Drops whatever stopped being compatible after a change; the time always goes. */
function depurar(e: Estado): Estado {
  let { barberoId, fecha } = e;
  const barbero = barberoId && barberoId !== 'cualquiera' ? buscarBarbero(barberoId) : undefined;
  if (barbero && e.servicioId && !barbero.servicios.includes(e.servicioId)) barberoId = null;
  if (barbero && barberoId && fecha && !barbero.dias.includes(diaSemana(fecha))) fecha = null;
  const limpio = { ...e, barberoId, fecha, inicio: null, huecos: SIN_HUECOS, envio: SIN_ENVIO };
  return { ...limpio, paso: siguientePaso(limpio) };
}

export function reducir(e: Estado, a: Accion): Estado {
  switch (a.tipo) {
    case 'preseleccionar': {
      const servicio = a.servicioId ? buscarServicio(a.servicioId) : undefined;
      const barbero = a.barberoId ? buscarBarbero(a.barberoId) : undefined;
      if (!servicio && !barbero) return e;
      const base = e.paso === 'confirmado' ? { ...ESTADO_INICIAL, nombre: e.nombre } : e;
      return depurar({ ...base, servicioId: servicio?.id ?? base.servicioId, barberoId: barbero?.id ?? base.barberoId });
    }
    case 'elegir-servicio': {
      const servicio = buscarServicio(a.servicioId);
      return servicio ? depurar({ ...e, servicioId: servicio.id }) : e;
    }
    case 'elegir-barbero': {
      const id = a.barberoId === 'cualquiera' ? 'cualquiera' : buscarBarbero(a.barberoId)?.id;
      return id ? depurar({ ...e, barberoId: id }) : e;
    }
    case 'elegir-dia':
      return depurar({ ...e, fecha: a.fecha });
    case 'elegir-hora':
      return { ...e, inicio: a.inicio, envio: SIN_ENVIO, paso: siguientePaso({ ...e, inicio: a.inicio }) };
    case 'editar': {
      const tope = siguientePaso(e);
      const permitido = PASOS.indexOf(a.paso) <= PASOS.indexOf(tope) && a.paso !== 'confirmado';
      return { ...e, paso: permitido ? a.paso : tope };
    }
    case 'escribir': {
      const campos = e.envio.campos ? { ...e.envio.campos } : undefined;
      if (campos) delete campos[a.campo];
      return { ...e, [a.campo]: a.valor, envio: campos ? { ...e.envio, campos } : e.envio };
    }
    case 'huecos-cargando':
      return { ...e, huecos: { estado: 'cargando', lista: [] } };
    case 'huecos-listos':
      return { ...e, huecos: { estado: 'listo', lista: a.lista } };
    case 'huecos-error':
      return { ...e, huecos: { estado: 'error', lista: [] } };
    case 'enviando':
      return { ...e, envio: { estado: 'enviando' } };
    case 'envio-fallido': {
      const r = a.resultado;
      if (r.error === 'hueco-ocupado' || r.error === 'fuera-de-horario') {
        const envio = { estado: 'error' as const, error: r.error, ...(r.error === 'hueco-ocupado' ? { alternativas: r.alternativas } : {}) };
        return { ...e, inicio: null, paso: 'hora', huecos: SIN_HUECOS, envio };
      }
      const envio = { estado: 'error' as const, error: r.error, ...(r.error === 'datos-invalidos' && r.campos ? { campos: r.campos } : {}) };
      return { ...e, paso: 'datos', envio };
    }
    case 'confirmado':
      return { ...e, paso: 'confirmado', reserva: a.reserva, envio: SIN_ENVIO };
    case 'reiniciar':
      return { ...ESTADO_INICIAL, nombre: e.nombre };
  }
}
