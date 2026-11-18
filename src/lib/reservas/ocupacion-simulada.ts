// Simulated agenda (plan §5): about 40 % of each barber's cells look taken, always the same
// for the same day and barber, so the demo feels lived-in and the tests can pin it down.
import { buscarBarbero } from '../../data/barberos';
import { HORARIO, HUECO } from '../../data/horario';
import { diaSemana } from './tiempo';

const PROPORCION = 0.4;

// FNV-1a string hash: a stable 32-bit seed from the date and the barber
function semilla(texto: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

// mulberry32: small seeded PRNG, enough for a believable demo agenda
function aleatorio(semillaInicial: number): () => number {
  let a = semillaInicial;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}

/** Start minutes of the simulated taken cells of a barber on a date. */
export function ocupacionSimulada(fecha: string, barberoId: string): number[] {
  const barbero = buscarBarbero(barberoId);
  const dia = diaSemana(fecha);
  if (!barbero || !barbero.dias.includes(dia)) return [];

  const celdas: number[] = [];
  for (const { desde, hasta } of HORARIO[dia] ?? []) {
    for (let inicio = desde; inicio < hasta; inicio += HUECO) celdas.push(inicio);
  }
  const azar = aleatorio(semilla(`${fecha}|${barberoId}`));
  const ocupadas = celdas.filter(() => azar() < PROPORCION);
  // A whole day taken would read as broken in a demo: always leave at least two cells free
  return ocupadas.length > celdas.length - 2 ? ocupadas.slice(0, celdas.length - 2) : ocupadas;
}
