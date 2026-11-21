// Motion layer (plan §7, constitution II): only transform, opacity and clip-path, and
// nothing at all with prefers-reduced-motion (the `motion` class is never set then). Content
// is visible without this module: global.css shows it anyway after 2.5 s if it never runs.
import { animate, splitText, stagger, utils } from 'animejs';

const CURVA = 'out(4)';

/** «NAVAJA» lands letter by letter in a wave (Shopify Supply), then Leo settles in front. */
function entradaPortada(): void {
  // The giant word is decorative (aria-hidden): the headline is never split
  const palabra = document.querySelector<HTMLElement>('.hero-palabra-texto');
  const letras = palabra ? splitText(palabra, { chars: true }).chars : [];
  utils.set(letras, { opacity: 0 });
  animate(letras, {
    rotateX: [-95, 0],
    y: ['0.25em', '0em'],
    opacity: [0, 1],
    duration: 500,
    delay: stagger(18, { start: 60 }),
    ease: CURVA,
  });
  const retrato = document.querySelector<HTMLElement>('.hero-retrato');
  if (retrato) {
    utils.set(retrato, { opacity: 0 });
    animate(retrato, { y: ['6%', '0%'], scale: [1.05, 1], opacity: [0, 1], duration: 1100, delay: 420, ease: 'out(3)' });
  }
}

/** Each group's parts (heading, text, picture) rise in once, staggered, as it enters. */
function prepararRevelados(): void {
  const revelar = (grupo: Element) =>
    animate(grupo.querySelectorAll('[data-revelar]'), { opacity: 1, y: 0, duration: 500, delay: stagger(40), ease: CURVA });

  const observador = new IntersectionObserver(
    (entradas) => {
      for (const entrada of entradas) {
        if (!entrada.isIntersecting) continue;
        revelar(entrada.target);
        observador.unobserve(entrada.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  );

  for (const grupo of document.querySelectorAll('[data-revelar-grupo]')) {
    utils.set(grupo.querySelectorAll('[data-revelar]'), { opacity: 0, y: 12 });
    observador.observe(grupo);
  }
}

export function iniciarMovimiento(): void {
  const raiz = document.documentElement;
  if (!raiz.classList.contains('motion')) return;
  entradaPortada();
  prepararRevelados();
  // From here the module owns the hidden states; the CSS fallback stands down
  raiz.classList.add('motion-ready');
}
