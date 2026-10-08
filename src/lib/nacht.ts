import { MAIL_AB, nachtStationen } from '../data/start'

/*
  Die Nacht-Szene hängt nur an der Minute ab 19:00 Uhr. szene(m) rechnet
  alle veränderlichen Werte aus, der Server rendert damit Minute 0
  (bloecke/start/Nacht.astro), das Skript setzt sie bei jeder Minute neu
  (anwenden). Deshalb zeigt das Ziehen genau dasselbe wie das Abspielen,
  und ohne JavaScript steht die Szene bei Ladenschluss.
*/

const mix = (a: string, b: string, t: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
  const [x, y] = [p(a), p(b)]
  return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * t)).join(' ')})`
}
const zwischen = (m: number, von: number, bis: number) => Math.min(1, Math.max(0, (m - von) / (bis - von)))

/** Punkt auf einer quadratischen Kurve */
const kurve = (t: number, a: [number, number], k: [number, number], b: [number, number]): [number, number] => [
  (1 - t) ** 2 * a[0] + 2 * (1 - t) * t * k[0] + t ** 2 * b[0],
  (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * k[1] + t ** 2 * b[1],
]

/** 19:00 bis 07:00 */
export function uhr(m: number): string {
  const gesamt = (19 * 60 + m) % (24 * 60)
  return `${String(Math.floor(gesamt / 60)).padStart(2, '0')}:${String(gesamt % 60).padStart(2, '0')}`
}

export function station(m: number) {
  return [...nachtStationen].reverse().find((s) => m >= s.ab)!
}

export const STERNE = Array.from({ length: 26 }, (_, i) => ({
  x: (i * 137.5) % 640,
  y: 18 + ((i * 71) % 190),
  r: i % 5 === 0 ? 1.8 : 1.1,
  verzug: (i % 7) * 0.4,
}))

export function szene(m: number) {
  const dunkel = m < 360 ? zwischen(m, 0, 120) : 1 - zwischen(m, 570, 690)
  const morgen = m >= 360
  const oben = mix(morgen ? '#6f8fcf' : '#4a4f86', '#0b0f1a', dunkel)
  const ladenLicht = m < 120
  const hausLicht = (m > 100 && m < 250) || m > 640
  const wolkeAktiv = m >= 300 && m < 540
  const mond = kurve(zwischen(m, 40, 620), [40, 170], [320, -40], [610, 170])
  const rechnen = zwischen(m, 390, 480)
  const brief = zwischen(m, MAIL_AB, MAIL_AB + 60)
  const r = (v: number) => v.toFixed(1)

  return {
    oben,
    horizont: mix(morgen ? '#f6c879' : '#ef9a62', '#161b2c', dunkel),
    sterne: dunkel,
    mond: { deckkraft: dunkel ** 2, x: mond[0], y: mond[1] },
    sonne: { y: 360 - zwischen(m, 600, 720) * 120, deckkraft: zwischen(m, 610, 700) },
    wolke: 0.55 + (wolkeAktiv ? 0.45 : 0),
    wolkeSchein: wolkeAktiv ? 0.12 + 0.08 * Math.sin(m / 6) : null,
    // Kleines Diagramm in der Wolke: zeichnet sich beim Rechnen, dann ein Haken
    diagramm: m >= 390 && m < 560 ? { versatz: 1 - rechnen, haken: rechnen >= 1 } : null,
    // Bons fliegen aus der Metzgerei in die Wolke
    bons: [0, 1, 2, 3, 4].map((i) => {
      if (m < 300 || m >= 395) return null
      const t = ((m - 300) / 95) * 1.6 - i * 0.15
      if (t <= 0 || t >= 1) return null
      const [x, y] = kurve(t, [175, 262], [300, 60], [470, 108])
      return `translate(${r(x)} ${r(y)}) rotate(${r(-20 + t * 40)})`
    }),
    boden: mix('#3a3430', '#121417', dunkel),
    laden: {
      wand: mix('#efe7d8', '#2b2c31', dunkel * 0.85),
      band: mix('#c9bfae', '#22232a', dunkel),
      markise: 0.92 - dunkel * 0.35,
      licht: ladenLicht,
      fenster: ladenLicht ? '#ffe4a3' : mix('#5b6170', '#1a1d26', dunkel),
      rahmen: mix('#8a8073', '#3a3c44', dunkel),
      tuer: mix('#7a4a30', '#2b2220', dunkel),
      schild: 0.85 - dunkel * 0.4,
      schildText: m < 1 ? 'OFFEN' : 'ZU',
    },
    haus: {
      dach: mix('#8b4a33', '#2a1d1b', dunkel),
      wand: mix('#e6dccb', '#262830', dunkel * 0.9),
      licht: hausLicht,
      fenster: hausLicht ? '#ffe4a3' : mix('#5b6170', '#1a1d26', dunkel),
      rahmen: mix('#8a8073', '#3a3c44', dunkel),
      tuer: mix('#6a4a3a', '#221c1c', dunkel),
      schlaeft: !hausLicht && m > 250 && m < 640,
    },
    // Der Brief um 04:00 fliegt vom Himmel ins Haus
    brief: m >= MAIL_AB ? `translate(${kurve(brief, [500, 120], [600, 160], [504, 276]).map(r).join(' ')}) scale(${(0.7 + brief * 0.3).toFixed(3)})` : null,
    wursti: { brille: m >= 300 && m < 480, stimmung: m >= 480 && m < 600 ? ('lacht' as const) : ('froh' as const) },
  }
}

/** Werte von szene(m) ins SVG schreiben. Die Ziele tragen data-n im Markup. */
export function anwenden(svg: SVGSVGElement, m: number) {
  const s = szene(m)
  const el = (n: string) => svg.querySelectorAll(`[data-n="${n}"]`)
  const setzen = (n: string, attr: string, wert: string | number) => el(n).forEach((e) => e.setAttribute(attr, String(wert)))
  const zeigen = (n: string, an: boolean) => setzen(n, 'display', an ? 'inline' : 'none')

  setzen('oben', 'stop-color', s.oben)
  setzen('horizont', 'stop-color', s.horizont)
  setzen('sterne', 'opacity', s.sterne)
  setzen('mond', 'opacity', s.mond.deckkraft)
  setzen('mond-hell', 'cx', s.mond.x)
  setzen('mond-hell', 'cy', s.mond.y)
  setzen('mond-schatten', 'cx', s.mond.x + 8)
  setzen('mond-schatten', 'cy', s.mond.y - 5)
  setzen('mond-schatten', 'fill', s.oben)
  setzen('sonne', 'cy', s.sonne.y)
  setzen('sonne', 'opacity', s.sonne.deckkraft)
  setzen('wolke', 'opacity', s.wolke)
  zeigen('wolke-schein', s.wolkeSchein !== null)
  if (s.wolkeSchein !== null) setzen('wolke-schein', 'opacity', s.wolkeSchein)
  zeigen('diagramm', s.diagramm !== null)
  if (s.diagramm) {
    setzen('diagramm-linie', 'stroke-dashoffset', s.diagramm.versatz)
    zeigen('diagramm-haken', s.diagramm.haken)
  }
  s.bons.forEach((b, i) => {
    zeigen(`bon-${i}`, b !== null)
    if (b) setzen(`bon-${i}`, 'transform', b)
  })
  setzen('boden', 'fill', s.boden)
  setzen('laden-wand', 'fill', s.laden.wand)
  setzen('laden-band', 'fill', s.laden.band)
  setzen('markise', 'opacity', s.laden.markise)
  zeigen('laden-schein', s.laden.licht)
  setzen('laden-fenster', 'fill', s.laden.fenster)
  setzen('laden-rahmen', 'stroke', s.laden.rahmen)
  setzen('laden-tuer', 'fill', s.laden.tuer)
  setzen('laden-schild', 'opacity', s.laden.schild)
  el('laden-schild-text').forEach((e) => (e.textContent = s.laden.schildText))
  setzen('dach', 'fill', s.haus.dach)
  setzen('haus-wand', 'fill', s.haus.wand)
  zeigen('haus-schein', s.haus.licht)
  setzen('haus-fenster', 'fill', s.haus.fenster)
  setzen('haus-rahmen', 'stroke', s.haus.rahmen)
  setzen('haus-tuer', 'fill', s.haus.tuer)
  zeigen('zzz', s.haus.schlaeft)
  zeigen('brief', s.brief !== null)
  if (s.brief) setzen('brief', 'transform', s.brief)
}
