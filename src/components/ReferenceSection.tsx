"use client";

import { useState } from "react";
import { CORONARY_SEGMENTS } from "@/data/segments";
import { STENOSIS_GRADES, STENOSIS_LABELS, STENOSIS_SCORES } from "@/lib/gensini";

export default function ReferenceSection() {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
          Reference Tables
        </span>
        <span className="text-slate-400 text-lg leading-none">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-slate-100">
          <div className="grid sm:grid-cols-2 gap-6 mt-4">
            {/* Stenosis scores */}
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Stenosis Severity Scores
              </h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-3 py-1.5 text-xs font-semibold text-slate-500 rounded-tl">Lumen Reduction</th>
                    <th className="text-right px-3 py-1.5 text-xs font-semibold text-slate-500 rounded-tr">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {STENOSIS_GRADES.map((g) => (
                    <tr key={g} className="hover:bg-slate-50/50">
                      <td className="px-3 py-1.5 text-slate-700">{STENOSIS_LABELS[g]}</td>
                      <td className="px-3 py-1.5 text-right font-mono font-bold text-indigo-700">{STENOSIS_SCORES[g]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Weighting factors */}
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Location Weighting Factors
              </h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-3 py-1.5 text-xs font-semibold text-slate-500 rounded-tl">Segment</th>
                    <th className="text-right px-3 py-1.5 text-xs font-semibold text-slate-500 rounded-tr">Factor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {CORONARY_SEGMENTS.map((seg) => (
                    <tr key={seg.id} className="hover:bg-slate-50/50">
                      <td className="px-3 py-1.5 text-slate-700">{seg.name}</td>
                      <td className="px-3 py-1.5 text-right font-mono font-bold text-indigo-700">×{seg.weightingFactor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interpretation guide */}
          <div className="mt-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Score Interpretation
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { range: "0",     label: "Normal",   badge: "bg-green-100 text-green-800" },
                { range: "1–20",  label: "Mild CAD",     badge: "bg-yellow-100 text-yellow-800" },
                { range: "21–50", label: "Moderate CAD", badge: "bg-orange-100 text-orange-800" },
                { range: ">50",   label: "Severe CAD",   badge: "bg-red-100 text-red-800" },
              ].map(({ range, label, badge }) => (
                <div key={range} className={`rounded-lg px-3 py-2 ${badge}`}>
                  <div className="font-mono font-bold text-lg">{range}</div>
                  <div className="text-xs font-medium mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Citation */}
          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
            <p className="text-xs text-slate-500 leading-relaxed">
              <span className="font-semibold">Reference: </span>
              Gensini GG. A more meaningful scoring system for determining the severity of coronary heart disease.{" "}
              <em>Am J Cardiol.</em> 1983;51(3):606.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
