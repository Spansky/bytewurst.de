import type { APIRoute } from 'astro'
import { SEITEN_URL } from '../data/betrieb'
import { seiten } from '../data/seiten'

/* Ersetzt die Sitemap von EmDash: die Seiten stehen fest in src/data/seiten.ts. */
export const GET: APIRoute = () => {
  const heute = new Date().toISOString().slice(0, 10)
  const eintraege = seiten
    .filter((s) => s.sitemap)
    .map((s) => `  <url><loc>${SEITEN_URL}${s.pfad}</loc><lastmod>${heute}</lastmod></url>`)
    .join('\n')
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${eintraege}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'no-cache' },
  })
}
