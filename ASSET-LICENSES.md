# Assets: copyright and licence check

Status: 2026-10-22. This lists every asset in the repo that could carry copyright, licence or
trademark obligations, so each one can be checked off. It is an inventory, not legal advice.

Licence texts referenced below:

- Unsplash License: https://unsplash.com/license
- SIL Open Font License 1.1: https://openfontlicense.org
- Font Awesome Free: https://fontawesome.com/license/free (icons CC BY 4.0, code MIT)
- CC BY 4.0: https://creativecommons.org/licenses/by/4.0/
- ECI ICC profiles: https://www.eci.org/en/downloads

## 0. Open gaps (start here)

- [ ] **Font Awesome attribution is missing.** The icons are CC BY 4.0, which requires
      credit. `src/components/Icon.astro` inlines only the path data, so no attribution ends
      up in the output, and the Impressum does not mention Font Awesome. See section 3.
- [ ] **Wursti is ByteButchers' brand.** The mascot was redrawn from the favicon on
      bytewurst.de and given new poses. Permission is still open (PROJEKT.md, Freigabeliste:
      "Wursti als Maskottchen frei verwenden"). See section 4.
- [ ] **Rights from the external designer.** There is no record in the repo of a written
      grant of usage rights for the layout, illustrations, Wursti poses, flyer and so on, or
      of a confirmation that they contain no third-party, stock or AI material. The grant has
      to cover handing everything over to ByteButchers. See section 4.
- [ ] **Photos have no model or property releases.** Unsplash does not provide them. People
      can be seen in `theke` and `frueher`, and possibly a shop sign in `schaufenster`. This
      matters most for advertising use. See section 1.
- [ ] **Font provenance is undocumented.** Commit "Eigene Schriften statt der von
      Jock&Jock" (2026-10-03) added the WOFF2 files without saying where they were
      downloaded from. See section 2.
- [ ] **No OFL licence text ships with the fonts**, neither in `public/fonts/` nor in
      `flyer/schriften/`. OFL requires the licence to go along with any redistribution of
      the font files, and both folders are publicly served or handed out. See section 2.
- [ ] **ECI colour profile.** `ISOcoated_v2_eci.icc` (FOGRA39) is embedded in the tracked
      print PDF. Check the ECI terms for embedding and distribution. See section 5.
- [ ] **Texts and figures from bytewurst.de.** The customer stories are retold, and the
      figures 4,812 €, 6,390 € and +28 % / ±0 % are taken exactly. ByteButchers' approval is
      still open (PROJEKT.md, Freigabeliste). See section 6.

## 1. Photos

All 7 photos come from Unsplash. The sources are recorded in `reference/bilder/nachweis.json`
(originals in `reference/bilder/`, tracked in git). `npm run images` turns them into
`public/bilder/` (AVIF, WebP), `src/data/bilder.json` and `src/data/bildnachweis.json`. The
crops are in `scripts/prepare-images.mjs`. Alt texts are in `src/data/fotos.ts`.

| ✓ | Name | Photographer | Unsplash page | Crop | Used in |
|---|---|---|---|---|---|
| [ ] | schaufenster | Sebastien Le Derout | [qzDwGFTkaqI](https://unsplash.com/photos/a-butcher-shop-with-meat-hanging-from-the-ceiling-qzDwGFTkaqI) | none | `bloecke/start/Einstieg.astro` |
| [ ] | theke | Kyle Mackie | [qgfjZUXup1M](https://unsplash.com/photos/raw-meat-on-display-counter-qgfjZUXup1M) | right 31 % removed (price sign) | `bloecke/funktionen/Kopf.astro`, blog 01 |
| [ ] | ueber-die-theke | Jack Hunter | [u4Ns7vix_8E](https://unsplash.com/photos/sausage-display-cabinet-u4Ns7vix_8E) | none | `bloecke/Schluss.astro` |
| [ ] | frueher | Galt Museum & Archives | [hPNu_LYHviQ](https://unsplash.com/photos/a-black-and-white-photo-of-a-butcher-shop-hPNu_LYHviQ) | none | `bloecke/start/Frueher.astro` |
| [ ] | wurst-senf | Louis Hansel | [JeJ5IpCG1mw](https://unsplash.com/photos/two-sausages-on-a-plate-with-mustard-on-the-side-JeJ5IpCG1mw) | none | `bloecke/preise/Kopf.astro`, blog 04 |
| [ ] | kaffee | Roman Synkevych | [-x_4aUXuQ-k](https://unsplash.com/photos/-x_4aUXuQ-k) | top 38 % and right 60 % removed (phone with text) | `bloecke/start/Einwaende.astro`, blog 03 |
| [ ] | bon | Towfiqu barbhuiya | [xkArbdUcUeE](https://unsplash.com/photos/payment-terminal-with-white-receipt-xkArbdUcUeE) | none | `bloecke/start/Wahrheitstest.astro`, blog 02 |

For each photo, check:

- [ ] The Unsplash page is still online and lists the same photographer. If a photo has been
      taken down, keep proof of the licence at the time of download, for example a
      screenshot.
- [ ] It is a free Unsplash photo, not Unsplash+ (Unsplash+ has a different licence).
- [ ] `frueher` (Galt Museum & Archives): a historical archive photo. Check that the
      uploader holds the rights and is not only the archive.
- [ ] Recognisable people, brands, shop names or price signs. The Unsplash licence covers
      the photo itself, not the personality rights of the people in it and not trademarks.

Credits already in place: the "Bildnachweis" section in `src/pages/impressum/index.astro`
links each photographer and the Unsplash licence (not legally required by Unsplash, but
good practice). In concept mode, the footer `src/components/Fusszeile.astro` also says
"Die Fotos stammen von Unsplash".

Blog posts can only choose from these 7 photos (field `bild`, `scripts/blog.mjs`), so no
uncredited photos can come in that way. Media uploaded later through the EmDash admin
(R2) is not covered here and has to be checked separately.

## 2. Fonts

All self-hosted, no Google Fonts CDN. Loaded via `@font-face` in `src/index.css`.

| ✓ | Font | File | Copyright (from the font file) | Upstream | Licence |
|---|---|---|---|---|---|
| [ ] | Anybody | `public/fonts/anybody.woff2` | © 2020 The Anybody Project Authors | github.com/Etcetera-Type-Co/Anybody | OFL 1.1, no Reserved Font Name |
| [ ] | Rethink Sans | `public/fonts/rethink-sans.woff2` | © 2022 The Rethink Sans Project Authors | github.com/hans-thiessen/Rethink-Sans | OFL 1.1, no Reserved Font Name |
| [ ] | Martian Mono | `public/fonts/martian-mono.woff2` | © 2020 The Martian Mono Project Authors | github.com/evilmartians/mono | OFL 1.1, no Reserved Font Name |

Derived uses:

- `flyer/schriften/*.ttf` (8 files): static instances made by `flyer/schriften.py` from the
  WOFF2 files and renamed "BW …". OFL allows modified versions, and renaming them is fine
  because no Reserved Font Name is set. They are embedded in the flyer PDFs.
- `scripts/icons/wortmarke.svg` and `zeile.svg`: text converted to outlines from Anybody and
  Rethink Sans by `scripts/wortmarke.py`, then used in `public/og-image.jpg`. OFL places no
  restrictions on graphics made with the font.

To do:

- [ ] Confirm where the WOFF2 files came from, ideally by comparing them with the upstream
      releases.
- [ ] Add the OFL text next to the fonts, for example `public/fonts/OFL.txt` and
      `flyer/schriften/OFL.txt`.

Credit already in place: the "Schriften" section in the Impressum.

## 3. Icons: Font Awesome Free

- Package `@fortawesome/free-solid-svg-icons` 7.3.1 (the free version, no Pro package, no
  `.npmrc`). Licence `(CC-BY-4.0 AND MIT)`: the icons are CC BY 4.0, the code is MIT.
- Rendered as inline SVG by `src/components/Icon.astro`, which keeps only the path data.
- 17 icons: ArrowLeft, ArrowRight, Bars, CalendarCheck, CashRegister, Check, Envelope,
  MagnifyingGlassChart, Pause, Phone, Play, Plus, Print, Rotate, RotateLeft, Stopwatch,
  Xmark.
- Imported in: `components/Kopfzeile.astro`, `Knoepfe.astro`, `BlogKarte.astro`;
  `bloecke/start/Einwaende.astro`, `Nacht.astro`, `Planspiel.astro`, `PreisTeaser.astro`,
  `Kassenzettel.astro`, `Pinnwand.astro`; `bloecke/preise/Tarife.astro`, `Fragen.astro`;
  `pages/blog/[slug].astro`.

To do:

- [ ] Add a credit, for example in the Impressum: "Icons: Font Awesome Free by Fonticons,
      Inc., CC BY 4.0", with links.

## 4. Self-made graphics (designer or Jock&Jock)

The early commits (concept, review, fonts, flyer, 2026-10-03 to 10-07) are by `stevejocks`.
Clarify which of these graphics the external designer made, and for those, get the
designer's written confirmation:

- [ ] It is their own work, with no stock material, templates, AI output or third-party
      illustrations, or if there is any, which one and under which licence.
- [ ] A grant of usage rights for web, print (flyer) and social media (OG image), covering
      editing and transfer to ByteButchers, with no time or place limits.
- [ ] Whether the designer wants to be named, or waives that.

| ✓ | Asset | Where | Note |
|---|---|---|---|
| [ ] | **Wursti** (mascot, all faces and poses) | `src/components/Wursti.astro`, `WurstiBuehne.astro`, `Logo.astro`, `scripts/icons/wursti.svg`, `badge-round.svg`, `badge-square.svg`, `public/favicon.*`, `apple-touch-icon.png`, `icon-*.png`, `og-image.jpg`, three times in `flyer/flyer.html` | Shapes and colours taken from the favicon on bytewurst.de. Two separate rights apply: ByteButchers owns the brand and the original figure, and whoever drew the new poses (glasses, laughing, surprised, arms, legs) owns that work. Both are needed. |
| [ ] | Wordmark "ByteWurst" | `scripts/icons/wortmarke.svg`, `zeile.svg`, `og-image.jpg` | Set in Anybody and Rethink Sans, not a copy of a ByteButchers logo file. The name is their trademark. |
| [ ] | Diagrams | `components/Prognose.astro`, `Wochenvergleich.astro`, `WetterJahreszeit.astro`, `Aktionswoche.astro`, `Tagesreport.astro`, `lib/diagramme.ts` | Generated SVG. |
| [ ] | Night scene | `bloecke/start/Nacht.astro` | Inline SVG. |
| [ ] | Meat hooks and price tags | `bloecke/preise/Tarife.astro`, flyer | Inline SVG. |
| [ ] | Tile pattern "Fliese" | `src/index.css` (`@utility fliesen`), `og-image.jpg`, flyer | SVG data URI. |
| [ ] | CSS textures | `bloecke/start/Pinnwand.astro` (cork), `Planspiel.astro` (stripes), `Kassenzettel.astro` (barcode) | Gradients only, no image files. |
| [ ] | Overall layout and look | whole site, flyer | Covered by the grant of usage rights above. |
| [ ] | Jock&Jock credit (heads) | `src/components/jockjock-credit.tsx` | The agency's own figures, copied from `website-jockjock`. Confirm internally that the agency holds the rights. |

## 5. Flyer

| ✓ | Asset | Note |
|---|---|---|
| [ ] | `flyer/flyer.html`, `flyer/ausgabe/*.pdf`, `vorne.png`, `hinten.png` | No photos. Contains Wursti, fonts and the graphics from section 4. |
| [ ] | QR code (`flyer/qr.js`) | Generated with segno. Links to `https://cal.eu/bytewurst/demotermin`. "QR Code" is a trademark of Denso Wave, and the usual use of the term is free. |
| [ ] | ECI profile `ISOcoated_v2_eci.icc` (FOGRA39) | Not in the repo: `flyer/bauen.py` downloads it from eci.org into the gitignored `flyer/profil/`. It is embedded as the output intent in `bytewurst-flyer-a5-druck.pdf`. Check the ECI terms for embedding it. |
| [ ] | `flyer/pdfx.ps` | Adapted from Ghostscript's `PDFX_def.ps` (Ghostscript is AGPL). A short build script, not distributed with the flyer. Low risk; consider a source note in the file. |
| [ ] | Fictional butcher "Metzgerei Pi mal Daumen, seit 1987" (`flyer/flyer.html`, also on the site) | Check that no real business has this name. |

## 6. Texts, figures and third-party brands

- [ ] Texts and claims about ByteWurst come from bytewurst.de (start page, prices, docs,
      blog, Impressum) and bytebutchers.de, retold rather than copied (`CLAUDE.md`,
      "Tatsachen"; `src/data/betrieb.ts`). They live in `seed/seed.json`,
      `content/blog/*.md`, `src/data/*.ts` and the flyer. Approval by ByteButchers is open.
- [ ] Figures taken exactly from bytewurst.de: 4,812 €, 6,390 €, +28 % / ±0 %. All other
      figures are invented and labelled as examples (`src/data/beispiele.ts`, `start.ts`).
- [ ] Brand names used: ByteWurst, ByteButchers, wurstpad (text link only, no logo),
      Unsplash, cal.eu. No third-party logos.
- [x] No POS system brands, testimonials or customer logos. Keep it that way until there is
      approval (PROJEKT.md, Freigabeliste).

## 7. Software dependencies (low risk)

These are not design assets, but for completeness:

- Runtime (shipped in the Worker): astro, emdash, @emdash-cms/cloudflare, @astrojs/cloudflare,
  @astrojs/react, react, react-dom: all MIT. Font Awesome: see section 3.
- Build only: tailwindcss, typescript, eslint, wrangler and others: MIT or Apache-2.0. sharp
  is Apache-2.0, and its bundled libvips is LGPL-3.0-or-later. Both are used only by
  `scripts/make-icons.mjs` and `prepare-images.mjs` and are not shipped.
- Python and system tools for the flyer and icons: Playwright, fontTools, segno, pikepdf,
  Ghostscript (AGPL), poppler. They are used as tools only, so the output is not covered by
  their licences.

## 8. Credits already on the site

- Impressum (`src/pages/impressum/index.astro`): "Gestaltung und Umsetzung" (Jock&Jock),
  "Bildnachweis" (Unsplash with all photographers, plus "Wursti ist das Maskottchen von
  ByteWurst"), "Schriften" (OFL).
- Footer in concept mode (`src/components/Fusszeile.astro`): Unsplash note.
- Missing: Font Awesome (section 3), and the designer if they want to be named (section 4).
