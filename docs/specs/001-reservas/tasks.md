# Tareas 001 — Navaja del Puerto

> Una tarea a la vez. Marca `[x]` al terminar, ejecuta `npm test` y haz commit convencional.
> Es la tarea T29 del portafolio [A]nkordev. Objetivo: desplegada el **viernes 20 de noviembre de 2026**; el portafolio se lanza el 21.
> Si no da tiempo, se recortan en este orden: la sección del ritual (spec §4.6), el barrido de fotos en Servicios y «Compartir». Tests, accesibilidad y la reserva completa no se recortan.

## Fase 0 — Definición (18 nov)

- [x] R00 Carpeta propia, constitución (copia), `CLAUDE.md`, `PRODUCT.md`, spec, plan y tareas; dirección visual con impeccable (contrato en `.impeccable/surfaces/`); `imagenes.md` con los prompts para el usuario — *aprobada 2026-11-18: barbería ficticia «Navaja del Puerto» (Puerto Cabello), sin backend, React + Anime.js; dirección «Lado A» (LP de salsa de los setenta) asignada por la tirada de impeccable y elegida por el usuario, con las composiciones por sección de Taste; 13 imágenes a generar por el usuario*

**Hecho cuando:** el usuario aprueba la spec, el plan y la dirección, y tiene los prompts de las imágenes.

## Fase 1 — Base (18 nov)

- [x] R01 Proyecto Astro + React + Anime.js + Tailwind + TypeScript estricto con las dependencias del plan §2; Vitest, Playwright y `npm test` (puerto 4359); `wrangler.jsonc`, `_headers` y CSP con la isla; CI — *hecha 2026-11-18: todas las versiones del plan, 0 vulnerabilidades. La isla de prueba (`client:visible`) se pinta en el servidor con el aviso «necesita JavaScript» y al hidratarse marca `data-lista`. La CSP lleva los hashes de los dos scripts y el estilo en línea que Astro pone para hidratar (los de `astro-island` coinciden con los del portafolio); `seguridad.spec.ts` los recalcula del HTML servido y comprueba que la isla se hidrata sin violaciones. Tests de dependencias fijadas y de i18n. `@lhci/cli` se aplaza a R10 (plan §2)*
- [x] R02 Tokens de la dirección en `global.css` + test de contraste; fuentes; `Base.astro`; navaja SVG — *hecha 2026-11-18 (impeccable: craft floor antes, detector sin hallazgos después). 9 roles en una escala tonal de arena a negro más `--funda` (#f05a24, elegido por contraste: la tinta sobre él da 5,5:1); el test exige 12 pares en AA, que la escala baje de clara a oscura y ningún hex fuera de `:root`. Archivo variable (eje de ancho 62–125) precargada, `font-size-adjust: from-font` (modern-web-guidance) y clase `.display` extra condensada a 62 %. Foco con `currentColor` para tener 3:1 sobre arena, naranja y negro; selección, cursor y barra de desplazamiento en la paleta. Navaja de barbero abierta en SVG propio (hoja, espiga con muescas, mango en ángulo y grabado), decorativa*

**Hecho cuando:** `npm test` en verde con una isla de React hidratada bajo la CSP.

## Fase 2 — Lógica de reservas, tests primero (18–19 nov)

- [ ] R03 `tiempo.ts`, datos (`servicios`, `barberos`, `horario`) y `disponibilidad.ts` + `ocupacion-simulada.ts`, con sus tests primero
- [ ] R04 `validacion.ts`, `codigo.ts`, `ics.ts`, `almacen.ts` y `api-simulada.ts`, con sus tests primero
- [ ] R05 `estado.ts` (reducer del flujo), con sus tests primero

**Hecho cuando:** cada regla de la spec §5.2 tiene un test en verde.

## Fase 3 — Página y reserva (19 nov)

- [ ] R06 Página: cabecera con menú, hero, servicios, barberos, horario con estado en vivo, ubicación y pie, con los textos en `es.json`; e2e 1, 2 y 9
- [ ] R07 Isla de reserva: pasos, ficha de turno, confirmación con `.ics` y compartir, «Tus turnos» y cancelar; foco y anuncios; e2e 3–7 y axe con cada paso abierto

**Hecho cuando:** se reserva de punta a punta en móvil y escritorio, con teclado y sin JS se lee todo.

## Fase 4 — Movimiento (19–20 nov)

- [ ] R08 `animations.ts` con Anime.js: ola del hero, barridos de Servicios, tira de Barberos, menú con desenfoque, ficha que se escribe y entradas de sección; e2e 8 (reduced-motion)
- [ ] R09 Afinado con transitions-polish

## Fase 5 — Cierre y despliegue (20 nov)

- [ ] R10 Cierre visual: polish y critique de impeccable, detector, revisión de Taste a 390, 768 y 1440 px, `DESIGN.md`, axe y Lighthouse móvil
- [ ] R11 Despliegue: repo en GitHub (revisar el historial antes), Workers Builds y URL en vivo comprobada; e2e 10 contra producción
- [ ] R12 En el portafolio (T30): caso de estudio 003 con capturas reales y enlaces, ES y EN

**Al terminar cada fase:** parar y esperar revisión.
