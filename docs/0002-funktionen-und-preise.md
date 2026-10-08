# 0002 Funktionen und Preise als EmDash-Blöcke

Commit: `feat: Funktionen und Preise als EmDash-Blöcke mit Diagrammen ohne React`
Datum: 2026-10-08

## Worum es geht

Nach der Startseite (0001) ziehen die Seiten `/funktionen/` und `/preise/` um. Damit sind alle
Seiten der React-Fassung in Astro und EmDash angekommen.

## Neue Blocktypen

| Blocktyp | Seite | Im CMS | Im Code |
|---|---|---|---|
| `funktionen_kopf` | Funktionen | Überschrift, Text | Theken-Foto, Wursti |
| `abschnitt` | Funktionen | Überschrift, Absätze, welches Diagramm, links/rechts, hell/dunkel | die fünf Diagramme |
| `auslage` | Funktionen | Überschrift, Preisschilder (Name, Text) | |
| `weg` | Funktionen | Überschrift, Text, Schritte (wann, was, Text) | |
| `preise_kopf` | Preise | Überschrift, Text mit `{euro_je_100k}` | Wurst-Foto |
| `tarife` | Preise | Hinweis darunter | Tarife aus `data/preise.ts` |
| `rechner` | Preise | Überschrift, Text | Preisrechner |
| `vergleich` | Preise | Überschrift | Tabelle aus `data/preise.ts` |
| `fragen` | Preise | Überschrift, Fragen und Antworten | |

`schluss` aus 0001 schließt beide Seiten ab, mit eigener Überschrift je Seite. Die Inhalte
stehen als Einträge `funktionen` und `preise` in `seed/seed.json`.

`src/data/funktionen.ts` entfällt (Auslage und Weg stehen jetzt im CMS), aus
`src/data/preise.ts` sind die Fragen ins CMS gewandert. Tarife, Preise und der
Funktionsvergleich bleiben im Code: Preise gehören nie ins Markup und nie ins CMS.

## Diagramme ohne React

Die Diagramme (Prognose, Wochenvergleich, Wetter oder Jahreszeit, Aktionswoche) sind jetzt
reine Funktionen in `src/lib/diagramme.ts`, die SVG-Markup liefern. Der Server rendert damit
den Startzustand (`set:html`), das Skript in der jeweiligen `.astro`-Datei rendert das SVG
beim Antippen mit derselben Funktion neu. Die Beispielzahlen kommen weiter aus
`data/beispiele.ts`. Pearson-R kommt im Browser wie vorher auf 0,37 je Tag und 0,83 je Woche.

## Font-Awesome-Größen

Beim Vergleich mit der alten Fassung fiel auf: Das CSS von `fontawesome-svg-core` lag dort
außerhalb jeder Ebene und hat die Tailwind-Größen der Symbole (`h-4 w-4` usw.) überstimmt.
Jedes Symbol war 1em hoch und 1,25em breit, auf der Preisseite brachen die Leistungen
deshalb anders um. `components/Icon.astro` setzt jetzt die Klasse `fa-symbol`, `index.css`
gibt ihr genau diese Maße, ebenfalls außerhalb der Ebenen. Die Seite sieht damit aus wie
abgenommen. Wer ein Symbol wirklich größer will, ändert die Schriftgröße, nicht `h-*`.

## Geprüft

- `npm run lint`, `npm run typecheck`, `npm run build`: ohne Fehler
- Alle Seiten neben der alten Fassung bei 375 und 1440 px: gleiche Seitenhöhe überall,
  Startseite bei 375 px ohne einen einzigen abweichenden Pixel. Übrige Unterschiede kommen von
  Blinzeln, Blickrichtung, Nacht-Animation und dem Pendeln der Preisschilder unter der Maus.
- Per Playwright: Warengruppe und Tag in der Prognose (Knopf, Regler, Klick ins Diagramm),
  Wochentage, Tag/Woche beim Wetter, Aktionswoche, Stoßzeiten im Tagesreport, Preisrechner
  am unteren Rand, Fragen aufklappen. Keine Konsolenfehler.
- Routen: `/`, `/funktionen/`, `/preise/`, `/impressum/`, `/datenschutz/` liefern 200, ein
  unbekannter Pfad 404.
