import CompanyModalShell from './CompanyModalShell'

function CompanySettingsPanel({ settings, activeAction, onOpenAction, onCloseAction, onResetDemoData }) {
  function handleReset() {
    if (window.confirm('¿Restablecer los datos de prueba? Se borrarán los cambios locales y volverás al inicio de sesión.')) {
      onResetDemoData()
    }
  }

  return (
    <>
      <section className="space-y-4">
        <div className="rounded-[1.45rem] border border-[var(--color-primary-border)] bg-white p-5 shadow-[0_18px_32px_rgba(4,44,83,0.05)]">
          <p className="text-sm font-semibold text-[var(--color-primary)]">Configuración</p>
          <h2 className="mt-1 text-[1.55rem] font-extrabold tracking-[-0.05em] text-[var(--color-primary-strong)]">
            Ajusta preferencias de notificación, idioma, privacidad y tema visual.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {settings.map((setting) => (
            <article
              key={setting.id}
              className="rounded-[1.35rem] border border-[var(--color-primary-border)] bg-white p-4 shadow-[0_16px_26px_rgba(4,44,83,0.04)]"
            >
              <h3 className="text-lg font-bold tracking-[-0.03em] text-[var(--color-primary-strong)]">
                {setting.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                {setting.description}
              </p>
              <button
                type="button"
                onClick={() => onOpenAction(setting)}
                className="mt-4 inline-flex min-h-[42px] items-center justify-center rounded-[0.95rem] border border-[var(--color-primary-border)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
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
      </section>

      <CompanyModalShell
        isOpen={Boolean(activeAction)}
        onClose={onCloseAction}
        title={activeAction?.title || 'Configuración'}
        description="Este flujo sigue siendo mock en la fase actual."
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm leading-7 text-[var(--color-text-muted)]">
            {activeAction?.description}
          </p>
          <div className="rounded-[1.15rem] border border-[var(--color-primary-border)] bg-[var(--color-primary-softer)] p-4">
            <p className="text-sm font-semibold text-[var(--color-primary-strong)]">
              Próximo paso
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
              En una fase posterior este ajuste se conectará a autenticación protegida, backend y persistencia real.
            </p>
          </div>
        </div>
      </CompanyModalShell>
    </>
  )
}

export default CompanySettingsPanel
