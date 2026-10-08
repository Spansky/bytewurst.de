import { EURO_JE_100K, EFFIZIENZ_ANNAHME, monatsgebuehr, UMSATZ_MAX, UMSATZ_MIN, WECKLE_PREIS } from '../data/preise'
import { euro, euroGenau, ganz, umsatzKurz } from './format'

/*
  Rechnung des Preisrechners, gemeinsam für den Server (erste Anzeige) und
  das Skript in components/Preisrechner.astro. Der Regler läuft
  logarithmisch, sonst wäre die Landmetzgerei auf den ersten Millimeter
  gequetscht. Grenzen wie auf bytewurst.de.
*/
export const SCHRITTE = 1000

export function umsatzAus(stellung: number): number {
  const roh = UMSATZ_MIN * (UMSATZ_MAX / UMSATZ_MIN) ** (stellung / SCHRITTE)
  const raster = roh < 1_000_000 ? 10_000 : roh < 10_000_000 ? 100_000 : 1_000_000
  return Math.round(roh / raster) * raster
}

export function stellungAus(umsatz: number): number {
  return Math.round((Math.log(umsatz / UMSATZ_MIN) / Math.log(UMSATZ_MAX / UMSATZ_MIN)) * SCHRITTE)
}

/** Alle Texte, die sich mit dem Regler ändern */
export function rechnen(stellung: number) {
  const umsatz = umsatzAus(stellung)
  const gebuehr = monatsgebuehr(umsatz)
  const gebuehrText = Number.isInteger(gebuehr) ? euro(gebuehr) : euroGenau(gebuehr)
  return {
    umsatz: umsatzKurz(umsatz),
    gebuehr: gebuehrText,
    anteil: `${EURO_JE_100K} € je 100.000 € Jahresumsatz. Aufs Jahr gerechnet ${(((gebuehr * 12) / umsatz) * 100).toFixed(2).replace('.', ',')} % deines Umsatzes.`,
    weckle: `${ganz(Math.round(gebuehr / WECKLE_PREIS))} Leberkäsweckle`,
    ersparnis: `${euro(umsatz * EFFIZIENZ_ANNAHME)} im Jahr`,
    wertText: `${umsatzKurz(umsatz)} Jahresumsatz, ${gebuehrText} im Monat`,
  }
}
