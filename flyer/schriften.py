"""
Feste Schnitte aus den variablen Webschriften der Seite, für den Flyer.

Chromium bettet variable Schriften im PDF unzuverlässig ein (teils als Type 3,
das manche Druckereien in der Prüfung anmeckern). Mit festen Schnitten landet
jede Schrift als normale TrueType-Teilmenge im PDF.

Aufruf aus dem Projektordner:  python3 flyer/schriften.py
"""
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

QUELLE = Path("public/fonts")
ZIEL = Path("flyer/schriften")

SCHNITTE = {
    # Überschriften wie .titel auf der Seite
    "anybody-titel": ("anybody", {"wght": 850, "wdth": 62}),
    # Kleinere Überschriften wie .schild
    "anybody-schild": ("anybody", {"wght": 750, "wdth": 85}),
    # Wortmarke wie in Logo.tsx
    "anybody-logo": ("anybody", {"wght": 800, "wdth": 78}),
    "rethink-400": ("rethink-sans", {"wght": 400}),
    "rethink-600": ("rethink-sans", {"wght": 600}),
    "rethink-700": ("rethink-sans", {"wght": 700}),
    # Bons auf 75 % Breite wie in index.css
    "martian-400": ("martian-mono", {"wght": 400, "wdth": 75}),
    "martian-700": ("martian-mono", {"wght": 700, "wdth": 75}),
}

ZIEL.mkdir(parents=True, exist_ok=True)
for name, (datei, achsen) in SCHNITTE.items():
    schrift = TTFont(QUELLE / f"{datei}.woff2")
    fest = instantiateVariableFont(schrift, achsen, updateFontNames=False)
    fest.flavor = None
    # Eigener Familienname je Schnitt, damit Chromium nichts nachträglich fett rechnet
    for eintrag in fest["name"].names:
        if eintrag.nameID in (1, 4, 16):
            eintrag.string = f"BW {name}"
        elif eintrag.nameID == 6:
            eintrag.string = f"BW-{name}"
        elif eintrag.nameID in (2, 17):
            eintrag.string = "Regular"
    fest.save(ZIEL / f"{name}.ttf")
    print("geschrieben", ZIEL / f"{name}.ttf")
