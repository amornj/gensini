"use client";

import { useState } from "react";
import { CORONARY_SEGMENTS } from "@/data/segments";
import { STENOSIS_GRADES, STENOSIS_LABELS, STENOSIS_SCORES } from "@/lib/gensini";
import type { StenosisGrade } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  onAdd: (segmentId: string, grade: StenosisGrade) => void;
  preselectedSegmentId?: string | null;
  onClearPreselect?: () => void;
}

export default function LesionForm({ onAdd, preselectedSegmentId, onClearPreselect }: Props) {
  const [segmentId, setSegmentId] = useState<string>(preselectedSegmentId ?? "");
  const [grade, setGrade] = useState<StenosisGrade | "">("");

  // Sync preselection
  if (preselectedSegmentId && preselectedSegmentId !== segmentId) {
    setSegmentId(preselectedSegmentId);
    onClearPreselect?.();
  }

  const selectedSegment = CORONARY_SEGMENTS.find((s) => s.id === segmentId);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">Add Lesion</h2>
      <div className="flex flex-col gap-3">
        {/* Segment */}
        <div className="flex-1 min-w-0">
          <label className="text-xs font-medium text-slate-500 mb-1 block">Coronary Segment</label>
          <Select value={segmentId} onValueChange={(v) => setSegmentId(v ?? "")}>
            <SelectTrigger className="w-full text-sm">
              <SelectValue placeholder="Select segment…" />
            </SelectTrigger>
            <SelectContent>
              {(["LM", "LAD", "LCx", "RCA"] as const).map((vessel) => (
                <div key={vessel}>
                  <div className="px-2 py-1 text-xs font-semibold text-slate-400 uppercase bg-slate-50">
                    {vessel === "LM" ? "Left Main" : vessel === "LAD" ? "Left Anterior Descending" : vessel === "LCx" ? "Left Circumflex" : "Right Coronary Artery"}
                  </div>
                  {CORONARY_SEGMENTS.filter((s) => s.vessel === vessel).map((seg) => (
                    <SelectItem key={seg.id} value={seg.id}>
                      <span className="font-medium">{seg.name}</span>
                      <span className="ml-2 text-slate-400 text-xs">×{seg.weightingFactor}</span>
                    </SelectItem>
                  ))}
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stenosis — 6 buttons, click to add in one step */}
        <div className="flex-1 min-w-0">
          <label className="text-xs font-medium text-slate-500 mb-1 block">Stenosis Degree — tap to add</label>
          <div className="grid grid-cols-3 gap-2">
            {STENOSIS_GRADES.map((g) => {
              const isSelected = grade === g;
              const scoreVal = STENOSIS_SCORES[g];
              const preview = selectedSegment ? `= ${scoreVal * selectedSegment.weightingFactor}` : "";
              return (
                <button
                  key={g}
                  onClick={() => {
                    if (segmentId) {
                      // One-step: select + add immediately
                      onAdd(segmentId, g);
                    } else {
                      // No segment yet — just highlight
                      setGrade(g);
                    }
                  }}
                  className={`relative flex flex-col items-center justify-center rounded-lg border-2 px-2 py-2.5 text-sm font-semibold transition-all
                    ${isSelected
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-200"
                      : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/50"
                    }
                    ${!segmentId ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                  disabled={false}
                >
                  <span className="text-sm font-bold">{STENOSIS_LABELS[g]}</span>
                  <span className="text-xs text-slate-400 mt-0.5">
                    score: {scoreVal} {preview && <span className="font-semibold text-indigo-600">{preview}</span>}
                  </span>
                </button>
              );
            })}
          </div>
          {!segmentId && (
            <p className="text-xs text-amber-600 mt-1.5">← Select a segment first</p>
          )}
        </div>
      </div>
    </div>
  );
}
