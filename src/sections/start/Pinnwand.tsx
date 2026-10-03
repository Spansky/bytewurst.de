import { useState, type CSSProperties } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotate } from '@fortawesome/free-solid-svg-icons/faRotate'
import Wursti from '../../components/Wursti'
import { zettel, type ZettelFarbe } from '../../data/start'

/*
  Die Pinnwand in der Wurstküche: fünf Zettel mit dem, was jeder Metzger
  kennt. Antippen dreht einen Zettel um, hinten steht, was ByteWurst daran
  ändert. Beide Seiten liegen in derselben Rasterzelle, damit der Zettel so
  hoch ist wie die längere Seite.
*/

const FARBEN: Record<ZettelFarbe, string> = {
  papier: 'bg-papier',
  senf: 'bg-senf-hell',
  rosa: 'bg-[#f6d3c4]',
}
const DREHUNG = ['-2.5deg', '1.8deg', '-1deg', '2.4deg', '-1.6deg']
const NADEL = ['bg-wurst', 'bg-prognose', 'bg-senf', 'bg-wurst', 'bg-tinte']

export default function Pinnwand() {
  const [umgedreht, setUmgedreht] = useState<boolean[]>(() => zettel.map(() => false))
  const umdrehen = (i: number) => setUmgedreht((u) => u.map((x, j) => (j === i ? !x : x)))

  return (
    <section aria-labelledby="pinnwand-titel" className="bg-papier py-20 md:py-28">
      <div className="rahmen grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <h2 id="pinnwand-titel" className="titel text-[clamp(2.5rem,5.4vw,4.4rem)]">
            Montags zu viel. Samstags zu wenig.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-tinte/85">
            Wer bestellt und produziert, entscheidet aus Erfahrung. Das klappt gut, bis die Erfahrung Urlaub hat. Oder in
            Rente geht.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-tinte/85">
            Kommen dir diese Zettel bekannt vor? Dreh sie um. Hinten steht, was ByteWurst daraus macht.
          </p>
        </div>

        <div className="lg:col-span-8">
          <div className="rounded-[1.25rem] border-[10px] border-[#8a6440] bg-kork p-5 shadow-[inset_0_2px_14px_rgb(0_0_0/0.35)] [background-image:radial-gradient(rgb(0_0_0/0.13)_1px,transparent_1.4px),radial-gradient(rgb(255_255_255/0.12)_1px,transparent_1.4px)] [background-position:0_0,7px_9px] [background-size:13px_13px] sm:p-8">
            <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {zettel.map((z, i) => (
                <li
                  key={z.vorne}
                  data-einblenden="kippen"
                  style={{ '--kipp': `${i % 2 ? 6 : -6}deg`, '--ruhe': DREHUNG[i], '--verzug': `${i * 90}ms` } as CSSProperties}
                  className={i === 4 ? 'sm:col-span-2 xl:col-span-1' : undefined}
                >
                  <button
                    type="button"
                    aria-pressed={umgedreht[i]}
                    aria-label={`Zettel umdrehen: ${z.vorne}`}
                    onClick={() => umdrehen(i)}
                    className="zettel group relative block w-full text-left [perspective:900px]"
                  >
                    <span aria-hidden="true" className={`absolute -top-2 left-1/2 z-10 h-5 w-5 -translate-x-1/2 rounded-full ${NADEL[i]} shadow-[0_3px_4px_rgb(0_0_0/0.4),inset_-2px_-2px_0_rgb(0_0_0/0.2)]`} />
                    <span className="zettel-innen grid">
                      <span
                        className={`zettel-seite flex min-h-52 flex-col p-5 pt-7 [grid-area:1/1] ${FARBEN[z.farbe]} shadow-[0_10px_18px_-8px_rgb(0_0_0/0.45)]`}
                      >
                        <span className="text-[1.375rem] leading-tight font-bold" style={{ fontStretch: '80%' }}>
                          {z.vorne}
                        </span>
                        <span className="mt-2 text-tinte/70">{z.vorneKlein}</span>
                        <span className="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-semibold text-wurst-tief">
                          <FontAwesomeIcon icon={faRotate} className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-180" aria-hidden="true" />
                          Umdrehen
                        </span>
                      </span>
                      <span
                        className="zettel-seite zettel-rueck flex min-h-52 flex-col bg-nacht p-5 pt-7 text-kreide [grid-area:1/1] shadow-[0_10px_18px_-8px_rgb(0_0_0/0.45)]"
                      >
                        <span className="flex items-center gap-2">
                          <Wursti ohneBeine blinzeln={false} className="h-5 w-auto" />
                          <span className="etikett text-prognose">Mit ByteWurst</span>
                        </span>
                        <span className="mt-3 text-[0.9375rem] leading-snug">{z.hinten}</span>
                      </span>
                    </span>
                  </button>
                  {/* Die Rückseite für Screenreader ansagen, der Knopfname bleibt fest */}
                  <p className="sr-only" aria-live="polite">
                    {umgedreht[i] ? z.hinten : ''}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
