/**
 * Rechnet die Quellen aus scripts/icons/ in alle Dateien um, die Browser, iOS
 * und Android anfordern, und legt sie in public/ ab. Das Vorschaubild
 * (og-image.jpg) setzt Wursti, Wortmarke und Unterzeile auf den dunklen
 * Nacht-Grund mit Wandfliesen. Auf Wurstrot würde Wursti verschwinden.
 *
 * Die SVG-Quellen enthalten keinen Text, nur Pfade (scripts/wortmarke.py):
 * sharp/librsvg lädt keine eingebetteten Schriften (LESSONS 2026-09-06).
 * Ergebnis immer ansehen.
 *
 * Lokal: npm run icons
 */
import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..')
const SRC = path.join(ROOT, 'scripts', 'icons')
const OUT = path.join(ROOT, 'public')
const WURST = '#c4532e'
const NACHT = '#141619'

function render(svg, viewBoxBreite, breite) {
  return sharp(svg, { density: (72 * breite) / viewBoxBreite }).resize({ width: breite })
}

/** ICO von Hand, weil sharp das Format nicht schreibt: Kopf, je Größe ein Eintrag, dahinter die PNGs */
function ico(pngs) {
  const kopf = Buffer.alloc(6)
  kopf.writeUInt16LE(0, 0)
  kopf.writeUInt16LE(1, 2)
  kopf.writeUInt16LE(pngs.length, 4)
  let versatz = 6 + pngs.length * 16
  const eintraege = pngs.map(({ groesse, daten }) => {
    const e = Buffer.alloc(16)
    e.writeUInt8(groesse >= 256 ? 0 : groesse, 0)
    e.writeUInt8(groesse >= 256 ? 0 : groesse, 1)
    e.writeUInt16LE(1, 4)
    e.writeUInt16LE(32, 6)
    e.writeUInt32LE(daten.length, 8)
    e.writeUInt32LE(versatz, 12)
    versatz += daten.length
    return e
  })
  return Buffer.concat([kopf, ...eintraege, ...pngs.map((p) => p.daten)])
}

await mkdir(OUT, { recursive: true })
const rund = await readFile(path.join(SRC, 'badge-round.svg'))
const eckig = await readFile(path.join(SRC, 'badge-square.svg'))
const fertig = []

await copyFile(path.join(SRC, 'badge-round.svg'), path.join(OUT, 'favicon.svg'))
fertig.push('favicon.svg')
await render(rund, 100, 96).png({ compressionLevel: 9 }).toFile(path.join(OUT, 'favicon-96x96.png'))
fertig.push('favicon-96x96.png')

const teile = []
for (const groesse of [16, 32, 48]) teile.push({ groesse, daten: await render(rund, 100, groesse).png().toBuffer() })
await writeFile(path.join(OUT, 'favicon.ico'), ico(teile))
fertig.push('favicon.ico')

// iOS rundet selbst und hinterlegt Transparenz schwarz, deshalb eckig und deckend
const deckend = { background: WURST }
await render(eckig, 100, 180).flatten(deckend).png({ compressionLevel: 9 }).toFile(path.join(OUT, 'apple-touch-icon.png'))
fertig.push('apple-touch-icon.png')
for (const groesse of [192, 512]) {
  await render(eckig, 100, groesse).flatten(deckend).png({ compressionLevel: 9 }).toFile(path.join(OUT, `icon-${groesse}.png`))
  fertig.push(`icon-${groesse}.png`)
}

// Vorschaubild 1200 x 630: Fliesen auf Nacht, links Schrift, rechts Wursti mit Schatten am Boden
const grund = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <defs><pattern id="f" width="96" height="96" patternUnits="userSpaceOnUse">
      <path d="M0 .75H96M0 48.75H96M.75 0V48M48.75 48V96" stroke="#fff" stroke-opacity="0.06" stroke-width="1.5" fill="none"/>
    </pattern>
    <radialGradient id="l" cx="77%" cy="48%" r="45%"><stop offset="0" stop-color="${WURST}" stop-opacity="0.35"/><stop offset="1" stop-color="${WURST}" stop-opacity="0"/></radialGradient>
    <radialGradient id="s"><stop offset="0" stop-color="#000" stop-opacity="0.55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>
    <rect width="1200" height="630" fill="${NACHT}"/><rect width="1200" height="630" fill="url(#f)"/><rect width="1200" height="630" fill="url(#l)"/>
    <ellipse cx="925" cy="436" rx="180" ry="20" fill="url(#s)"/>
  </svg>`,
)
const wortmarke = await sharp(await readFile(path.join(SRC, 'wortmarke.svg')), { density: 72 * 2 })
  .resize({ width: 560 })
  .png()
  .toBuffer()
const zeile = await sharp(await readFile(path.join(SRC, 'zeile.svg')), { density: 72 })
  .resize({ width: 520 })
  .png()
  .toBuffer()
const wursti = await sharp(await readFile(path.join(SRC, 'wursti.svg')), { density: 72 * 4 })
  .resize({ width: 440 })
  .png()
  .toBuffer()

await sharp(grund)
  .composite([
    { input: wortmarke, left: 76, top: 190 },
    { input: zeile, left: 80, top: 345 },
    { input: wursti, left: 705, top: 240 },
  ])
  .jpeg({ quality: 88, chromaSubsampling: '4:4:4', mozjpeg: true })
  .toFile(path.join(OUT, 'og-image.jpg'))
fertig.push('og-image.jpg (1200x630)')

process.stdout.write(`Icons geschrieben nach public/:\n  ${fertig.join('\n  ')}\n`)
