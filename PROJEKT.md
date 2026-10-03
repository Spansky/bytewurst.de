# ByteWurst: Stand und offene Punkte

Wird nicht automatisch geladen. Regeln stehen in CLAUDE.md.

## Stand 2026-10-03

Konzeptentwurf mit Startseite, Funktionen, Preise, Impressum, Datenschutz und 404.
Gebaut aus dem, was bytewurst.de, bytebutchers.de und die Websuche hergeben.
Lokal gebaut und geprüft, noch nicht ausgeliefert.

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
- [ ] Impressum, Datenschutzerklärung und verantwortliche Stelle (Hoster, Logs).
- [ ] Kundengeschichten so erzählbar? Hackfleisch-Aktion und die 4-Uhr-Mail stehen auf
      bytewurst.de, hier sind sie nacherzählt.
- [ ] "Besucher +28 %, Umsatz ±0 %, Ø Bon −22 %" im Wahrheitstest: Auf bytewurst.de als
      Illustration gezeigt, hier als Beispielauswertung. Die −22 % sind daraus errechnet.
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

## Offene Punkte für uns

- [ ] GitHub-Repo `stevejocks/website-bytewurst` anlegen, dann `git push -u origin main`.
- [ ] Coolify: Anwendung aus dem Repo, Build Pack Dockerfile, Port 3000, Healthcheck
      `/healthz`, Domain `bytewurst.stevejocks.de`. Danach `curl -I .../og-image.jpg`.
- [ ] Am iPhone die drei Wege der Leisten prüfen (siehe ios-leisten.md).
