"""
Baut den Flyer aus flyer.html.

Aufruf aus dem Projektordner:  python3 flyer/bauen.py

Ergebnis in flyer/ausgabe/:
  bytewurst-flyer-a5-druck.pdf     für die Druckerei: PDF/X-3, CMYK, ISO Coated v2 (FOGRA39),
                                   154 x 216 mm (A5 plus 3 mm Beschnitt), Seite 1 vorne,
                                   dunkle Schrift nur aus Schwarz
  bytewurst-flyer-a5-druck-rgb.pdf dasselbe in RGB, falls die Druckerei RGB will
  bytewurst-flyer-a5-ansicht.pdf   Endformat 148 x 210 mm, zum Mailen und Zeigen
  vorne.png, hinten.png            Vorschau auf Endformat, 200 dpi

Braucht Python-Playwright mit Chromium, fontTools, segno, pikepdf, Ghostscript und
poppler (brew install ghostscript poppler, pip install pikepdf segno). Das Farbprofil lädt das Skript selbst von
eci.org, wenn es fehlt.
"""
import io
import re
import shutil
import subprocess
import sys
import tempfile
import urllib.request
import zipfile
from pathlib import Path

import segno
from playwright.sync_api import sync_playwright

ORDNER = Path(__file__).resolve().parent
AUSGABE = ORDNER / "ausgabe"
PROFIL = ORDNER / "profil" / "ISOcoated_v2_eci.icc"
PROFIL_QUELLE = "https://www.eci.org/lib/exe/eci_offset_2009.zip"
DEMO = "https://cal.eu/bytewurst/demotermin"


def schriften():
    if not (ORDNER / "schriften" / "anybody-titel.ttf").exists():
        subprocess.run([sys.executable, str(ORDNER / "schriften.py")], check=True, cwd=ORDNER.parent)


def qr():
    """QR-Code als Vektor in qr.js, Ruhezone kommt vom weißen Feld drumherum"""
    code = segno.make(DEMO, error="m")
    puffer = io.BytesIO()
    code.save(puffer, kind="svg", scale=1, border=0, dark="#000", xmldecl=False, svgclass=None, lineclass=None, nl=False)
    svg = puffer.getvalue().decode()
    breite = code.symbol_size(border=0)[0]
    svg = svg.replace("<svg ", f'<svg viewBox="0 0 {breite} {breite}" shape-rendering="crispEdges" ', 1)
    (ORDNER / "qr.js").write_text(
        "// Erzeugt von bauen.py, Ziel: " + DEMO + "\n"
        "document.querySelectorAll('[data-qr]').forEach((el) => { el.innerHTML = " + repr(svg) + " })\n",
        encoding="utf-8",
    )


def profil():
    if PROFIL.exists():
        return
    PROFIL.parent.mkdir(exist_ok=True)
    daten = urllib.request.urlopen(PROFIL_QUELLE, timeout=60).read()
    with zipfile.ZipFile(io.BytesIO(daten)) as z:
        PROFIL.write_bytes(z.read("ECI_Offset_2009/ISOcoated_v2_eci.icc"))


MM = 72 / 25.4


def rendern(roh):
    """Chromium druckt mit Überstand, die Seitengröße rundet es dabei leicht"""
    url = (ORDNER / "flyer.html").as_uri()
    with sync_playwright() as p:
        browser = p.chromium.launch()
        seite = browser.new_page()
        for art in ["druck", "endformat"]:
            seite.goto(url + "#" + art)
            seite.reload()
            seite.evaluate("document.fonts.ready")
            seite.pdf(path=str(roh / f"{art}.pdf"), prefer_css_page_size=True, print_background=True)
        browser.close()


def zuschneiden(quelle, ziel, breite_mm, hoehe_mm, beschnitt_mm=0, cmyk=False):
    """
    Schneidet von oben links auf das exakte Format zu und trägt TrimBox und
    BleedBox ein. Mit cmyk=True zugleich nach ISO Coated v2 (FOGRA39) umrechnen.
    """
    hoehe_roh = float(re.search(rb"/MediaBox \[0 0 [\d.]+ ([\d.]+)\]", quelle.read_bytes()).group(1))
    b, h, rand = breite_mm * MM, hoehe_mm * MM, beschnitt_mm * MM
    boxen = f"[/TrimBox [{rand:.3f} {rand:.3f} {b - rand:.3f} {h - rand:.3f}] /BleedBox [0 0 {b:.3f} {h:.3f}] /PAGE pdfmark"
    seitengeraet = (
        f"<</PageOffset [0 {h - hoehe_roh:.3f}] "
        f"/EndPage {{exch pop dup 2 lt {{pop {boxen} true}} {{pop false}} ifelse}}>> setpagedevice"
    )
    farbe = ["-sColorConversionStrategy=LeaveColorUnchanged"]
    pdfx = []
    if cmyk:
        profil()
        farbe = [
            f"--permit-file-read={PROFIL.parent}/",
            "-sColorConversionStrategy=CMYK",
            "-sProcessColorModel=DeviceCMYK",
            f"-sOutputICCProfile={PROFIL}",
            "-dRenderIntent=1",
            "-dPDFX=3",
            f"-sPROFILPFAD={PROFIL}",
        ]
        pdfx = [str(ORDNER / "pdfx.ps")]
    subprocess.run(
        [
            "gs", "-q", "-dSAFER", "-dBATCH", "-dNOPAUSE",
            "-sDEVICE=pdfwrite",
            "-dCompatibilityLevel=1.6",
            "-dPDFSETTINGS=/prepress",
            "-dEmbedAllFonts=true",
            "-dSubsetFonts=true",
            "-dAutoRotatePages=/None",
            "-dFIXEDMEDIA",
            f"-dDEVICEWIDTHPOINTS={b:.3f}",
            f"-dDEVICEHEIGHTPOINTS={h:.3f}",
            *farbe,
            f"-sOutputFile={ziel}",
            "-c", seitengeraet,
            "-f", *pdfx, str(quelle),
        ],
        check=True,
    )


def schwarz(datei):
    """
    Schrift in neutralem Dunkel (Tinte, Grau) nur aus Schwarz drucken.

    Über das Profil wird aus Tinte ein Vierfarbschwarz mit rund 290 %
    Farbauftrag. Für Flächen ist das richtig, kleine Schrift wird damit bei
    leichtem Passerversatz unscharf. Deshalb bekommt jeder Textblock, dessen
    Füllfarbe fast neutral ist, einen reinen K-Wert. Volles Schwarz druckt
    über, damit auf Senf keine Blitzer entstehen. Flächen, Wursti und
    farbige Schrift bleiben, wie das Profil sie gerechnet hat.
    """
    import pikepdf

    def k_wert(c, m, y, k):
        cmy = (c, m, y)
        if k < 0.3 or max(cmy) - min(cmy) > 0.12:
            return None
        return min(1.0, round(k + 0.6 * sum(cmy) / 3, 2))

    pdf = pikepdf.open(datei, allow_overwriting_input=True)
    ueber = pdf.make_indirect(pikepdf.Dictionary(Type=pikepdf.Name.ExtGState, OP=True, op=True, OPM=1))
    aus = pdf.make_indirect(pikepdf.Dictionary(Type=pikepdf.Name.ExtGState, OP=False, op=False, OPM=0))
    for seite in pdf.pages:
        if "/ExtGState" not in seite.Resources:
            seite.Resources.ExtGState = pikepdf.Dictionary()
        zustaende = seite.Resources.ExtGState
        zustaende["/BWueber"], zustaende["/BWaus"] = ueber, aus
        neu, farbe, stapel, geaendert = [], None, [], 0
        for operanden, op in pikepdf.parse_content_stream(seite):
            name = str(op)
            if name == "q":
                stapel.append(farbe)
            elif name == "Q":
                farbe = stapel.pop() if stapel else None
            elif name == "k":
                farbe = [float(x) for x in operanden]
            neu.append(pikepdf.ContentStreamInstruction(operanden, op))
            if name == "BT" and farbe and (kk := k_wert(*farbe)) is not None:
                neu.append(pikepdf.ContentStreamInstruction([0, 0, 0, kk], pikepdf.Operator("k")))
                if kk == 1.0:
                    neu.append(pikepdf.ContentStreamInstruction([pikepdf.Name("/BWueber")], pikepdf.Operator("gs")))
                geaendert += 1
            elif name == "ET" and farbe and (kk := k_wert(*farbe)) is not None:
                neu.append(pikepdf.ContentStreamInstruction(farbe, pikepdf.Operator("k")))
                if kk == 1.0:
                    neu.append(pikepdf.ContentStreamInstruction([pikepdf.Name("/BWaus")], pikepdf.Operator("gs")))
        seite.Contents = pdf.make_stream(pikepdf.unparse_content_stream(neu))
        print(f"  {geaendert} Textblöcke auf reines Schwarz")
    pdf.save(datei)


def vorschau():
    """Vorschaubilder aus dem Ansichts-PDF, also genau das, was im PDF steht"""
    for nr, name in [(1, "vorne"), (2, "hinten")]:
        subprocess.run(
            ["pdftoppm", "-r", "200", "-f", str(nr), "-l", str(nr), "-singlefile", "-png",
             str(AUSGABE / "bytewurst-flyer-a5-ansicht.pdf"), str(AUSGABE / name)],
            check=True,
        )


if __name__ == "__main__":
    for werkzeug in ["gs", "pdftoppm"]:
        if not shutil.which(werkzeug):
            sys.exit(f"{werkzeug} fehlt: brew install ghostscript poppler")
    schriften()
    qr()
    AUSGABE.mkdir(exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        roh = Path(tmp)
        rendern(roh)
        zuschneiden(roh / "druck.pdf", AUSGABE / "bytewurst-flyer-a5-druck.pdf", 154, 216, 3, cmyk=True)
        schwarz(AUSGABE / "bytewurst-flyer-a5-druck.pdf")
        zuschneiden(roh / "druck.pdf", AUSGABE / "bytewurst-flyer-a5-druck-rgb.pdf", 154, 216, 3)
        zuschneiden(roh / "endformat.pdf", AUSGABE / "bytewurst-flyer-a5-ansicht.pdf", 148, 210)
    vorschau()
    for datei in sorted(AUSGABE.iterdir()):
        print(f"{datei.name:40} {datei.stat().st_size / 1024:8.0f} KB")
