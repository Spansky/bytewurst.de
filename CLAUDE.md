# ByteWurst

Stack, Versionen und harte Regeln stehen in der Skill `hausstandard`. Hier steht nur,
was für dieses Projekt davon abweicht oder zusätzlich gilt.
Stand, Freigabeliste und offene Punkte: siehe PROJEKT.md.

## Adressen

| Was | Adresse |
|---|---|
| Live | https://bytewurst.stevejocks.de (geplant, Cloudflare Worker `bytewurst`, noch nicht ausgeliefert) |
| Staging | `bytewurst-staging.<konto>.workers.dev` (Worker `bytewurst-staging`) |
| Repo | git@github-stevejocks:stevejocks/website-bytewurst.git (noch nicht auf GitHub angelegt) |
| Original des Kunden | https://bytewurst.de (SvelteKit, dort läuft auch die Anwendung selbst) |

Die Seite läuft als Cloudflare Worker, aufgebaut wie leon.cv (`wrangler.jsonc`,
docs/0003). Stand 2026-10-03 zeigt `bytewurst.stevejocks.de` per Platzhalter-DNS noch auf den
netcup-Server. Für die Custom Domain muss die Zone `stevejocks.de` im Cloudflare-Konto
liegen. Nach dem ersten Produktions-Deploy
`curl -I https://bytewurst.stevejocks.de/og-image.jpg` prüfen, muss 200 liefern.
`SEITEN_URL` steht in `src/data/betrieb.ts`.

## Kunde

- Betrieb: ByteButchers GmbH, Voltastraße 13, 70376 Stuttgart, Geschäftsführer Leon Sczepansky.
  Produkt ByteWurst: Umsatzprognose und Reporting für Metzgereien aus den Kassendaten.
  Zweites Produkt: wurstpad.com.
- Was der Kunde will: weitere Metzgereien für ByteWurst gewinnen, mit einer Seite, die
  locker, lustig und zum Anfassen zeigt, was das Produkt kann.
- Ansprache: Du. bytewurst.de spricht Metzger selbst so an, und die Seite soll locker sein.

## Konzeptentwurf

Die Seite ist ein Entwurf von Jock&Jock, von ByteButchers weder beauftragt noch
freigegeben. `KONZEPT = true` in `src/data/betrieb.ts` schaltet: `noindex` auf allen
Seiten, `robots.txt` sperrt alles (`src/pages/robots.txt.ts`), kein JSON-LD (auch nicht das
WebSite-JSON-LD von EmDash, `siteName` bleibt dafür leer), Hinweis in der Fußzeile. Impressum und
Datenschutz nennen dann Jock&Jock als Anbieter (`konzeptAnbieter`), denn unter der
stevejocks-Adresse betreiben wir die Seite. Erst auf `false`, wenn ByteButchers
abgenommen hat, vorher die Freigabeliste in PROJEKT.md abarbeiten.

## Tatsachen

- Alles, was die Seite über ByteWurst behauptet, stammt von bytewurst.de (Startseite,
  Preise, Doku, Blog, Impressum). Neue Behauptungen erst nach Quelle, sonst Freigabeliste.
- Zahlen in Diagrammen, Planspiel und Bons sind Beispiele und überall so beschriftet.
  Wo bytewurst.de selbst Zahlen zeigt (Tagesreport 4.812 €, Samstag 6.390 €, Aktion
  +28 % / ±0 %), sind es genau diese. Alles Ausgedachte steht in `src/data/beispiele.ts`.
- Wetter oder Jahreszeit: Die Beispieldaten sind so abgestimmt, dass Pearson-R je Tag
  schwach (0,37) und je Woche stark (0,83) herauskommt, wie im Blogartikel. Wer die
  Daten ändert, prüft beide Werte, sonst widerspricht das Diagramm seinem Text.
- Texte im CMS dürfen Redakteure ändern, die Regeln oben gelten trotzdem. Zahlen und Preise
  stehen nie im CMS, sondern als Platzhalter (`{euro_je_100k}`, `{kostenlos_leistungen}`,
  `{artikel}`), ersetzt in `src/lib/text.ts`. Neuer Platzhalter: dort eintragen.
- Kassensysteme, Datenschutz der Anwendung, Serverstandort, Kundennamen: unbekannt,
  deshalb nirgends genannt. Ebenso offen: ob für den nächtlichen Import etwas exportiert
  oder hochgeladen werden muss (die Preistabelle nennt "Daten-Upload") und ob die Demo mit
  den eigenen Zahlen des Metzgers läuft. Beides nicht behaupten.
- Kundengeschichten nur so, wie sie auf bytewurst.de stehen. Die Hackfleisch-Aktion hatte
  dort keine Zeitungsanzeige, die ist ein eigenes Beispiel (Abnahme 2026-10-03).
- "Alle zwölf Funktionen" gibt es nur bei Early Adopter. Kostenlos heißt 1 Filiale,
  3 Produkte, Basis-Reports. Wer etwas mit "0 €" verbindet, nennt diese Grenze mit.
- Negative Zahlen mit dem einfachen Bindestrich (`prozent()` in `lib/format.ts`), nicht
  mit U+2212.

## Schriften

- Anybody für Überschriften (`titel`, `schild`, `font-display`), schmal gestellt über
  `font-stretch`. Rethink Sans für Fließtext, Martian Mono für Bons und Zahlen (Bons auf
  75 % Breite, sonst 87,5 %, gesetzt in `index.css`).
- Nicht Bricolage Grotesque und JetBrains Mono: die trägt jockjock.de, der Nutzer will sie
  hier ausdrücklich nicht (2026-10-03). Vor einer neuen Schrift prüfen, ob ein anderes
  `website-*` sie schon nutzt.
- Nach einem Schriftwechsel `python3 scripts/wortmarke.py` und `npm run icons`, sonst
  zeigt das Vorschaubild die alte Schrift.

## Farben und Fokus

- `--color-wursti` (#c4532e) ist die Markenfarbe von Wursti und nur für ihn. Knöpfe und
  Flächen nehmen `--color-wurst` (#b94d29), damit weiße Schrift und Text auf Fliese 4,5:1
  schaffen.
- Der Fokusring liest `--fokus`. Abschnitte auf Rot, Senf oder Nacht bekommen `fokus-hell`,
  `fokus-papier` oder `fokus-dunkel`, sonst verschwindet der Ring im Grund. Neuer farbiger
  Abschnitt: Klasse mitgeben.

## Abweichungen vom Hausstandard

- Astro 7 mit EmDash 1.2 als CMS statt Vite und React (seit 2026-10-08, docs/0001 bis 0003).
  Läuft als Cloudflare Worker mit D1 (Inhalte) und R2 (Medien), wie leon.cv. Kein Docker,
  kein Coolify.
- React nur für die EmDash-Verwaltung und den Jock&Jock-Credit (`client:visible`). Alles
  andere auf der Seite ist Astro mit kleinen `<script>`-Blöcken ohne Framework.
- Kein `motion`. Alle Animationen sind CSS oder hängen direkt an einem Zustand
  (Nacht-Szene an der Minute, Planspiel an der Runde).
- Font-Awesome-Symbole über `components/Icon.astro`, immer 1em hoch und 1,25em breit
  (`.fa-symbol` in `index.css`, so war es in der abgenommenen React-Fassung). `h-4 w-4` an
  einem Icon wirkt nicht, die Größe kommt von der Schriftgröße.

## Befehle

```bash
npm run dev       # Entwicklung, Port 5196, läuft als Hintergrunddienst (npx astro dev stop)
npm run pruefen   # lint (ohne Warnungen), astro check und build in einem Rutsch
npm run preview   # gebauter Worker lokal in workerd
npm run typegen   # worker-configuration.d.ts nach Änderungen an wrangler.jsonc
npm run deploy             # NUR der Nutzer: Staging (workers.dev)
npm run deploy:production  # NUR der Nutzer: Produktion (bytewurst.stevejocks.de)
npm run images    # reference/bilder -> public/bilder (AVIF, WebP) + src/data/bilder.json + bildnachweis.json
npm run icons     # scripts/icons -> Favicons, App-Icons, og-image.jpg
python3 scripts/wortmarke.py   # Wortmarke und Unterzeile fürs Vorschaubild als Pfade (fonttools)
python3 flyer/bauen.py         # Flyer A5: flyer.html -> PDFs und Vorschau in flyer/ausgabe
```

Die Ergebnisse von `images`, `icons` und `wortmarke.py` sind eingecheckt. Der Deploy
baut nur `npm run build`. Nach neuen Fotos lokal ausführen und mit committen.

Ohne `CLOUDFLARE_ENV` baut `astro build` immer für Staging. Produktion nur über
`npm run deploy:production`, das löscht `dist/` danach. Vorher immer
`npx wrangler deploy --dry-run` gegen den Build: Name, D1, R2 und Route prüfen.

Lokale Datenbank neu aufsetzen (etwa nach Änderungen am Seed):

```bash
npx astro dev stop && rm -rf .wrangler && npm run dev
curl http://localhost:5196/_emdash/api/setup/dev-bypass   # spielt den Seed ein, legt Dev-Admin an
```

Danach schreibt der Entwicklungsserver `emdash-env.d.ts` neu (Typen der Blöcke), mit
committen.

## Aufbau

- Server-Rendering (`output: "server"`), jede Seite wird bei Aufruf gerendert. Routen in
  `src/pages/`, Titel und Beschreibungen in `src/data/seiten.ts`, Kopfbereich in
  `layouts/Base.astro` über `<EmDashHead>`.
- Start, Funktionen und Preise kommen aus EmDash: Sammlung `pages`, Einträge `start`,
  `funktionen`, `preise`, Feld `inhalt` vom Typ `blocks`. Jeder Abschnitt ist ein Blocktyp
  mit eigener Komponente in `src/bloecke/`, zugeordnet in `bloecke/Bloecke.astro`. Neuer
  Blocktyp: `seed/seed.json` (`blockTypes` und `allowedTypes`), Komponente, Zuordnung.
- Den Eintrag lädt die Seite im Frontmatter (`lib/cms.ts`), nicht eine Komponente: nur dort
  darf sie bei fehlendem Eintrag auf `/404` umschreiben.
- Menüs `primary` (Kopfzeile) und `footer` (Fußzeile, Seiten) kommen aus EmDash.
- `seed/seed.json` ist Schema und Startinhalt. EmDash spielt ihn nur in eine leere Datenbank
  ein (Einrichtungsassistent). Spätere Änderungen am Seed erreichen eine laufende Seite nicht,
  dort pflegt man in der Verwaltung unter `/_emdash/admin`. Inhalt geändert und soll in den
  Seed: `npx emdash export-seed --with-content`.
- Im Code bleiben (`src/data/`): `betrieb.ts` (Firma, Kontakt, Schalter), `start.ts`
  (Planspiel, Nacht-Stationen, Bon-Posten, Wursti-Sprüche), `preise.ts` (Tarife, Vergleich),
  `beispiele.ts` (alle Diagrammzahlen). Preise nie ins Markup und nie ins CMS. Impressum und
  Datenschutz sind Code, weil sie an `KONZEPT` hängen.
- Zustand der Spielereien: Server rendert den Start, ein Skript übernimmt. Wo Server und
  Browser dasselbe rechnen, liegt die Rechnung in `src/lib` (`nacht.ts`, `diagramme.ts`,
  `preisrechner.ts`) und wird von beiden benutzt.
- Wursti ist das Maskottchen von ByteWurst (Formen nach ihrem Favicon) und lebt in
  `components/Wursti.astro`. Alle Gesichter stehen im SVG, `data-stimmung` (froh, staunt,
  lacht) und `data-brille` schalten per CSS, Skripte setzen sie über `stimmungSetzen` aus
  `lib/wursti.ts`. Für die Icon-Skripte gibt es ihn als festes SVG in
  `scripts/icons/wursti.svg`, ohne CSS-Variablen, weil librsvg die nicht kennt.

## Flyer

- `flyer/flyer.html` ist die Druckvorlage für den A5-Flyer (vorne Senf, hinten Fliese mit
  Nacht-Band), `flyer/bauen.py` macht daraus PDF/X-3 in CMYK (ISO Coated v2, FOGRA39) mit
  3 mm Beschnitt, eine RGB-Fassung und eine Ansicht im Endformat. Ausgaben sind eingecheckt.
- Es gelten dieselben Tatsachen-Regeln wie für die Seite. Jeder Satz auf dem Flyer steht so
  oder sinngemäß schon auf der Seite, Zahlen in der Mail sind als Beispiel beschriftet.
- In der Vorlage keine CSS-Masken, Filter, Transparenzen oder Hintergrundbilder: Chromium
  rastert sie im PDF, Text darin würde zum Bild, und PDF/X-3 verbietet Transparenz. Wursti
  steht dort deshalb mit ausgemischten Farben statt `opacity`.
- Inhalt mindestens 6 mm vom Endformat weg, also 9 mm von der Seitenkante (`#linien` am
  Dateinamen zeigt Endformat und Sicherheitsabstand im Browser).
- Die Schriften liegen als feste Schnitte in `flyer/schriften/` (`python3 flyer/schriften.py`),
  weil Chromium variable Schriften unzuverlässig einbettet. Neuer Schnitt: dort eintragen.
- `bauen.py` setzt dunkle, neutrale Schrift auf reines Schwarz mit Überdrucken. Wer im
  Flyer eine neue dunkle Textfarbe einführt, prüft das CMYK-Ergebnis (siehe Docstring).

## Spielereien und wo sie wohnen

| Was | Datei |
|---|---|
| Wursti, Augen folgen der Maus, anstupsen | `components/Wursti.astro`, `components/WurstiBuehne.astro`, `lib/wursti.ts` |
| Pinnwand mit Zetteln zum Umdrehen | `bloecke/start/Pinnwand.astro` |
| Planspiel Bauchgefühl gegen ByteWurst | `bloecke/start/Planspiel.astro` |
| Wahrheitstest mit druckendem Bon | `bloecke/start/Wahrheitstest.astro` |
| Nacht-Uhr von 19 bis 7 Uhr | `bloecke/start/Nacht.astro`, `lib/nacht.ts` |
| Bon mit allen Funktionen | `bloecke/start/Kassenzettel.astro` |
| Preisrechner mit Wurst-Regler | `components/Preisrechner.astro`, `lib/preisrechner.ts`, `.wurstregler` in `index.css` |
| Diagramme zum Anfassen (alle) | `components/Prognose.astro`, `Wochenvergleich.astro`, `WetterJahreszeit.astro`, `Aktionswoche.astro`, `Tagesreport.astro`, SVG aus `lib/diagramme.ts` |
| Tarife an Fleischerhaken | `bloecke/preise/Tarife.astro` |

## Fallstricke

- **iOS-Leisten** nach `~/.claude/skills/hausstandard/ios-leisten.md`. Kopfzeile oben,
  `.leiste-unten` unten, sonst nichts an den Kanten, auch kein `sticky`. Vor jedem Push
  `kanten-pruefen.py` gegen den Build.
- **Einblenden** (`einblenden()` in `lib/seite.ts`) kennt `data-einblenden`, `data-zeichnen`
  und `data-drucken`. Ein neues Attribut muss dort in den Selektor, sonst bleibt das
  Element für immer unsichtbar (so passiert mit dem Funktions-Bon).
- **WurstiBuehne** setzt keine eigene Position. Wer sie platziert, gibt `absolute` von
  außen, die Sprechblase hängt an einem inneren `relative`. Am rechten Rand `blase="links"`,
  sonst läuft die Blase auf dem Handy aus dem Bild.
- **Planspiel**: ByteWurst- und Verkaufszahl erst nach dem Aufdecken zeigen, sonst
  verrät das Spiel die Lösung.
- **Zufall** in Beispieldaten nur über `lib/zufall.ts` mit festem Startwert, nie
  `Math.random`: Server und Browser rechnen die Diagramme getrennt und müssen dasselbe
  herausbekommen.
- **Skripte in `.astro`** laufen einmal je Seite, auch wenn die Komponente mehrfach
  vorkommt. Deshalb über `querySelectorAll('[data-…]')` jede Instanz einzeln anbinden, und
  Attributnamen eindeutig halten (`data-uhr` gab es zweimal, Nacht-Uhr heißt jetzt
  `data-uhrzeit`).
- **Live-Regionen**: Inhalt, der angesagt werden soll, per Skript in die Region einsetzen
  (Wahrheitstest: `<template>`), nicht nur per CSS einblenden.
- **Fotos**: Das Theken-Foto ist rechts beschnitten (großes Schild mit Pfundpreis), die
  kleinen Preisschilder mit Pfund bleiben lesbar, bis eigene Fotos kommen. Das Kaffeefoto
  ist auf die Tasse beschnitten (Handy mit russischer Beschriftung). Zuschnitte in
  `scripts/prepare-images.mjs`, nicht wieder hereinnehmen.
- **Vorladen**: Die `sizes` der Bilder im ersten Bildschirm stehen in `GROESSEN`
  (`src/data/seiten.ts`) und werden von Bild und Vorladen gemeinsam benutzt. Weichen sie
  ab, lädt der Browser zwei Größen. Das Bild der Preisseite ist erst ab 1024 px zu sehen,
  deshalb lädt es dort per `media` vor.
- **Diagramme**: Die Schrift in den SVGs ist in viewBox-Einheiten gesetzt, auf dem Handy
  `text-[20px]`, ab md klein. Sonst ist sie bei 375 px nur 5 bis 6 px groß.
- **Mobiles Menü**: Steht mit `hidden` im Markup. Solange es offen ist, sind `#inhalt` und
  die Fußzeile `inert`.
- **Betrieb**: Staging und Produktion haben getrennte D1-Datenbanken und R2-Buckets. Nie
  eine Bindung von Staging auf Ressourcen der Produktion zeigen lassen. Benannte Umgebungen
  erben keine Bindungen, Vars oder Trigger, jede führt ihre eigenen auf.
- **Statische Dateien** liefert Cloudflare ohne Worker aus. Ihre Header stehen in
  `public/_headers`, nicht in der Middleware.
- **Entwicklung in workerd**: Taucht nach einem Neustart "Invalid hook call" auf, hat Vite
  eine Abhängigkeit erst beim Rendern entdeckt. In `vite.ssr.optimizeDeps.include`
  (`astro.config.mjs`) eintragen.
- **Wahrheitstest**: Mit Antwort ist der Bon höher als das Foto, unter lg reserviert der
  Container Platz (`min-h`). Wer den Bon verlängert, prüft bei 375 px, dass er nicht in
  den nächsten Abschnitt ragt.
