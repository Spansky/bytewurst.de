# syntax=docker/dockerfile:1
#
# ByteWurst: statische Seite, Node baut, nginx liefert aus.
#
# Der Build rendert jede Seite vor (scripts/prerender.mjs), im fertigen Bild
# liegen nur HTML, CSS, JS, Schriften und Bilder hinter einem nginx. Bilder und
# Icons sind eingecheckt und werden hier nicht neu gerechnet, sharp läuft also
# nie im Container, und reference/ fehlt im Build-Kontext.
#
# nginx-unprivileged statt nginx:alpine: läuft als Nutzer 101, ohne root.
# Coolify: Build Pack "Dockerfile", Port 3000, Healthcheck /healthz.

# ---------- Stufe 1: bauen ----------
FROM node:22-alpine AS builder
WORKDIR /app

# Erst nur die Manifeste. Solange die sich nicht ändern, kommt npm ci aus dem
# Layer-Cache und der Build bleibt schnell.
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build

# ---------- Stufe 2: ausliefern ----------
FROM nginxinc/nginx-unprivileged:1.29-alpine AS runner

USER root
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/*
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
RUN chown -R 101:101 /usr/share/nginx/html
USER 101

EXPOSE 3000

# wget kommt aus busybox, kein zusätzliches Paket nötig.
# 127.0.0.1 statt localhost: sonst wird bei aktivem IPv6 zuerst ::1 versucht.
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
