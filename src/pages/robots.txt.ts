import type { APIRoute } from 'astro'
import { KONZEPT, SEITEN_URL } from '../data/betrieb'

/*
  Ersetzt die robots.txt von EmDash (die legt sie nur an, wenn die Seite
  keine eigene hat). Solange KONZEPT gilt, sperrt sie alles: Ein Entwurf mit
  Stockfotos und Beispielzahlen soll nicht in Suchmaschinen landen und schon
  gar nicht neben bytewurst.de.
*/
export const GET: APIRoute = () =>
  new Response(
    KONZEPT
      ? '# Konzeptentwurf, noch nicht für Suchmaschinen\nUser-agent: *\nDisallow: /\n'
      : `User-agent: *\nAllow: /\nDisallow: /_emdash/\n\nSitemap: ${SEITEN_URL}/sitemap.xml\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache' } },
  )
