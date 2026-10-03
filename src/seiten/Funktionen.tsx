import type { CSSProperties, ReactNode } from 'react'
import Aktionswoche from '../components/Aktionswoche'
import Bild from '../components/Bild'
import Knoepfe from '../components/Knoepfe'
import Prognose from '../components/Prognose'
import Tagesreport from '../components/Tagesreport'
import WetterJahreszeit from '../components/WetterJahreszeit'
import Wochenvergleich from '../components/Wochenvergleich'
import Wursti from '../components/Wursti'
import { auslage, weg } from '../data/funktionen'
import { GROESSEN } from '../data/seiten'
import Schluss from '../sections/start/Schluss'

/** Ein Abschnitt: Text auf der einen Seite, Diagramm auf der anderen */
function Abschnitt({
  id,
  titel,
  children,
  bild,
  gespiegelt = false,
  dunkel = false,
}: {
  id: string
  titel: string
  children: ReactNode
  bild: ReactNode
  gespiegelt?: boolean
  dunkel?: boolean
}) {
  return (
    <section aria-labelledby={id} className={dunkel ? 'fokus-hell bg-nacht py-20 text-kreide md:py-28' : 'bg-papier py-20 md:py-28'}>
      <div className="rahmen grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className={`lg:col-span-5 ${gespiegelt ? 'lg:order-2 lg:col-start-8' : ''}`}>
          <h2 id={id} className="titel text-[clamp(2.3rem,4.8vw,3.9rem)]">
            {titel}
          </h2>
          <div className={`mt-6 space-y-4 text-lg leading-relaxed ${dunkel ? 'text-kreide/85' : 'text-tinte/85'}`}>{children}</div>
        </div>
        <div className={`lg:col-span-7 ${gespiegelt ? 'lg:order-1 lg:col-start-1 lg:row-start-1' : ''}`}>{bild}</div>
      </div>
    </section>
  )
}

export default function Funktionen() {
  return (
    <>
      <section aria-labelledby="funktionen-titel" className="fliesen">
        <div className="rahmen grid items-center gap-12 pt-10 pb-20 md:pt-16 lg:grid-cols-12 lg:pb-24">
          <div className="lg:col-span-6">
            <h1 id="funktionen-titel" className="titel text-[clamp(2.8rem,7vw,5.4rem)]">
              Was die Wurst nachts so alles rechnet.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-tinte/85 md:text-xl">
              Deine Kasse sammelt jeden Bon, aber für Auswertungen fehlt abends die Zeit. Deshalb holt sich ByteWurst die
              Verkaufsdaten jede Nacht selbst aus deinem Warenwirtschaftssystem. Morgens weißt du, was nächste Woche gefragt ist.
              Daneben steht, wann deine Kundschaft kommt und was deine letzte Aktion gebracht hat. Alle Diagramme auf dieser
              Seite kannst du anfassen.
            </p>
            <Knoepfe className="mt-9" />
          </div>
          <div className="relative lg:col-span-6">
            <div className="-rotate-1 overflow-hidden rounded-[1.75rem] border-[10px] border-papier bg-papier shadow-[0_40px_70px_-35px_rgb(0_0_0/0.55)]">
              <Bild
                name="theke"
                vorne
                sizes={GROESSEN.theke}
                alt="Lange Fleischtheke mit Glasaufsatz vor weißen Wandfliesen. Dahinter steht ein Verkäufer in Jeanshemd und Lederschürze, am rechten Rand ist der Arm eines zweiten zu sehen. In der Auslage stecken kleine schwarze Preisschilder."
                className="aspect-[4/3] h-auto w-full object-cover"
              />
            </div>
            <Wursti folgen className="absolute -bottom-8 -left-3 h-auto w-28 drop-shadow-[0_12px_10px_rgb(0_0_0/0.25)] sm:-left-8 sm:w-36" />
          </div>
        </div>
      </section>

      <Abschnitt id="f-prognose" titel="Die Wochenprognose für deine Theke" bild={<Prognose />}>
        <p>
          Mal landet zu viel in der Abschrift, mal ist das Grillsortiment am Samstagmittag aus. ByteWurst rechnet dir aus deinen
          eigenen Verkäufen der letzten Jahre aus, was in den kommenden sieben Tagen über die Theke geht: je Warengruppe, je
          Wochentag. Sie erkennt Muster, die im Alltag untergehen, wie das erste Grillwochenende im Mai,
          die Leberkäs-Spitze am Samstagvormittag oder das Ferienloch im August.
        </p>
        <p>
          Damit plant dein Team das Sortiment nach Zahlen, egal wer gerade hinter der Theke steht. Weniger Abschriften am
          Montag, keine leere Theke am Samstag.
        </p>
      </Abschnitt>

      <Abschnitt id="f-woche" titel="Diese Woche gegen letzte Woche" bild={<Wochenvergleich />} gespiegelt dunkel>
        <p>
          Lief der Samstag jetzt gut oder nur gefühlt? Tipp auf einen Wochentag und sieh, wie die Woche gegen die Vorwoche
          läuft. Genau so einfach fühlt sich die ganze Anwendung an.
        </p>
        <p>
          Im Umsatzreport wählst du, ob du Euro, Kilogramm oder Stück sehen willst, für einzelne Artikel oder ganze
          Warengruppen. Feiertage wie Ostern liegen jedes Jahr woanders, deshalb gibt es dafür eine eigene Gegenüberstellung,
          sieben Tage vorher und nachher.
        </p>
      </Abschnitt>

      <Abschnitt id="f-aktion" titel="Der Wahrheitstest für jede Aktion" bild={<Aktionswoche />}>
        <p>
          Zeitungsannonce, Instagram, Sonderpreis aufs Hackfleisch: Der Laden war voll, aber ob unterm Strich mehr hängen
          geblieben ist, weiß keiner. Nach jeder Aktion zeigt dir ByteWurst schwarz auf weiß, was sie dem Umsatz des ganzen
          Ladens gebracht hat. Am Aktionsartikel allein siehst du das nicht.
        </p>
        <p>
          Du siehst Besucher, Umsatz und Bon-Höhe im Vorher-Nachher-Vergleich und ob deine Kunden zusätzlich gekauft haben oder
          nur das Sonderangebot. Dann wiederholst du nur, was sich rechnet.
        </p>
      </Abschnitt>

      <Abschnitt id="f-wetter" titel="Wetter oder Jahreszeit?" bild={<WetterJahreszeit />} gespiegelt dunkel>
        <p>
          An einem heißen Freitag im Juni ist die Grilltheke leer gekauft, im verregneten November will keiner Bratwurst. Macht
          also das Wetter das Geschäft? ByteWurst prüft solche Bauchgefühle an deinen echten Zahlen.
        </p>
        <p>
          Dafür misst sie, wie eng Verkauf und Temperatur zusammenlaufen. Schalte im Diagramm zwischen Tagen und Wochen um und
          sieh, wie aus einem schwachen Zusammenhang ein starker wird. Oft steckt schlicht der Kalender dahinter, das
          Thermometer läuft nur mit.
        </p>
        <p>
          Deshalb verlässt sich die Prognose nicht auf eine Faustregel. Sie wägt Wochentag, Jahreszeit, Feiertage und Wetter
          gemeinsam ab und lernt aus deiner Verkaufshistorie, was bei welchem Artikel wirklich zählt. Beim einen Artikel ist es
          der Samstag. Beim anderen läuft der Absatz auffällig mit der Temperatur, wie in der ByteWurst-Doku beim
          Ochsenmaulsalat.
        </p>
      </Abschnitt>

      <Abschnitt id="f-report" titel="Im Postfach und an der Pinnwand" bild={<Tagesreport className="mx-auto max-w-lg" />}>
        <p>
          Noch ein Programm, in das man sich einarbeiten muss? Musst du nicht. Jeden Morgen um 4 Uhr liegt dein Tagesreport im
          Postfach: Umsatz, Bon-Anzahl und Durchschnittsbon von gestern, die
          Renner und Ladenhüter und wann deine Kundschaft kommt. Ohne Login, ohne App.
        </p>
        <p>
          Jeder Report kommt auch als A4 aus dem Drucker und hängt dann in der Wurstküche an der Pinnwand. Für alle, die morgens
          als Erste da sind.
        </p>
      </Abschnitt>

      <section aria-labelledby="f-auslage" className="fliesen py-20 md:py-28">
        <div className="rahmen">
          <h2 id="f-auslage" className="titel max-w-3xl text-[clamp(2.3rem,4.8vw,3.9rem)]">
            Was sonst noch in der Auslage liegt.
          </h2>
          <ul className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {auslage.map((a, i) => (
              <li key={a.name} data-einblenden style={{ '--verzug': `${(i % 3) * 80}ms` } as CSSProperties}>
                <span className="preisschild inline-block -rotate-2 px-3.5 py-2 text-[0.9375rem] font-bold">{a.name}</span>
                <p className="mt-4 leading-relaxed text-tinte/85">{a.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="f-weg" className="bg-papier py-20 md:py-28">
        <div className="rahmen grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 id="f-weg" className="titel text-[clamp(2.3rem,4.8vw,3.9rem)]">
              Von der Demo bis zum ersten Report.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-tinte/85">
              Kein IT-Projekt, keine neue Kasse. So sieht der Weg aus, vom ersten Gespräch bis zur Mail um vier.
            </p>
          </div>
          <ol className="relative lg:col-span-7">
            <span aria-hidden="true" className="absolute top-3 bottom-3 left-[0.6875rem] w-[3px] rounded-full bg-fuge" />
            {weg.map((w) => (
              <li key={w.wann} className="relative pb-9 pl-12 last:pb-0" data-einblenden>
                <span aria-hidden="true" className="absolute top-1.5 left-0 h-[1.625rem] w-[1.625rem] rounded-full border-[5px] border-papier bg-wurst shadow-[0_0_0_2px_var(--color-wurst)]" />
                <p className="etikett text-wurst-tief">{w.wann}</p>
                <p className="mt-1 text-xl font-bold">{w.was}</p>
                <p className="mt-1 leading-relaxed text-tinte/80">{w.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Schluss titel="Neugierig, was deine Kasse weiß?" />
    </>
  )
}
