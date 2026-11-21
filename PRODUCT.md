# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro 7 con una isla de React 19 para la reserva y Anime.js 4 para el movimiento, con Tailwind CSS 4 y salida estática servida por Cloudflare Workers, como Molienda. **Sin backend:** no hay Supabase, base de datos ni endpoints. Lo que haría un servidor se simula en el navegador (plan §5). React y Anime.js los pidió el usuario el 2026-11-18. Versiones fijadas en el plan §2.

## Users

- **Visitantes del portafolio de [A]nkordev** (público real): dueños de negocios locales en Venezuela y clientes internacionales que llegan desde el caso de estudio 003 para juzgar si [A]nkordev sabe hacer una app web con estado, flujo de varios pasos y buen diseño. Llegan sobre todo desde el teléfono.
- **Cliente de la barbería dentro de la ficción** (público simulado): alguien de Puerto Cabello, con el móvil, que quiere cortarse el pelo o arreglarse la barba sin esperar turno en el local. Quiere elegir el servicio, el barbero y la hora en menos de un minuto, y saber cuánto cuesta y cuánto dura.

La app tiene que funcionar de verdad para el segundo público: así es como convence al primero.

## Product Purpose

**Navaja del Puerto** es una barbería **ficticia** de Puerto Cabello (Carabobo, Venezuela). Su web es el proyecto 003 del portafolio de [A]nkordev (spec 001 §8 del portafolio, tarea T29). Muestra cómo se resuelve una **app de reservas** para un negocio de servicios: elegir servicio, barbero, día y hora, ver al momento qué huecos quedan, confirmar y conservar el turno.

**Éxito:** un dueño de barbería, peluquería o consultorio que la prueba piensa «quiero esto para mi negocio», y un cliente técnico encuentra en el caso de estudio decisiones bien justificadas sobre estado, validación y accesibilidad.

## Positioning

Es una barbería de puerto: afeitado clásico con navaja y toalla caliente junto al corte moderno. En el local se espera turno, y aquí se llega a la hora exacta con el barbero elegido. La navaja y el puerto (la zona colonial y sus fachadas de colores) son lo que la distingue de una barbería genérica, y se sienten en el contenido y en la imagen.

## Operating Context

- Visitas desde el teléfono, a menudo con datos móviles limitados; también escritorio (clientes internacionales que evalúan).
- Una sola página: servicios con precio y duración, barberos, la reserva, horario y ubicación.
- Se llega desde el enlace «Ver sitio» del caso de estudio 003 en el portafolio.
- La hora que cuenta es la de Puerto Cabello (America/Caracas), esté donde esté el visitante.

## Capabilities and Constraints

- **Reserva completa de demostración:** servicio → barbero (o «el primero libre») → día → hora → datos mínimos → confirmación con código. Los huecos ocupados no se pueden elegir.
- **Sin servidor:** la disponibilidad, la confirmación y el código los produce un módulo que simula la API en el navegador, con su misma forma, latencia y errores. Los turnos se guardan solo en ese navegador. **Se rotula** que es una demo y que no se envía nada a ninguna parte.
- **Datos mínimos:** nombre y, como mucho, un teléfono de ejemplo que nunca sale del navegador (constitución X). Sin cuentas ni contraseñas.
- **Precios, horario, barberos y dirección ficticios** y marcados como tales. Dirección solo en texto, sin número ni mapa embebido, para que no coincida con un local real.
- **Sin WhatsApp ni teléfono de la barbería:** no hay número real al que enviar nada. El turno se conserva con un archivo de calendario o al compartirlo o copiarlo.
- **Sin JavaScript** se leen los servicios, los precios, los barberos, el horario y la ubicación, y un aviso dice que la reserva de demostración necesita JavaScript (constitución I).
- **Solo en español.**
- **Despliegue:** Cloudflare Workers, recursos estáticos, sin secretos. Sin dominio propio.
- Rigen `docs/constitution.md` (copia de la del portafolio) y la spec propia en `docs/specs/001-reservas/`.

## Brand Commitments

- **Nombre:** «Navaja del Puerto», elegido el 2026-11-18. Una búsqueda web no encontró ninguna barbería real con ese nombre.
- **Aviso de concepto en el pie:** el sitio dice que es un concepto de portafolio de [A]nkordev, que la barbería no existe y que la reserva es una demo. Desde el 2026-11-21, por decisión del usuario, ese aviso va solo en el pie, con el enlace al portafolio; la sección de la reserva sigue diciendo que es una demo.
- **Referencias del usuario** (principios, no copia; spec §2): «The Gentleman's Club» y «Buzzcuts» para la imagen, y los vídeos de Shopify Supply, Swap y Contra/Shora para el movimiento. Están en `referencias/`, fuera de git.

## Evidence on Hand

- No hay fotos propias, ni clientes, reseñas, valoraciones, cifras, premios ni prensa. **No se inventan**, ni siquiera dentro de la ficción: nada de «+500 clientes», estrellas ni testimonios.
- Las fotos (retratos, cortes, local) las **genera el usuario con IA** y se acreditan como tales. Ninguna se presenta como un cliente, un barbero o un local real.
- Puerto Cabello, su zona colonial y su paseo marítimo son reales. La barbería, sus barberos y su dirección son ficticios y van rotulados.

## Product Principles

1. **Reservar en menos de un minuto.** Del primer vistazo al turno confirmado, sin cuentas ni pasos de más, con el pulgar.
2. **Lo que cuesta y lo que dura, siempre a la vista.** Precio y duración acompañan a cada servicio y al resumen del turno.
3. **Honesto con la ficción.** La demo se declara: nada de reseñas, cifras ni envíos que finjan ser reales.
4. **Una app, no un formulario.** Estado claro en cada paso, errores que dicen qué hacer y un turno que se puede recuperar o cancelar.
5. **El movimiento acompaña, no retrasa.** Todo se lee y se reserva igual con movimiento reducido.

## Accessibility & Inclusion

WCAG 2.2 AA (constitución III): contraste AA, teclado completo en todo el flujo de reserva, foco visible y gestionado entre pasos, anuncios con `aria-live` cuando cambian los huecos o falla algo, objetivos táctiles de 44 px o más, texto alternativo en todas las fotos y cero violaciones serias de axe. Sin animaciones con `prefers-reduced-motion`. Lighthouse móvil ≥ 90 en rendimiento y ≥ 95 en el resto (constitución IV).
