import Rechtsseite from '../components/Rechtsseite'
import { firma, KONZEPT } from '../data/betrieb'

export default function Datenschutz() {
  return (
    <Rechtsseite titel="Datenschutz">
      <section>
        <h2>Kurz gesagt</h2>
        <p>
          Diese Website setzt keine Cookies und kein Tracking ein. Schriften, Bilder und Skripte kommen von unserem eigenen
          Server, es werden keine Inhalte von fremden Diensten nachgeladen.
        </p>
      </section>

      <section>
        <h2>Verantwortlich</h2>
        {KONZEPT ? (
          <p>
            Diese Seite ist ein Konzeptentwurf. Die verantwortliche Stelle steht hier, bevor die Seite offiziell an den Start geht.
          </p>
        ) : (
          <p>
            {firma.name}, {firma.strasse}, {firma.plz} {firma.ort}. E-Mail: <a href={`mailto:${firma.email}`}>{firma.email}</a>
          </p>
        )}
      </section>

      <section>
        <h2>Beim Aufruf der Seite</h2>
        <p>
          Der Server speichert beim Aufruf technisch notwendige Daten in Protokolldateien: IP-Adresse, Zeitpunkt, die aufgerufene
          Adresse und die Kennung des Browsers. Das ist nötig, um die Seite sicher auszuliefern und Fehler zu finden (Art. 6
          Abs. 1 lit. f DSGVO). Die Protokolle werden nach kurzer Zeit gelöscht.
        </p>
      </section>

      <section>
        <h2>Spiele und Diagramme</h2>
        <p>
          Planspiel, Nacht-Uhr, Preisrechner und Diagramme laufen vollständig in deinem Browser. Was du dort einstellst, wird nicht
          gespeichert und nicht übertragen.
        </p>
      </section>

      <section>
        <h2>Links zu anderen Diensten</h2>
        <p>
          Der Knopf „Demo buchen“ führt zur Terminbuchung bei cal.eu, „Einloggen“ und „Kostenlos starten“ führen zur Anwendung auf
          bytewurst.de. Erst wenn du einen dieser Links anklickst, verlässt du diese Seite. Dort gelten die
          Datenschutzhinweise des jeweiligen Anbieters.
        </p>
      </section>

      <section>
        <h2>Deine Rechte</h2>
        <p>
          Du hast das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung deiner Daten, auf
          Datenübertragbarkeit und auf Widerspruch. Außerdem kannst du dich bei einer Datenschutzaufsichtsbehörde beschweren.
        </p>
      </section>
    </Rechtsseite>
  )
}
