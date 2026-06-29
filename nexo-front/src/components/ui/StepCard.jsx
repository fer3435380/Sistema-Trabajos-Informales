const toneStyles = {
  blue: {
    badgeClass: 'bg-[var(--color-primary)] text-white',
    iconWrapClass: 'bg-[var(--color-primary-soft)]',
    accentClass: 'bg-[var(--color-primary)]',
    iconClass: 'icon-primary',
  },
  amber: {
    badgeClass: 'bg-[var(--color-amber)] text-white',
    iconWrapClass: 'bg-[var(--color-amber-soft)]',
    accentClass: 'bg-[var(--color-amber)]',
    iconClass: 'icon-amber',
  },
  navy: {
    badgeClass: 'bg-[var(--color-primary-strong)] text-white',
    iconWrapClass: 'bg-[#e8eff7]',
    accentClass: 'bg-[var(--color-primary-strong)]',
    iconClass: 'icon-navy',
  },
}

function StepCard({ step, title, description, icon, tone = 'blue', delayClass = '' }) {
  const styles = toneStyles[tone]

  return (
    <article
      className={`animate-section-rise rounded-[26px] border border-white/80 bg-white/94 p-5 shadow-[0_18px_45px_rgba(4,44,83,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[var(--color-primary-border)] hover:shadow-[0_24px_52px_rgba(4,44,83,0.12)] sm:p-6 ${delayClass}`}
    >
      <div
        className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${styles.badgeClass}`}
      >
        {step}
      </div>

      <div className="mt-5 flex items-start gap-4">
        <div
          className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full ${styles.iconWrapClass}`}
        >
          <img
            src={icon}
            alt=""
            className={`h-8 w-8 object-contain ${styles.iconClass}`}
          />
        </div>

        <div>
          <h3 className="text-[1.45rem] font-bold tracking-[-0.04em] text-[var(--color-primary-strong)]">
            {title}
          </h3>
          <p className="mt-2 max-w-[25ch] text-[14px] leading-6 text-[var(--color-text-muted)] sm:text-[15px]">
            {description}
          </p>
        </div>
      </div>

      <div className={`mt-5 h-[3px] w-10 rounded-full ${styles.accentClass}`} />
    </article>
  )
}

export default StepCard
