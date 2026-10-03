import { useEffect, useId, useRef, useState } from "react";

/**
 * Jock&Jock-Credit für die Fußzeile: die zwei Köpfe aus dem Jock&Jock-Logo
 * gucken über eine Kante, die Finger auf der Kante, wie "Kilroy was here".
 * Die Idee stammt aus der Fußzeile von jockjock.de (components/Gucker.tsx),
 * die Köpfe aus website-jockjock/src/figuren/koepfe.ts.
 *
 * - Die Augen folgen der Maus, Dominik blinzelt ab und zu.
 * - Beim Überfahren oder Fokus ziehen sich beide hoch und sagen "Wir waren's!".
 *   Auf jockjock.de ducken sie sich weg. Hier ist es umgekehrt, ein Credit soll
 *   einladen und nicht fliehen.
 * - Kommt der Credit zum ersten Mal ins Bild, grüßen sie einmal von selbst.
 *   So sieht man es auch auf dem Handy, wo es kein Überfahren gibt.
 * - Farbe und Schrift erbt alles von der Umgebung (currentColor). Der
 *   Aufkleberrand der Köpfe hat die Schriftfarbe, damit passt es auf hellen
 *   wie dunklen Seiten. Die Größe steuert die Schriftgröße (alles in em).
 * - Bei "Bewegung reduzieren" gucken sie nur still, ohne Blick, Blinzeln und Gruß.
 *
 * Eigenständig ohne motion und ohne Icons, damit die Datei in jedes Projekt
 * mit React und Tailwind 4 kopiert werden kann. In allen Projekten gleich,
 * nur der Vorgabewert von `referenz` unterscheidet sich. Vorlage ist
 * website-vhy/src/components/jockjock-credit.tsx, Änderungen dort machen und
 * in die anderen Projekte übernehmen.
 * ?ref= dient der Auswertung auf jockjock.de. Auf dieser Seite passiert dadurch
 * nichts, kein Cookie, kein Skript. noreferrer ist bewusst nicht gesetzt.
 */

const TINTE = "#121212";
const HAUT = "#fff";
const LINIE = 7;
/** Gemeinsames Koordinatensystem beider Köpfe (x, y, Breite, Höhe) */
const BOX = [28, 8, 184, 236] as const;
/** Wie weit die Gesichtszüge Richtung Maus rutschen, und wie stark je Ebene */
const WEIT = 4.2;

type Wer = "fabio" | "dominik";

/** Fabios Haare: flacher Bogen über dem Kopf, oben Zacken (leicht unterschiedlich hoch), die Seiten glatt */
function fabioHaare() {
  const hoehe = [0, 0, 0, 6, 9, 8, 11, 9, 10, 8, 11, 9, 10, 6, 0, 0, 0];
  const r = (v: number) => v.toFixed(1);
  const pts: [number, number][] = [];
  for (let i = 0; i <= 17; i++) {
    const w = Math.PI * (1.03 + (0.94 * i) / 17);
    pts.push([120 + 63 * Math.cos(w), 118 + 50 * Math.sin(w)]);
  }
  let d = `M58 136 L${r(pts[0][0])} ${r(pts[0][1])}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const mx = (x0 + x1) / 2;
    const my = (y0 + y1) / 2;
    const l = Math.hypot(mx - 120, my - 118);
    const h = hoehe[i - 1];
    d += h
      ? ` L${r(mx + ((mx - 120) / l) * h)} ${r(my + ((my - 118) / l) * h)} L${r(x1)} ${r(y1)}`
      : ` L${r(x1)} ${r(y1)}`;
  }
  return d + " L182 136 C176 120 166 108 150 106 Q140 100 130 104 Q120 98 110 104 Q98 99 88 106 C74 110 64 120 58 136 Z";
}

const KOPF = {
  fabio: {
    gesicht: "M64 116 C60 160 68 202 94 224 C106 234 134 234 146 224 C172 202 180 160 176 116 C172 82 68 82 64 116 Z",
    haare: fabioHaare(),
    ohren: ["M64 138 C40 124 36 174 64 174", "M176 138 C200 124 204 174 176 174"],
    bart: "M48 160 C58 170 66 180 84 176 C100 172 110 172 121 172 C132 172 142 172 158 176 C176 180 184 170 194 160 L194 250 L48 250 Z",
    bartDeckung: 0.8,
  },
  dominik: {
    gesicht: "M66 118 C62 160 70 200 94 222 C106 233 134 233 146 222 C170 200 178 160 174 118 C170 84 70 84 66 118 Z",
    haare:
      "M177 138 C179 124 182 112 182 100 C188 91.2 190 77.1 180 68.3 C178 56 166 49 154 50.7 C150 40.2 136 36.6 126 41.9 C120 33.1 104 31.4 96 40.2 C88 34.9 74 38.4 72 49 C60 52.5 56 64.8 62 73.6 C52 82.4 56 96.5 62 102 C62 114 62 126 63 138 L68 136 C68 122 72 112 82 108 C100 104 140 104 158 108 C168 112 172 122 172 136 Z",
    ohren: ["M66 140 C46 128 40 170 66 172", "M174 140 C194 128 200 170 174 172"],
    bart: "M50 150 C60 160 64 176 80 182 C92 186 104 180 121 180 C138 180 150 186 162 182 C176 176 180 160 190 150 L190 250 L50 250 Z",
    bartDeckung: 1,
  },
} as const;

/**
 * Fabios rote Cap, über die Haare gesetzt: flache Krone mit Knopf und weißem
 * Schriftzug, der Schirm zeigt ein wenig nach links und endet über den Brauen.
 */
const CAP_ROT = "#F2401D";
const CAP = {
  krone: "M58 102 C56 64 86 46 120 46 C154 46 184 64 182 102 Z",
  logo: "M103 77 C106 68 114 67 112 74 C110 81 119 82 123 73 C125 69 130 69 131 75",
  schirm: "M182 98 C150 104 96 104 64 100 C50 98 36 96 33 102 C30 110 50 116 86 116 C124 116 164 112 182 98 Z",
};

function Strich({ d, breite = LINIE }: { d: string; breite?: number }) {
  return <path d={d} fill="none" stroke={TINTE} strokeWidth={breite} strokeLinecap="round" strokeLinejoin="round" />;
}
function Flaeche({ d, fill = HAUT }: { d: string; fill?: string }) {
  return <path d={d} fill={fill} stroke={TINTE} strokeWidth={LINIE} strokeLinecap="round" strokeLinejoin="round" />;
}

/** Offenes Auge, das blinzelt (SMIL, damit die Datei ohne eigenes CSS auskommt) */
function Auge({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={6.5} fill={TINTE}>
        <animateTransform
          attributeName="transform"
          type="scale"
          values="1 1;1 1;1 0.12;1 1;1 1"
          keyTimes="0;0.93;0.95;0.97;1"
          dur="5.2s"
          repeatCount="indefinite"
        />
      </circle>
    </g>
  );
}

/** Ein Kopf, auch einzeln nutzbar (Impressum: components/dominik-bowl.tsx). `id` muss auf der Seite eindeutig sein. */
export function Kopf({ wer, id }: { wer: Wer; id: string }) {
  const k = KOPF[wer];
  const clip = `${id}${wer}c`;
  const raster = `${id}${wer}r`;
  return (
    <svg data-kopf viewBox={BOX.join(" ")} className="block h-auto w-full overflow-visible" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={raster} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
          <circle cx="2.5" cy="2.5" r="1.25" fill={TINTE} />
        </pattern>
        <clipPath id={clip}>
          <path d={k.gesicht} />
        </clipPath>
      </defs>
      {/* Aufkleberrand in der Schriftfarbe */}
      {[...k.ohren.map((d) => `${d} Z`), k.gesicht, k.haare, ...(wer === "fabio" ? [CAP.krone, CAP.schirm] : [])].map((d) => (
        <path key={d} d={d} fill="currentColor" stroke="currentColor" strokeWidth={16} strokeLinejoin="round" />
      ))}
      <Flaeche d={k.ohren[0]} />
      <Flaeche d={k.ohren[1]} />
      {wer === "fabio" && (
        <>
          <Strich d="M52 148 C56 144 60 150 58 158" breite={4.5} />
          <Strich d="M188 148 C184 144 180 150 182 158" breite={4.5} />
        </>
      )}
      {wer === "dominik" && (
        <>
          {/* Zwei winzige Ohrringe, Lage wie OHRRINGE in koepfe.ts */}
          <circle cx={60.8} cy={163.5} r={1.7} fill={TINTE} />
          <circle cx={179.2} cy={163.5} r={1.7} fill={TINTE} />
        </>
      )}
      <path d={k.gesicht} fill={HAUT} />
      <path d={k.bart} fill={`url(#${raster})`} clipPath={`url(#${clip})`} opacity={k.bartDeckung} />
      <Strich d={k.gesicht} />
      {/* Die Ebenen rutschen unterschiedlich weit Richtung Maus, die Haare dagegen */}
      <g data-tiefe="-0.35">
        <Flaeche d={k.haare} fill={TINTE} />
        {wer === "dominik" && (
          <path d="M174 87.7 C178 75.4 170 64.8 158 63 M152 71.8 C148 59.5 138 52.5 126 52.5 M128 78.9 C122 64.8 108 56 94 54.2 M100 84.2 C92 71.8 80 64.8 68 66.6" fill="none" stroke={HAUT} strokeWidth={3.5} strokeLinecap="round" />
        )}
      </g>
      {wer === "fabio" ? (
        <>
          <g data-tiefe="0.9">
            <Strich d="M82 124 C90 114 102 114 110 120" breite={8} />
            <Strich d="M130 120 C138 114 150 114 158 124" breite={8} />
            <Strich d="M80 141 L72 137 M80 150 L72 152" breite={4.5} />
            <Strich d="M160 141 L168 137 M160 150 L168 152" breite={4.5} />
          </g>
          <g data-tiefe="1">
            <Strich d="M86 147 C92 138 104 138 110 146" />
            <Strich d="M130 146 C136 138 148 138 154 147" />
          </g>
          <g data-tiefe="1.15">
            <Strich d="M118 148 C116 160 110 170 118 175 C122 177 128 175 130 172" breite={6} />
          </g>
          <g data-tiefe="0.7">
            <Flaeche d="M84 182 C106 190 134 190 158 182 C154 206 138 218 121 218 C104 218 88 206 84 182 Z" />
            <Strich d="M89 194 C108 201 134 201 153 194" breite={4.5} />
          </g>
          {/* Cap zuletzt und mit den Haaren gegen die Maus, so rutschen die Brauen beim Mitschauen unter den Schirm */}
          <g data-tiefe="-0.35">
            <Flaeche d={CAP.krone} fill={CAP_ROT} />
            <circle cx={120} cy={45} r={4.5} fill={TINTE} />
            <path d={CAP.logo} fill="none" stroke={HAUT} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
            <Flaeche d={CAP.schirm} fill={CAP_ROT} />
          </g>
        </>
      ) : (
        <>
          <g data-tiefe="0.9">
            <Strich d="M84 128 C92 121 104 121 111 126" breite={8} />
            <Strich d="M131 126 C138 121 150 121 158 128" breite={8} />
          </g>
          <g data-tiefe="1">
            <Auge x={98} y={145} />
            <Auge x={144} y={145} />
          </g>
          <g data-tiefe="1.15">
            <Strich d="M122 150 C118 164 113 174 124 178" breite={6} />
          </g>
          <g data-tiefe="0.7">
            <Flaeche d="M93 189 C108 195 134 195 149 187 C146 200 136 209 121 209 C106 209 96 201 93 189 Z" fill={TINTE} />
            <path d="M99 192 C112 197 132 197 144 191 L142 197 C131 201 112 201 101 197 Z" fill={HAUT} />
          </g>
        </>
      )}
    </svg>
  );
}

/** Drei Fingerkuppen, die sich über die Kante krallen */
function Hand({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 30 12" aria-hidden="true" className={`absolute bottom-0 w-[1.15em] overflow-visible ${className}`}>
      <path
        d="M2 12 V6.5 a4 4 0 0 1 8 0 V12 M10 12 V5.5 a4 4 0 0 1 8 0 V12 M18 12 V6.5 a4 4 0 0 1 8 0 V12"
        fill={HAUT}
        stroke={TINTE}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function JockJockCredit({ className = "", referenz = "bytewurst" }: { className?: string; referenz?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const wurzel = useRef<HTMLAnchorElement>(null);
  const [hallo, setHallo] = useState(false);

  useEffect(() => {
    const a = wurzel.current;
    if (!a) return;
    const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const svgs = Array.from(a.querySelectorAll<SVGSVGElement>("svg[data-kopf]"));
    if (ruhig) {
      svgs.forEach((s) => s.pauseAnimations());
      return;
    }

    // Einmal grüßen, wenn der Credit zum ersten Mal ganz im Bild ist
    const uhren: number[] = [];
    let sichtbar = false;
    let gegruesst = false;
    const beobachter = new IntersectionObserver(
      ([e]) => {
        sichtbar = e.isIntersecting;
        if (sichtbar && !gegruesst) {
          gegruesst = true;
          uhren.push(window.setTimeout(() => setHallo(true), 450), window.setTimeout(() => setHallo(false), 2800));
        }
      },
      { threshold: 0.9 },
    );
    beobachter.observe(a);

    // Blick zur Maus: nur transform-Attribute, nur solange sich etwas bewegt
    const koepfe = svgs.map((svg) => ({
      svg,
      gruppen: Array.from(svg.querySelectorAll<SVGGElement>("g[data-tiefe]")).map((g) => ({ g, t: Number(g.dataset.tiefe) })),
      ziel: { x: 0, y: 0 },
      jetzt: { x: 0, y: 0 },
    }));
    let zeiger: { x: number; y: number } | null = null;
    let rahmen = 0;
    const schritt = () => {
      rahmen = 0;
      let weiter = false;
      for (const k of koepfe) {
        if (zeiger) {
          const r = k.svg.getBoundingClientRect();
          const dx = zeiger.x - (r.left + ((120 - BOX[0]) / BOX[2]) * r.width);
          const dy = zeiger.y - (r.top + ((150 - BOX[1]) / BOX[3]) * r.height);
          const d = Math.hypot(dx, dy) || 1;
          const staerke = Math.min(1, d / (r.width * 0.9));
          k.ziel = { x: (dx / d) * WEIT * staerke, y: (dy / d) * WEIT * 0.75 * staerke };
        }
        k.jetzt.x += (k.ziel.x - k.jetzt.x) * 0.16;
        k.jetzt.y += (k.ziel.y - k.jetzt.y) * 0.16;
        for (const { g, t } of k.gruppen) {
          g.setAttribute("transform", `translate(${(k.jetzt.x * t).toFixed(2)} ${(k.jetzt.y * t).toFixed(2)})`);
        }
        if (Math.abs(k.ziel.x - k.jetzt.x) + Math.abs(k.ziel.y - k.jetzt.y) > 0.02) weiter = true;
      }
      zeiger = null;
      if (weiter) rahmen = requestAnimationFrame(schritt);
    };
    const bewegt = (e: PointerEvent) => {
      if (!sichtbar) return;
      zeiger = { x: e.clientX, y: e.clientY };
      if (!rahmen) rahmen = requestAnimationFrame(schritt);
    };
    window.addEventListener("pointermove", bewegt, { passive: true });

    return () => {
      beobachter.disconnect();
      uhren.forEach((u) => window.clearTimeout(u));
      window.removeEventListener("pointermove", bewegt);
      cancelAnimationFrame(rahmen);
    };
  }, []);

  return (
    <a
      ref={wurzel}
      href={`https://jockjock.de/?ref=${referenz}`}
      target="_blank"
      rel="noopener"
      aria-label="Website von Jock&Jock (öffnet in neuem Tab)"
      data-hallo={hallo || undefined}
      className={`group/jj inline-flex flex-col items-center leading-none ${className}`}
    >
      {/*
        Die Bühne ist so hoch, wie die Köpfe im Ruhezustand herausgucken. Der
        clip-path schneidet nur unten an der Kante ab, nach oben dürfen sie
        beim Hochziehen aus der Bühne hinaus.
      */}
      <span aria-hidden="true" className="relative block h-[2.45em] w-[6.3em] [clip-path:inset(-4em_-3em_0_-3em)]">
        <span className="absolute top-0 left-[0.15em] block w-[2.9em] -rotate-6 transition-[translate,rotate] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/jj:-translate-y-[1.3em] group-hover/jj:-rotate-[11deg] group-focus-visible/jj:-translate-y-[1.3em] group-focus-visible/jj:-rotate-[11deg] group-data-[hallo]/jj:-translate-y-[1.3em] group-data-[hallo]/jj:-rotate-[11deg] motion-reduce:transition-none">
          <Kopf wer="fabio" id={id} />
        </span>
        <span className="absolute top-0 right-[0.15em] block w-[2.9em] rotate-[5deg] transition-[translate,rotate] delay-75 duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/jj:-translate-y-[1.35em] group-hover/jj:rotate-[9deg] group-focus-visible/jj:-translate-y-[1.35em] group-focus-visible/jj:rotate-[9deg] group-data-[hallo]/jj:-translate-y-[1.35em] group-data-[hallo]/jj:rotate-[9deg] motion-reduce:transition-none">
          <Kopf wer="dominik" id={id} />
        </span>
      </span>

      {/* Die Kante mit den Fingern darauf */}
      <span aria-hidden="true" className="relative block h-[1.5px] w-[7.1em] rounded-full bg-current">
        <Hand className="left-[0.05em]" />
        <Hand className="right-[0.05em] -scale-x-100" />
      </span>

      {/* Sprechblase beim Hochziehen */}
      <span aria-hidden="true" className="pointer-events-none relative block h-0 w-[6.3em]">
        <span className="absolute right-[-1.6em] bottom-[4.3em] origin-bottom-left scale-0 rounded-[0.55em] border-[1.5px] border-current bg-white px-[0.5em] py-[0.3em] text-[0.78em] font-bold whitespace-nowrap text-[#121212] transition-[scale] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/jj:scale-100 group-hover/jj:delay-200 group-focus-visible/jj:scale-100 group-focus-visible/jj:delay-200 group-data-[hallo]/jj:scale-100 group-data-[hallo]/jj:delay-200 motion-reduce:transition-none">
          Wir waren&apos;s!
        </span>
      </span>

      <span className="mt-[0.5em] flex flex-col items-center gap-[0.3em]">
        <span className="text-[0.62em] font-bold tracking-[0.2em] uppercase opacity-70">Website von</span>
        <span className="relative font-bold">
          Jock&amp;Jock
          <svg
            viewBox="0 0 12 12"
            aria-hidden="true"
            className="absolute top-1/2 left-full ml-[0.3em] h-[0.7em] w-[0.7em] -translate-x-1 -translate-y-1/2 opacity-0 transition-[opacity,translate] duration-300 group-hover/jj:translate-x-0 group-hover/jj:opacity-100 group-focus-visible/jj:translate-x-0 group-focus-visible/jj:opacity-100"
          >
            <path d="M3 9 L9 3 M4.2 3 H9 V7.8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </span>
    </a>
  );
}
