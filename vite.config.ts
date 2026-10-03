import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/*
  Eine HTML-Vorlage für alle Seiten. Welche Seite der Browser lädt, entscheidet
  src/main.tsx am Pfad. Beim Bauen schreibt scripts/prerender.mjs jede Seite
  fertig gerendert in ihren eigenen Ordner, samt Titel, Beschreibung und
  Vorschaubild. Das Manifest braucht das Skript, um die Seitendatei jeder Route
  per modulepreload vorzuladen.
*/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5196 },
  preview: { port: 4173 },
  build: {
    manifest: true,
  },
})
