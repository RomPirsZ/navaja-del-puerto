// Booking code (spec §5.1): «NP-» and 4 characters without look-alikes (no 0/O, 1/I/L).
const ALFABETO = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const FORMA = /^NP-[A-HJKMNP-Z2-9]{4}$/;

function azarSeguro(): number {
  const [valor = 0] = crypto.getRandomValues(new Uint32Array(1));
  return valor / 4_294_967_296;
}

/** `azar` returns a number in [0, 1); injected by the tests, crypto by default. */
export function generarCodigo(azar: () => number = azarSeguro): string {
  let codigo = 'NP-';
  for (let i = 0; i < 4; i++) codigo += ALFABETO[Math.floor(azar() * ALFABETO.length)];
  return codigo;
}

export function esCodigo(valor: unknown): valor is string {
  return typeof valor === 'string' && FORMA.test(valor);
}
