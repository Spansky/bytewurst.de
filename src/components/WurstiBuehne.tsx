import { useEffect, useRef, useState } from 'react'
import { wurstiSprueche } from '../data/start'
import Wursti, { type Stimmung } from './Wursti'

/*
  Wursti zum Anstupsen: Die Augen folgen der Maus, ein Tipp lässt ihn hüpfen,
  winken und den nächsten Spruch sagen. Die Sprüche kommen reihum, damit
  vorgerendertes HTML und erster Render gleich bleiben.
*/
export default function WurstiBuehne({
  className = '',
  blase = 'mitte',
}: {
  className?: string
  /** Wohin die Sprechblase ragt. "links" für Wursti am rechten Rand, sonst läuft sie aus dem Bild. */
  blase?: 'mitte' | 'links'
}) {
  const [nummer, setNummer] = useState(-1)
  const [stimmung, setStimmung] = useState<Stimmung>('froh')
  const [bewegung, setBewegung] = useState('')
  const zurueck = useRef(0)

  useEffect(() => () => clearTimeout(zurueck.current), [])

  const stupsen = () => {
    setNummer((n) => (n + 1) % wurstiSprueche.length)
    setStimmung('lacht')
    // Klasse kurz entfernen, damit die Animation bei jedem Tipp neu startet
    setBewegung('')
    requestAnimationFrame(() => setBewegung('wursti-huepft wursti-winkt'))
    clearTimeout(zurueck.current)
    zurueck.current = window.setTimeout(() => {
      setStimmung('froh')
      setBewegung('')
    }, 1600)
  }

  const spruch = nummer < 0 ? 'Hallo, ich bin Wursti. Stups mich an!' : wurstiSprueche[nummer]

  return (
    <div className={className}>
      <div className="relative">
        <p
          aria-live="polite"
          className={`absolute bottom-[calc(100%+0.25rem)] w-max max-w-[15rem] rounded-2xl bg-papier px-4 py-2.5 text-center text-[0.9375rem] leading-snug font-semibold text-tinte shadow-[0_10px_30px_-12px_rgb(0_0_0/0.4)] after:absolute after:top-full after:border-[9px] after:border-transparent after:border-t-papier ${blase === 'links' ? 'right-2 max-w-[13rem] after:right-[22%] sm:max-w-[15rem]' : 'left-1/2 -translate-x-1/2 after:left-1/2 after:-translate-x-1/2'}`}
        >
          {spruch}
        </p>
        <button
          type="button"
          onClick={stupsen}
          aria-label="Wursti anstupsen"
          className={`block w-full cursor-pointer rounded-3xl transition-transform hover:-rotate-2 ${bewegung}`}
        >
          <Wursti folgen stimmung={stimmung} className="h-auto w-full drop-shadow-[0_14px_14px_rgb(0_0_0/0.22)]" />
        </button>
      </div>
    </div>
  )
}
