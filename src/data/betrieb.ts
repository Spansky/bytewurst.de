/**
 * Firmen- und Kontaktdaten an einer Stelle, getrennt vom Markup.
 *
 * Alles hier stammt von bytewurst.de (Startseite, Preise, Impressum) und
 * bytebutchers.de, Stand 2026-10-03. Nichts davon ist erfunden. Was die Seite
 * darüber hinaus behauptet, steht in der Freigabeliste in PROJEKT.md.
 */

/**
 * Konzeptentwurf von Jock&Jock, nicht von ByteButchers beauftragt oder
 * freigegeben. Schaltet: noindex auf allen Seiten, robots.txt sperrt alles,
 * Hinweis in der Fußzeile, Impressum nennt den Entwurf statt der Firma.
 * Erst auf false, wenn ByteButchers die Seite abgenommen hat.
 */
export const KONZEPT = true

/** Die Adresse, unter der die Seite läuft. Vor dem Eintragen per curl prüfen (hausstandard). */
export const SEITEN_URL = 'https://bytewurst.stevejocks.de'

export const firma = {
  produkt: 'ByteWurst',
  name: 'ByteButchers GmbH',
  strasse: 'Voltastraße 13',
  plz: '70376',
  ort: 'Stuttgart',
  geschaeftsfuehrer: 'Leon Sczepansky',
  register: 'Amtsgericht Stuttgart, HRB 804985',
  ustId: 'DE462372036',
  email: 'contact@bytebutchers.de',
  telefon: '0711 5408 4900',
  telefonRoh: '+4971154084900',
  /** Terminbuchung für die Demo, dieselbe wie auf bytewurst.de */
  demo: 'https://cal.eu/bytewurst/demotermin',
  /** Die Anwendung selbst läuft auf bytewurst.de */
  anmelden: 'https://bytewurst.de/login',
  registrieren: 'https://bytewurst.de/register',
  /** Absender der Morgenmail, so wie er auf bytewurst.de gezeigt wird */
  reportAbsender: 'report@bytewurst.de',
  /** Das zweite Produkt von ByteButchers */
  schwester: { name: 'wurstpad.com', url: 'https://wurstpad.com' },
} as const

/**
 * Solange KONZEPT gilt, betreibt Jock&Jock die Seite unter der stevejocks-Adresse
 * und ist damit Anbieter und verantwortlich. Daten wie im Impressum von
 * jockjock.de (website-jockjock/src/data/kontakt.ts).
 */
export const konzeptAnbieter = {
  name: 'Jock&Jock',
  inhaber: 'Dominik Jock',
  strasse: 'Ruhesteinstr. 7',
  plz: '76327',
  ort: 'Pfinztal',
  email: 'hallo@jockjock.de',
  telefon: '0152 578 095 60',
  telefonRoh: '+4915257809560',
} as const
