function DetailItem({ label, value }) {
  return (
    <div className="rounded-[0.95rem] bg-[var(--color-primary-softer)] px-3 py-2.5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-[var(--color-primary-strong)]">{value}</p>
    </div>
  )
}

function WorkerDetailModal({ detail, onClose }) {
  if (!detail) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-end bg-[#041f3d]/45 p-3 backdrop-blur-sm sm:items-center sm:justify-center sm:p-5">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="worker-detail-title"
        className="w-full max-w-2xl overflow-hidden rounded-[1.4rem] border border-[var(--color-primary-border)] bg-white shadow-[0_28px_48px_rgba(4,44,83,0.18)]"
      >
        <div className="relative">
          {detail.imageSrc ? (
            <img
              src={detail.imageSrc}
              alt={detail.imageAlt || detail.title}
              className="h-52 w-full object-cover"
            />
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/92 text-lg font-bold text-[var(--color-primary-strong)] shadow-sm transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
          >
            ×
          </button>
        </div>

        <div className="space-y-5 p-4 md:p-5">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-[var(--color-primary)]">{detail.badgeLabel}</p>
            <h2
              id="worker-detail-title"
              className="text-[1.45rem] font-extrabold tracking-[-0.05em] text-[var(--color-primary-strong)]"
            >
              {detail.title}
            </h2>
            {detail.subtitle ? (
              <p className="text-sm font-medium text-[var(--color-text-muted)]">{detail.subtitle}</p>
            ) : null}
            {detail.description ? (
              <p className="text-sm leading-7 text-[var(--color-text-muted)]">{detail.description}</p>
            ) : null}
          </div>

          {detail.metaItems?.length ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {detail.metaItems.map((item) => (
                <DetailItem key={item.label} label={item.label} value={item.value} />
              ))}
            </div>
          ) : null}

          <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-end">
            {detail.secondaryAction ? (
              <button
                type="button"
                onClick={detail.secondaryAction.onClick}
                className="inline-flex min-h-[42px] items-center justify-center rounded-[0.95rem] border border-[var(--color-primary-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-primary)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
              >
                {detail.secondaryAction.label}
              </button>
            ) : null}
            <button
              type="button"
              onClick={detail.primaryAction?.onClick || onClose}
              className="inline-flex min-h-[42px] items-center justify-center rounded-[0.95rem] bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
            >
              {detail.primaryAction?.label || 'Cerrar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkerDetailModal
