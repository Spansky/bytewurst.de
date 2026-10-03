import type { ReactNode } from 'react'

/** Dunkles Anwendungsfenster wie in der ByteWurst-App: Titelleiste, Inhalt, Fußnote */
export default function Fenster({
  titel,
  fuss,
  children,
  className = '',
}: {
  titel: string
  fuss?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <figure
      className={`overflow-hidden rounded-2xl bg-nacht text-kreide shadow-[0_30px_60px_-30px_rgb(0_0_0/0.7)] ring-1 ring-white/5 ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-nacht-linie bg-nacht-hell px-4 py-2.5">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-nacht-linie" />
          <span className="h-2.5 w-2.5 rounded-full bg-nacht-linie" />
          <span className="h-2.5 w-2.5 rounded-full bg-nacht-linie" />
        </span>
        <span className="etikett ml-2 text-nebel">{titel}</span>
      </div>
      <div className="p-4 md:p-5">{children}</div>
      {fuss && <figcaption className="etikett border-t border-nacht-linie px-4 py-2.5 text-[0.6875rem] text-nebel normal-case">{fuss}</figcaption>}
    </figure>
  )
}
