/**
 * Die Fotos der Seite mit Alternativtext, zur Auswahl im Blog (Feld "bild" der
 * Sammlung posts). Namen wie in bilder.json, Nachweis im Impressum.
 *
 * Bewusst eine Auswahl statt Hochladen: So bleiben AVIF/WebP in allen Größen,
 * der Bildnachweis und die Zuschnitte (scripts/prepare-images.mjs) erhalten.
 * Neues Foto: erst über `npm run images` aufnehmen, dann hier und in der
 * Auswahl des Feldes eintragen (scripts/blog.mjs).
 */
export const fotos = {
  schaufenster:
    'Schaufenster einer Metzgerei: Salami und Würste hängen an Schnüren, davor eine alte weiße Waage auf einem Holztisch, darüber eine Leuchtschrift.',
  theke:
    'Lange Fleischtheke mit Glasaufsatz vor weißen Wandfliesen. Dahinter steht ein Verkäufer in Jeanshemd und Lederschürze, in der Auslage stecken kleine schwarze Preisschilder.',
  'ueber-die-theke': 'Blick über eine Wursttheke mit vielen Sorten in der Auslage.',
  frueher:
    'Altes Schwarzweißfoto einer Metzgerei: Männer in weißen Kitteln stehen hinter einer langen Theke mit Waage, rechts hängen Rinderhälften an Haken.',
  'wurst-senf':
    'Zwei gegrillte Bratwürste auf einem grauen Teller, eine davon angeschnitten, daneben Senf in einem Papierförmchen und eine Gurkenscheibe.',
  kaffee: 'Eine Tasse schwarzer Kaffee mit Untertasse auf einem dunklen, polierten Holztisch.',
  bon: 'Ein Kartenterminal von oben auf orangem Grund, aus dem ein langer weißer Kassenbon kommt.',
} as const

export type FotoName = keyof typeof fotos

export function fotoAlt(name: string | null | undefined): string {
  return fotos[name as FotoName] ?? ''
}
