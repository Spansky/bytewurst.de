import { useState } from 'react'
import { firma } from '../data/betrieb'
import { tagesreport } from '../data/beispiele'
import { euro, euroGenau, ganz } from '../lib/format'

/*
  Die Morgenmail, so wie bytewurst.de sie zeigt: Kennzahlen von gestern, die
  fünf besten Produkte und die Stoßzeiten. Die Balken der Stoßzeiten lassen
  sich antippen. Zahlen aus src/data/beispiele.ts.
*/
export default function Tagesreport({ className = '' }: { className?: string }) {
  const max = Math.max(...tagesreport.stunden.map((s) => s.bons))
  const spitze = tagesreport.stunden.find((s) => s.bons === max)!
  const [gewaehlt, setGewaehlt] = useState<number>(spitze.uhr)
  const stunde = tagesreport.stunden.find((s) => s.uhr === gewaehlt)!

  return (
    <article
      aria-label="Beispiel einer Report-Mail von ByteWurst"
      className={`overflow-hidden rounded-2xl bg-papier text-tinte shadow-[0_30px_60px_-25px_rgb(0_0_0/0.5)] ring-1 ring-black/5 ${className}`}
    >
      <div className="border-b border-fuge bg-fliese px-5 py-3.5 text-sm">
        <p>
          <span className="text-grau">Von:</span> <span className="font-semibold">ByteWurst</span>{' '}
          <span className="text-grau">&lt;{firma.reportAbsender}&gt;</span>
        </p>
        <p>
          <span className="text-grau">Betreff:</span> <span className="font-semibold">Dein Tagesreport, 04:00 Uhr</span>
        </p>
      </div>

      <div className="space-y-5 px-5 py-5">
        <p className="text-lg font-bold">Guten Morgen! Gestern auf einen Blick:</p>

        <dl className="grid grid-cols-3 gap-2 text-center">
          {[
            ['Umsatz', euro(tagesreport.umsatz)],
            ['Bons', ganz(tagesreport.bons)],
            ['Ø Bon', euroGenau(tagesreport.durchschnitt)],
          ].map(([was, wert]) => (
            <div key={was} className="rounded-lg bg-fliese px-1 py-2.5">
              <dt className="etikett text-grau">{was}</dt>
              <dd className="ziffern mt-0.5 font-mono text-[clamp(0.95rem,3.6vw,1.2rem)] font-bold">{wert}</dd>
            </div>
          ))}
        </dl>

        <div>
          <h3 className="etikett text-grau">Top 5 Produkte</h3>
          <ol className="mt-2 divide-y divide-fuge">
            {tagesreport.top.map((p, i) => (
              <li key={p} className="flex items-baseline gap-3 py-1.5">
                <span className="ziffern w-4 font-mono text-sm text-wurst">{i + 1}</span>
                <span className="font-semibold">{p}</span>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="etikett text-grau">Stoßzeiten</h3>
            <p className="ziffern font-mono text-sm" aria-live="polite">
              {stunde.uhr} Uhr: <strong>{stunde.bons} Bons</strong>
            </p>
          </div>
          <div className="mt-2 flex h-20 items-end gap-1" role="group" aria-label="Bons je Stunde, zum Antippen">
            {tagesreport.stunden.map((s) => (
              <button
                key={s.uhr}
                type="button"
                aria-label={`${s.uhr} Uhr, ${s.bons} Bons`}
                aria-pressed={gewaehlt === s.uhr}
                onPointerEnter={() => setGewaehlt(s.uhr)}
                onFocus={() => setGewaehlt(s.uhr)}
                onClick={() => setGewaehlt(s.uhr)}
                className="group flex h-full flex-1 items-end"
              >
                <span
                  className="block w-full rounded-t-[3px] bg-wurst/35 transition-colors group-aria-pressed:bg-wurst"
                  style={{ height: `${(s.bons / max) * 100}%` }}
                />
              </button>
            ))}
          </div>
          <div className="ziffern mt-1 flex justify-between font-mono text-[0.6875rem] text-grau" aria-hidden="true">
            <span>7</span>
            <span>12</span>
            <span>18 Uhr</span>
          </div>
        </div>
      </div>
      <p className="border-t border-fuge px-5 py-2.5 text-xs text-grau">Beispielzahlen. Mit ByteWurst stehen hier deine echten.</p>
    </article>
  )
}
