import Wursti from './Wursti'

/** Wortmarke mit kleinem Wursti davor. Schrift statt Pfad, sie steht ohnehin schon im Kopf geladen. */
export default function Logo({ className = '', hell = false }: { className?: string; hell?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Wursti ohneBeine blinzeln className="h-[1.35em] w-auto" />
      <span
        className={`text-[1.35em] leading-none font-extrabold tracking-tight ${hell ? 'text-papier' : 'text-tinte'}`}
        style={{ fontStretch: '80%', fontVariationSettings: '"opsz" 60' }}
      >
        Byte<span className={hell ? 'text-senf' : 'text-wurst'}>Wurst</span>
      </span>
    </span>
  )
}
