/**
 * sizes der Bilder im ersten Bildschirm. Bild und Vorladen im Kopf müssen exakt
 * dieselbe Angabe haben, sonst lädt der Browser zwei Größen (Abnahme 2026-10-03).
 */
export const GROESSEN = {
  schaufenster: '(min-width: 1024px) 46vw, (min-width: 576px) 576px, 100vw',
  theke: '(min-width: 1024px) 46vw, 100vw',
  wurstSenf: '(min-width: 1024px) 30vw, 1px',
} as const

/*
  Alle Routen mit Titel und Beschreibung. Daraus bauen das Layout den
  Kopfbereich (layouts/Base.astro) und pages/sitemap.xml.ts die Sitemap.

  Start, Funktionen und Preise holen ihren Inhalt aus EmDash (Sammlung
  "pages", Eintrag mit dem Slug in `cms`). Titel und Beschreibung hier sind
  die Vorgabe, im SEO-Feld des Eintrags lassen sie sich überschreiben.
  Neue Seite: hier eintragen und unter src/pages anlegen.
*/

export type SeitenSchluessel = 'start' | 'funktionen' | 'preise' | 'impressum' | 'datenschutz' | 'fehlt'

export type Seite = {
  schluessel: SeitenSchluessel
  pfad: string
  titel: string
  beschreibung: string
  /** Slug des Eintrags in der EmDash-Sammlung "pages", falls der Inhalt aus dem CMS kommt */
  cms?: string
  /** In sitemap.xml aufnehmen */
  sitemap: boolean
  /** Bild im ersten Bildschirm, wird im Kopf vorgeladen. media: nur dort, wo es sichtbar ist */
  vorladen?: { name: string; sizes: string; media?: string }
}

export const seiten: Seite[] = [
  {
    schluessel: 'start',
    pfad: '/',
    cms: 'start',
    titel: 'ByteWurst - Umsatzprognose und Reporting für Metzgereien',
    beschreibung:
      'ByteWurst rechnet nachts aus deinen Kassendaten aus, was nächste Woche über deine Theke geht. Um 4 Uhr früh liegt der Report im Postfach. Ohne neue Kasse.',
    sitemap: true,
    vorladen: { name: 'schaufenster', sizes: GROESSEN.schaufenster },
  },
  {
    schluessel: 'funktionen',
    pfad: '/funktionen/',
    cms: 'funktionen',
    titel: 'Funktionen - ByteWurst für Metzgereien',
    beschreibung:
      'Wochenprognose je Warengruppe, Aktions-Auswertung, Stoßzeiten, Bon-Kennzahlen und Filialvergleich. Was ByteWurst jede Nacht aus deiner Kasse rechnet.',
    sitemap: true,
    vorladen: { name: 'theke', sizes: GROESSEN.theke },
  },
  {
    schluessel: 'preise',
    pfad: '/preise/',
    cms: 'preise',
    titel: 'Preise - ByteWurst für Metzgereien',
    beschreibung:
      'Kostenlos starten mit einer Filiale und drei Produkten. Danach 5 Euro im Monat je 100.000 Euro Vorjahresumsatz. Die Landmetzgerei zahlt nicht wie die Kette.',
    sitemap: true,
    vorladen: { name: 'wurst-senf', sizes: GROESSEN.wurstSenf, media: '(min-width: 1024px)' },
  },
  {
    schluessel: 'impressum',
    pfad: '/impressum/',
    titel: 'Impressum - ByteWurst',
    beschreibung: 'Impressum der Seite über ByteWurst, die Umsatzprognose für Metzgereien: wer sie betreibt, wer sie gestaltet hat und von wem die Fotos stammen.',
    sitemap: true,
  },
  {
    schluessel: 'datenschutz',
    pfad: '/datenschutz/',
    titel: 'Datenschutz - ByteWurst',
    beschreibung: 'Datenschutz auf einen Blick: keine Cookies, kein Tracking, Schriften und Bilder vom eigenen Server. Spiele und Diagramme laufen nur in deinem Browser.',
    sitemap: true,
  },
  {
    schluessel: 'fehlt',
    pfad: '/404',
    titel: 'Nicht gefunden - ByteWurst',
    beschreibung: 'Diese Seite ist leider aus. Hätten wir mal eine Prognose gemacht. Zur Startseite, zu den Funktionen oder zu den Preisen von ByteWurst geht es hier weiter.',
    sitemap: false,
  },
]

export function seite(schluessel: SeitenSchluessel): Seite {
  return seiten.find((s) => s.schluessel === schluessel)!
}
