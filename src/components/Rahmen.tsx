import type { ReactNode } from 'react'
import Einblenden from './Einblenden'
import Fusszeile from './Fusszeile'
import Grundfarbe from './Grundfarbe'
import Kopfzeile from './Kopfzeile'

/** Seitenrahmen für jede Route: Kopfzeile, Inhalt auf eigener Fläche, Fußzeile. */
export default function Rahmen({ pfad, children }: { pfad: string; children: ReactNode }) {
  return (
    <>
      <a
        href="#inhalt"
        className="knopf knopf-wurst absolute top-[calc(0.75rem+env(safe-area-inset-top))] left-4 z-50 -translate-y-[300%] focus:translate-y-0"
      >
        Zum Inhalt
      </a>
      <Grundfarbe />
      <Einblenden />
      <Kopfzeile pfad={pfad} />
      <main id="inhalt" className="overflow-x-clip bg-fliese">
        {children}
      </main>
      <Fusszeile />
    </>
  )
}
