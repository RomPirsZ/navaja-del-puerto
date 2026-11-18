import { useState } from 'react';
import { t } from '../../i18n';
import type { Reserva } from '../../lib/reservas/almacen';
import { formatearFecha, formatearHora } from '../../lib/reservas/tiempo';
import { nombreBarbero, nombreServicio } from './textos';

interface Props {
  turnos: Reserva[];
  onCancelar: (codigo: string) => void;
}

/** Pending bookings in this browser (spec §5.3); cancelling asks once, inline. */
export default function TusTurnos({ turnos, onCancelar }: Props) {
  const [preguntando, setPreguntando] = useState<string | null>(null);
  if (turnos.length === 0) return null;

  return (
    <section className="turnos" aria-labelledby="turnos-titulo">
      <h3 id="turnos-titulo" className="turnos-titulo" tabIndex={-1}>{t('turnos.titulo')}</h3>
      <ul className="turnos-lista">
        {turnos.map((r) => (
          <li key={r.codigo} className="turno">
            <p className="turno-codigo cifras">{r.codigo}</p>
            <p className="turno-resumen">
              {t('turnos.resumen', {
                servicio: nombreServicio(r.servicioId),
                barbero: t('barbero.con', { nombre: nombreBarbero(r.barberoId) }),
                dia: formatearFecha(r.fecha),
                hora: formatearHora(r.inicio),
              })}
            </p>
            {preguntando === r.codigo ? (
              <div className="turno-pregunta" role="group" aria-label={t('turnos.confirmarCancelar', { codigo: r.codigo })}>
                <p>{t('turnos.confirmarCancelar', { codigo: r.codigo })}</p>
                <button type="button" className="boton-secundario" onClick={() => onCancelar(r.codigo)}>{t('turnos.si')}</button>
                <button type="button" className="boton-secundario" autoFocus onClick={() => setPreguntando(null)}>{t('turnos.no')}</button>
              </div>
            ) : (
              <button type="button" className="boton-secundario" onClick={() => setPreguntando(r.codigo)}>
                {t('turnos.cancelar', { codigo: r.codigo })}
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
