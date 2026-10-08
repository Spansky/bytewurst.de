/* "Bewegung reduzieren" nur im Browser abfragen. Die Seite wird auf dem Server
   gerendert, dort gibt es kein window. */
export function bewegungReduziert(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
