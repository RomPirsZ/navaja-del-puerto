// Display helpers shared by the island's parts. Texts come from es.json (constitution IX).
import { buscarServicio } from '../../data/servicios';
import { t, type Clave } from '../../i18n';

export const nombreServicio = (id: string) => t(`servicio.${id}.nombre` as Clave);

export const nombreBarbero = (id: string) =>
  id === 'cualquiera' ? t('barbero.cualquiera.nombre') : t(`barbero.${id}.nombre` as Clave);

export function totalServicio(id: string): string {
  const s = buscarServicio(id);
  if (!s) return '';
  return t('ficha.total', {
    duracion: t('servicios.duracion', { min: String(s.duracion) }),
    precio: t('servicios.precio', { monto: String(s.precio) }),
  });
}

const formatoCorto = new Intl.DateTimeFormat('es-VE', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });

/** «mié 25 nov» and its parts, for day buttons and the record label */
export function partesDia(fecha: string): { semana: string; dia: string; mes: string; corto: string } {
  const instante = new Date(`${fecha}T12:00:00Z`);
  const p = Object.fromEntries(formatoCorto.formatToParts(instante).map((x) => [x.type, x.value.replace('.', '')]));
  const semana = p['weekday'] ?? '';
  const dia = p['day'] ?? '';
  const mes = p['month'] ?? '';
  return { semana, dia, mes, corto: `${semana} ${dia} ${mes}` };
}
