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

function MicrojobDetailModal({ microjob, isOpen, onClose, onApply }) {
  return (
    <WorkerModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={microjob?.title || 'Detalle del microtrabajo'}
      description="Conoce los requisitos y el contexto completo antes de postular."
      size="xl"
      footer={
        microjob ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-[42px] items-center justify-center rounded-[0.95rem] border border-[var(--color-primary-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text-muted)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
            >
              Cerrar
            </button>
            <button
              type="button"
              onClick={() => onApply(microjob.id)}
              disabled={!microjob.isUnlocked}
              className={`inline-flex min-h-[42px] items-center justify-center rounded-[0.95rem] px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)] ${
                microjob.isUnlocked
                  ? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-strong)]'
                  : 'cursor-not-allowed bg-[var(--color-primary-border)] text-[var(--color-text-muted)]'
              }`}
            >
              {microjob.isUnlocked ? 'Postular' : 'Bloqueado'}
            </button>
          </div>
        ) : null
      }
    >
      {microjob ? (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[0.85fr_1.15fr]">
            <img
              src={microjob.imageSrc}
              alt={microjob.imageAlt || microjob.title}
              className="h-56 w-full rounded-[1.25rem] object-cover"
            />

            <div className="space-y-4 rounded-[1.25rem] border border-[var(--color-primary-border)] p-4">
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge label={microjob.microjobType} />
                <StatusBadge label={microjob.isUnlocked ? 'Desbloqueado' : 'Bloqueado'} />
                <p className="text-sm font-semibold text-[var(--color-primary)]">
                  {microjob.company}
                </p>
              </div>

              <p className="text-sm leading-7 text-[var(--color-text-muted)]">
                {microjob.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            <DetailField label="Pago estimado" value={microjob.estimatedPay} />
            <DetailField label="Duración" value={microjob.estimatedTime} />
            <DetailField label="Modalidad" value={microjob.modalityLabel} />
            <DetailField label="Tipo de microtrabajo" value={microjob.microjobType} />
            <DetailField label="Ubicación" value={microjob.locationLabel} />
            <DetailField label="Habilidad requerida" value={microjob.requiredSkill} />
            <DetailField
              label="Curso requerido"
              value={microjob.requiredCourseLabel || 'No requerido'}
            />
            <DetailField label="Fecha estimada" value={microjob.scheduleWindow} />
            <DetailField label="Cupos disponibles" value={microjob.capacity} />
            <DetailField label="Responsable" value={microjob.supervisorName} />
          </div>

          <div className="rounded-[1.2rem] border border-[var(--color-primary-border)] p-4">
            <p className="text-sm font-semibold text-[var(--color-primary-strong)]">
              Documentos o requisitos
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {microjob.documents.map((document) => (
                <span
                  key={document}
                  className="rounded-full bg-[var(--color-primary-softer)] px-3 py-1 text-sm text-[var(--color-text)]"
                >
                  {document}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </WorkerModalShell>
  )
}

export default MicrojobDetailModal
