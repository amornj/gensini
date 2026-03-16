# Gensini Score Calculator — Build Spec

## Overview
A webapp to semiquantify the extent of coronary ischemia using the Gensini scoring system. 
This is a **medical calculator** — accuracy is paramount. Every scoring value must match the original Gensini 1983 paper.

## Tech Stack
- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** components
- No backend needed — pure client-side calculation
- Deploy to Vercel

## Gensini Scoring System (MUST BE EXACT)

### Stenosis Severity Score
| Reduction of Lumen Diameter | Severity Score |
|---|---|
| 1–25% | 1 |
| 26–50% | 2 |
| 51–75% | 4 |
| 76–90% | 8 |
| 91–99% | 16 |
| 100% (total occlusion) | 32 |

### Location Weighting Factors
| Coronary Segment | Weighting Factor |
|---|---|
| Left Main (LM) | 5.0 |
| Proximal LAD | 2.5 |
| Mid LAD | 1.5 |
| Distal LAD | 1.0 |
| First Diagonal (D1) | 1.0 |
| Second Diagonal (D2) | 0.5 |
| Proximal LCx | 2.5 |
| Distal LCx | 1.0 |
| Obtuse Marginal (OM1) | 1.0 |
| Second Obtuse Marginal (OM2) | 0.5 |
| Proximal RCA | 1.0 |
| Mid RCA | 1.0 |
| Distal RCA | 1.0 |
| PDA (Posterior Descending Artery) | 1.0 |
| Posterolateral Branch (PLB) | 0.5 |

### Calculation
For each lesion:
```
Lesion Score = Severity Score × Location Weighting Factor
```
Total Gensini Score = Sum of all lesion scores

### Interpretation
| Score Range | Interpretation |
|---|---|
| 0 | Normal coronary arteries |
| 1–20 | Mild CAD |
| 21–50 | Moderate CAD |
| >50 | Severe CAD |

## UI Requirements

### Layout
- Clean, modern medical calculator UI
- Mobile-responsive (cardiologists use this in cath labs on tablets/phones)
- Light theme with medical/professional aesthetic
- Header with title "Gensini Score Calculator" and brief description

### Main Calculator Section
1. **Lesion Input Form** — User adds lesions one at a time:
   - **Coronary Segment** dropdown (all 15 segments listed above with weighting factor shown)
   - **Stenosis Degree** — either dropdown (25%, 50%, 75%, 90%, 99%, 100%) OR a slider/input that maps to the correct severity score
   - **Add Lesion** button
   
2. **Lesion List** — Table showing all added lesions:
   - Segment name
   - Stenosis %
   - Severity score
   - Weighting factor
   - Lesion score (severity × weight)
   - Remove button per lesion
   
3. **Score Summary** — Prominently displayed:
   - Total Gensini Score (large, bold)
   - Interpretation (color-coded: green=normal, yellow=mild, orange=moderate, red=severe)
   - Number of lesions
   - Number of vessels involved

### Reference Section (collapsible)
- Scoring table (stenosis → severity score)
- Location weighting factors table
- SVG coronary artery diagram showing segment locations (create a clean schematic)
- Interpretation guide

### Additional Features
- **Reset All** button to clear all lesions
- **Export/Share** — copy results as text or save as image
- Coronary artery diagram that highlights segments as lesions are added (SVG-based)
- Quick-add presets for common patterns (e.g., "3-vessel disease")

## Coronary Artery Diagram
Create an SVG schematic of the coronary artery tree showing:
- Left Main → LAD (prox/mid/distal) + Diagonals
- Left Main → LCx (prox/distal) + Obtuse Marginals
- RCA (prox/mid/distal) → PDA + PLB
- Segments should be interactive — clickable to add a lesion
- Color segments based on stenosis severity when lesions are added
- Labels for each segment

## Key Design Principles
1. **Accuracy first** — all values must match the Gensini 1983 paper exactly
2. **Fast interaction** — adding lesions should be quick (cath lab workflow)
3. **Clear results** — score and interpretation immediately visible
4. **Educational** — reference tables and diagram help learning
5. **Mobile-first** — works great on iPad/iPhone in landscape and portrait

## References
1. Gensini GG. A more meaningful scoring system for determining the severity of coronary heart disease. Am J Cardiol. 1983;51(3):606.
2. Neeland IJ, et al. The Gensini score: assessment of its utility in clinical research. Am Heart J. 2012;164(4):e2.
3. Charach L, et al. Using the Gensini score to estimate severity of STEMI, NSTEMI, unstable angina, and anginal syndrome. Medicine. 2021;100(41):e27331.
4. SYNTAX Working Group. Coronary complexity and scoring systems in CAD. Eur Heart J. 2013.

## Clinical Context (from Charach et al. 2021)
- Mean GS in 417 CAD patients: 66.7 ± 63.8
- NSTEMI patients had highest GS: 81.3 ± 56.2
- GS correlates with multivessel disease, CABG, troponin, DM, HTN, HDL
- Interpretation ranges may vary by institution

## File Structure
```
gensini/
├── CLAUDE.md
├── README.md
├── package.json
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts (if needed)
├── postcss.config.mjs
├── public/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── Calculator.tsx        — main calculator component
│   │   ├── LesionForm.tsx        — add lesion form
│   │   ├── LesionTable.tsx       — list of added lesions
│   │   ├── ScoreSummary.tsx      — total score + interpretation
│   │   ├── CoronaryDiagram.tsx   — SVG artery diagram
│   │   └── ReferenceSection.tsx  — collapsible reference tables
│   ├── lib/
│   │   ├── gensini.ts            — scoring logic (pure functions)
│   │   └── types.ts              — TypeScript types
│   └── data/
│       └── segments.ts           — segment definitions + weights
```
