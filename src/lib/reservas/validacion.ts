// Input of a booking (spec §5.1, constitution V): the simulated API runs this again even
// when the form already did, exactly as a server would.
export type ErrorNombre = 'nombre-corto' | 'nombre-largo' | 'nombre-sin-letras';
export type ErrorNota = 'nota-larga';

export interface ErroresDatos {
  nombre?: ErrorNombre;
  nota?: ErrorNota;
}

export type ResultadoDatos = { ok: true; nombre: string; nota: string } | { ok: false; errores: ErroresDatos };

export const NOMBRE_MIN = 2;
export const NOMBRE_MAX = 60;
export const NOTA_MAX = 140;

/** Control characters and line breaks become spaces; runs of spaces collapse to one. */
function limpiar(valor: unknown): string {
  if (typeof valor !== 'string') return '';
  return valor.replace(/\p{Cc}/gu, ' ').replace(/\s+/g, ' ').trim();
}

/** Length in user-perceived characters, so «ñ» or an emoji counts as one. */
function largo(texto: string): number {
  return [...new Intl.Segmenter('es', { granularity: 'grapheme' }).segment(texto)].length;
}

export function validarDatos(entrada: { nombre: unknown; nota: unknown }): ResultadoDatos {
  const nombre = limpiar(entrada.nombre);
  const nota = limpiar(entrada.nota);
  const errores: ErroresDatos = {};

  if (largo(nombre) < NOMBRE_MIN) errores.nombre = 'nombre-corto';
  else if (largo(nombre) > NOMBRE_MAX) errores.nombre = 'nombre-largo';
  else if (!/\p{L}/u.test(nombre)) errores.nombre = 'nombre-sin-letras';

  if (largo(nota) > NOTA_MAX) errores.nota = 'nota-larga';

  return Object.keys(errores).length > 0 ? { ok: false, errores } : { ok: true, nombre, nota };
}
