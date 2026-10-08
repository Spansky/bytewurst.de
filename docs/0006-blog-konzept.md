# 0006 Blog: Konzept und vier Entwürfe

Commit: `docs(blog): Konzept und vier Beiträge als Markdown-Entwürfe`
Datum: 2026-10-08

## Ziel

Die Seite verkauft ByteWurst über Spielereien und kurze Versprechen. Ein Blog unter `/blog/`
erklärt dieselben Funktionen ausführlicher, in der Sprache von Metzgern, und gibt
Suchmaschinen und Newslettern Stoff, sobald `KONZEPT` fällt. Jeder Beitrag beantwortet eine
Frage, die ein Metzger vor der Demo hat, und endet beim Demo-Termin.

## Leitplanken

- **Nur, was schon steht.** Jede Aussage über ByteWurst steht so oder sinngemäß bereits auf
  der Seite oder auf bytewurst.de (CLAUDE.md, Tatsachen). Die Beiträge erzählen Bekanntes
  ausführlicher, sie behaupten nichts Neues. Kassensysteme, Datenimport per Upload,
  Serverstandort und Kundennamen kommen nicht vor.
- **Zahlen sind Beispiele** und im Text so benannt. Preise stehen nie als Zahl im Text,
  sondern als Platzhalter (`{euro_je_100k}`, `{beispiel_gebuehr}` …), die beim Anzeigen aus
  `src/data/preise.ts` ersetzt werden. Ändert sich der Preis, stimmen alle Beiträge sofort.
- **`0 €` nur mit Grenze**: kostenlos heißt 1 Filiale, 3 Produkte, Basis-Reports.
- **Kundengeschichten** nur wie auf bytewurst.de (Hackfleisch-Aktion ohne Zeitungsanzeige,
  die E-Mail um vier).
- **Ton**: Du, locker, kurze Sätze, kein IT-Deutsch. Länge 400 bis 600 Wörter.
- **Zum Anfassen**: Unter jedem Beitrag steht eine Spielerei der Seite (Diagramm oder
  Rechner), auf die der Text verweist. Das unterscheidet den Blog von einem Textfriedhof.

## Die vier Beiträge

| Nr. | Titel | Frage des Metzgers | Funktion | Zum Anfassen | Foto |
|---|---|---|---|---|---|
| 01 | Montags zu viel, samstags zu wenig | Wie viel soll ich produzieren, wenn ich nicht da bin? | Wochenprognose | `prognose` | `theke` |
| 02 | Volle Theke heißt nicht volle Kasse | Hat sich meine Aktion gerechnet? | Aktions-Auswertung | `aktionswoche` | `bon` |
| 03 | Um vier Uhr früh im Postfach | Muss ich mich in noch ein Programm einarbeiten? | Tagesreport per Mail, A4 | `tagesreport` | `kaffee` |
| 04 | Was kostet ByteWurst? | Was zahle ich, und was ist kostenlos? | Preise, Tarife, Fragen | `preisrechner` | `wurst-senf` |

Reihenfolge auf `/blog/`: 01 oben, 04 unten. Die Entwürfe liegen in `content/blog/`.

Quellen je Beitrag, alle schon auf der Seite: 01 Pinnwand, Früher, Funktionen
(Wochenprognose, Wetter), Einwände. 02 Wahrheitstest, Funktionen (Aktion), Beispielzahlen
+28 % / ±0 % / -22 %. 03 Einwände, Nacht-Stationen, Tagesreport (4.812 €, 318 Bons). 04 Preise,
Tarife, Fragen, Preisrechner (Startwert 500.000 €, Leberkäsweckle, 2 % Effizienz).

## Aufbau in EmDash

Eine eigene Sammlung `posts` („Blog“, Einzahl „Beitrag“), getrennt von den Seiten:

| Feld | Typ | Wozu |
|---|---|---|
| `title` | Text, Pflicht | Überschrift und Seitentitel |
| `anreisser` | mehrzeilig, Pflicht | Karte in der Übersicht, Einleitung, Beschreibung für Suchmaschinen |
| `bild` | Auswahl, Pflicht | eines der Fotos der Seite (AVIF/WebP, Bildnachweis im Impressum) |
| `zum_anfassen` | Auswahl | Diagramm oder Rechner unter dem Beitrag |
| `inhalt` | Portable Text, Pflicht | der Text mit Zwischenüberschriften, Listen, Links |

Funktionen der Sammlung: Entwürfe, Versionen, geplante Veröffentlichung, Suche, SEO-Feld.
Adressen `/blog/` und `/blog/<slug>/`, im Menü kommt „Blog“ hinter „Preise“.

**Warum eine Fotoauswahl statt Hochladen?** Hochgeladene Bilder landen in R2 ohne die
AVIF-/WebP-Größen und ohne Bildnachweis. Die Auswahl hält beides. Eigene Fotos aus einer
Kundenmetzgerei (Freigabeliste) kommen über `npm run images` dazu und dann in die Auswahl.

**Warum kein Rubriken-System?** Bei vier Beiträgen bringt eine Taxonomie nichts. Ab etwa
zehn Beiträgen lohnt eine Taxonomie „rubrik“ (Planung, Aktionen, Reports, Preise).

## Wie die Entwürfe in EmDash kommen

Die Markdown-Dateien sind die Quelle. Kopf zwischen `---` mit `title`, `slug`, `anreisser`,
`bild`, `zum_anfassen`, darunter der Text. Drei Wege, je nach Lage:

1. **Neue oder lokale Datenbank: über den Seed.** `node scripts/blog.mjs seed` schreibt
   Sammlung, Beiträge und Menüpunkt in `seed/seed.json`. Beim Einrichten (oder lokal mit
   `dev-bypass`) legt EmDash alles an. Eine bestehende Datenbank erreicht der Seed nicht.
2. **Bestehende Seite (Staging, Produktion): über das Import-Skript.**
   `node scripts/blog.mjs import --url <adresse>` legt die Sammlung samt Feldern an, falls
   sie fehlt, und erstellt die Beiträge, die es dort noch nicht gibt. Nichts wird
   überschrieben, das Skript lässt sich gefahrlos wiederholen. Mit `--entwurf` bleiben die
   Beiträge unveröffentlicht und lassen sich in der Verwaltung prüfen. Den Menüpunkt „Blog“
   (`/blog/`) danach in der Verwaltung unter Menüs ergänzen, die Schnittstelle dafür bietet
   der Client nicht.
3. **Von Hand in der Verwaltung.** Unter Blog → Neu Titel, Anreißer, Foto und Spielerei
   wählen und den Text einfügen. Der Editor liest kein Markdown, Überschriften und Listen
   also über die Werkzeugleiste setzen. Für einzelne neue Beiträge der normale Weg.

Warum nicht `npx emdash content create` direkt? Das CLI kann Beiträge anlegen, aber keine
Sammlung mit Auswahlfeldern und Funktionen. Und sein Markdown-Umwandler liest zwei
Platzhalter mit Unterstrich in einem Absatz als _kursiv_. Das Skript nutzt denselben
Umwandler, sichert die Platzhalter aber vorher.

## Vor dem Veröffentlichen

- Die Beiträge sind Entwürfe von Jock&Jock und gehören auf die Freigabeliste: Darf die
  Hackfleisch-Geschichte so erzählt werden, ist „gut ein Fünftel weniger je Kunde“ als
  Beispiel in Ordnung, passt der Leberkäsweckle-Vergleich zum Ton?
- Vorschlag für den Takt: ein Beitrag pro Woche über die geplante Veröffentlichung
  (`npx emdash content schedule posts <id> --at …`), statt alle vier an einem Tag.
