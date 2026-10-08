# ByteWurst: Stand und offene Punkte

Wird nicht automatisch geladen. Regeln stehen in CLAUDE.md.

## Stand 2026-10-08

Umgezogen von Vite und React auf Astro 7 mit EmDash 1.2 als CMS, läuft als Cloudflare
Worker mit D1 und R2 statt nginx in Coolify (Branch
`feat/astro-emdash`, Begründung und Prüfung in `docs/0001` bis `docs/0004`). Aussehen
und Verhalten wie abgenommen, im Vergleich mit der alten Fassung pixelgleich bis auf
Animationen. Texte der Seiten Start, Funktionen und Preise sind in der Verwaltung unter
`/_emdash/admin` bearbeitbar. Noch nicht gemergt, nicht gepusht, nicht ausgeliefert.

## Stand 2026-10-03

Konzeptentwurf mit Startseite, Funktionen, Preise, Impressum, Datenschutz und 404.
Gebaut aus dem, was bytewurst.de, bytebutchers.de und die Websuche hergeben.
Abnahme mit allen fünf Prüfern durchlaufen, Blocker und wichtige Befunde behoben.
Lokal gebaut und geprüft, noch nicht ausgeliefert (Repo fehlt auf GitHub).

## Recherche in Kürze

- ByteWurst rechnet jede Nacht aus den Verkaufsdaten des Warenwirtschaftssystems eine
  Sieben-Tage-Prognose je Warengruppe und Wochentag, wertet Aktionen aus (Besucher,
  Umsatz, Bon-Höhe vorher und nachher) und schickt um 4 Uhr einen Tagesreport per Mail.
  Dazu Umsatzreport mit Wetter und Feiertagsvergleich, Stoßzeiten, Bon-Kennzahlen,
  Filialvergleich, BonTok (Bons durchblättern), A4-Ausdruck.
- Keine neue Kasse, keine Hardware, läuft in der Cloud. Einrichtung in etwa zehn Minuten
  (Doku). Persönliche Vorstellung vor Ort, per Video oder Telefon.
- Preise: Kostenlos (1 Filiale, 3 Produkte, Basis-Reports), Early Adopter 5 € je
  100.000 € Vorjahresumsatz im Monat, jährlich abgerechnet, jederzeit kündbar, SEPA oder
  Rechnung. Enterprise demnächst.
- Firma: ByteButchers GmbH, Stuttgart, gegründet von Leon Sczepansky. Zweites Produkt
  wurstpad.com. Maskottchen Wursti.
- Außerhalb der eigenen Seiten findet die Websuche zu ByteWurst nichts (Stand heute).

## Freigabeliste

Muss ByteButchers bestätigen oder liefern, bevor `KONZEPT` auf `false` geht:

- [ ] Grundsätzlich: Wollen sie diese Seite, und unter welcher Adresse? bytewurst.de ist
      heute die Anwendung selbst, die Seite bräuchte eine eigene Domain oder einen Pfad.
- [ ] Impressum, Datenschutzerklärung und verantwortliche Stelle (Hoster, Logs). Im
      Konzeptmodus steht Jock&Jock als Anbieter drin, die Löschfrist der Server-Logs fehlt.
- [ ] Datenimport: Muss für den nächtlichen Import etwas exportiert oder hochgeladen werden?
      Die Preistabelle nennt "Daten-Upload", die Release Notes sprechen vom Hochladen ganzer
      Jahre. Die Seite sagt deshalb nur "holt sich automatisch".
- [ ] Läuft die Demo mit den eigenen Zahlen des Metzgers? Wäre ein starkes Argument, ist
      aber nicht belegt und steht deshalb nicht auf der Seite.
- [ ] Kundengeschichten so erzählbar? Hackfleisch-Aktion und die 4-Uhr-Mail stehen auf
      bytewurst.de, hier sind sie nacherzählt, ohne etwas hinzuzufügen.
- [ ] Tagesreport: bytewurst.de zeigt 4.812 € bei 318 Bons und Ø 15,10 €, das wären
      15,13 €. Hier steht der errechnete Wert.
- [ ] "Besucher +28 %, Umsatz ±0 %, Ø Bon -22 %" im Wahrheitstest: Auf bytewurst.de als
      Illustration gezeigt, hier als Beispielauswertung. Die -22 % sind daraus errechnet.
- [ ] Planspiel: ByteWurst liegt dort 2 bis 9 Stück daneben. Ausgedacht und so
      beschriftet, wirkt aber wie eine Genauigkeitsaussage. Passt das?
- [ ] Preisrechner: "konservativ 2 % Effizienzgewinn" ist die Annahme aus ihrem eigenen
      Rechner. Leberkäsweckle zu 2,50 € ist ein Spaß von uns.
- [ ] "Wir kommen gern zu dir in die Metzgerei": aus der Doku, gilt das für alle Regionen?
- [ ] Wursti als Maskottchen frei verwenden, auch mit neuen Posen (Brille, winken, staunen)?
- [ ] Unterstützte Kassen- und Warenwirtschaftssysteme: unbekannt, steht deshalb nirgends.
      Eine Liste wäre für Metzger die wichtigste Frage überhaupt.
- [ ] Fotos: Alle von Unsplash und Platzhalter. Eigene Bilder aus einer Kundenmetzgerei
      wären viel stärker. Auf dem Theken-Foto stehen englische Preisschilder, auf dem
      Foto über der Theke tschechische.
- [ ] Echte Kundenstimmen oder Logos, falls Kunden genannt werden dürfen.

## Flyer A5, Stand 2026-10-07

Druckfertiger Flyer zum Verschicken an Metzgereien in `flyer/ausgabe/`. Vorne der Bon des
Bauchgefühls ("Bauchgefühl ist teuer."), hinten Nacht, Morgenmail, Nutzen, Preis und Aufruf
mit QR-Code zum Demo-Termin. Für ByteButchers noch zu bestätigen:

- [ ] Druckerei und Papier: Das PDF ist auf gestrichenes Papier (FOGRA39) gerechnet. Für
      Naturpapier wäre PSO Uncoated das richtige Profil, dann neu bauen.
- [ ] "Wir zeigen dir ByteWurst gern bei dir in der Metzgerei": dieselbe Frage wie auf der
      Seite, gilt das überall?
- [ ] Leberkäsweckle als Preisvergleich (25 € gleich zehn Stück) ist unser Spaß, wie im
      Preisrechner der Seite.
- [ ] Metzgerei "Pi mal Daumen, seit 1987" auf dem Bon ist ausgedacht und soll niemanden
      treffen. Falls es eine echte Metzgerei dieses Namens gibt, umbenennen.
- [ ] Rückseite ohne Adressfeld, gedacht für den Versand im C5-Umschlag. Als Postkarte
      bräuchte es ein Adressfeld.

## Offene Punkte für uns

- [ ] GitHub-Repo `stevejocks/website-bytewurst` anlegen, dann `git push -u origin main`.
- [ ] Branch `feat/astro-emdash` durchsehen und nach `main` übernehmen.
- [ ] Cloudflare: Liegt die Zone `stevejocks.de` im Konto? Sonst geht die Custom Domain
      der Produktion nicht. Workers-Tarif prüfen, der Worker ist rund 4,8 MB (gzip), frei
      sind 3 MB.
- [ ] Erst Staging (`npm run deploy`), dann Produktion (`npm run deploy:production`).
      Nach dem ersten Deploy je Ziel die `database_id` in `wrangler.jsonc` eintragen,
      `/_emdash/admin` einrichten (Seed einspielen, Admin-Passkey). Optional Secret
      `EMDASH_ENCRYPTION_KEY` je Umgebung. Schritte in
      `docs/0003-auslieferung-cloudflare-workers.md`.
- [ ] Datenschutzerklärung: Hoster ist jetzt Cloudflare (Auftragsverarbeitung,
      Drittlandübermittlung, Protokolle). Der Abschnitt „Beim Aufruf der Seite“ beschreibt
      noch einen eigenen Server. Vor dem Ausliefern prüfen und anpassen lassen.
- [ ] DNS: `bytewurst.stevejocks.de` zeigt noch per Platzhalter auf netcup, das löst die
      Custom Domain ab.
- [ ] Wer pflegt Inhalte in EmDash? Konten für ByteButchers erst nach Freigabe anlegen.
- [ ] Datenschutz: Die Seite selbst setzt weiter keine Cookies. Die Verwaltung unter
      `/_emdash` schon (Anmeldung), das betrifft nur Redakteure. Prüfen, ob die
      Erklärung dazu einen Satz braucht.
- [ ] `kanten-pruefen.py` (Hausstandard) gegen den neuen Build laufen lassen. Das Skript
      lag bei der Umstellung nicht vor.
- [ ] Am iPhone die drei Wege der Leisten prüfen (siehe ios-leisten.md).
