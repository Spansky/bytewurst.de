/*
  Was auf jeder Seite einmal läuft, gestartet in layouts/Base.astro.
*/

/**
 * Macht Elemente mit data-einblenden, data-zeichnen oder data-drucken
 * sichtbar, sobald sie ins Bild kommen. Die Übergänge stehen in index.css.
 * Neues Attribut: hier in den Selektor, sonst bleibt das Element für immer
 * unsichtbar (so passiert mit dem Funktions-Bon).
 *
 * Per Attribut statt Animationsbibliothek: ohne JavaScript fehlt die Klasse
 * js am html-Element, dann bleibt alles sichtbar.
 *
 * Beobachtet wird immer der Elterncontainer, nicht das Element selbst. Ein
 * Element, das per clip-path oder Maske ganz verdeckt startet, meldet der
 * Browser sonst nie als sichtbar (LESSONS 2026-09-27).
 */
export function einblenden() {
  const zuordnung = new Map<Element, Set<Element>>()
  const io = new IntersectionObserver(
    (eintraege) => {
      for (const e of eintraege) {
        if (!e.isIntersecting) continue
        for (const el of zuordnung.get(e.target) ?? []) el.setAttribute('data-sichtbar', '')
        zuordnung.delete(e.target)
        io.unobserve(e.target)
      }
    },
    { rootMargin: '0px 0px -10% 0px' },
  )
  document.querySelectorAll('[data-einblenden]:not([data-sichtbar]),[data-zeichnen]:not([data-sichtbar]),[data-drucken]:not([data-sichtbar])').forEach((el) => {
    const ziel = el.parentElement ?? el
    const liste = zuordnung.get(ziel) ?? new Set<Element>()
    liste.add(el)
    zuordnung.set(ziel, liste)
    io.observe(ziel)
  })
}

/**
 * Sauberer Übergang zu den Browserleisten auf dem iPhone, nach dem Rezept in
 * ~/.claude/skills/hausstandard/ios-leisten.md.
 *
 * Oben findet Safari die klebende Kopfzeile (Fliese). Unten findet es den
 * unsichtbaren Farbstreifen .leiste-unten. Der wechselt ab halber Seite mit
 * html und body auf die Farbe der Fußzeile (Nacht), die Farben stehen in index.css.
 */
export function grundfarbe() {
  const html = document.documentElement
  let rahmen = 0
  const pruefen = () => {
    rahmen = 0
    const weg = html.scrollHeight - window.innerHeight
    const unten = weg <= 0 || window.scrollY > weg / 2
    html.dataset.grund = unten ? 'unten' : 'oben'
  }
  const planen = () => {
    if (!rahmen) rahmen = requestAnimationFrame(pruefen)
  }
  pruefen()
  window.addEventListener('scroll', planen, { passive: true })
  window.addEventListener('resize', planen)
  new ResizeObserver(planen).observe(document.body)
}
