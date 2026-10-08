# 0004 Projektdoku auf Astro und EmDash nachgezogen

Commit: `docs: CLAUDE.md und PROJEKT.md auf Astro und EmDash umgestellt`
Datum: 2026-10-08

## Worum es geht

Nach 0001 bis 0003 haben `CLAUDE.md` und `PROJEKT.md` noch das alte Vite-React-Setup
beschrieben (Vorrendern, `.tsx`-Pfade, `data/funktionen.ts`). Dieser Commit zieht sie nach,
ohne am Code etwas zu ändern.

## CLAUDE.md

- **Konzeptentwurf**: `robots.txt` ist jetzt eine eigene Route, JSON-LD von EmDash bleibt aus.
- **Tatsachen**: Neue Regel zu CMS-Texten und Platzhaltern. Zahlen und Preise nie ins CMS.
- **Adressen**: Staging auf workers.dev, Produktion als Custom Domain, Hinweis auf die Zone.
- **Abweichungen vom Hausstandard**: Astro und EmDash statt Vite und React, Cloudflare
  Workers mit D1 und R2 statt Coolify, wo React noch vorkommt, die festen Maße der
  Font-Awesome-Symbole.
- **Befehle**: `preview`, `typegen`, `deploy` und `deploy:production` (nur der Nutzer),
  `astro dev` läuft als Hintergrunddienst, lokale D1 neu aufsetzen mit `dev-bypass`.
- **Aufbau**: komplett neu. Server-Rendering, Sammlung `pages` mit Blöcken, `lib/cms.ts`,
  Menüs aus EmDash, Seed nur für leere Datenbanken, was im Code bleibt.
- **Spielereien**: alle Pfade auf die `.astro`-Dateien und `src/lib` umgestellt.
- **Fallstricke**: Einblenden in `lib/seite.ts`, Zufall jetzt wegen Server und Browser,
  neu: Skripte je Instanz anbinden und eindeutige Attributnamen, Live-Regionen per Skript
  befüllen, getrennte Ressourcen für Staging und Produktion, Header statischer Dateien in
  `_headers`, React-Vorbündelung in workerd.

## PROJEKT.md

- Neuer Stand 2026-10-08.
- Offene Punkte: Branch übernehmen, Zone und Tarif bei Cloudflare, erster Deploy erst
  Staging, dann Produktion, Datenschutzerklärung wegen Cloudflare als Hoster, DNS, wer
  pflegt Inhalte, `kanten-pruefen.py` nachholen.

## Übersicht der Umstellung

| Nr. | Commit | Inhalt |
|---|---|---|
| 0001 | `build!` | Astro und EmDash, Layout, Rechtsseiten, Startseite als Blöcke |
| 0002 | `feat` | Funktionen und Preise als Blöcke, Diagramme ohne React |
| 0003 | `build(cloudflare)` | Staging und Produktion als Worker, `_headers`, Middleware, robots, Sitemap |
| 0004 | `docs` | diese Nachführung |
