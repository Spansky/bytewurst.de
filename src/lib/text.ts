import { EFFIZIENZ_ANNAHME, EURO_JE_100K, monatsgebuehr, tarife, UMSATZ_START, WECKLE_PREIS } from '../data/preise'
import { spielArtikel } from '../data/start'
import { euro, euroGenau, ganz } from './format'

/*
  Texte aus EmDash aufbereiten. Preise und Spielzahlen stehen nie im CMS,
  sondern einmal in src/data. Im Text stehen dafür Platzhalter in
  geschweiften Klammern, etwa "{euro_je_100k} € im Monat". Ein unbekannter
  Platzhalter bleibt sichtbar stehen, damit er in der Vorschau auffällt.
*/

/** "1 Filiale, 3 Produkte und Basis-Reports" */
const kostenlosLeistungen = tarife[0].leistungen.join(', ').replace(/, ([^,]*)$/, ' und $1')

/* Rechenbeispiel für Texte über den Preis, derselbe Startwert wie im Preisrechner */
const beispielGebuehr = monatsgebuehr(UMSATZ_START)

const platzhalter: Record<string, string> = {
  euro_je_100k: String(EURO_JE_100K),
  kostenlos_leistungen: kostenlosLeistungen,
  artikel: spielArtikel,
  beispiel_umsatz: euro(UMSATZ_START),
  beispiel_gebuehr: euro(beispielGebuehr),
  beispiel_weckle: ganz(Math.round(beispielGebuehr / WECKLE_PREIS)),
  weckle_preis: euroGenau(WECKLE_PREIS),
  effizienz: `${EFFIZIENZ_ANNAHME * 100} %`,
  beispiel_ersparnis: euro(UMSATZ_START * EFFIZIENZ_ANNAHME),
}

type PtKnoten = { _type?: string; text?: string; children?: PtKnoten[]; [schluessel: string]: unknown }

/** Platzhalter in allen Textstücken eines Portable-Text-Inhalts ersetzen (Blog) */
export function ptEinsetzen<T>(bloecke: T): T {
  if (!Array.isArray(bloecke)) return bloecke
  const knoten = (k: PtKnoten): PtKnoten => ({
    ...k,
    ...(typeof k.text === 'string' ? { text: einsetzen(k.text) } : {}),
    ...(Array.isArray(k.children) ? { children: k.children.map(knoten) } : {}),
  })
  return bloecke.map(knoten) as T
}

export function einsetzen(text: string | null | undefined): string {
  return (text ?? '').replace(/\{([a-z0-9_]+)\}/g, (ganz, name: string) => platzhalter[name] ?? ganz)
}

/** Mehrzeiliges Textfeld in Absätze, getrennt durch eine Leerzeile */
export function absaetze(text: string | null | undefined): string[] {
  return einsetzen(text)
    .split(/\n\s*\n/)
    .map((a) => a.trim())
    .filter(Boolean)
}
