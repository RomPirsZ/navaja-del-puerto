// Free slots for a day (spec §5.2). Pure: occupancy and "now" come in as arguments, so the
// simulated API, the island and the tests share exactly the same rules.
import { BARBEROS, buscarBarbero, type BarberoId } from '../../data/barberos';
import { ANTELACION, HORARIO, HUECO, VENTANA_DIAS } from '../../data/horario';
import { buscarServicio } from '../../data/servicios';
import { diaSemana, sumarDias } from './tiempo';

/** "Now" in Puerto Cabello: calendar date and wall-clock minutes */
export interface Ahora {
  fecha: string;
  minutos: number;
}

export interface Hueco {
  /** Wall-clock minutes of the start */
  inicio: number;
  /** Barbers free for the whole service at that time, in the list's order */
  barberoIds: BarberoId[];
}

export interface ConsultaHuecos {
  fecha: string;
  servicioId: string;
  barberoId: string;
  /** Occupied 30-minute cells, as built by `celda()` */
  ocupados: ReadonlySet<string>;
  ahora: Ahora;
}

/** Key of one occupied 30-minute cell of a barber */
export function celda(barberoId: string, fecha: string, inicio: number): string {
  return `${barberoId}|${fecha}|${inicio}`;
}

export function dentroDeVentana(fecha: string, ahora: Ahora): boolean {
  return fecha >= ahora.fecha && fecha <= sumarDias(ahora.fecha, VENTANA_DIAS - 1);
}

/** Start times (minutes) where a service of `duracion` fits inside one opening stretch. */
function iniciosPosibles(fecha: string, duracion: number): number[] {
  const inicios: number[] = [];
  for (const { desde, hasta } of HORARIO[diaSemana(fecha)] ?? []) {
    for (let inicio = desde; inicio + duracion <= hasta; inicio += HUECO) inicios.push(inicio);
  }
  return inicios;
}

export function huecosLibres({ fecha, servicioId, barberoId, ocupados, ahora }: ConsultaHuecos): Hueco[] {
  const servicio = buscarServicio(servicioId);
  if (!servicio || !dentroDeVentana(fecha, ahora)) return [];
  if (barberoId !== 'cualquiera' && !buscarBarbero(barberoId)) return [];

  const dia = diaSemana(fecha);
  const candidatos = BARBEROS.filter(
    (b) => (barberoId === 'cualquiera' || b.id === barberoId) && b.dias.includes(dia) && b.servicios.includes(servicio.id),
  );
  const minimo = fecha === ahora.fecha ? ahora.minutos + ANTELACION : 0;

  const huecos: Hueco[] = [];
  for (const inicio of iniciosPosibles(fecha, servicio.duracion)) {
    if (inicio < minimo) continue;
    const libres = candidatos.filter((b) => {
      for (let m = inicio; m < inicio + servicio.duracion; m += HUECO) if (ocupados.has(celda(b.id, fecha, m))) return false;
      return true;
    });
    if (libres.length > 0) huecos.push({ inicio, barberoIds: libres.map((b) => b.id) });
  }
  return huecos;
}

/** The first day from `desde` (inclusive) within the booking window that has a free slot. */
export function proximoDiaConHueco(args: {
  desde: string;
  servicioId: string;
  barberoId: string;
  ocupadosDe: (fecha: string) => ReadonlySet<string>;
  ahora: Ahora;
}): string | null {
  for (let fecha = args.desde; dentroDeVentana(fecha, args.ahora); fecha = sumarDias(fecha, 1)) {
    const huecos = huecosLibres({ ...args, fecha, ocupados: args.ocupadosDe(fecha) });
    if (huecos.length > 0) return fecha;
  }
  return null;
}
