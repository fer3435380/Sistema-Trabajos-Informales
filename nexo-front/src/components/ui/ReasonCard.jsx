const toneStyles = {
  blue: {
    iconWrapClass: 'bg-[var(--color-primary-soft)]',
    iconClass: 'icon-primary',
  },
  amber: {
    iconWrapClass: 'bg-[var(--color-amber-soft)]',
    iconClass: 'icon-amber',
  },
  navy: {
    iconWrapClass: 'bg-[#e8eff7]',
    iconClass: 'icon-navy',
  },
}

function ReasonCard({ icon, title, description, tone = 'blue', delayClass = '' }) {
  const styles = toneStyles[tone]

  return (
    <article
      className={`animate-section-rise rounded-[24px] border border-white/75 bg-white/92 px-4 py-5 text-center shadow-[0_18px_42px_rgba(4,44,83,0.07)] transition duration-300 hover:-translate-y-1 hover:border-[var(--color-primary-border)] hover:shadow-[0_24px_52px_rgba(4,44,83,0.1)] sm:px-5 ${delayClass}`}
    >
      <div
        className={`mx-auto flex h-[76px] w-[76px] items-center justify-center rounded-full border border-[var(--color-primary-border)] ${styles.iconWrapClass}`}
      >
        <img src={icon} alt="" className={`h-9 w-9 object-contain ${styles.iconClass}`} />
      </div>

      <h3 className="mt-5 text-[1.1rem] font-bold tracking-[-0.03em] text-[var(--color-primary-strong)]">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-[24ch] text-[14px] leading-6 text-[var(--color-text-muted)]">
        {description}
      </p>
    </article>
  )
}

export default ReasonCard
