const panelStyles = {
  blue: {
    eyebrowClass: 'text-[var(--color-primary)]',
    glow: 'bg-[radial-gradient(circle_at_top_left,rgba(24,95,165,0.14),transparent_58%)]',
    dots: 'bg-[radial-gradient(rgba(24,95,165,0.16)_1.3px,transparent_1.3px)]',
  },
  navy: {
    eyebrowClass: 'text-[var(--color-primary-strong)]',
    glow: 'bg-[radial-gradient(circle_at_top_right,rgba(4,44,83,0.12),transparent_58%)]',
    dots: 'bg-[radial-gradient(rgba(235,169,47,0.20)_1.3px,transparent_1.3px)]',
  },
}

function AudiencePanel({
  eyebrow,
  title,
  description,
  tone = 'blue',
  delayClass = '',
  children,
}) {
  const styles = panelStyles[tone]

  return (
    <section
      className={`animate-section-rise relative overflow-hidden rounded-[30px] border border-white/85 bg-white/92 p-6 shadow-[0_24px_60px_rgba(4,44,83,0.08)] backdrop-blur sm:p-8 ${delayClass}`}
    >
      <div className={`pointer-events-none absolute inset-0 ${styles.glow}`} />
      <div
        className={`pointer-events-none absolute right-7 top-24 h-16 w-16 opacity-60 ${styles.dots} bg-[length:12px_12px]`}
      />

      <div className="relative">
        {eyebrow ? (
          <p className={`text-xs font-extrabold uppercase tracking-[0.18em] ${styles.eyebrowClass}`}>
            {eyebrow}
          </p>
        ) : null}

        {title ? (
          <h3 className="mt-3 max-w-[12ch] text-[2rem] font-extrabold leading-[1.02] tracking-[-0.06em] text-[var(--color-primary-strong)] sm:text-[2.4rem]">
            {title}
          </h3>
        ) : null}

        {description ? (
          <p className="mt-4 max-w-[36ch] text-[15px] leading-7 text-[var(--color-text-muted)] sm:text-[16px]">
            {description}
          </p>
        ) : null}

        <div className={eyebrow || title || description ? 'mt-6' : ''}>{children}</div>
      </div>
    </section>
  )
}

export default AudiencePanel
