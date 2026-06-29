import { useEffect, useMemo, useState } from 'react'
import StoryCard from './StoryCard'

function chunkStories(stories, size) {
  const pages = []

  for (let index = 0; index < stories.length; index += size) {
    pages.push(stories.slice(index, index + size))
  }

  return pages
}

function StoryCarousel({ stories }) {
  const pages = useMemo(() => chunkStories(stories, 3), [stories])
  const [currentPage, setCurrentPage] = useState(0)

  useEffect(() => {
    if (pages.length <= 1) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setCurrentPage((previousPage) => (previousPage + 1) % pages.length)
    }, 30000)

    return () => window.clearInterval(intervalId)
  }, [pages.length])

  return (
    <div className="mt-8">
      <div
        key={`stories-page-${currentPage}`}
        className="grid gap-4 animate-section-fade md:grid-cols-2 xl:grid-cols-3 xl:gap-5"
      >
        {pages[currentPage].map((story, storyIndex) => (
          <StoryCard
            key={`${story.name}-${story.city}-${currentPage}`}
            {...story}
            delayClass={
              storyIndex === 0
                ? 'section-delay-1'
                : storyIndex === 1
                  ? 'section-delay-2'
                  : 'section-delay-3'
            }
          />
        ))}
      </div>

      {pages.length > 1 ? (
        <div className="mt-6 flex items-center justify-center gap-2.5">
          {pages.map((_, pageIndex) => {
            const isActive = pageIndex === currentPage

            return (
              <button
                key={`stories-dot-${pageIndex + 1}`}
                type="button"
                onClick={() => setCurrentPage(pageIndex)}
                aria-label={`Ir al grupo ${pageIndex + 1} de testimonios`}
                aria-pressed={isActive}
                className={`h-3.5 rounded-full transition duration-300 ${
                  isActive
                    ? 'w-8 bg-[var(--color-primary)] shadow-[0_8px_20px_rgba(24,95,165,0.22)]'
                    : 'w-3.5 bg-[var(--color-primary-border)] hover:bg-[var(--color-primary)]/45'
                }`}
              />
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

export default StoryCarousel
