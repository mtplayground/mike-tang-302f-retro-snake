import type { Score } from '../game';

export interface ScoreDisplayProps {
  readonly label?: string;
  readonly score: Score;
}

export function ScoreDisplay({ label = 'Score', score }: ScoreDisplayProps) {
  const formattedScore = formatScore(score);

  return (
    <section
      aria-atomic="true"
      aria-label={`${label}: ${formattedScore}`}
      aria-live="polite"
      className="border border-phosphor/50 bg-black px-5 py-3 text-right"
    >
      <p className="arcade-text text-xs text-slate-400">{label}</p>
      <p className="score-text mt-1 min-w-[7ch] text-3xl text-phosphor">
        {formattedScore}
      </p>
    </section>
  );
}

function formatScore(score: Score): string {
  if (!Number.isFinite(score) || score < 0) {
    return '0';
  }

  return Math.floor(score).toLocaleString('en-US');
}
