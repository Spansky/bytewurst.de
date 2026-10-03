/**
 * Beispielzahlen für die Diagramme. Auf der Seite immer als Beispiel
 * gekennzeichnet. Wo bytewurst.de selbst Zahlen zeigt, sind es genau diese
 * (Tagesreport, Top 5, Samstag im Wochenvergleich, Aktion +28 % / ±0 %).
 * Alles andere ist ausgedacht und nur dazu da, die Diagramme zu füllen.
 */
import { pearson, zufall } from '../lib/zufall'

export const TAGE_KURZ = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'] as const
export const TAGE_LANG = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'] as const

/** Tagesreport wie auf bytewurst.de */
export const tagesreport = {
  umsatz: 4812,
  bons: 318,
  durchschnitt: 15.1,
  top: ['Leberkäse', 'Wiener', 'Rindergulasch', 'Bratwurst', 'Krustenbraten'],
  /** Bons je Stunde von 7 bis 18 Uhr, ausgedacht */
  stunden: [
    { uhr: 7, bons: 14 },
    { uhr: 8, bons: 27 },
    { uhr: 9, bons: 38 },
    { uhr: 10, bons: 35 },
    { uhr: 11, bons: 41 },
    { uhr: 12, bons: 46 },
    { uhr: 13, bons: 22 },
    { uhr: 14, bons: 15 },
    { uhr: 15, bons: 19 },
    { uhr: 16, bons: 26 },
    { uhr: 17, bons: 24 },
    { uhr: 18, bons: 11 },
  ],
}

/** Wochenvergleich KW 24 gegen KW 23. Samstag wie auf bytewurst.de, Rest ausgedacht. */
export const wochenvergleich = {
  diese: [3210, 2870, 3420, 3810, 5120, 6390],
  vorige: [2980, 3050, 3180, 3560, 4780, 5904],
  dieseKw: 24,
  vorigeKw: 23,
}

/** Top-Warengruppen wie auf bytewurst.de, Anteile ausgedacht */
export const warengruppen = [
  { name: 'Wurst', anteil: 100 },
  { name: 'Frischfleisch', anteil: 78 },
  { name: 'Heiße Theke', anteil: 61 },
  { name: 'Aufschnitt', anteil: 44 },
  { name: 'Salate', anteil: 29 },
] as const

/**
 * Sieben-Tage-Prognose je Warengruppe: Montag bis Freitag dieser Woche, dann
 * sieben Öffnungstage voraus (Samstag bis Samstag). Umsatz in Euro, ausgedacht.
 */
export const prognoseGruppen = [
  { name: 'Wurst', bisher: [1180, 1120, 1260, 1310, 1720], voraus: [2350, 1040, 1150, 1230, 1300, 1880, 2420] },
  { name: 'Frischfleisch', bisher: [920, 860, 990, 1040, 1480], voraus: [2240, 780, 840, 910, 980, 1590, 2310] },
  { name: 'Heiße Theke', bisher: [610, 650, 700, 640, 690], voraus: [540, 620, 660, 700, 650, 710, 560] },
  { name: 'Salate', bisher: [240, 230, 260, 250, 330], voraus: [520, 210, 230, 250, 270, 360, 540] },
] as const
export const prognoseTage = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'] as const

/** Aktionswoche: Hackfleisch-Aktion am Donnerstag, Werte als Index (Vorwoche = 100) */
export const aktionswoche = {
  tage: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
  aktionTag: 3,
  besucher: [101, 98, 103, 128, 104, 102],
  umsatz: [99, 101, 100, 100, 97, 101],
}

/**
 * Wetter oder Jahreszeit (Blogartikel auf bytewurst.de vom 2026-06-05).
 * Ein ausgedachtes Jahr Grillgut: Die Jahreszeit treibt Wärme und Absatz
 * gleichzeitig, das Wetter einzelner Tage wirkt nur schwach, dazu kommt
 * der Wochenrhythmus und Rauschen. Die Korrelation wird echt ausgerechnet.
 */
function grilljahr() {
  const z = zufall(2026)
  const tage: { temp: number; absatz: number; woche: number }[] = []
  for (let t = 0; t < 364; t++) {
    const saison = Math.sin(((t - 100) / 364) * 2 * Math.PI) // Höhepunkt um Ende Juli
    const wetterSchwankung = (z() - 0.5) * 16
    const temp = 11 + saison * 9 + wetterSchwankung
    const wochentag = t % 7
    const rhythmus = [0.55, 0.5, 0.7, 0.9, 1.5, 2.1, 0][wochentag]
    if (rhythmus === 0) continue // sonntags zu
    // Abgestimmt auf Pearson-R von etwa 0,37 je Tag und 0,83 je Woche, wie im Blogartikel: schwach gegen stark
    const absatz = Math.max(0, (60 + saison * 28 + wetterSchwankung * 0.3) * rhythmus + (z() - 0.5) * 110)
    tage.push({ temp, absatz, woche: Math.floor(t / 7) })
  }
  const wochen: { temp: number; absatz: number }[] = []
  for (let w = 0; w < 52; w++) {
    const d = tage.filter((x) => x.woche === w)
    wochen.push({
      temp: d.reduce((s, x) => s + x.temp, 0) / d.length,
      absatz: d.reduce((s, x) => s + x.absatz, 0),
    })
  }
  return {
    tage,
    wochen,
    rTag: pearson(
      tage.map((x) => x.temp),
      tage.map((x) => x.absatz),
    ),
    rWoche: pearson(
      wochen.map((x) => x.temp),
      wochen.map((x) => x.absatz),
    ),
  }
}
export const grill = grilljahr()
