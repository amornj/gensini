"use client";

import type { GensiniResult } from "@/lib/types";

interface Props {
  result: GensiniResult;
  onReset: () => void;
  onExport: () => void;
}

const INTERPRETATION_STYLES: Record<GensiniResult["interpretation"], {
  bg: string; border: string; text: string; badge: string; dot: string;
}> = {
  normal:   { bg: "bg-green-50",  border: "border-green-200", text: "text-green-800",  badge: "bg-green-100 text-green-800",  dot: "bg-green-500"  },
  mild:     { bg: "bg-yellow-50", border: "border-yellow-200",text: "text-yellow-800", badge: "bg-yellow-100 text-yellow-800",dot: "bg-yellow-500" },
  moderate: { bg: "bg-orange-50", border: "border-orange-200",text: "text-orange-800", badge: "bg-orange-100 text-orange-800",dot: "bg-orange-500" },
  severe:   { bg: "bg-red-50",    border: "border-red-200",   text: "text-red-800",    badge: "bg-red-100 text-red-800",      dot: "bg-red-500"    },
};

const VESSEL_LABELS: Record<number, string> = {
  0: "No vessels affected",
  1: "Single-vessel disease",
  2: "Two-vessel disease",
  3: "Three-vessel disease",
};

export default function ScoreSummary({ result, onReset, onExport }: Props) {
  const style = INTERPRETATION_STYLES[result.interpretation];

  return (
    <div className={`rounded-xl border-2 ${style.border} ${style.bg} p-5 shadow-sm`}>
      {/* Score */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Total Gensini Score
          </div>
          <div className={`text-6xl font-black tracking-tight ${style.text}`}>
            {result.totalScore}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${style.badge}`}>
            <span className={`w-2 h-2 rounded-full ${style.dot}`} />
            {result.interpretationText}
          </span>
          <div className="text-xs text-slate-500 text-right">
            {result.lesions.length} lesion{result.lesions.length !== 1 ? "s" : ""}
          </div>
          <div className="text-xs text-slate-500 text-right">
            {VESSEL_LABELS[Math.min(result.vesselCount, 3)] ?? `${result.vesselCount}-vessel disease`}
          </div>
        </div>
      </div>

      {/* Score bar */}
      {result.totalScore > 0 && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>0</span>
            <span>20 · Mild</span>
            <span>50 · Moderate</span>
            <span>50+</span>
          </div>
          <div className="h-2 bg-white rounded-full overflow-hidden border border-slate-200">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min((result.totalScore / 100) * 100, 100)}%`,
                background: result.interpretation === "normal"   ? "#22c55e" :
                            result.interpretation === "mild"     ? "#eab308" :
                            result.interpretation === "moderate" ? "#f97316" : "#ef4444",
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-300 mt-0.5">
            <span>|</span>
            <span style={{ marginLeft: "20%" }}>|</span>
            <span style={{ marginLeft: "10%" }}>|</span>
            <span>&gt;100 severe</span>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={onExport}
          disabled={result.lesions.length === 0}
          className="flex-1 text-sm font-medium px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Export Report
        </button>
        <button
          onClick={onReset}
          disabled={result.lesions.length === 0}
          className="flex-1 text-sm font-medium px-3 py-2 rounded-lg border border-red-200 bg-white hover:bg-red-50 text-red-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Reset All
        </button>
      </div>
    </div>
  );
}
