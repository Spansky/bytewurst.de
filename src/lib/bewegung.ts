/*
  "Bewegung reduzieren" nur in Effekten abfragen, nie im Render. Beim
  Vorrendern gibt es kein window, und ein Unterschied zwischen Server-HTML und
  erstem Client-Render bleibt hängen (Badge-Notiz in der Erinnerung).
*/
export function bewegungReduziert(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
