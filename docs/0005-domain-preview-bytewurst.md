# 0005 Produktion unter preview.bytewurst.de

Commit: `build(cloudflare): Produktion unter preview.bytewurst.de statt bytewurst.stevejocks.de`
Datum: 2026-10-08

## Worum es geht

Die Produktion soll nicht unter `bytewurst.stevejocks.de` laufen, sondern unter
`preview.bytewurst.de`. Staging bleibt unverändert auf workers.dev.

## Was sich ändert

- `wrangler.jsonc`: Route der Umgebung `production` ist jetzt `preview.bytewurst.de` als
  Custom Domain.
- `src/data/betrieb.ts`: `SEITEN_URL` ist `https://preview.bytewurst.de`. Daraus entstehen
  Canonical, `og:url`, `og:image`, Sitemap und die Adresse in `robots.txt`.
- `CLAUDE.md` und `PROJEKT.md`: Adressen, Hinweis zur Zone, neue offene Punkte.

`docs/0003` beschreibt den Stand seines Commits und nennt deshalb noch die alte Domain.

## Was vor dem Ausliefern geklärt sein muss

- **Zone.** Eine Custom Domain braucht die Zone `bytewurst.de` im selben Cloudflare-Konto wie
  der Worker. Die Zone gehört ByteButchers, auf `bytewurst.de` selbst läuft ihre Anwendung.
  Entweder liegt sie in unserem Konto (oder kommt dorthin), oder ByteButchers richtet die
  Custom Domain in ihrem Konto ein und der Worker zieht dorthin. Ohne Zone schlägt
  `npm run deploy:production` an der Route fehl, der Probelauf (`--dry-run`) prüft das nicht.
- **Anbieter.** Im Konzeptmodus nennen Impressum und Datenschutz Jock&Jock als Anbieter. Unter
  einer Adresse von ByteButchers ist das mit ihnen abzustimmen.
- Der alte Platzhalter `bytewurst.stevejocks.de` wird nicht mehr gebraucht.

## Geprüft

- `CLOUDFLARE_ENV=production astro build`: `dist/server/wrangler.json` mit Worker `bytewurst`
  und Route `preview.bytewurst.de`, `npx wrangler deploy --dry-run` ohne Fehler, nichts
  ausgeliefert.
- Staging-Build unverändert: `bytewurst-staging`, workers.dev, keine Route.
- `npm run lint`, `npm run typecheck`: ohne Fehler.
