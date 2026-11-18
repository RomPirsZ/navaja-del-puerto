# Spec 001 — Navaja del Puerto (app de reservas de una barbería ficticia)

> Qué se construye y por qué. Los detalles técnicos están en `plan.md`. Rige `docs/constitution.md`.
> Proyecto 003 del portafolio [A]nkordev (spec 001 §8 del portafolio, tarea T29).
> Estado: **borrador** (2026-11-18), pendiente de aprobación del usuario.

---

## 1. Objetivo

Una página única para **Navaja del Puerto**, una barbería **ficticia** de Puerto Cabello (Carabobo, Venezuela). Su centro es una **app de reservas**: elegir servicio, barbero, día y hora, ver qué huecos quedan, confirmar y conservar o cancelar el turno.

Es una pieza de portafolio. Tiene que funcionar de verdad para el cliente de la barbería (el público simulado), porque así convence a quien evalúa a [A]nkordev (el público real). Ver `PRODUCT.md`.

**Sin backend** (decisión del usuario, 2026-11-18): lo que haría un servidor (disponibilidad, confirmación, código del turno) lo hace un módulo que simula la API en el navegador. La demo se rotula.

**Éxito:** desde el teléfono se reserva un turno en menos de un minuto y sin dudas. Un dueño de negocio de servicios que lo prueba piensa «quiero esto».

## 2. Referencias (principios, no copia)

Aportadas por el usuario el 2026-11-18 en `referencias/` (fuera de git).

| Referencia | Qué tomamos | Qué no tomamos |
|---|---|---|
| «The Gentleman's Club» (imagen) | Titular enorme en una grotesca estrecha y alta, con el retrato **delante** de las letras para dar profundidad. Servicios en lista: nombre a la izquierda, precio a la derecha y líneas finas entre filas. Al pasar por una fila, el precio se convierte en un botón «Reservar →» de color. | Su nombre, su paleta verde pizarra y la persona del retrato. |
| «Buzzcuts» (imagen) | Fondo arena cálido con bandas casi negras y acento naranja. Composición editorial con fotos recortadas sobre bloques de color. Herramientas del oficio grabadas como ilustración. Cinta de servicios en el pie. | Los testimonios, «68 cities» y cualquier cifra; la tienda de productos; sus textos y su logo. |
| Shopify Supply (vídeo) | Palabra gigante cuyas letras giran en ola al entrar, con fotos apiladas entre ellas que se barajan. En el menú, las imágenes se sustituyen con un barrido. | Su marca, su cursiva y su catálogo. |
| Swap (vídeo) | Frase con pequeñas imágenes y un interruptor metidos entre las palabras. Palabra grande dentro de una tarjeta oscura que crece con el scroll. Al abrir el menú, la página de detrás se desenfoca. | Su serif, su verde y su contenido de comercio electrónico. |
| Contra / Shora (vídeo) | Tira de miniaturas en la que la que se señala se abre con su etiqueta. Botón con icono metido entre dos palabras. | La rejilla de logos de clientes, los contadores sin respaldo y su retrato. |

Todo el movimiento de las referencias se reproduce con propiedades que admite la constitución II (1.3.0). La tira de Shora se abre con `transform` y `clip-path`, nunca con `width`.

## 3. Historias de usuario

1. **Como cliente, con el móvil**, quiero ver los servicios con su precio y su duración para elegir.
2. **Como cliente**, quiero elegir barbero, o aceptar el primero libre, y ver solo las horas en que de verdad se puede.
3. **Como cliente**, quiero confirmar con lo mínimo (mi nombre) y quedarme con un comprobante: código, resumen y un archivo para mi calendario.
4. **Como cliente**, quiero volver más tarde, ver mi turno y cancelarlo si no puedo ir.
5. **Como cliente**, quiero saber el horario, si está abierto ahora y dónde queda.
6. **Como dueño de un negocio que evalúa a [A]nkordev**, quiero probar una reserva que se sienta como una app real y rápida, y saber que es un concepto.
7. **Como visitante que usa teclado, lector de pantalla, movimiento reducido o no tiene JavaScript**, quiero leer todo, y reservar con teclado y lector de pantalla.

## 4. Página (una sola, en español)

1. **Cabecera:** logotipo, enlaces a Servicios, Barberos y Horario, y la acción «Reservar turno». En el móvil, menú accesible que desenfoca la página de detrás.
2. **Hero:** «Navaja del Puerto» como monumento, a todo el ancho, con un retrato que se cuela entre las letras. Debajo, una frase que dice qué es: barbería en Puerto Cabello y reserva del turno a la hora exacta. Acción «Reservar turno» y aviso de concepto visibles sin hacer scroll.
3. **Servicios:** lista con nombre, una línea de descripción, duración y precio. Al pasar por una fila (o al enfocarla), el precio cede el sitio a «Reservar». Pulsarla abre la reserva con ese servicio ya elegido.
4. **Barberos:** tira de retratos. El elegido se abre con su nombre, su especialidad y los días que trabaja, y lleva a la reserva con él ya elegido.
5. **Reservar:** la app (§5). Los precios y los barberos son ficticios, y la sección lo dice.
6. **El afeitado de navaja** *(recortable)*: el ritual en cuatro pantallas a sangre, una por verbo («Toalla», «Espuma», «Navaja», «Loción»), con su foto y una frase.
7. **Horario y ubicación:** el estado en vivo como titular en los colores invertidos («Abierto hasta las 7»), el horario de la semana y la zona en texto: zona colonial de Puerto Cabello, cerca del paseo marítimo, sin número ni mapa.
8. **Pie:** «Concepto de [A]nkordev: Navaja del Puerto no existe y la reserva es una demo», con enlace al portafolio, el crédito de las imágenes generadas con IA y el año. Cinta de servicios como en Buzzcuts.

## 5. La reserva

### 5.1 Pasos

1. **Servicio.** Uno por turno.
2. **Barbero**, o «El primero libre». Solo se ofrecen los que hacen ese servicio.
3. **Día:** los próximos 14 días, empezando hoy. Los días cerrados se ven apagados y no se eligen.
4. **Hora:** solo los huecos libres. Si no queda ninguno, se dice y se propone el siguiente día con hueco.
5. **Datos:** nombre (obligatorio, de 2 a 60 caracteres) y una nota opcional para el barbero (hasta 140 caracteres). Nada más.
6. **Confirmación:** código del turno (`NP-` y 4 caracteres sin ambigüedades) y resumen (servicio, barbero, día, hora, duración, precio y zona). Desde aquí se puede añadir al calendario (`.ics`), compartir o copiar el resumen, y reservar otro turno.

**La ficha de turno** (la idea de la página): a medida que se elige, una ficha impresa se va rellenando a la vista con servicio, barbero, día, hora y total. En el móvil se resume en una barra fija abajo, con el botón para seguir. Cada paso se puede volver a abrir desde la ficha para cambiarlo sin perder lo demás.

### 5.2 Reglas (las comprueba la API simulada, como lo haría un servidor)

- **Hora de Puerto Cabello** (America/Caracas) para todo, esté donde esté el visitante.
- **Horario:** de martes a sábado, de 9:00 a 12:00 y de 13:00 a 19:00. Domingo, de 9:00 a 13:00. Lunes, cerrado.
- **Huecos de 30 minutos.** Un servicio de 60 minutos necesita dos huecos seguidos del mismo barbero, sin cruzar el almuerzo ni el cierre.
- **Hoy:** solo huecos que empiecen dentro de 30 minutos o más.
- **Barberos:** cada uno tiene sus días y sus servicios (§6). «El primero libre» muestra la unión de huecos y, al confirmar, asigna al barbero libre con menos turnos ese día; si empatan, el primero de la lista.
- **Ocupación simulada:** parte de los huecos aparecen ocupados de forma determinista (la misma fecha y el mismo barbero dan siempre lo mismo), para que la agenda parezca viva. Los turnos que reserva el visitante también ocupan su hueco.
- **Conflicto:** si al confirmar el hueco ya no está libre (por ejemplo, reservado en otra pestaña), no se confirma: se avisa y se ofrecen las horas libres más cercanas.
- **Tope:** como mucho 2 turnos pendientes por navegador. Al tercero se explica por qué no y se ofrece ver o cancelar los que hay.
- **Validación:** toda entrada se revisa en la API simulada aunque la interfaz ya la haya revisado (constitución V). Los errores dicen qué pasó y qué hacer, sin detalles técnicos.

### 5.3 Tu turno

- Los turnos pendientes de ese navegador se ven en «Tus turnos», con su código y la opción de **cancelar** (con confirmación), que libera el hueco.
- Los turnos pasados desaparecen solos.
- Si lo guardado está corrupto o es de otra versión, se descarta sin romper la página.

### 5.4 Sin JavaScript

Se leen los servicios, los barberos, el horario y la ubicación. En la sección de reserva, un aviso dice que la reserva de demostración necesita JavaScript. No hay número ni enlace de WhatsApp: la barbería no existe.

## 6. Contenido (ficticio, se rotula)

**Servicios (precios de ejemplo, en dólares):**

| Servicio | Duración | Precio |
|---|---|---|
| Corte clásico | 30 min | $8 |
| Corte y barba | 60 min | $12 |
| Arreglo de barba | 30 min | $6 |
| Afeitado con navaja y toalla caliente | 30 min | $7 |
| Corte infantil (hasta 12 años) | 30 min | $6 |

**Barberos (ficticios):**

| Barbero | Especialidad | Días | Servicios |
|---|---|---|---|
| Ramón | Afeitado clásico con navaja, el veterano de la casa | Martes a sábado | Todos menos el infantil |
| Leo | Degradados y diseño | Martes a domingo | Corte clásico, corte y barba, arreglo de barba |
| Jesús | Cortes clásicos e infantiles | Miércoles a domingo | Corte clásico, arreglo de barba, corte infantil |

Los nombres, las descripciones y las fotos se pueden ajustar en R00. Las fotos de los barberos son retratos generados con IA y se acreditan como tales.

## 7. Identidad visual

**Decisiones del usuario (2026-11-18):** fondo **arena** cálido con **bandas casi negras** y **acento naranja**, como en Buzzcuts. Fotos generadas con IA por el usuario.

**Dirección elegida el 2026-11-18 en la ronda de impeccable: «Lado A».** La barbería se presenta como un LP de salsa de los setenta:
- Los servicios son la lista de temas del «Lado A», con duración y precio.
- Los barberos son los créditos.
- El turno es la etiqueta del vinilo, con su número de catálogo `NP-XXXX`.
- Funda naranja a campo entero, cartón arena y bandas casi negras. Fotos en blanco y negro puestas en duotono sobre el naranja.
- **Tipografía:** Archivo de ancho variable. Extra condensada negra y apilada para el nombre y los titulares; ancho normal para el texto; cifras tabulares en horas, duraciones y precios. Distinta de la Sofia Sans Extra Condensed de Molienda.
- **Motivo único:** la navaja grabada, una vez por vista. La etiqueta del disco es el único círculo de la página.
- Esquinas rectas, sin sombras y filetes de 2 px entre temas.

El contrato completo (con las composiciones por sección que aportó Taste) está en `.impeccable/surfaces/src-pages-index-astro.md`, y el sistema se documenta en `DESIGN.md` al terminar.

## 8. Movimiento (Anime.js)

- **Hero:** las letras de «Navaja del Puerto» entran girando en ola, y el retrato entra entre ellas (Shopify Supply).
- **Servicios:** el precio cede el sitio a «Reservar» con un barrido `clip-path`, y la foto de muestra se cambia con el mismo barrido.
- **Barberos:** la miniatura elegida se abre con `transform` y `clip-path` (Shora).
- **Menú del móvil:** la página de detrás se desenfoca (Swap).
- **La ficha de turno:** cada dato se escribe en su renglón al elegirlo, y el código final se «sella».
- **Secciones:** el titular, el texto y la foto entran escalonados una vez, al aparecer.
- Solo propiedades que no recalculan el diseño (constitución II, 1.3.0). Con `prefers-reduced-motion` no hay animaciones, y sin JS todo se ve en su sitio.

## 9. Restricciones

- **Sin backend**, sin base de datos, sin cuentas y sin envíos: nada sale del navegador. La demo lo dice cerca del botón de confirmar y en la confirmación.
- **Sin WhatsApp ni teléfono** de la barbería.
- **Honestidad:** sin reseñas, valoraciones, premios ni cifras, ni siquiera ficticias. Lo ficticio se rotula.
- **Privacidad (constitución X):** solo el nombre y la nota, guardados en ese navegador y borrables al cancelar. Sin trackers.
- **Fotos:** generadas con IA por el usuario, alojadas en el propio sitio y acreditadas; nunca se presentan como clientes, barberos o locales reales.
- **Despliegue:** Cloudflare Workers con recursos estáticos y las cabeceras del portafolio (CSP solo `self`). Sin dominio propio.

## 10. Fuera de alcance

Backend real, pagos, cuentas, recordatorios por SMS, WhatsApp o email, panel del barbero, inglés, varias páginas, mapa embebido y dominio propio.

## 11. Criterios de aceptación

- [ ] Desde el teléfono se completa una reserva en menos de un minuto, y la ficha refleja cada elección.
- [ ] Nunca se puede elegir un hueco ocupado, pasado, en día cerrado, en el almuerzo o que cruce el cierre; un servicio de 60 minutos solo se ofrece con dos huecos seguidos.
- [ ] El conflicto al confirmar y el tope de 2 turnos se explican y ofrecen una salida.
- [ ] El turno se recupera al volver a la página y se puede cancelar.
- [ ] El `.ics` abre en un calendario con la hora de Puerto Cabello.
- [ ] Todo el contenido se lee sin JavaScript, y la sección de reserva dice por qué no funciona.
- [ ] Con movimiento reducido no hay animaciones.
- [ ] Teclado completo en todo el flujo, foco gestionado entre pasos, cambios anunciados y cero violaciones serias o críticas de axe en móvil y escritorio.
- [ ] Contraste AA en todos los textos, también sobre las fotos.
- [ ] Lighthouse móvil ≥ 90 en rendimiento y ≥ 95 en accesibilidad, buenas prácticas y SEO.
- [ ] El aviso de concepto se ve sin hacer scroll, y precios y barberos están rotulados como ficticios.
- [ ] Ninguna petición a terceros: fuentes, fotos y scripts servidos desde el propio sitio.
