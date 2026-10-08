import { aktionswoche as a, grill, prognoseGruppen, prognoseTage, TAGE_KURZ, wochenvergleich as w } from '../data/beispiele'
import { euro, prozent } from './format'
import { gerade, skala, weich, type Punkt } from './kurve'

/*
  Die SVG-Diagramme der Seite Funktionen als reine Funktionen, die Markup
  liefern. Der Server rendert damit den Startzustand (set:html), die
  Skripte in components/*.astro rendern bei jedem Antippen neu. Keine
  Diagrammbibliothek: ein paar Linien und Balken lohnen kein Paket.

  Schrift in viewBox-Einheiten: auf dem Handy 20px, ab md klein, sonst ist
  sie bei 375 px nur 5 bis 6 px groß.
*/

const r1 = (v: number) => v.toFixed(1)

// ---------------------------------------------------------------- Prognose

export const PROGNOSE = { B: 600, H: 250 }
const P_RAND = { l: 16, r: 16, o: 30, u: 36 }
const LANG: Record<string, string> = { Mo: 'Montag', Di: 'Dienstag', Mi: 'Mittwoch', Do: 'Donnerstag', Fr: 'Freitag', Sa: 'Samstag' }

/** Für Screenreader: "Montag nächste Woche" statt nur "Mo" */
export function prognoseTag(i: number) {
  return `${LANG[prognoseTage[i]]}${i > 5 ? ' nächste Woche' : ''}`
}

export function prognoseWerte(gruppe: number) {
  const g = prognoseGruppen[gruppe]
  return { g, werte: [...g.bisher, ...g.voraus], heute: g.bisher.length - 1 }
}

export function prognoseSvg(gruppe: number, tag: number): string {
  const { B, H } = PROGNOSE
  const { g, werte, heute } = prognoseWerte(gruppe)
  const max = Math.max(...prognoseGruppen.flatMap((x) => [...x.bisher, ...x.voraus])) * 1.08
  const x = skala([0, werte.length - 1], [P_RAND.l + 8, B - P_RAND.r - 8])
  const y = skala([0, max], [H - P_RAND.u, P_RAND.o])
  const bisher: Punkt[] = g.bisher.map((v, i): Punkt => [x(i), y(v)])
  const voraus: Punkt[] = [[x(heute), y(g.bisher[heute])], ...g.voraus.map((v, i): Punkt => [x(heute + 1 + i), y(v)])]

  return `
    <rect x="${r1(x(heute))}" y="${P_RAND.o - 10}" width="${r1(B - P_RAND.r - x(heute))}" height="${H - P_RAND.u - P_RAND.o + 10}" fill="var(--color-prognose)" fill-opacity="0.07"/>
    <line x1="${r1(x(heute))}" x2="${r1(x(heute))}" y1="${P_RAND.o - 10}" y2="${H - P_RAND.u}" stroke="var(--color-nebel)" stroke-opacity="0.5" stroke-dasharray="3 4"/>
    <text x="${r1(x(heute) + 6)}" y="${P_RAND.o}" class="fill-nebel font-mono text-[20px] md:text-[11px]">HEUTE</text>
    <line x1="${P_RAND.l}" x2="${B - P_RAND.r}" y1="${H - P_RAND.u}" y2="${H - P_RAND.u}" stroke="var(--color-nacht-linie)"/>
    <path d="${weich(bisher)}" fill="none" stroke="var(--color-prognose)" stroke-width="3.5" stroke-linecap="round"/>
    <path d="${weich(voraus)}" fill="none" stroke="var(--color-prognose)" stroke-width="3" stroke-dasharray="7 6"/>
    ${werte
      .map(
        (v, i) => `<g data-tag="${i}" class="cursor-pointer">
          <rect x="${r1(x(i) - 22)}" y="${P_RAND.o}" width="44" height="${H - P_RAND.u - P_RAND.o}" fill="transparent"/>
          <circle cx="${r1(x(i))}" cy="${r1(y(v))}" r="${i === tag ? 7 : 4.5}" fill="${i > heute ? 'var(--color-nacht)' : 'var(--color-prognose)'}" stroke="var(--color-prognose)" stroke-width="2.5"/>
          <text x="${r1(x(i))}" y="${H - 10}" text-anchor="middle" class="font-mono text-[20px] md:text-[11px] ${i === tag ? 'fill-kreide' : 'fill-nebel'}">${prognoseTage[i]}</text>
        </g>`,
      )
      .join('')}`
}

export function prognoseText(gruppe: number, tag: number): string {
  const { g, werte, heute } = prognoseWerte(gruppe)
  return `<strong class="text-kreide">${prognoseTag(tag)}</strong><span class="text-nebel">${tag > heute ? ' erwartet: ' : ' verkauft: '}</span><strong class="text-prognose">${euro(werte[tag])}</strong><span class="text-nebel"> ${g.name}</span>`
}

// -------------------------------------------------------- Wochenvergleich

export const WOCHE = { B: 600, H: 260 }
const W_RAND = { l: 52, r: 16, o: 16, u: 38 }
const W_MAX = 7000

export function wochenSvg(tag: number): string {
  const { B, H } = WOCHE
  const x = skala([0, 5], [W_RAND.l + 10, B - W_RAND.r - 10])
  const y = skala([0, W_MAX], [H - W_RAND.u, W_RAND.o])
  const diese: Punkt[] = w.diese.map((v, i) => [x(i), y(v)])
  const vorige: Punkt[] = w.vorige.map((v, i) => [x(i), y(v)])
  return `
    ${[0, 2000, 4000, 6000]
      .map(
        (v) => `<line x1="${W_RAND.l}" x2="${B - W_RAND.r}" y1="${r1(y(v))}" y2="${r1(y(v))}" stroke="var(--color-nacht-linie)"${v ? ' stroke-dasharray="3 5"' : ''}/>
        <text x="${W_RAND.l - 8}" y="${r1(y(v))}" dominant-baseline="middle" text-anchor="end" class="fill-nebel font-mono text-[20px] md:text-[11px]">${v ? `${v / 1000} k` : '0'}</text>`,
      )
      .join('')}
    <line x1="${r1(x(tag))}" x2="${r1(x(tag))}" y1="${W_RAND.o}" y2="${H - W_RAND.u}" stroke="var(--color-prognose)" stroke-opacity="0.35" stroke-dasharray="2 4"/>
    <path d="${weich(vorige)}" fill="none" stroke="var(--color-prognose)" stroke-opacity="0.55" stroke-width="2.5" stroke-dasharray="7 6"/>
    <path d="${weich(diese)}" fill="none" stroke="var(--color-prognose)" stroke-width="3.5" stroke-linecap="round"/>
    ${diese
      .map(
        ([px, py], i) => `<circle cx="${r1(vorige[i][0])}" cy="${r1(vorige[i][1])}" r="${i === tag ? 6 : 4}" fill="var(--color-nacht)" stroke="var(--color-prognose)" stroke-opacity="0.6" stroke-width="2"/>
        <circle cx="${r1(px)}" cy="${r1(py)}" r="${i === tag ? 7.5 : 5}" fill="var(--color-prognose)"/>
        <text x="${r1(px)}" y="${H - 10}" text-anchor="middle" class="font-mono text-[20px] md:text-[12px] ${i === tag ? 'fill-kreide' : 'fill-nebel'}">${TAGE_KURZ[i]}</text>`,
      )
      .join('')}`
}

export function wochenText(tag: number, tagName: string): string {
  const unterschied = ((w.diese[tag] - w.vorige[tag]) / w.vorige[tag]) * 100
  return `<strong class="text-kreide">${tagName}:</strong> ${euro(w.diese[tag])}<span class="text-nebel"> gegen ${euro(w.vorige[tag])} </span><strong class="${unterschied >= 0 ? 'text-prognose' : 'text-senf'}">${prozent(unterschied)}</strong>`
}

// ------------------------------------------------------ Wetter/Jahreszeit

export const WETTER = { B: 600, H: 240 }
const WJ_RAND = { l: 12, r: 12, o: 14, u: 32 }
const MONATE = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']

const komma = (r: number) => r.toFixed(2).replace('.', ',')

function normiert(werte: number[]) {
  const min = Math.min(...werte)
  const max = Math.max(...werte)
  return werte.map((v) => (v - min) / (max - min))
}

export function wetterSvg(woche: boolean): string {
  const { B, H } = WETTER
  const reihe = woche ? grill.wochen : grill.tage
  const x = skala([0, reihe.length - 1], [WJ_RAND.l, B - WJ_RAND.r])
  const y = skala([0, 1], [H - WJ_RAND.u, WJ_RAND.o])
  const temp: Punkt[] = normiert(reihe.map((d) => d.temp)).map((v, i) => [x(i), y(v)])
  const absatz: Punkt[] = normiert(reihe.map((d) => d.absatz)).map((v, i) => [x(i), y(v)])
  return `
    ${MONATE.map(
      (m, i) =>
        `<text x="${r1(WJ_RAND.l + ((B - WJ_RAND.l - WJ_RAND.r) / 12) * (i + 0.5))}" y="${H - 6}" text-anchor="middle" class="fill-nebel font-mono text-[20px] md:text-[10px]">${m}</text>`,
    ).join('')}
    <path d="${woche ? weich(absatz, 0.2) : gerade(absatz)}" fill="none" stroke="var(--color-prognose)" stroke-width="${woche ? 3 : 1.2}" stroke-opacity="${woche ? 1 : 0.75}"/>
    <path d="${woche ? weich(temp, 0.2) : gerade(temp)}" fill="none" stroke="var(--color-senf)" stroke-width="${woche ? 3 : 1.2}" stroke-opacity="${woche ? 1 : 0.6}"/>`
}

export function wetterR(woche: boolean): string {
  return komma(woche ? grill.rWoche : grill.rTag)
}

export const WETTER_TEXT = {
  woche:
    'Zur Woche zusammengefasst sieht der Zusammenhang plötzlich stark aus. Aber Vorsicht: Was da gemeinsam steigt, ist vor allem die Jahreszeit. Der Sommer bringt Wärme und Grilllaune gleichzeitig.',
  tag: 'Tag für Tag wirkt der Zusammenhang schwach. Ein Feiertag, eine Großbestellung, der starke Samstag: An einzelnen Tagen passiert viel, was mit dem Wetter nichts zu tun hat.',
}

// ----------------------------------------------------------- Aktionswoche

export const AKTION = { B: 600, H: 230 }
const A_RAND = { l: 52, r: 12, o: 30, u: 34 }

export function aktionSvg(tag: number): string {
  const { B, H } = AKTION
  const spalte = (B - A_RAND.l - A_RAND.r) / a.tage.length
  const y = skala([80, 135], [H - A_RAND.u, A_RAND.o])
  const t = a.aktionTag
  const balken = (mitte: number, wert: number, versatz: number, farbe: string) => {
    const oben = Math.min(y(wert), y(100))
    return `<rect x="${r1(mitte + versatz)}" y="${r1(oben)}" width="18" height="${r1(Math.max(2, Math.abs(y(wert) - y(100))))}" rx="3" fill="${farbe}"/>`
  }
  return `
    ${tag !== t ? `<rect x="${r1(A_RAND.l + spalte * tag)}" y="${A_RAND.o}" width="${r1(spalte)}" height="${H - A_RAND.u - A_RAND.o}" rx="6" fill="var(--color-kreide)" fill-opacity="0.06"/>` : ''}
    <rect x="${r1(A_RAND.l + spalte * t)}" y="${A_RAND.o - 18}" width="${r1(spalte)}" height="${H - A_RAND.u - A_RAND.o + 18}" rx="6" fill="var(--color-senf)" fill-opacity="0.1"/>
    <text x="${r1(A_RAND.l + spalte * (t + 0.5))}" y="${A_RAND.o - 5}" text-anchor="middle" class="fill-senf font-mono text-[20px] md:text-[11px] font-bold">AKTION</text>
    ${[90, 100, 110, 120, 130]
      .map(
        (v) => `<line x1="${A_RAND.l}" x2="${B - A_RAND.r}" y1="${r1(y(v))}" y2="${r1(y(v))}" stroke="var(--color-nacht-linie)"${v === 100 ? '' : ' stroke-dasharray="3 5"'}/>
        <text x="${A_RAND.l - 8}" y="${r1(y(v))}" dominant-baseline="middle" text-anchor="end" class="fill-nebel font-mono text-[20px] md:text-[10px]">${v}</text>`,
      )
      .join('')}
    ${a.tage
      .map((kuerzel, i) => {
        const mitte = A_RAND.l + spalte * (i + 0.5)
        return `${balken(mitte, a.besucher[i], -21, 'var(--color-kreide)')}${balken(mitte, a.umsatz[i], 3, 'var(--color-prognose)')}
          <text x="${r1(mitte)}" y="${H - 9}" text-anchor="middle" class="font-mono text-[20px] md:text-[12px] ${i === t ? 'fill-senf' : i === tag ? 'fill-kreide' : 'fill-nebel'}">${kuerzel}</text>`
      })
      .join('')}`
}

export function aktionText(tag: number, tagName: string): string {
  return `${tagName}: Besucher <strong class="text-kreide">${prozent(a.besucher[tag] - 100)}</strong>, Umsatz <strong class="text-prognose">${prozent(a.umsatz[tag] - 100)}</strong>`
}
