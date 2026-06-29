import StatusBadge from './StatusBadge'

function ApplicationRow({ application, onOpenDetail, onOpenSchedule, onCancel }) {
  const actionLabel =
    application.status === 'Aceptada'
      ? 'Continuar'
      : application.status === 'Completada'
        ? 'Ver resultado'
        : 'Ver detalle'

  const canCancel = application.status === 'En revisión'

  function handleCancel() {
    if (window.confirm('¿Cancelar esta postulación? Esta acción no se puede deshacer.')) {
      onCancel(application.id)
    }
  }

  return (
    <article className="rounded-[1.25rem] border border-[var(--color-primary-border)] bg-white p-4 shadow-[0_16px_28px_rgba(4,44,83,0.04)]">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.6fr_repeat(4,0.72fr)_0.9fr] xl:items-center">
        <div className="flex items-center gap-3">
          <img
            src={application.imageSrc}
            alt={application.imageAlt || application.title}
            className="h-16 w-16 shrink-0 rounded-[1rem] object-cover"
          />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold tracking-[-0.03em] text-[var(--color-primary-strong)]">
                {application.title}
              </h3>
              <img
                src={application.companyLogo}
                alt=""
                className="h-5 w-5 rounded-full object-cover"
              />
            </div>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">{application.company}</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
            Fecha
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--color-primary-strong)]">
            {application.appliedAtLabel}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
            Pago
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--color-primary-strong)]">
            {application.estimatedPay}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
            Modalidad
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--color-primary-strong)]">
            {application.modalityLabel}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
            Estado
          </p>
          <div className="mt-2">
            <StatusBadge label={application.status} />
          </div>
        </div>

        <div className="flex flex-col gap-2 xl:items-end">
          <button
            type="button"
            onClick={() => onOpenDetail(application.id)}
            className="inline-flex min-h-[38px] items-center justify-center rounded-[0.9rem] border border-[var(--color-primary-border)] px-3.5 py-2 text-sm font-semibold text-[var(--color-primary)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
          >
            Ver detalle
          </button>

          {application.status === 'Aceptada' ? (
            <button
              type="button"
              onClick={() => onOpenSchedule(application.id)}
              className="inline-flex min-h-[38px] items-center justify-center rounded-[0.9rem] bg-[var(--color-primary)] px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
            >
              {actionLabel}
            </button>
          ) : application.status === 'Completada' ? (
            <button
              type="button"
              onClick={() => onOpenDetail(application.id)}
              className="inline-flex min-h-[38px] items-center justify-center rounded-[0.9rem] bg-[var(--color-success)] px-3.5 py-2 text-sm font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-[var(--color-success-soft)]"
            >
              {actionLabel}
            </button>
          ) : null}

          {canCancel ? (
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex min-h-[38px] items-center justify-center rounded-[0.9rem] border border-[var(--color-danger-border)] bg-[var(--color-danger-soft)] px-3.5 py-2 text-sm font-semibold text-[var(--color-danger)] transition hover:border-[var(--color-danger)] focus:outline-none focus:ring-4 focus:ring-[var(--color-danger-soft)]"
            >
              Cancelar
            </button>
          ) : null}
        </div>
      </div>
    </article>
  )
}

export default ApplicationRow
