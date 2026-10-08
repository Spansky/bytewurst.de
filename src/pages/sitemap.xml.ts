import type { APIRoute } from 'astro'
import { SEITEN_URL } from '../data/betrieb'
import { seiten } from '../data/seiten'
import { beitraege } from '../lib/blog'

/* Ersetzt die Sitemap von EmDash: feste Seiten aus src/data/seiten.ts, dazu die Blogbeiträge. */
export const GET: APIRoute = async () => {
  const heute = new Date().toISOString().slice(0, 10)
  const feste = seiten
    .filter((s) => s.sitemap)
    .map((s) => `  <url><loc>${SEITEN_URL}${s.pfad}</loc><lastmod>${heute}</lastmod></url>`)
  const blog = (await beitraege()).beitraege.map(
    (b) => `  <url><loc>${SEITEN_URL}/blog/${b.id}/</loc><lastmod>${b.data.updatedAt.toISOString().slice(0, 10)}</lastmod></url>`,
  )
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...feste, ...blog].join('\n')}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'no-cache' },
  })
}
