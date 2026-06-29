import MapPreview from './MapPreview'
import StatusBadge from './StatusBadge'
import CompanyModalShell from './CompanyModalShell'

function DetailItem({ label, value }) {
  return (
    <div className="rounded-[1rem] border border-[var(--color-primary-border)] bg-[var(--color-primary-softer)] p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
        {label}
      </p>
      <p className="mt-1 text-sm leading-6 text-[var(--color-primary-strong)]">{value}</p>
    </div>
  )
}

function MicrojobDetailModal({ microjob, isOpen, onClose, onEdit, onDelete }) {
  if (!microjob) {
    return null
  }

  function handleDelete() {
    if (window.confirm(`¿Eliminar el microtrabajo “${microjob.title}”? Esta acción no se puede deshacer.`)) {
      onDelete(microjob.id)
    }
  }

  return (
    <CompanyModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={microjob.title}
      description="Revisa la información esencial del microtrabajo publicado."
      size="xl"
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={microjob.status} />
          <span className="inline-flex rounded-full bg-[var(--color-primary-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-primary)]">
            {microjob.microjobType}
          </span>
          <span className="inline-flex rounded-full bg-[var(--color-primary-softer)] px-3 py-1 text-xs font-semibold text-[var(--color-text-muted)]">
            {microjob.modality}
          </span>
        </div>

        <div className="overflow-hidden rounded-[1.3rem] border border-[var(--color-primary-border)] bg-[linear-gradient(180deg,#f8fbff_0%,#eef4fa_100%)] p-3">
          <img
            src={microjob.imageSrc}
            alt={microjob.imageAlt}
            className="h-auto max-h-[24rem] w-full rounded-[1rem] object-contain"
          />
        </div>

        <div className="rounded-[1.3rem] border border-[var(--color-primary-border)] bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-[var(--color-primary)]">Detalle</p>
            <div className="flex shrink-0 flex-wrap gap-2">
              <button
                type="button"
                onClick={onEdit}
                className="inline-flex min-h-[42px] items-center justify-center rounded-[0.95rem] border border-[var(--color-primary-border)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
              >
                Editar microtrabajo
              </button>
              {onDelete ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex min-h-[42px] items-center justify-center rounded-[0.95rem] border border-[var(--color-danger-border)] bg-[var(--color-danger-soft)] px-4 py-2 text-sm font-semibold text-[var(--color-danger)] transition hover:border-[var(--color-danger)] focus:outline-none focus:ring-4 focus:ring-[var(--color-danger-soft)]"
                >
                  Eliminar
                </button>
              ) : null}
            </div>
          </div>
          <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">
            {microjob.description || microjob.shortDescription}
          </p>
        </div>

        <div className="rounded-[1.3rem] border border-[var(--color-primary-border)] bg-white p-4">
          <p className="text-sm font-semibold text-[var(--color-primary)]">Resumen rápido</p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <DetailItem label="Modalidad" value={microjob.modality} />
            <DetailItem label="Tipo" value={microjob.microjobType} />
            <DetailItem label="Pago" value={microjob.estimatedPay} />
            <DetailItem label="Duración" value={microjob.estimatedDuration} />
            <DetailItem
              label="Curso requerido"
              value={microjob.requiredCourseLabel || 'No requiere curso'}
            />
            <DetailItem label="Requisitos" value={microjob.documents.join(', ')} />
          </div>
        </div>

        <MapPreview
          locationName={microjob.locationName}
          address={microjob.address}
          latitude={microjob.latitude}
          longitude={microjob.longitude}
        />
      </div>
    </CompanyModalShell>
  )
}

export default MicrojobDetailModal
