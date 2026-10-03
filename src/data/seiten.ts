/*
  Alle Routen mit Titel und Beschreibung. Daraus bauen main.tsx (welche Seite
  laden), entry-server.tsx (vorrendern) und scripts/prerender.mjs (Kopfbereich,
  sitemap.xml). Neue Seite: hier eintragen, Datei in src/seiten anlegen, in
  src/seiten/index.ts und src/entry-server.tsx verknüpfen.
*/

export type SeitenSchluessel = 'start' | 'funktionen' | 'preise' | 'impressum' | 'datenschutz' | 'fehlt'

export type Seite = {
  schluessel: SeitenSchluessel
  pfad: string
  titel: string
  beschreibung: string
  /** Ausgabedatei unter dist/ */
  datei: string
  /** Quelldatei der Seite, für modulepreload beim Vorrendern (Vite-Manifest) */
  quelle: string
  /** In sitemap.xml aufnehmen */
  sitemap: boolean
  /** Bild im ersten Bildschirm, wird im Kopf vorgeladen */
  vorladen?: { name: string; sizes: string }
}

export const seiten: Seite[] = [
  {
    schluessel: 'start',
    quelle: 'src/seiten/Start.tsx',
    pfad: '/',
    titel: 'ByteWurst - Umsatzprognose und Reporting für Metzgereien',
    beschreibung:
      'ByteWurst rechnet nachts aus deinen Kassendaten aus, was nächste Woche über deine Theke geht. Um 4 Uhr früh liegt der Report im Postfach. Ohne neue Kasse.',
    datei: 'index.html',
    sitemap: true,
    vorladen: { name: 'schaufenster', sizes: '(min-width: 1024px) 46vw, 100vw' },
  },
  {
    schluessel: 'funktionen',
    quelle: 'src/seiten/Funktionen.tsx',
    pfad: '/funktionen/',
    titel: 'Funktionen - ByteWurst für Metzgereien',
    beschreibung:
      'Wochenprognose je Warengruppe, Aktions-Auswertung, Stoßzeiten, Bon-Kennzahlen und Filialvergleich. Was ByteWurst jede Nacht aus deiner Kasse rechnet.',
    datei: 'funktionen/index.html',
    sitemap: true,
    vorladen: { name: 'theke', sizes: '(min-width: 1024px) 46vw, 100vw' },
  },
  {
    schluessel: 'preise',
    quelle: 'src/seiten/Preise.tsx',
    pfad: '/preise/',
    titel: 'Preise - ByteWurst für Metzgereien',
    beschreibung:
      'Kostenlos starten mit einer Filiale. Danach 5 Euro je 100.000 Euro Jahresumsatz im Monat. Die Landmetzgerei zahlt nicht wie die Kette.',
    datei: 'preise/index.html',
    sitemap: true,
  },
  {
    schluessel: 'impressum',
    quelle: 'src/seiten/Impressum.tsx',
    pfad: '/impressum/',
    titel: 'Impressum - ByteWurst',
    beschreibung: 'Impressum und Bildnachweis von ByteWurst.',
    datei: 'impressum/index.html',
    sitemap: true,
  },
  {
    schluessel: 'datenschutz',
    quelle: 'src/seiten/Datenschutz.tsx',
    pfad: '/datenschutz/',
    titel: 'Datenschutz - ByteWurst',
    beschreibung: 'Datenschutzerklärung: keine Cookies, kein Tracking, Schriften und Bilder vom eigenen Server.',
    datei: 'datenschutz/index.html',
    sitemap: true,
  },
  {
    schluessel: 'fehlt',
    quelle: 'src/seiten/NichtGefunden.tsx',
    pfad: '/404',
    titel: 'Nicht gefunden - ByteWurst',
    beschreibung: 'Diese Seite ist leider aus.',
    datei: '404.html',
    sitemap: false,
  },
]

/** Pfad aus der Adresszeile auf eine Seite abbilden, auch ohne Schrägstrich am Ende */
export function seiteZuPfad(pfad: string): Seite {
  const sauber = pfad.replace(/index\.html$/, '').replace(/\/?$/, '/')
  return seiten.find((s) => s.pfad === sauber) ?? seiten.find((s) => s.schluessel === 'fehlt')!
}
