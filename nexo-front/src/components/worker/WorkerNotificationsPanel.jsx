function WorkerNotificationsPanel({ notifications, onClose }) {
  return (
    <div className="absolute right-0 top-[calc(100%+0.75rem)] z-20 w-[min(92vw,22rem)] overflow-hidden rounded-[1.3rem] border border-[var(--color-primary-border)] bg-white shadow-[0_24px_42px_rgba(4,44,83,0.14)]">
      <div className="flex items-center justify-between border-b border-[var(--color-primary-border)] px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-[var(--color-primary)]">Notificaciones</p>
          <p className="text-xs text-[var(--color-text-muted)]">Tus alertas más recientes</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-primary-border)] text-[var(--color-primary-strong)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
        >
          ×
        </button>
      </div>

      <div className="max-h-[22rem] overflow-y-auto p-3">
        <div className="space-y-2">
          {notifications.map((notification) => (
            <article
              key={notification.id}
              className={`rounded-[1rem] border p-3 ${
                notification.isUnread
                  ? 'border-[var(--color-primary-border)] bg-[var(--color-primary-softer)]'
                  : 'border-transparent bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--color-primary-strong)]">
                    {notification.title}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">
                    {notification.description}
                  </p>
                </div>
                {notification.isUnread ? (
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--color-amber)]" />
                ) : null}
              </div>

              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-[var(--color-primary)]">
                  {notification.category}
                </span>
                <span className="text-xs font-medium text-[var(--color-text-muted)]">
                  {notification.timeLabel}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

export default WorkerNotificationsPanel
