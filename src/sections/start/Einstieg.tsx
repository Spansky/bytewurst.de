import Bild from '../../components/Bild'
import Knoepfe from '../../components/Knoepfe'
import WurstiBuehne from '../../components/WurstiBuehne'
import { prognoseGruppen } from '../../data/beispiele'
import { euro } from '../../lib/format'

/* Der erste Bildschirm: das Versprechen, das Schaufenster, Wursti zum Anstupsen. */
export default function Einstieg() {
  // Samstag ist der erste Prognosetag in den Beispieldaten
  const samstag = prognoseGruppen.map((g) => ({ name: g.name, wert: g.voraus[0] }))

  return (
    <section aria-labelledby="einstieg-titel" className="fliesen relative">
      <div className="rahmen grid items-center gap-x-12 gap-y-16 pt-10 pb-20 md:pt-16 lg:grid-cols-12 lg:pb-28">
        <div className="lg:col-span-6">
          <h1 id="einstieg-titel" className="titel text-[clamp(2.9rem,7.4vw,5.75rem)]">
            Dein Bauchgefühl ist gut. Deine Kasse weiß es besser.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-tinte/85 md:text-xl">
            ByteWurst rechnet jede Nacht aus deinen Verkaufsdaten aus, was nächste Woche über deine Theke geht. Um vier Uhr
            früh liegt dein Report im Postfach: wie viel du produzieren solltest und ob sich die letzte Aktion wirklich
            gerechnet hat.
          </p>
          <Knoepfe className="mt-9" />
          <p className="mt-6 max-w-lg text-[0.9375rem] text-grau">
            Deine Kasse bleibt, wie sie ist, und lernen musst du auch nichts. Gemeinsam mit Metzgern entwickelt.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:col-span-6 lg:max-w-none">
          <div className="rotate-[1.5deg] overflow-hidden rounded-[1.75rem] border-[10px] border-papier bg-papier shadow-[0_40px_70px_-35px_rgb(0_0_0/0.55)]">
            <Bild
              name="schaufenster"
              vorne
              sizes="(min-width: 1024px) 46vw, (min-width: 576px) 576px, 100vw"
              alt="Schaufenster einer Metzgerei: Salami und Würste hängen an Schnüren, davor eine alte weiße Waage auf einem Holztisch, darüber eine Leuchtschrift."
              className="aspect-[4/3] h-auto w-full object-cover"
            />
          </div>

          <div className="bon-schatten absolute -bottom-14 -left-2 w-44 -rotate-[5deg] sm:-bottom-10 sm:-left-8 sm:w-60">
            <div className="bon px-3 text-[0.6875rem] sm:px-4 sm:text-[0.8125rem]">
              <p className="text-center font-bold tracking-wide">BYTEWURST</p>
              <p className="text-center text-[0.75rem]">Prognose für Samstag</p>
              <div className="bon-linie my-2.5" />
              <ul className="space-y-1">
                {samstag.map((z) => (
                  <li key={z.name} className="ziffern flex justify-between gap-2">
                    <span>{z.name}</span>
                    <span className="font-bold">{euro(z.wert)}</span>
                  </li>
                ))}
              </ul>
              <div className="bon-linie my-2.5" />
              <p className="text-center text-[0.6875rem] text-grau">Beispiel, gedruckt um 04:00</p>
            </div>
          </div>

          <WurstiBuehne blase="links" className="absolute -right-1 -bottom-12 w-32 sm:-right-4 sm:w-40 lg:-right-6 lg:w-52" />
        </div>
      </div>
    </section>
  )
}
