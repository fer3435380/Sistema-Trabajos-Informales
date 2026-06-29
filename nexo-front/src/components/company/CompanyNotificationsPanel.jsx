function CompanyNotificationsPanel({ notifications, onClose }) {
  return (
    <div className="absolute right-0 top-[calc(100%+0.75rem)] z-40 w-[min(92vw,24rem)] rounded-[1.35rem] border border-[var(--color-primary-border)] bg-white p-4 shadow-[0_24px_54px_rgba(4,44,83,0.14)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[var(--color-primary)]">Notificaciones</p>
          <h3 className="text-lg font-bold tracking-[-0.03em] text-[var(--color-primary-strong)]">
            Actividad reciente
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-primary-border)] text-[var(--color-primary-strong)] transition hover:border-[var(--color-primary)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
          aria-label="Cerrar notificaciones"
        >
          ×
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {notifications.map((notification) => (
          <article
            key={notification.id}
            className="rounded-[1rem] border border-[var(--color-primary-border)] bg-[var(--color-primary-softer)] p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[var(--color-primary-strong)]">
                  {notification.title}
                </p>
                <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">
                  {notification.description}
                </p>
              </div>
              {notification.isUnread ? (
                <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-[var(--color-amber)]" />
              ) : null}
            </div>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              {notification.category} · {notification.timeLabel}
            </p>
          </article>
        ))}
      </div>
    </div>
  )
}

export default CompanyNotificationsPanel
