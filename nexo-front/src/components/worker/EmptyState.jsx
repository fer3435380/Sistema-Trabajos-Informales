function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <section className="rounded-[1.75rem] border border-dashed border-[var(--color-primary-border)] bg-white px-5 py-12 text-center shadow-[0_24px_40px_rgba(4,44,83,0.05)] md:px-8">
      <div className="mx-auto max-w-xl space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-xl font-bold text-[var(--color-primary-strong)]">
          N
        </div>
        <h3 className="text-2xl font-extrabold tracking-[-0.04em] text-[var(--color-primary-strong)]">
          {title}
        </h3>
        <p className="text-sm leading-7 text-[var(--color-text-muted)]">{description}</p>
        {actionLabel ? (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex min-h-[46px] items-center justify-center rounded-[1rem] bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
    </section>
  )
}

export default EmptyState
