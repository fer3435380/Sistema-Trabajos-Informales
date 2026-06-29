const toneStyles = {
  blue: {
    iconWrapClass: 'bg-[var(--color-primary)]',
    iconShellClass: 'shadow-[0_12px_24px_rgba(24,95,165,0.18)]',
    iconClass: 'icon-light',
  },
  amber: {
    iconWrapClass: 'bg-[var(--color-amber)]',
    iconShellClass: 'shadow-[0_12px_24px_rgba(235,169,47,0.22)]',
    iconClass: 'icon-light',
  },
  green: {
    iconWrapClass: 'bg-[#3e8b58]',
    iconShellClass: 'shadow-[0_12px_24px_rgba(62,139,88,0.22)]',
    iconClass: 'icon-light',
  },
}

function CompanyOpportunityCard({
  title,
  description,
  icon,
  arrowIcon,
  tone = 'blue',
  delayClass = '',
}) {
  const styles = toneStyles[tone]

  return (
    <article
      className={`animate-section-rise flex items-center gap-4 rounded-[24px] border border-white/85 bg-white/95 p-4 shadow-[0_18px_40px_rgba(4,44,83,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[var(--color-primary-border)] hover:shadow-[0_20px_45px_rgba(4,44,83,0.11)] sm:p-5 ${delayClass}`}
    >
      <div
        className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-[18px] ${styles.iconWrapClass} ${styles.iconShellClass}`}
      >
        <img
          src={icon}
          alt=""
          className={`h-8 w-8 object-contain ${styles.iconClass}`}
        />
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="text-[1.35rem] font-bold tracking-[-0.04em] text-[var(--color-primary-strong)]">
          {title}
        </h4>
        <p className="mt-1 text-[14px] leading-6 text-[var(--color-text-muted)] sm:text-[15px]">
          {description}
        </p>
      </div>

      <img
        src={arrowIcon}
        alt=""
        className="icon-navy h-4 w-4 shrink-0 object-contain"
      />
    </article>
  )
}

export default CompanyOpportunityCard
