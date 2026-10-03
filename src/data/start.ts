/**
 * Texte und Spielzahlen der Startseite, getrennt vom Markup.
 *
 * Was ByteWurst kann, stammt von bytewurst.de (Startseite, Doku, Blog). Die
 * Zahlen im Planspiel sind ausgedacht und auf der Seite so gekennzeichnet.
 */

/** Was Wursti sagt, wenn man ihn anstupst. Reihum, nicht zufällig. */
export const wurstiSprueche = [
  'Ich bin keine Wurst. Ich bin ein Prognosemodell.',
  'Psst: Samstag wird es eng mit dem Leberkäse.',
  'Um vier Uhr früh bin ich schon fertig. Und du?',
  'Alles hat ein Ende, nur ich hab zwei.',
  'Bauchgefühl hab ich auch. Nur mit Nachkommastellen.',
  'Ich rechne nachts, damit du schlafen kannst.',
  'Noch einmal stupsen und ich rechne dir die Grillsaison aus.',
]

/**
 * Notizzettel an der Pinnwand in der Wurstküche: vorne das Problem, so wie
 * es Metzger beschreiben (bytewurst.de), hinten was ByteWurst daran ändert.
 */
export const zettel = [
  {
    vorne: 'Montag, 17 Uhr. Vom Wochenende liegt noch Aufschnitt da.',
    vorneKlein: 'Ab in die Abschrift. Wie jeden Montag.',
    hinten: 'Die Wochenprognose sagt dir je Warengruppe und Wochentag, wie viel du brauchst. Montags produzierst du weniger, ohne zu raten.',
    farbe: 'papier',
  },
  {
    vorne: 'Samstag, 11 Uhr. Grillfleisch aus.',
    vorneKlein: 'Die Schlange ist noch lang.',
    hinten: 'ByteWurst kennt das erste Grillwochenende im Mai, die Leberkäs-Spitze am Samstagvormittag und das Ferienloch im August. Aus deinen eigenen Verkäufen der letzten Jahre.',
    farbe: 'senf',
  },
  {
    vorne: 'Hackfleisch im Angebot. Laden voll!',
    vorneKlein: 'Und die Kasse? Weiß keiner.',
    hinten: 'Nach jeder Aktion siehst du schwarz auf weiß Besucher, Umsatz und Bon-Höhe im Vorher-Nachher-Vergleich. Du wiederholst nur, was sich rechnet.',
    farbe: 'papier',
  },
  {
    vorne: 'Die Neue plant nach Gefühl.',
    vorneKlein: 'Das alte Gefühl ist in Rente gegangen.',
    hinten: 'Die Prognose hängt jeden Morgen als A4 an der Pinnwand. Die Neue liest dieselben Zahlen wie der Chef.',
    farbe: 'rosa',
  },
  {
    vorne: 'Kassenauswertung machen!',
    vorneKlein: 'Steht hier seit März.',
    hinten: 'Musst du nicht. Die Zahlen kommen zu dir: jeden Morgen um 4 Uhr als kurze Mail, auf Wunsch als A4 für genau diese Pinnwand.',
    farbe: 'papier',
  },
] as const

export type ZettelFarbe = (typeof zettel)[number]['farbe']

/**
 * Das Planspiel: grobe Bratwurst, drei Tage. Ausgedachte Zahlen, so auf der
 * Seite gekennzeichnet. Die Tage greifen die Muster auf, die ByteWurst laut
 * bytewurst.de erkennt: Wochentag, erstes Grillwochenende, Ferienloch.
 */
export const spielArtikel = 'grobe Bratwurst'
export const spielHoechstens = 300

export const spielRunden = [
  {
    tag: 'Dienstag im März',
    lage: 'Ein ganz normaler Dienstag. Grau, 9 Grad, keine Feiertage in Sicht.',
    vorwoche: 58,
    verkauft: 63,
    prognose: 61,
  },
  {
    tag: 'Freitag im Mai',
    lage: 'Der Wetterbericht sagt 24 Grad fürs Wochenende. Das erste warme des Jahres.',
    vorwoche: 96,
    verkauft: 214,
    prognose: 205,
  },
  {
    tag: 'Donnerstag im August',
    lage: 'Sommerferien. Die Stammkundschaft sitzt am Gardasee.',
    vorwoche: 124,
    verkauft: 71,
    prognose: 76,
  },
] as const

/**
 * Die Nacht, von Ladenschluss bis zum ersten Kaffee. Minuten ab 19:00 Uhr.
 * Fest steht nur der Report um 4 Uhr (bytewurst.de), die anderen Stationen
 * nennen deshalb keine Uhrzeit.
 */
export const nachtStationen = [
  {
    ab: 0,
    titel: 'Feierabend',
    text: 'Der letzte Bon ist gedruckt. Alles, was heute über die Theke ging, steht jetzt in deiner Kasse.',
  },
  {
    ab: 150,
    titel: 'Füße hoch',
    text: 'Die Wurstküche ist sauber, du liegst auf dem Sofa. Um die Zahlen von heute kümmerst du dich nicht. Musst du auch nicht.',
  },
  {
    ab: 300,
    titel: 'Nachts',
    text: 'ByteWurst holt sich die Verkaufsdaten des Tages automatisch aus deinem Warenwirtschaftssystem.',
  },
  {
    ab: 390,
    titel: 'Rechnen',
    text: 'ByteWurst legt den Tag neben deine letzten Jahre und wägt ab: Wochentag, Jahreszeit, Feiertage, Wetter. Welcher Einfluss bei welchem Artikel wirklich zählt, lernt sie aus deinen eigenen Verkäufen.',
  },
  {
    ab: 480,
    titel: 'Die Prognose steht',
    text: 'Für die nächsten sieben Tage, je Warengruppe und Wochentag. Dazu die Renner und Ladenhüter von gestern.',
  },
  {
    ab: 540,
    titel: '04:00 Uhr',
    text: 'Pling. Dein Tagesreport liegt im Postfach. Ohne Login, ohne App.',
  },
  {
    ab: 660,
    titel: 'Erster Kaffee',
    text: 'Du liest deine Zahlen, bevor der erste Kunde vor der Theke steht. Dann weißt du, was heute in die Auslage gehört.',
  },
] as const

/** Ab dieser Minute (04:00 Uhr) liegt die Mail im Postfach */
export const MAIL_AB = 540
export const NACHT_MINUTEN = 720

/**
 * Was in der ByteWurst steckt, als Posten auf dem Kassenbon. Wörtlich nah an
 * bytewurst.de, dort als Liste "Alles, was in der ByteWurst steckt".
 */
export const posten = [
  { name: 'Nächtlicher Datenimport', text: 'Holt sich die Verkaufsdaten automatisch aus deinem Warenwirtschaftssystem.' },
  { name: 'Wochenprognose', text: 'Je Warengruppe und Wochentag, berechnet aus deinen eigenen Verkäufen.' },
  { name: 'Saisonkurven', text: 'Grillsaison, Feiertage, Ferienloch: Schwankungen übers Jahr auf einen Blick.' },
  { name: 'Aktions-Auswertung', text: 'Besucher, Umsatz und Bon-Höhe vor und nach jeder Aktion im Vergleich.' },
  { name: 'Top-Produkte', text: 'Die Renner und Ladenhüter des Vortags, jeden Morgen frisch sortiert.' },
  { name: 'Stoßzeiten-Analyse', text: 'Wann deine Kunden kommen, damit Personal und Theke vorbereitet sind.' },
  { name: 'Bon-Kennzahlen', text: 'Durchschnittsbon und Bon-Anzahl im Verlauf, Tag für Tag.' },
  { name: 'Warengruppen-Vergleich', text: 'Welche Gruppe wächst, welche schwächelt und wie sich das übers Jahr verschiebt.' },
  { name: 'Filialvergleich', text: 'Mehrere Standorte nebeneinander, ohne ein einziges Telefonat.' },
  { name: 'Report per E-Mail', text: 'Jeden Morgen um 4 Uhr im Postfach. Ohne Login, ohne App.' },
  { name: 'Druckfertig auf Papier', text: 'Jeder Report kommt als A4 aus dem Drucker und hängt in der Wurstküche an der Pinnwand.' },
  { name: 'Keine neue Hardware', text: 'Kasse und Warenwirtschaft bleiben, wie sie sind. Alles läuft nachts in der Cloud.' },
] as const
