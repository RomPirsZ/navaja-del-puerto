// Live opening state (spec §4.7) and the barbers' days in words. Pure: the time comes in as a
// Puerto Cabello moment, so the page script and the tests share the rules.
import { HORARIO } from '../data/horario';
import { t, type Clave } from '../i18n';
import { sumarDias, type Momento } from './reservas/tiempo';

export type Apertura = { abierto: true; hasta: number } | { abierto: false; abre: { fecha: string; minutos: number; enDias: number } };

export function estadoApertura(m: Momento): Apertura {
  const hoy = HORARIO[m.diaSemana] ?? [];
  const actual = hoy.find((tramo) => m.minutos >= tramo.desde && m.minutos < tramo.hasta);
  if (actual) return { abierto: true, hasta: actual.hasta };

  const despues = hoy.find((tramo) => tramo.desde > m.minutos);
  if (despues) return { abierto: false, abre: { fecha: m.fecha, minutos: despues.desde, enDias: 0 } };

  for (let enDias = 1; enDias <= 7; enDias++) {
    const [primero] = HORARIO[(m.diaSemana + enDias) % 7] ?? [];
    if (primero) return { abierto: false, abre: { fecha: sumarDias(m.fecha, enDias), minutos: primero.desde, enDias } };
  }
  throw new Error('HORARIO has no opening day');
}

/** «la 1», «las 7», «las 12:30»: the hour the way it is said in Spanish */
export function horaHumana(minutos: number): string {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  const doce = ((h + 11) % 12) + 1;
  const hora = m === 0 ? String(doce) : `${doce}:${String(m).padStart(2, '0')}`;
  return doce === 1 ? `la ${hora}` : `las ${hora}`;
}

const nombreDia = (dia: number) => t(`dia.${dia}` as Clave);

export function textoApertura(a: Apertura): string {
  if (a.abierto) return t('apertura.abierto', { hora: horaHumana(a.hasta) });
  const hora = horaHumana(a.abre.minutos);
  if (a.abre.enDias === 0) return t('apertura.cerradoHoy', { hora });
  if (a.abre.enDias === 1) return t('apertura.cerradoManana', { hora });
  const dia = nombreDia(new Date(`${a.abre.fecha}T12:00:00Z`).getUTCDay());
  return t('apertura.cerradoDia', { dia, hora });
}

const mayuscula = (texto: string) => texto.charAt(0).toUpperCase() + texto.slice(1);

/** Working days in words, Monday first: [2…6] → «De martes a sábado» */
export function describirDias(dias: readonly number[]): string {
  const orden = [...new Set(dias)].map((d) => (d === 0 ? 7 : d)).sort((a, b) => a - b);
  const nombre = (d: number) => nombreDia(d % 7);
  const seguidos = orden.every((d, i) => i === 0 || d === orden[i - 1]! + 1);
  if (orden.length === 1) return t('dias.uno', { dia: nombre(orden[0]!) });
  if (seguidos && orden.length > 2) return t('dias.rango', { desde: nombre(orden[0]!), hasta: nombre(orden.at(-1)!) });
  const nombres = orden.map(nombre);
  return mayuscula(`${nombres.slice(0, -1).join(', ')} ${t('dias.y')} ${nombres.at(-1)}`);
}
