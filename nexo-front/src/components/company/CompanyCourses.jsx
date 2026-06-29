import EmptyState from './EmptyState'
import StatusBadge from './StatusBadge'

function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) {
    return text
  }

  return `${text.slice(0, maxLength).trim()}...`
}

function CompanyCourses({
  courses,
  activeFiltersCount,
  onOpenFilters,
  onOpenWizard,
  onOpenDetail,
}) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 rounded-[1.45rem] border border-[var(--color-primary-border)] bg-white p-5 shadow-[0_18px_32px_rgba(4,44,83,0.05)] lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--color-primary)]">Cursos</p>
          <h2 className="mt-1 text-[1.55rem] font-extrabold tracking-[-0.05em] text-[var(--color-primary-strong)]">
            Crea cursos que desbloquean habilidades y microtrabajos.
          </h2>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onOpenWizard}
            className="inline-flex min-h-[44px] items-center justify-center rounded-[0.95rem] bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
          >
            Crear curso
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

      {!courses.length ? (
        <EmptyState
          title="No hay cursos con estos filtros"
          description="Ajusta la búsqueda o crea un curso para seguir desbloqueando oportunidades."
          buttonLabel="Crear curso"
          onAction={onOpenWizard}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {courses.map((course) => (
            <article
              key={course.id}
              className="overflow-hidden rounded-[1.45rem] border border-[var(--color-primary-border)] bg-white p-4 shadow-[0_16px_26px_rgba(4,44,83,0.04)]"
            >
              <div className="flex flex-col gap-4 sm:flex-row">
                <img
                  src={course.imageSrc}
                  alt={course.imageAlt || course.title}
                  className="h-44 w-full rounded-[1.2rem] object-cover sm:h-auto sm:w-40 sm:shrink-0"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={course.status} />
                        <span className="rounded-full bg-[var(--color-primary-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-primary)]">
                          {course.category}
                        </span>
                        <span className="rounded-full bg-[var(--color-primary-softer)] px-3 py-1 text-xs font-semibold text-[var(--color-text-muted)]">
                          {course.level}
                        </span>
                      </div>
                      <h3 className="mt-3 text-[1.08rem] font-bold tracking-[-0.04em] text-[var(--color-primary-strong)]">
                        {course.title}
                      </h3>
                    </div>

                    <div className="rounded-[1rem] bg-[var(--color-primary-softer)] px-3 py-2 text-right">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                        Duración
                      </p>
                      <p className="mt-1 text-sm font-bold text-[var(--color-primary-strong)]">
                        {course.durationLabel}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-[var(--color-text-muted)]">
                    {truncateText(course.description, 220)}
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <div className="rounded-[1rem] bg-[var(--color-primary-softer)] px-3 py-2.5">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                        Habilidad
                      </p>
                      <p className="mt-1 font-semibold text-[var(--color-primary-strong)]">
                        {course.skillUnlocked}
                      </p>
                    </div>
                    <div className="rounded-[1rem] bg-[var(--color-primary-softer)] px-3 py-2.5">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                        Módulos
                      </p>
                      <p className="mt-1 font-semibold text-[var(--color-primary-strong)]">
                        {course.modules.length}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-start">
                    <button
                      type="button"
                      onClick={() => onOpenDetail(course.id)}
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

export default CompanyCourses
