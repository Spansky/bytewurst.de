/**
 * Läuft nach dem Browser- und dem SSR-Build (siehe package.json). Rendert jede
 * Seite aus src/data/seiten.ts einmal zu HTML und schreibt sie mit eigenem
 * Kopfbereich in ihren Ordner unter dist/. Dazu sitemap.xml und robots.txt.
 *
 * Warum: Ohne Vorrendern käme ein leeres <div id="root"> an. Crawler ohne
 * JavaScript sähen nichts, und der erste Bildschirm müsste auf das JavaScript
 * warten. Deshalb steht im Markup nie ein opacity:0 als Inline-Stil.
 * Einblendungen hängen an der Klasse js am html-Element (index.html, index.css).
 *
 * Solange KONZEPT in src/data/betrieb.ts gilt, bekommt jede Seite noindex und
 * robots.txt sperrt alles: Ein Entwurf mit Stockfotos und Beispielzahlen soll
 * nicht in Suchmaschinen landen und schon gar nicht neben bytewurst.de.
 */
import { readFileSync, writeFileSync, rmSync, existsSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'dist')
const ssrDir = resolve(root, 'dist-ssr')

const { render, seiten, KONZEPT, SEITEN_URL, firma, bildSatz } = await import(resolve(ssrDir, 'entry-server.js'))

const vorlage = readFileSync(resolve(dist, 'index.html'), 'utf8')
const manifest = JSON.parse(readFileSync(resolve(dist, '.vite', 'manifest.json'), 'utf8'))

for (const marke of ['<!--kopf-->', '<div id="root"><!--inhalt-->']) {
  if (!vorlage.includes(marke)) throw new Error(`index.html: ${marke} fehlt, Vorlage geändert?`)
}

/** Seitendatei und alle ihre statischen Importe, damit der Browser sie parallel zu main.js lädt */
function vorladen(quelle) {
  const gesehen = new Set()
  const liste = []
  const besuchen = (schluessel) => {
    const eintrag = manifest[schluessel]
    if (!eintrag || gesehen.has(schluessel)) return
    gesehen.add(schluessel)
    liste.push(eintrag.file)
    for (const i of eintrag.imports ?? []) besuchen(i)
  }
  besuchen(quelle)
  if (!liste.length) throw new Error(`Manifest kennt ${quelle} nicht`)
  return liste
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

const software = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'ByteWurst',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: `${SEITEN_URL}/`,
  image: `${SEITEN_URL}/og-image.jpg`,
  description: 'Umsatzprognose und Reporting für Metzgereien. Rechnet nachts aus den Kassendaten, was nächste Woche über die Theke geht.',
  publisher: { '@type': 'Organization', name: firma.name, address: `${firma.strasse}, ${firma.plz} ${firma.ort}` },
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR', description: 'Kostenlos mit einer Filiale und drei Produkten' },
}

for (const seite of seiten) {
  const url = seite.pfad === '/404' ? null : `${SEITEN_URL}${seite.pfad}`
  const kopf = [
    `<title>${esc(seite.titel)}</title>`,
    `<meta name="description" content="${esc(seite.beschreibung)}" />`,
    KONZEPT || !url ? '<meta name="robots" content="noindex" />' : '',
    url ? `<link rel="canonical" href="${url}" />` : '',
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="ByteWurst" />`,
    `<meta property="og:locale" content="de_DE" />`,
    url ? `<meta property="og:url" content="${url}" />` : '',
    `<meta property="og:title" content="${esc(seite.titel)}" />`,
    `<meta property="og:description" content="${esc(seite.beschreibung)}" />`,
    `<meta property="og:image" content="${SEITEN_URL}/og-image.jpg" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="Wursti, das Maskottchen von ByteWurst, neben dem Schriftzug ByteWurst" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    seite.vorladen
      ? `<link rel="preload" as="image" type="image/avif" imagesrcset="${bildSatz(seite.vorladen.name, 'avif')}" imagesizes="${seite.vorladen.sizes}" fetchpriority="high" />`
      : '',
    ...vorladen(seite.quelle).map((f) => `<link rel="modulepreload" crossorigin href="/${f}" />`),
    seite.schluessel === 'start' && !KONZEPT ? `<script type="application/ld+json">${JSON.stringify(software)}</script>` : '',
  ]
    .filter(Boolean)
    .join('\n    ')

  const html = vorlage
    .replace('<!--kopf-->', kopf)
    .replace('<div id="root"><!--inhalt-->', `<div id="root" data-seite="${seite.schluessel}">${render(seite.schluessel)}`)
  const ziel = resolve(dist, seite.datei)
  mkdirSync(dirname(ziel), { recursive: true })
  writeFileSync(ziel, html)
  process.stdout.write(`vorgerendert: ${seite.datei} (${(html.length / 1024).toFixed(0)} kB)\n`)
}

const heute = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${seiten
  .filter((s) => s.sitemap)
  .map((s) => `  <url><loc>${SEITEN_URL}${s.pfad}</loc><lastmod>${heute}</lastmod></url>`)
  .join('\n')}
</urlset>
`
writeFileSync(resolve(dist, 'sitemap.xml'), sitemap)
writeFileSync(
  resolve(dist, 'robots.txt'),
  KONZEPT
    ? '# Konzeptentwurf, noch nicht für Suchmaschinen\nUser-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${SEITEN_URL}/sitemap.xml\n`,
)
process.stdout.write(`sitemap.xml und robots.txt geschrieben${KONZEPT ? ' (Konzept: alles gesperrt)' : ''}\n`)

// SSR-Build und Manifest gehören nicht ins Web-Root
if (existsSync(ssrDir)) rmSync(ssrDir, { recursive: true, force: true })
rmSync(resolve(dist, '.vite'), { recursive: true, force: true })
