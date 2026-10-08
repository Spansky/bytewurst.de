import { bewegungReduziert } from './bewegung'

/*
  Wursti im Browser: Augen folgen der Maus, ab und zu blinzeln. Läuft einmal
  je Seite (layouts/Base.astro) für alle Wurstis mit data-folgen bzw.
  data-blinzeln. Schreibt direkt ins SVG, das Markup vom Server bleibt sonst
  unberührt. Ohne JavaScript steht Wursti einfach still da.
*/

const BLICK_WEIT = 3.6

export type Stimmung = 'froh' | 'staunt' | 'lacht'

/** Gesicht wechseln. Die passenden Teile blendet index.css ein. */
export function stimmungSetzen(svg: Element | null, stimmung: Stimmung, brille = false) {
  if (!svg) return
  svg.setAttribute('data-stimmung', stimmung)
  svg.toggleAttribute('data-brille', brille)
}

function folgen() {
  const alle = [...document.querySelectorAll<SVGSVGElement>('svg.wursti[data-folgen]')]
  if (!alle.length) return
  let rahmen = 0
  let x = 0
  let y = 0
  const setzen = () => {
    rahmen = 0
    for (const el of alle) {
      const p = el.querySelector('.wursti-pupillen')
      if (!p) continue
      const r = el.getBoundingClientRect()
      // Unsichtbare (etwa display:none unter lg) haben keine Fläche
      if (!r.width) continue
      // Mittelpunkt zwischen den Augen, nicht der ganzen Wurst
      const dx = x - (r.left + r.width * 0.5)
      const dy = y - (r.top + r.height * 0.3)
      const anteil = Math.min(Math.hypot(dx, dy) / 240, 1)
      const w = Math.atan2(dy, dx)
      p.setAttribute('transform', `translate(${(Math.cos(w) * BLICK_WEIT * anteil).toFixed(2)} ${(Math.sin(w) * BLICK_WEIT * anteil).toFixed(2)})`)
    }
  }
  const bewegt = (e: PointerEvent) => {
    x = e.clientX
    y = e.clientY
    if (!rahmen) rahmen = requestAnimationFrame(setzen)
  }
  window.addEventListener('pointermove', bewegt, { passive: true })
  window.addEventListener('pointerdown', bewegt, { passive: true })
}

function blinzeln() {
  if (bewegungReduziert()) return
  document.querySelectorAll('svg.wursti[data-blinzeln] .wursti-augen').forEach((a, i) => {
    const naechstes = () => {
      window.setTimeout(
        () => {
          a.setAttribute('data-zu', '')
          window.setTimeout(() => {
            a.removeAttribute('data-zu')
            naechstes()
          }, 130)
        },
        // Nicht alle im Gleichtakt
        2200 + ((performance.now() * 7919 + i * 977) % 3800),
      )
    }
    naechstes()
  })
}

export function wurstiStarten() {
  folgen()
  blinzeln()
}
