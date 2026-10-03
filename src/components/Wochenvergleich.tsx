import { useState } from 'react'
import { TAGE_KURZ, TAGE_LANG, wochenvergleich as w } from '../data/beispiele'
import { euro, prozent } from '../lib/format'
import { skala, weich, type Punkt } from '../lib/kurve'
import Fenster from './Fenster'

/*
  Der Wochenvergleich zum Antippen, wie auf bytewurst.de: diese Woche gegen
  die Vorwoche, ein Tag ist ausgewählt und zeigt beide Werte.
*/
const B = 600
const H = 260
const RAND = { l: 44, r: 16, o: 16, u: 34 }
const MAX = 7000

export default function Wochenvergleich({ className = '' }: { className?: string }) {
  const [tag, setTag] = useState(5)
  const x = skala([0, 5], [RAND.l + 10, B - RAND.r - 10])
  const y = skala([0, MAX], [H - RAND.u, RAND.o])
  const diese: Punkt[] = w.diese.map((v, i) => [x(i), y(v)])
  const vorige: Punkt[] = w.vorige.map((v, i) => [x(i), y(v)])
  const unterschied = ((w.diese[tag] - w.vorige[tag]) / w.vorige[tag]) * 100

  return (
    <Fenster
      titel="Wochenvergleich"
      fuss={`KW ${w.dieseKw} gegen KW ${w.vorigeKw}, gestrichelt die Vorwoche. Beispielzahlen.`}
      className={className}
    >
      <svg viewBox={`0 0 ${B} ${H}`} className="h-auto w-full" role="img" aria-label={`Umsatz je Wochentag, KW ${w.dieseKw} gegen KW ${w.vorigeKw}`}>
        {[0, 2000, 4000, 6000].map((v) => (
          <g key={v}>
            <line x1={RAND.l} x2={B - RAND.r} y1={y(v)} y2={y(v)} stroke="var(--color-nacht-linie)" strokeDasharray={v ? '3 5' : undefined} />
            <text x={RAND.l - 8} y={y(v) + 4} textAnchor="end" className="fill-nebel font-mono text-[11px]">
              {v ? `${v / 1000} k` : '0'}
            </text>
          </g>
        ))}
        <line x1={x(tag)} x2={x(tag)} y1={RAND.o} y2={H - RAND.u} stroke="var(--color-prognose)" strokeOpacity="0.35" strokeDasharray="2 4" />
        <path d={weich(vorige)} fill="none" stroke="var(--color-prognose)" strokeOpacity="0.55" strokeWidth="2.5" strokeDasharray="7 6" />
        <path d={weich(diese)} fill="none" stroke="var(--color-prognose)" strokeWidth="3.5" strokeLinecap="round" />
        {diese.map(([px, py], i) => (
          <g key={i}>
            <circle cx={vorige[i][0]} cy={vorige[i][1]} r={i === tag ? 6 : 4} fill="var(--color-nacht)" stroke="var(--color-prognose)" strokeOpacity="0.6" strokeWidth="2" />
            <circle cx={px} cy={py} r={i === tag ? 7.5 : 5} fill="var(--color-prognose)" />
            <text x={px} y={H - 10} textAnchor="middle" className={`font-mono text-[12px] ${i === tag ? 'fill-kreide' : 'fill-nebel'}`}>
              {TAGE_KURZ[i]}
            </text>
          </g>
        ))}
      </svg>

      <div className="mt-3 grid grid-cols-6 gap-1.5" role="group" aria-label="Wochentag wählen">
        {TAGE_KURZ.map((t, i) => (
          <button
            key={t}
            type="button"
            aria-pressed={tag === i}
            aria-label={TAGE_LANG[i]}
            onClick={() => setTag(i)}
            className="min-h-11 rounded-lg border border-nacht-linie bg-nacht-hell font-mono text-sm font-semibold text-nebel transition-colors hover:text-kreide aria-pressed:border-prognose aria-pressed:bg-prognose/10 aria-pressed:text-prognose"
          >
            {t}
          </button>
        ))}
      </div>
      <p className="ziffern mt-3 rounded-lg border border-nacht-linie px-3 py-2.5 text-center font-mono text-sm" aria-live="polite">
        <strong className="text-kreide">{TAGE_LANG[tag]}:</strong> {euro(w.diese[tag])}
        <span className="text-nebel"> gegen {euro(w.vorige[tag])} </span>
        <strong className={unterschied >= 0 ? 'text-prognose' : 'text-senf'}>{prozent(unterschied)}</strong>
      </p>
    </Fenster>
  )
}
