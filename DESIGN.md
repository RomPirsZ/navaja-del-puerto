---
name: Navaja del Puerto
description: Barbería ficticia de Puerto Cabello con reserva de demostración, presentada como un LP de salsa de los setenta en carbón, hueso y rojo de barbero.
colors:
  rojo: "#b3261e"
  rojo-claro: "#f26b60"
  hueso-claro: "#f6f1e7"
  hueso: "#ede6d8"
  hueso-oscuro: "#dcd2bf"
  carbon-suave: "#524b43"
  carbon-alto: "#2a2826"
  carbon: "#1c1c1c"
  hueso-suave: "#b2aa9b"
typography:
  display:
    fontFamily: "Archivo Variable, Arial Narrow, Nimbus Sans Narrow, sans-serif"
    fontSize: "clamp(2.75rem, 1.6rem + 4.6vw, 5.75rem)"
    fontWeight: 900
    lineHeight: 0.82
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 62"
  headline-hero:
    fontFamily: "Archivo Variable, Arial Narrow, Nimbus Sans Narrow, sans-serif"
    fontSize: "clamp(2.5rem, 1.4rem + 3.2vw, 4.5rem)"
    fontWeight: 900
    lineHeight: 0.86
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 62"
  hero-word:
    fontFamily: "Archivo Variable, Arial Narrow, Nimbus Sans Narrow, sans-serif"
    fontSize: "calc((100cqi - 2 * var(--margen)) / 5.35)"
    fontWeight: 900
    lineHeight: 0.74
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 125"
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
    backgroundColor: "{colors.rojo}"
    textColor: "{colors.hueso}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    padding: "0 1.5rem"
    height: "3.25rem"
  button-primary-hover:
    backgroundColor: "{colors.carbon}"
    textColor: "{colors.hueso}"
  button-primary-on-dark-hover:
    backgroundColor: "{colors.hueso}"
    textColor: "{colors.carbon}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.hueso}"
    rounded: "{rounded.none}"
    padding: "0 1.25rem"
    height: "3rem"
  button-secondary-hover:
    backgroundColor: "{colors.hueso}"
    textColor: "{colors.carbon}"
  option:
    backgroundColor: "{colors.carbon-alto}"
    textColor: "{colors.hueso}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1rem"
    height: "3.5rem"
  option-pressed:
    backgroundColor: "{colors.rojo}"
    textColor: "{colors.hueso}"
  option-disabled:
    backgroundColor: "transparent"
    textColor: "{colors.hueso-suave}"
  input:
    backgroundColor: "{colors.hueso}"
    textColor: "{colors.carbon}"
    rounded: "{rounded.none}"
    padding: "0.7rem 0.85rem"
    height: "3rem"
  track-row:
    backgroundColor: "transparent"
    textColor: "{colors.carbon}"
    padding: "0.6rem 0.5rem"
  track-row-active:
    backgroundColor: "{colors.carbon}"
    textColor: "{colors.hueso}"
  nav-bar:
    backgroundColor: "{colors.carbon}"
    textColor: "{colors.hueso}"
    height: "4rem"
  hero:
    backgroundColor: "{colors.carbon}"
    textColor: "{colors.hueso}"
  record-label:
    backgroundColor: "{colors.rojo}"
    textColor: "{colors.hueso}"
    rounded: "{rounded.etiqueta}"
---

# Design System: Navaja del Puerto

## Overview

**Creative North Star: "Lado A"**

La barbería es un LP de salsa de los setenta, ahora impreso en carbón, hueso y rojo de barbero. La página es la funda: un fondo hueso, bandas enteras de carbón y campos de rojo que nunca son un acento suelto. Los servicios son la lista de temas del Lado A, con duración y precio alineados como en una contraportada; los barberos son los créditos; el turno reservado es la etiqueta del disco, que se rellena mientras eliges y se sella con su número de catálogo `NP-XXXX`.

El primer pantallazo es un escenario oscuro a sangre (enmienda del usuario del 2026-11-21, a partir de su propia referencia): titular, frase y botón rojo arriba a la izquierda; Leo, el barbero de la casa, recortado en duotono carbón→hueso delante de «NAVAJA», que va de margen a margen en la anchura más ancha de Archivo y se funde en un resplandor rojo; una franja al pie con tres servicios y el estado en vivo. Del hero hacia abajo, el sistema vuelve a ser plano, cuadrado y tipográfico: filas apretadas separadas por filetes de 2 px, cifras tabulares, márgenes cortos, fotos impresas sobre la página con `multiply`.

Sigue rechazado el dorado de las barberías: el oscuro de este sistema va con rojo.

**Key Characteristics:**
- Una sola escala tonal de hueso a carbón más un rojo de barbero que llena campos enteros (estrategia Committed); sobre el rojo siempre se escribe en hueso.
- Archivo Variable en tres anchuras: 62 % y 900 para los títulos, normal para leer y 125 % solo para la palabra del hero.
- Esquinas rectas y superficies planas; el único círculo es la etiqueta del disco.
- Filetes de 2 px entre temas, días y filas, en la tinta de la superficie.
- Una navaja grabada por vista, como único motivo.
- Movimiento con una sola curva y estados que se leen igual con movimiento reducido.

## Colors

Hueso y carbón en una sola escala tonal, con un único color saturado, el rojo de barbero, que siempre ocupa campos enteros.

### Primary
- **Rojo de barbero** (`rojo`): llena campos, no detalles. Es el resplandor del hero, el capítulo del horario, la etiqueta del disco y la barra fija del turno en el móvil, la acción principal, la opción elegida en la reserva, «Reservar →» en la lista y el aviso de error. Sobre él siempre va `hueso` (5,26:1): el carbón sobre el rojo da 2,61:1 y el test lo prohíbe. También es el borde de un campo inválido sobre su fondo hueso y el color de la selección de texto.
- **Rojo claro** (`rojo-claro`): el rojo cuando tiene que ser texto sobre carbón, donde el rojo de barbero se queda en 2,61:1. Código de la confirmación, mensajes de error de los campos, contorno de error y el paso en curso de la barra del turno.

### Neutral
La escala, de claro a oscuro (el test exige que cada paso sea más oscuro que el anterior):
- **Hueso claro** (`hueso-claro`): un paso por encima del fondo, para filas activas y paneles sobre el hueso.
- **Hueso** (`hueso`): el fondo de la página, el texto de todas las bandas carbón y del rojo, el fondo de los campos de formulario, la tira de temas del pie y el blanco con el que se imprimen las fotos del ritual y de los créditos.
- **Hueso oscuro** (`hueso-oscuro`): un paso por debajo del fondo. Sin uso desde R16, cuando la franja del aviso de concepto salió de lo alto de la página; se queda como paso de la escala.
- **Carbón suave** (`carbon-suave`): texto secundario sobre hueso (descripciones de temas, notas).
- **Carbón alto** (`carbon-alto`): superficies elevadas en tono dentro de las bandas carbón: opciones de la reserva, turnos guardados, la cabeza del capítulo del ritual, el disco de la ficha, el hueco de una foto pendiente.
- **Carbón** (`carbon`): la tinta del texto sobre hueso y el color del hero, la cabecera, la reserva, el ritual y el pie.

Fuera de la escala:
- **Hueso suave** (`hueso-suave`): texto secundario sobre carbón (frases de entrada, ayudas de campo, pie legal) y bordes de los controles en las bandas carbón. Sobre el resplandor rojo del hero no se usa: ahí baja a unos 3,5:1 y el texto va en `hueso`.

### Pares de contraste garantizados
`tests/unit/tokens.test.ts` exige AA (4,5:1) para cada par que el sitio usa como texto sobre fondo:

| Texto | Fondo | Ratio |
|---|---|---|
| carbon | hueso / hueso-claro / hueso-oscuro | 13,72 / 15,14 / 11,37 |
| carbon-suave | hueso / hueso-claro | 6,91 / 7,63 |
| rojo | hueso | 5,26 |
| hueso | rojo | 5,26 |
| hueso | carbon / carbon-alto | 13,72 / 11,83 |
| hueso-suave | carbon / carbon-alto | 7,40 / 6,38 |
| rojo-claro | carbon / carbon-alto | 5,72 / 4,93 |

El mismo test comprueba que el carbón sobre el rojo no llega a AA y que ningún bloque con fondo `rojo` pone el texto en `carbon` o `carbon-suave`. Un par nuevo de texto sobre fondo entra en esa tabla y en el test antes de usarse.

### Named Rules
**The Committed Red Rule.** El rojo ocupa campos enteros (resplandor del hero, capítulo del horario, etiqueta, barra del turno, botón, opción elegida). Nunca aparece como un acento suelto, un subrayado de color o un icono pintado.

**The Bone On Red Rule.** Sobre el rojo se escribe en hueso, siempre. Cuando el rojo es el texto y el fondo es carbón, se usa `rojo-claro`.

**The One Scale Rule.** Todo neutro sale de la escala hueso→carbón. Ni blanco de pantalla ni negro puro: los blancos de las fotos se imprimen como `hueso` con `multiply`.

**The Roles Only Rule.** Los hex viven solo en `:root` de `src/styles/global.css`; los componentes usan los roles. El test falla si aparece un hex fuera de `:root` o un rol de la paleta anterior. Las copias aceptadas fuera del CSS (la `theme-color` de `Base.astro` y el duotono de `scripts/retrato-hero.sh`) repiten `hueso` y `carbon` y se actualizan con ellos; el extremo oscuro del duotono es un carbón un paso por debajo de `carbon`, para que la camiseta negra de Leo se lea sobre el hero.

## Typography

**Display Font:** Archivo Variable, eje `wdth` al 62 % (con Arial Narrow, Nimbus Sans Narrow)
**Body Font:** Archivo Variable, anchura normal (con ui-sans-serif, system-ui)
**Hero Word:** Archivo Variable, eje `wdth` al 125 %

**Character:** una sola familia con tres anchuras. La condensada negra es la tipografía de carátula: titulares, títulos de sección, verbos del ritual, estado del horario y códigos. La de anchura normal lee la lista de temas como una contraportada. La ancha, al 125 %, existe para una sola palabra: «NAVAJA» en el hero.

### Hierarchy
La escala tiene cinco pasos en `@theme`, fluidos de 390 a 1440 px; las piezas monumentales y el hero usan tamaños propios del mismo registro, documentados aquí como parte del sistema:
- **Palabra del hero** (900, `wdth` 125, medida con el ancho del hero para ir de margen a margen, 0.74, `-0.02em`, mayúsculas): solo «NAVAJA», decorativa (`aria-hidden`).
- **Titular del hero** (900, `wdth` 62, `clamp(2.5rem, 1.4rem + 3.2vw, 4.5rem)`, 0.86): «Corte moderno, navaja de siempre» en dos líneas con la clase `display`. Va por debajo de `--text-titulo` a propósito, para que la palabra del hero sea la que manda.
- **Monumentales** (900, `wdth` 62): verbo del ritual `clamp(5rem, 1rem + 16vw, 16rem)`, estado del horario `clamp(3.5rem, 1rem + 10vw, 11rem)`, código de la confirmación `clamp(3.5rem, 2rem + 6vw, 6rem)`, nombre del pie a `13.4cqi` (todo el ancho), nombres de barberos `clamp(2.5rem, 2rem + 2vw, 3.5rem)`, títulos de paso de la reserva `clamp(2.25rem, 1.6rem + 2.4vw, 3.5rem)`. El token `--text-monumento` (`clamp(5.5rem, 1rem + 19vw, 19rem)`) está definido pero ningún componente lo consume.
- **Display / Título** (900, `--text-titulo`, 0.82): títulos de sección con la clase `display` (mayúsculas, `-0.01em`).
- **Tema** (700 a 800, `--text-tema`, 1.2 a 1.3): nombres de temas, frases de entrada (30 a 44ch), el botón, los precios, el estado en vivo de la franja del hero.
- **Cuerpo** (400, `--text-cuerpo`, 1.5): texto corrido, descripciones, la frase del hero (34ch). `font-size-adjust: from-font` evita el salto mientras carga Archivo.
- **Nota** (600, `--text-nota`, `0.875rem`): notas de ficción, la franja del hero, la etiqueta del turno, el pie legal.

### Named Rules
**The Three Widths Rule.** Una familia, tres anchuras con papel fijo: 62 % y 900 para lo que se mira, normal para lo que se lee, 125 % solo para la palabra del hero. Nada intermedio, ninguna segunda familia, y el 125 % no sale del hero.

**The Tracklist Figures Rule.** Horas, duraciones, precios, números de tema y códigos van con cifras tabulares (`.cifras`, `tnum`), para que se alineen como en una contraportada.

## Layout

Una sola columna en el móvil y una retícula de dos en escritorio. El ritmo lo marcan tres medidas: `--margen` para los márgenes laterales de toda la página, `--hueco` para el espacio entre columnas y créditos, y `--seccion` para el relleno vertical de cada capítulo. Dentro de los componentes, los espacios son fijos y pequeños (0.25 a 2.5rem), propios de una contraportada.

- **Hero:** a sangre en cualquier ancho, alto del primer pantallazo bajo la cabecera (`100svh − 4rem`; desde 48rem, al menos 34rem). Nada va antes de la cabecera: el aviso de concepto vive en el pie (R16). Es su propio contenedor: la palabra, la navaja de fondo y el resplandor se miden con su ancho. Tres filas: texto arriba a la izquierda, escenario y franja. En el móvil, Leo ocupa la fila del medio y sube un poco junto al botón; desde 48rem el escenario abarca todo el hero, Leo se levanta junto al titular (alrededor del 57 al 60 % del ancho), el texto se limita a `min(40rem, 54cqi)` y la franja va en una línea, servicios a la izquierda y estado a la derecha.
- **Servicios:** sección propia bajo el hero. Desde 64rem y solo con ratón (`hover: hover`), columnas 7/5 con un panel cuadrado de fotos fijo con `sticky` al lado de la lista.
- **Cabecera:** desde 48rem, nombre, enlaces centrados y acción en tres columnas.
- **Créditos:** filas compactas con retrato de 7.5rem en el móvil; tres columnas desde 48rem.
- **Reserva:** desde 64rem, los pasos a la izquierda y el disco de la ficha a la derecha (`min(26rem, 38%)`), fijo con `sticky`. Por debajo, la ficha es una barra fija abajo y la página reserva 7rem de `scroll-padding` para que el foco no quede tapado.
- **Ritual:** un paso por pantalla (`100svh`), la foto a sangre y el verbo fijo con `sticky`.
- **Horario:** columnas 7/5 desde 64rem.
- Puntos de corte: 48rem y 64rem. Objetivos táctiles de 2.75rem o más.

## Elevation & Depth

El sistema es plano en reposo. No hay sombras de elevación: la profundidad la dan los pasos de la escala tonal (`carbon-alto` sobre `carbon`, `hueso-claro` sobre `hueso`) y las bandas que alternan hueso, carbón y rojo. La única capa con desenfoque es el fondo del menú del móvil (`backdrop-filter: blur(10px)` sobre `carbon` al 35 %).

El hero es la excepción luminosa, decidida por el usuario a partir de su referencia: un resplandor rojo radial que sube desde el pie del escenario (dos degradados radiales de `rojo` mezclado con transparente sobre `carbon`) y máscaras de degradado que funden la palabra «NAVAJA» hacia abajo y los bordes del retrato de Leo en la oscuridad. Es luz de escena, no elevación, y no sale del hero.

### Shadow Vocabulary
- **Surcos del disco** (`box-shadow: inset 0 0 0 1.75rem var(--carbon-alto), inset 0 0 0 calc(1.75rem + 2px) var(--carbon), inset 0 0 0 3.5rem var(--carbon-alto), inset 0 0 0 calc(3.5rem + 2px) var(--carbon)`): dibuja dos anillos alrededor de la etiqueta en el disco de la ficha. Es dibujo, no elevación, y es su único uso.

### Named Rules
**The Flat Sleeve Rule.** Nada se levanta en reposo ni al pasar el puntero. La única `box-shadow` del sistema son los surcos dibujados del disco.

**The Stage Light Rule.** Los degradados son del hero y solo del hero: el resplandor rojo radial y las máscaras que funden la palabra y el retrato. Ninguna otra superficie lleva degradados.

## Shapes

Esquinas rectas en todo: botones, opciones, campos (`border-radius: 0` explícito), fotos, paneles. Los bordes son de 2 px: `carbon` como filetes sobre hueso, `hueso` como filetes sobre el rojo del horario, `hueso-suave` o `carbon-alto` en los controles de las bandas carbón.

El único círculo es la etiqueta del disco (`50%`): la ficha del turno en escritorio, roja dentro del disco de carbón alto. El nombre del pie se recorta por abajo, nunca por arriba.

La navaja es el motivo, una vez por vista. En el hero es una foto generada con IA por el usuario (Nano Banana, R19): una navaja abierta sobre negro cuya luz se convierte en el canal alfa de una imagen plana en `hueso` (`scripts/navaja-hero.sh`, `hero-navaja.webp`). Va arriba a la derecha, grande y tenue (opacidad 0,2, girada −8°), con `alt=""` y como mucho `min(54cqi, 70svh)` de ancho, para que nunca supere a Leo y se convierta en el LCP. En el resto de la página es la navaja grabada (`Navaja.astro`, SVG decorativo con `aria-hidden`): cuerpo en la tinta de la superficie y líneas de grabado en el color del fondo, bajo el título de los barberos, en el pie y, como máscara, marcando el paso en curso de la ficha.

En la franja del hero, tres pictogramas propios en SVG de trazo (tijeras, brocha y peine; 1.5rem, trazo 1.6 redondeado en `currentColor`) acompañan los tres servicios. Son de esa franja, no un juego de iconos de interfaz.

### Named Rules
**The Only Circle Rule.** Ningún otro elemento es redondo. Ni avatares, ni puntos de estado, ni botones con píldora.

**The 2px Groove Rule.** Lo que se lista se separa con filetes de 2 px en la tinta de la superficie entre filas (temas, días). No se usan tarjetas para agrupar filas.

**The One Razor Rule.** Una navaja por vista, como mucho: en el hero, la foto IA tratada en hueso; en el resto, la navaja grabada en SVG. No se convierte en icono de interfaz ni se repite como patrón.

## Components

### Buttons
Una sola forma de botón: cuadrado, plano, rojo con texto hueso.
- **Shape:** esquinas rectas (0), alto mínimo 3.25rem, `padding-inline: 1.5rem`, 800 a `--text-tema`.
- **Primary:** `rojo` con `hueso`. Al pasar el puntero sobre hueso pasa a `carbon` con `hueso`; sobre las superficies carbón (hero, reserva) pasa a `hueso` con `carbon`, y deshabilitado (enviando) a `hueso-suave` con cursor de progreso.
- **Secondary:** solo en las bandas carbón: transparente con borde de 2 px de `hueso` y texto `hueso`; se rellena de `hueso` al pasar el puntero.
- **Focus:** el anillo global, `outline: 3px solid currentColor` con 3 px de separación, que toma la tinta de la superficie y mantiene 3:1 sobre hueso, rojo y carbón.

### Opciones de la reserva
- **Style:** cada elección (servicio, barbero, día, hora) es un `<button>` con `aria-pressed`. Fondo `carbon-alto`, borde de 2 px del mismo tono, texto `hueso`, alto mínimo 3.5rem.
- **State:** al pasar el puntero el borde pasa a `hueso-suave`; elegida (`aria-pressed="true"`) se rellena de `rojo` con texto `hueso`; ocupada (`disabled`) queda transparente con texto `hueso-suave`. Al pulsar, `scale(0.98)`.
- Los días usan el número en la voz condensada (2.25rem) sobre el día y el mes en nota; las horas, una rejilla de piezas idénticas (`minmax(7.5rem, 1fr)`).

### Inputs / Fields
- **Style:** fondo `hueso`, texto `carbon`, borde de 2 px de `hueso-suave`, esquinas rectas, alto mínimo 3rem, nunca menos de 16 px de letra.
- **Focus:** el anillo global.
- **Error:** borde `rojo` sobre el campo y contorno de 2 px en `rojo-claro` hacia la banda; mensaje en 700 y `rojo-claro`. El aviso general es un bloque `rojo` con texto `hueso`.

### Navigation
Barra fija `carbon` de 4rem con el nombre en la voz condensada, Servicios · Barberos · Horario y «Reservar turno» en un bloque `rojo`. Desde 48rem los enlaces van centrados entre el nombre y la acción. En el móvil, la misma lista es un `popover` nativo bajo la barra (funciona sin JS), con la página detrás desenfocada; abre en 250 ms y cierra en 150 ms.

### Hero (primer pantallazo)
Escenario `carbon` a sangre. Arriba a la izquierda, el titular en la voz condensada, la frase en `hueso-suave` y el botón rojo. Detrás, la palabra «NAVAJA» en la anchura del 125 %, de margen a margen, fundida hacia abajo con `mask-image` en el resplandor rojo; delante, Leo recortado en duotono carbón→hueso (`scripts/retrato-hero.sh`), con las manos y el borde inferior disueltos por máscara. La navaja de la vista, una foto IA en hueso, grande y tenue, al fondo arriba a la derecha. Al pie, la franja en nota con los tres servicios y sus pictogramas y, si hay JS, el estado en vivo en `--text-tema` sobre «Hora de Puerto Cabello» (en `hueso`, nunca `hueso-suave`, por el resplandor). Con colores forzados, la palabra pasa a `GrayText`.

### Servicios (lista de temas)
Título «Servicios» en la voz condensada a `--text-titulo` (desde R17 ya no dice «Lado A»; los números A1…A5 de la lista se quedan), y la lista como `<ol>` con filetes de 2 px de `carbon`. Cada fila es un enlace entero (número, nombre, descripción, duración y precio tabulares). Activa (puntero o foco), la fila se invierte a `carbon` con `hueso`, y «Reservar →» entra en un bloque `rojo` con texto `hueso` sobre la duración y el precio con un barrido `clip-path` de 250 ms. Con ratón en ancho ≥ 64rem, el panel de al lado muestra la foto del primer tema, impresa con `multiply` sobre el hueso, y la del tema señalado entra con un barrido `clip-path`.

### Créditos (barberos)
Retrato 4:5 impreso con `multiply` sobre `hueso`, nombre en la voz condensada, especialidad, días en 700 y un enlace subrayado de 2 px que lleva a la reserva con ese barbero. Con ratón, el crédito señalado se acerca (`scale(1.04)`) y los demás bajan a opacidad 0.5.

### Ritual
Una cabeza de capítulo en `carbon-alto` y cuatro pantallas, una por verbo (TOALLA, ESPUMA, NAVAJA, LOCIÓN). La foto cubre la pantalla, impresa con `multiply` sobre `hueso`, y se asienta con el scroll (`scale(1.12)` a 1, solo con `animation-timeline: view()`). El verbo, en la voz condensada, va sobre una tira de `carbon` como una pegatina en la funda, para leerse sobre cualquier foto; el texto, en otro bloque de `carbon`.

### Capítulo del horario
Banda entera `rojo` con texto y filetes de 2 px en `hueso`. El estado en vivo en exposición («Abierto hasta las 7», hora de Puerto Cabello) y la semana como lista; el día de hoy se marca con algo más que color: la fila se invierte a la banda `carbon` (`aria-current="date"`).

### Etiqueta del disco (ficha del turno)
La firma del sistema. En escritorio es un disco `carbon-alto` con los surcos dibujados y la etiqueta `rojo` con texto `hueso` en el centro; cada elección se escribe en su renglón (barrido `clip-path` de 250 ms) y, al confirmar, el disco gira un cuarto de vuelta (500 ms) y el código se sella (500 ms tras 300 ms, de `scale(1.6)` y 8 px de desenfoque a nítido). En el móvil es una barra fija abajo en `rojo`; el paso en curso va en `carbon` con texto `rojo-claro`, marcado con la navaja como máscara.

### Pie
Banda `carbon` que abre con una tira `hueso` con los temas en una línea; luego la navaja en `hueso`, el aviso de concepto y el enlace al portafolio, y el nombre a todo el ancho en `hueso`, recortado por abajo.

### Movimiento

Una sola curva para todo: `--curva`, `cubic-bezier(0.22, 1, 0.36, 1)` (en Anime.js, `out(4)`).
- **Ola de «NAVAJA»:** cada letra gira sobre su línea base (`rotateX` de -95° a 0, sube 0.25em), 500 ms con escalonado de 18 ms; Leo entra después (sube un 6 % y baja de `scale(1.05)`, 1100 ms, retraso de 420 ms). El titular nunca se trocea.
- **Revelados escalonados:** las piezas de cada grupo suben 12 px y aparecen, 500 ms con escalonado de 40 ms, una vez, al entrar en pantalla.
- **Transiciones de estado en CSS:** fila del Lado A 200 ms y «Reservar →» 250 ms; panel de fotos de servicios 400 ms al entrar y 350 ms al salir; menú 250/150 ms; créditos 250 ms con la vuelta del zoom a 350 ms; opciones 180 ms; paso nuevo 250 ms (8 px y 3 px de desenfoque). Lo que se cierra sale más rápido de lo que entra.
- **Movimiento reducido:** el módulo no arranca (la clase `motion` no se pone) y todas las animaciones y transiciones duran 0 s. Los estados cambian igual, al instante.
- **Sin JS o si el módulo no llega:** lo que se revela empieza oculto solo con la clase `motion`; a los 2.5 s el CSS lo muestra de todos modos. El contenido nunca depende de JS.

## Do's and Don'ts

### Do:
- **Do** usar los roles (`var(--rojo)`, `var(--carbon)`…) y nunca un hex en un componente; un par nuevo de texto sobre fondo entra antes en `tokens.test.ts`.
- **Do** escribir en `hueso` sobre el rojo y usar `rojo-claro` cuando el rojo sea texto sobre carbón.
- **Do** dar al rojo campos enteros (resplandor del hero, capítulo, etiqueta, barra, botón, opción elegida).
- **Do** separar filas con filetes de 2 px en la tinta de la superficie y alinear cifras con `.cifras`.
- **Do** imprimir las fotos sobre el fondo con `multiply` (`hueso`), aclaradas desde sus originales con `scripts/aclarar-fotos.sh` (gamma 1,45 y negro al 10 %) para que no se empasten sobre el hueso, y producir el retrato del hero con `scripts/retrato-hero.sh` (duotono carbón→hueso recortado).
- **Do** usar la forma única de botón y, para elegir, botones con `aria-pressed`.
- **Do** dejar el foco en el anillo global de `currentColor` (3 px, separación 3 px).
- **Do** animar solo propiedades que no recalculan el diseño (`transform`, `opacity`, `clip-path`, `filter`, color, fondo, borde) con `--curva`, y comprobar que todo se lee con movimiento reducido (constitución II).
- **Do** rotular la ficción: aviso de concepto en el pie, la reserva rotulada como demo, y barberos, precios, horario y dirección marcados como ficticios.

### Don't:
- **Don't** escribir en carbón sobre el rojo (2,61:1).
- **Don't** animar `width`, `height`, `top`, `left`, `margin` ni nada que recalcule el diseño (constitución II).
- **Don't** escribir atributos `style=""` ni scripts o estilos en línea sin su hash: la CSP solo admite `self` y los hashes de los bloques conocidos, y `tests/e2e/seguridad.spec.ts` lo comprueba.
- **Don't** inventar prueba social: ni reseñas, ni estrellas, ni testimonios, ni cifras de clientes, tampoco dentro de la ficción.
- **Don't** redondear esquinas ni añadir otro círculo que no sea la etiqueta del disco.
- **Don't** levantar nada con sombras; la única `box-shadow` son los surcos dibujados del disco.
- **Don't** llevar degradados fuera del hero ni usar la anchura del 125 % fuera de su palabra.
- **Don't** usar el rojo como acento suelto ni introducir un segundo color saturado, dorado incluido.
- **Don't** repetir la navaja más de una vez por vista ni usarla como icono de interfaz.
