import cloudflare from '@astrojs/cloudflare'
import react from '@astrojs/react'
import { d1, r2 } from '@emdash-cms/cloudflare'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import emdash from 'emdash/astro'

/*
  Astro mit EmDash als CMS, ausgeliefert als Cloudflare Worker (wrangler.jsonc,
  Einstieg src/worker.ts). EmDash verlangt output "server": Seiten mit
  Inhalten aus dem CMS werden bei jedem Aufruf gerendert.

  Inhalte liegen in D1 (Bindung DB), hochgeladene Medien in R2 (Bindung
  MEDIA). Lokal stellt Wrangler beides unter .wrangler/ bereit.

  React bleibt nur, weil die Oberfläche von EmDash unter /_emdash/admin
  damit gebaut ist, und für den Jock&Jock-Credit (gemeinsame Vorlage aller
  Projekte). Alles auf der Seite selbst ist Astro mit kleinen Skripten.
*/
export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  server: { port: 5196 },
  integrations: [
    react(),
    emdash({
      database: d1({ binding: 'DB', session: 'auto' }),
      storage: r2({ binding: 'MEDIA' }),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      optimizeDeps: {
        // Vorab bündeln, sonst entdeckt Vite React erst beim ersten Rendern der
        // Credit-Insel, optimiert neu und bricht laufende Anfragen im Worker ab
        // (zwei Kopien von React, "Invalid hook call"). Nur Entwicklung.
        include: ['react', 'react/jsx-runtime', 'react-dom', 'react-dom/server.edge'],
      },
    },
  },
  devToolbar: { enabled: false },
})
