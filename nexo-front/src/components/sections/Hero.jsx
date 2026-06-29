import { Link } from 'react-router-dom'
import badgeShieldImage from '../../assets/landing/hero-badge-shield.png'
import ctaUserImage from '../../assets/landing/hero-cta-user.png'
import ctaCompanyImage from '../../assets/landing/hero-cta-company.png'
import proofAvatar1 from '../../assets/landing/hero-proof-1.png'
import proofAvatar2 from '../../assets/landing/hero-proof-2.png'
import proofAvatar3 from '../../assets/landing/hero-proof-3.png'
import profileMariaImage from '../../assets/landing/maria-profile.png'
import ratingStarImage from '../../assets/landing/hero-rating-star.png'
import opportunityIconImage from '../../assets/landing/hero-opportunity-icon.png'
import chevronRightImage from '../../assets/landing/hero-chevron-right.png'

const topTags = [
  'Cursos gratuitos',
  'Perfil por habilidades',
  'Oportunidades reales',
]

const skillTags = [
  'Atencion al cliente',
  'Excel basico',
  'Redaccion',
  'Canva',
]

const profileStats = [
  { value: '12', label: 'Cursos' },
  { value: '28', label: 'Tareas' },
  { value: '4.8', label: 'Reputacion' },
]

const opportunityRows = [
  {
    title: 'Digitacion de documentos',
    company: 'Empresa local',
    rate: '$15 / tarea',
  },
  {
    title: 'Encuesta de mercado',
    company: 'Investigacion S.A.',
    rate: '$10 / tarea',
  },
]

const socialProofImages = [proofAvatar1, proofAvatar2, proofAvatar3, profileMariaImage]

function Hero() {
  return (
    <section
      id="home"
      className="scroll-mt-28 px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pb-16 lg:pt-10"
    >
      <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-center lg:gap-16">
        <div className="max-w-[760px]">
          <div className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-[var(--color-primary-border)] bg-[var(--color-primary-soft)] px-4 py-2 text-[13px] font-semibold text-[var(--color-primary)] shadow-[0_8px_20px_rgba(24,95,165,0.08)] sm:text-[14px]">
            <a
              href="https://www.flaticon.es/autores/vectors-market"
              target="_blank"
              rel="noreferrer"
              title="Iconos disenados por Vectors Market from www.flaticon.es"
              className="inline-flex shrink-0"
            >
              <img
                src={badgeShieldImage}
                alt="Icono de escudo"
                className="icon-primary h-[18px] w-[18px] object-contain"
              />
              <span className="sr-only">
                Iconos disenados por Vectors Market from Flaticon
              </span>
            </a>

            {topTags.map((tag, index) => (
              <span key={tag} className="inline-flex items-center gap-2">
                {index > 0 && <span className="text-[#90b5da]">-</span>}
                <span>{tag}</span>
              </span>
            ))}
          </div>

          <h1 className="mt-6 max-w-[13ch] text-[2.15rem] font-extrabold leading-[1.02] tracking-[-0.06em] text-[var(--color-primary-strong)] sm:mt-8 sm:text-[3.25rem] lg:text-[4rem]">
            Aprende habilidades utiles y encuentra{' '}
            <span className="text-[var(--color-primary)]">oportunidades reales.</span>
          </h1>

          <p className="mt-6 max-w-[620px] text-[16px] leading-8 text-[var(--color-text-muted)] sm:text-[18px] sm:leading-9">
            NexoTrabajo te ayuda a capacitarte, mostrar lo que sabes hacer y
            conectarte con trabajos y tareas que si puedes aprovechar.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <Link
              to="/register/worker"
              className="inline-flex min-h-[62px] w-full items-center justify-center gap-3 rounded-[16px] bg-[var(--color-primary)] px-7 py-4 text-[17px] font-semibold text-white shadow-[0_18px_32px_rgba(24,95,165,0.22)] transition hover:bg-[var(--color-primary-strong)] sm:w-[248px]"
            >
              <span
                className="inline-flex shrink-0"
                title="Iconos disenados por Good Ware from www.flaticon.es"
              >
                <img
                  src={ctaUserImage}
                  alt="Icono agregar usuario"
                  className="icon-light h-[20px] w-[20px] object-contain"
                />
              </span>
              Crear cuenta gratis
            </Link>

            <Link
              to="/register/company"
              className="inline-flex min-h-[62px] w-full items-center justify-center gap-3 rounded-[16px] border border-[var(--color-primary-border)] bg-white px-7 py-4 text-[17px] font-semibold text-[var(--color-primary-strong)] shadow-sm transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] sm:w-[248px]"
            >
              <span
                className="inline-flex shrink-0"
                title="Iconos disenados por Zlatko Najdenovski from www.flaticon.es"
              >
                <img
                  src={ctaCompanyImage}
                  alt="Icono de edificios"
                  className="icon-primary h-[20px] w-[20px] object-contain"
                />
              </span>
              Soy empresa
            </Link>
          </div>

          <div className="sr-only">
            <a
              href="https://www.flaticon.es/autores/good-ware"
              target="_blank"
              rel="noreferrer"
            >
              Iconos disenados por Good Ware from Flaticon
            </a>
            <a
              href="https://www.flaticon.es/autores/zlatko-najdenovski"
              target="_blank"
              rel="noreferrer"
            >
              Iconos disenados por Zlatko Najdenovski from Flaticon
            </a>
          </div>

          <div className="mt-8 flex flex-col items-start gap-4 min-[480px]:flex-row min-[480px]:items-center">
            <div className="flex shrink-0 -space-x-2">
              {socialProofImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt=""
                  className="h-12 w-12 rounded-full border-[3px] border-white object-cover shadow-sm"
                />
              ))}
            </div>

            <p className="max-w-[340px] text-[14px] leading-6 text-[var(--color-text-muted)]">
              <span className="font-semibold text-[var(--color-primary-strong)]">
                +10K personas
              </span>{' '}
              ya estan aprendiendo y encontrando oportunidades.
            </p>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[540px]">
          <div className="animate-hero-glow pointer-events-none absolute inset-x-2 top-6 h-[92%] rounded-[36px] bg-[linear-gradient(135deg,rgba(231,240,250,0.96),rgba(255,255,255,0.98))]" />

          <div className="animate-hero-panel relative rounded-[30px] border border-white/85 bg-white/95 p-5 shadow-[0_28px_70px_rgba(4,44,83,0.10)] backdrop-blur sm:p-6">
            <div className="flex items-start gap-4 border-b border-[var(--color-primary-border)] pb-5">
              <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-full border border-[var(--color-primary-border)] bg-[var(--color-primary-softer)]">
                <img
                  src={profileMariaImage}
                  alt="Maria P."
                  className="absolute left-1/2 top-1/2 h-[138%] w-[138%] max-w-none -translate-x-1/2 -translate-y-[40%] object-cover"
                />
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-[1.95rem] font-bold tracking-[-0.05em] text-[var(--color-primary-strong)]">
                  Maria P.
                </h2>
                <p className="mt-1 text-[14px] text-[var(--color-text-muted)]">
                  Miembro desde enero 2025
                </p>

                <div className="mt-2 flex items-center gap-2 text-[13px] text-[var(--color-text-muted)]">
                  <a
                    href="https://www.flaticon.es/autores/pixel-perfect"
                    target="_blank"
                    rel="noreferrer"
                    title="Iconos disenados por Pixel perfect from www.flaticon.es"
                    className="inline-flex shrink-0"
                  >
                    <img
                      src={ratingStarImage}
                      alt="Icono de estrella"
                      className="icon-amber h-[14px] w-[14px] object-contain"
                    />
                    <span className="sr-only">
                      Iconos disenados por Pixel perfect from Flaticon
                    </span>
                  </a>
                  <span className="font-semibold text-[var(--color-amber)]">4.8</span>
                  <span>-</span>
                  <span>128 valoraciones</span>
                </div>
              </div>
            </div>

            <div className="mx-auto grid max-w-[360px] grid-cols-3 gap-3 border-b border-[var(--color-primary-border)] py-5 text-center">
              {profileStats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-[1.65rem] font-bold tracking-[-0.05em] text-[var(--color-primary)]">
                    {stat.value}
                  </p>
                  <p className="text-[12px] text-[var(--color-text-muted)]">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="border-b border-[var(--color-primary-border)] py-5">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-[14px] font-bold text-[var(--color-primary-strong)]">
                  Habilidades
                </h3>
                <button className="text-[14px] font-semibold text-[var(--color-primary)] transition hover:text-[var(--color-primary-strong)]">
                  Ver mas
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {skillTags.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-[var(--color-primary-soft)] px-3 py-1.5 text-[12px] font-semibold text-[var(--color-primary)]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-5">
              <h3 className="text-[14px] font-bold text-[var(--color-primary-strong)]">
                Oportunidades disponibles
              </h3>

              <div className="mt-4 space-y-3">
                {opportunityRows.map((row, index) => (
                  <article
                    key={row.title}
                    className={`animate-hero-float flex items-center gap-3 rounded-[18px] border border-[var(--color-primary-border)] bg-white px-3 py-3 shadow-[0_10px_24px_rgba(4,44,83,0.05)] transition hover:border-[var(--color-primary)] ${
                      index === 0 ? 'hero-float-delay-1' : 'hero-float-delay-2'
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-softer)]">
                      <a
                        href="https://www.magnific.com"
                        target="_blank"
                        rel="noreferrer"
                        title="Iconos disenados por Freepik from www.flaticon.es"
                        className="inline-flex shrink-0"
                      >
                        <img
                          src={opportunityIconImage}
                          alt="Icono de oportunidad"
                          className="icon-primary h-[18px] w-[18px] object-contain"
                        />
                        <span className="sr-only">
                          Iconos disenados por Freepik from Flaticon
                        </span>
                      </a>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-semibold text-[var(--color-primary-strong)]">
                        {row.title}
                      </p>
                      <p className="text-[12px] text-[var(--color-text-muted)]">
                        {row.company}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <p className="whitespace-nowrap text-[13px] font-semibold text-[#2a9b62]">
                        {row.rate}
                      </p>
                      <img
                        src={chevronRightImage}
                        alt=""
                        className="icon-navy h-[14px] w-[14px] object-contain"
                      />
                    </div>
                  </article>
                ))}
              </div>

              <button className="mt-4 inline-flex items-center gap-2 text-[15px] font-semibold text-[var(--color-primary)] transition hover:text-[var(--color-primary-strong)]">
                Ver mas oportunidades
                <img
                  src={chevronRightImage}
                  alt=""
                  className="icon-primary h-[14px] w-[14px] object-contain"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
