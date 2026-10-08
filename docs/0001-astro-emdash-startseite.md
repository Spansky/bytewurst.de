# 0001 Astro und EmDash statt Vite und React, Startseite

Commit: `build!: Astro und EmDash statt Vite und React, Startseite als EmDash-Blöcke`
Datum: 2026-10-08

## Worum es geht

Die Seite lief bisher als Vite-Projekt mit React. `scripts/prerender.mjs` hat jede Route beim
Bauen zu HTML gerendert, nginx hat sie ausgeliefert, im Browser wurde hydriert. Die Inhalte
standen als JSX im Code.

Ab jetzt ist die Seite ein Astro-Projekt mit [EmDash](https://emdashcms.com) als CMS.
Eingerichtet mit `npm create emdash@latest . -- --template starter`, danach
die Vorlage durch das Aussehen und die Inhalte von Jock&Jock ersetzt. Dieser Commit enthält
das Grundgerüst, die Rechtsseiten, die 404-Seite und die komplette Startseite. Funktionen und
Preise folgen in 0002, die Auslieferung als Cloudflare Worker in 0003.

## Entscheidungen

**EmDash auf Cloudflare Workers.** Die Seite läuft als Worker, aufgebaut wie leon.cv:
`@astrojs/cloudflare` als Adapter, Inhalte in D1 (Bindung `DB`), hochgeladene Medien in R2
(Bindung `MEDIA`), beides aus `@emdash-cms/cloudflare`. Einstieg ist `src/worker.ts` mit dem
Handler von EmDash und einem Cron-Trigger für Wartung und geplante Veröffentlichungen
(`wrangler.jsonc`). Lokal stellt Wrangler D1 und R2 unter `.wrangler/` bereit, `npm run dev`
läuft in workerd, also in derselben Laufzeit wie im Betrieb. Das alte Setup mit nginx in
Coolify entfällt, `Dockerfile` und `.dockerignore` sind gelöscht. Ziele, Domains und
Deploy-Befehle folgen in 0003.

Eine Eigenheit der Entwicklung in workerd: Vite entdeckt React sonst erst beim ersten
Rendern der Credit-Insel, optimiert neu und bricht laufende Anfragen ab (zwei Kopien von
React, „Invalid hook call“). `astro.config.mjs` bündelt React deshalb vorab
(`vite.ssr.optimizeDeps.include`), wie es die Cloudflare-Vorlage von EmDash für ihre
Symbole tut.

**Server-Rendering.** EmDash verlangt `output: "server"`, Inhalte kommen bei jedem Aufruf aus
der Datenbank. Das Vorrendern und das Vite-Manifest entfallen.

**React nur noch, wo nötig.** Die Oberfläche von EmDash unter `/_emdash/admin` ist mit React
gebaut, deshalb bleibt `@astrojs/react` installiert. Auf der Seite selbst ist alles Astro. Die
einzige React-Insel ist der Jock&Jock-Credit in der Fußzeile (`client:visible`), weil er eine
gemeinsame Vorlage aller Projekte ist und nicht abweichen soll.

**Spielereien ohne React.** Jede Komponente rendert auf dem Server den Startzustand. Ein
kleines `<script>` in derselben `.astro`-Datei übernimmt danach, ohne Framework:

| Was | Wie |
|---|---|
| Wursti | Alle Gesichter und die Brille stehen im SVG, `data-stimmung` und `data-brille` schalten per CSS. Augen folgen und Blinzeln für alle Wurstis zentral in `lib/wursti.ts` |
| Pinnwand, Wahrheitstest, Menü | Zustand als Attribut (`aria-pressed`, `data-antwort`, `hidden`), Darstellung per CSS-Variante |
| Planspiel | Server rendert Runde eins, Skript führt das Spiel. ByteWurst- und Verkaufszahl stehen erst nach dem Aufdecken im DOM |
| Nacht-Uhr | `lib/nacht.ts` rechnet alle Werte der Szene aus der Minute. Der Server rendert damit 19:00 Uhr, das Skript schreibt bei jeder Minute dieselben Werte als Attribute (`data-n`) ins SVG |
| Preisrechner | Rechnung in `lib/preisrechner.ts`, Server und Skript nutzen dieselbe Funktion |

Font Awesome kommt jetzt als reiner Pfad aus `@fortawesome/free-solid-svg-icons` in
`components/Icon.astro`, ohne `react-fontawesome`.

**Was ins CMS geht und was nicht.** Texte der Abschnitte (Überschriften, Absätze, die Zettel
der Pinnwand, die Punkte bei den Einwänden) stehen in EmDash und sind in der Verwaltung
bearbeitbar. Was an Zahlen, Preisen oder am Ablauf hängt, bleibt in `src/data/`: Preise,
Beispielzahlen (Pearson-Abstimmung!), Spielrunden, Nacht-Stationen mit ihren Minuten,
Bon-Posten, Wurstis Sprüche, Firmendaten. Wo ein CMS-Text eine solche Zahl braucht, steht ein
Platzhalter (`{euro_je_100k}`, `{kostenlos_leistungen}`, `{artikel}`), ersetzt in
`lib/text.ts`. Impressum und Datenschutz bleiben Code, weil sie am Schalter `KONZEPT` hängen.

**Aufbau im CMS.** Eine Sammlung `pages` mit dem Feld `inhalt` vom Typ `blocks`. Jeder
Abschnitt der Startseite ist ein eigener Blocktyp (`einstieg`, `pinnwand`, `planspiel`,
`wahrheitstest`, `nacht`, `einwaende`, `frueher`, `kassenzettel`, `preis_teaser`, `schluss`).
Reihenfolge und Texte lassen sich in der Verwaltung ändern. `bloecke/Bloecke.astro` ordnet
jedem Typ seine Komponente zu. Navigation in Kopf- und Fußzeile kommt aus den EmDash-Menüs
`primary` und `footer`.

**Kopfbereich.** `<EmDashHead>` schreibt Beschreibung, Canonical, Open Graph und Twitter aus
dem Seitenkontext, Werte aus dem SEO-Feld eines Eintrags gehen vor. Solange `KONZEPT` gilt,
setzt das Layout `noindex` und lässt `siteName` weg, damit EmDash kein JSON-LD schreibt.

## Neue und geänderte Dateien

- `astro.config.mjs`, `wrangler.jsonc`, `src/worker.ts`, `tsconfig.json`, `eslint.config.js`
  (jetzt mit `eslint-plugin-astro`), `worker-configuration.d.ts` (von `npm run typegen`)
- `seed/seed.json`: Schema (Blocktypen, Sammlung, Menüs, Einstellungen) und Startinhalt
- `emdash-env.d.ts`: von EmDash erzeugte Typen der Blöcke, beim Start von `npm run dev`
- `src/layouts/Base.astro` ersetzt `Rahmen.tsx`, `index.html`, `main.tsx`, `entry-server.tsx`
- `src/components/*.astro` ersetzen die React-Komponenten, `CmsSeite.astro` lädt einen
  Eintrag aus `pages` und rendert seine Blöcke
- `src/bloecke/` enthält die Abschnitte als Blockkomponenten
- `src/lib/seite.ts` (Einblenden, iOS-Leisten), `wursti.ts`, `nacht.ts`, `preisrechner.ts`, `text.ts`
- `src/data/start.ts`: die Zettel sind ins CMS gewandert
- Von der EmDash-Vorlage übernommen: `AGENTS.md`, `.agents/skills`, `.claude/skills` (Link),
  `.mcp.json` (Doku-Server von EmDash für Claude Code)
- Entfernt: `index.html`, `vite.config.ts`, `tsconfig.app.json`, `tsconfig.node.json`,
  `scripts/prerender.mjs`, `nginx.conf`, `Dockerfile`, `.dockerignore`, alle `.tsx` außer dem Credit

## Geprüft

- `npm run lint`, `npm run typecheck` (`astro check`), `npm run build`: ohne Fehler
- Entwicklungsserver in workerd mit lokaler D1: kalter Start ohne Fehler, Seed über
  `/_emdash/api/setup/dev-bypass` eingespielt
- Startseite neben der alten React-Fassung (Build von `main`) in Chrome bei 375 und 1440 px:
  gleiche Seitenhöhe, Pixelunterschiede nur bei Blinzeln, Blickrichtung und dem Stand der
  Nacht-Animation
- Per Playwright bedient: Zettel umdrehen, Wursti anstupsen, Planspiel über drei Runden mit
  Neustart und Fokusführung, Wahrheitstest mit Bon und Auflösung in der Live-Region,
  Nacht-Regler (04:00 Mail da, Brille beim Rechnen), Abspielen bis 07:00, Preisrechner,
  mobiles Menü mit `inert` und Escape. Keine Konsolenfehler.
- Keine Cookies auf öffentlichen Seiten, `noindex` gesetzt, kein JSON-LD

## Bekannt und offen

- `/funktionen/` und `/preise/` fehlen in diesem Commit noch (folgt in 0002)
- Noch keine Ziele und Domains in `wrangler.jsonc`, kein Deploy-Befehl (folgt in 0003)
- Inhalte im Seed landen nur in einer leeren Datenbank. Spätere Änderungen an `seed/seed.json`
  erreichen eine laufende Seite nicht, dort pflegt man in der Verwaltung.
