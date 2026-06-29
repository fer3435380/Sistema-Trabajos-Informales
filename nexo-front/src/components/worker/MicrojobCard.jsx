import LockedOverlay from './LockedOverlay'
import StatusBadge from './StatusBadge'

function MicrojobCard({ microjob, isApplied, onOpenDetail, onApply, onOpenRequiredCourse }) {
  const isLocked = !microjob.isUnlocked
  const distanceLabel = microjob.locationType === 'remote' ? 'Remoto' : `${microjob.distanceKm} km`

  return (
    <article
      className={`relative overflow-hidden rounded-[1.5rem] border border-[var(--color-primary-border)] bg-white p-4 shadow-[0_18px_30px_rgba(4,44,83,0.05)] ${
        isLocked ? 'opacity-70' : ''
      }`}
    >
      <div className="flex items-start gap-4">
        <img
          src={microjob.imageSrc}
          alt={microjob.imageAlt || microjob.title}
          className="h-24 w-24 shrink-0 rounded-[1.2rem] object-cover"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge label={microjob.microjobType} />
                <span className="rounded-full bg-[var(--color-primary-softer)] px-3 py-1 text-xs font-semibold text-[var(--color-text-muted)]">
                  {distanceLabel}
                </span>
              </div>
              <h3 className="mt-3 text-[1.08rem] font-bold tracking-[-0.04em] text-[var(--color-primary-strong)]">
                {microjob.title}
              </h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">{microjob.company}</p>
            </div>

            <div className="rounded-[1rem] bg-[var(--color-amber-soft)] px-3 py-2 text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                Pago
              </p>
              <p className="mt-1 text-sm font-bold text-[var(--color-primary-strong)]">
                {microjob.estimatedPay}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5 text-sm text-[var(--color-text)]">
            <div className="rounded-[1rem] bg-[var(--color-primary-softer)] px-3 py-2.5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                Modalidad
              </p>
              <p className="mt-1 font-semibold">{microjob.modalityLabel}</p>
            </div>
            <div className="rounded-[1rem] bg-[var(--color-primary-softer)] px-3 py-2.5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                Tiempo
              </p>
              <p className="mt-1 font-semibold">{microjob.estimatedTime}</p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <StatusBadge label={isLocked ? 'Bloqueado' : 'Desbloqueado'} />

            <div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => onOpenDetail(microjob.id)}
                className="inline-flex min-h-[38px] items-center justify-center rounded-[0.9rem] border border-[var(--color-primary-border)] px-3.5 py-2 text-sm font-semibold text-[var(--color-primary)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
              >
                Ver detalle
              </button>
              <button
                type="button"
                onClick={() => onApply(microjob.id)}
                disabled={isLocked || isApplied}
                className={`inline-flex min-h-[38px] items-center justify-center rounded-[0.9rem] px-3.5 py-2 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)] ${
                  isLocked || isApplied
                    ? 'cursor-not-allowed bg-[var(--color-primary-border)] text-[var(--color-text-muted)]'
                    : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-strong)]'
                }`}
              >
                {isApplied ? 'Ya postulaste' : 'Postular'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isLocked ? (
        <LockedOverlay
          requiredCourseLabel={microjob.requiredCourseLabel}
          onOpenCourse={() => onOpenRequiredCourse(microjob.requiredCourseId)}
        />
      ) : null}
    </article>
  )
}

export default MicrojobCard
