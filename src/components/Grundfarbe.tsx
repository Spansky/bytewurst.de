import { useEffect } from 'react'

/**
 * Sauberer Übergang zu den Browserleisten auf dem iPhone, nach dem Rezept in
 * ~/.claude/skills/hausstandard/ios-leisten.md.
 *
 * Oben findet Safari die klebende Kopfzeile (Fliese). Unten findet es den
 * unsichtbaren Farbstreifen .leiste-unten. Der wechselt ab halber Seite mit
 * html und body auf die Farbe der Fußzeile (Nacht), die Farben stehen in index.css.
 */
export default function Grundfarbe() {
  useEffect(() => {
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
    const beobachter = new ResizeObserver(planen)
    beobachter.observe(document.body)
    return () => {
      window.removeEventListener('scroll', planen)
      window.removeEventListener('resize', planen)
      beobachter.disconnect()
      cancelAnimationFrame(rahmen)
    }
  }, [])
  return <div aria-hidden="true" className="leiste-unten pointer-events-none fixed inset-x-0 bottom-0 -z-20 h-3" />
}
