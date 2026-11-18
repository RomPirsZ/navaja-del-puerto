// Calendar file for a booking (spec §5.1, RFC 5545). Times go in UTC ("Z"): every calendar
// shows them in its own zone, so no VTIMEZONE block is needed.
import { aInstanteUtc } from './tiempo';

export interface DatosIcs {
  codigo: string;
  titulo: string;
  descripcion: string;
  lugar: string;
  fecha: string;
  inicio: number;
  duracion: number;
  creado: Date;
}

function enUtc(instante: Date): string {
  return instante.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function escapar(texto: string): string {
  return texto.replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
}

/** Folds a content line at 75 octets without splitting a UTF-8 character. */
function plegar(linea: string): string {
  const codificador = new TextEncoder();
  const partes: string[] = [];
  let actual = '';
  for (const caracter of linea) {
    const limite = partes.length === 0 ? 75 : 74; // continuation lines start with a space
    if (codificador.encode(actual + caracter).length > limite) {
      partes.push(actual);
      actual = '';
    }
    actual += caracter;
  }
  partes.push(actual);
  return partes.join('\r\n ');
}

export function generarIcs(d: DatosIcs): string {
  const inicio = aInstanteUtc(d.fecha, d.inicio);
  const fin = new Date(inicio.getTime() + d.duracion * 60_000);
  const lineas = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Navaja del Puerto//Reservas (demo)//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${d.codigo}@navaja-del-puerto.demo`,
    `DTSTAMP:${enUtc(d.creado)}`,
    `DTSTART:${enUtc(inicio)}`,
    `DTEND:${enUtc(fin)}`,
    `SUMMARY:${escapar(d.titulo)}`,
    `LOCATION:${escapar(d.lugar)}`,
    `DESCRIPTION:${escapar(d.descripcion)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lineas.map(plegar).join('\r\n') + '\r\n';
}
