import { GameOverOverlay, ScoreDisplay } from './components';
import { useSnakeGame } from './hooks/useSnakeGame';

export default function App() {
  const { canvasRef, state } = useSnakeGame();

  return (
    <main className="min-h-screen bg-cabinet px-5 py-6 text-white sm:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-phosphor/30 pb-5">
          <div>
            <p className="arcade-text text-xs text-phosphor">Arcade</p>
            <h1 className="arcade-text mt-2 text-3xl text-white sm:text-5xl">
              Snake
            </h1>
          </div>
          <ScoreDisplay score={state.score} />
        </header>

        <div className="grid flex-1 place-items-center">
          <div className="crt-screen aspect-square w-full max-w-[min(82vw,480px)] border border-phosphor/50 bg-black">
            <canvas
              aria-label="Snake game board"
              className="block h-full w-full"
              ref={canvasRef}
            />
            <GameOverOverlay
              isVisible={state.status === 'game-over'}
              score={state.score}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
