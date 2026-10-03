import { bildEintrag, bildSatz } from '../lib/bilder'

type Props = {
  name: string
  alt: string
  /** Gezeichnete Breite für sizes. Bei object-cover die Breite des Fotos, nicht des Rahmens (LESSONS 2026-09-27). */
  sizes: string
  className?: string
  /** Nur für das Bild im ersten Bildschirm: nicht lazy, hohe Priorität */
  vorne?: boolean
}

/** AVIF, WebP, Maße gegen Layoutsprünge. Quelle: scripts/prepare-images.mjs */
export default function Bild({ name, alt, sizes, className, vorne }: Props) {
  const b = bildEintrag(name)
  const groesste = b.breiten[b.breiten.length - 1]
  return (
    <picture>
      <source type="image/avif" srcSet={bildSatz(name, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={bildSatz(name, 'webp')} sizes={sizes} />
      <img
        src={`/bilder/${name}-${groesste}.webp`}
        alt={alt}
        width={b.breite}
        height={b.hoehe}
        loading={vorne ? undefined : 'lazy'}
        fetchPriority={vorne ? 'high' : undefined}
        decoding={vorne ? undefined : 'async'}
        className={className}
      />
    </picture>
  )
}
