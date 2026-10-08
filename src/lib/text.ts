import { EURO_JE_100K, tarife } from '../data/preise'
import { spielArtikel } from '../data/start'

/*
  Texte aus EmDash aufbereiten. Preise und Spielzahlen stehen nie im CMS,
  sondern einmal in src/data. Im Text stehen dafür Platzhalter in
  geschweiften Klammern, etwa "{euro_je_100k} € im Monat". Ein unbekannter
  Platzhalter bleibt sichtbar stehen, damit er in der Vorschau auffällt.
*/

/** "1 Filiale, 3 Produkte und Basis-Reports" */
const kostenlosLeistungen = tarife[0].leistungen.join(', ').replace(/, ([^,]*)$/, ' und $1')

const platzhalter: Record<string, string> = {
  euro_je_100k: String(EURO_JE_100K),
  kostenlos_leistungen: kostenlosLeistungen,
  artikel: spielArtikel,
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
