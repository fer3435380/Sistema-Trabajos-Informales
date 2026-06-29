import StatusBadge from './StatusBadge'
import WorkerModalShell from './WorkerModalShell'

function DetailField({ label, value }) {
  return (
    <div className="rounded-[1rem] bg-[var(--color-primary-softer)] px-3 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-[var(--color-primary-strong)]">{value}</p>
    </div>
  )
}

function ApplicationDetailModal({ application, isOpen, onClose, onCancel }) {
  const canCancel = application?.status === 'En revisión'

  function handleCancel() {
    if (window.confirm('¿Cancelar esta postulación? Esta acción no se puede deshacer.')) {
      onCancel(application.id)
    }
  }

  return (
    <WorkerModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={application?.title || 'Detalle de postulación'}
      description="Revisa el estado y la información completa de tu postulación."
      size="lg"
      footer={
        application ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-[42px] items-center justify-center rounded-[0.95rem] border border-[var(--color-primary-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text-muted)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            >
              Cerrar
            </button>
            {canCancel ? (
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex min-h-[42px] items-center justify-center rounded-[0.95rem] border border-[var(--color-danger-border)] bg-[var(--color-danger-soft)] px-4 py-2.5 text-sm font-semibold text-[var(--color-danger)] transition hover:border-[var(--color-danger)]"
              >
                Cancelar postulación
              </button>
            ) : null}
          </div>
        ) : null
      }
    >
      {application ? (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[0.9fr_1.1fr]">
            <img
              src={application.imageSrc}
              alt={application.imageAlt || application.title}
              className="h-48 w-full rounded-[1.25rem] object-cover"
            />

            <div className="space-y-3 rounded-[1.25rem] border border-[var(--color-primary-border)] p-4">
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge label={application.status} />
                <p className="text-sm font-semibold text-[var(--color-primary)]">
                  {application.company}
                </p>
              </div>

              <p className="text-sm leading-7 text-[var(--color-text-muted)]">
                {application.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <DetailField label="Pago estimado" value={application.estimatedPay} />
            <DetailField label="Modalidad" value={application.modalityLabel} />
            <DetailField label="Ubicación" value={application.locationLabel} />
            <DetailField label="Fecha de postulación" value={application.appliedAtLabel} />
            <DetailField label="Tiempo estimado" value={application.estimatedTime} />
            <DetailField
              label="Curso recomendado"
              value={application.courseRecommendation || 'No requerido'}
            />
          </div>

          <div className="rounded-[1.2rem] border border-[var(--color-primary-border)] p-4">
            <p className="text-sm font-semibold text-[var(--color-primary-strong)]">Requisitos</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {application.requirements.map((requirement) => (
                <span
                  key={requirement}
                  className="rounded-full bg-[var(--color-primary-softer)] px-3 py-1 text-sm text-[var(--color-text)]"
                >
                  {requirement}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </WorkerModalShell>
  )
}

export default ApplicationDetailModal
