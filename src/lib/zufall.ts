/* Zufall mit festem Startwert. Die Beispieldaten der Diagramme sollen auf dem
   Server und im Browser gleich herauskommen, sonst passt das vorgerenderte
   HTML nicht zum ersten Render. Math.random ist deshalb tabu. */
export function zufall(startwert: number) {
  let a = startwert >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Pearson-Korrelation zweier gleich langer Reihen, -1 bis +1 */
export function pearson(a: number[], b: number[]): number {
  const n = a.length
  const ma = a.reduce((s, x) => s + x, 0) / n
  const mb = b.reduce((s, x) => s + x, 0) / n
  let z = 0
  let qa = 0
  let qb = 0
  for (let i = 0; i < n; i++) {
    z += (a[i] - ma) * (b[i] - mb)
    qa += (a[i] - ma) ** 2
    qb += (b[i] - mb) ** 2
  }
  return z / Math.sqrt(qa * qb)
}
