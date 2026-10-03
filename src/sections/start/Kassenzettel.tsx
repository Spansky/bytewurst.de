import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight'
import Wursti from '../../components/Wursti'
import { posten } from '../../data/start'

/*
  Alles, was in ByteWurst steckt, als Kassenbon. Er druckt sich, sobald er
  ins Bild kommt (data-drucken, index.css). Der Strichcode ist reine Deko.
*/
export default function Kassenzettel() {
  return (
    <section aria-labelledby="posten-titel" className="relative bg-wurst py-20 text-papier md:py-28">
      <div className="rahmen grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <h2 id="posten-titel" className="titel text-[clamp(2.5rem,5.6vw,4.6rem)]">
            Alles, was in der Wurst steckt.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-papier/90">
            Zwölf Posten auf einem Bon, und alle sind inklusive. Nur die Summe richtet sich nach deinem Umsatz.
          </p>
          <a
            href="/funktionen/"
            className="mt-8 inline-flex items-center gap-2 text-lg font-bold text-papier underline decoration-senf decoration-[3px] underline-offset-[6px] hover:decoration-papier"
          >
            Alle Funktionen im Detail
            <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4" aria-hidden="true" />
          </a>
          <Wursti folgen className="mt-12 hidden h-auto w-48 drop-shadow-[0_14px_12px_rgb(0_0_0/0.3)] lg:block" />
        </div>

        <div className="lg:col-span-7">
          <div className="bon-schatten mx-auto max-w-xl rotate-[0.6deg]">
            <div data-drucken className="bon px-5 text-[0.875rem] sm:px-8">
              <div className="text-center">
                <p className="text-lg font-bold tracking-[0.2em]">BYTEWURST</p>
                <p>ByteButchers GmbH, Stuttgart</p>
              </div>
              <div className="ziffern mt-4 flex justify-between text-grau">
                <span>Bon 0001</span>
                <span>04:00 Uhr</span>
              </div>
              <div className="bon-linie my-4" />
              <ul className="space-y-3.5">
                {posten.map((p) => (
                  <li key={p.name}>
                    <div className="flex items-baseline gap-2">
                      <span className="shrink-0">1 x</span>
                      <span className="font-bold">{p.name}</span>
                      <span aria-hidden="true" className="min-w-4 flex-1 translate-y-[-0.25em] border-b border-dotted border-tinte/40" />
                      <span className="shrink-0">inkl.</span>
                    </div>
                    <p className="pl-[2.6ch] text-[0.8125rem] leading-snug text-grau" style={{ fontFamily: 'var(--font-sans)' }}>
                      {p.text}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="bon-linie my-4" />
              <div className="flex items-baseline justify-between gap-4 text-base font-bold">
                <span>SUMME</span>
                <span>je nach Umsatz</span>
              </div>
              <p className="mt-1 text-right text-[0.8125rem] text-grau">Zum Ausprobieren: 0,00 €</p>
              <div className="bon-linie my-4" />
              <div
                aria-hidden="true"
                className="mx-auto h-12 w-4/5 [background-image:repeating-linear-gradient(90deg,var(--color-tinte)_0_2px,transparent_2px_4px,var(--color-tinte)_4px_7px,transparent_7px_9px,var(--color-tinte)_9px_10px,transparent_10px_13px)]"
              />
              <p className="mt-4 text-center">Danke und bis morgen früh um vier!</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
