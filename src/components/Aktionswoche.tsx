import { useState } from 'react'
import { aktionswoche as a, TAGE_LANG } from '../data/beispiele'
import { prozent } from '../lib/format'
import { skala } from '../lib/kurve'
import Fenster from './Fenster'

/*
  Aktionswoche: Besucher und Umsatz je Tag gegenüber der Vorwoche. Am
  Aktionstag springen die Besucher hoch, der Umsatz nicht. So zeigt es
  bytewurst.de für die Hackfleisch-Aktion, Tageswerte ausgedacht.
*/
const B = 600
const H = 230
const RAND = { l: 52, r: 12, o: 30, u: 34 }

export default function Aktionswoche({ className = '' }: { className?: string }) {
  const spalte = (B - RAND.l - RAND.r) / a.tage.length
  const y = skala([80, 135], [H - RAND.u, RAND.o])
  const t = a.aktionTag
  const [tag, setTag] = useState<number>(t)
  return (
    <Fenster titel="Aktionswoche, Umsatz gegen Besucher" fuss="Gegenüber der Vorwoche, 100 = gleich viel. Beispielzahlen." className={className}>
      <svg viewBox={`0 0 ${B} ${H}`} className="h-auto w-full" role="img" aria-label={`Hackfleisch-Aktion am Donnerstag: Besucher ${prozent(a.besucher[t] - 100)}, Umsatz ${prozent(a.umsatz[t] - 100)}`}>
        {tag !== t && <rect x={RAND.l + spalte * tag} y={RAND.o} width={spalte} height={H - RAND.u - RAND.o} rx="6" fill="var(--color-kreide)" fillOpacity="0.06" />}
        <rect x={RAND.l + spalte * t} y={RAND.o - 18} width={spalte} height={H - RAND.u - RAND.o + 18} rx="6" fill="var(--color-senf)" fillOpacity="0.1" />
        <text x={RAND.l + spalte * (t + 0.5)} y={RAND.o - 5} textAnchor="middle" className="fill-senf font-mono text-[20px] md:text-[11px] font-bold">
          AKTION
        </text>
        {[90, 100, 110, 120, 130].map((v) => (
          <g key={v}>
            <line x1={RAND.l} x2={B - RAND.r} y1={y(v)} y2={y(v)} stroke="var(--color-nacht-linie)" strokeDasharray={v === 100 ? undefined : '3 5'} />
            <text x={RAND.l - 8} y={y(v)} dominantBaseline="middle" textAnchor="end" className="fill-nebel font-mono text-[20px] md:text-[10px]">
              {v}
            </text>
          </g>
        ))}
        {a.tage.map((kuerzel, i) => {
          const mitte = RAND.l + spalte * (i + 0.5)
          const balken = (wert: number, versatz: number, farbe: string) => {
            const oben = Math.min(y(wert), y(100))
            return <rect x={mitte + versatz} y={oben} width="18" height={Math.max(2, Math.abs(y(wert) - y(100)))} rx="3" fill={farbe} />
          }
          return (
            <g key={kuerzel}>
              {balken(a.besucher[i], -21, 'var(--color-kreide)')}
              {balken(a.umsatz[i], 3, 'var(--color-prognose)')}
              <text x={mitte} y={H - 9} textAnchor="middle" className={`font-mono text-[20px] md:text-[12px] ${i === t ? 'fill-senf' : i === tag ? 'fill-kreide' : 'fill-nebel'}`}>
                {kuerzel}
              </text>
            </g>
          )
        })}
      </svg>
      <div className="mt-3 grid grid-cols-6 gap-1.5" role="group" aria-label="Wochentag wählen">
        {a.tage.map((name, i) => (
          <button
            key={name}
            type="button"
            aria-pressed={tag === i}
            aria-label={`${TAGE_LANG[i]}${i === t ? ', Aktionstag' : ''}`}
            onClick={() => setTag(i)}
            className={`min-h-11 rounded-lg border border-nacht-linie bg-nacht-hell font-mono text-sm font-semibold transition-colors hover:text-kreide aria-pressed:border-senf aria-pressed:bg-senf/10 ${i === t ? 'text-senf' : 'text-nebel aria-pressed:text-kreide'}`}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex gap-4">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true" className="h-3 w-3 rounded-sm bg-kreide" /> Besucher
          </span>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true" className="h-3 w-3 rounded-sm bg-prognose" /> Umsatz
          </span>
        </div>
        <p className="ziffern font-mono" aria-live="polite" aria-atomic="true">
          {TAGE_LANG[tag]}: Besucher <strong className="text-kreide">{prozent(a.besucher[tag] - 100)}</strong>, Umsatz{' '}
          <strong className="text-prognose">{prozent(a.umsatz[tag] - 100)}</strong>
        </p>
      </div>
    </Fenster>
  )
}
