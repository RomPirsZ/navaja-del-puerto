// Fictional barbers (spec §6): the days they work (0 = Sunday) and the services they do.
// Names and specialities live in es.json.
import type { ServicioId } from './servicios';

export type BarberoId = 'ramon' | 'leo' | 'jesus';

export interface Barbero {
  id: BarberoId;
  dias: readonly number[];
  servicios: readonly ServicioId[];
}

export const BARBEROS: readonly Barbero[] = [
  { id: 'ramon', dias: [2, 3, 4, 5, 6], servicios: ['corte', 'corte-barba', 'barba', 'afeitado'] },
  { id: 'leo', dias: [0, 2, 3, 4, 5, 6], servicios: ['corte', 'corte-barba', 'barba'] },
  { id: 'jesus', dias: [0, 3, 4, 5, 6], servicios: ['corte', 'barba', 'infantil'] },
];

export function buscarBarbero(id: string): Barbero | undefined {
  return BARBEROS.find((b) => b.id === id);
}
