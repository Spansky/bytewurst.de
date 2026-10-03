import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons/faPlay'
import { faPause } from '@fortawesome/free-solid-svg-icons/faPause'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope'
import Tagesreport from '../../components/Tagesreport'
import Wursti from '../../components/Wursti'
import { MAIL_AB, NACHT_MINUTEN, nachtStationen } from '../../data/start'
import { bewegungReduziert } from '../../lib/bewegung'

/*
  Die Nacht zum Durchziehen: ein Regler von 19 Uhr bis 7 Uhr. Alles in der
  Szene hängt nur an der Minute, nicht an einer Zeitachse. Deshalb zeigt
  das Ziehen genau dasselbe wie das Abspielen, und ohne JavaScript steht
  die Szene bei Ladenschluss.

  Beim ersten Sichtbarwerden spielt die Nacht einmal von selbst ab, außer
  bei "Bewegung reduzieren". Dann springt der Knopf von Station zu Station.
*/

const DAUER_MS = 15000

const mix = (a: string, b: string, t: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
  const [x, y] = [p(a), p(b)]
  return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * t)).join(' ')})`
}
const zwischen = (m: number, von: number, bis: number) => Math.min(1, Math.max(0, (m - von) / (bis - von)))
const uhr = (m: number) => {
  const gesamt = (19 * 60 + m) % (24 * 60)
  return `${String(Math.floor(gesamt / 60)).padStart(2, '0')}:${String(gesamt % 60).padStart(2, '0')}`
}

/** Punkt auf einer quadratischen Kurve */
const kurve = (t: number, a: [number, number], k: [number, number], b: [number, number]): [number, number] => [
  (1 - t) ** 2 * a[0] + 2 * (1 - t) * t * k[0] + t ** 2 * b[0],
  (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * k[1] + t ** 2 * b[1],
]

const STERNE = Array.from({ length: 26 }, (_, i) => ({
  x: (i * 137.5) % 640,
  y: 18 + ((i * 71) % 190),
  r: i % 5 === 0 ? 1.8 : 1.1,
  verzug: (i % 7) * 0.4,
}))

function Szene({ m }: { m: number }) {
  const dunkel = m < 360 ? zwischen(m, 0, 120) : 1 - zwischen(m, 570, 690)
  const morgen = m >= 360
  const oben = mix(morgen ? '#6f8fcf' : '#4a4f86', '#0b0f1a', dunkel)
  const horizont = mix(morgen ? '#f6c879' : '#ef9a62', '#161b2c', dunkel)
  const ladenLicht = m < 120
  const hausLicht = (m > 100 && m < 250) || m > 640
  const wolkeAktiv = m >= 300 && m < 540
  const mond = kurve(zwischen(m, 40, 620), [40, 170], [320, -40], [610, 170])
  const sonneY = 360 - zwischen(m, 600, 720) * 120
  const rechnen = zwischen(m, 390, 480)
  const brief = zwischen(m, MAIL_AB, MAIL_AB + 60)

  return (
    <svg viewBox="0 0 640 400" className="block h-auto w-full" aria-hidden="true">
      <defs>
        <linearGradient id="nacht-himmel" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={oben} />
          <stop offset="1" stopColor={horizont} />
        </linearGradient>
        <radialGradient id="nacht-schein">
          <stop offset="0" stopColor="#ffd98a" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffd98a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="640" height="400" fill="url(#nacht-himmel)" />

      <g opacity={dunkel}>
        {STERNE.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" className="funkeln" style={{ '--verzug': `${s.verzug}s` } as CSSProperties} />
        ))}
      </g>
      <g opacity={dunkel ** 2}>
        <circle cx={mond[0]} cy={mond[1]} r="20" fill="#f4ecd2" />
        <circle cx={mond[0] + 8} cy={mond[1] - 5} r="17" fill={oben} />
      </g>
      <circle cx="560" cy={sonneY} r="34" fill="#ffcf6b" opacity={zwischen(m, 610, 700)} />

      {/* Wolke, in der ByteWurst rechnet */}
      <g opacity={0.55 + (wolkeAktiv ? 0.45 : 0)}>
        <ellipse cx="515" cy="108" rx="78" ry="30" fill="#e9eef7" />
        <circle cx="478" cy="96" r="28" fill="#e9eef7" />
        <circle cx="522" cy="82" r="34" fill="#e9eef7" />
        <circle cx="562" cy="98" r="24" fill="#e9eef7" />
      </g>
      {wolkeAktiv && <ellipse cx="515" cy="100" rx="98" ry="52" fill="var(--color-prognose)" opacity={0.12 + 0.08 * Math.sin(m / 6)} />}
      {/* Kleines Diagramm in der Wolke: zeichnet sich beim Rechnen */}
      {m >= 390 && m < 560 && (
        <g transform="translate(470 92)">
          <path
            d="M0 26 C12 24 18 14 28 16 S44 26 54 12 S76 2 90 6"
            fill="none"
            stroke="var(--color-nacht)"
            strokeWidth="3.5"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - rechnen}
          />
          {rechnen >= 1 && <path d="M78 26 l6 6 l12 -14" fill="none" stroke="var(--color-prognose)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />}
        </g>
      )}

      {/* Bons fliegen aus der Metzgerei in die Wolke */}
      {m >= 300 && m < 395 &&
        [0, 1, 2, 3, 4].map((i) => {
          const t = ((m - 300) / 95) * 1.6 - i * 0.15
          if (t <= 0 || t >= 1) return null
          const [x, y] = kurve(t, [175, 262], [300, 60], [470, 108])
          return (
            <g key={i} transform={`translate(${x} ${y}) rotate(${-20 + t * 40})`}>
              <rect x="-7" y="-10" width="14" height="20" rx="1.5" fill="#fffdf8" />
              <path d="M-4 -5 h8 M-4 -1 h8 M-4 3 h5" stroke="#9a948b" strokeWidth="1.2" />
            </g>
          )
        })}

      {/* Boden */}
      <rect y="330" width="640" height="70" fill={mix('#3a3430', '#121417', dunkel)} />

      {/* Die Metzgerei */}
      <g>
        <rect x="30" y="150" width="270" height="182" fill={mix('#efe7d8', '#2b2c31', dunkel * 0.85)} />
        <rect x="30" y="150" width="270" height="10" fill={mix('#c9bfae', '#22232a', dunkel)} />
        <rect x="70" y="164" width="190" height="34" rx="4" fill="var(--color-wurst)" />
        <text x="165" y="188" textAnchor="middle" fill="#fffdf8" style={{ font: '800 20px var(--font-display)', letterSpacing: '0.12em' }}>
          METZGEREI
        </text>
        {/* Markise */}
        <g>
          {Array.from({ length: 9 }, (_, i) => (
            <path key={i} d={`M${40 + i * 28} 206 h28 v18 a14 10 0 0 1 -28 0 z`} fill={i % 2 ? '#fffdf8' : 'var(--color-wurst)'} opacity={0.92 - dunkel * 0.35} />
          ))}
        </g>
        {/* Schaufenster */}
        {ladenLicht && <circle cx="140" cy="285" r="120" fill="url(#nacht-schein)" />}
        <rect x="52" y="240" width="160" height="82" rx="3" fill={ladenLicht ? '#ffe4a3' : mix('#5b6170', '#1a1d26', dunkel)} />
        <path d="M52 240 h160 M132 240 v82" stroke={mix('#8a8073', '#3a3c44', dunkel)} strokeWidth="4" />
        {/* Tür */}
        <rect x="228" y="240" width="52" height="92" rx="2" fill={mix('#7a4a30', '#2b2220', dunkel)} />
        <circle cx="270" cy="290" r="3" fill="#d8b46a" />
        <rect x="236" y="252" width="36" height="16" rx="2" fill="#fffdf8" opacity={0.85 - dunkel * 0.4} />
        <text x="254" y="264" textAnchor="middle" fill="#1d1a17" style={{ font: '700 9px var(--font-mono)' }}>
          {m < 1 ? 'OFFEN' : 'ZU'}
        </text>
      </g>

      {/* Dein Zuhause */}
      <g>
        <path d="M452 250 L530 196 L608 250 Z" fill={mix('#8b4a33', '#2a1d1b', dunkel)} />
        <rect x="462" y="248" width="136" height="84" fill={mix('#e6dccb', '#262830', dunkel * 0.9)} />
        {hausLicht && <circle cx="505" cy="285" r="70" fill="url(#nacht-schein)" />}
        <rect x="482" y="266" width="44" height="36" rx="2" fill={hausLicht ? '#ffe4a3' : mix('#5b6170', '#1a1d26', dunkel)} />
        <path d="M504 266 v36 M482 284 h44" stroke={mix('#8a8073', '#3a3c44', dunkel)} strokeWidth="3" />
        <rect x="546" y="272" width="32" height="60" rx="2" fill={mix('#6a4a3a', '#221c1c', dunkel)} />
        {!hausLicht && m > 250 && m < 640 && (
          <text x="520" y="252" fill="#e9eef7" style={{ font: '700 15px var(--font-sans)' }} opacity="0.85">
            z z z
          </text>
        )}
      </g>

      {/* Der Brief um 04:00 */}
      {m >= MAIL_AB && (
        <g transform={`translate(${kurve(brief, [500, 120], [600, 160], [504, 276]).join(' ')}) scale(${0.7 + brief * 0.3})`}>
          <rect x="-16" y="-11" width="32" height="22" rx="3" fill="#fffdf8" stroke="var(--color-wurst)" strokeWidth="2" />
          <path d="M-16 -9 L0 3 L16 -9" fill="none" stroke="var(--color-wurst)" strokeWidth="2" />
        </g>
      )}
    </svg>
  )
}

export default function Nacht() {
  const reglerId = useId()
  const [m, setM] = useState(0)
  const [laeuft, setLaeuft] = useState(false)
  const buehne = useRef<HTMLDivElement>(null)
  const schonGespielt = useRef(false)
  const station = [...nachtStationen].reverse().find((s) => m >= s.ab)!

  // Abspielen: die Minute läuft in DAUER_MS von der aktuellen Stelle bis 07:00
  useEffect(() => {
    if (!laeuft) return
    let rahmen = 0
    let start = 0
    let ab = 0
    const schritt = (jetzt: number) => {
      if (!start) {
        start = jetzt
        ab = m >= NACHT_MINUTEN ? 0 : m
      }
      const weiter = Math.min(NACHT_MINUTEN, ab + ((jetzt - start) / DAUER_MS) * NACHT_MINUTEN)
      setM(Math.round(weiter))
      if (weiter >= NACHT_MINUTEN) setLaeuft(false)
      else rahmen = requestAnimationFrame(schritt)
    }
    rahmen = requestAnimationFrame(schritt)
    return () => cancelAnimationFrame(rahmen)
    // m bewusst nicht in den Abhängigkeiten: nur der Startwert zählt
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [laeuft])

  // Beim ersten Sichtbarwerden einmal von selbst abspielen
  useEffect(() => {
    const el = buehne.current
    if (!el || bewegungReduziert()) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !schonGespielt.current) {
          schonGespielt.current = true
          setLaeuft(true)
          io.disconnect()
        }
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const knopf = () => {
    schonGespielt.current = true
    if (bewegungReduziert()) {
      const naechste = nachtStationen.find((s) => s.ab > m)
      setM(naechste ? naechste.ab : 0)
      return
    }
    if (!laeuft && m >= NACHT_MINUTEN) setM(0)
    setLaeuft(!laeuft)
  }

  return (
    <section aria-labelledby="nacht-titel" className="fokus-hell bg-nacht py-20 text-kreide md:py-28">
      <div className="rahmen">
        <div className="max-w-3xl">
          <h2 id="nacht-titel" className="titel text-[clamp(2.5rem,5.6vw,4.6rem)]">
            Während du schläfst, rechnet die Wurst.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-kreide/85">
            Zieh die Uhr von Ladenschluss bis zum ersten Kaffee und schau zu, was nachts mit deinen Kassendaten passiert.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div ref={buehne} className="relative overflow-hidden rounded-3xl ring-1 ring-nacht-linie">
              <Szene m={m} />
              <p className="ziffern absolute top-3 left-3 rounded-xl bg-nacht/75 px-3 py-1.5 font-mono text-2xl font-bold text-senf md:top-4 md:left-4 md:text-3xl">
                {uhr(m)}
              </p>
              <div className="absolute top-[5%] left-[72%] w-[16%]">
                <Wursti
                  brille={m >= 300 && m < 480}
                  stimmung={m >= 480 && m < 600 ? 'lacht' : 'froh'}
                  blinzeln
                  className="h-auto w-full"
                />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-4">
              <button
                type="button"
                onClick={knopf}
                aria-label={laeuft ? 'Anhalten' : 'Nacht abspielen'}
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-senf text-tinte shadow-[0_3px_0_#b8861a] transition-transform hover:-translate-y-0.5"
              >
                <FontAwesomeIcon icon={laeuft ? faPause : faPlay} className="h-4 w-4" aria-hidden="true" />
              </button>
              <div className="min-w-0 flex-1">
                <label htmlFor={reglerId} className="sr-only">
                  Uhrzeit in der Nacht
                </label>
                <input
                  id={reglerId}
                  type="range"
                  min={0}
                  max={NACHT_MINUTEN}
                  step={5}
                  value={m}
                  onChange={(e) => {
                    setLaeuft(false)
                    schonGespielt.current = true
                    setM(Number(e.target.value))
                  }}
                  aria-valuetext={`${uhr(m)} Uhr, ${station.titel}`}
                  className="wurstregler wurstregler-dunkel w-full"
                />
                <div className="ziffern flex justify-between font-mono text-xs text-nebel" aria-hidden="true">
                  <span>19:00</span>
                  <span>22:00</span>
                  <span>01:00</span>
                  <span className="font-bold text-senf">04:00</span>
                  <span>07:00</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-5">
            <div className="rounded-3xl bg-nacht-hell p-6 ring-1 ring-nacht-linie md:p-7" aria-live={laeuft ? 'off' : 'polite'} aria-atomic="true">
              <h3 className="schild text-2xl text-senf">
                {station.titel}
              </h3>
              <p className="mt-2 text-xl leading-snug">{station.text}</p>
            </div>
            {/* Mail und leeres Postfach liegen übereinander, damit die Höhe beim Eintreffen nicht springt */}
            <div className="grid">
              <div className={`[grid-area:1/1] ${m >= MAIL_AB ? 'einfliegen' : 'invisible'}`} aria-hidden={m < MAIL_AB}>
                <Tagesreport />
              </div>
              {m < MAIL_AB && (
                <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-nacht-linie p-6 text-center text-nebel [grid-area:1/1]">
                  <FontAwesomeIcon icon={faEnvelope} className="h-7 w-7" aria-hidden="true" />
                  <p>Dein Postfach. Noch leer, um 4 Uhr kommt Post.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
