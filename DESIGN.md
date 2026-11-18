---
name: Navaja del Puerto
description: Barbería ficticia de Puerto Cabello con reserva de demostración, presentada como un LP de salsa de los setenta.
colors:
  funda: "#f05a24"
  papel: "#f2e8d4"
  arena-clara: "#e6d8bd"
  arena: "#d6c3a0"
  arena-oscura: "#c2ab82"
  papel-suave: "#c9b896"
  tinta-suave: "#4a3d2f"
  vinilo: "#231c16"
  tinta: "#16120e"
typography:
  display:
    fontFamily: "Archivo Variable, Arial Narrow, Nimbus Sans Narrow, sans-serif"
    fontSize: "clamp(2.75rem, 1.6rem + 4.6vw, 5.75rem)"
    fontWeight: 900
    lineHeight: 0.82
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 62"
  title:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1.12rem + 0.55vw, 1.625rem)"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem)"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.5
  figures:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1.12rem + 0.55vw, 1.625rem)"
    fontWeight: 700
    fontFeature: "'tnum' 1"
rounded:
  none: "0"
  etiqueta: "50%"
spacing:
  margen: "clamp(1rem, 0.55rem + 1.8vw, 2rem)"
  hueco: "clamp(1.5rem, 1rem + 2vw, 2.5rem)"
  seccion: "clamp(4.5rem, 2.5rem + 8vw, 9rem)"
components:
  button-primary:
    backgroundColor: "{colors.funda}"
    textColor: "{colors.tinta}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    padding: "0 1.5rem"
    height: "3.25rem"
  button-primary-hover:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.funda}"
  button-primary-on-dark-hover:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.tinta}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.papel}"
    rounded: "{rounded.none}"
    padding: "0 1.25rem"
    height: "3rem"
  button-secondary-hover:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.tinta}"
  option:
    backgroundColor: "{colors.vinilo}"
    textColor: "{colors.papel}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1rem"
    height: "3.5rem"
  option-pressed:
    backgroundColor: "{colors.funda}"
    textColor: "{colors.tinta}"
  option-disabled:
    backgroundColor: "transparent"
    textColor: "{colors.papel-suave}"
  input:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.none}"
    padding: "0.7rem 0.85rem"
    height: "3rem"
  track-row:
    backgroundColor: "transparent"
    textColor: "{colors.tinta}"
    padding: "0.6rem 0.5rem"
  track-row-active:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.papel}"
  nav-bar:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.papel}"
    height: "4rem"
  record-label:
    backgroundColor: "{colors.funda}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.etiqueta}"
---

# Design System: Navaja del Puerto

## Overview

**Creative North Star: "Lado A"**

La barbería es un LP de salsa de los setenta. La página es la funda de cartón: un fondo arena, campos enteros de naranja de funda y bandas casi negras de vinilo y contraportada. Los servicios son la lista de temas del Lado A, con duración y precio alineados como en una contraportada; los barberos son los créditos; el turno reservado es la etiqueta del disco, que se rellena mientras eliges y se sella con su número de catálogo `NP-XXXX`.

El sistema es plano, cuadrado y tipográfico. La voz es una sola familia, Archivo con eje de anchura: extra condensada, negra y apilada para el nombre y los títulos; ancho normal para leer. La densidad es la de una contraportada: filas apretadas separadas por filetes de tinta de 2 px, cifras tabulares, márgenes cortos. Las fotos no flotan sobre la página: se imprimen en ella (`multiply` sobre el cartón o el papel) o, en el retrato de la portada, se recortan en duotono tinta y naranja para colarse entre las letras.

Se rechazan, de forma confirmada en el contrato de dirección, el hero partido (titular, foto y botón) con tres tarjetas de servicios y el oscuro con dorado de las barberías.

**Key Characteristics:**
- Una sola escala tonal de arena a negro más un naranja de funda que llena campos enteros (estrategia Committed).
- Archivo Variable al 62 % de anchura y peso 900 para lo monumental; ancho normal para el texto; cifras tabulares en horas, duraciones y precios.
- Esquinas rectas y superficies planas; el único círculo es la etiqueta del disco.
- Filetes de tinta de 2 px entre temas, días y filas.
- Una navaja grabada por vista, como único motivo.
- Movimiento con una sola curva y estados que se leen igual con movimiento reducido.

## Colors

Cartón de funda en una escala tonal de arena a negro, con un solo color saturado que nunca es un acento suelto.

### Primary
- **Naranja de funda** (`funda`): llena campos enteros, no detalles. Es la funda de la portada, el capítulo del horario, la etiqueta del disco y la barra fija del turno en el móvil, la acción principal y la opción elegida en la reserva. Sobre él siempre va `tinta` (5,50:1). Sobre las bandas oscuras sirve también como texto: el código del turno, los errores del formulario (5,50:1 sobre `tinta`, 4,96:1 sobre `vinilo`).

### Neutral
La escala, de claro a oscuro (el test exige que cada paso sea más oscuro que el anterior):
- **Papel** (`papel`): el paso más claro. Texto sobre las bandas oscuras, fondo de los campos de formulario y el blanco con el que se imprimen las fotos del ritual.
- **Arena clara** (`arena-clara`): un paso por encima del fondo, para filas activas y paneles sobre el cartón.
- **Arena** (`arena`): el fondo de la página, el cartón de la funda. También la tira de temas del pie y el agujero de la etiqueta.
- **Arena oscura** (`arena-oscura`): un paso por debajo del fondo. La franja del aviso de concepto.
- **Tinta suave** (`tinta-suave`): texto secundario sobre arena (descripciones de temas, notas).
- **Vinilo** (`vinilo`): superficies elevadas en tono dentro de las bandas oscuras: opciones de la reserva, turnos guardados, la cabeza del capítulo del ritual, el disco de la ficha.
- **Tinta** (`tinta`): la tinta del texto sobre arena y naranja, y el color de las bandas oscuras (cabecera, reserva, ritual, pie) y de la etiqueta de la portada.

Fuera de la escala:
- **Papel suave** (`papel-suave`): texto secundario sobre las bandas oscuras y bordes de controles en ellas.

### Pares de contraste garantizados
`tests/unit/tokens.test.ts` exige AA (4,5:1) para cada par que el sitio usa como texto sobre fondo:

| Texto | Fondo | Ratio |
|---|---|---|
| tinta | arena / arena-clara / arena-oscura | 10,80 / 13,24 / 8,38 |
| tinta-suave | arena / arena-clara | 6,09 / 7,46 |
| tinta | funda | 5,50 |
| papel | tinta / vinilo | 15,32 / 13,82 |
| papel-suave | tinta / vinilo | 9,57 / 8,63 |
| funda | tinta / vinilo | 5,50 / 4,96 |

Un par nuevo de texto sobre fondo entra en esa tabla y en el test antes de usarse.

### Named Rules
**The Committed Orange Rule.** El naranja ocupa del 30 al 60 % de las vistas principales como campo entero (funda, capítulo, etiqueta, barra). Nunca aparece como un acento suelto, un subrayado de color o un icono pintado.

**The One Scale Rule.** Todo neutro sale de la escala arena→negro. Ni blanco de pantalla ni negro puro: los blancos de las fotos se imprimen como `papel` o `arena` con `multiply`.

**The Roles Only Rule.** Los hex viven solo en `:root` de `src/styles/global.css`; los componentes usan los roles. El test falla si aparece un hex fuera de `:root`. Las dos copias aceptadas fuera del CSS (la `theme-color` de `Base.astro` y el duotono de `scripts/retrato-hero.sh`) repiten `tinta` y `funda` y se actualizan con ellos.

## Typography

**Display Font:** Archivo Variable, eje `wdth` al 62 % (con Arial Narrow, Nimbus Sans Narrow)
**Body Font:** Archivo Variable, anchura normal (con ui-sans-serif, system-ui)

**Character:** una sola familia con dos voces. La condensada negra y apilada es la tipografía de carátula: el nombre, los títulos, los verbos del ritual, el estado del horario y los códigos. La de anchura normal lee la lista de temas como una contraportada.

### Hierarchy
La escala tiene cinco pasos en `@theme`, fluidos de 390 a 1440 px salvo la nota:
- **Monumento** (`--text-monumento`, `clamp(5.5rem, 1rem + 19vw, 19rem)`): definido para el nombre como monumento. Hoy ningún componente lo consume: el nombre de la funda se mide con la anchura de la funda (`33.6cqi`) y el del pie a `13.4cqi`.
- **Display / Título** (900, `--text-titulo`, 0.82): títulos de sección con la clase `display` (mayúsculas, `-0.01em`). Las piezas monumentales usan tamaños propios del mismo registro: verbo del ritual `clamp(5rem, 1rem + 16vw, 16rem)`, estado del horario `clamp(3.5rem, 1rem + 10vw, 11rem)`, código de la confirmación `clamp(3.5rem, 2rem + 6vw, 6rem)`, nombres de barberos `clamp(2.5rem, 2rem + 2vw, 3.5rem)`, títulos de paso `clamp(2.25rem, 1.6rem + 2.4vw, 3.5rem)`.
- **Tema** (700, `--text-tema`, 1.2 a 1.3): nombres de temas, frases de entrada (30 a 44ch), el botón, los precios.
- **Cuerpo** (400, `--text-cuerpo`, 1.5): texto corrido y descripciones. `font-size-adjust: from-font` evita el salto mientras carga Archivo.
- **Nota** (600, `--text-nota`, `0.875rem`): aviso de concepto, notas de ficción, la etiqueta del turno, el pie legal.

### Named Rules
**The Two Widths Rule.** Una familia, dos anchuras: 62 % y 900 para lo que se mira, normal para lo que se lee. Nada intermedio, ninguna segunda familia.

**The Tracklist Figures Rule.** Horas, duraciones, precios, números de tema y códigos van con cifras tabulares (`.cifras`, `tnum`), para que se alineen como en una contraportada.

## Layout

Una sola columna en el móvil y una retícula de dos en escritorio. El ritmo lo marcan tres medidas: `--margen` para los márgenes laterales de toda la página, `--hueco` para el espacio entre columnas y créditos, y `--seccion` para el relleno vertical de cada capítulo. Dentro de los componentes, los espacios son fijos y pequeños (0.25 a 2.5rem), propios de una contraportada.

- **Portada:** a partir de 64rem, la funda cuadrada ocupa `min(58%, alto de la ventana)` y la lista del Lado A va a su derecha. Por debajo de 48rem, la funda llena el primer pantallazo bajo el aviso y la cabecera.
- **Créditos:** filas compactas con retrato de 7.5rem en el móvil; tres columnas desde 48rem.
- **Reserva:** desde 64rem, los pasos a la izquierda y el disco de la ficha a la derecha (`min(26rem, 38%)`), fijo con `sticky`. Por debajo, la ficha es una barra fija abajo y la página reserva 7rem de `scroll-padding` para que el foco no quede tapado.
- **Ritual:** un paso por pantalla (`100svh`), la foto a sangre y el verbo fijo con `sticky`.
- **Horario:** columnas 7/5 desde 64rem.
- Puntos de corte: 48rem y 64rem. Objetivos táctiles de 2.75rem o más.

## Elevation & Depth

El sistema es plano en reposo. No hay sombras de elevación: la profundidad la dan los pasos de la escala tonal (`vinilo` sobre `tinta`, `arena-clara` sobre `arena`) y las bandas que alternan cartón, naranja y negro. La única capa con desenfoque es el fondo del menú del móvil (`backdrop-filter: blur(10px)` sobre `tinta` al 35 %).

### Shadow Vocabulary
- **Surcos del disco** (`box-shadow: inset 0 0 0 1.75rem var(--vinilo), inset 0 0 0 calc(1.75rem + 2px) var(--tinta), inset 0 0 0 3.5rem var(--vinilo), inset 0 0 0 calc(3.5rem + 2px) var(--tinta)`): dibuja dos anillos de tinta alrededor de la etiqueta en el disco de la ficha. Es dibujo, no elevación, y es su único uso.

### Named Rules
**The Flat Sleeve Rule.** Nada se levanta en reposo ni al pasar el puntero. La única `box-shadow` del sistema son los surcos dibujados del disco.

## Shapes

Esquinas rectas en todo: botones, opciones, campos (`border-radius: 0` explícito), fotos, paneles. Los bordes son de 2 px: `tinta` como filetes sobre arena y naranja, `papel-suave` o `vinilo` en los controles de las bandas oscuras.

El único círculo es la etiqueta del disco (`50%`): la de la portada (negra con agujero arena) y la ficha del turno en escritorio (naranja dentro del disco de vinilo). El nombre del pie se recorta por abajo, nunca por arriba.

La navaja grabada (`Navaja.astro`, SVG decorativo con `aria-hidden`) es el motivo: cuerpo en la tinta de la superficie y líneas de grabado en el color del fondo. Aparece una vez por vista: en la línea de catálogo de la funda, bajo el título de los barberos, en el pie y, como máscara, marcando el paso en curso de la ficha.

### Named Rules
**The Only Circle Rule.** Ningún otro elemento es redondo. Ni avatares, ni puntos de estado, ni botones con píldora.

**The 2px Groove Rule.** Lo que se lista se separa con filetes de tinta de 2 px entre filas (temas, días). No se usan tarjetas para agrupar filas.

**The One Razor Rule.** Una navaja por vista, como mucho. No se convierte en icono de interfaz ni se repite como patrón.

## Components

### Buttons
Una sola forma de botón: cuadrado, plano, naranja con texto de tinta.
- **Shape:** esquinas rectas (0), alto mínimo 3.25rem, `padding-inline: 1.5rem`, 800 a `--text-tema`.
- **Primary:** `funda` con `tinta`. Al pasar el puntero se invierte a `tinta` con `funda`; dentro de la banda negra de la reserva pasa a `papel` con `tinta`, y deshabilitado (enviando) a `papel-suave` con cursor de progreso.
- **Secondary:** solo en las bandas oscuras: transparente con borde de 2 px de `papel` y texto `papel`; se rellena de `papel` al pasar el puntero.
- **Focus:** el anillo global, `outline: 3px solid currentColor` con 3 px de separación, que toma la tinta de la superficie y mantiene 3:1 sobre arena, naranja y negro.

### Opciones de la reserva
- **Style:** cada elección (servicio, barbero, día, hora) es un `<button>` con `aria-pressed`. Fondo `vinilo`, borde de 2 px del mismo tono, texto `papel`, alto mínimo 3.5rem.
- **State:** al pasar el puntero el borde pasa a `papel-suave`; elegida (`aria-pressed="true"`) se rellena de `funda` con texto `tinta`; ocupada (`disabled`) queda transparente con texto `papel-suave`. Al pulsar, `scale(0.98)`.
- Los días usan el número en la voz condensada (2.25rem) sobre el día y el mes en nota; las horas, una rejilla de piezas idénticas (`minmax(7.5rem, 1fr)`).

### Inputs / Fields
- **Style:** fondo `papel`, texto `tinta`, borde de 2 px de `papel-suave`, esquinas rectas, alto mínimo 3rem, nunca menos de 16 px de letra.
- **Focus:** el anillo global.
- **Error:** borde y contorno de 2 px en `funda`, mensaje en 700 y `funda` sobre la banda; el aviso general es un bloque `funda` con texto `tinta`.

### Navigation
Barra fija `tinta` de 4rem con el nombre en la voz condensada, Servicios · Barberos · Horario y «Reservar turno» en un bloque `funda`. En el móvil, la misma lista es un `popover` nativo bajo la barra (funciona sin JS), con la página detrás desenfocada; abre en 250 ms y cierra en 150 ms.

### Funda (portada)
Campo cuadrado `funda` medido con unidades de contenedor. El nombre «NAVAJA / DEL / PUERTO» apilado en la voz condensada; «del» más pequeño y a la derecha. El retrato en duotono recortado se pone delante de las letras. En escritorio con ratón, al pasar por un tema su foto entra con un barrido `clip-path` en la esquina libre, impresa con `multiply` sobre el naranja.

### Lado A (lista de temas)
Título «Lado A» en la voz condensada y la lista como `<ol>` con filetes de 2 px. Cada fila es un enlace entero (número, nombre, descripción, duración y precio tabulares). Activa (puntero o foco), la fila se invierte a `tinta` con `papel`, y «Reservar →» entra en un bloque `funda` sobre la duración y el precio con un barrido `clip-path` de 250 ms.

### Créditos (barberos)
Retrato 4:5 impreso con `multiply` sobre `arena`, nombre en la voz condensada, especialidad, días en 700 y un enlace subrayado de 2 px que lleva a la reserva con ese barbero. Con ratón, el crédito señalado se acerca (`scale(1.04)`) y los demás bajan a opacidad 0.5.

### Ritual
Cuatro pantallas, una por verbo (TOALLA, ESPUMA, NAVAJA, LOCIÓN). La foto cubre la pantalla, impresa con `multiply` sobre `papel`, y se asienta con el scroll (`scale(1.12)` a 1, solo con `animation-timeline: view()`). El verbo, en la voz condensada, va sobre una tira de `tinta` como una pegatina en la funda, para leerse sobre cualquier foto; el texto, en otro bloque de `tinta`.

### Capítulo del horario
Banda entera `funda` con el estado en vivo en exposición («Abierto hasta las 7», hora de Puerto Cabello) y la semana como lista con filetes de 2 px; el día de hoy se marca con algo más que color: la fila se invierte a la banda negra (`aria-current="date"`).

### Etiqueta del disco (ficha del turno)
La firma del sistema. En escritorio es un disco `vinilo` con los surcos dibujados y la etiqueta `funda` en el centro; cada elección se escribe en su renglón (barrido `clip-path` de 250 ms) y, al confirmar, el disco gira un cuarto de vuelta (500 ms) y el código se sella (500 ms tras 300 ms, de `scale(1.6)` y 8 px de desenfoque a nítido). En el móvil es una barra fija abajo en `funda`; el paso en curso va en `tinta` con texto `funda`, marcado con la navaja como máscara.

### Pie
Tira `arena` con los temas en una línea, el cuerpo en `tinta` con la navaja, el aviso de concepto y el enlace al portafolio, y el nombre a todo el ancho en `papel`, recortado por abajo.

### Movimiento

Una sola curva para todo: `--curva`, `cubic-bezier(0.22, 1, 0.36, 1)` (en Anime.js, `out(4)`). Duraciones afinadas en R09:
- **Ola del nombre:** cada letra gira sobre su línea base (`rotateX` de -95° a 0, sube 0.25em), 500 ms con escalonado de 18 ms; el retrato entra después (1100 ms, retraso de 420 ms).
- **Revelados escalonados:** las piezas de cada grupo suben 12 px y aparecen, 500 ms con escalonado de 40 ms, una vez, al entrar en pantalla.
- **Transiciones de estado en CSS:** fila del Lado A 200 ms y «Reservar →» 250 ms; muestra de la funda 400 ms al entrar y 350 ms al salir; catálogo 150 ms; menú 250/150 ms; créditos 250 ms con la vuelta del zoom a 350 ms; opciones 180 ms; paso nuevo 250 ms (8 px y 3 px de desenfoque). Lo que se cierra sale más rápido de lo que entra.
- **Movimiento reducido:** el módulo no arranca (la clase `motion` no se pone) y todas las animaciones y transiciones duran 0 s. Los estados cambian igual, al instante.
- **Sin JS o si el módulo no llega:** lo que se revela empieza oculto solo con la clase `motion`; a los 2.5 s el CSS lo muestra de todos modos. El contenido nunca depende de JS.

## Do's and Don'ts

### Do:
- **Do** usar los roles (`var(--funda)`, `var(--tinta)`…) y nunca un hex en un componente; un par nuevo de texto sobre fondo entra antes en `tokens.test.ts`.
- **Do** dar al naranja campos enteros (funda, capítulo, etiqueta, barra, botón), del 30 al 60 % de las vistas principales.
- **Do** separar filas con filetes de tinta de 2 px y alinear cifras con `.cifras`.
- **Do** imprimir las fotos sobre el fondo con `multiply` (`arena`, `papel` o `funda`), y producir el retrato de portada con `scripts/retrato-hero.sh` (duotono `tinta`→`funda` recortado).
- **Do** usar la forma única de botón y, para elegir, botones con `aria-pressed`.
- **Do** dejar el foco en el anillo global de `currentColor` (3 px, separación 3 px).
- **Do** animar solo propiedades que no recalculan el diseño (`transform`, `opacity`, `clip-path`, `filter`, color, fondo, borde) con `--curva`, y comprobar que todo se lee con movimiento reducido (constitución II).
- **Do** rotular la ficción: aviso de concepto visible, barberos, precios, horario y dirección marcados como ficticios.

### Don't:
- **Don't** animar `width`, `height`, `top`, `left`, `margin` ni nada que recalcule el diseño (constitución II).
- **Don't** escribir atributos `style=""` ni scripts o estilos en línea sin su hash: la CSP solo admite `self` y los hashes de los bloques conocidos, y `tests/e2e/seguridad.spec.ts` lo comprueba.
- **Don't** inventar prueba social: ni reseñas, ni estrellas, ni testimonios, ni cifras de clientes, tampoco dentro de la ficción.
- **Don't** redondear esquinas ni añadir otro círculo que no sea la etiqueta del disco.
- **Don't** levantar nada con sombras; la única `box-shadow` son los surcos dibujados del disco.
- **Don't** usar el naranja como acento suelto ni introducir un segundo color saturado, dorado incluido.
- **Don't** repetir la navaja más de una vez por vista ni usarla como icono de interfaz.
- **Don't** volver al hero partido (titular, foto y botón) con tres tarjetas de servicios, ni al oscuro con dorado de las barberías.
