# ByteWurst

Stack, Versionen und harte Regeln stehen in der Skill `hausstandard`. Hier steht nur,
was für dieses Projekt davon abweicht oder zusätzlich gilt.
Stand, Freigabeliste und offene Punkte: siehe PROJEKT.md.

## Adressen

| Was | Adresse |
|---|---|
| Live | https://bytewurst.stevejocks.de (geplant, in Coolify noch nicht eingerichtet) |
| Repo | git@github-stevejocks:stevejocks/website-bytewurst.git (noch nicht auf GitHub angelegt) |
| Original des Kunden | https://bytewurst.de (SvelteKit, dort läuft auch die Anwendung selbst) |

Stand 2026-10-03 löst `bytewurst.stevejocks.de` über den Platzhalter-DNS auf den
netcup-Server auf, antwortet aber nicht. Nach dem Einrichten in Coolify
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
Seiten, `robots.txt` sperrt alles, kein JSON-LD, Hinweis in der Fußzeile, Impressum und
Datenschutz nennen den Entwurf statt der Firma. Erst auf `false`, wenn ByteButchers
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
- Kassensysteme, Datenschutz der Anwendung, Serverstandort, Kundennamen: unbekannt,
  deshalb nirgends genannt.

## Abweichungen vom Hausstandard

- Kein `motion`. Alle Animationen sind CSS oder hängen direkt an einem Zustand
  (Nacht-Szene an der Minute, Planspiel an der Runde).
- react 19.3.0 statt 19.2.8, aktuelle Fassung zum Projektstart.

## Befehle

```bash
npm run dev       # Entwicklung, Port 5196
npm run pruefen   # lint (ohne Warnungen), typecheck und build in einem Rutsch
npm run preview   # gebaute Seite auf Port 4173
npm run images    # reference/bilder -> public/bilder (AVIF, WebP) + src/data/bilder.json + bildnachweis.json
npm run icons     # scripts/icons -> Favicons, App-Icons, og-image.jpg
python3 scripts/wortmarke.py   # Wortmarke und Unterzeile fürs Vorschaubild als Pfade (fonttools)
```

Die Ergebnisse von `images`, `icons` und `wortmarke.py` sind eingecheckt. Coolify baut
nur `npm run build`, `reference/` fehlt im Build-Kontext. Nach neuen Fotos lokal
ausführen und mit committen.

## Aufbau

- Mehrseitig mit Vorrendern wie website-thesmokingbrothers: Routen in `src/data/seiten.ts`,
  `scripts/prerender.mjs` schreibt jede Seite als fertiges HTML in ihren Ordner.
- Inhalte in `src/data/`: `betrieb.ts` (Firma, Kontakt, Schalter), `start.ts` (Zettel,
  Planspiel, Nacht, Bon-Posten, Wursti-Sprüche), `funktionen.ts`, `preise.ts`,
  `beispiele.ts` (alle Diagrammzahlen). Preise nie ins Markup.
- Wursti ist das Maskottchen von ByteWurst (Formen nach ihrem Favicon) und lebt in
  `components/Wursti.tsx`. Für die Icon-Skripte gibt es ihn als festes SVG in
  `scripts/icons/wursti.svg`, ohne CSS-Variablen, weil librsvg die nicht kennt.

## Spielereien und wo sie wohnen

| Was | Datei |
|---|---|
| Wursti, Augen folgen der Maus, anstupsen | `components/Wursti.tsx`, `components/WurstiBuehne.tsx` |
| Pinnwand mit Zetteln zum Umdrehen | `sections/start/Pinnwand.tsx` |
| Planspiel Bauchgefühl gegen ByteWurst | `sections/start/Planspiel.tsx` |
| Wahrheitstest mit druckendem Bon | `sections/start/Wahrheitstest.tsx` |
| Nacht-Uhr von 19 bis 7 Uhr | `sections/start/Nacht.tsx` |
| Bon mit allen Funktionen | `sections/start/Kassenzettel.tsx` |
| Preisrechner mit Wurst-Regler | `components/Preisrechner.tsx`, `.wurstregler` in `index.css` |
| Diagramme zum Anfassen | `components/Prognose.tsx`, `Wochenvergleich.tsx`, `WetterJahreszeit.tsx`, `Aktionswoche.tsx`, `Tagesreport.tsx` |
| Tarife an Fleischerhaken | `seiten/Preise.tsx` |

## Fallstricke

- **iOS-Leisten** nach `~/.claude/skills/hausstandard/ios-leisten.md`. Kopfzeile oben,
  `.leiste-unten` unten, sonst nichts an den Kanten, auch kein `sticky`. Vor jedem Push
  `kanten-pruefen.py` gegen den Build.
- **Einblenden** (`components/Einblenden.tsx`) kennt `data-einblenden`, `data-zeichnen`
  und `data-drucken`. Ein neues Attribut muss dort in den Selektor, sonst bleibt das
  Element für immer unsichtbar (so passiert mit dem Funktions-Bon).
- **WurstiBuehne** setzt keine eigene Position. Wer sie platziert, gibt `absolute` von
  außen, die Sprechblase hängt an einem inneren `relative`. Am rechten Rand `blase="links"`,
  sonst läuft die Blase auf dem Handy aus dem Bild.
- **Planspiel**: ByteWurst- und Verkaufszahl erst nach dem Aufdecken zeigen, sonst
  verrät das Spiel die Lösung.
- **Zufall** in Beispieldaten nur über `lib/zufall.ts` mit festem Startwert, nie
  `Math.random`: das vorgerenderte HTML muss zum ersten Render passen.
- **Fotos**: Das Theken-Foto ist rechts beschnitten (Schild mit Pfundpreis), das
  Kaffeefoto auf die Tasse (Handy mit russischer Beschriftung). Zuschnitte in
  `scripts/prepare-images.mjs`, nicht wieder hereinnehmen.
