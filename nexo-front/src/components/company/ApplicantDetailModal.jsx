import CompanyModalShell from './CompanyModalShell'
import StatusBadge from './StatusBadge'

function InfoBlock({ title, children }) {
  return (
    <div className="rounded-[1.2rem] border border-[var(--color-primary-border)] bg-white p-4">
      <p className="text-sm font-semibold text-[var(--color-primary)]">{title}</p>
      <div className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">{children}</div>
    </div>
  )
}

function ApplicantDetailModal({ applicant, isOpen, onClose }) {
  if (!applicant) {
    return null
  }

  return (
    <CompanyModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={applicant.name}
      description="Perfil mock del postulante y su contexto de aplicación."
      size="xl"
    >
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-4">
          <div className="rounded-[1.3rem] border border-[var(--color-primary-border)] bg-[linear-gradient(180deg,#ffffff_0%,#f4f7fb_100%)] p-4">
            <div className="flex items-center gap-3">
              <img
                src={applicant.imageSrc}
                alt={applicant.name}
                className="h-16 w-16 rounded-full object-cover"
              />
              <div>
                <h3 className="text-xl font-bold tracking-[-0.03em] text-[var(--color-primary-strong)]">
                  {applicant.name}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {applicant.microjobTitle}
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <StatusBadge status={applicant.status} />
              <span className="inline-flex rounded-full bg-[var(--color-primary-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-primary)]">
                Perfil completado {applicant.profileCompleted}
              </span>
            </div>
          </div>

          <InfoBlock title="Datos principales">
            <ul className="space-y-2">
              {applicant.mainData.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </InfoBlock>

          <InfoBlock title="Disponibilidad">
            {applicant.availability}
            <p className="mt-2 text-sm font-semibold text-[var(--color-primary-strong)]">
              Distancia aproximada: {applicant.distanceKm === 0 ? 'Remoto' : `${applicant.distanceKm} km`}
            </p>
          </InfoBlock>
        </div>

        <div className="space-y-4">
          <InfoBlock title="Microtrabajo aplicado">
            {applicant.microjobTitle}
          </InfoBlock>
          <InfoBlock title="Estado actual">
            {applicant.status}
          </InfoBlock>
          <InfoBlock title="Educación">
            {applicant.education}
          </InfoBlock>
          <InfoBlock title="Experiencia">
            {applicant.experience}
          </InfoBlock>
          <InfoBlock title="Cursos completados">
            <div className="flex flex-wrap gap-2">
              {applicant.completedCourses.map((course) => (
                <span
                  key={course}
                  className="inline-flex rounded-full border border-[var(--color-primary-border)] bg-[var(--color-primary-softer)] px-3 py-1 text-xs font-semibold text-[var(--color-primary-strong)]"
                >
                  {course}
                </span>
              ))}
            </div>
          </InfoBlock>
          <InfoBlock title="Historial breve">
            {applicant.shortHistory}
          </InfoBlock>
        </div>
      </div>
    </CompanyModalShell>
  )
}

export default ApplicantDetailModal
