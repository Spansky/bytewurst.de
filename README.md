# ByteWurst

Verkaufsseite für ByteWurst, Umsatzprognose und Reporting für Metzgereien. Konzeptentwurf von
Jock&Jock. Gebaut mit [Astro](https://astro.build) und [EmDash](https://emdashcms.com) als CMS, läuft als
Cloudflare Worker mit D1 und R2.

```bash
npm install
npm run dev        # http://localhost:5196, Verwaltung unter /_emdash/admin
npm run pruefen    # Lint, Typprüfung, Build
```

Beim ersten Start ist die lokale D1-Datenbank (`.wrangler/`) leer. Unter
`http://localhost:5196/_emdash/admin` den Einrichtungsassistenten durchlaufen, dabei spielt
EmDash `seed/seed.json` ein (Schema und Inhalte). Lokal geht es schneller über
`http://localhost:5196/_emdash/api/setup/dev-bypass`, das legt zusätzlich einen
Entwicklungs-Admin an.

Regeln, Aufbau und Fallstricke: `CLAUDE.md`. Stand und offene Punkte: `PROJEKT.md`.
Was sich mit welchem Commit geändert hat: `docs/`.
