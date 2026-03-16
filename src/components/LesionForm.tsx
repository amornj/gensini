"use client";

import { useState } from "react";
import { CORONARY_SEGMENTS } from "@/data/segments";
import { STENOSIS_GRADES, STENOSIS_LABELS, STENOSIS_SCORES } from "@/lib/gensini";
import type { StenosisGrade } from "@/lib/types";
import { Button } from "@/components/ui/button";
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
  const selectedScore = grade !== "" ? STENOSIS_SCORES[grade] : null;

  function handleAdd() {
    if (!segmentId || grade === "") return;
    onAdd(segmentId, grade as StenosisGrade);
    setGrade("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleAdd();
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm" onKeyDown={handleKeyDown}>
      <h2 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">Add Lesion</h2>
      <div className="flex flex-col sm:flex-row gap-3">
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

        {/* Stenosis */}
        <div className="flex-1 min-w-0">
          <label className="text-xs font-medium text-slate-500 mb-1 block">Stenosis Degree</label>
          <Select value={grade !== "" ? String(grade) : ""} onValueChange={(v) => setGrade(Number(v) as StenosisGrade)}>
            <SelectTrigger className="w-full text-sm">
              <SelectValue placeholder="Select stenosis…" />
            </SelectTrigger>
            <SelectContent>
              {STENOSIS_GRADES.map((g) => (
                <SelectItem key={g} value={String(g)}>
                  <span>{STENOSIS_LABELS[g]}</span>
                  <span className="ml-2 text-slate-400 text-xs">score: {STENOSIS_SCORES[g]}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Preview + Add */}
        <div className="flex flex-col justify-end gap-1">
          {selectedSegment && grade !== "" && (
            <div className="text-xs text-slate-500 text-right">
              Score: <span className="font-bold text-slate-800">
                {selectedScore} × {selectedSegment.weightingFactor} = {(selectedScore! * selectedSegment.weightingFactor)}
              </span>
            </div>
          )}
          <Button
            onClick={handleAdd}
            disabled={!segmentId || grade === ""}
            className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[100px]"
          >
            + Add Lesion
          </Button>
        </div>
      </div>
    </div>
  );
}
