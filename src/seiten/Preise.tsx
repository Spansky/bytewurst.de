import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import Bild from '../components/Bild'
import Preisrechner from '../components/Preisrechner'
import Wursti from '../components/Wursti'
import { fragen, tarife, vergleich } from '../data/preise'
import Schluss from '../sections/start/Schluss'

/** S-Haken, an dem das Preisschild hängt */
function Haken() {
  return (
    <svg viewBox="0 0 40 70" className="mx-auto -mb-2 h-16 w-9" aria-hidden="true">
      <path
        d="M20 2 C8 2 6 18 18 20 L20 20 L20 50 C20 64 34 64 34 52"
        fill="none"
        stroke="#8f8a83"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path d="M20 20 L20 50" stroke="#c9c4bc" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export default function Preise() {
  return (
    <>
      <section aria-labelledby="preise-titel" className="fliesen">
        <div className="rahmen pt-10 pb-8 md:pt-16">
          <div className="grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h1 id="preise-titel" className="titel text-[clamp(2.8rem,7vw,5.4rem)]">
                Ehrliche Preise. Wie auf dem Bon.
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-tinte/85 md:text-xl">
                Starte kostenlos und steig um, wenn du so weit bist. Danach richtet sich der Preis nach deinem Umsatz. Keine
                versteckten Gebühren, keine Überraschungen.
              </p>
            </div>
            <div className="hidden lg:col-span-4 lg:col-start-9 lg:block">
              <div className="rotate-2 overflow-hidden rounded-[1.5rem] border-8 border-papier shadow-[0_30px_50px_-30px_rgb(0_0_0/0.55)]">
                <Bild
                  name="wurst-senf"
                  sizes="(min-width: 1024px) 30vw, 1px"
                  alt="Zwei gegrillte Bratwürste auf einem grauen Teller, daneben ein Schälchen Senf und eine Gewürzgurke."
                  className="aspect-[4/3] h-auto w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Die Stange, an der die Schilder hängen */}
        <div className="rahmen pb-20 md:pb-28">
          <div aria-hidden="true" className="mt-10 h-3 rounded-full bg-gradient-to-b from-[#c9c4bc] to-[#8f8a83] shadow-[0_4px_8px_rgb(0_0_0/0.2)]" />
          <ul className="grid gap-x-6 gap-y-4 md:grid-cols-3">
            {tarife.map((t) => (
              <li key={t.name} className="haken-schild flex flex-col">
                <Haken />
                <div
                  className={`flex flex-1 flex-col rounded-2xl p-6 md:p-7 ${
                    t.empfohlen
                      ? 'bg-tinte text-kreide shadow-[0_30px_50px_-25px_rgb(0_0_0/0.6)] ring-4 ring-senf'
                      : 'bg-papier shadow-[0_24px_40px_-26px_rgb(0_0_0/0.45)] ring-1 ring-fuge'
                  }`}
                >
                  <h2 className="titel text-3xl">{t.name}</h2>
                  <p className={`mt-2 ${t.empfohlen ? 'text-kreide/80' : 'text-tinte/75'}`}>{t.satz}</p>
                  <p className={`titel ziffern mt-6 text-6xl ${t.empfohlen ? 'text-senf' : 'text-tinte'}`}>{t.preis}</p>
                  {t.einheit && <p className={`mt-1 text-sm ${t.empfohlen ? 'text-kreide/70' : 'text-grau'}`}>{t.einheit}</p>}
                  <ul className="mt-6 space-y-2.5">
                    {t.leistungen.map((l) => (
                      <li key={l} className="flex gap-3">
                        <FontAwesomeIcon
                          icon={faCheck}
                          className={`mt-1.5 h-3.5 w-3.5 shrink-0 ${t.empfohlen ? 'text-prognose' : 'text-wurst'}`}
                          aria-hidden="true"
                        />
                        <span>{l}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-8">
                    {t.knopf.ziel ? (
                      <a href={t.knopf.ziel} className={`knopf w-full ${t.empfohlen ? 'knopf-senf' : 'knopf-wurst'}`}>
                        {t.knopf.text}
                      </a>
                    ) : (
                      <span className="knopf w-full cursor-default border-2 border-dashed border-fuge text-grau">{t.knopf.text}</span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-grau">
            Als Jahresumsatz zählt dein Gesamtumsatz aus dem Vorjahr. Early Adopter wird jährlich abgerechnet und ist jederzeit
            kündbar.
          </p>
        </div>
      </section>

      <section aria-labelledby="rechner-titel" className="bg-nacht py-20 text-kreide md:py-28">
        <div className="rahmen grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 id="rechner-titel" className="titel text-[clamp(2.3rem,4.8vw,3.9rem)]">
              Rechne selbst nach.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-kreide/85">
              Schieb die Wurst auf deinen Jahresumsatz. Die kleine Landmetzgerei zahlt nicht wie die Kette mit zwanzig
              Filialen, und beide zahlen nur für das, was sie umsetzen.
            </p>
            <Wursti folgen stimmung="lacht" className="mt-10 hidden h-auto w-44 lg:block" />
          </div>
          <div className="lg:col-span-7">
            <Preisrechner voll />
          </div>
        </div>
      </section>

      <section aria-labelledby="vergleich-titel" className="bg-papier py-20 md:py-28">
        <div className="rahmen">
          <h2 id="vergleich-titel" className="titel text-[clamp(2.3rem,4.8vw,3.9rem)]">
            Was drin ist, auf einen Blick.
          </h2>
          <div className="mt-10 overflow-x-auto rounded-2xl ring-1 ring-fuge">
            <table className="w-full min-w-[36rem] border-collapse text-left">
              <caption className="sr-only">Funktionsvergleich der drei Tarife</caption>
              <thead>
                <tr className="bg-fliese">
                  <th scope="col" className="px-4 py-3 font-semibold md:px-6">
                    Funktion
                  </th>
                  {tarife.map((t) => (
                    <th key={t.name} scope="col" className="px-4 py-3 font-bold md:px-6">
                      {t.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vergleich.map((v) => (
                  <tr key={v.was} className="border-t border-fuge">
                    <th scope="row" className="px-4 py-3 font-semibold md:px-6">
                      {v.was}
                    </th>
                    {v.werte.map((w, i) => (
                      <td key={i} className={`px-4 py-3 md:px-6 ${w === 'nein' ? 'text-grau' : ''}`}>
                        {w}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section aria-labelledby="fragen-titel" className="fliesen py-20 md:py-28">
        <div className="rahmen grid gap-12 lg:grid-cols-12 lg:gap-16">
          <h2 id="fragen-titel" className="titel text-[clamp(2.3rem,4.8vw,3.9rem)] lg:col-span-4">
            Was Metzger vorher wissen wollen.
          </h2>
          <div className="space-y-3 lg:col-span-8">
            {fragen.map((f) => (
              <details key={f.frage} className="group rounded-2xl bg-papier shadow-[0_1px_0_var(--color-fuge)] ring-1 ring-fuge open:ring-wurst/40">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-lg font-bold [&::-webkit-details-marker]:hidden">
                  {f.frage}
                  <FontAwesomeIcon icon={faPlus} className="h-4 w-4 shrink-0 text-wurst transition-transform group-open:rotate-45" aria-hidden="true" />
                </summary>
                <p className="px-5 pb-5 leading-relaxed text-tinte/85">{f.antwort}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Schluss titel="Erst mal anschauen? Gern." />
    </>
  )
}
