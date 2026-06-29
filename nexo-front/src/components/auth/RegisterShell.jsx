import brandIcon from '../../assets/landing/nexotrabajo_icono.png'
import { Link } from 'react-router-dom'
import StepIndicator from './StepIndicator'

function RegisterShell({
  title,
  subtitle,
  steps = [],
  currentStep = 0,
  onStepChange,
  isStepComplete,
  canAccessStep,
  children,
  cardWidth = 'max-w-5xl',
}) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(145deg,#3a7fc2_0%,#1e67ae_36%,#0d4d8e_72%,#073b6c_100%)] px-4 py-6 md:px-8 lg:flex lg:items-center lg:justify-center">
      <div className="pointer-events-none absolute left-[-100px] top-[-60px] h-[280px] w-[280px] rounded-full bg-white/10 blur-3xl lg:h-[360px] lg:w-[360px]" />
      <div className="pointer-events-none absolute bottom-[-120px] right-[-80px] h-[260px] w-[260px] rounded-full bg-white/8 blur-3xl lg:h-[340px] lg:w-[340px]" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-220px] top-[-180px] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.06)_45%,rgba(255,255,255,0)_74%)] lg:h-[700px] lg:w-[700px]" />
        <div className="absolute bottom-[-260px] left-[-20px] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(110,186,255,0.28)_0%,rgba(110,186,255,0.08)_46%,rgba(110,186,255,0)_74%)] lg:h-[720px] lg:w-[720px]" />
        <div className="absolute right-[-200px] top-[0] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_44%,rgba(255,255,255,0)_76%)] lg:h-[560px] lg:w-[560px]" />
        <div className="absolute left-[12%] top-[18%] h-[240px] w-[240px] rounded-full border border-white/12 bg-[radial-gradient(circle,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.03)_56%,rgba(255,255,255,0)_80%)] lg:h-[320px] lg:w-[320px]" />
        <div className="absolute bottom-[14%] left-[22%] h-[220px] w-[220px] rounded-full border border-white/10 bg-[radial-gradient(circle,rgba(132,197,255,0.2)_0%,rgba(132,197,255,0.04)_54%,rgba(132,197,255,0)_80%)] lg:h-[300px] lg:w-[300px]" />
        <div className="absolute right-[18%] top-[22%] hidden h-36 w-36 rounded-full border border-white/12 bg-white/6 lg:block" />
        <div className="absolute left-[45%] top-[52%] hidden h-16 w-16 rounded-full border border-white/10 bg-white/6 lg:block" />
      </div>
      <div className="absolute left-6 top-6 sm:left-8 lg:left-10 lg:top-10">
        <Link
          to="/"
          aria-label="Volver al inicio"
          className="inline-flex items-center justify-center rounded-full border border-white/18 bg-white/10 p-3 backdrop-blur-md transition hover:bg-white/16 focus:outline-none focus:ring-4 focus:ring-white/25 lg:p-3.5"
        >
          <img
            src={brandIcon}
            alt="NexoJobs"
            className="h-14 w-14 object-contain lg:h-16 lg:w-16"
          />
        </Link>
      </div>
      <section className={`relative mx-auto w-full ${cardWidth}`}>
        <div className="mx-auto w-full rounded-[2rem] border border-[var(--color-primary-border)] bg-white p-5 shadow-[0_30px_80px_rgba(4,44,83,0.34)] md:p-8">
          <div className="space-y-6">
            <header className="space-y-4">
              <div className="inline-flex items-center rounded-full border border-[var(--color-primary-border)] bg-[var(--color-primary-softer)] px-4 py-2.5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
                    NexoJobs
                  </p>
                  <p className="text-sm font-medium text-[var(--color-text-muted)]">
                    Registro guiado
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-[2rem] font-bold tracking-[-0.05em] text-[var(--color-text)] md:text-[2.4rem]">
                  {title}
                </h1>
                <p className="max-w-[40rem] text-sm leading-7 text-[var(--color-text-muted)] md:text-base">
                  {subtitle}
                </p>
              </div>
            </header>

            {steps.length ? (
              <StepIndicator
                steps={steps}
                currentStep={currentStep}
                onStepChange={onStepChange}
                isStepComplete={isStepComplete}
                canAccessStep={canAccessStep}
              />
            ) : null}

            {children}
          </div>
        </div>
      </section>
    </main>
  )
}

export default RegisterShell
