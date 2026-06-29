import trabajosIcon from '../../assets/CompanyDashboard/trabajos.png'
import cursosIcon from '../../assets/CompanyDashboard/cursos.png'
import postulacionesIcon from '../../assets/WorkerDashboard/postulaciones.png'

const iconMap = {
  activeMicrojobs: { src: trabajosIcon },
  newApplicants: { src: postulacionesIcon },
  publishedCourses: { src: cursosIcon },
}

const cardLabels = {
  activeMicrojobs: 'Microtrabajos activos',
  newApplicants: 'Postulantes nuevos',
  publishedCourses: 'Cursos publicados',
}

function CompanySummaryCards({ summary }) {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {Object.entries(summary).map(([key, value]) => {
        const iconEntry = iconMap[key]

        if (!iconEntry || !cardLabels[key]) {
          return null
        }

        return (
          <article
            key={key}
            className="rounded-[1.35rem] border border-[var(--color-primary-border)] bg-white p-4 shadow-[0_18px_32px_rgba(4,44,83,0.05)]"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-[1rem] bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                <img
                  src={iconEntry.src}
                  alt=""
                  aria-hidden="true"
                  className="icon-primary h-5 w-5 object-contain"
                />
              </div>
              <p className="text-[2rem] font-extrabold tracking-[-0.06em] text-[var(--color-primary-strong)]">
                {value}
              </p>
            </div>
            <p className="mt-4 text-sm font-semibold text-[var(--color-text-muted)]">
              {cardLabels[key]}
            </p>
          </article>
        )
      })}
    </section>
  )
}

export default CompanySummaryCards
