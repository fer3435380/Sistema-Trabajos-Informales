function WorkerSettingsPanel({ settings, workerProfile, onAction, onResetDemoData }) {
  function handleReset() {
    if (window.confirm('¿Restablecer los datos de prueba? Se borrarán los cambios locales y volverás al inicio de sesión.')) {
      onResetDemoData()
    }
  }

  return (
    <div className="space-y-4">
      <section className="rounded-[1.45rem] border border-[var(--color-primary-border)] bg-white p-4 shadow-[0_18px_32px_rgba(4,44,83,0.05)] md:p-5">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-[var(--color-primary)]">Cuenta</p>
            <h2 className="text-[1.55rem] font-extrabold tracking-[-0.05em] text-[var(--color-primary-strong)]">
              Configuración
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">
              Ajusta accesos rápidos de perfil, alertas y sesión desde un solo lugar.
            </p>
          </div>

          <div className="rounded-[1.35rem] border border-[var(--color-primary-border)] bg-[var(--color-primary-softer)] p-4">
            <p className="text-sm font-semibold text-[var(--color-primary)]">Cuenta activa</p>
            <div className="mt-3 flex items-center gap-3">
              <img
                src={workerProfile.profileImageSrc}
                alt={workerProfile.profileImageAlt}
                className="h-14 w-14 rounded-[1rem] object-cover"
              />
              <div>
                <p className="text-base font-bold text-[var(--color-primary-strong)]">
                  {workerProfile.name}
                </p>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  {workerProfile.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
        {settings.map((setting) => (
          <article
            key={setting.id}
            className="rounded-[1.35rem] border border-[var(--color-primary-border)] bg-white p-4 shadow-[0_18px_30px_rgba(4,44,83,0.05)]"
          >
            <p className="text-sm font-semibold text-[var(--color-primary)]">{setting.value}</p>
            <h3 className="mt-2 text-lg font-bold tracking-[-0.03em] text-[var(--color-primary-strong)]">
              {setting.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
              {setting.description}
            </p>
            <button
              type="button"
              onClick={() => onAction(setting)}
              className="mt-4 inline-flex min-h-[40px] items-center justify-center rounded-[0.95rem] border border-[var(--color-primary-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-primary)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
            >
              {setting.buttonLabel}
            </button>
          </article>
        ))}
      </div>

      {onResetDemoData ? (
        <div className="rounded-[1.35rem] border border-[var(--color-primary-border)] bg-[var(--color-primary-softer)] p-4">
          <h3 className="text-lg font-bold tracking-[-0.03em] text-[var(--color-primary-strong)]">
            Datos de prueba
          </h3>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
            Herramienta de desarrollo: restablece el estado mock de NexoJobs a su versión inicial.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-4 inline-flex min-h-[42px] items-center justify-center rounded-[0.95rem] border border-[var(--color-danger-border)] bg-[var(--color-danger-soft)] px-4 py-2 text-sm font-semibold text-[var(--color-danger)] transition hover:border-[var(--color-danger)] focus:outline-none focus:ring-4 focus:ring-[var(--color-danger-soft)]"
          >
            Restablecer datos de prueba
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default WorkerSettingsPanel
