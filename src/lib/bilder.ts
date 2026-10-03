import bilder from '../data/bilder.json'

export type BildEintrag = { breite: number; hoehe: number; breiten: number[] }
const liste = bilder as Record<string, BildEintrag>

export function bildEintrag(name: string): BildEintrag {
  const b = liste[name]
  if (!b) throw new Error(`Bild fehlt im Manifest: ${name}`)
  return b
}

/** srcset einer Bildquelle, auch für das Vorladen im Kopf (scripts/prerender.mjs) */
export function bildSatz(name: string, typ: 'avif' | 'webp') {
  return bildEintrag(name)
    .breiten.map((w) => `/bilder/${name}-${w}.${typ} ${w}w`)
    .join(', ')
}
