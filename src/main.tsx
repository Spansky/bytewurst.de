import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import Rahmen from './components/Rahmen'
import { seiteZuPfad } from './data/seiten'
import { laden } from './seiten'
import './index.css'

/*
  Eine Vorlage, viele Seiten: Der Pfad bestimmt, welche Seite geladen wird.
  Im gebauten HTML steckt die Seite schon fertig gerendert (prerender.mjs),
  dann wird hydriert. Im Entwicklungsserver ist #root leer, dann wird gerendert.
*/
async function start() {
  const seite = seiteZuPfad(window.location.pathname)
  const { default: Inhalt } = await laden[seite.schluessel]()
  const wurzel = document.getElementById('root')!
  const baum = (
    <StrictMode>
      <Rahmen pfad={seite.pfad}>
        <Inhalt />
      </Rahmen>
    </StrictMode>
  )
  // Hydrieren nur, wenn das vorgerenderte HTML zu dieser Seite gehört
  if (wurzel.dataset.seite === seite.schluessel) {
    hydrateRoot(wurzel, baum)
  } else {
    wurzel.textContent = ''
    document.title = seite.titel
    createRoot(wurzel).render(baum)
  }
}

void start()
