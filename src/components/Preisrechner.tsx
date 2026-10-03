import { useId, useState } from 'react'
import {
  EFFIZIENZ_ANNAHME,
  EURO_JE_100K,
  monatsgebuehr,
  UMSATZ_MAX,
  UMSATZ_MIN,
  UMSATZ_START,
  WECKLE_PREIS,
} from '../data/preise'
import { euro, euroGenau, ganz, umsatzKurz } from '../lib/format'

/*
  Preisrechner für Early Adopter: Jahresumsatz einstellen, Monatsgebühr
  ablesen. Der Regler läuft logarithmisch, sonst wäre die Landmetzgerei
  auf den ersten Millimeter gequetscht. Grenzen wie auf bytewurst.de.
*/
const SCHRITTE = 1000

function umsatzAus(stellung: number): number {
  const roh = UMSATZ_MIN * (UMSATZ_MAX / UMSATZ_MIN) ** (stellung / SCHRITTE)
  const raster = roh < 1_000_000 ? 10_000 : roh < 10_000_000 ? 100_000 : 1_000_000
  return Math.round(roh / raster) * raster
}

function stellungAus(umsatz: number): number {
  return Math.round((Math.log(umsatz / UMSATZ_MIN) / Math.log(UMSATZ_MAX / UMSATZ_MIN)) * SCHRITTE)
}

export default function Preisrechner({ voll = false, className = '' }: { voll?: boolean; className?: string }) {
  const id = useId()
  const [stellung, setStellung] = useState(stellungAus(UMSATZ_START))
  const umsatz = umsatzAus(stellung)
  const gebuehr = monatsgebuehr(umsatz)
  const weckle = Math.round(gebuehr / WECKLE_PREIS)
  const jahresAnteil = ((gebuehr * 12) / umsatz) * 100
  const gebuehrText = Number.isInteger(gebuehr) ? euro(gebuehr) : euroGenau(gebuehr)

  return (
    <div className={`rounded-3xl bg-papier p-5 text-tinte shadow-[0_24px_50px_-28px_rgb(0_0_0/0.45)] md:p-8 ${className}`}>
      <label htmlFor={id} className="block font-semibold">
        Dein Jahresumsatz
      </label>
      <p className="titel ziffern mt-1 text-[clamp(2.4rem,7vw,3.6rem)] text-tinte">{umsatzKurz(umsatz)}</p>
      <input
        id={id}
        type="range"
        min={0}
        max={SCHRITTE}
        value={stellung}
        onChange={(e) => setStellung(Number(e.target.value))}
        aria-valuetext={`${umsatzKurz(umsatz)} Jahresumsatz, ${gebuehrText} im Monat`}
        className="wurstregler mt-4 w-full"
      />
      <div className="ziffern mt-1 flex justify-between font-mono text-xs text-grau" aria-hidden="true">
        <span>{umsatzKurz(UMSATZ_MIN)}</span>
        <span>{umsatzKurz(UMSATZ_MAX)}</span>
      </div>

      <div className="bon-linie mt-6 pt-6 sm:flex sm:items-end sm:justify-between sm:gap-6">
        <div>
          <p className="font-semibold">Du zahlst im Monat</p>
          <p className="titel ziffern mt-1 text-[clamp(3rem,9vw,4.6rem)] text-wurst" aria-live="polite">
            {gebuehrText}
          </p>
        </div>
        <p className="mt-3 max-w-xs text-sm text-grau sm:mt-0 sm:text-right">
          {EURO_JE_100K} € je 100.000 € Jahresumsatz. Aufs Jahr gerechnet {jahresAnteil.toFixed(2).replace('.', ',')} % deines Umsatzes.
        </p>
      </div>

      <p className="mt-5 rounded-2xl bg-senf/25 px-4 py-3 text-[0.9375rem]">
        Das sind ungefähr <strong className="ziffern">{ganz(weckle)} Leberkäsweckle</strong> im Monat.{' '}
        <span className="text-grau">(Bei angenommenen {euroGenau(WECKLE_PREIS)} das Stück.)</span>
      </p>

      {voll && (
        <p className="mt-4 text-[0.9375rem] text-grau">
          Und was es bringen kann: ByteWurst rechnet konservativ mit {EFFIZIENZ_ANNAHME * 100} % Effizienzgewinn durch bessere
          Prognosen und weniger Abschriften. Bei {umsatzKurz(umsatz)} Umsatz wären das rund{' '}
          <strong className="ziffern text-tinte">{euro(umsatz * EFFIZIENZ_ANNAHME)} im Jahr</strong>. Eine Schätzung, keine
          Zusage. Was es bei dir bringt, zeigen deine eigenen Zahlen.
        </p>
      )}
    </div>
  )
}
