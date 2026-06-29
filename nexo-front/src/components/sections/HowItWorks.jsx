import courseIconImage from '../../assets/landing/hero-course-icon.png'
import certificateIconImage from '../../assets/landing/hero-capacit-icon.png'
import opportunityIconImage from '../../assets/landing/hero-opportunity-icon.png'
import StepCard from '../ui/StepCard'
import OpportunityMockPanel from '../ui/OpportunityMockPanel'

const steps = [
  {
    step: '1',
    title: 'Aprende',
    description: 'Accede a cursos cortos y gratuitos.',
    tone: 'blue',
    icon: courseIconImage,
    delayClass: 'section-delay-1',
  },
  {
    step: '2',
    title: 'Certifica',
    description: 'Aprueba evaluaciones y valida habilidades.',
    tone: 'amber',
    icon: certificateIconImage,
    delayClass: 'section-delay-2',
  },
  {
    step: '3',
    title: 'Postula',
    description: 'Recibe oportunidades según tu perfil.',
    tone: 'navy',
    icon: opportunityIconImage,
    delayClass: 'section-delay-3',
  },
]

const workerFeatures = [
  'Cursos gratuitos y prácticos',
  'Perfil con tus habilidades',
  'Trabajos cerca de ti',
  'Mejores ingresos y reputación',
]

const companyFeatures = [
  'Publica tareas en minutos',
  'Encuentra talento verificado',
  'Contratación simple y segura',
  'Resultados claros y medibles',
]

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pb-20"
    >
      <div className="mx-auto max-w-[1320px]">
        <div className="animate-section-fade text-center section-delay-1">
          <h2 className="mx-auto max-w-[15ch] text-[2.15rem] font-extrabold leading-[1.02] tracking-[-0.06em] text-[var(--color-primary-strong)] sm:text-[2.8rem] lg:text-[3.2rem]">
            De aprender a trabajar, paso a paso
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-[var(--color-text-muted)] sm:text-[17px]">
            Aprende, valida habilidades y accede a oportunidades reales.
          </p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3 lg:gap-5">
          {steps.map((step) => (
            <StepCard key={step.title} {...step} />
          ))}
        </div>

        <div
          id="opportunities"
          className="mt-10 scroll-mt-24 animate-section-rise rounded-[32px] border border-[var(--color-primary-border)] bg-white/90 px-4 py-5 shadow-[0_24px_60px_rgba(4,44,83,0.08)] backdrop-blur sm:px-6 sm:py-6 xl:px-7 xl:py-7"
        >
          <div className="text-center">
            <h2 className="mx-auto max-w-[14ch] text-[2rem] font-extrabold leading-[1.02] tracking-[-0.06em] text-[var(--color-primary-strong)] sm:text-[2.6rem]">
              Oportunidades para cada lado
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-7 text-[var(--color-text-muted)] sm:text-[17px]">
              Conectamos talento y microemprendedores para que todos crezcan.
            </p>
          </div>

          <div className="mt-6 grid gap-5 xl:grid-cols-2">
            <OpportunityMockPanel
              sectionId="workers"
              title="Para ti, trabajador"
              description="Aprende, demuestra y accede a trabajos que impulsan tu crecimiento."
              features={workerFeatures}
              actionLabel="Soy trabajador"
              imageSide="left"
              accent="amber"
            />

            <OpportunityMockPanel
              sectionId="companies"
              title="Para emprendedores"
              description="Encuentra apoyo confiable y haz crecer a tu negocio local o empresa."
              features={companyFeatures}
              actionLabel="Soy empresa"
              imageSide="right"
              accent="blue"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
