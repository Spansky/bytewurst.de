import Bild from '../../components/Bild'
import Knoepfe from '../../components/Knoepfe'
import WurstiBuehne from '../../components/WurstiBuehne'

/* Der letzte Abschnitt vor der Fußzeile: reden wir. */
export default function Schluss({ titel = 'Lass uns über Wurst reden.' }: { titel?: string }) {
  return (
    <section aria-labelledby="schluss-titel" className="fokus-hell relative overflow-hidden bg-tinte text-papier">
      <div className="absolute inset-0">
        <Bild
          name="ueber-die-theke"
          sizes="(min-width: 1024px) 100vw, (min-width: 640px) 160vw, 320vw"
          alt=""
          className="h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-tinte via-tinte/85 to-tinte/30" />
      </div>
      <div className="rahmen relative grid items-end gap-12 py-24 md:py-32 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 id="schluss-titel" className="titel text-[clamp(2.8rem,7vw,5.6rem)]">
            {titel}
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-papier/90">
            Wir zeigen dir ByteWurst gern bei dir in der Metzgerei, per Video oder am Telefon. Eingerichtet ist sie in etwa
            zehn Minuten, deine ersten Umsatzdiagramme mit deinen eigenen Zahlen siehst du noch am selben Tag.
          </p>
          <Knoepfe dunkel className="mt-9" />
          <p className="mt-6 text-papier/75">Wir sprechen Metzger, nicht IT. Versprochen.</p>
        </div>
        <div className="hidden lg:col-span-4 lg:col-start-9 lg:block">
          <WurstiBuehne className="mx-auto mt-24 w-56" />
        </div>
      </div>
    </section>
  )
}
