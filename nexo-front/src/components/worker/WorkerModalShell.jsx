function WorkerModalShell({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'lg',
}) {
  if (!isOpen) {
    return null
  }

  const sizeClassName = {
    md: 'max-w-2xl',
    lg: 'max-w-3xl',
    xl: 'max-w-4xl',
  }[size]

  return (
    <div className="fixed inset-0 z-[120] bg-[#041f3d]/55 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Cerrar modal"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default"
      />

      <div className="flex min-h-full items-end justify-center p-0 sm:items-center sm:p-5">
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="worker-modal-title"
          className={`relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[1.75rem] border border-[var(--color-primary-border)] bg-white shadow-[0_24px_54px_rgba(4,44,83,0.18)] sm:max-h-[88vh] sm:rounded-[1.75rem] ${sizeClassName}`}
        >
          <div className="flex items-start justify-between gap-4 border-b border-[var(--color-primary-border)] px-4 py-4 sm:px-6">
            <div className="min-w-0">
              <h2
                id="worker-modal-title"
                className="text-[1.2rem] font-extrabold tracking-[-0.04em] text-[var(--color-primary-strong)] sm:text-[1.35rem]"
              >
                {title}
              </h2>
              {description ? (
                <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">
                  {description}
                </p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--color-primary-border)] text-[var(--color-primary-strong)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">{children}</div>

          {footer ? (
            <div className="border-t border-[var(--color-primary-border)] px-4 py-4 sm:px-6">
              {footer}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  )
}

export default WorkerModalShell
