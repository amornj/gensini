"use client";

import { CORONARY_SEGMENTS } from "@/data/segments";
import type { Lesion } from "@/lib/types";
import type { StenosisGrade } from "@/lib/types";

interface Props {
  lesions: Lesion[];
  onSegmentClick?: (segmentId: string) => void;
  highlightSegment?: string | null;
}

function getStenosisColor(grade: StenosisGrade | null): string {
  if (!grade) return "none";
  if (grade <= 25) return "#22c55e";   // green
  if (grade <= 50) return "#eab308";   // yellow
  if (grade <= 75) return "#f97316";   // orange
  if (grade <= 90) return "#ef4444";   // red
  if (grade <= 99) return "#b91c1c";   // dark red
  return "#1e1e1e";                    // black = 100%
}

export default function CoronaryDiagram({ lesions, onSegmentClick, highlightSegment }: Props) {
  // Build a map: segmentId → worst stenosis grade
  const segmentStenosis: Record<string, StenosisGrade> = {};
  lesions.forEach((l) => {
    const existing = segmentStenosis[l.segmentId];
    if (!existing || l.stenosisGrade > existing) {
      segmentStenosis[l.segmentId] = l.stenosisGrade;
    }
  });

  function segProps(id: string) {
    const grade = segmentStenosis[id] ?? null;
    const isHighlighted = highlightSegment === id;
    const isAffected = !!segmentStenosis[id];
    return {
      "data-segment": id,
      onClick: onSegmentClick ? () => onSegmentClick(id) : undefined,
      style: {
        cursor: onSegmentClick ? "pointer" : "default",
        stroke: isHighlighted ? "#6366f1" : isAffected ? getStenosisColor(grade) : "#94a3b8",
        strokeWidth: isHighlighted ? 5 : isAffected ? 5 : 3,
        fill: "none",
        transition: "stroke 0.2s, stroke-width 0.2s",
      },
    };
  }

  function labelProps(id: string) {
    const isAffected = !!segmentStenosis[id];
    return {
      fill: isAffected ? "#1e293b" : "#64748b",
      fontWeight: isAffected ? "600" : "400",
      fontSize: "9",
      fontFamily: "system-ui, sans-serif",
    };
  }

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <svg
        viewBox="0 0 320 360"
        className="w-full max-w-sm"
        aria-label="Coronary artery diagram"
      >
        {/* ── Aorta ── */}
        <ellipse cx="160" cy="28" rx="18" ry="12" fill="#fef2f2" stroke="#ef4444" strokeWidth="2" />
        <text x="160" y="32" textAnchor="middle" fontSize="8" fill="#ef4444" fontFamily="system-ui">Aorta</text>

        {/* ── LEFT MAIN ── */}
        {/* LM: from aorta right-side down to bifurcation (patient's left = viewer's right) */}
        <path d="M 178 32 L 190 55 L 200 70" {...segProps("LM")} />
        <text x="196" y="53" {...labelProps("LM")}>LM</text>

        {/* ── LAD system ── */}
        {/* pLAD: bifurcation down along interventricular groove */}
        <path d="M 200 70 L 202 95 L 205 120" {...segProps("pLAD")} />
        <text x="216" y="97" {...labelProps("pLAD")}>pLAD</text>

        {/* mLAD */}
        <path d="M 205 120 L 208 148 L 210 175" {...segProps("mLAD")} />
        <text x="220" y="150" {...labelProps("mLAD")}>mLAD</text>

        {/* dLAD */}
        <path d="M 210 175 L 212 200 L 214 225" {...segProps("dLAD")} />
        <text x="224" y="207" {...labelProps("dLAD")}>dLAD</text>

        {/* D1: off pLAD, branches rightward */}
        <path d="M 203 108 L 225 118 L 245 130" {...segProps("D1")} />
        <text x="237" y="117" {...labelProps("D1")}>D1</text>

        {/* D2: off mLAD, branches rightward */}
        <path d="M 207 158 L 230 166 L 252 174" {...segProps("D2")} />
        <text x="254" y="168" {...labelProps("D2")}>D2</text>

        {/* ── LCx system ── */}
        {/* pLCx: from LM bifurcation, sweeping right around AV groove */}
        <path d="M 200 70 Q 220 75 230 85 Q 240 95 242 112" {...segProps("pLCx")} />
        <text x="240" y="84" {...labelProps("pLCx")}>pLCx</text>

        {/* dLCx */}
        <path d="M 242 112 Q 244 135 245 155 Q 246 170 247 185" {...segProps("dLCx")} />
        <text x="257" y="148" {...labelProps("dLCx")}>dLCx</text>

        {/* OM1: off pLCx */}
        <path d="M 237 98 L 258 105 L 276 118" {...segProps("OM1")} />
        <text x="275" y="106" {...labelProps("OM1")}>OM1</text>

        {/* OM2: off dLCx */}
        <path d="M 243 145 L 265 152 L 282 162" {...segProps("OM2")} />
        <text x="284" y="156" {...labelProps("OM2")}>OM2</text>

        {/* ── RCA system ── */}
        {/* pRCA: from aorta left-side, curves around right AV groove (patient's right = viewer's left) */}
        <path d="M 142 32 L 130 50 L 120 70 L 110 95" {...segProps("pRCA")} />
        <text x="112" y="60" {...labelProps("pRCA")}>pRCA</text>

        {/* mRCA */}
        <path d="M 110 95 L 105 120 L 100 148" {...segProps("mRCA")} />
        <text x="82" y="123" {...labelProps("mRCA")}>mRCA</text>

        {/* dRCA */}
        <path d="M 100 148 L 98 175 L 97 200" {...segProps("dRCA")} />
        <text x="78" y="178" {...labelProps("dRCA")}>dRCA</text>

        {/* PDA: off dRCA, runs in posterior IV groove toward apex */}
        <path d="M 98 195 L 115 215 L 132 232 L 158 245" {...segProps("PDA")} />
        <text x="117" y="245" {...labelProps("PDA")}>PDA</text>

        {/* PLB: off dRCA, lateral */}
        <path d="M 98 200 L 80 215 L 65 228" {...segProps("PLB")} />
        <text x="50" y="218" {...labelProps("PLB")}>PLB</text>

        {/* Heart outline (simplified) */}
        <path
          d="M 230 70 Q 240 100 245 140 Q 250 180 240 220 Q 220 265 160 295 Q 100 265 80 220 Q 70 180 75 140 Q 80 100 90 70"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />

        {/* Legend */}
        <g transform="translate(10, 270)">
          <text x="0" y="0" fontSize="8" fill="#94a3b8" fontFamily="system-ui" fontWeight="600">STENOSIS</text>
          {[
            { grade: "1–25%",   color: "#22c55e", y: 12 },
            { grade: "26–50%",  color: "#eab308", y: 23 },
            { grade: "51–75%",  color: "#f97316", y: 34 },
            { grade: "76–90%",  color: "#ef4444", y: 45 },
            { grade: "91–99%",  color: "#b91c1c", y: 56 },
            { grade: "100%",    color: "#1e1e1e", y: 67 },
          ].map(({ grade, color, y }) => (
            <g key={grade}>
              <line x1="0" y1={y - 4} x2="14" y2={y - 4} stroke={color} strokeWidth="3" />
              <text x="18" y={y} fontSize="7.5" fill="#64748b" fontFamily="system-ui">{grade}</text>
            </g>
          ))}
        </g>

        {/* Click hint */}
        {onSegmentClick && (
          <text x="160" y="350" textAnchor="middle" fontSize="8" fill="#94a3b8" fontFamily="system-ui">
            Tap segment to select
          </text>
        )}
      </svg>

      {/* Segment quick-reference below diagram */}
      <div className="flex flex-wrap gap-1 justify-center max-w-sm">
        {CORONARY_SEGMENTS.map((seg) => {
          const grade = segmentStenosis[seg.id];
          return (
            <button
              key={seg.id}
              onClick={() => onSegmentClick?.(seg.id)}
              className={`text-xs px-2 py-0.5 rounded border transition-all ${
                grade
                  ? "border-transparent text-white font-medium"
                  : highlightSegment === seg.id
                  ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-400"
              }`}
              style={grade ? { backgroundColor: getStenosisColor(grade) } : {}}
              title={`${seg.name} (×${seg.weightingFactor})`}
            >
              {seg.shortName}
            </button>
          );
        })}
      </div>
    </div>
  );
}
