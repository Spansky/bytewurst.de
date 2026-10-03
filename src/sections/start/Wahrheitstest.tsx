import { useState } from 'react'
import Bild from '../../components/Bild'
import Wursti from '../../components/Wursti'
import { aktionswoche } from '../../data/beispiele'
import { prozent } from '../../lib/format'

/*
  Der Wahrheitstest für eine Aktion, nach der Geschichte auf bytewurst.de:
  Hackfleisch zum Aktionspreis, mehr Besucher, gleicher Umsatz. Erst raten,
  dann druckt der Bon. Die Bon-Höhe ist aus Besuchern und Umsatz abgeleitet.
*/
type Antwort = 'ja' | 'nein' | null

export default function Wahrheitstest() {
  const [antwort, setAntwort] = useState<Antwort>(null)
  const t = aktionswoche.aktionTag
  const besucher = aktionswoche.besucher[t] - 100
  const umsatz = aktionswoche.umsatz[t] - 100
  const bon = ((aktionswoche.umsatz[t] / aktionswoche.besucher[t]) - 1) * 100

  const zeilen: [string, string][] = [
    ['Besucher', prozent(besucher)],
    ['Umsatz gesamt', prozent(umsatz)],
    ['Ø Bon', prozent(bon)],
    ['Zusatzkäufe', 'kaum'],
    ['Nachproduktion', 'teurer'],
  ]

  return (
    <section aria-labelledby="test-titel" className="bg-senf py-20 md:py-28">
      <div className="rahmen grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <h2 id="test-titel" className="titel text-[clamp(2.5rem,5.6vw,4.6rem)]">
            Volle Theke heißt nicht volle Kasse.
          </h2>
          <p className="mt-6 text-lg leading-relaxed">
            Hackfleisch zum Aktionspreis, Anzeige in der Zeitung, der Laden war voll. Hat sich das gerechnet? Rate mal.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row" role="group" aria-label="Deine Antwort">
            <button
              type="button"
              aria-pressed={antwort === 'ja'}
              onClick={() => setAntwort('ja')}
              className="knopf border-2 border-tinte bg-papier text-tinte hover:bg-white aria-pressed:bg-tinte aria-pressed:text-papier"
            >
              Klar, der Laden war voll!
            </button>
            <button
              type="button"
              aria-pressed={antwort === 'nein'}
              onClick={() => setAntwort('nein')}
              className="knopf border-2 border-tinte bg-papier text-tinte hover:bg-white aria-pressed:bg-tinte aria-pressed:text-papier"
            >
              Ich hab da so ein Gefühl
            </button>
          </div>

          <div aria-live="polite">
            {antwort && (
              <div className="mt-8 rounded-3xl bg-papier/70 p-6">
                <p className="titel text-3xl">
                  {antwort === 'ja' ? 'Leider nein.' : 'Gutes Gefühl. Jetzt hast du es schwarz auf weiß.'}
                </p>
                <p className="mt-3 leading-relaxed">
                  So war es bei einem Kunden von ByteWurst: Es kamen tatsächlich mehr Leute. Aber sie kauften kaum etwas dazu,
                  sondern vor allem das ohnehin margenstarke Hackfleisch zum Spottpreis. Nachproduziert werden musste auch noch,
                  und zwar teurer. Diese Aktion macht er heute nicht mehr. Das Geld steckt er in die, die nachweislich
                  funktionieren.
                </p>
              </div>
            )}
          </div>

          <p className="mt-8 leading-relaxed">
            Nach jeder Aktion zeigt dir ByteWurst Besucher, Umsatz und Bon-Höhe im Vorher-Nachher-Vergleich. Und ob deine
            Kunden zusätzlich gekauft haben oder nur das Sonderangebot. So fließt dein Werbebudget nur noch in Aktionen, die
            sich rechnen.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:col-span-6 lg:max-w-none">
          <div className="overflow-hidden rounded-3xl shadow-[0_30px_60px_-30px_rgb(0_0_0/0.5)]">
            <Bild
              name="bon"
              sizes="(min-width: 1024px) 46vw, 448px"
              alt="Ein Kartenterminal von oben auf orangem Grund, aus dem ein langer weißer Kassenbon kommt."
              className="aspect-[3/2] h-auto w-full object-cover"
            />
          </div>

          <div
            className={`bon-schatten absolute top-6 right-3 w-[15.5rem] rotate-[3deg] transition-opacity duration-300 sm:right-8 sm:w-72 ${antwort ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
            aria-hidden={!antwort}
          >
            <div
              className="bon px-5 text-[0.8125rem] transition-[clip-path] duration-[1600ms] ease-[steps(16,end)] motion-reduce:transition-none"
              style={{ clipPath: antwort ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)' }}
            >
              <p className="text-center font-bold tracking-wide">BYTEWURST</p>
              <p className="text-center">Wahrheitstest</p>
              <div className="bon-linie my-3" />
              <p>Aktion: Hackfleisch</p>
              <p>Tag: Donnerstag</p>
              <div className="bon-linie my-3" />
              <ul className="space-y-1">
                {zeilen.map(([was, wert]) => (
                  <li key={was} className="ziffern flex justify-between gap-3">
                    <span>{was}</span>
                    <span className="font-bold">{wert}</span>
                  </li>
                ))}
              </ul>
              <div className="bon-linie my-3" />
              <p className="font-bold">ERGEBNIS</p>
              <p>Nicht wiederholen.</p>
              <p className="mt-2 text-[0.75rem] text-grau">Beispielauswertung</p>
            </div>
          </div>

          <Wursti
            stimmung={antwort ? 'staunt' : 'froh'}
            folgen
            className="absolute -bottom-10 -left-4 h-auto w-32 drop-shadow-[0_10px_10px_rgb(0_0_0/0.25)] sm:-left-10 sm:w-40"
          />
        </div>
      </div>
    </section>
  )
}
