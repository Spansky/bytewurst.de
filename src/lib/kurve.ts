/* Kleine Helfer für die SVG-Diagramme. Keine Diagrammbibliothek: die Seite
   braucht ein paar Linien und Balken, dafür lohnt kein zusätzliches Paket. */

export type Punkt = [number, number]

/** Weiche Linie durch alle Punkte (Catmull-Rom als kubische Bezier), überschießt nicht stark */
export function weich(punkte: Punkt[], spannung = 0.18): string {
  if (punkte.length < 2) return ''
  const r = (v: number) => v.toFixed(1)
  let d = `M${r(punkte[0][0])} ${r(punkte[0][1])}`
  for (let i = 0; i < punkte.length - 1; i++) {
    const p0 = punkte[i - 1] ?? punkte[i]
    const p1 = punkte[i]
    const p2 = punkte[i + 1]
    const p3 = punkte[i + 2] ?? p2
    const c1: Punkt = [p1[0] + (p2[0] - p0[0]) * spannung, p1[1] + (p2[1] - p0[1]) * spannung]
    const c2: Punkt = [p2[0] - (p3[0] - p1[0]) * spannung, p2[1] - (p3[1] - p1[1]) * spannung]
    d += ` C${r(c1[0])} ${r(c1[1])} ${r(c2[0])} ${r(c2[1])} ${r(p2[0])} ${r(p2[1])}`
  }
  return d
}

/** Gerade Linie durch alle Punkte */
export function gerade(punkte: Punkt[]): string {
  return punkte.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
}

/** Wert linear von einem Bereich in einen anderen abbilden */
export function skala(von: [number, number], nach: [number, number]) {
  return (v: number) => nach[0] + ((v - von[0]) / (von[1] - von[0])) * (nach[1] - nach[0])
}
