function EmptyState({ title, description, buttonLabel, onAction }) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-[var(--color-primary-border)] bg-[var(--color-primary-softer)] px-5 py-8 text-center">
      <h3 className="text-lg font-bold tracking-[-0.03em] text-[var(--color-primary-strong)]">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[var(--color-text-muted)]">
        {description}
      </p>
      {buttonLabel ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-[0.95rem] bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
        >
          {buttonLabel}
        </button>
      ) : null}
    </div>
  )
}

export default EmptyState
