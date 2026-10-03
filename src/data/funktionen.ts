/**
 * Texte der Seite Funktionen, getrennt vom Markup. Quelle: bytewurst.de
 * (Startseite, Doku "Umsatzreport", Release Notes März 2026).
 */

/** Weitere Funktionen als Preisschilder in der Auslage */
export const auslage = [
  { name: 'Filialvergleich', text: 'Mehrere Standorte nebeneinander, ohne ein einziges Telefonat.' },
  {
    name: 'Warengruppen-Vergleich',
    text: 'Welche Gruppe wächst, welche schwächelt und wie sich das übers Jahr verschiebt. Ganze Warengruppen wählst du mit einem Klick aus.',
  },
  {
    name: 'BonTok',
    text: 'Blättere durch einzelne Bons und filtere zum Beispiel nach Mindestsumme. Rabatte und echte Stornos hält ByteWurst dabei auseinander.',
  },
  { name: 'Stoßzeiten', text: 'Wann deine Kunden kommen, damit Personal und Theke vorbereitet sind.' },
  { name: 'Bon-Kennzahlen', text: 'Durchschnittsbon und Bon-Anzahl im Verlauf, Tag für Tag.' },
  { name: 'Top-Produkte', text: 'Die Renner und Ladenhüter des Vortags, jeden Morgen frisch sortiert.' },
  { name: 'Saisonkurven', text: 'Grillsaison, Feiertage, Ferienloch: die Schwankungen übers Jahr auf einen Blick.' },
  {
    name: 'Feiertage im Vergleich',
    text: 'Ostern, Pfingsten, Weihnachten: tabellarisch nebeneinander, jeweils sieben Tage vor und nach dem Fest.',
  },
  { name: 'Wetter im Umsatzreport', text: 'Tiefst- und Höchsttemperatur je Woche direkt neben deinen Verkäufen.' },
] as const

/** Der Weg von der Demo bis zum ersten Report, nach Zeit statt nach Nummern */
export const weg = [
  {
    wann: 'Heute',
    was: 'Demo-Termin aussuchen',
    text: 'Online buchen oder anrufen. Wir zeigen dir ByteWurst bei dir vor Ort, per Video oder am Telefon.',
  },
  {
    wann: 'In etwa zehn Minuten',
    was: 'Eingerichtet',
    text: 'Einmal einrichten, das war es. Kasse und Warenwirtschaft bleiben, wie sie sind.',
  },
  {
    wann: 'Noch am selben Tag',
    was: 'Deine ersten Umsatzdiagramme',
    text: 'Du siehst, wie sich deine Produkte und Filialen entwickeln, und kannst gleich selbst einschätzen, wie gut deine Daten sind.',
  },
  {
    wann: 'Ab jetzt jede Nacht',
    was: 'Import und Prognose',
    text: 'ByteWurst holt sich die neuen Verkaufsdaten und rechnet die nächsten sieben Tage durch.',
  },
  {
    wann: 'Jeden Morgen um 4 Uhr',
    was: 'Dein Report',
    text: 'Als kurze Mail im Postfach, als A4 für die Pinnwand oder als Diagramm zum Reinzoomen.',
  },
] as const
