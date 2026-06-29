import EmptyState from './EmptyState'
import StatusBadge from './StatusBadge'

function truncateCourses(courses, max = 2) {
  if (!courses.length) {
    return 'Sin cursos'
  }

  if (courses.length <= max) {
    return courses.join(', ')
  }

  return `${courses.slice(0, max).join(', ')} +${courses.length - max}`
}

function CompanyApplicants({
  applicants,
  activeFiltersCount,
  onOpenFilters,
  onOpenDetail,
  onUpdateStatus,
}) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 rounded-[1.45rem] border border-[var(--color-primary-border)] bg-white p-5 shadow-[0_18px_32px_rgba(4,44,83,0.05)] lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--color-primary)]">Postulantes</p>
          <h2 className="mt-1 text-[1.55rem] font-extrabold tracking-[-0.05em] text-[var(--color-primary-strong)]">
            Revisa candidatos y gestiona sus postulaciones.
          </h2>
        </div>
        <button
          type="button"
          onClick={onOpenFilters}
          className="inline-flex min-h-[44px] items-center justify-center rounded-[0.95rem] border border-[var(--color-primary-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-primary)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
        >
          Filtros{activeFiltersCount ? ` · ${activeFiltersCount}` : ''}
        </button>
      </div>

      {!applicants.length ? (
        <EmptyState
          title="No hay postulantes con estos filtros"
          description="Prueba otra combinación o vuelve a revisar cuando ingresen nuevas candidaturas."
        />
      ) : (
        <div className="space-y-3">
          {applicants.map((applicant) => (
            <article
              key={applicant.id}
              className="rounded-[1.35rem] border border-[var(--color-primary-border)] bg-white p-4 shadow-[0_16px_26px_rgba(4,44,83,0.04)]"
            >
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_1fr_0.75fr_0.65fr_0.9fr_auto] xl:items-center">
                <div className="flex items-center gap-3">
                  <img
                    src={applicant.imageSrc}
                    alt={applicant.name}
                    className="h-11 w-11 shrink-0 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[var(--color-primary-strong)]">
                      {applicant.name}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-[var(--color-text-muted)]">
                      {applicant.mainData[0]}
                    </p>
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                    Microtrabajo
                  </p>
                  <p className="mt-1 truncate text-sm font-semibold text-[var(--color-primary-strong)]">
                    {applicant.microjobTitle}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                    Estado
                  </p>
                  <div className="mt-1">
                    <StatusBadge status={applicant.status} />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                    Perfil
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--color-primary-strong)]">
                    {applicant.profileCompleted}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                    Cursos
                  </p>
                  <p className="mt-1 truncate text-sm text-[var(--color-primary-strong)]">
                    {truncateCourses(applicant.relatedCourses)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 xl:justify-end">
                  <button
                    type="button"
                    onClick={() => onOpenDetail(applicant.id)}
                    className="inline-flex min-h-[38px] items-center justify-center rounded-[0.9rem] border border-[var(--color-primary-border)] px-3.5 py-2 text-sm font-semibold text-[var(--color-primary)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
                  >
                    Ver perfil
                  </button>
                  {applicant.status !== 'Aceptada' && applicant.status !== 'Rechazada' ? (
                    <button
                      type="button"
                      onClick={() => onUpdateStatus(applicant.id, 'Aceptada')}
                      className="inline-flex min-h-[38px] items-center justify-center rounded-[0.9rem] bg-[var(--color-primary)] px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
                    >
                      Aceptar
                    </button>
                  ) : null}
                  {applicant.status !== 'Rechazada' ? (
                    <button
                      type="button"
                      onClick={() => onUpdateStatus(applicant.id, 'Rechazada')}
                      className="inline-flex min-h-[38px] items-center justify-center rounded-[0.9rem] border border-[var(--color-danger-border)] bg-[var(--color-danger-soft)] px-3.5 py-2 text-sm font-semibold text-[var(--color-danger)] transition hover:border-[var(--color-danger)] focus:outline-none focus:ring-4 focus:ring-[var(--color-danger-soft)]"
                    >
                      Rechazar
                    </button>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default CompanyApplicants
