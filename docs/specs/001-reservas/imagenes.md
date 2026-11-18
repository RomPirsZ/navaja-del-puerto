# Imágenes de Navaja del Puerto (prompts para generarlas con IA)

> Las genera el usuario con IA (spec §9, plan §9) y se acreditan en el pie como generadas con IA.
> Ninguna se presenta como un cliente, un barbero o un local real: las personas son ficticias.
> Los prompts van en inglés porque los generadores responden mejor así; la descripción, en español.

## Tratamiento común (dirección «Lado A»)

Todas en **blanco y negro de alto contraste, sobre fondo blanco o muy claro y liso**. En la página se ponen en duotono sobre el naranja de la funda con `mix-blend-mode: multiply`: el blanco se vuelve naranja y el negro se queda negro. Por eso el fondo tiene que ser claro y limpio, sin degradados ni viñetas.

Añade siempre al final del prompt:

```
black and white photograph, high contrast, deep blacks, clean plain white background, soft studio key light from the left, sharp focus, film grain, no text, no logos, no watermark, fictional person who does not resemble any real person
```

Entrega cada imagen en JPG o PNG al tamaño indicado (o mayor, con la misma proporción) y con el nombre de archivo de la tabla. Van a `src/assets/fotos/`.

## Lista

| Archivo | Proporción y tamaño | Qué es | Dónde va |
|---|---|---|---|
| `hero-retrato.jpg` | 4:5 · 1600×2000 | Hombre de perfil con barba | Hero, entre las letras del nombre |
| `barbero-ramon.jpg` | 4:5 · 1200×1500 | Ramón, el veterano de la navaja | Barberos |
| `barbero-leo.jpg` | 4:5 · 1200×1500 | Leo, degradados y diseño | Barberos |
| `barbero-jesus.jpg` | 4:5 · 1200×1500 | Jesús, cortes clásicos e infantiles | Barberos |
| `servicio-corte.jpg` | 1:1 · 1200×1200 | Tijera y peine en un corte | Servicios (muestra al pasar) |
| `servicio-corte-barba.jpg` | 1:1 · 1200×1200 | Corte y barba terminados | Servicios |
| `servicio-barba.jpg` | 1:1 · 1200×1200 | Arreglo de barba con máquina | Servicios |
| `servicio-afeitado.jpg` | 1:1 · 1200×1200 | Afeitado con navaja y espuma | Servicios |
| `servicio-infantil.jpg` | 1:1 · 1200×1200 | Corte infantil visto por detrás | Servicios |
| `ritual-toalla.jpg` | 3:2 · 2400×1600 | Toalla caliente con vapor | El ritual *(recortable)* |
| `ritual-espuma.jpg` | 3:2 · 2400×1600 | Brocha haciendo espuma | El ritual *(recortable)* |
| `ritual-navaja.jpg` | 3:2 · 2400×1600 | La navaja sobre la mejilla | El ritual *(recortable)* |
| `ritual-locion.jpg` | 3:2 · 2400×1600 | Manos con la loción | El ritual *(recortable)* |

En el ritual el sujeto va **centrado**: en el móvil se recorta en vertical por el centro.

## Prompts

**hero-retrato.jpg**
```
Side profile portrait of a Venezuelan man in his thirties with a full well-groomed dark beard and short textured hair, looking right, calm and proud, wearing a plain dark shirt with an open collar, head and shoulders, generous empty space above the head, 4:5 vertical
```

**barbero-ramon.jpg**
```
Portrait of a Venezuelan barber in his early sixties with a neat grey moustache and short grey hair, wearing a white barber jacket, holding a closed straight razor near his chest, warm confident half smile, chest-up, facing camera slightly turned, 4:5 vertical
```

**barbero-leo.jpg**
```
Portrait of a Venezuelan barber in his late twenties with a sharp skin fade haircut and a thin shaved design line, short trimmed beard, wearing a plain black t-shirt, holding hair clippers, relaxed confident expression, chest-up, three-quarter view, 4:5 vertical
```

**barbero-jesus.jpg**
```
Portrait of a friendly Venezuelan barber in his forties with short curly hair and a short boxed beard, wearing a dark apron over a light shirt, holding barber scissors and a comb, kind smile, chest-up, facing camera, 4:5 vertical
```

**servicio-corte.jpg**
```
Close-up of a barber's hands cutting a man's hair with scissors over a comb, only hands, scissors and the back of the head visible, square composition
```

**servicio-corte-barba.jpg**
```
Close-up of a man's freshly cut short hair and neatly shaped full beard seen in three-quarter view from behind the shoulder, crisp beard line on the cheek, square composition
```

**servicio-barba.jpg**
```
Close-up of a barber trimming a man's beard with electric clippers along the jawline, only hands, clippers and the lower half of the face visible, square composition
```

**servicio-afeitado.jpg**
```
Close-up of a straight razor shave, barber's hand holding an open straight razor against a cheek covered in thick white shaving foam, square composition
```

**servicio-infantil.jpg**
```
A young boy seen from behind sitting in a barber chair with a cape, a barber's hands trimming the hair at the nape with scissors, the child's face not visible, square composition
```

**ritual-toalla.jpg**
```
A folded hot white towel releasing steam held in a barber's hands, centered in the frame, dark empty space around, 3:2 horizontal
```

**ritual-espuma.jpg**
```
A badger shaving brush whipping thick white lather in a metal shaving bowl, centered in the frame, dark empty space around, 3:2 horizontal
```

**ritual-navaja.jpg**
```
An open straight razor gliding along a lathered cheek, extreme close-up, the blade catching the light, centered in the frame, 3:2 horizontal
```

**ritual-locion.jpg**
```
A barber's open palms catching a splash of aftershave from a glass bottle, droplets frozen in the air, centered in the frame, dark empty space around, 3:2 horizontal
```

Para el ritual, cambia en el sufijo común «clean plain white background» por «dark background»: esas fotos van a sangre, no en duotono.

## Mientras no lleguen

Se usan marcadores en la paleta con la proporción final, para que la composición y Lighthouse se midan de verdad. Al llegar, cada imagen lleva su procedencia incrustada (`impeccable embed-prompt`) y su crédito en el pie.
