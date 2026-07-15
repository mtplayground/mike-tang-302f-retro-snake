import type { Score } from '../game';

export interface GameOverOverlayProps {
  readonly isVisible: boolean;
  readonly score: Score;
  readonly prompt?: string;
  readonly title?: string;
}

export function GameOverOverlay({
  isVisible,
  prompt = 'Press any key to restart',
  score,
  title = 'Game Over',
}: GameOverOverlayProps) {
  if (!isVisible) {
    return null;
  }

  const formattedScore = formatFinalScore(score);
  const announcement = `${title}. Final score ${formattedScore}. ${prompt}.`;

  return (
    <div
      aria-atomic="true"
      aria-label={announcement}
      aria-live="assertive"
      aria-modal="true"
      className="absolute inset-0 z-10 grid place-items-center bg-black/80 px-4 text-center"
      role="alertdialog"
    >
      <div className="w-full max-w-sm border border-hazard/70 bg-black/90 px-5 py-6 shadow-[0_0_28px_rgba(255,77,125,0.2)]">
        <h2 className="game-over-text text-3xl sm:text-4xl">{title}</h2>
        <p className="arcade-text mt-5 text-xs text-slate-300">Final Score</p>
        <p className="score-text mt-2 min-w-[8ch] text-4xl text-phosphor">
          {formattedScore}
        </p>
        <p className="arcade-text mt-6 text-xs leading-6 text-phosphor">
          {prompt}
        </p>
      </div>
    </div>
  );
}

function formatFinalScore(score: Score): string {
  if (!Number.isFinite(score) || score < 0) {
    return '0';
  }

  return Math.floor(score).toLocaleString('en-US');
}
