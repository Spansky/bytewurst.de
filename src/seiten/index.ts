import type { ComponentType } from 'react'
import type { SeitenSchluessel } from '../data/seiten'

/*
  Jede Seite ist ein eigenes Stück JavaScript. Der Browser lädt nur die
  Seite, auf der er ist. Das Vorrendern importiert alle direkt
  (entry-server.tsx), damit es synchron bleibt.
*/
export const laden: Record<SeitenSchluessel, () => Promise<{ default: ComponentType }>> = {
  start: () => import('./Start'),
  funktionen: () => import('./Funktionen'),
  preise: () => import('./Preise'),
  impressum: () => import('./Impressum'),
  datenschutz: () => import('./Datenschutz'),
  fehlt: () => import('./NichtGefunden'),
}
