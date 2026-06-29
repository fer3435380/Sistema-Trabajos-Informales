import CourseCard from './CourseCard'
import EmptyState from './EmptyState'

function WorkerAvailableCourses({
  courses,
  activeFiltersCount,
  onOpenFilters,
  onOpenDetail,
  onStartCourse,
}) {
  return (
    <div className="space-y-4">
      <section className="rounded-[1.45rem] border border-[var(--color-primary-border)] bg-white p-4 shadow-[0_18px_32px_rgba(4,44,83,0.05)] md:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-[var(--color-primary)]">Formación</p>
            <h2 className="text-[1.55rem] font-extrabold tracking-[-0.05em] text-[var(--color-primary-strong)]">
              Cursos disponibles
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">
              Elige un curso para desbloquear nuevas opciones de trabajo.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenFilters}
            className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-[0.95rem] border border-[var(--color-primary-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-primary)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
          >
            Filtros
            {activeFiltersCount > 0 ? (
              <span className="rounded-full bg-[var(--color-primary)] px-2 py-0.5 text-xs text-white">
                {activeFiltersCount}
              </span>
            ) : null}
          </button>
        </div>
      </section>

      {courses.length ? (
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onOpenDetail={onOpenDetail}
              onStartCourse={onStartCourse}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No hay cursos disponibles por ahora"
          description="Pronto encontrarás nuevas rutas de aprendizaje para desbloquear más microtrabajos."
        />
      )}
    </div>
  )
}

export default WorkerAvailableCourses
