import type { CSSProperties } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCashRegister } from '@fortawesome/free-solid-svg-icons/faCashRegister'
import { faStopwatch } from '@fortawesome/free-solid-svg-icons/faStopwatch'
import { faPrint } from '@fortawesome/free-solid-svg-icons/faPrint'
import { faMagnifyingGlassChart } from '@fortawesome/free-solid-svg-icons/faMagnifyingGlassChart'
import Bild from '../../components/Bild'
import { prognoseGruppen, prognoseTage } from '../../data/beispiele'

/*
  "Noch ein Programm?" Die Antwort von bytewurst.de: die Zahlen kommen zu dir.
  Dazu das Kaffeefoto und ein A4-Ausdruck, wie er an der Pinnwand hängt.
*/
const PUNKTE = [
  { icon: faCashRegister, text: 'Kasse und Warenwirtschaft bleiben, wie sie sind. Es gibt nichts zu installieren und nichts zu warten.' },
  { icon: faStopwatch, text: 'In etwa zehn Minuten eingerichtet. Deine ersten Umsatzdiagramme siehst du noch am selben Tag.' },
  { icon: faPrint, text: 'Lieber Papier? Jeder Report kommt als A4 aus dem Drucker, für die Pinnwand in der Wurstküche.' },
  { icon: faMagnifyingGlassChart, text: 'Wer tiefer graben will, zoomt sich durch die Diagramme. Muss aber keiner.' },
]

function Ausdruck() {
  const g = prognoseGruppen[0]
  const werte = g.voraus.slice(1, 7)
  const max = Math.max(...werte)
  return (
    <div className="relative bg-papier p-4 pt-6 shadow-[0_24px_40px_-20px_rgb(0_0_0/0.55)] [aspect-ratio:1/1.414]">
      <span aria-hidden="true" className="absolute -top-2 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full bg-wurst shadow-[0_3px_4px_rgb(0_0_0/0.4)]" />
      <p className="etikett text-grau">ByteWurst, Wochenprognose</p>
      <p className="mt-1 text-lg leading-tight font-bold">Wurst, nächste Woche</p>
      <div className="mt-4 flex aspect-[2/1] w-full items-end gap-1.5 border-b border-tinte/30">
        {werte.map((v, i) => (
          <div key={i} className="flex-1 rounded-t-[2px] bg-tinte/80" style={{ height: `${(v / max) * 100}%` }} />
        ))}
      </div>
      <div className="mt-1 flex gap-1.5 font-mono text-[0.625rem] text-grau">
        {prognoseTage.slice(6, 12).map((t) => (
          <span key={t} className="flex-1 text-center">
            {t}
          </span>
        ))}
      </div>
      <div className="mt-4 space-y-1.5" aria-hidden="true">
        <div className="h-1.5 w-11/12 rounded bg-fuge" />
        <div className="h-1.5 w-4/5 rounded bg-fuge" />
        <div className="h-1.5 w-2/3 rounded bg-fuge" />
      </div>
    </div>
  )
}

export default function Einwaende() {
  return (
    <section aria-labelledby="einwand-titel" className="bg-papier py-20 md:py-28">
      <div className="rahmen grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <h2 id="einwand-titel" className="titel text-[clamp(2.5rem,5.4vw,4.4rem)]">
            Die beste Software ist die, die du nie öffnen musst.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-tinte/85">
            Viele Metzger winken erst mal ab: noch ein Programm, in das man sich einarbeiten muss? Verständlich. Deshalb kommt
            ByteWurst zu dir, nicht umgekehrt.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-tinte/85">
            Ein Kunde wollte gar kein neues Programm. Er wollte eine E-Mail, jeden Morgen um vier, mit den zehn besten Produkten
            vom Vortag und einer Übersicht, wann seine Kundschaft kommt und wie viel sie pro Einkauf ausgibt. Die bekommt er
            seitdem. Er liest seine Zahlen beim ersten Kaffee, bevor der erste Kunde vor der Theke steht.
          </p>
          <ul className="mt-8 space-y-4">
            {PUNKTE.map((p) => (
              <li key={p.text} className="flex gap-4">
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-senf text-tinte">
                  <FontAwesomeIcon icon={p.icon} className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="leading-relaxed">{p.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:col-span-6 lg:max-w-lg">
          <div className="overflow-hidden rounded-[2rem] shadow-[0_30px_60px_-30px_rgb(0_0_0/0.5)]">
            <Bild
              name="kaffee"
              sizes="(min-width: 1024px) 512px, 448px"
              alt="Eine Tasse schwarzer Kaffee mit Untertasse auf einem dunklen, polierten Holztisch."
              className="aspect-square h-auto w-full object-cover"
            />
          </div>
          <div
            data-einblenden="kippen"
            style={{ '--kipp': '10deg', '--ruhe': '4deg' } as CSSProperties}
            className="absolute -right-2 -bottom-10 w-[46%] sm:-right-10"
          >
            <Ausdruck />
          </div>
        </div>
      </div>
    </section>
  )
}
