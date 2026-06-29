import EmptyState from './EmptyState'
import StatusBadge from './StatusBadge'

function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) {
    return text
  }

  return `${text.slice(0, maxLength).trim()}...`
}

function CompanyModules({ modules, onEditModule, onViewCourse }) {
  return (
    <section className="space-y-4">
      <div className="rounded-[1.45rem] border border-[var(--color-primary-border)] bg-white p-5 shadow-[0_18px_32px_rgba(4,44,83,0.05)]">
        <p className="text-sm font-semibold text-[var(--color-primary)]">Módulos</p>
        <h2 className="mt-1 text-[1.55rem] font-extrabold tracking-[-0.05em] text-[var(--color-primary-strong)]">
          Organiza el contenido de tus cursos por módulos.
        </h2>
      </div>

      {!modules.length ? (
        <EmptyState
          title="No hay módulos disponibles"
          description="Crea o publica cursos para administrar sus módulos desde aquí."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {modules.map((module) => (
            <article
              key={module.id}
              className="overflow-hidden rounded-[1.35rem] border border-[var(--color-primary-border)] bg-white p-4 shadow-[0_16px_26px_rgba(4,44,83,0.04)]"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={module.status} />
                      <span className="rounded-full bg-[var(--color-primary-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-primary)]">
                        {module.moduleType}
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-[var(--color-text-muted)]">
                      {module.courseTitle}
                    </p>
                    <h3 className="mt-1 text-[1.08rem] font-bold tracking-[-0.04em] text-[var(--color-primary-strong)]">
                      {module.order}. {module.title}
                    </h3>
                  </div>

                  <div className="rounded-[1rem] bg-[var(--color-primary-softer)] px-3 py-2 text-right">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                      Duración
                    </p>
                    <p className="mt-1 text-sm font-bold text-[var(--color-primary-strong)]">
                      {module.duration}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-7 text-[var(--color-text-muted)]">
                  {truncateText(module.videoDescription || module.summary, 220)}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <div className="rounded-full bg-[var(--color-primary-softer)] px-3 py-1 text-xs font-semibold text-[var(--color-text-muted)]">
                    Orden {module.order}
                  </div>
                  {module.videoTitle ? (
                    <div className="rounded-full bg-[var(--color-amber-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-primary-strong)]">
                      {module.videoTitle}
                    </div>
                  ) : null}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onEditModule(module)}
                    className="inline-flex min-h-[42px] items-center justify-center rounded-[0.95rem] border border-[var(--color-primary-border)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
                  >
                    Editar módulo
                  </button>
                  <button
                    type="button"
                    onClick={() => onViewCourse(module.courseId)}
                    className="inline-flex min-h-[42px] items-center justify-center rounded-[0.95rem] bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
                  >
                    Ver curso
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default CompanyModules
