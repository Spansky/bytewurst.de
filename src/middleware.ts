import { defineMiddleware } from 'astro:middleware'

/*
  Was vorher nginx.conf erledigt hat, soweit es Seiten betrifft:

  - Seiten ohne Schrägstrich auf die kanonische Adresse mit Schrägstrich
  - Sicherheits-Header auf jeder gerenderten Antwort
  - Seiten nie cachen, sonst zeigen Browser nach einem Deploy veraltete Inhalte

  Statische Dateien aus public/ und /_astro liefert Cloudflare direkt aus
  den Worker-Assets, dort läuft diese Middleware nicht. Deren Header stehen
  in public/_headers.
*/
const MIT_SCHRAEGSTRICH = /^\/(funktionen|preise|impressum|datenschutz)$/

export const onRequest = defineMiddleware(async ({ url }, next) => {
  if (MIT_SCHRAEGSTRICH.test(url.pathname)) {
    return new Response(null, { status: 301, headers: { Location: `${url.pathname}/${url.search}` } })
  }

  const antwort = await next()
  const h = antwort.headers
  try {
    h.set('X-Content-Type-Options', 'nosniff')
    h.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    if (!url.pathname.startsWith('/_emdash')) {
      h.set('X-Frame-Options', 'SAMEORIGIN')
      h.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
      if (!h.has('Cache-Control')) h.set('Cache-Control', 'no-cache, must-revalidate')
    }
  } catch {
    // Unveränderliche Header (etwa bei Response.redirect): so lassen, wie sie sind
  }
  return antwort
})
