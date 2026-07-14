export default function App() {
  return (
    <main className="min-h-screen bg-cabinet px-5 py-6 text-white sm:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-phosphor/30 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-phosphor">
              Arcade
            </p>
            <h1 className="mt-2 text-3xl font-bold sm:text-5xl">Snake</h1>
          </div>
          <div className="border border-phosphor/50 bg-black px-5 py-3 text-right">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
              Score
            </p>
            <p className="mt-1 text-3xl font-bold text-phosphor">0</p>
          </div>
        </header>

        <div className="grid flex-1 place-items-center">
          <div className="aspect-square w-full max-w-[min(82vw,640px)] border border-phosphor/50 bg-black shadow-[0_0_32px_rgba(124,255,107,0.16)]">
            <div className="grid h-full w-full grid-cols-12 grid-rows-12">
              {Array.from({ length: 144 }, (_, index) => (
                <div
                  className="border border-phosphor/10"
                  key={index}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
