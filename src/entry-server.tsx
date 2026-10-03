import type { ComponentType } from 'react'
import { renderToString } from 'react-dom/server'
import Rahmen from './components/Rahmen'
import { seiten, type SeitenSchluessel } from './data/seiten'
import Start from './seiten/Start'
import Funktionen from './seiten/Funktionen'
import Preise from './seiten/Preise'
import Impressum from './seiten/Impressum'
import Datenschutz from './seiten/Datenschutz'
import NichtGefunden from './seiten/NichtGefunden'

/* Nur fürs Vorrendern beim Bauen (scripts/prerender.mjs), nie im Browser. */

const komponenten: Record<SeitenSchluessel, ComponentType> = {
  start: Start,
  funktionen: Funktionen,
  preise: Preise,
  impressum: Impressum,
  datenschutz: Datenschutz,
  fehlt: NichtGefunden,
}

export { seiten }
export { KONZEPT, SEITEN_URL, firma } from './data/betrieb'
export { bildSatz } from './lib/bilder'

export function render(schluessel: SeitenSchluessel): string {
  const seite = seiten.find((s) => s.schluessel === schluessel)!
  const Inhalt = komponenten[schluessel]
  return renderToString(
    <Rahmen pfad={seite.pfad}>
      <Inhalt />
    </Rahmen>,
  )
}
