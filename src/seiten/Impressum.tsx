import Rechtsseite from '../components/Rechtsseite'
import bildnachweis from '../data/bildnachweis.json'
import { firma, KONZEPT, konzeptAnbieter as jj } from '../data/betrieb'

export default function Impressum() {
  return (
    <Rechtsseite titel="Impressum">
      <section>
        <h2>Angaben gemäß § 5 DDG</h2>
        {KONZEPT ? (
          <>
            <p>
              {jj.name}
              <br />
              {jj.inhaber}
              <br />
              {jj.strasse}
              <br />
              {jj.plz} {jj.ort}
            </p>
            <p>
              Telefon: <a href={`tel:${jj.telefonRoh}`}>{jj.telefon}</a>
              <br />
              E-Mail: <a href={`mailto:${jj.email}`}>{jj.email}</a>
            </p>
            <p>
              Diese Seite ist ein Konzeptentwurf von Jock&amp;Jock für ByteWurst. Sie ist kein offizieller Auftritt der{' '}
              {firma.name} und wurde von ihr weder beauftragt noch freigegeben.
            </p>
            <p>
              Das offizielle Impressum von ByteWurst steht auf{' '}
              <a href="https://bytewurst.de/imprint" target="_blank" rel="noopener">
                bytewurst.de/imprint
              </a>
              .
            </p>
          </>
        ) : (
          <>
            <p>
              {firma.name}
              <br />
              {firma.strasse}
              <br />
              {firma.plz} {firma.ort}
            </p>
            <p>Geschäftsführer: {firma.geschaeftsfuehrer}</p>
            <p>{firma.register}</p>
            <p>Umsatzsteuer-ID: {firma.ustId}</p>
            <p>
              Telefon: <a href={`tel:${firma.telefonRoh}`}>{firma.telefon}</a>
              <br />
              E-Mail: <a href={`mailto:${firma.email}`}>{firma.email}</a>
            </p>
          </>
        )}
      </section>

      <section>
        <h2>Gestaltung und Umsetzung</h2>
        <p>
          <a href="https://jockjock.de/?ref=bytewurst" target="_blank" rel="noopener">
            Jock&amp;Jock
          </a>
          , Websites und Automatisierung.
        </p>
      </section>

      <section>
        <h2>Bildnachweis</h2>
        <p>
          Die Fotos stammen von Unsplash und stehen unter der{' '}
          <a href="https://unsplash.com/license" target="_blank" rel="noopener">
            Unsplash-Lizenz
          </a>
          . Wursti ist das Maskottchen von ByteWurst.
        </p>
        <ul className="mt-4 grid gap-x-8 gap-y-1 text-sm sm:grid-cols-2">
          {bildnachweis.map((b) => (
            <li key={b.bild}>
              <a href={b.seite} target="_blank" rel="noopener">
                {b.fotograf}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Schriften</h2>
        <p>
          Bricolage Grotesque und JetBrains Mono, beide unter der SIL Open Font License. Sie liegen auf unserem eigenen Server,
          beim Laden der Seite wird kein fremder Dienst angefragt.
        </p>
      </section>
    </Rechtsseite>
  )
}
