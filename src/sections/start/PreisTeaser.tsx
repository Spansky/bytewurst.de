import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight'
import Preisrechner from '../../components/Preisrechner'
import { EURO_JE_100K } from '../../data/preise'

export default function PreisTeaser() {
  return (
    <section aria-labelledby="preis-titel" className="fliesen py-20 md:py-28">
      <div className="rahmen grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <h2 id="preis-titel" className="titel text-[clamp(2.5rem,5.4vw,4.4rem)]">
            Die Landmetzgerei zahlt nicht wie die Kette.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-tinte/85">
            Der Preis richtet sich nach deinem Umsatz: {EURO_JE_100K} € im Monat je 100.000 € Jahresumsatz. Zum Ausprobieren
            gibt es ByteWurst kostenlos, mit einer Filiale und drei Produkten.
          </p>
          <a
            href="/preise/"
            className="mt-8 inline-flex items-center gap-2 text-lg font-bold text-wurst-tief underline decoration-wurst decoration-[3px] underline-offset-[6px] hover:text-wurst"
          >
            Alle Preise und Antworten
            <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
        <div className="lg:col-span-7">
          <Preisrechner />
        </div>
      </div>
    </section>
  )
}
