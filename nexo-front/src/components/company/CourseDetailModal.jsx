import StatusBadge from './StatusBadge'
import CompanyModalShell from './CompanyModalShell'

function SummaryItem({ label, value }) {
  return (
    <div className="rounded-[1rem] border border-[var(--color-primary-border)] bg-[var(--color-primary-softer)] p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
        {label}
      </p>
      <p className="mt-1 text-sm leading-6 text-[var(--color-primary-strong)]">{value}</p>
    </div>
  )
}

function CourseDetailModal({ course, isOpen, onClose, onEdit, onDelete, onEditModule }) {
  if (!course) {
    return null
  }

  function handleDelete() {
    if (window.confirm(`¿Eliminar el curso “${course.title}”? Esta acción no se puede deshacer.`)) {
      onDelete(course.id)
    }
  }

  return (
    <CompanyModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={course.title}
      description="Revisa la estructura, relaciones y evaluación del curso."
      size="xl"
    >
      <div className="space-y-5">
        <div className="overflow-hidden rounded-[1.3rem] border border-[var(--color-primary-border)] bg-[linear-gradient(180deg,#f8fbff_0%,#eef4fa_100%)] p-3">
          <img
            src={course.imageSrc}
            alt={course.imageAlt}
            className="h-auto max-h-[24rem] w-full rounded-[1rem] object-contain"
          />
        </div>

        <div className="rounded-[1.3rem] border border-[var(--color-primary-border)] bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={course.status} />
              <span className="inline-flex rounded-full bg-[var(--color-primary-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-primary)]">
                {course.category}
              </span>
              <span className="inline-flex rounded-full bg-[var(--color-primary-softer)] px-3 py-1 text-xs font-semibold text-[var(--color-text-muted)]">
                {course.level}
              </span>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <button
                type="button"
                onClick={onEdit}
                className="inline-flex min-h-[42px] items-center justify-center rounded-[0.95rem] border border-[var(--color-primary-border)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
              >
                Editar curso
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
          <p className="mt-4 text-sm leading-7 text-[var(--color-text-muted)]">
            {course.description}
          </p>
        </div>

        <div className="rounded-[1.3rem] border border-[var(--color-primary-border)] bg-white p-4">
          <p className="text-sm font-semibold text-[var(--color-primary)]">Resumen rápido</p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryItem label="Duración" value={course.durationLabel} />
            <SummaryItem label="Habilidad" value={course.skillUnlocked} />
            <SummaryItem label="Evaluación" value={course.assessmentType} />
            <SummaryItem label="Microtrabajos" value={course.relatedMicrojobs.length} />
          </div>
          {course.assessmentType === 'H5P' ? (
            <p className="mt-4 text-xs leading-5 text-[var(--color-text-muted)]">
              Las actividades H5P se conectarán en una fase posterior.
            </p>
          ) : null}
        </div>

        <div className="rounded-[1.3rem] border border-[var(--color-primary-border)] bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-[var(--color-primary)]">Módulos del curso</p>
            <span className="rounded-full bg-[var(--color-primary-softer)] px-3 py-1 text-xs font-semibold text-[var(--color-text-muted)]">
              {course.modules.length} módulos
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {course.modules.map((module) => (
              <article
                key={module.id}
                className="rounded-[1rem] border border-[var(--color-primary-border)] bg-[var(--color-primary-softer)] p-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-primary-strong)]">
                        {module.order}. {module.title}
                      </p>
                      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                        {module.moduleType} · {module.duration}
                      </p>
                    </div>
                    <StatusBadge status={module.status} />
                  </div>

                  <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
                    {module.videoDescription || module.summary}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onEditModule(module)}
                      className="inline-flex min-h-[38px] items-center justify-center rounded-[0.9rem] border border-[var(--color-primary-border)] px-3.5 py-2 text-sm font-semibold text-[var(--color-primary)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
                    >
                      Editar módulo
                    </button>
                  </div>

                  {module.moduleType === 'Video' ? (
                    <div className="mt-3 rounded-[0.95rem] bg-white p-3">
                      <p className="text-sm font-semibold text-[var(--color-primary-strong)]">
                        {module.videoTitle}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">
                        Recurso mock: {module.videoResource}
                      </p>
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[1.3rem] border border-[var(--color-primary-border)] bg-white p-4">
          <p className="text-sm font-semibold text-[var(--color-primary)]">
            Microtrabajos relacionados
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {course.relatedMicrojobs.map((microjob) => (
              <span
                key={microjob.id}
                className="inline-flex rounded-full border border-[var(--color-primary-border)] bg-[var(--color-primary-softer)] px-3 py-1 text-xs font-semibold text-[var(--color-primary-strong)]"
              >
                {microjob.title}
              </span>
            ))}
          </div>
        </div>
      </div>
    </CompanyModalShell>
  )
}

export default CourseDetailModal
