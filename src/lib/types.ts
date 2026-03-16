export type StenosisGrade = 25 | 50 | 75 | 90 | 99 | 100;

export interface CoronarySegment {
  id: string;
  name: string;
  shortName: string;
  vessel: "LAD" | "LCx" | "RCA" | "LM";
  weightingFactor: number;
  svgId?: string;
}

export interface Lesion {
  id: string;
  segmentId: string;
  stenosisGrade: StenosisGrade;
  severityScore: number;
  weightingFactor: number;
  lesionScore: number;
}

export interface GensiniResult {
  lesions: Lesion[];
  totalScore: number;
  interpretation: "normal" | "mild" | "moderate" | "severe";
  interpretationText: string;
  vesselCount: number;
}
