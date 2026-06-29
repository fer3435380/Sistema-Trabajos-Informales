import MapPreview from './MapPreview'
import WorkerModalShell from './WorkerModalShell'

function ScheduleField({ label, value }) {
  return (
    <div className="rounded-[1rem] bg-[var(--color-primary-softer)] px-3 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-[var(--color-primary-strong)]">{value}</p>
    </div>
  )
}

function ApplicationScheduleModal({ application, isOpen, onClose }) {
  const schedule = application?.schedule

  return (
    <WorkerModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={application ? `Microtrabajo aceptado: ${application.title}` : 'Agenda asignada'}
      description="Aquí puedes revisar el día, horario, ubicación y datos clave para continuar."
      size="xl"
    >
      {application && schedule ? (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            <ScheduleField label="Día asignado" value={schedule.assignedDate} />
            <ScheduleField label="Hora de inicio" value={schedule.startTime} />
            <ScheduleField label="Hora de fin" value={schedule.endTime} />
            <ScheduleField label="Ubicación" value={schedule.locationName} />
            <ScheduleField label="Cómo llegar" value={schedule.directions} />
            <ScheduleField label="Contacto o responsable" value={schedule.contactName} />
            <ScheduleField label="Instrucciones" value={schedule.instructions} />
          </div>

          <MapPreview
            latitude={schedule.latitude}
            longitude={schedule.longitude}
            locationName={schedule.locationName}
            address={schedule.address}
            mapsUrl={schedule.mapsUrl}
          />

          <div className="rounded-[1.2rem] border border-[var(--color-primary-border)] p-4">
            <p className="text-sm font-semibold text-[var(--color-primary-strong)]">
              Recomendaciones
            </p>
            <div className="mt-3 space-y-2">
              {schedule.recommendations.map((recommendation) => (
                <p key={recommendation} className="text-sm leading-6 text-[var(--color-text-muted)]">
                  {recommendation}
                </p>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </WorkerModalShell>
  )
}

export default ApplicationScheduleModal
