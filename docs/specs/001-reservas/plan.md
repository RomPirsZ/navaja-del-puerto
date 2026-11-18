# Plan técnico 001 — Navaja del Puerto

> Cómo se construye lo definido en `spec.md`. Debe cumplir `docs/constitution.md`.
> Estado: **borrador** (2026-11-18), pendiente de aprobación del usuario.

---

## 1. Chequeo de constitución

| Principio | Cómo se cumple |
|---|---|
| I. Contenido primero | Astro genera HTML estático con servicios, barberos, horario y ubicación. La isla de reserva se pinta en el servidor con un aviso de «necesita JavaScript» y solo pasa a interactiva al hidratarse (§6). El estado oculto de las animaciones lo pone JS, nunca el CSS. |
| II. Movimiento con propósito | Anime.js anima `transform`, `opacity`, `clip-path` y filtros; nunca propiedades que recalculan el diseño. Sin WebGL. Con `prefers-reduced-motion` no se inicia nada (§7). |
| III. Accesibilidad | HTML semántico; la reserva usa controles nativos (botones de opción, `<fieldset>`, `<legend>`), mueve el foco al título de cada paso y anuncia los cambios con `aria-live`. Contraste AA medido por token. axe en móvil y escritorio. |
| IV. Rendimiento | Salida estática. React solo en la isla, que se carga al acercarse a la vista (`client:visible`). Anime.js por módulos. Fuentes y fotos servidas desde el sitio, fotos con `astro:assets` y diferidas salvo la del hero. |
| V. Seguridad | **No hay servidor**: la validación vive en la API simulada (`api-simulada.ts`), que hace de frontera y se prueba como si lo fuera. Sin secretos. Cabeceras del portafolio con CSP solo `self` (§10). Lo leído de `localStorage` se valida antes de usarlo. |
| VI. Testing | Vitest para toda la lógica (tiempo, disponibilidad, ocupación, validación, API simulada, estado del flujo, `.ics`, código y contraste) y Playwright + axe para los flujos (§11). Tests primero en la lógica. |
| VII. Simplicidad | **Excepción justificada:** React no es imprescindible para un flujo de varios pasos, pero el usuario lo pidió (2026-11-18) y el caso 003 es la muestra de React del portafolio. Se limita a la isla de reserva. Anime.js sustituye a GSAP y Lenis (no se añade scroll suave). Sin librería de fechas: `Intl.DateTimeFormat`. Sin librerías de formularios ni de estado: `useReducer`. |
| VIII. Spec antes que código | Esta spec, este plan y `tasks.md`. |
| IX. Bilingüe | Textos en `src/i18n/es.json` (solo español). |
| X. Privacidad | Solo nombre y nota, en ese navegador. Se borran al cancelar. Sin trackers ni peticiones a terceros. |

## 2. Stack

Mismas versiones fijadas que el portafolio cuando existen:

- `astro` 7.4.8, `@astrojs/react` 7.1.2, `react` y `react-dom` 19.3.1, `tailwindcss` 4.3.3 + `@tailwindcss/vite` 4.3.3.
- `animejs` 4.5.0 (MIT, publicada el 2026-06-22). La serie 5 está en beta: no se usa.
- **Fuente:** `@fontsource-variable/archivo` 5.3.0 (publicada el 2026-07-19), con los ejes de ancho (62–125) y peso: una sola familia para el nombre extra condensado y el texto (dirección «Lado A»).
- **Desarrollo:** `typescript` 6.0.3, `@astrojs/check` 0.9.12, `@types/react` y `@types/react-dom` 19.3.0, `vitest` 5.0.5, `@playwright/test` 1.64.1, `@axe-core/playwright` 4.14.0, `@lhci/cli` 0.16.1 y `wrangler` 4.156.1.
- **Fechas:** `Intl.DateTimeFormat` con la zona `America/Caracas` por su nombre IANA. modern-web-guidance recomienda Temporal, pero Safari no lo trae y su polyfill es una librería de fechas; se toma su modelo (fecha de calendario y hora de reloj por separado, nunca un desfase fijo) sin la dependencia.
- **Sin** Supabase, adaptador de servidor, GSAP, Lenis, librerías de fechas, de formularios, de estado ni Testing Library. Los componentes se prueban con e2e y la lógica con tests unitarios.
- `.npmrc` igual que el portafolio: sin scripts de instalación, `min-release-age=7` y solo el registro de npm. Todas las versiones de arriba tienen más de 7 días.

**Cambio 2026-11-18 (R01):** `@lhci/cli` 0.16.1 se publicó el 2026-11-11 a las 23:40 UTC y no cumple los 7 días hasta la noche del 18. En lugar de pedir otra excepción, se instala en R10 (Lighthouse), y hasta entonces la CI no tiene ese paso. Sin él, `npm audit` da 0 avisos, así que `scripts/audit.mjs` empieza sin excepciones.

## 3. Estructura

```
docs/constitution.md              (copia, solo lectura)
docs/specs/001-reservas/          spec.md, plan.md, tasks.md, imagenes.md (prompts)
PRODUCT.md · DESIGN.md (al terminar) · CLAUDE.md
public/_headers · wrangler.jsonc
src/
  assets/fotos/                   imágenes generadas con IA (+ créditos)
  assets/marcas/                  navaja grabada (SVG)
  components/                     Cabecera, Hero, Servicios, Barberos, Ritual, Horario, Pie (Astro)
  components/reserva/             Reserva.tsx y sus pasos, Ficha.tsx, TusTurnos.tsx (React)
  data/servicios.ts · barberos.ts · horario.ts
  i18n/es.json
  layouts/Base.astro
  lib/animations.ts               Anime.js: init/destroy, reduced-motion
  lib/reservas/
    tiempo.ts                     fecha y hora de America/Caracas con Intl
    disponibilidad.ts             huecos libres de un día (puro)
    ocupacion-simulada.ts         ocupación determinista por fecha y barbero
    validacion.ts                 entrada de una reserva
    codigo.ts                     NP-XXXX sin caracteres ambiguos
    ics.ts                        archivo de calendario
    almacen.ts                    localStorage validado (inyectable)
    api-simulada.ts               la «API»: disponibilidad, reservar, cancelar, mis turnos
    estado.ts                     reducer del flujo de pasos
  pages/index.astro
  styles/global.css               tokens (@theme)
tests/unit/  tests/e2e/
```

## 4. Datos

`servicios.ts`, `barberos.ts` y `horario.ts` son la única fuente de la spec §6 y §5.2. Los usan a la vez las secciones de Astro y la isla. Un test vigila su coherencia: cada servicio dura un múltiplo de 30, cada barbero hace al menos un servicio y trabaja al menos un día, y todo precio está rotulado como de ejemplo en `es.json`.

## 5. API simulada

Se comporta como un cliente de una API real, para que cambiarla por una de verdad solo toque este módulo:

```ts
obtenerDisponibilidad({ fecha, servicioId, barberoId | 'cualquiera' }): Promise<Hueco[]>
crearReserva(entrada): Promise<{ ok: true, reserva } | { ok: false, error: CodigoError, alternativas?: Hueco[] }>
cancelarReserva(codigo): Promise<{ ok: boolean }>
misReservas(): Promise<Reserva[]>
```

- **Latencia simulada** de 250 a 600 ms (0 en los tests), para que los estados de carga existan de verdad.
- **Validación completa** en `crearReserva` aunque la interfaz ya haya validado: servicio y barbero existentes y compatibles, fecha dentro de los 14 días, hueco libre en ese momento, nombre y nota dentro de sus límites, y tope de 2 turnos.
- **Errores** con códigos (`hueco-ocupado`, `fuera-de-horario`, `tope-alcanzado`, `datos-invalidos`), traducidos en `es.json`. `hueco-ocupado` devuelve las alternativas más cercanas.
- **Ocupación simulada:** un generador pseudoaleatorio con semilla (`fecha + barbero`) marca como ocupado alrededor del 40 % de los huecos. Es determinista: el mismo día da siempre la misma agenda, y los tests fijan sus resultados.
- **Almacén:** `localStorage` con versión y validación de cada registro (como `normalizar` en la tienda); si falla o está corrupto, se trabaja en memoria y se descarta lo inválido. Los tests inyectan un almacén en memoria y un reloj fijo.
- **Conflicto real entre pestañas:** antes de confirmar se vuelve a leer el almacén, de modo que un hueco reservado en otra pestaña da `hueco-ocupado`.

## 6. Isla de reserva (React)

- `Reserva.tsx` con `client:visible`. El estado del flujo vive en un `useReducer` cuyo reducer (`estado.ts`) es puro y tiene tests unitarios: elegir, cambiar un paso anterior sin perder lo compatible y limpiar lo que deja de serlo (por ejemplo, la hora al cambiar de barbero).
- **Sin JavaScript:** el primer render (servidor e hidratación) muestra el aviso «la reserva necesita JavaScript» y la ficha vacía; un efecto marca la isla como lista y entonces aparecen los controles. Así no hay desajuste de hidratación.
- **Preselección:** las filas de Servicios y la tira de Barberos llevan a `#reservar?servicio=…` / `barbero=…` mediante un evento del documento que la isla escucha, y por la URL si se entra directo. Sin JS siguen siendo enlaces a `#reservar`.
- **Accesibilidad:** cada paso es un `<fieldset>` con `<legend>` y botones de opción nativos con aspecto propio (los días y las horas son `radio` en rejilla, con flechas del teclado). Al avanzar, el foco va al título del paso. Una región `aria-live="polite"` anuncia «Cargando horas», «Quedan N horas» y los errores.
- **Ficha:** componente aparte que recibe el estado. En el móvil se convierte en barra fija abajo, sin tapar el foco (`scroll-padding-bottom`).
- **Calendario y compartir:** el `.ics` se genera en el cliente (`ics.ts`, con `TZID` de America/Caracas y la hora en UTC) y se descarga con un `Blob`. «Compartir» usa `navigator.share` si existe; si no, copia el resumen al portapapeles.

## 7. Movimiento (Anime.js 4)

`animations.ts` sigue el patrón de Molienda: `initAnimations()` al cargar la página, y nada si `prefers-reduced-motion` coincide. Lo que se va a revelar nace oculto con una clase puesta por un script mínimo en `<head>`, y si el módulo no llega en 2,5 s el CSS lo muestra igual.

- **Hero:** letras partidas con la utilidad de texto de Anime.js; cada una entra con `rotateX` y `translateY` escalonados en ola. El retrato sube y escala dentro de su máscara.
- **Servicios:** barrido con `clip-path: inset()` entre el precio y «Reservar» (hover y foco), y entre las fotos de muestra.
- **Barberos:** la miniatura activa crece con `scale` y se destapa con `clip-path`; las demás se apartan con `translateX`.
- **Menú del móvil:** `<dialog>` con `backdrop-filter: blur()` sobre la página.
- **Ficha:** cada renglón se escribe con un barrido corto; el código se «sella» con `scale` y `rotate`.
- **Secciones:** titular, texto y foto escalonados al entrar (una vez, con `onScroll` de Anime.js).
- Los valores finos (duraciones, curvas, escalonados) se ajustan en R09 con transitions-polish.

## 8. Tokens y tipografía

Dirección «Lado A» (contrato en `.impeccable/surfaces/src-pages-index-astro.md`). En R02 se escriben en `global.css` como variables expuestas con `@theme`. Ningún hex en los componentes. Roles: una escala tonal de arena a negro para fondos y bandas, `--funda` (naranja a campo entero), `--tinta` y `--papel` para el texto en bandas oscuras. Un test unitario mide el contraste AA de cada par texto/fondo usado, también el texto sobre la funda naranja y sobre las bandas oscuras. El duotono de las fotos se hace con `mix-blend-mode: multiply` sobre la funda, sin procesar las imágenes.

## 9. Imágenes

Las genera el usuario con IA a partir de los prompts de `docs/specs/001-reservas/imagenes.md` (se escriben en R00, en la paleta de la dirección):

- Retrato del hero (perfil, recortable para colarse entre las letras).
- Tres retratos de barberos.
- Cuatro o cinco fotos de servicios (corte, barba, afeitado con toalla caliente, corte infantil).
- Cuatro fotos del ritual de la navaja *(recortable)*.
- Un interior del local.

Se guardan en `src/assets/fotos/`, se acreditan en el pie como generadas con IA y llevan su procedencia incrustada (`impeccable embed-prompt`). Mientras no lleguen, se usan marcadores en la paleta con su relación de aspecto final.

## 10. Cabeceras y despliegue

- `public/_headers` como el de Molienda (CSP solo `self` más el hash de los scripts en línea que haga falta). La hidratación de islas de Astro necesita su script en línea: se resuelve como en el portafolio, que ya tiene una isla de React (`astro.config.mjs`, scripts y estilos como archivos), y un e2e vigila que la CSP coincida.
- `wrangler.jsonc` con recursos estáticos, sin código de servidor, `workers_dev` y sin URL de vista previa.
- Despliegue con Workers Builds desde un repo público de GitHub (memoria «workers-builds-connect-pitfalls»).

## 11. Testing

| Nivel | Qué |
|---|---|
| Estático | `astro check`, TypeScript estricto |
| Unitario | `tiempo`, `disponibilidad` (almuerzo, cierre, 60 min, hoy + 30 min, lunes, domingo), `ocupacion-simulada` (determinista), `validacion`, `codigo`, `ics`, `almacen` (corrupto, versión vieja), `api-simulada` (conflicto, tope, alternativas, cancelar), `estado` (reducer), coherencia de datos y contraste de tokens |
| E2E | 1) carga y aviso de concepto sin scroll · 2) sin JS se lee todo y la reserva lo explica · 3) reserva completa solo con teclado · 4) reserva completa en móvil táctil (390 px) · 5) hueco ocupado no elegible y conflicto entre pestañas · 6) tope de 2 y cancelar · 7) preselección desde Servicios y Barberos · 8) reduced-motion sin transformaciones en curso · 9) ninguna petición fuera del origen · 10) cabeceras y CSP |
| Accesibilidad | axe (WCAG 2.2 AA) en móvil y escritorio, también con cada paso abierto; falla con violaciones serias o críticas |

En los e2e el reloj del navegador se fija con `page.clock` **solo** en los tests de la reserva, nunca en los de animaciones (en Molienda congelaba el motor de animación). `npm test` = `vitest run && playwright test`, con el servidor en el puerto **4359**: ni el 4321 de `astro dev`, ni el 4329 del portafolio, ni el 4339 de Molienda, ni el 4349 de la tienda.

CI como la de Molienda: `astro check`, Vitest, build, Playwright, Lighthouse móvil con los umbrales de la constitución y `npm run audit`.
