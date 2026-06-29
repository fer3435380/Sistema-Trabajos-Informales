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

function CourseDetailModal({ course, isOpen, onClose, onStartCourse }) {
  return (
    <WorkerModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={course?.title || 'Detalle del curso'}
      description="Revisa el contenido del curso y la habilidad que puede desbloquear."
      size="xl"
      footer={
        course ? (
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
              onClick={() => onStartCourse(course.id)}
              className="inline-flex min-h-[42px] items-center justify-center rounded-[0.95rem] bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
            >
              {course.progress > 0 ? 'Continuar más tarde' : 'Iniciar curso'}
            </button>
          </div>
        ) : null
      }
    >
      {course ? (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[0.85fr_1.15fr]">
            <img
              src={course.imageSrc}
              alt={course.imageAlt || course.title}
              className="h-56 w-full rounded-[1.25rem] object-cover"
            />

            <div className="rounded-[1.25rem] border border-[var(--color-primary-border)] p-4">
              <p className="text-sm leading-7 text-[var(--color-text-muted)]">{course.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            <DetailField label="Categoría" value={course.category} />
            <DetailField label="Nivel" value={course.level} />
            <DetailField label="Duración estimada" value={course.durationLabel} />
            <DetailField label="Módulos" value={course.modules.length} />
            <DetailField label="Habilidad que desbloquea" value={course.skillUnlocked} />
            <DetailField label="Evaluación" value={course.assessmentType} />
            <DetailField label="Recursos" value="Video, lectura, actividad y pregunta" />
            <DetailField
              label="Microtrabajos relacionados"
              value={course.relatedMicrojobTitles.join(', ') || 'Sin relación directa por ahora'}
            />
            <DetailField label="H5P" value="Se conectará como integración futura." />
          </div>

          <div className="rounded-[1.2rem] border border-[var(--color-primary-border)] p-4">
            <p className="text-sm font-semibold text-[var(--color-primary-strong)]">Módulos</p>
            <div className="mt-3 space-y-2">
              {course.modules.map((module) => (
                <div
                  key={module.id}
                  className="flex items-center justify-between gap-3 rounded-[1rem] bg-[var(--color-primary-softer)] px-3 py-2.5"
                >
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-primary-strong)]">
                      {module.title}
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">{module.type}</p>
                  </div>
                  <span className="text-sm font-semibold text-[var(--color-primary)]">
                    {module.durationMinutes} min
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </WorkerModalShell>
  )
}

export default CourseDetailModal
