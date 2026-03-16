import type { CoronarySegment } from "@/lib/types";

// Gensini 1983 — exact weighting factors
export const CORONARY_SEGMENTS: CoronarySegment[] = [
  { id: "LM",       name: "Left Main",                   shortName: "LM",       vessel: "LM",  weightingFactor: 5.0,  svgId: "seg-LM" },
  { id: "pLAD",     name: "Proximal LAD",                shortName: "pLAD",     vessel: "LAD", weightingFactor: 2.5,  svgId: "seg-pLAD" },
  { id: "mLAD",     name: "Mid LAD",                     shortName: "mLAD",     vessel: "LAD", weightingFactor: 1.5,  svgId: "seg-mLAD" },
  { id: "dLAD",     name: "Distal LAD",                  shortName: "dLAD",     vessel: "LAD", weightingFactor: 1.0,  svgId: "seg-dLAD" },
  { id: "D1",       name: "First Diagonal (D1)",         shortName: "D1",       vessel: "LAD", weightingFactor: 1.0,  svgId: "seg-D1" },
  { id: "D2",       name: "Second Diagonal (D2)",        shortName: "D2",       vessel: "LAD", weightingFactor: 0.5,  svgId: "seg-D2" },
  { id: "pLCx",     name: "Proximal LCx",                shortName: "pLCx",     vessel: "LCx", weightingFactor: 2.5,  svgId: "seg-pLCx" },
  { id: "dLCx",     name: "Distal LCx",                  shortName: "dLCx",     vessel: "LCx", weightingFactor: 1.0,  svgId: "seg-dLCx" },
  { id: "OM1",      name: "Obtuse Marginal 1 (OM1)",     shortName: "OM1",      vessel: "LCx", weightingFactor: 1.0,  svgId: "seg-OM1" },
  { id: "OM2",      name: "Obtuse Marginal 2 (OM2)",     shortName: "OM2",      vessel: "LCx", weightingFactor: 0.5,  svgId: "seg-OM2" },
  { id: "pRCA",     name: "Proximal RCA",                shortName: "pRCA",     vessel: "RCA", weightingFactor: 1.0,  svgId: "seg-pRCA" },
  { id: "mRCA",     name: "Mid RCA",                     shortName: "mRCA",     vessel: "RCA", weightingFactor: 1.0,  svgId: "seg-mRCA" },
  { id: "dRCA",     name: "Distal RCA",                  shortName: "dRCA",     vessel: "RCA", weightingFactor: 1.0,  svgId: "seg-dRCA" },
  { id: "PDA",      name: "Posterior Descending (PDA)",  shortName: "PDA",      vessel: "RCA", weightingFactor: 1.0,  svgId: "seg-PDA" },
  { id: "PLB",      name: "Posterolateral Branch (PLB)", shortName: "PLB",      vessel: "RCA", weightingFactor: 0.5,  svgId: "seg-PLB" },
];

export const SEGMENT_MAP = Object.fromEntries(
  CORONARY_SEGMENTS.map((s) => [s.id, s])
);
