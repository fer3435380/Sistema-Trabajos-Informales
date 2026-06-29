import EmptyState from './EmptyState'
import StatusBadge from './StatusBadge'

function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) {
    return text
  }

  return `${text.slice(0, maxLength).trim()}...`
}

function CompanyMicrojobs({
  microjobs,
  activeFiltersCount,
  workModeLabel,
  onOpenFilters,
  onOpenWizard,
  onOpenDetail,
}) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 rounded-[1.45rem] border border-[var(--color-primary-border)] bg-white p-5 shadow-[0_18px_32px_rgba(4,44,83,0.05)] lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--color-primary)]">Microtrabajos</p>
          <h2 className="mt-1 text-[1.55rem] font-extrabold tracking-[-0.05em] text-[var(--color-primary-strong)]">
            Publica y administra las oportunidades disponibles para trabajadores.
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
            Modo actual: {workModeLabel}. Ajustamos etiquetas y sugerencias sin crear dashboards separados.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onOpenWizard}
            className="inline-flex min-h-[44px] items-center justify-center rounded-[0.95rem] bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
          >
            Publicar microtrabajo
          </button>
          <button
            type="button"
            onClick={onOpenFilters}
            className="inline-flex min-h-[44px] items-center justify-center rounded-[0.95rem] border border-[var(--color-primary-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-primary)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
          >
            Filtros{activeFiltersCount ? ` · ${activeFiltersCount}` : ''}
          </button>
        </div>
      </div>

      {!microjobs.length ? (
        <EmptyState
          title="Aún no hay microtrabajos visibles"
          description="Aplica otros filtros o publica un nuevo microtrabajo para empezar a operar."
          buttonLabel="Publicar microtrabajo"
          onAction={onOpenWizard}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {microjobs.map((microjob) => (
            <article
              key={microjob.id}
              className="overflow-hidden rounded-[1.45rem] border border-[var(--color-primary-border)] bg-white p-4 shadow-[0_16px_26px_rgba(4,44,83,0.04)]"
            >
              <div className="flex flex-col gap-4 sm:flex-row">
                <img
                  src={microjob.imageSrc}
                  alt={microjob.imageAlt || microjob.title}
                  className="h-44 w-full rounded-[1.2rem] object-cover sm:h-auto sm:w-40 sm:shrink-0"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={microjob.status} />
                        <span className="rounded-full bg-[var(--color-primary-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-primary)]">
                          {microjob.microjobType}
                        </span>
                        <span className="rounded-full bg-[var(--color-primary-softer)] px-3 py-1 text-xs font-semibold text-[var(--color-text-muted)]">
                          {microjob.modality}
                        </span>
                      </div>
                      <h3 className="mt-3 text-[1.08rem] font-bold tracking-[-0.04em] text-[var(--color-primary-strong)]">
                        {microjob.title}
                      </h3>
                      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                        {microjob.locationName}
                      </p>
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

                  <p className="mt-4 text-sm leading-7 text-[var(--color-text-muted)]">
                    {truncateText(microjob.description || microjob.shortDescription, 220)}
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <div className="rounded-[1rem] bg-[var(--color-primary-softer)] px-3 py-2.5">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                        Duración
                      </p>
                      <p className="mt-1 font-semibold text-[var(--color-primary-strong)]">
                        {microjob.estimatedDuration}
                      </p>
                    </div>
                    <div className="rounded-[1rem] bg-[var(--color-primary-softer)] px-3 py-2.5">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                        Habilidad
                      </p>
                      <p className="mt-1 font-semibold text-[var(--color-primary-strong)]">
                        {microjob.requiredSkill}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-start">
                    <button
                      type="button"
                      onClick={() => onOpenDetail(microjob.id)}
                      className="inline-flex min-h-[42px] items-center justify-center rounded-[0.95rem] border border-[var(--color-primary-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-primary)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
                    >
                      Ver detalle
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default CompanyMicrojobs
