export default function ArticlesLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 overflow-y-auto pb-[72px]">
        <header className="mx-auto max-w-[375px] px-4 pt-6 pb-4">
          <div className="h-7 w-32 rounded-md bg-gray-200 animate-pulse" />
        </header>

        <section className="mx-auto max-w-[375px] px-4 space-y-6 pb-6">
          <div className="h-[360px] w-full max-w-[320px] mx-auto rounded-[6px] bg-gray-200 animate-pulse" />

          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`article-skeleton-${index}`}
                className="flex h-[120px] w-full max-w-[320px] mx-auto gap-3"
              >
                <div className="w-[107px] h-full rounded-[6px] bg-gray-200 animate-pulse" />
                <div className="flex-1 flex flex-col justify-between py-2">
                  <div className="space-y-2">
                    <div className="h-6 w-24 rounded-full bg-gray-200 animate-pulse" />
                    <div className="h-4 w-full rounded-md bg-gray-200 animate-pulse" />
                    <div className="h-4 w-3/4 rounded-md bg-gray-200 animate-pulse" />
                  </div>
                  <div className="h-3 w-24 rounded-md bg-gray-200 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

