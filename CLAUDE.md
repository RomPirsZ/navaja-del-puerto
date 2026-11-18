# Instrucciones para el agente — Navaja del Puerto

App de reservas de una barbería **ficticia** de Puerto Cabello: proyecto 003 del portafolio [A]nkordev (T29). Se usa **SDD**. Antes de escribir código:

1. Lee `docs/constitution.md` (copia de la del portafolio, en solo lectura). Sus principios tienen prioridad sobre todo lo demás.
2. Lee `docs/specs/001-reservas/spec.md` (qué y por qué) y `plan.md` (cómo).
3. Trabaja según `docs/specs/001-reservas/tasks.md`:
   - Una tarea a la vez, en orden, con sus tests (primero el test cuando haya una regla clara).
   - Al terminar: `npm test`, marca `[x]` y haz commit convencional (`feat:`, `fix:`, `test:`, `docs:`, `chore:`).
   - Al terminar cada **fase**, detente y espera revisión.
4. No agregues dependencias fuera del plan sin preguntar. Nunca instales nada (paquetes, skills, herramientas globales) sin preguntar primero.
5. Si la spec o el plan son ambiguos o contradicen la constitución, pregunta antes de seguir.

Textos de interfaz siempre en `src/i18n/es.json`.

## Producto y diseño

- `PRODUCT.md`: público, propósito y límites. **Sin backend:** la API se simula en el navegador y la demo se rotula. Sin WhatsApp ni teléfonos de la barbería. Nada de reseñas, valoraciones, cifras ni premios. Lo ficticio se rotula.
- Fotos generadas con IA por el usuario y acreditadas como tales; nunca se presentan como clientes, barberos o locales reales.
- Dirección visual: **«Lado A»** (la barbería como un LP de salsa de los setenta), elegida el 2026-11-18 con impeccable. Su contrato, con las composiciones por sección de Taste, está en `.impeccable/surfaces/src-pages-index-astro.md`; al terminar se documenta en `DESIGN.md`. Imágenes: prompts en `docs/specs/001-reservas/imagenes.md`.
- Orden de autoridad: **constitución → spec/plan → PRODUCT.md / contrato / DESIGN.md → guía de cualquier skill**.

## Herramientas

| Tarea | Herramienta |
|---|---|
| Construir UI, crítica, auditoría, pulido, `DESIGN.md` | **impeccable** (la principal). Todo cambio visual: `context` y craft-floor antes; `polish` o `critique` y el detector después |
| Accesibilidad, formularios, textos de interfaz, UX móvil | **ux-designer** |
| Escribir HTML, CSS o JS de cliente nuevo, también JSX (patrones modernos de la plataforma, compatibilidad Baseline, alternativas) | **modern-web-guidance**: `search` y `retrieve` **antes** de escribir; no `legacy-scan` ni auditorías salvo que se pidan. Si una guía choca con la constitución, el plan o `DESIGN.md`, mandan ellos |
| Revisión visual con capturas a varios anchos | **design-taste-frontend** (solo su revisión, después de impeccable) |
| Afinar duraciones y curvas existentes | **transitions-polish** |
| Textos de marketing: titulares, frases de apoyo, CTA | **copywriting** y **landing-page-copy** |

Choques conocidos:
- **Prueba social (copywriting, landing-page-copy, referencias):** proponen testimonios, logos, cifras y valoraciones. Aquí no existen y no se inventan.
- **Movimiento (constitución II, 1.3.0):** se pueden animar `transform`, `opacity`, `clip-path`, `mask`, filtros (blur incluido), color, fondo, borde y `box-shadow`. Nunca propiedades que recalculan el diseño (`width`, `height`, `top`, `left`, `margin`…): la tira de barberos de la referencia se abre con `transform` y `clip-path`, no con `width`. Sin WebGL (es solo del portafolio).
- **taste-skill** prohíbe la mono, las líneas finas, el blur y las etiquetas pequeñas: aquí manda la dirección de impeccable y `DESIGN.md`.
- **Scripts:** nunca por CDN. React y Anime.js van por npm; la CSP solo permite `self`.
- **web-artifacts-builder** (React + shadcn + pnpm): nunca en este proyecto.
