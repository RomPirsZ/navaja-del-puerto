// Bookings live only in this browser (spec §5.3, plan §5). Everything read back is
// validated; if storage is blocked, full or corrupt, the app keeps working in memory.
import { BARBEROS, type BarberoId } from '../../data/barberos';
import { SERVICIOS, type ServicioId } from '../../data/servicios';
import { HUECO } from '../../data/horario';
import { esCodigo } from './codigo';
import { validarDatos } from './validacion';

export const CLAVE = 'navaja-del-puerto:turnos';
const VERSION = 1;

export interface Reserva {
  codigo: string;
  servicioId: ServicioId;
  barberoId: BarberoId;
  fecha: string;
  inicio: number;
  duracion: number;
  nombre: string;
  nota: string;
}

export interface Almacen {
  leer(): Reserva[];
  escribir(turnos: Reserva[]): void;
}

function esReserva(x: unknown): x is Reserva {
  if (typeof x !== 'object' || x === null) return false;
  const r = x as Record<string, unknown>;
  return (
    esCodigo(r['codigo']) &&
    SERVICIOS.some((s) => s.id === r['servicioId']) &&
    BARBEROS.some((b) => b.id === r['barberoId']) &&
    typeof r['fecha'] === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(r['fecha']) &&
    Number.isInteger(r['inicio']) && (r['inicio'] as number) % HUECO === 0 &&
    Number.isInteger(r['duracion']) && (r['duracion'] as number) % HUECO === 0 && (r['duracion'] as number) > 0 &&
    datosLimpios(r['nombre'], r['nota'])
  );
}

/** Stored name and note must be exactly what validation would have produced. */
function datosLimpios(nombre: unknown, nota: unknown): boolean {
  const v = validarDatos({ nombre, nota });
  return v.ok && v.nombre === nombre && v.nota === nota;
}

function copiar(turnos: Reserva[]): Reserva[] {
  return turnos.map((t) => ({ ...t }));
}

export function crearAlmacenMemoria(inicial: Reserva[] = []): Almacen {
  let turnos = copiar(inicial);
  return {
    leer: () => copiar(turnos),
    escribir: (nuevos) => void (turnos = copiar(nuevos)),
  };
}

/** `storage` is injected by the tests; in the browser, `localStorage`. */
export function crearAlmacenLocal(storage: Storage | undefined): Almacen {
  const memoria = crearAlmacenMemoria();
  if (!storage) return memoria;
  let disponible = true;

  return {
    leer() {
      if (!disponible) return memoria.leer();
      try {
        const datos: unknown = JSON.parse(storage.getItem(CLAVE) ?? 'null');
        if (typeof datos !== 'object' || datos === null) return [];
        const { v, turnos } = datos as { v?: unknown; turnos?: unknown };
        if (v !== VERSION || !Array.isArray(turnos)) return [];
        return turnos.filter(esReserva).map((t) => ({ ...t }));
      } catch (error) {
        // Blocked storage (SecurityError) switches to memory; corrupt JSON just reads empty
        if (!(error instanceof SyntaxError)) disponible = false;
        return disponible ? [] : memoria.leer();
      }
    },
    escribir(turnos) {
      memoria.escribir(turnos);
      if (!disponible) return;
      try {
        storage.setItem(CLAVE, JSON.stringify({ v: VERSION, turnos }));
      } catch {
        disponible = false;
      }
    },
  };
}
