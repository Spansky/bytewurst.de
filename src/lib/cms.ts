import { getEmDashEntry, getSeoMeta } from 'emdash'
import { SEITEN_URL } from '../data/betrieb'
import { seite as seiteHolen, type SeitenSchluessel } from '../data/seiten'

/*
  Eintrag einer CMS-Seite aus der Sammlung "pages" laden. Aufrufen im
  Frontmatter der Seite unter src/pages, nicht in einer Komponente: Fehlt
  der Eintrag (Datenbank leer, Einrichtung noch nicht durchlaufen, Seite
  nicht veröffentlicht), muss die Seite selbst auf /404 umschreiben. Aus
  einer Komponente heraus läuft die Antwort schon und Astro bricht ab.
*/
export async function cmsSeite(schluessel: SeitenSchluessel) {
  const seite = seiteHolen(schluessel)
  const { entry, cacheHint } = await getEmDashEntry('pages', seite.cms!)
  if (!entry) return null
  // Ein im SEO-Feld gesetzter Titel geht vor dem aus seiten.ts
  const seo = getSeoMeta(entry, { siteUrl: SEITEN_URL, path: seite.pfad, defaultTitle: seite.titel })
  return { seite, entry, cacheHint, titel: seo.title }
}

export type CmsDaten = NonNullable<Awaited<ReturnType<typeof cmsSeite>>>
