---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/components/reserva/Reserva.tsx"]
---

# Inicio de Navaja del Puerto (página única con la reserva)

- **Modo:** Persuade; la isla de reserva sigue las reglas de Operate por dentro. Visitante: cliente de la barbería en el móvil (simulado) y quien evalúa a [A]nkordev (real). Acción: reservar un turno en menos de un minuto.
- **Contenido:** servicios con duración y precio de ejemplo, tres barberos ficticios, la reserva con la API simulada, horario con estado en vivo, zona en texto y aviso de concepto. Sin reseñas, valoraciones ni cifras.
- **Restricciones:** constitución (II 1.3.0: nada que recalcule el diseño; contenido visible sin JS; AA; reduced-motion = nada se mueve); spec §5 y §9; CSP solo `self`; fotos generadas con IA por el usuario.
- **Momento memorable:** la etiqueta del vinilo es tu turno: se rellena mientras eliges y se sella con el código.
- **Boceto elegido:** `.impeccable/mocks/decision/assigned.html` (primer viewport a 1440 px; fuera de git).

## Composición por sección (Taste, `.taste-skill/direction.json`, semilla 336732105)

Referencias de composición tomadas de la hoja «The name as a monument» de design-taste-frontend. Mandan el contrato de abajo y `DESIGN.md`; de Taste se toma la geometría, no su estilo (sus reglas de la casa no rigen aquí).

- **Hero:** foto metida en el nombre como si fuera una letra (Paul Kalkbrenner, `aww-paul-kalkbrenner`): el retrato ocupa el hueco entre «NAVAJA» y «PUERTO».
- **Servicios:** una sola palabra enorme («LADO A») que llena la columna y debajo las filas de la lista.
- **Barberos:** al abrir uno, su retrato hace de capitular de un párrafo corto (retrato como letra capital).
- **El ritual:** un verbo por pantalla, fijo en el centro mientras pasa su foto («TOALLA», «ESPUMA», «NAVAJA», «LOCIÓN»); los verbos leídos en orden son el título.
- **Horario:** el estado en vivo como tipografía de exposición en los colores invertidos («ABIERTO HASTA LAS 7»), con el horario completo en las esquinas.
- **Pie:** el nombre vuelve a todo el ancho en los colores invertidos y cierra la página como un corchete (recortado por abajo o por un lado, nunca por arriba).
- **Movimiento firma de Taste:** el nombre se reduce unos puntos con el scroll al salir del primer pantallazo (menos del 8 %).

## Enmienda del usuario (2026-11-21)

El usuario cambia la paleta y el primer pantallazo a partir de una referencia propia. Manda sobre el contrato de abajo donde choquen:
- **Paleta:** Charcoal Black `#1C1C1C`, Bone White `#EDE6D8` y Barber Red `#B3261E`, aplicada 1:1 (arena → hueso, bandas casi negras → carbón, naranja → rojo; texto hueso sobre el rojo). El rojo hereda la estrategia Committed del naranja.
- **Primer pantallazo:** hero carbón a sangre en cualquier ancho. Titular «Corte moderno, navaja de siempre», frase y botón rojo arriba a la izquierda; Leo recortado en duotono carbón → hueso delante de «NAVAJA», en Archivo al 125 % y de margen a margen, fundida en un resplandor rojo; la navaja grande y tenue de fondo; franja con tres servicios con icono y el estado en vivo. Sin valoraciones.
- **Se retiran** el rechazo del «hero partido» y del hero oscuro (sigue rechazado el dorado), la funda cuadrada con «NAVAJA / DEL / PUERTO» y la etiqueta «Tu turno» de adorno. Servicios pasa a su propia sección bajo el hero.
- El resto («Lado A», créditos, etiqueta del vinilo como ficha del turno, ritual, capítulo del horario, pie) se mantiene con la paleta nueva.

## Direction contract

THESIS: la barbería como un LP de salsa de los setenta. Los servicios son la lista de temas del «Lado A», con duración y precio; los barberos son los créditos; el turno reservado es la etiqueta del vinilo con su número de catálogo `NP-XXXX`. Rechaza el hero partido (titular, foto y botón) con tres tarjetas de servicios, y el oscuro con dorado de las barberías.

OWN-WORLD: cartón de funda arena en una sola escala tonal de arena a negro; campos enteros de naranja de funda (estrategia Committed: el naranja ocupa del 30 al 60 % de las vistas principales, nunca es un acento suelto); bandas casi negras de vinilo y contraportada. Fotos en blanco y negro de alto contraste, en duotono sobre el naranja (`multiply`). La etiqueta del disco, negra con agujero arena, es el único círculo de la página. La navaja grabada aparece una vez por vista. Archivo de ancho variable: extra condensada negra y apilada para el nombre y los titulares, ancho normal para el texto; cifras tabulares en horas, duraciones y precios. Esquinas rectas, sin sombras, filetes de 2 px de tinta entre temas.

STORY: el visitante ve una barbería de Puerto Cabello, lee los servicios con precio y duración como la lista de un disco, elige uno y arma su turno mientras la etiqueta se rellena a la vista. Cree que está hecha con oficio y que reservar es rápido.

FIRST VIEWPORT: barra negra con el nombre, Servicios · Barberos · Horario y «Reservar turno» en naranja. A la izquierda, la funda naranja casi a todo el alto con «NAVAJA / DEL / PUERTO» apilado en extra condensada negra (unos 300 px a 1440) y el retrato en duotono colándose entre las letras, delante de «DEL». A la derecha, «Lado A · Servicios», la frase que dice qué es, los cinco temas con filetes, duración tabular y precio; la fila activa se invierte a negro y su precio cede a «Reservar →» en naranja. Abajo a la derecha, la etiqueta «Tu turno NP-····» y el botón «Reservar turno». Aviso de concepto visible. En el móvil, la funda llena el primer pantallazo con el nombre apilado y el retrato; debajo, la lista y la acción; la etiqueta pasa a ser la barra fija del turno.

FORM: asignada por la tirada (candidato 7 de 7 de mi lista: carátulas de salsa) y elegida por el usuario el 2026-11-18 en la página de decisión, conservando lo que él fijó (arena, bandas oscuras y naranja; retrato entre las letras; lista como The Gentleman's Club). seed:77f664acd9f5521e. Mejoras tomadas de las descartadas: la navaja una vez por vista (revista), la fila de horas como piezas idénticas que reaccionan juntas (vúmetros), la hora de Puerto Cabello gobierna el estado (ciudad), una sola escala tonal (laboratorio) y cifras tabulares ancladas al momento (sección). Interacción firma: la etiqueta del vinilo es la ficha del turno; cada elección se escribe en su renglón y, al confirmar, gira un cuarto de vuelta y se sella con el código. Movimiento: letras del nombre en ola (`rotateX`), barrido `clip-path` del precio a «Reservar», tira de barberos con `transform` y `clip-path`, menú con desenfoque y entradas escalonadas.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
