import { Link } from 'react-router-dom'
import footerPeopleImage from '../../assets/landing/footer_personas.png'
import brandIcon from '../../assets/landing/nexotrabajo_icono.png'

const exploreLinks = [
  { label: 'Como funciona', href: '#how-it-works' },
  { label: 'Para ti', href: '#home' },
  { label: 'Para empresas', href: '#companies' },
  { label: 'Cursos', href: '#how-it-works' },
]

const resourceLinks = [
  { label: 'Centro de ayuda', href: '#' },
  { label: 'Blog', href: '#' },
  { label: 'Preguntas frecuentes', href: '#' },
]

const legalLinks = [
  { label: 'Terminos y condiciones', href: '#' },
  { label: 'Politica de privacidad', href: '#' },
  { label: 'Politica de cookies', href: '#' },
]

function UserPlusIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19a6 6 0 0 0-12 0" />
      <circle cx="9" cy="7" r="4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 8v6M16 11h6" />
    </svg>
  )
}

function BuildingIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 20V7l8-3 8 3v13" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20v-4h6v4M8 9h.01M12 9h.01M16 9h.01M8 13h.01M12 13h.01M16 13h.01" />
    </svg>
  )
}

function MailIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16v12H4z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m5 7 7 6 7-6" />
    </svg>
  )
}

function PinIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s6-5.4 6-11a6 6 0 1 0-12 0c0 5.6 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  )
}

function FacebookIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.2c0-.9.3-1.5 1.6-1.5H16V5.1c-.3 0-1.1-.1-2-.1-2 0-3.4 1.2-3.4 3.5V11H8v3h2.6v7h2.9Z" />
    </svg>
  )
}

function InstagramIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={className}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function LinkedInIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M6.4 8.3a1.8 1.8 0 1 1 0-3.6 1.8 1.8 0 0 1 0 3.6ZM5 9.8h2.8V19H5V9.8Zm4.6 0h2.7v1.3h.1c.4-.7 1.4-1.6 2.9-1.6 3.1 0 3.7 2 3.7 4.7V19h-2.8v-4.2c0-1 0-2.3-1.4-2.3s-1.7 1.1-1.7 2.2V19H9.6V9.8Z" />
    </svg>
  )
}

function YouTubeIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M21.6 8.1a2.8 2.8 0 0 0-2-2c-1.8-.5-7.6-.5-7.6-.5s-5.8 0-7.6.5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2 12a29 29 0 0 0 .4 3.9 2.8 2.8 0 0 0 2 2c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a2.8 2.8 0 0 0 2-2A29 29 0 0 0 22 12a29 29 0 0 0-.4-3.9ZM10 15.1V8.9l5.2 3.1-5.2 3.1Z" />
    </svg>
  )
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="text-[1.08rem] font-bold tracking-[-0.03em] text-white">{title}</h3>
      <ul className="mt-4 space-y-2.5 text-[15px] text-[#c6d9ee]">
        {links.map((link) => (
          <li key={link.label}>
            <a href={link.href} className="transition hover:text-white">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SocialLink({ href, label, children }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/6 text-white transition duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/12"
    >
      {children}
    </a>
  )
}

function Footer() {
  return (
    <footer
      id="legal"
      className="mt-14 bg-[linear-gradient(180deg,#0b3564_0%,#042c53_100%)] px-4 pb-8 pt-0 text-white sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-[1320px]">
        <section className="relative -translate-y-6 overflow-hidden rounded-[24px] border border-white/12 bg-[linear-gradient(135deg,#0f4f94_0%,#0a427f_54%,#08386c_100%)] px-5 py-6 shadow-[0_22px_48px_rgba(4,44,83,0.24)] sm:px-7 lg:px-8 lg:py-0">
          <div className="pointer-events-none absolute left-[-120px] top-[-120px] h-[240px] w-[240px] rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-[-120px] right-[-40px] h-[220px] w-[220px] rounded-full bg-[#2b76c5]/24 blur-3xl" />

          <div className="relative grid items-center gap-6 lg:min-h-[230px] lg:grid-cols-[minmax(0,1fr)_430px]">
            <div className="py-1 lg:py-7">
              <h2 className="max-w-[14ch] text-[1.9rem] font-extrabold leading-[1.02] tracking-[-0.06em] text-white sm:text-[2.35rem] lg:text-[2.55rem]">
                Listo para transformar tu futuro?
              </h2>

              <p className="mt-3 max-w-[33ch] text-[15px] leading-7 text-[#dbe9f7] sm:text-[17px]">
                Unete a miles de personas que ya estan aprendiendo, trabajando y creciendo con NexoTrabajo.
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/register/worker"
                  className="inline-flex min-h-[52px] items-center justify-center gap-3 rounded-[14px] bg-white px-5 py-3 text-[15px] font-semibold text-[var(--color-primary)] shadow-[0_14px_28px_rgba(0,0,0,0.14)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#f3f8fd]"
                >
                  <UserPlusIcon className="h-5 w-5" />
                  Crear cuenta gratis
                </Link>

                <Link
                  to="/register/company"
                  className="inline-flex min-h-[52px] items-center justify-center gap-3 rounded-[14px] border border-white/30 bg-white/8 px-5 py-3 text-[15px] font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/12"
                >
                  <BuildingIcon className="h-5 w-5" />
                  Soy empresa
                </Link>
              </div>
            </div>

            <div className="relative hidden h-full items-end justify-end lg:flex">
              <img
                src={footerPeopleImage}
                alt="Personas creciendo con NexoTrabajo"
                className="absolute bottom-0 right-0 z-10 h-[285px] w-auto object-contain drop-shadow-[0_24px_42px_rgba(4,44,83,0.24)]"
              />
            </div>
          </div>
        </section>

        <div className="border-t border-white/12 pt-5 sm:pt-6">
          <div className="grid gap-10 lg:grid-cols-[1.25fr_repeat(4,minmax(0,1fr))]">
            <div>
              <div className="flex items-center gap-3">
                <img
                  src={brandIcon}
                  alt=""
                  className="h-11 w-11 shrink-0 object-contain"
                />
                <p className="text-[1.65rem] font-extrabold tracking-[-0.05em] text-white">
                  NexoTrabajo
                </p>
              </div>

              <p className="mt-4 max-w-[24ch] text-[17px] leading-8 text-[#c6d9ee]">
                Conectamos talento con oportunidades para construir un mejor futuro.
              </p>

              <div className="mt-6 flex items-center gap-3">
                <SocialLink href="#" label="Facebook">
                  <FacebookIcon className="h-5 w-5" />
                </SocialLink>
                <SocialLink href="#" label="Instagram">
                  <InstagramIcon className="h-5 w-5" />
                </SocialLink>
                <SocialLink href="#" label="LinkedIn">
                  <LinkedInIcon className="h-5 w-5" />
                </SocialLink>
                <SocialLink href="#" label="YouTube">
                  <YouTubeIcon className="h-5 w-5" />
                </SocialLink>
              </div>
            </div>

            <FooterColumn title="Explora" links={exploreLinks} />
            <FooterColumn title="Recursos" links={resourceLinks} />
            <FooterColumn title="Legal" links={legalLinks} />

            <div>
              <h3 className="text-[1.08rem] font-bold tracking-[-0.03em] text-white">Contacto</h3>
              <div className="mt-4 space-y-4 text-[15px] text-[#c6d9ee]">
                <a
                  href="mailto:info@nexotrabajo.ec"
                  className="flex items-start gap-3 transition hover:text-white"
                >
                  <MailIcon className="mt-0.5 h-5 w-5 shrink-0" />
                  <span>info@nexotrabajo.ec</span>
                </a>

                <div className="flex items-start gap-3">
                  <PinIcon className="mt-0.5 h-5 w-5 shrink-0" />
                  <span>Cuenca, Ecuador</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-white/12 pt-6 text-center text-[15px] text-[#c6d9ee]">
            © 2026 NexoTrabajo. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
