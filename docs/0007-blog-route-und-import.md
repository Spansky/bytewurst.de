# 0007 Blog unter /blog/ mit EmDash, Seed und Import-Skript

Commit: `feat(blog): /blog mit Sammlung posts, Spielereien unter Beiträgen und Import-Skript`
Datum: 2026-10-08

## Worum es geht

Setzt das Konzept aus 0006 um: Übersicht, Beitragsseite, Sammlung in EmDash und ein Weg, die
Markdown-Entwürfe in neue und bestehende Datenbanken zu bringen.

## Seiten

- **`/blog/`** (`src/pages/blog/index.astro`): Kopf „Aus der Wurstküche.“ mit Wursti, darunter
  die Beiträge als Karten in zwei Spalten, neueste zuerst. Ohne Beiträge ein kurzer Hinweis
  statt einer leeren Seite. Der Kopf ist Code, die Beiträge kommen aus EmDash.
- **`/blog/<slug>/`** (`src/pages/blog/[slug].astro`): Kopf mit Titel, Anreißer, Datum,
  Lesezeit und Foto. Darunter der Text (Portable Text, Typografie `.beitrag` in `index.css`,
  Aufzählungspunkte als kleine Würste), dann „Zum Anfassen.“ mit der gewählten Spielerei,
  „Mehr aus der Wurstküche.“ mit bis zu drei weiteren Beiträgen und zum Schluss der
  Schluss-Block der Startseite. Der kommt aus deren EmDash-Eintrag und wird nicht doppelt
  gepflegt. Unbekannter oder unveröffentlichter Slug: 404.
- Kopf- und Fußzeile: Menüpunkt „Blog“ im Seed, „Blog“ bleibt auch auf Beitragsseiten
  markiert. `/blog` und `/blog/<slug>` leiten auf die Adresse mit Schrägstrich um.
- Sitemap: feste Seiten plus alle veröffentlichten Beiträge mit ihrem Änderungsdatum.

## Daten

- **Sammlung `posts`**: Definition einmal in `scripts/blog.mjs` (`SAMMLUNG`), daraus Seed und
  Import. Felder siehe docs/0006.
- **`src/data/fotos.ts`**: die Fotos der Seite mit Alternativtext zur Auswahl. In den Karten
  ist das Foto Dekoration (`alt=""`), auf der Beitragsseite trägt es den Alternativtext.
- **`src/lib/text.ts`**: neue Platzhalter für Rechenbeispiele, alle aus `data/preise.ts`
  abgeleitet, Startwert wie im Preisrechner. `ptEinsetzen()` ersetzt Platzhalter in Portable
  Text vor dem Rendern.
- **`src/lib/blog.ts`**: Beiträge laden, Datum, Lesezeit (200 Wörter je Minute).

## Import-Skript

`scripts/blog.mjs` mit zwei Modi, Beschreibung im Kopf der Datei und in docs/0006:

- `seed`: Sammlung, Beiträge und Menüpunkt in `seed/seed.json`.
- `import --url <adresse> [--entwurf]`: über `emdash/client`, denselben Client wie das CLI.
  Anmeldung mit `EMDASH_TOKEN` (API-Token mit `schema:read`, `schema:write`,
  `content:read`, `content:write`), gegen localhost ohne Token. Legt fehlende Sammlung und
  Felder an, überspringt vorhandene Slugs, überschreibt nichts.

Markdown wird im Skript in Portable Text umgewandelt, nicht erst im Client. Grund: Zwei
Platzhalter mit Unterstrich in einem Absatz liest der Umwandler als kursiv
(`{beispiel_umsatz} … {beispiel_gebuehr}`). Das Skript ersetzt Platzhalter vorher durch
neutrale Marken und setzt sie danach wieder ein.

## Nebenbei behoben

Kalter Start des Entwicklungsservers in workerd: Vite hat einzeln importierte
Font-Awesome-Symbole erst beim Rendern entdeckt, neu optimiert und laufende Anfragen
abgebrochen (wieder „Invalid hook call“ in der Credit-Insel). `astro.config.mjs` bündelt jetzt
auch `@fortawesome/free-solid-svg-icons/*` vorab. Nach geleertem Vite-Cache keine
Nachoptimierung mehr im Log.

## Geprüft

- `npm run pruefen` (Lint, `astro check`, Build): ohne Fehler.
- Frische Datenbank mit Seed: `/blog/`, alle vier Beiträge, Menüpunkt in Kopf- und Fußzeile,
  `/blog` 301, unbekannter Slug 404, Sitemap mit Beiträgen.
- Bestehende Datenbank ohne Blog (Seed von `main`), dann `import`: Sammlung mit allen
  Funktionen, `urlPattern` und beiden Auswahlfeldern angelegt, vier Beiträge veröffentlicht.
  Zweiter Lauf überspringt alles. Mit `--entwurf` bleiben die Beiträge öffentlich 404.
- Platzhalter im Preisbeitrag ersetzt („Bei 500.000 € Jahresumsatz sind das 25 € im Monat“,
  10 Leberkäsweckle, 10.000 € bei 2 %), keine Kursivschrift durch Unterstriche.
- Chrome bei 375 und 1440 px ohne Konsolenfehler und ohne seitliches Scrollen. Klicktest der
  Startseite weiter 19 von 19.
