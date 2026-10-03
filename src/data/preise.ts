/**
 * Tarife und Fragen von bytewurst.de/de/pricing, Stand 2026-10-03.
 * Preise nie ins Markup schreiben, nur hier.
 */
import { firma } from './betrieb'

/** Early Adopter: so viel Euro im Monat je 100.000 Euro Jahresumsatz */
export const EURO_JE_100K = 5

/** Monatliche Lizenzgebühr aus dem Jahresumsatz des Vorjahres */
export function monatsgebuehr(jahresumsatz: number): number {
  return (jahresumsatz / 100_000) * EURO_JE_100K
}

/**
 * Die Einsparung, die bytewurst.de im eigenen Preisrechner zeigt: konservativ
 * 2 % Effizienzgewinn durch bessere Prognosen und weniger Verschwendung. Auf
 * der Seite als Annahme von ByteWurst gekennzeichnet.
 */
export const EFFIZIENZ_ANNAHME = 0.02

/** Spaßvergleich im Rechner, ausdrücklich als Annahme gekennzeichnet */
export const WECKLE_PREIS = 2.5

/** Grenzen des Rechners wie auf bytewurst.de */
export const UMSATZ_MIN = 100_000
export const UMSATZ_MAX = 300_000_000
export const UMSATZ_START = 500_000

export type Tarif = {
  name: string
  satz: string
  preis: string
  einheit?: string
  leistungen: string[]
  knopf: { text: string; ziel?: string }
  empfohlen?: boolean
}

export const tarife: Tarif[] = [
  {
    name: 'Kostenlos',
    satz: 'Zum Ausprobieren mit begrenzten Daten.',
    preis: '0 €',
    einheit: 'im Monat',
    leistungen: ['1 Filiale', '3 Produkte', 'Basis-Reports'],
    knopf: { text: 'Kostenlos starten', ziel: firma.registrieren },
  },
  {
    name: 'Early Adopter',
    satz: 'Alle Funktionen. Und du redest mit, wenn neue dazukommen.',
    preis: `${EURO_JE_100K} €`,
    einheit: 'je 100.000 € Vorjahresumsatz, im Monat, jährlich abgerechnet',
    leistungen: [
      'Beliebig viele Filialen',
      'Beliebig viele Produkte',
      'Alle Reports und Auswertungen',
      'Direkter Draht zum Entwicklungsteam',
      'Mitsprache bei neuen Funktionen',
    ],
    knopf: { text: 'Early Adopter werden', ziel: firma.registrieren },
    empfohlen: true,
  },
  {
    name: 'Enterprise',
    satz: 'Für große Betriebe mit eigenen Anforderungen. Kommt in Kürze.',
    preis: 'Auf Anfrage',
    leistungen: [
      'Alles aus Early Adopter',
      'Eigene Anbindungen',
      'Betrieb auf deinen eigenen Servern',
      'Persönlicher Support',
      '99,9 % zugesicherte Verfügbarkeit',
      'Reports nach Maß',
    ],
    knopf: { text: 'Kommt bald' },
  },
]

/** Funktionsvergleich wie auf bytewurst.de */
export const vergleich: { was: string; werte: [string, string, string] }[] = [
  { was: 'Filialen', werte: ['1', 'beliebig viele', 'beliebig viele'] },
  { was: 'Produkte', werte: ['3', 'beliebig viele', 'beliebig viele'] },
  { was: 'Daten-Upload', werte: ['ja', 'ja', 'ja'] },
  { was: 'Reports und Auswertungen', werte: ['Basis', 'alle', 'alle, dazu eigene'] },
  { was: 'Eigene Anbindungen', werte: ['nein', 'nein', 'ja'] },
  { was: 'Auf eigenen Servern', werte: ['nein', 'nein', 'ja'] },
  { was: 'Zugesicherte Verfügbarkeit', werte: ['nein', 'nein', '99,9 %'] },
]

export const fragen = [
  {
    frage: 'Welcher Umsatz zählt für den Preis?',
    antwort:
      'Dein Gesamtumsatz aus dem Vorjahr. Weil ByteWurst deine Umsatzdaten ohnehin für Prognosen und Reports verarbeitet, rechnet sie den Betrag selbst aus. Du musst nichts melden.',
  },
  {
    frage: 'Kann ich später wechseln?',
    antwort:
      'Ja. Von Kostenlos auf Early Adopter geht jederzeit. Ein Wechsel zurück gilt zum Ende deines Abrechnungszeitraums.',
  },
  {
    frage: 'Wie bezahle ich?',
    antwort: 'Per Banküberweisung (SEPA) oder auf Rechnung. Kreditkarte kommt bald.',
  },
  {
    frage: 'Wie lange bin ich gebunden?',
    antwort:
      'Early Adopter wird jährlich abgerechnet, du kannst aber jederzeit kündigen. Deine Daten bleiben bis zum Ende des bezahlten Zeitraums zugänglich.',
  },
]
