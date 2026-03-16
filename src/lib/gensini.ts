import type { Lesion, StenosisGrade, GensiniResult } from "@/lib/types";
import { SEGMENT_MAP } from "@/data/segments";

// Gensini 1983 — stenosis severity scores (exact)
export const STENOSIS_SCORES: Record<StenosisGrade, number> = {
  25:  1,
  50:  2,
  75:  4,
  90:  8,
  99:  16,
  100: 32,
};

export const STENOSIS_LABELS: Record<StenosisGrade, string> = {
  25:  "1–25%",
  50:  "26–50%",
  75:  "51–75%",
  90:  "76–90%",
  99:  "91–99%",
  100: "100% (Total Occlusion)",
};

export const STENOSIS_GRADES: StenosisGrade[] = [25, 50, 75, 90, 99, 100];

export function getSeverityScore(grade: StenosisGrade): number {
  return STENOSIS_SCORES[grade];
}

export function calculateLesionScore(
  segmentId: string,
  stenosisGrade: StenosisGrade
): number {
  const segment = SEGMENT_MAP[segmentId];
  if (!segment) return 0;
  return getSeverityScore(stenosisGrade) * segment.weightingFactor;
}

export function buildLesion(
  id: string,
  segmentId: string,
  stenosisGrade: StenosisGrade
): Lesion {
  const segment = SEGMENT_MAP[segmentId];
  const severityScore = getSeverityScore(stenosisGrade);
  const weightingFactor = segment.weightingFactor;
  return {
    id,
    segmentId,
    stenosisGrade,
    severityScore,
    weightingFactor,
    lesionScore: severityScore * weightingFactor,
  };
}

export function getInterpretation(score: number): {
  key: GensiniResult["interpretation"];
  text: string;
} {
  if (score === 0)  return { key: "normal",   text: "Normal coronary arteries" };
  if (score <= 20)  return { key: "mild",     text: "Mild CAD" };
  if (score <= 50)  return { key: "moderate", text: "Moderate CAD" };
  return             { key: "severe",    text: "Severe CAD" };
}

export function calculateGensini(lesions: Lesion[]): GensiniResult {
  const totalScore = lesions.reduce((sum, l) => sum + l.lesionScore, 0);
  const { key, text } = getInterpretation(totalScore);

  // Count distinct vessels (LM counts as both LAD and LCx territory)
  const vessels = new Set<string>();
  lesions.forEach((l) => {
    const seg = SEGMENT_MAP[l.segmentId];
    if (seg) {
      if (seg.vessel === "LM") {
        vessels.add("LAD");
        vessels.add("LCx");
      } else {
        vessels.add(seg.vessel);
      }
    }
  });

  return {
    lesions,
    totalScore,
    interpretation: key,
    interpretationText: text,
    vesselCount: vessels.size,
  };
}

export function generateLesionId(): string {
  return Math.random().toString(36).slice(2, 9);
}
