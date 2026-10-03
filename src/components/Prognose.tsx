import { useState } from 'react'
import { prognoseGruppen, prognoseTage } from '../data/beispiele'
import { euro } from '../lib/format'
import { skala, weich, type Punkt } from '../lib/kurve'
import Fenster from './Fenster'

/*
  Sieben-Tage-Prognose je Warengruppe: durchgezogen was war, gestrichelt was
  kommt. Warengruppe umschalten, Tag antippen. Zahlen ausgedacht.
*/
const B = 600
const H = 250

/** Für Screenreader: "Montag, Woche 2" statt nur "Mo" */
const LANG: Record<string, string> = { Mo: 'Montag', Di: 'Dienstag', Mi: 'Mittwoch', Do: 'Donnerstag', Fr: 'Freitag', Sa: 'Samstag' }
function prognoseTags(i: number) {
  return `${LANG[prognoseTage[i]]}${i > 5 ? ' nächste Woche' : ''}`
}
const RAND = { l: 16, r: 16, o: 30, u: 36 }

export default function Prognose({ className = '' }: { className?: string }) {
  const [gruppe, setGruppe] = useState(0)
  const [tag, setTag] = useState(6)
  const g = prognoseGruppen[gruppe]
  const werte = [...g.bisher, ...g.voraus]
  const max = Math.max(...prognoseGruppen.flatMap((x) => [...x.bisher, ...x.voraus])) * 1.08
  const x = skala([0, werte.length - 1], [RAND.l + 8, B - RAND.r - 8])
  const y = skala([0, max], [H - RAND.u, RAND.o])
  const heute = g.bisher.length - 1
  const bisher: Punkt[] = g.bisher.map((v, i): Punkt => [x(i), y(v)])
  const voraus: Punkt[] = [[x(heute), y(g.bisher[heute])], ...g.voraus.map((v, i): Punkt => [x(heute + 1 + i), y(v)])]
  const istVoraus = tag > heute

  return (
    <Fenster titel="Produktion, 7-Tage-Prognose" fuss="Durchgezogen bisher, gestrichelt Prognose. Beispielzahlen." className={className}>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Warengruppe wählen">
        {prognoseGruppen.map((p, i) => (
          <button
            key={p.name}
            type="button"
            aria-pressed={gruppe === i}
            onClick={() => setGruppe(i)}
            className="min-h-10 rounded-full border border-nacht-linie px-3.5 text-sm font-semibold text-nebel transition-colors hover:text-kreide aria-pressed:border-prognose aria-pressed:bg-prognose aria-pressed:text-nacht"
          >
            {p.name}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${B} ${H}`} className="mt-4 h-auto w-full" role="img" aria-label={`Umsatz ${g.name}: fünf Tage bisher, sieben Tage Prognose`}>
        <rect x={x(heute)} y={RAND.o - 10} width={B - RAND.r - x(heute)} height={H - RAND.u - RAND.o + 10} fill="var(--color-prognose)" fillOpacity="0.07" />
        <line x1={x(heute)} x2={x(heute)} y1={RAND.o - 10} y2={H - RAND.u} stroke="var(--color-nebel)" strokeOpacity="0.5" strokeDasharray="3 4" />
        <text x={x(heute) + 6} y={RAND.o} className="fill-nebel font-mono text-[20px] md:text-[11px]">
          HEUTE
        </text>
        <line x1={RAND.l} x2={B - RAND.r} y1={H - RAND.u} y2={H - RAND.u} stroke="var(--color-nacht-linie)" />
        <path d={weich(bisher)} fill="none" stroke="var(--color-prognose)" strokeWidth="3.5" strokeLinecap="round" />
        <path d={weich(voraus)} fill="none" stroke="var(--color-prognose)" strokeWidth="3" strokeDasharray="7 6" />
        {werte.map((v, i) => (
          <g key={i} onPointerEnter={() => setTag(i)} onClick={() => setTag(i)} className="cursor-pointer">
            <rect x={x(i) - 22} y={RAND.o} width="44" height={H - RAND.u - RAND.o} fill="transparent" />
            <circle
              cx={x(i)}
              cy={y(v)}
              r={i === tag ? 7 : 4.5}
              fill={i > heute ? 'var(--color-nacht)' : 'var(--color-prognose)'}
              stroke="var(--color-prognose)"
              strokeWidth="2.5"
            />
            <text x={x(i)} y={H - 10} textAnchor="middle" className={`font-mono text-[20px] md:text-[11px] ${i === tag ? 'fill-kreide' : 'fill-nebel'}`}>
              {prognoseTage[i]}
            </text>
          </g>
        ))}
      </svg>

      <label className="mt-2 flex items-center gap-3 text-sm text-nebel">
        <span className="etikett shrink-0">Tag</span>
        <input
          type="range"
          min={0}
          max={werte.length - 1}
          value={tag}
          onChange={(e) => setTag(Number(e.target.value))}
          aria-valuetext={`${prognoseTags(tag)}, ${euro(werte[tag])}`}
          className="w-full [accent-color:var(--color-prognose)]"
        />
      </label>

      <p className="ziffern mt-3 rounded-lg border border-nacht-linie px-3 py-2.5 text-center font-mono text-sm" aria-live="polite" aria-atomic="true">
        <strong className="text-kreide">{prognoseTags(tag)}</strong>
        <span className="text-nebel">{istVoraus ? ' erwartet: ' : ' verkauft: '}</span>
        <strong className="text-prognose">{euro(werte[tag])}</strong>
        <span className="text-nebel"> {g.name}</span>
      </p>
    </Fenster>
  )
}
