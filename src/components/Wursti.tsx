import { useEffect, useRef } from 'react'
import { bewegungReduziert } from '../lib/bewegung'

/*
  Wursti, das Maskottchen von ByteWurst. Formen und Farben nach dem Favicon
  auf bytewurst.de (wursti-png, viewBox 4 26 192 88), hier als Komponente mit
  Gesichtsausdrücken.

  - folgen: die Pupillen schauen zur Maus bzw. zum Finger
  - blinzeln: ab und zu, nicht bei "Bewegung reduzieren"
  - stimmung: froh, staunt, lacht, schlaeft
  - brille: Rechenbrille für die Nacht-Szene

  Maus und Blinzeln laufen nur im Effekt und schreiben direkt ins SVG, ohne
  neu zu rendern. Im vorgerenderten HTML steht Wursti einfach still da.
*/

export type Stimmung = 'froh' | 'staunt' | 'lacht' | 'schlaeft'

type Props = {
  className?: string
  /** Mit Titel ist Wursti ein Bild für Screenreader, ohne ist er Dekoration */
  titel?: string
  stimmung?: Stimmung
  folgen?: boolean
  blinzeln?: boolean
  brille?: boolean
  /** Beine weglassen, etwa im Logo */
  ohneBeine?: boolean
}

const AUGE_L = { x: 80, y: 52 }
const AUGE_R = { x: 120, y: 52 }
const BLICK_WEIT = 3.6

export default function Wursti({
  className,
  titel,
  stimmung = 'froh',
  folgen = false,
  blinzeln = true,
  brille = false,
  ohneBeine = false,
}: Props) {
  const svg = useRef<SVGSVGElement>(null)
  const pupillen = useRef<SVGGElement>(null)
  const augen = useRef<SVGGElement>(null)

  useEffect(() => {
    if (!folgen || stimmung === 'schlaeft') return
    const el = svg.current
    const p = pupillen.current
    if (!el || !p) return
    let rahmen = 0
    let x = 0
    let y = 0
    const setzen = () => {
      rahmen = 0
      const r = el.getBoundingClientRect()
      // Mittelpunkt zwischen den Augen, nicht der ganzen Wurst
      const mx = r.left + r.width * 0.5
      const my = r.top + r.height * 0.3
      const dx = x - mx
      const dy = y - my
      const weite = Math.hypot(dx, dy)
      const anteil = Math.min(weite / 240, 1)
      const w = Math.atan2(dy, dx)
      p.setAttribute('transform', `translate(${(Math.cos(w) * BLICK_WEIT * anteil).toFixed(2)} ${(Math.sin(w) * BLICK_WEIT * anteil).toFixed(2)})`)
    }
    const bewegt = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      if (!rahmen) rahmen = requestAnimationFrame(setzen)
    }
    window.addEventListener('pointermove', bewegt, { passive: true })
    window.addEventListener('pointerdown', bewegt, { passive: true })
    return () => {
      window.removeEventListener('pointermove', bewegt)
      window.removeEventListener('pointerdown', bewegt)
      cancelAnimationFrame(rahmen)
    }
  }, [folgen, stimmung])

  useEffect(() => {
    if (!blinzeln || stimmung === 'schlaeft' || bewegungReduziert()) return
    const a = augen.current
    if (!a) return
    let warten = 0
    let auf = 0
    const naechstes = () => {
      warten = window.setTimeout(
        () => {
          a.setAttribute('data-zu', '')
          auf = window.setTimeout(() => {
            a.removeAttribute('data-zu')
            naechstes()
          }, 130)
        },
        2200 + ((performance.now() * 7919) % 3800),
      )
    }
    naechstes()
    return () => {
      clearTimeout(warten)
      clearTimeout(auf)
      a.removeAttribute('data-zu')
    }
  }, [blinzeln, stimmung])

  const tinte = '#2d2d2d'

  return (
    <svg
      ref={svg}
      viewBox={ohneBeine ? '4 22 192 76' : '4 22 192 92'}
      overflow="visible"
      className={className}
      role={titel ? 'img' : undefined}
      aria-label={titel}
      aria-hidden={titel ? undefined : true}
      focusable="false"
    >
      {!ohneBeine && (
        <g>
          <rect x="62" y="82" width="8" height="20" rx="4" fill="var(--color-wurst-bein)" />
          <ellipse cx="66" cy="104" rx="7" ry="4" fill="var(--color-schuh)" />
          <rect x="130" y="82" width="8" height="20" rx="4" fill="var(--color-wurst-bein)" />
          <ellipse cx="134" cy="104" rx="7" ry="4" fill="var(--color-schuh)" />
        </g>
      )}

      {/* Linker Arm */}
      <g transform="rotate(-25 30 55)">
        <rect x="18" y="50" width="20" height="8" rx="4" fill="var(--color-wurst-bein)" />
        <circle cx="17" cy="54" r="6" fill="var(--color-wurst)" />
      </g>
      {/* Rechter Arm: dreht sich zum Winken um die Schulter bei 164/60 */}
      <g transform="translate(164 60)">
        <g className="wursti-arm wursti-arm-rechts">
          <g transform="translate(-164 -60) rotate(15 170 60)">
            <rect x="162" y="56" width="20" height="8" rx="4" fill="var(--color-wurst-bein)" />
            <circle cx="183" cy="60" r="6" fill="var(--color-wurst)" />
          </g>
        </g>
      </g>

      {/* Körper */}
      <ellipse cx="100" cy="58" rx="75" ry="32" fill="var(--color-wurst)" />
      <ellipse cx="95" cy="42" rx="55" ry="12" fill="#fff" opacity="0.15" />
      <g stroke="#000" strokeOpacity="0.12" strokeWidth="2.5" fill="none" strokeLinecap="round">
        <path d="M55 48 Q60 58 55 68" />
        <path d="M145 48 Q150 58 145 68" />
      </g>
      <ellipse cx="70" cy="66" rx="8" ry="5" fill="rgb(255 150 150 / 0.4)" />
      <ellipse cx="130" cy="66" rx="8" ry="5" fill="rgb(255 150 150 / 0.4)" />

      {/* Augen */}
      {stimmung === 'schlaeft' ? (
        <g stroke={tinte} strokeWidth="3" fill="none" strokeLinecap="round">
          <path d="M70 54 Q80 61 90 54" />
          <path d="M110 54 Q120 61 130 54" />
        </g>
      ) : (
        <g ref={augen} className="wursti-augen">
          <ellipse cx={AUGE_L.x} cy={AUGE_L.y} rx="12" ry={stimmung === 'staunt' ? 15 : 14} fill="#fff" />
          <ellipse cx={AUGE_R.x} cy={AUGE_R.y} rx="12" ry={stimmung === 'staunt' ? 15 : 14} fill="#fff" />
          <g ref={pupillen}>
            <ellipse cx="82" cy="54" rx={stimmung === 'staunt' ? 4.5 : 6} ry={stimmung === 'staunt' ? 5.5 : 7} fill={tinte} />
            <ellipse cx="122" cy="54" rx={stimmung === 'staunt' ? 4.5 : 6} ry={stimmung === 'staunt' ? 5.5 : 7} fill={tinte} />
            <circle cx="85" cy="50" r="2.6" fill="#fff" />
            <circle cx="125" cy="50" r="2.6" fill="#fff" />
          </g>
        </g>
      )}

      {brille && (
        <g fill="none" stroke={tinte} strokeWidth="2.6">
          <circle cx="80" cy="52" r="15.5" />
          <circle cx="120" cy="52" r="15.5" />
          <path d="M95.5 50 Q100 46 104.5 50" />
          <path d="M64.5 50 L52 46 M135.5 50 L148 46" strokeLinecap="round" />
        </g>
      )}

      {/* Mund */}
      {stimmung === 'staunt' && <ellipse cx="100" cy="73" rx="4.5" ry="5.5" fill={tinte} />}
      {stimmung === 'lacht' && <path d="M88 67 Q100 86 112 67 Z" fill="#6b1d0c" stroke={tinte} strokeWidth="2.2" strokeLinejoin="round" />}
      {stimmung === 'froh' && (
        <path d="M90 68 Q100 78 110 68" stroke={tinte} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      )}
      {stimmung === 'schlaeft' && (
        <path d="M95 72 Q100 75 105 72" stroke={tinte} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      )}
    </svg>
  )
}
