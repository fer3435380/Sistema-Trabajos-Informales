function StoryCard({
  image,
  name,
  city,
  role,
  quote,
  stars,
  delayClass = '',
}) {
  return (
    <article
      className={`animate-section-rise rounded-[26px] border border-[var(--color-primary-border)] bg-white/94 p-5 shadow-[0_20px_48px_rgba(4,44,83,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_56px_rgba(4,44,83,0.12)] sm:p-6 ${delayClass}`}
    >
      <div className="flex items-center gap-4">
        <img
          src={image}
          alt={name}
          className="h-16 w-16 rounded-full object-cover ring-4 ring-[var(--color-primary-soft)]"
        />

        <div className="min-w-0">
          <h3 className="truncate text-[1.2rem] font-bold tracking-[-0.03em] text-[var(--color-primary-strong)]">
            {name}
          </h3>
          <p className="mt-1 text-sm font-medium text-[var(--color-text-muted)]">{role}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5">
        {stars.map((starSrc, index) => (
          <img
            key={`${name}-star-${index + 1}`}
            src={starSrc}
            alt=""
            className="icon-amber h-4 w-4 object-contain"
          />
        ))}
      </div>

      <p className="mt-4 text-[14px] leading-7 text-[var(--color-text-muted)]">
        “{quote}”
      </p>

      <div className="mt-5 inline-flex rounded-full bg-[var(--color-primary-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-primary)]">
        {city}
      </div>
    </article>
  )
}

export default StoryCard
