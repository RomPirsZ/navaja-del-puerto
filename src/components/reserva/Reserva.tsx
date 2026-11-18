import { useCallback, useEffect, useReducer, useRef, useState, type FormEvent } from 'react';
import { t } from '../../i18n';
import { EVENTO_PRESELECCION, leerPreseleccion, type Preseleccion } from '../../lib/preseleccion';
import { crearAlmacenLocal, type Reserva as Turno } from '../../lib/reservas/almacen';
import { crearApi, type ApiReservas } from '../../lib/reservas/api-simulada';
import { ESTADO_INICIAL, reducir, type Paso as NombrePaso } from '../../lib/reservas/estado';
import { VENTANA_DIAS } from '../../data/horario';
import { ahoraEnPuerto, formatearFecha, proximosDias, sumarDias } from '../../lib/reservas/tiempo';
import { validarDatos } from '../../lib/reservas/validacion';
import Confirmacion from './Confirmacion';
import Ficha from './Ficha';
import TusTurnos from './TusTurnos';
import { FormularioDatos, OpcionesBarbero, OpcionesDia, OpcionesHora, OpcionesServicio, Paso } from './pasos';
import './reserva.css';

function almacenamiento(): Storage | undefined {
  // Reading localStorage can throw (blocked site data, some private modes)
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

/**
 * Booking island (plan §6). The first render, on the server and during hydration, shows the
 * no-JS notice; an effect marks the island ready, so server and client markup always match.
 */
export default function Reserva() {
  const [lista, setLista] = useState(false);
  const [estado, despachar] = useReducer(reducir, ESTADO_INICIAL);
  const [dias, setDias] = useState<string[]>([]);
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [anuncio, setAnuncio] = useState('');
  // undefined: not looked up yet; null: nothing free in the window
  const [siguienteDia, setSiguienteDia] = useState<string | null | undefined>(undefined);
  const api = useRef<ApiReservas | null>(null);
  const tituloPaso = useRef<HTMLHeadingElement>(null);
  const nombreRef = useRef<HTMLInputElement>(null);
  const notaRef = useRef<HTMLTextAreaElement>(null);
  const avisoRef = useRef<HTMLParagraphElement>(null);
  const primerPaso = useRef(true);

  const refrescarTurnos = useCallback(async () => {
    if (api.current) setTurnos(await api.current.misReservas());
  }, []);

  // Mount: storage, today's window, preselection from the URL and from later clicks
  useEffect(() => {
    api.current = crearApi({ almacen: crearAlmacenLocal(almacenamiento()) });
    setDias(proximosDias(ahoraEnPuerto(new Date()).fecha, VENTANA_DIAS));
    const desdeUrl = leerPreseleccion(location.search);
    if (desdeUrl.servicioId || desdeUrl.barberoId) despachar({ tipo: 'preseleccionar', ...desdeUrl });
    const alPreseleccionar = (e: Event) => despachar({ tipo: 'preseleccionar', ...(e as CustomEvent<Preseleccion>).detail });
    document.addEventListener(EVENTO_PRESELECCION, alPreseleccionar);
    void refrescarTurnos();
    setLista(true);
    return () => document.removeEventListener(EVENTO_PRESELECCION, alPreseleccionar);
  }, [refrescarTurnos]);

  // Hours: load them whenever the time step opens, for the current choice. `intento` forces a
  // reload (retry, or a cancelled booking freed a slot). After a clash the API already sent
  // the alternatives, so nothing is loaded then.
  const { paso, servicioId, barberoId, fecha } = estado;
  const errorEnvio = estado.envio.error;
  const [intento, setIntento] = useState(0);
  useEffect(() => {
    if (paso !== 'hora' || errorEnvio === 'hueco-ocupado' || !api.current || !servicioId || !barberoId || !fecha) return;
    let vigente = true;
    despachar({ tipo: 'huecos-cargando' });
    setSiguienteDia(undefined);
    api.current
      .obtenerDisponibilidad({ fecha, servicioId, barberoId })
      .then(async (huecos) => {
        if (!vigente) return;
        despachar({ tipo: 'huecos-listos', lista: huecos });
        const dia = formatearFecha(fecha);
        setAnuncio(
          huecos.length === 0
            ? t('hora.ninguna', { dia })
            : huecos.length === 1
              ? t('hora.queda', { dia })
              : t('hora.quedan', { n: String(huecos.length), dia }),
        );
        if (huecos.length === 0 && api.current) {
          const otro = await api.current.proximoDia({ desde: sumarDias(fecha, 1), servicioId, barberoId });
          if (vigente) setSiguienteDia(otro);
        }
      })
      .catch(() => {
        if (vigente) despachar({ tipo: 'huecos-error' });
      });
    return () => {
      vigente = false;
    };
  }, [paso, errorEnvio, servicioId, barberoId, fecha, intento]);

  // Focus follows the flow: each new step's heading (modern-web-guidance, multi-step forms)
  useEffect(() => {
    if (primerPaso.current) {
      primerPaso.current = false;
      return;
    }
    if (paso !== 'confirmado') tituloPaso.current?.focus();
  }, [paso]);

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!api.current || !servicioId || !barberoId || !fecha || estado.inicio === null || estado.envio.estado === 'enviando') return;
    const datos = validarDatos({ nombre: estado.nombre, nota: estado.nota });
    if (!datos.ok) {
      despachar({ tipo: 'envio-fallido', resultado: { ok: false, error: 'datos-invalidos', campos: datos.errores } });
      (datos.errores.nombre ? nombreRef : notaRef).current?.focus();
      return;
    }
    despachar({ tipo: 'enviando' });
    try {
      const r = await api.current.crearReserva({ servicioId, barberoId, fecha, inicio: estado.inicio, nombre: datos.nombre, nota: datos.nota });
      if (r.ok) {
        despachar({ tipo: 'confirmado', reserva: r.reserva });
        setAnuncio(t('confirmado.anuncio', { codigo: r.reserva.codigo }));
        await refrescarTurnos();
        return;
      }
      despachar({ tipo: 'envio-fallido', resultado: r });
      if (r.error === 'datos-invalidos' && r.campos) (r.campos.nombre ? nombreRef : notaRef).current?.focus();
      if (r.error === 'tope-alcanzado') requestAnimationFrame(() => avisoRef.current?.focus());
    } catch {
      despachar({ tipo: 'envio-interrumpido' });
      requestAnimationFrame(() => avisoRef.current?.focus());
    }
  }

  async function cancelar(codigo: string) {
    if (!api.current) return;
    const { ok } = await api.current.cancelarReserva(codigo);
    if (ok) setAnuncio(t('turnos.cancelado', { codigo }));
    await refrescarTurnos();
    // The freed slot may change the hours on screen: reload them
    setIntento((n) => n + 1);
  }

  const editar = (p: NombrePaso) => despachar({ tipo: 'editar', paso: p });

  if (!lista) {
    return (
      <div data-reserva data-lista="false" className="reserva">
        <p className="reserva-sinjs">{t('reserva.sinJs')}</p>
      </div>
    );
  }

  return (
    <div data-reserva data-lista="true" className="reserva">
      <div className="reserva-flujo">
        {paso === 'servicio' && (
          <Paso titulo={t('paso.servicio')} tituloRef={tituloPaso}>
            <OpcionesServicio estado={estado} onElegir={(id) => despachar({ tipo: 'elegir-servicio', servicioId: id })} />
          </Paso>
        )}
        {paso === 'barbero' && (
          <Paso titulo={t('paso.barbero')} tituloRef={tituloPaso}>
            <OpcionesBarbero estado={estado} onElegir={(id) => despachar({ tipo: 'elegir-barbero', barberoId: id })} />
          </Paso>
        )}
        {paso === 'dia' && (
          <Paso titulo={t('paso.dia')} tituloRef={tituloPaso}>
            <OpcionesDia estado={estado} dias={dias} onElegir={(f) => despachar({ tipo: 'elegir-dia', fecha: f })} />
          </Paso>
        )}
        {paso === 'hora' && (
          <Paso titulo={t('paso.hora')} tituloRef={tituloPaso}>
            <OpcionesHora
              estado={estado}
              siguienteDia={siguienteDia}
              onElegir={(inicio) => despachar({ tipo: 'elegir-hora', inicio })}
              onReintentar={() => setIntento((n) => n + 1)}
              onIrADia={(f) => despachar({ tipo: 'elegir-dia', fecha: f })}
            />
          </Paso>
        )}
        {paso === 'datos' && (
          <Paso titulo={t('paso.datos')} tituloRef={tituloPaso}>
            <FormularioDatos
              estado={estado}
              onEscribir={(campo, valor) => despachar({ tipo: 'escribir', campo, valor })}
              onEnviar={enviar}
              nombreRef={nombreRef}
              notaRef={notaRef}
              avisoRef={avisoRef}
            />
          </Paso>
        )}
        {paso === 'confirmado' && estado.reserva && <Confirmacion reserva={estado.reserva} onOtro={() => despachar({ tipo: 'reiniciar' })} />}
        <TusTurnos turnos={turnos} onCancelar={cancelar} />
      </div>
      <Ficha estado={estado} onEditar={editar} />
      <p className="sr-only" aria-live="polite">
        {anuncio}
      </p>
    </div>
  );
}
