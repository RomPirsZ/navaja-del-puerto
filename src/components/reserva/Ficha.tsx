import { t } from '../../i18n';
import { formatearHora } from '../../lib/reservas/tiempo';
import { PASOS, siguientePaso, type Estado, type Paso } from '../../lib/reservas/estado';
import { nombreBarbero, nombreServicio, partesDia, totalServicio } from './textos';

interface Props {
  estado: Estado;
  onEditar: (paso: Paso) => void;
}

/**
 * The record label is the booking ticket (surface contract): it fills in as the visitor
 * chooses and doubles as the step indicator. Each filled line reopens its step.
 */
export default function Ficha({ estado, onEditar }: Props) {
  const confirmado = estado.paso === 'confirmado' ? estado.reserva : null;
  const tope = PASOS.indexOf(siguientePaso(estado));
  const barbero = confirmado ? confirmado.barberoId : estado.barberoId;

  const lineas: { paso: Paso; etiqueta: string; valor: string | null }[] = [
    { paso: 'servicio', etiqueta: t('ficha.servicio'), valor: estado.servicioId ? nombreServicio(estado.servicioId) : null },
    { paso: 'barbero', etiqueta: t('ficha.barbero'), valor: barbero ? nombreBarbero(barbero) : null },
    { paso: 'dia', etiqueta: t('ficha.dia'), valor: estado.fecha ? partesDia(estado.fecha).corto : null },
    { paso: 'hora', etiqueta: t('ficha.hora'), valor: (confirmado?.inicio ?? estado.inicio) !== null ? formatearHora(confirmado?.inicio ?? estado.inicio!) : null },
  ];

  return (
    <aside className="ficha" aria-labelledby="ficha-titulo" data-confirmada={confirmado ? 'true' : undefined}>
      <div className="ficha-disco">
        <div className="ficha-etiqueta">
          <h3 id="ficha-titulo" className="ficha-titulo">{t('ficha.titulo')}</h3>
          <ol className="ficha-lineas">
            {lineas.map((l, i) => {
              const actual = estado.paso === l.paso;
              const abrible = !confirmado && i <= tope && !actual;
              return (
                // Keyed by value: a new choice remounts the line, so it is written in again
                <li key={`${l.paso}-${l.valor ?? ''}`} className="ficha-linea" data-llena={l.valor ? 'true' : undefined}>
                  {abrible && l.valor ? (
                    <button type="button" onClick={() => onEditar(l.paso)} aria-label={t('ficha.cambiar', { valor: l.valor })}>
                      {l.valor}
                    </button>
                  ) : (
                    <span aria-current={actual ? 'step' : undefined}>{l.valor ?? l.etiqueta}</span>
                  )}
                </li>
              );
            })}
          </ol>
          <p className="ficha-total cifras">{estado.servicioId ? totalServicio(estado.servicioId) : ' '}</p>
          <p className="ficha-codigo cifras">{confirmado ? confirmado.codigo : t('ficha.codigoPendiente')}</p>
        </div>
      </div>
    </aside>
  );
}
