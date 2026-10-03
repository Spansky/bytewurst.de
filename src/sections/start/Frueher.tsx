import type { CSSProperties } from 'react'
import Bild from '../../components/Bild'

/* Personal wechselt, die Zahlen bleiben. Mit einem Foto aus der Zeit, als der Chef noch alles im Kopf hatte. */
export default function Frueher() {
  return (
    <section aria-labelledby="frueher-titel" className="fliesen py-20 md:py-28">
      <div className="rahmen grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <figure className="lg:col-span-7" data-einblenden="kippen" style={{ '--kipp': '-4deg', '--ruhe': '-1.2deg' } as CSSProperties}>
          <div className="bg-papier p-3 pb-4 shadow-[0_30px_50px_-30px_rgb(0_0_0/0.6)] sm:p-4 sm:pb-5">
            <Bild
              name="frueher"
              sizes="(min-width: 1024px) 55vw, 100vw"
              alt="Altes Schwarzweißfoto einer Metzgerei: Männer in weißen Kitteln stehen hinter einer langen Theke mit Waage, rechts hängen Rinderhälften an Haken, an den Wänden Geweihe."
              className="h-auto w-full grayscale"
            />
            <figcaption className="schild mt-3 px-1 text-[1.0625rem]">
              Damals: Der Chef weiß alles. Ist er krank, weiß es keiner.
            </figcaption>
          </div>
        </figure>

        <div className="lg:col-span-5">
          <h2 id="frueher-titel" className="titel text-[clamp(2.5rem,5.2vw,4.2rem)]">
            Früher hatte der Chef alles im Kopf.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-tinte/85">
            Hängt deine Planung am Gefühl von ein, zwei Leuten? Genau deshalb kommen Inhaber von Metzgereien zu ByteWurst. Das
            Personal wechselt, gute Fachkräfte kommen längst nicht mehr nur aus der Region, und alles selbst zu kontrollieren
            ist keine Lösung.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-tinte/85">
            Mit ByteWurst plant jeder im Team mit denselben Zahlen, egal wer gerade hinter der Theke steht.
          </p>
        </div>
      </div>
    </section>
  )
}
