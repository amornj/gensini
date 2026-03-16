"use client";

import { SEGMENT_MAP } from "@/data/segments";
import { STENOSIS_LABELS } from "@/lib/gensini";
import type { Lesion } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Props {
  lesions: Lesion[];
  onRemove: (id: string) => void;
}

function stenosisColor(grade: number): string {
  if (grade <= 25) return "bg-green-100 text-green-800";
  if (grade <= 50) return "bg-yellow-100 text-yellow-800";
  if (grade <= 75) return "bg-orange-100 text-orange-800";
  if (grade <= 90) return "bg-red-100 text-red-800";
  if (grade <= 99) return "bg-red-200 text-red-900";
  return "bg-slate-800 text-white";
}

export default function LesionTable({ lesions, onRemove }: Props) {
  if (lesions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-sm">
        <div className="text-slate-400 text-sm">No lesions added yet.</div>
        <div className="text-slate-300 text-xs mt-1">Use the form above to add coronary lesions.</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
          Lesion List
          <span className="ml-2 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5">
            {lesions.length}
          </span>
        </h2>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="text-xs font-semibold text-slate-500">#</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Segment</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Stenosis</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 text-right">Severity</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 text-right">Weight</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 text-right">Score</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {lesions.map((lesion, i) => {
              const seg = SEGMENT_MAP[lesion.segmentId];
              return (
                <TableRow key={lesion.id} className="hover:bg-slate-50/50">
                  <TableCell className="text-xs text-slate-400 font-mono">{i + 1}</TableCell>
                  <TableCell className="text-sm font-medium text-slate-800">
                    <div>{seg?.name ?? lesion.segmentId}</div>
                    <div className="text-xs text-slate-400">{seg?.vessel}</div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${stenosisColor(lesion.stenosisGrade)}`}>
                      {STENOSIS_LABELS[lesion.stenosisGrade]}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600 text-right font-mono">{lesion.severityScore}</TableCell>
                  <TableCell className="text-sm text-slate-600 text-right font-mono">×{lesion.weightingFactor}</TableCell>
                  <TableCell className="text-sm font-bold text-indigo-700 text-right font-mono">{lesion.lesionScore}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => onRemove(lesion.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors p-1 rounded"
                      aria-label="Remove lesion"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
