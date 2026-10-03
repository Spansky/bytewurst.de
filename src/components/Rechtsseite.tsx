import type { ReactNode } from 'react'

/** Schlichter Rahmen für Impressum und Datenschutz */
export default function Rechtsseite({ titel, children }: { titel: string; children: ReactNode }) {
  return (
    <article className="fliesen">
      <div className="rahmen py-16 md:py-24">
        <h1 className="titel text-[clamp(3rem,8vw,6.5rem)]">{titel}</h1>
        <div className="mt-10 max-w-3xl space-y-10 rounded-2xl bg-papier p-6 text-tinte/85 shadow-[0_1px_0_var(--color-fuge)] md:p-10 [&_a]:font-semibold [&_a]:text-wurst-tief [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-wurst [&_h2]:titel [&_h2]:mb-3 [&_h2]:text-3xl [&_h2]:text-tinte [&_p+p]:mt-3">
          {children}
        </div>
      </div>
    </article>
  )
}
