# 0003 Auslieferung als Cloudflare Worker

Commit: `build(cloudflare): Staging und Produktion als Worker, robots, Sitemap, Header`
Datum: 2026-10-08

## Worum es geht

Seit 0001 läuft die Seite als Cloudflare Worker mit D1 und R2, bisher nur lokal. Dieser Commit
legt die Ziele fest, bringt die Deploy-Befehle und holt zurück, was vorher `nginx.conf` und
`scripts/prerender.mjs` erledigt haben. Aufbau und Befehle wie bei leon.cv.

## Ziele

`wrangler.jsonc` kennt zwei Ziele. Die oberste Ebene ist die sichere Vorgabe, Produktion
muss man ausdrücklich wählen.

| | Staging (Vorgabe) | Produktion |
|---|---|---|
| Worker | `bytewurst-staging` | `bytewurst` |
| Adresse | `bytewurst-staging.<konto>.workers.dev` | `bytewurst.stevejocks.de` (Custom Domain) |
| D1 | `bytewurst-staging` | `bytewurst` |
| R2 | `bytewurst-staging-media` | `bytewurst-media` |
| Bauen und ausliefern | `npm run deploy` | `npm run deploy:production` |

Der Astro-Build schreibt die gewählte Umgebung nach `dist/server/wrangler.json`
(`CLOUDFLARE_ENV` beim Bauen), `wrangler deploy` liefert genau diese Datei aus. Ohne
`CLOUDFLARE_ENV` zielt der Build auf Staging. `deploy:production` löscht `dist/` danach, damit
ein späteres schlichtes `wrangler deploy` nicht versehentlich die Produktion erwischt.
Bindungen erben benannte Umgebungen nicht, deshalb stehen D1, R2 und der Cron-Trigger bei
Produktion noch einmal.

D1, R2 und der KV-Namespace für Sitzungen (`SESSION`, legt der Astro-Adapter an) entstehen
beim ersten Deploy automatisch. Danach die erzeugte `database_id` in `wrangler.jsonc`
eintragen, wie bei leon.cv, damit jeder Deploy sicher auf dieselbe Datenbank zeigt.

## Was sonst dazukommt

**`public/_headers`.** Cloudflare liefert `public/` und `/_astro` direkt aus den
Worker-Assets aus, ohne dass der Worker läuft. Die Header dafür stehen in `_headers`, genau
wie vorher in nginx: `/_astro/*` ein Jahr `immutable`, Schriften, Fotos und Icons eine Woche,
`site.webmanifest` mit richtigem Typ und `no-cache`, überall `nosniff`.

**`src/middleware.ts`** gilt für alles, was der Worker rendert: 301 von `/funktionen` auf
`/funktionen/` (ebenso Preise, Impressum, Datenschutz), Sicherheits-Header,
`Cache-Control: no-cache` für Seiten.

**`/robots.txt` und `/sitemap.xml`** sind eigene Routen. EmDash legt beide nur an, wenn die
Seite keine eigenen hat. Solange `KONZEPT` gilt, sperrt `robots.txt` alles, wie vorher.
Die Sitemap nennt immer die Adressen der Produktion, `SEITEN_URL` in `betrieb.ts`. Auf
Staging stört das nicht, dort gilt wegen `KONZEPT` ohnehin `noindex`.

**Leere Datenbank.** Fehlt der Eintrag einer Seite (Einrichtung noch nicht durchlaufen),
liefert die Seite jetzt sauber 404. Vorher hat `CmsSeite.astro` aus einer Komponente heraus
umgeschrieben, das bricht in Astro mit „Unable to set response“ ab. Der Eintrag wird jetzt im
Frontmatter der Seite geladen (`lib/cms.ts`), dort darf `Astro.rewrite` stehen.

## Vor dem ersten Deploy

- `npx wrangler login` mit dem Konto, in dem auch die Zone `stevejocks.de` liegt. Liegt sie
  nicht bei Cloudflare, funktioniert die Custom Domain der Produktion nicht. Dann zuerst nur
  Staging ausliefern.
- Größe: Der Worker ist mit EmDash und seiner Verwaltung rund 4,8 MB groß (gzip), so groß wie
  leon.cv. Der kostenlose Workers-Tarif erlaubt 3 MB, der bezahlte 10 MB.
- Optional, aber empfohlen: `EMDASH_ENCRYPTION_KEY` als Secret je Umgebung
  (`npx emdash secrets generate`, dann `npx wrangler secret put EMDASH_ENCRYPTION_KEY` und
  dasselbe mit `--env production`). EmDash verschlüsselt damit geheime Plugin-Einstellungen,
  heute ohne Plugins ungenutzt.

## Erste Einrichtung nach dem Deploy

1. `/_emdash/admin` auf dem jeweiligen Ziel öffnen, der Assistent startet.
2. Titel und Unterzeile bestätigen, „Inhalte einspielen“ an lassen. EmDash legt Schema,
   Menüs und die drei Seiten aus `seed/seed.json` in D1 an.
3. Admin-Konto mit Passkey anlegen.
4. Produktion: `curl -I https://bytewurst.stevejocks.de/og-image.jpg` muss 200 liefern.

## Geprüft

- `npm run build` für beide Ziele: `dist/server/wrangler.json` trägt jeweils den richtigen
  Namen, D1, R2, Route und Cron. `npx wrangler deploy --dry-run` für beide ohne Fehler, nichts
  ausgeliefert.
- Gebauter Worker lokal in workerd (`astro preview`) mit leerer D1: Seiten aus dem CMS 404,
  Rechtsseiten 200, `/funktionen` 301, Header aus `_headers` und Middleware wie oben.
- Einrichtung über `POST /_emdash/api/setup` wie der Assistent: Seed in D1 eingespielt,
  danach alle Seiten 200. In Chrome ohne Konsolenfehler, alle 19 Prüfungen des Klicktests
  grün, Startseite bei 375 px pixelgleich mit der alten React-Fassung.
- `npm run lint`, `npm run typecheck`, `npm run build`: ohne Fehler.

## Bekannt

- Nichts davon ist ausgeliefert. Repo, Cloudflare-Ressourcen und Domain fehlen noch
  (PROJEKT.md).
