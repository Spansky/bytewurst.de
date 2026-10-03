import { firma, KONZEPT } from '../data/betrieb'
import { JockJockCredit } from './jockjock-credit'
import Logo from './Logo'

const SEITEN = [
  { pfad: '/funktionen/', name: 'Funktionen' },
  { pfad: '/preise/', name: 'Preise' },
  { pfad: firma.anmelden, name: 'Einloggen' },
  { pfad: '/impressum/', name: 'Impressum' },
  { pfad: '/datenschutz/', name: 'Datenschutz' },
]

export default function Fusszeile() {
  return (
    <footer className="fokus-hell bg-nacht pb-[env(safe-area-inset-bottom)] text-kreide">
      <div className="rahmen grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <a href="/" aria-label="ByteWurst, zur Startseite" className="inline-block text-2xl">
            <Logo hell />
          </a>
          <p className="mt-5 max-w-sm text-nebel">
            Umsatzprognose und Reporting für Metzgereien, gemeinsam mit Metzgern entwickelt. Gerechnet wird nachts in der Cloud.
          </p>
          <p className="mt-6 text-sm text-nebel">
            Auch von ByteButchers:{' '}
            <a href={firma.schwester.url} className="text-kreide underline underline-offset-4 hover:text-senf">
              {firma.schwester.name}
            </a>
            , digitale Notizen für Handwerksbetriebe.
          </p>
        </div>

        <div className="md:col-span-4">
          <h2 className="etikett text-nebel">Reden wir über Wurst</h2>
          <ul className="mt-3">
            <li>
              <a href={`tel:${firma.telefonRoh}`} className="inline-flex min-h-11 items-center text-xl font-bold hover:text-senf">
                {firma.telefon}
              </a>
            </li>
            <li>
              <a href={`mailto:${firma.email}`} className="inline-flex min-h-11 items-center hover:text-senf">
                {firma.email}
              </a>
            </li>
            <li>
              <a href={firma.demo} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center font-semibold text-senf underline underline-offset-4 hover:text-senf-hell">
                Demo-Termin aussuchen
              </a>
            </li>
          </ul>
          <address className="mt-6 text-sm not-italic text-nebel">
            {firma.name}
            <br />
            {firma.strasse}, {firma.plz} {firma.ort}
          </address>
        </div>

        <nav aria-label="Seiten" className="md:col-span-3">
          <h2 className="etikett text-nebel">Seiten</h2>
          <ul className="mt-3">
            {SEITEN.map((s) => (
              <li key={s.pfad}>
                <a href={s.pfad} className="inline-flex min-h-11 items-center text-kreide/90 underline-offset-4 transition-colors hover:text-senf hover:underline">
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="rahmen flex flex-col items-center justify-between gap-8 border-t border-nacht-linie py-10 md:flex-row md:items-end">
        <div className="text-center text-sm text-nebel md:text-left">
          {KONZEPT ? (
            <p className="max-w-xl">
              Konzeptentwurf von Jock&amp;Jock für ByteWurst, kein offizieller Auftritt der {firma.name}. Die Fotos stammen von
              Unsplash, alle Zahlen in Diagrammen und Spielen sind Beispiele.
            </p>
          ) : (
            <p>© 2026 {firma.name}</p>
          )}
        </div>
        <JockJockCredit className="text-[0.9375rem] text-kreide" />
      </div>
    </footer>
  )
}
