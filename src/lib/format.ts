/* Zahlen immer deutsch: Tausenderpunkt, Komma, Euro hinten. Intl liefert auf
   Server und Browser dasselbe, damit passt das vorgerenderte HTML. */

const euroGanz = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
const euroCent = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 })
const zahl = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 })
const zahl1 = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 1 })

/** 4.812 € */
export const euro = (wert: number) => euroGanz.format(wert)
/** 15,10 € */
export const euroGenau = (wert: number) => euroCent.format(wert)
/** 1.250 */
export const ganz = (wert: number) => zahl.format(wert)
/** 0,7 */
export const einsNachKomma = (wert: number) => zahl1.format(wert)

/** +8 %, −12 %, ±0 %. Das Minus ist U+2212, kein Bindestrich. */
export function prozent(wert: number): string {
  const r = Math.round(wert)
  if (r === 0) return '±0 %'
  return `${r > 0 ? '+' : '−'}${Math.abs(r)} %`
}

/** Umsatz kurz: 500.000 € -> "500.000 €", 2.400.000 € -> "2,4 Mio. €" */
export function umsatzKurz(wert: number): string {
  if (wert >= 1_000_000) return `${einsNachKomma(wert / 1_000_000)} Mio. €`
  return euro(wert)
}
