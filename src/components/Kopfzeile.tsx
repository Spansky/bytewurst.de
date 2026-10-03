import { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars'
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark'
import { faPhone } from '@fortawesome/free-solid-svg-icons/faPhone'
import { firma } from '../data/betrieb'
import Logo from './Logo'

/*
  Klebende Kopfzeile mit eigener Hintergrundfarbe, auch ganz oben: Safari
  nimmt sie als Farbe der oberen Leiste (hausstandard/ios-leisten.md).
  Das Menü auf dem Handy wird nur eingehängt, solange es offen ist. Solange
  es offen ist, sind Inhalt und Fußzeile inert.
  Jeder Menüpunkt ist eine eigene Seite, keine Sprungmarke.
*/

const PUNKTE = [
  { pfad: '/funktionen/', name: 'Funktionen' },
  { pfad: '/preise/', name: 'Preise' },
]

export default function Kopfzeile({ pfad }: { pfad: string }) {
  const [offen, setOffen] = useState(false)
  const menueKnopf = useRef<HTMLButtonElement>(null)
  const ersterLink = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!offen) return
    const html = document.documentElement
    html.style.overflow = 'hidden'
    // Alles unter dem Menü ist solange nicht erreichbar, sonst läuft Tab hinter das Overlay
    const darunter = [document.getElementById('inhalt'), document.querySelector('body > #root > footer, #root footer')]
    darunter.forEach((el) => el?.setAttribute('inert', ''))
    ersterLink.current?.focus()
    const taste = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOffen(false)
        menueKnopf.current?.focus()
      }
    }
    window.addEventListener('keydown', taste)
    return () => {
      html.style.overflow = ''
      darunter.forEach((el) => el?.removeAttribute('inert'))
      window.removeEventListener('keydown', taste)
    }
  }, [offen])

  return (
    <header className="sticky top-0 z-40 border-b border-fuge bg-fliese pt-[env(safe-area-inset-top)]">
      <div className="rahmen flex h-16 items-center justify-between gap-6 md:h-[4.5rem]">
        <a href="/" className="shrink-0 text-lg md:text-xl" aria-label="ByteWurst, zur Startseite">
          <Logo />
        </a>

        <nav aria-label="Hauptnavigation" className="hidden items-center gap-8 md:flex">
          {PUNKTE.map((p) => (
            <a
              key={p.pfad}
              href={p.pfad}
              aria-current={pfad === p.pfad ? 'page' : undefined}
              className="relative py-2 font-semibold text-tinte/75 transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[3px] after:origin-left after:scale-x-0 after:rounded-full after:bg-wurst after:transition-transform after:duration-300 hover:text-tinte hover:after:scale-x-100 aria-[current=page]:text-tinte aria-[current=page]:after:scale-x-100"
            >
              {p.name}
            </a>
          ))}
          <a href={firma.anmelden} className="py-2 font-semibold text-tinte/75 transition-colors hover:text-tinte">
            Einloggen
          </a>
          <a href={firma.demo} target="_blank" rel="noopener" className="knopf knopf-wurst min-h-11 px-5 py-2 text-base">
            Demo buchen
          </a>
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          <a
            href={`tel:${firma.telefonRoh}`}
            aria-label={`Anrufen: ${firma.telefon}`}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-wurst"
          >
            <FontAwesomeIcon icon={faPhone} className="h-[1.1rem] w-[1.1rem]" aria-hidden="true" />
          </a>
          <button
            ref={menueKnopf}
            type="button"
            onClick={() => setOffen(!offen)}
            aria-expanded={offen}
            aria-controls="menue"
            aria-label={offen ? 'Menü schließen' : 'Menü öffnen'}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-tinte"
          >
            <FontAwesomeIcon icon={offen ? faXmark : faBars} className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {offen && (
        <nav
          id="menue"
          aria-label="Menü"
          className="fixed inset-x-0 top-[calc(4rem+1px+env(safe-area-inset-top))] bottom-0 z-40 flex flex-col overflow-y-auto bg-fliese px-4 pt-6 pb-[calc(2rem+env(safe-area-inset-bottom))] md:hidden"
        >
          <ul className="flex flex-col">
            {[{ pfad: '/', name: 'Start' }, ...PUNKTE].map((p, i) => (
              <li key={p.pfad} className="border-b border-fuge">
                <a
                  ref={i === 0 ? ersterLink : undefined}
                  href={p.pfad}
                  aria-current={pfad === p.pfad ? 'page' : undefined}
                  onClick={() => setOffen(false)}
                  className="titel block py-4 text-5xl aria-[current=page]:text-wurst"
                >
                  {p.name}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3">
            <a href={firma.demo} target="_blank" rel="noopener" className="knopf knopf-wurst">
              Demo buchen
            </a>
            <a href={`tel:${firma.telefonRoh}`} className="knopf knopf-linie text-tinte">
              <FontAwesomeIcon icon={faPhone} className="h-4 w-4" aria-hidden="true" />
              {firma.telefon}
            </a>
            <a href={firma.anmelden} className="mt-2 text-center font-semibold text-grau underline underline-offset-4">
              Schon Kunde? Einloggen
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}
