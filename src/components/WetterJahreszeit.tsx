import { useState } from 'react'
import { grill } from '../data/beispiele'
import { skala, gerade, weich, type Punkt } from '../lib/kurve'
import Fenster from './Fenster'

/*
  Wetter oder Jahreszeit, nach dem Blogartikel auf bytewurst.de: Tag für Tag
  wirkt der Zusammenhang zwischen Temperatur und Grillgut schwach, zur Woche
  zusammengefasst stark. Die Korrelation wird aus den ausgedachten Daten
  echt ausgerechnet (src/data/beispiele.ts).
*/
const B = 600
const H = 240
const RAND = { l: 12, r: 12, o: 14, u: 26 }
const MONATE = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']

const komma = (r: number) => r.toFixed(2).replace('.', ',')

function normiert(werte: number[]) {
  const min = Math.min(...werte)
  const max = Math.max(...werte)
  return werte.map((v) => (v - min) / (max - min))
}

export default function WetterJahreszeit({ className = '' }: { className?: string }) {
  const [woche, setWoche] = useState(false)
  const reihe = woche ? grill.wochen : grill.tage
  const x = skala([0, reihe.length - 1], [RAND.l, B - RAND.r])
  const y = skala([0, 1], [H - RAND.u, RAND.o])
  const temp: Punkt[] = normiert(reihe.map((d) => d.temp)).map((v, i) => [x(i), y(v)])
  const absatz: Punkt[] = normiert(reihe.map((d) => d.absatz)).map((v, i) => [x(i), y(v)])
  const r = woche ? grill.rWoche : grill.rTag

  return (
    <Fenster titel="Umsatzreport, Grillgut und Temperatur" fuss="Ein ausgedachtes Jahr. Die Korrelation ist echt ausgerechnet." className={className}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-full border border-nacht-linie p-1" role="group" aria-label="Zeitraster">
          {[
            [false, 'Tag für Tag'],
            [true, 'Woche für Woche'],
          ].map(([w, name]) => (
            <button
              key={String(name)}
              type="button"
              aria-pressed={woche === w}
              onClick={() => setWoche(w as boolean)}
              className="min-h-10 rounded-full px-4 text-sm font-semibold text-nebel transition-colors aria-pressed:bg-kreide aria-pressed:text-nacht"
            >
              {name}
            </button>
          ))}
        </div>
        <p className="ziffern font-mono text-sm" aria-live="polite">
          Pearson-R <strong className="text-2xl text-senf">{komma(r)}</strong>
        </p>
      </div>

      <svg viewBox={`0 0 ${B} ${H}`} className="mt-4 h-auto w-full" role="img" aria-label={`Temperatur und Absatz über ein Jahr, ${woche ? 'je Woche' : 'je Tag'}`}>
        {MONATE.map((m, i) => (
          <text key={m} x={RAND.l + ((B - RAND.l - RAND.r) / 12) * (i + 0.5)} y={H - 6} textAnchor="middle" className="fill-nebel font-mono text-[10px]">
            {m}
          </text>
        ))}
        <path d={woche ? weich(absatz, 0.2) : gerade(absatz)} fill="none" stroke="var(--color-prognose)" strokeWidth={woche ? 3 : 1.2} strokeOpacity={woche ? 1 : 0.75} />
        <path d={woche ? weich(temp, 0.2) : gerade(temp)} fill="none" stroke="var(--color-senf)" strokeWidth={woche ? 3 : 1.2} strokeOpacity={woche ? 1 : 0.6} />
      </svg>
      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="h-1 w-5 rounded-full bg-prognose" /> Grillgut verkauft
        </span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="h-1 w-5 rounded-full bg-senf" /> Temperatur
        </span>
      </div>
      <p className="mt-4 rounded-lg bg-nacht-hell px-4 py-3 text-[0.9375rem] leading-relaxed text-kreide/90">
        {woche
          ? 'Zur Woche zusammengefasst sieht der Zusammenhang plötzlich stark aus. Aber Vorsicht: Was da gemeinsam steigt, ist vor allem die Jahreszeit. Der Sommer bringt Wärme und Grilllaune gleichzeitig.'
          : 'Tag für Tag wirkt der Zusammenhang schwach. Ein Feiertag, eine Großbestellung, der starke Samstag: An einzelnen Tagen passiert viel, das mit dem Wetter nichts zu tun hat.'}
      </p>
    </Fenster>
  )
}
