import { useId, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight'
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons/faRotateLeft'
import Knoepfe from '../../components/Knoepfe'
import Wursti from '../../components/Wursti'
import { spielArtikel, spielHoechstens, spielRunden } from '../../data/start'
import { ganz } from '../../lib/format'

/*
  Bauchgefühl gegen ByteWurst: drei Tage, ein Artikel. Erst schätzt man
  selbst, dann deckt die Kasse auf. Die Zahlen sind ausgedacht und auf der
  Seite so gekennzeichnet (src/data/start.ts).
*/

const RUNDEN_NAME = ['Tag eins von drei', 'Tag zwei von drei', 'Tag drei von drei']

type Ergebnis = { plan: number; prognose: number; verkauft: number }

/** Ein Balken in Form einer Wurst. Was über den Verkauf hinausgeht, ist schraffiert (übrig). */
function Wurstbalken({
  name,
  wert,
  verkauft,
  farbe,
  sichtbar,
  verzug,
}: {
  name: string
  wert: number
  verkauft?: number
  farbe: string
  sichtbar: boolean
  verzug: number
}) {
  const breite = (wert / spielHoechstens) * 100
  const bisVerkauf = verkauft === undefined ? 100 : Math.min(100, (verkauft / Math.max(wert, 1)) * 100)
  return (
    <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[8rem_minmax(0,1fr)]">
      <span className="text-sm font-semibold text-kreide/85">{name}</span>
      <div className="relative h-9">
        <div
          className="absolute inset-y-0 left-0 overflow-hidden rounded-full shadow-[inset_0_-4px_0_rgb(0_0_0/0.18),inset_0_3px_0_rgb(255_255_255/0.18)] transition-[width] duration-[900ms] ease-[var(--ease-weich)] motion-reduce:transition-none"
          style={{ width: sichtbar ? `max(2.25rem, ${breite}%)` : '0%', transitionDelay: `${verzug}ms`, background: farbe }}
        >
          {bisVerkauf < 100 && (
            <div
              className="absolute inset-y-0 right-0 [background-image:repeating-linear-gradient(-45deg,rgb(20_22_25/0.55)_0_6px,transparent_6px_12px)]"
              style={{ left: `${bisVerkauf}%` }}
            />
          )}
          {/* Abbindestellen wie bei einer Wurstkette */}
          <div className="absolute inset-0 [background-image:repeating-linear-gradient(90deg,transparent_0_58px,rgb(0_0_0/0.16)_58px_60px)]" />
        </div>
        <span
          className="ziffern absolute top-1/2 -translate-y-1/2 pl-3 font-mono text-sm font-bold text-kreide transition-[left] duration-[900ms] ease-[var(--ease-weich)] motion-reduce:transition-none"
          style={{ left: sichtbar ? `max(2.25rem, ${breite}%)` : '0%', transitionDelay: `${verzug}ms` }}
        >
          {sichtbar ? ganz(wert) : '?'}
        </span>
      </div>
    </div>
  )
}

function urteil(plan: number, verkauft: number): string {
  const d = plan - verkauft
  if (Math.abs(d) <= 4) return 'Respekt, fast genau. Da steckt Erfahrung drin.'
  if (d > 0) return `${ganz(d)} Bratwürste übrig. Ab in die Abschrift.`
  return `${ganz(-d)} Bratwürste zu wenig. Die letzten Kunden gehen ohne nach Hause.`
}

export default function Planspiel() {
  const reglerId = useId()
  const [runde, setRunde] = useState(0)
  const [plan, setPlan] = useState(100)
  const [aufgedeckt, setAufgedeckt] = useState(false)
  const [ergebnisse, setErgebnisse] = useState<Ergebnis[]>([])
  const fertig = ergebnisse.length === spielRunden.length && runde === spielRunden.length - 1 && aufgedeckt
  const r = spielRunden[runde]

  const aufdecken = () => {
    setAufgedeckt(true)
    setErgebnisse((e) => [...e.slice(0, runde), { plan, prognose: r.prognose, verkauft: r.verkauft }])
  }
  const weiter = () => {
    setRunde((x) => x + 1)
    setAufgedeckt(false)
  }
  const neu = () => {
    setRunde(0)
    setPlan(100)
    setAufgedeckt(false)
    setErgebnisse([])
  }

  const summeDu = ergebnisse.reduce((s, e) => s + Math.abs(e.plan - e.verkauft), 0)
  const summeBw = ergebnisse.reduce((s, e) => s + Math.abs(e.prognose - e.verkauft), 0)
  const daneben = Math.abs(plan - r.verkauft)

  return (
    <section aria-labelledby="spiel-titel" className="fokus-hell relative bg-nacht py-20 text-kreide md:py-28">
      <div className="rahmen">
        <div className="max-w-3xl">
          <h2 id="spiel-titel" className="titel text-[clamp(2.5rem,5.6vw,4.6rem)]">
            Plan mal selbst. Gegen die Wurst.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-kreide/85">
            Drei Tage, ein Artikel: {spielArtikel}. Du schätzt, wie viele Stück du produzierst. ByteWurst schätzt auch. Dann
            zeigt die Kasse, was wirklich über die Theke gegangen ist.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Linke Karte: die Lage und der Regler */}
          <div className="rounded-3xl bg-nacht-hell p-6 ring-1 ring-nacht-linie md:p-8 lg:col-span-5">
            <h3 className="titel text-4xl md:text-5xl">{r.tag}</h3>
            <p className="mt-1 font-semibold text-senf">{RUNDEN_NAME[runde]}</p>
            <p className="mt-4 leading-relaxed text-kreide/85">{r.lage}</p>
            <p className="mt-3 font-mono text-sm text-nebel">
              Letzte Woche am selben Tag: <strong className="text-kreide">{r.vorwoche} Stück</strong>
            </p>

            <div className="mt-8">
              <label htmlFor={reglerId} className="font-semibold">
                Wie viele produzierst du?
              </label>
              <p className="titel ziffern mt-2 text-6xl text-senf">
                {ganz(plan)} <span className="text-2xl text-kreide/70">Stück</span>
              </p>
              <input
                id={reglerId}
                type="range"
                min={0}
                max={spielHoechstens}
                step={1}
                value={plan}
                disabled={aufgedeckt}
                onChange={(e) => setPlan(Number(e.target.value))}
                aria-valuetext={`${plan} Stück`}
                className="wurstregler wurstregler-dunkel mt-3 w-full disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="mt-6">
              {!aufgedeckt ? (
                <button type="button" onClick={aufdecken} className="knopf knopf-senf w-full sm:w-auto">
                  Ab in die Wurstküche
                  <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : !fertig ? (
                <button type="button" onClick={weiter} className="knopf knopf-senf w-full sm:w-auto">
                  Nächster Tag
                  <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : (
                <button type="button" onClick={neu} className="knopf knopf-linie w-full text-kreide sm:w-auto">
                  <FontAwesomeIcon icon={faRotateLeft} className="h-4 w-4" aria-hidden="true" />
                  Noch mal von vorn
                </button>
              )}
            </div>
          </div>

          {/* Rechte Karte: Auflösung */}
          <div className="flex flex-col rounded-3xl bg-nacht-hell p-6 ring-1 ring-nacht-linie md:p-8 lg:col-span-7">
            <div className="space-y-4">
              <Wurstbalken name="Dein Plan" wert={plan} verkauft={aufgedeckt ? r.verkauft : undefined} farbe="var(--color-senf)" sichtbar verzug={0} />
              <Wurstbalken name="ByteWurst" wert={r.prognose} verkauft={r.verkauft} farbe="var(--color-prognose)" sichtbar={aufgedeckt} verzug={150} />
              <Wurstbalken name="Verkauft" wert={r.verkauft} farbe="var(--color-wurst)" sichtbar={aufgedeckt} verzug={350} />
            </div>
            <p className="mt-3 text-xs text-nebel">Schraffiert: übrig geblieben.</p>

            <div className="mt-auto flex items-end gap-4 pt-8">
              <Wursti
                brille={!aufgedeckt}
                stimmung={!aufgedeckt ? 'froh' : daneben <= 10 ? 'lacht' : 'staunt'}
                folgen
                className="h-auto w-24 shrink-0 sm:w-28"
              />
              <div className="min-w-0" aria-live="polite" aria-atomic="true">
                {!aufgedeckt ? (
                  <p className="text-lg leading-snug">
                    Meine Zahl steht schon. <span className="text-nebel">Du zuerst.</span>
                  </p>
                ) : (
                  <>
                    <p className="text-lg leading-snug font-semibold">{urteil(plan, r.verkauft)}</p>
                    <p className="mt-1 text-nebel">
                      ByteWurst lag {ganz(Math.abs(r.prognose - r.verkauft))} Stück daneben, du {ganz(daneben)}.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div aria-live="polite">
          {fertig && (
            <div className="fokus-dunkel mt-6 flex flex-col gap-6 rounded-3xl bg-senf p-6 text-tinte md:flex-row md:items-center md:justify-between md:p-8">
              <div>
                <p className="titel text-3xl md:text-4xl">
                  Drei Tage: Du lagst {ganz(summeDu)} Stück daneben, ByteWurst {ganz(summeBw)}.
                </p>
                <p className="mt-2 max-w-2xl">
                  {summeDu <= summeBw + 10
                    ? 'Starkes Bauchgefühl. Und jetzt stell dir vor, das hätte jeder in deinem Team, auch wenn du im Urlaub bist.'
                    : 'Kein Vorwurf, Bratwurst ist schwer. Genau dafür rechnet ByteWurst jede Nacht, für jede Warengruppe und jeden Tag.'}
                </p>
              </div>
              <Knoepfe className="shrink-0" />
            </div>
          )}
        </div>

        <p className="mt-6 max-w-3xl text-sm text-nebel">
          Die Zahlen im Spiel sind ausgedacht. Wie gut die Prognose bei dir trifft, zeigen erst deine eigenen Verkaufsdaten.
        </p>
      </div>
    </section>
  )
}
