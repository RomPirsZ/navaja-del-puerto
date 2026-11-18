// Opening hours in Puerto Cabello wall-clock minutes (spec §5.2): 540 = 9:00.
export interface Tramo {
  desde: number;
  hasta: number;
}

const MANANA_Y_TARDE: readonly Tramo[] = [
  { desde: 540, hasta: 720 },
  { desde: 780, hasta: 1140 },
];

/** Index = day of the week, 0 = Sunday. Monday is closed; lunch from 12:00 to 13:00. */
export const HORARIO: Readonly<Record<number, readonly Tramo[]>> = {
  0: [{ desde: 540, hasta: 780 }],
  1: [],
  2: MANANA_Y_TARDE,
  3: MANANA_Y_TARDE,
  4: MANANA_Y_TARDE,
  5: MANANA_Y_TARDE,
  6: MANANA_Y_TARDE,
};

/** Length of a booking slot in minutes */
export const HUECO = 30;
/** Days that can be booked, today included */
export const VENTANA_DIAS = 14;
/** Today, only slots starting at least this many minutes from now */
export const ANTELACION = 30;
