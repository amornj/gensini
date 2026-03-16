"use client";

import { useState, useCallback } from "react";
import LesionForm from "./LesionForm";
import LesionTable from "./LesionTable";
import ScoreSummary from "./ScoreSummary";
import CoronaryDiagram from "./CoronaryDiagram";
import ReferenceSection from "./ReferenceSection";
import { buildLesion, calculateGensini, generateLesionId } from "@/lib/gensini";
import { SEGMENT_MAP } from "@/data/segments";
import type { Lesion, StenosisGrade } from "@/lib/types";

// Common quick-add presets
const PRESETS = [
  {
    label: "LM 90%",
    lesions: [{ segmentId: "LM", grade: 90 as StenosisGrade }],
  },
  {
    label: "3-Vessel",
    lesions: [
      { segmentId: "pLAD", grade: 75 as StenosisGrade },
      { segmentId: "pLCx", grade: 75 as StenosisGrade },
      { segmentId: "pRCA", grade: 75 as StenosisGrade },
    ],
  },
  {
    label: "STEMI (pLAD 100%)",
    lesions: [{ segmentId: "pLAD", grade: 100 as StenosisGrade }],
  },
  {
    label: "Diffuse LAD",
    lesions: [
      { segmentId: "pLAD", grade: 75 as StenosisGrade },
      { segmentId: "mLAD", grade: 75 as StenosisGrade },
      { segmentId: "dLAD", grade: 50 as StenosisGrade },
    ],
  },
];

export default function Calculator() {
  const [lesions, setLesions] = useState<Lesion[]>([]);
  const [preselectedSegment, setPreselectedSegment] = useState<string | null>(null);
  const [exportMsg, setExportMsg] = useState<string>("");

  const result = calculateGensini(lesions);

  const handleAdd = useCallback((segmentId: string, grade: StenosisGrade) => {
    const id = generateLesionId();
    setLesions((prev) => [...prev, buildLesion(id, segmentId, grade)]);
  }, []);

  const handleRemove = useCallback((id: string) => {
    setLesions((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const handleReset = () => {
    if (lesions.length === 0) return;
    if (window.confirm("Reset all lesions?")) setLesions([]);
  };

  const handleExport = () => {
    const lines = [
      "GENSINI SCORE REPORT",
      "====================",
      `Date: ${new Date().toLocaleDateString()}`,
      "",
      "LESIONS:",
      ...lesions.map((l, i) => {
        const seg = SEGMENT_MAP[l.segmentId];
        return `  ${i + 1}. ${seg?.name ?? l.segmentId} — Stenosis ${l.stenosisGrade}% → Score: ${l.severityScore} × ${l.weightingFactor} = ${l.lesionScore}`;
      }),
      "",
      `TOTAL GENSINI SCORE: ${result.totalScore}`,
      `INTERPRETATION: ${result.interpretationText}`,
      `VESSELS: ${result.vesselCount}`,
      "",
      "Reference: Gensini GG. Am J Cardiol. 1983;51(3):606.",
    ];

    const text = lines.join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setExportMsg("Copied to clipboard!");
      setTimeout(() => setExportMsg(""), 2500);
    }).catch(() => {
      // Fallback: open in a new window
      const win = window.open("", "_blank");
      if (win) { win.document.write(`<pre>${text}</pre>`); }
    });
  };

  const handlePreset = (preset: typeof PRESETS[0]) => {
    const newLesions = preset.lesions.map(({ segmentId, grade }) =>
      buildLesion(generateLesionId(), segmentId, grade)
    );
    setLesions((prev) => [...prev, ...newLesions]);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Gensini Score Calculator</h1>
            <p className="text-xs text-slate-500 hidden sm:block">
              Coronary artery disease severity · Gensini 1983
            </p>
          </div>
          <div className="flex items-center gap-2">
            {exportMsg && (
              <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded animate-in fade-in">
                {exportMsg}
              </span>
            )}
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">
              Medical Calculator
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-5">
        <div className="grid lg:grid-cols-3 gap-5">
          {/* ── Left column: form + lesions ── */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Quick presets */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs font-medium text-slate-500">Quick add:</span>
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => handlePreset(p)}
                  className="text-xs px-3 py-1.5 rounded-full border border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition font-medium"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Add lesion form */}
            <LesionForm
              onAdd={handleAdd}
              preselectedSegmentId={preselectedSegment}
              onClearPreselect={() => setPreselectedSegment(null)}
            />

            {/* Lesion list */}
            <LesionTable lesions={lesions} onRemove={handleRemove} />

            {/* Reference (collapsible) */}
            <ReferenceSection />
          </div>

          {/* ── Right column: score + diagram ── */}
          <div className="flex flex-col gap-4">
            {/* Score summary — sticky on desktop */}
            <div className="lg:sticky lg:top-20">
              <ScoreSummary
                result={result}
                onReset={handleReset}
                onExport={handleExport}
              />

              {/* Coronary diagram */}
              <div className="mt-4 bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
                  Coronary Diagram
                </h2>
                <CoronaryDiagram
                  lesions={lesions}
                  onSegmentClick={(id) => setPreselectedSegment(id)}
                  highlightSegment={preselectedSegment}
                />
                <p className="text-xs text-slate-400 text-center mt-2">
                  Segments color by stenosis severity · tap to pre-select
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 pt-6 border-t border-slate-200 text-center text-xs text-slate-400 space-y-1">
          <p>
            Scoring based on: Gensini GG. <em>Am J Cardiol.</em> 1983;51(3):606.
          </p>
          <p className="text-slate-300">
            For educational use only. Not a substitute for clinical judgment.
          </p>
        </footer>
      </main>
    </div>
  );
}
