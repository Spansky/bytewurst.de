"""
Wandelt die Texte des Vorschaubilds in SVG-Pfade um (Bricolage Grotesque) und
schreibt sie nach scripts/icons/: wortmarke.svg ("ByteWurst", fett, schmal)
und zeile.svg (die Unterzeile). make-icons.mjs setzt daraus og-image.jpg.

Warum Pfade: sharp/librsvg lädt keine eingebetteten Schriften und fällt still
auf eine Systemschrift zurück (LESSONS 2026-09-06). Ergebnis immer ansehen.

Aufruf: python3 scripts/wortmarke.py (braucht fonttools)
"""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

WURZEL = Path(__file__).resolve().parent.parent
QUELLE = WURZEL / 'public' / 'fonts' / 'bricolage.woff2'


def setzen(teile, achsen, datei):
    schrift = instantiateVariableFont(TTFont(QUELLE), achsen)
    glyphen = schrift.getGlyphSet()
    zuordnung = schrift.getBestCmap()
    oben = schrift['hhea'].ascent
    unten = -schrift['hhea'].descent
    x = 0
    pfade = []
    for text, farbe in teile:
        stift = SVGPathPen(glyphen)
        for zeichen in text:
            name = zuordnung[ord(zeichen)]
            glyphen[name].draw(TransformPen(stift, (1, 0, 0, -1, x, oben)))
            x += glyphen[name].width
        pfade.append(f'<path fill="{farbe}" d="{stift.getCommands()}"/>')
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {x} {oben + unten}">' + ''.join(pfade) + '</svg>\n'
    ziel = WURZEL / 'scripts' / 'icons' / datei
    ziel.write_text(svg)
    print(f'{ziel.relative_to(WURZEL)}: {x} x {oben + unten}')


setzen([('Byte', '#fffdf8'), ('Wurst', '#f1b92d')], {'wght': 800, 'wdth': 80, 'opsz': 96}, 'wortmarke.svg')
setzen([('Umsatzprognose für Metzgereien', '#fffdf8')], {'wght': 600, 'wdth': 90, 'opsz': 48}, 'zeile.svg')
