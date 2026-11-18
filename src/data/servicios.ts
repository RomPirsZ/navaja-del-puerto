// Services of the fictional barbershop (spec §6). Names and descriptions live in es.json.
export type ServicioId = 'corte' | 'corte-barba' | 'barba' | 'afeitado' | 'infantil';

export interface Servicio {
  id: ServicioId;
  /** Minutes, always a multiple of the 30-minute slot */
  duracion: number;
  /** Sample price in whole US dollars */
  precio: number;
}

export const SERVICIOS: readonly Servicio[] = [
  { id: 'corte', duracion: 30, precio: 8 },
  { id: 'corte-barba', duracion: 60, precio: 12 },
  { id: 'barba', duracion: 30, precio: 6 },
  { id: 'afeitado', duracion: 30, precio: 7 },
  { id: 'infantil', duracion: 30, precio: 6 },
];

export function buscarServicio(id: string): Servicio | undefined {
  return SERVICIOS.find((s) => s.id === id);
}
