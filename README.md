# Gensini Score Calculator

A modern web-based calculator for the Gensini scoring system — a quantitative angiographic tool to assess the severity of coronary artery disease (CAD).

## What is the Gensini Score?

The Gensini Score semiquantifies the extent of coronary ischemia by considering both:
- **Degree of luminal narrowing** (stenosis severity)
- **Anatomic importance** of the lesion's location in the coronary tree

Each stenosis is assigned a severity score (1–32) multiplied by a location weighting factor (0.5–5.0). The total score is the sum of all individual lesion scores.

## Features

- 🫀 **Interactive coronary artery diagram** — click segments to add lesions
- 📊 **Real-time score calculation** with severity interpretation
- 📱 **Mobile-responsive** — optimized for tablets in the cath lab
- 📋 **Export results** — copy or share the calculated score
- 📚 **Built-in reference** — scoring tables and interpretation guide

## Scoring Reference

| Stenosis | Score | | Segment | Weight |
|----------|-------|-|---------|--------|
| 1–25% | 1 | | Left Main | 5.0 |
| 26–50% | 2 | | Prox LAD / LCx | 2.5 |
| 51–75% | 4 | | Mid LAD | 1.5 |
| 76–90% | 8 | | Most others | 1.0 |
| 91–99% | 16 | | D2 / OM2 / PLB | 0.5 |
| 100% | 32 | | | |

**Interpretation:** 0 = Normal · 1–20 = Mild · 21–50 = Moderate · >50 = Severe

## Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## References

1. Gensini GG. A more meaningful scoring system for determining the severity of coronary heart disease. *Am J Cardiol.* 1983;51(3):606.
2. Neeland IJ, et al. The Gensini score: assessment of its utility in clinical research. *Am Heart J.* 2012;164(4):e2.
3. Charach L, et al. Using the Gensini score to estimate severity of STEMI, NSTEMI, unstable angina, and anginal syndrome. *Medicine.* 2021;100(41):e27331.

## License

MIT
