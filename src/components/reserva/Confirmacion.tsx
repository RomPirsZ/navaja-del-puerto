import { useEffect, useRef, useState } from 'react';
import { t } from '../../i18n';
import type { Reserva } from '../../lib/reservas/almacen';
import { generarIcs } from '../../lib/reservas/ics';
import { formatearFecha, formatearHora } from '../../lib/reservas/tiempo';
import { nombreBarbero, nombreServicio, totalServicio } from './textos';

interface Props {
  reserva: Reserva;
  onOtro: () => void;
}

/** The receipt: code, summary, calendar file, share or copy, and book another one. */
export default function Confirmacion({ reserva, onOtro }: Props) {
  const titulo = useRef<HTMLHeadingElement>(null);
  const [copia, setCopia] = useState<'copiado' | 'fallo' | null>(null);
  const servicio = nombreServicio(reserva.servicioId);
  const barbero = t('barbero.con', { nombre: nombreBarbero(reserva.barberoId) });
  const dia = formatearFecha(reserva.fecha);
  const hora = formatearHora(reserva.inicio);
  const resumen = t('compartir.texto', { servicio, barbero, dia, hora, codigo: reserva.codigo });

  useEffect(() => titulo.current?.focus(), []);

  function descargarIcs() {
    const ics = generarIcs({
      codigo: reserva.codigo,
      titulo: t('ics.titulo', { servicio }),
      descripcion: t('ics.descripcion', { barbero, codigo: reserva.codigo }),
      lugar: t('ics.lugar'),
      fecha: reserva.fecha,
      inicio: reserva.inicio,
      duracion: reserva.duracion,
      creado: new Date(),
    });
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = `navaja-del-puerto-${reserva.codigo}.ics`;
    enlace.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function compartir() {
    if (navigator.share) {
      try {
        await navigator.share({ title: t('confirmado.titulo'), text: resumen });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(resumen);
      setCopia('copiado');
    } catch {
      setCopia('fallo');
    }
  }

  return (
    <section className="confirmacion" aria-labelledby="confirmacion-titulo">
      <h3 id="confirmacion-titulo" ref={titulo} tabIndex={-1} className="paso-titulo display">{t('confirmado.titulo')}</h3>
      <p className="confirmacion-codigo">
        <span>{t('confirmado.codigo')}</span> <strong className="cifras">{reserva.codigo}</strong>
      </p>
      <p className="confirmacion-resumen">
        {t('confirmado.resumen', { servicio, barbero, dia, hora, total: totalServicio(reserva.servicioId) })}
      </p>
      <div className="confirmacion-acciones">
        <button type="button" className="boton" onClick={descargarIcs}>{t('confirmado.calendario')}</button>
        <button type="button" className="boton-secundario" onClick={compartir}>
          {typeof navigator !== 'undefined' && 'share' in navigator ? t('confirmado.compartir') : t('confirmado.copiar')}
        </button>
        <button type="button" className="boton-secundario" onClick={onOtro}>{t('confirmado.otro')}</button>
      </div>
      <p className="confirmacion-copia" role="status">
        {copia === 'copiado' ? t('confirmado.copiado') : copia === 'fallo' ? t('confirmado.noCopiado') : ''}
      </p>
      <p className="datos-demo">{t('confirmado.demo')}</p>
    </section>
  );
}
