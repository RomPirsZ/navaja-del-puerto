// Puerto Cabello time without a date library (plan §2). Calendar dates are plain
// 'YYYY-MM-DD' strings and times are wall-clock minutes after midnight; the zone is always
// named by its IANA id, never by a fixed offset (Venezuela changed it in 2007 and 2016).
// Temporal would model this natively, but Safari lacks it and a polyfill is a dependency.

export const ZONA = 'America/Caracas';

export interface Momento {
  fecha: string;
  minutos: number;
  diaSemana: number;
}

const partesEnZona = new Intl.DateTimeFormat('en-CA', {
  timeZone: ZONA,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

/** The date, minutes and weekday that a given instant has in Puerto Cabello. */
export function ahoraEnPuerto(instante: Date): Momento {
  const p = Object.fromEntries(partesEnZona.formatToParts(instante).map((x) => [x.type, x.value]));
  const fecha = `${p['year']}-${p['month']}-${p['day']}`;
  return { fecha, minutos: Number(p['hour']) * 60 + Number(p['minute']), diaSemana: diaSemana(fecha) };
}

// Calendar arithmetic runs on UTC epochs on purpose: UTC has no offset changes, so adding
// days never drifts. These epochs are never shown or treated as real instants.
function aEpocaUtc(fecha: string): number {
  const [y = 0, m = 1, d = 1] = fecha.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}

function deEpocaUtc(epoca: number): string {
  return new Date(epoca).toISOString().slice(0, 10);
}

export function sumarDias(fecha: string, dias: number): string {
  return deEpocaUtc(aEpocaUtc(fecha) + dias * 86_400_000);
}

/** 0 = Sunday … 6 = Saturday */
export function diaSemana(fecha: string): number {
  return new Date(aEpocaUtc(fecha)).getUTCDay();
}

export function proximosDias(desde: string, cuantos: number): string[] {
  return Array.from({ length: cuantos }, (_, i) => sumarDias(desde, i));
}

/** The real instant of a Puerto Cabello wall-clock time, resolved through the IANA zone. */
export function aInstanteUtc(fecha: string, minutos: number): Date {
  const comoSiFueraUtc = aEpocaUtc(fecha) + minutos * 60_000;
  const visto = ahoraEnPuerto(new Date(comoSiFueraUtc));
  const desfase = aEpocaUtc(visto.fecha) + visto.minutos * 60_000 - comoSiFueraUtc;
  return new Date(comoSiFueraUtc - desfase);
}

const formatoHora = new Intl.DateTimeFormat('es-VE', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC' });
const formatoFecha = new Intl.DateTimeFormat('es-VE', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });

/** «9:00 a. m.» from wall-clock minutes */
export function formatearHora(minutos: number): string {
  return formatoHora.format(new Date(minutos * 60_000)).replace(/ | /g, ' ');
}

/** «miércoles, 25 de noviembre» from a calendar date */
export function formatearFecha(fecha: string): string {
  return formatoFecha.format(new Date(aEpocaUtc(fecha)));
}
