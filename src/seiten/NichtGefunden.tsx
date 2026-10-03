import Wursti from '../components/Wursti'

export default function NichtGefunden() {
  return (
    <section aria-labelledby="fehlt-titel" className="fliesen">
      <div className="rahmen grid min-h-[70svh] items-center gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="ziffern font-mono text-lg font-bold text-wurst-tief">Fehler 404</p>
          <h1 id="fehlt-titel" className="titel mt-3 text-[clamp(3rem,9vw,7rem)]">
            Diese Seite ist leider aus.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-tinte/85">
            Hätten wir mal eine Prognose gemacht. Hier gibt es nichts mehr, aber an der Theke ist noch was da.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/" className="knopf knopf-wurst">
              Zur Startseite
            </a>
            <a href="/funktionen/" className="knopf knopf-linie text-tinte">
              Zu den Funktionen
            </a>
          </div>
        </div>
        <div className="md:col-span-5">
          <Wursti stimmung="staunt" folgen className="mx-auto h-auto w-full max-w-sm" />
        </div>
      </div>
    </section>
  )
}
