// From the services list or the barbers strip to the booking island (plan §6). The choice
// goes into the URL, which the island reads when it mounts, and into an event for an island
// that is already mounted. Without JavaScript the links still lead to #reservar.
export const EVENTO_PRESELECCION = 'reserva:preseleccionar';

export interface Preseleccion {
  servicioId?: string;
  barberoId?: string;
}

export function preseleccionar(p: Preseleccion): void {
  const url = new URL(location.href);
  if (p.servicioId) url.searchParams.set('servicio', p.servicioId);
  if (p.barberoId) url.searchParams.set('barbero', p.barberoId);
  history.replaceState(history.state, '', url);
  document.dispatchEvent(new CustomEvent<Preseleccion>(EVENTO_PRESELECCION, { detail: p }));
}

export function leerPreseleccion(busqueda: string): Preseleccion {
  const params = new URLSearchParams(busqueda);
  const servicioId = params.get('servicio') ?? undefined;
  const barberoId = params.get('barbero') ?? undefined;
  return { ...(servicioId ? { servicioId } : {}), ...(barberoId ? { barberoId } : {}) };
}
