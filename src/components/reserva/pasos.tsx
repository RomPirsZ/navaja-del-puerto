// The five steps of the booking (spec §5.1). Each choice is a button with aria-pressed: a
// deliberate action, so arrow keys never move the flow on by themselves (modern-web-guidance,
// forms: no auto-advance on radio change). Only the current step is rendered.
import { useId, type FormEvent, type ReactNode, type RefObject } from 'react';
import { BARBEROS } from '../../data/barberos';
import { HORARIO } from '../../data/horario';
import { SERVICIOS } from '../../data/servicios';
import { t, type Clave } from '../../i18n';
import { describirDias } from '../../lib/apertura';
import type { Estado } from '../../lib/reservas/estado';
import type { Hueco } from '../../lib/reservas/disponibilidad';
import { diaSemana, formatearFecha, formatearHora } from '../../lib/reservas/tiempo';
import { NOMBRE_MAX, NOTA_MAX } from '../../lib/reservas/validacion';
import { nombreBarbero, partesDia, totalServicio } from './textos';

interface PasoProps {
  titulo: string;
  tituloRef: RefObject<HTMLHeadingElement | null>;
  children: ReactNode;
}

/** Step shell: the heading takes focus when the step opens (tabIndex -1) */
export function Paso({ titulo, tituloRef, children }: PasoProps) {
  const id = useId();
  return (
    <section className="paso" aria-labelledby={id}>
      <h3 id={id} ref={tituloRef} tabIndex={-1} className="paso-titulo display">
        {titulo}
      </h3>
      {children}
    </section>
  );
}

export function OpcionesServicio({ estado, onElegir }: { estado: Estado; onElegir: (id: string) => void }) {
  return (
    <ul className="opciones opciones-lista">
      {SERVICIOS.map((s) => (
        <li key={s.id}>
          <button type="button" className="opcion" aria-pressed={estado.servicioId === s.id} onClick={() => onElegir(s.id)}>
            <span className="opcion-nombre">{t(`servicio.${s.id}.nombre` as Clave)}</span>{' '}
            <span className="opcion-dato cifras">{totalServicio(s.id)}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export function OpcionesBarbero({ estado, onElegir }: { estado: Estado; onElegir: (id: string) => void }) {
  const servicioId = estado.servicioId;
  const posibles = BARBEROS.filter((b) => servicioId && b.servicios.includes(servicioId));
  return (
    <ul className="opciones opciones-lista">
      <li>
        <button type="button" className="opcion" aria-pressed={estado.barberoId === 'cualquiera'} onClick={() => onElegir('cualquiera')}>
          <span className="opcion-nombre">{t('barbero.cualquiera.nombre')}</span>{' '}
          <span className="opcion-dato">{t('barbero.cualquiera.descripcion')}</span>
        </button>
      </li>
      {posibles.map((b) => (
        <li key={b.id}>
          <button type="button" className="opcion" aria-pressed={estado.barberoId === b.id} onClick={() => onElegir(b.id)}>
            <span className="opcion-nombre">{nombreBarbero(b.id)}</span>{' '}
            <span className="opcion-dato">{describirDias(b.dias)}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

/** Whether anyone can do the chosen service on that date (closed days and barbers' days) */
function motivoDiaCerrado(estado: Estado, fecha: string): string | null {
  const dia = diaSemana(fecha);
  if ((HORARIO[dia] ?? []).length === 0) return t('dia.cerrado');
  const candidatos = BARBEROS.filter(
    (b) => (estado.barberoId === 'cualquiera' || b.id === estado.barberoId) && estado.servicioId && b.servicios.includes(estado.servicioId),
  );
  return candidatos.some((b) => b.dias.includes(dia)) ? null : t('dia.noTrabaja');
}

export function OpcionesDia({ estado, dias, onElegir }: { estado: Estado; dias: string[]; onElegir: (fecha: string) => void }) {
  return (
    <ul className="opciones opciones-rejilla opciones-dias">
      {dias.map((fecha) => {
        const p = partesDia(fecha);
        const motivo = motivoDiaCerrado(estado, fecha);
        return (
          <li key={fecha}>
            <button type="button" className="opcion opcion-dia" aria-pressed={estado.fecha === fecha} disabled={motivo !== null} onClick={() => onElegir(fecha)}>
              <span className="opcion-semana">{p.semana}</span>{' '}
              <span className="opcion-numero cifras">{p.dia}</span>{' '}
              <span className="opcion-mes">{motivo ?? p.mes}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

interface HorasProps {
  estado: Estado;
  siguienteDia: string | null | undefined;
  onElegir: (inicio: number) => void;
  onReintentar: () => void;
  onIrADia: (fecha: string) => void;
}

function RejillaHoras({ huecos, estado, onElegir }: { huecos: Hueco[]; estado: Estado; onElegir: (inicio: number) => void }) {
  const grupos = [
    { titulo: t('hora.manana'), lista: huecos.filter((h) => h.inicio < 720) },
    { titulo: t('hora.tarde'), lista: huecos.filter((h) => h.inicio >= 720) },
  ].filter((g) => g.lista.length > 0);
  return (
    <>
      {grupos.map((g) => (
        <div key={g.titulo} className="horas-grupo">
          <h4 className="horas-titulo">{g.titulo}</h4>
          <ul className="opciones opciones-rejilla opciones-horas">
            {g.lista.map((h) => (
              <li key={h.inicio}>
                <button type="button" className="opcion opcion-hora cifras" aria-pressed={estado.inicio === h.inicio} onClick={() => onElegir(h.inicio)}>
                  {formatearHora(h.inicio)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

export function OpcionesHora({ estado, siguienteDia, onElegir, onReintentar, onIrADia }: HorasProps) {
  const { huecos, envio } = estado;
  const dia = estado.fecha ? formatearFecha(estado.fecha) : '';

  if (envio.estado === 'error' && envio.error === 'hueco-ocupado') {
    return (
      <div className="horas">
        <p className="aviso-error" role="alert">{t('error.hueco-ocupado')}</p>
        <RejillaHoras huecos={envio.alternativas ?? []} estado={estado} onElegir={onElegir} />
      </div>
    );
  }
  if (huecos.estado === 'cargando' || huecos.estado === 'inactivo') return <p className="horas-estado">{t('hora.cargando')}</p>;
  if (huecos.estado === 'error') {
    return (
      <div className="horas">
        <p className="aviso-error">{t('hora.error')}</p>
        <button type="button" className="boton-secundario" onClick={onReintentar}>{t('hora.reintentar')}</button>
      </div>
    );
  }
  if (huecos.lista.length === 0) {
    return (
      <div className="horas">
        <p className="horas-estado">{t('hora.ninguna', { dia })}</p>
        {siguienteDia ? (
          <button type="button" className="boton-secundario" onClick={() => onIrADia(siguienteDia)}>
            {t('hora.irA', { dia: formatearFecha(siguienteDia) })}
          </button>
        ) : siguienteDia === null ? (
          <p className="horas-estado">{t('hora.sinMas')}</p>
        ) : null}
      </div>
    );
  }
  return (
    <div className="horas">
      {envio.estado === 'error' && envio.error === 'fuera-de-horario' ? <p className="aviso-error" role="alert">{t('error.fuera-de-horario')}</p> : null}
      <RejillaHoras huecos={huecos.lista} estado={estado} onElegir={onElegir} />
    </div>
  );
}

interface DatosProps {
  estado: Estado;
  onEscribir: (campo: 'nombre' | 'nota', valor: string) => void;
  onEnviar: (evento: FormEvent<HTMLFormElement>) => void;
  nombreRef: RefObject<HTMLInputElement | null>;
  notaRef: RefObject<HTMLTextAreaElement | null>;
  avisoRef: RefObject<HTMLParagraphElement | null>;
}

export function FormularioDatos({ estado, onEscribir, onEnviar, nombreRef, notaRef, avisoRef }: DatosProps) {
  const { envio } = estado;
  const errorNombre = envio.campos?.nombre;
  const errorNota = envio.campos?.nota;
  const enviando = envio.estado === 'enviando';
  const aviso =
    envio.estado !== 'error'
      ? null
      : envio.error === 'tope-alcanzado' || envio.error === 'datos-invalidos'
        ? t(`error.${envio.error}`)
        : envio.error === undefined
          ? t('error.general')
          : null;

  return (
    <form className="datos" action="#reservar" onSubmit={onEnviar} noValidate aria-describedby="datos-demo">
      {aviso ? (
        <p className="aviso-error" ref={avisoRef} tabIndex={-1} role="alert">{aviso}</p>
      ) : null}
      <div className="campo">
        <label htmlFor="reserva-nombre">{t('campo.nombre')}</label>
        <input
          id="reserva-nombre"
          ref={nombreRef}
          name="nombre"
          type="text"
          autoComplete="name"
          enterKeyHint="done"
          required
          maxLength={NOMBRE_MAX}
          value={estado.nombre}
          aria-invalid={errorNombre ? true : undefined}
          aria-describedby={errorNombre ? 'reserva-nombre-error reserva-nombre-ayuda' : 'reserva-nombre-ayuda'}
          onChange={(e) => onEscribir('nombre', e.currentTarget.value)}
        />
        <p id="reserva-nombre-ayuda" className="campo-ayuda">{t('campo.nombreAyuda')}</p>
        {errorNombre ? <p id="reserva-nombre-error" className="campo-error">{t(`error.${errorNombre}`)}</p> : null}
      </div>
      <div className="campo">
        <label htmlFor="reserva-nota">{t('campo.nota')}</label>
        <textarea
          id="reserva-nota"
          ref={notaRef}
          name="nota"
          rows={2}
          maxLength={NOTA_MAX}
          value={estado.nota}
          aria-invalid={errorNota ? true : undefined}
          aria-describedby={errorNota ? 'reserva-nota-error reserva-nota-ayuda' : 'reserva-nota-ayuda'}
          onChange={(e) => onEscribir('nota', e.currentTarget.value)}
        />
        <p id="reserva-nota-ayuda" className="campo-ayuda">{t('campo.notaAyuda')}</p>
        {errorNota ? <p id="reserva-nota-error" className="campo-error">{t(`error.${errorNota}`)}</p> : null}
      </div>
      <p id="datos-demo" className="datos-demo">{t('datos.demo')}</p>
      <button type="submit" className="boton" disabled={enviando} aria-disabled={enviando ? true : undefined}>
        {enviando ? t('datos.enviando') : t('datos.confirmar')}
      </button>
    </form>
  );
}
