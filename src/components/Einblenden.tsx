import { useEffect } from 'react'

/*
  Macht Elemente mit data-einblenden, data-zeichnen oder data-drucken sichtbar, sobald sie ins
  Bild kommen. Die Übergänge stehen in index.css. Läuft einmal im Seitenrahmen.

  Per Attribut statt Animationsbibliothek: ohne JavaScript bleibt alles
  sichtbar, und im vorgerenderten HTML steht kein opacity:0, das beim
  Hydrieren hängen bleiben könnte.

  Beobachtet wird immer der Elterncontainer, nicht das Element selbst. Ein
  Element, das per clip-path oder Maske ganz verdeckt startet, meldet der
  Browser sonst nie als sichtbar (LESSONS 2026-09-27).
*/
export default function Einblenden() {
  useEffect(() => {
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
    const suchen = () => {
      document.querySelectorAll('[data-einblenden]:not([data-sichtbar]),[data-zeichnen]:not([data-sichtbar]),[data-drucken]:not([data-sichtbar])').forEach((el) => {
        const ziel = el.parentElement ?? el
        const liste = zuordnung.get(ziel) ?? new Set<Element>()
        liste.add(el)
        zuordnung.set(ziel, liste)
        io.observe(ziel)
      })
    }
    suchen()
    const mo = new MutationObserver(suchen)
    mo.observe(document.body, { childList: true, subtree: true })
    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])
  return null
}
