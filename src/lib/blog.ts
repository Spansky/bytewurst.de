import { getEmDashCollection } from 'emdash'

/*
  Der Blog: Sammlung "posts" in EmDash, Felder in scripts/blog.mjs (SAMMLUNG),
  Quelltexte der ersten Beiträge in content/blog/. Zahlen und Preise stehen im
  Text nur als Platzhalter (lib/text.ts, ptEinsetzen).
*/

/** Veröffentlichte Beiträge, neueste zuerst. Fehlt die Sammlung noch, eine leere Liste. */
export async function beitraege(limit = 50) {
  const { entries, cacheHint, error } = await getEmDashCollection('posts', {
    orderBy: { published_at: 'desc' },
    limit,
  })
  return { beitraege: error ? [] : entries, cacheHint }
}

const DATUM = new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Berlin' })

/** 8. Oktober 2026 */
export function datum(d: Date | null | undefined): string {
  return d ? DATUM.format(d) : ''
}

type PtKnoten = { text?: unknown; children?: PtKnoten[] }

/** Lesezeit in Minuten, 200 Wörter je Minute, mindestens eine */
export function lesezeit(inhalt: unknown): number {
  let woerter = 0
  const zaehlen = (k: PtKnoten) => {
    if (typeof k.text === 'string') woerter += k.text.split(/\s+/).filter(Boolean).length
    k.children?.forEach(zaehlen)
  }
  if (Array.isArray(inhalt)) (inhalt as PtKnoten[]).forEach(zaehlen)
  return Math.max(1, Math.round(woerter / 200))
}
