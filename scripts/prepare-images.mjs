/**
 * Rechnet die Fotos aus reference/bilder in AVIF und WebP je Breite um und legt
 * sie nach public/bilder/. Dazu schreibt es src/data/bilder.json mit den Maßen
 * (nach dem Zuschnitt), damit jedes <img> width und height bekommt.
 *
 * Die Fotos sind Platzhalter von Unsplash, Nachweis in reference/bilder/nachweis.json.
 * Die Ergebnisse sind eingecheckt. Coolify baut nur `npm run build`, dieses
 * Skript läuft dort nicht. Neues Bild: Datei nach reference/bilder, Eintrag in
 * MOTIVE, `npm run images`, Ergebnis mit committen.
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..')
const AUS = path.join(ROOT, 'public', 'bilder')

/** Querformat, höchstens halbe Seitenbreite oder ein breites Band */
const QUER = [480, 800, 1200, 1600]
/** Hochformat oder fast quadratisch in einer Spalte */
const HOCH = [400, 700, 1000]

/**
 * zuschnitt: Anteile, die links, oben, rechts, unten wegfallen.
 * - theke: rechts steht ein Schild mit Pfundpreis, das passt nicht zu einer deutschen Metzgerei.
 * - kaffee: nur Tasse und Untertasse. Das Handy daneben zeigt einen Wecker mit
 *   russischer Beschriftung, an seine Stelle rückt auf der Seite die Report-Mail.
 */
const MOTIVE = [
  { name: 'schaufenster', breiten: QUER },
  { name: 'theke', breiten: QUER, zuschnitt: [0, 0, 0.31, 0] },
  { name: 'ueber-die-theke', breiten: QUER },
  { name: 'frueher', breiten: QUER },
  { name: 'wurst-senf', breiten: QUER },
  { name: 'grill', breiten: HOCH },
  { name: 'kaffee', breiten: [400, 700, 960], zuschnitt: [0, 0.38, 0.6, 0] },
  { name: 'bon', breiten: QUER },
]

await rm(AUS, { recursive: true, force: true })
await mkdir(AUS, { recursive: true })

const manifest = {}
for (const m of MOTIVE) {
  const quelle = path.join(ROOT, 'reference', 'bilder', `${m.name}.jpg`)
  if (!existsSync(quelle)) throw new Error(`Quelle fehlt: ${quelle}`)
  const meta = await sharp(quelle).metadata()
  let bild = sharp(quelle)
  let breite = meta.width
  let hoehe = meta.height
  if (m.zuschnitt) {
    const [l, o, r, u] = m.zuschnitt
    const left = Math.round(meta.width * l)
    const top = Math.round(meta.height * o)
    breite = meta.width - left - Math.round(meta.width * r)
    hoehe = meta.height - top - Math.round(meta.height * u)
    bild = sharp(await bild.extract({ left, top, width: breite, height: hoehe }).toBuffer())
  }
  const breiten = m.breiten.filter((b) => b <= breite)
  for (const b of breiten) {
    const basis = bild.clone().resize({ width: b })
    await basis.clone().avif({ quality: 50, effort: 6 }).toFile(path.join(AUS, `${m.name}-${b}.avif`))
    await basis.clone().webp({ quality: 74 }).toFile(path.join(AUS, `${m.name}-${b}.webp`))
  }
  manifest[m.name] = { breite, hoehe, breiten }
  process.stdout.write(`${m.name}: ${breite}x${hoehe} -> ${breiten.join(', ')}\n`)
}

await writeFile(path.join(ROOT, 'src', 'data', 'bilder.json'), JSON.stringify(manifest, null, 2) + '\n')
process.stdout.write('src/data/bilder.json geschrieben\n')

// Bildnachweis fürs Impressum. reference/ fehlt im Docker-Build, deshalb liegt
// die Liste der tatsächlich benutzten Fotos zusätzlich unter src/data.
const nachweis = JSON.parse(await readFile(path.join(ROOT, 'reference', 'bilder', 'nachweis.json'), 'utf8'))
const liste = MOTIVE.map((m) => {
  const n = nachweis[m.name]
  if (!n) throw new Error(`Kein Bildnachweis für ${m.name}`)
  return { bild: m.name, fotograf: n.fotograf, seite: n.seite }
})
await writeFile(path.join(ROOT, 'src', 'data', 'bildnachweis.json'), JSON.stringify(liste, null, 2) + '\n')
process.stdout.write('src/data/bildnachweis.json geschrieben\n')
