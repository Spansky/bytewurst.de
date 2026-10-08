/**
 * Blogbeiträge aus content/blog/*.md nach EmDash bringen. Eine Quelle, zwei Wege:
 *
 *   node scripts/blog.mjs seed
 *     Schreibt Sammlung "posts", die Beiträge und den Menüpunkt "Blog" in
 *     seed/seed.json. Wirkt nur bei einer leeren Datenbank (Einrichtung,
 *     lokale Entwicklung), wie jeder Seed.
 *
 *   node scripts/blog.mjs import --url https://… [--entwurf]
 *     Legt in einer laufenden Seite die Sammlung "posts" an, falls sie fehlt,
 *     ergänzt fehlende Felder und erstellt Beiträge, deren Slug es dort noch
 *     nicht gibt. Vorhandene Beiträge bleiben unangetastet, das Skript
 *     überschreibt nie, was in der Verwaltung bearbeitet wurde.
 *     Anmeldung: EMDASH_TOKEN (API-Token aus der Verwaltung, Rechte
 *     schema:read, schema:write, content:read, content:write). Gegen localhost
 *     reicht der Entwicklungszugang ohne Token. --entwurf legt die Beiträge
 *     unveröffentlicht an.
 *
 * Aufbau einer Datei: Kopf zwischen --- mit title, slug, anreisser, bild,
 * zum_anfassen, darunter der Text in Markdown. Das Skript wandelt Markdown mit
 * dem Umwandler von EmDash (emdash/client) in Portable Text um. Platzhalter wie
 * {euro_je_100k} bleiben stehen und werden erst beim Anzeigen ersetzt
 * (src/lib/text.ts).
 */
import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { EmDashClient, markdownToPortableText } from 'emdash/client'

const ROOT = path.resolve(import.meta.dirname, '..')
const QUELLE = path.join(ROOT, 'content', 'blog')
const SEED = path.join(ROOT, 'seed', 'seed.json')

/** Namen wie in src/data/fotos.ts */
const FOTOS = ['schaufenster', 'theke', 'ueber-die-theke', 'frueher', 'wurst-senf', 'kaffee', 'bon']
/** Spielereien, die ein Beitrag zeigen kann (src/components/ZumAnfassen.astro) */
const SPIELEREIEN = ['prognose', 'wochenvergleich', 'aktionswoche', 'wetter', 'tagesreport', 'preisrechner']

export const SAMMLUNG = {
  slug: 'posts',
  label: 'Blog',
  labelSingular: 'Beitrag',
  description: 'Beiträge unter /blog/. Zahlen und Preise nur als Platzhalter, siehe CLAUDE.md.',
  supports: ['drafts', 'revisions', 'scheduling', 'search', 'seo'],
  urlPattern: '/blog/{slug}/',
  fields: [
    { slug: 'title', label: 'Titel', type: 'string', required: true, searchable: true },
    { slug: 'anreisser', label: 'Anreißer (Übersicht und Beschreibung für Suchmaschinen)', type: 'text', required: true, searchable: true },
    { slug: 'bild', label: 'Foto', type: 'select', required: true, validation: { options: FOTOS } },
    { slug: 'zum_anfassen', label: 'Zum Anfassen (Diagramm oder Rechner im Beitrag)', type: 'select', validation: { options: SPIELEREIEN } },
    { slug: 'inhalt', label: 'Text', type: 'portableText', required: true, searchable: true },
  ],
}

const MENUEPUNKT = { type: 'custom', label: 'Blog', url: '/blog/' }

/** Kopf zwischen --- als einfache "schluessel: wert"-Zeilen, darunter Markdown */
async function beitraegeLesen() {
  const dateien = (await readdir(QUELLE)).filter((d) => d.endsWith('.md')).sort()
  return Promise.all(
    dateien.map(async (datei) => {
      const roh = await readFile(path.join(QUELLE, datei), 'utf8')
      const treffer = roh.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
      if (!treffer) throw new Error(`${datei}: Kopf zwischen --- fehlt`)
      const kopf = Object.fromEntries(
        treffer[1].split('\n').map((zeile) => {
          const i = zeile.indexOf(':')
          return [zeile.slice(0, i).trim(), zeile.slice(i + 1).trim()]
        }),
      )
      for (const pflicht of ['title', 'slug', 'anreisser', 'bild']) {
        if (!kopf[pflicht]) throw new Error(`${datei}: ${pflicht} fehlt`)
      }
      if (!FOTOS.includes(kopf.bild)) throw new Error(`${datei}: unbekanntes Foto ${kopf.bild}`)
      if (kopf.zum_anfassen && !SPIELEREIEN.includes(kopf.zum_anfassen)) throw new Error(`${datei}: unbekannte Spielerei ${kopf.zum_anfassen}`)
      return { datei, kopf, markdown: treffer[2].trim() }
    }),
  )
}

/**
 * Markdown in Portable Text. Platzhalter wie {beispiel_umsatz} vorher sichern:
 * Zwei davon in einem Absatz läse der Umwandler sonst als _kursiv_.
 */
function inPortableText(markdown) {
  const gesichert = []
  const ohne = markdown.replace(/\{[a-z0-9_]+\}/g, (p) => `PLATZHALTER${gesichert.push(p) - 1}X`)
  const zurueck = (k) => ({
    ...k,
    ...(typeof k.text === 'string' ? { text: k.text.replace(/PLATZHALTER(\d+)X/g, (_, i) => gesichert[Number(i)]) } : {}),
    ...(Array.isArray(k.children) ? { children: k.children.map(zurueck) } : {}),
  })
  return markdownToPortableText(ohne).map(zurueck)
}

const daten = ({ kopf }, inhalt) => ({
  title: kopf.title,
  anreisser: kopf.anreisser,
  bild: kopf.bild,
  ...(kopf.zum_anfassen ? { zum_anfassen: kopf.zum_anfassen } : {}),
  inhalt,
})

async function seed() {
  const s = JSON.parse(await readFile(SEED, 'utf8'))
  const beitraege = await beitraegeLesen()
  s.collections = [...s.collections.filter((c) => c.slug !== SAMMLUNG.slug), SAMMLUNG]
  // In umgekehrter Reihenfolge, damit Beitrag 01 als neuester oben steht
  s.content.posts = [...beitraege].reverse().map((b) => ({
    id: `post-${b.kopf.slug}`,
    slug: b.kopf.slug,
    status: 'published',
    data: daten(b, inPortableText(b.markdown)),
  }))
  for (const menue of s.menus) {
    if (!menue.items.some((p) => p.url === MENUEPUNKT.url)) {
      // In der Kopfzeile hinter Preise, in der Fußzeile vor Einloggen
      const nach = menue.items.findIndex((p) => p.url === '/preise/')
      menue.items.splice(nach + 1, 0, { ...MENUEPUNKT })
    }
  }
  await writeFile(SEED, JSON.stringify(s, null, 2) + '\n')
  process.stdout.write(`seed/seed.json: Sammlung posts, ${beitraege.length} Beiträge, Menüpunkt Blog\n`)
}

async function importieren(url, entwurf) {
  if (!url) throw new Error('--url fehlt, etwa --url https://preview.bytewurst.de')
  const lokal = /localhost|127\.0\.0\.1/.test(url)
  const token = process.env.EMDASH_TOKEN
  if (!token && !lokal) throw new Error('EMDASH_TOKEN fehlt (API-Token aus der Verwaltung)')
  const client = new EmDashClient({ baseUrl: url, token, devBypass: !token && lokal })

  const vorhanden = (await client.collections()).some((c) => c.slug === SAMMLUNG.slug)
  if (!vorhanden) {
    // Erst die Sammlung ohne Felder, die Felder legt die Schleife darunter an
    await client.createCollection({ ...SAMMLUNG, fields: undefined })
    process.stdout.write(`Sammlung ${SAMMLUNG.slug} angelegt\n`)
  }
  const felder = new Set(((await client.collection(SAMMLUNG.slug)).fields ?? []).map((f) => f.slug))
  for (const [i, feld] of SAMMLUNG.fields.entries()) {
    if (felder.has(feld.slug)) continue
    await client.createField(SAMMLUNG.slug, { ...feld, sortOrder: i })
    process.stdout.write(`Feld ${feld.slug} angelegt\n`)
  }

  const slugs = new Set()
  let cursor
  do {
    const seite = await client.list(SAMMLUNG.slug, { limit: 100, cursor })
    for (const item of seite.items) slugs.add(item.slug)
    cursor = seite.nextCursor
  } while (cursor)

  // Umgekehrt anlegen, damit Beitrag 01 als neuester oben steht
  for (const b of [...(await beitraegeLesen())].reverse()) {
    if (slugs.has(b.kopf.slug)) {
      process.stdout.write(`übersprungen, gibt es schon: ${b.kopf.slug}\n`)
      continue
    }
    // Fertiges Portable Text übergeben (Platzhalter gesichert), der Client reicht Arrays unverändert durch
    const item = await client.create(SAMMLUNG.slug, { slug: b.kopf.slug, data: daten(b, inPortableText(b.markdown)) })
    if (!entwurf) await client.publish(SAMMLUNG.slug, item.id)
    process.stdout.write(`${entwurf ? 'als Entwurf' : 'veröffentlicht'}: ${b.kopf.slug}\n`)
  }
  process.stdout.write('Fertig. Menüpunkt "Blog" (/blog/) in der Verwaltung unter Menüs ergänzen, falls er fehlt.\n')
}

const [modus, ...rest] = process.argv.slice(2)
const wert = (name) => {
  const i = rest.indexOf(name)
  return i >= 0 ? rest[i + 1] : undefined
}
if (modus === 'seed') await seed()
else if (modus === 'import') await importieren(wert('--url'), rest.includes('--entwurf'))
else {
  process.stderr.write('Aufruf: node scripts/blog.mjs seed | import --url <adresse> [--entwurf]\n')
  process.exit(1)
}
