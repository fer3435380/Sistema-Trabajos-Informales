import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import brandIcon from '../../assets/landing/nexotrabajo_icono.png'

const navLinks = [
  { id: 'home', label: 'Inicio' },
  { id: 'how-it-works', label: 'Como funciona' },
  { id: 'opportunities', label: 'Oportunidades' },
  { id: 'stories', label: 'Historias' },
  { id: 'legal', label: 'Legal' },
]

function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [isScrolled, setIsScrolled] = useState(false)

  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId)
    setIsOpen(false)
  }

  useEffect(() => {
    const updateHeaderState = () => {
      setIsScrolled(window.scrollY > 8)

      const headerOffset = 120
      let currentSection = navLinks[0].id

      navLinks.forEach((link) => {
        const section = document.getElementById(link.id)

        if (!section) {
          return
        }

        const sectionTop = section.offsetTop - headerOffset

        if (window.scrollY >= sectionTop) {
          currentSection = link.id
        }
      })

      setActiveSection(currentSection)
    }

    updateHeaderState()
    window.addEventListener('scroll', updateHeaderState, { passive: true })
    window.addEventListener('resize', updateHeaderState)

    return () => {
      window.removeEventListener('scroll', updateHeaderState)
      window.removeEventListener('resize', updateHeaderState)
    }
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[80] border-b transition duration-300 ${
        isScrolled
          ? 'border-[var(--color-primary-border)] bg-white shadow-[0_10px_30px_rgba(4,44,83,0.08)]'
          : 'border-[var(--color-primary-border)]/80 bg-white/96'
      }`}
    >
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[78px] items-center justify-between gap-4">
          <a
            href="#home"
            onClick={() => setActiveSection('home')}
            className="flex shrink-0 items-center gap-3 text-[1.7rem] font-extrabold tracking-[-0.06em] text-[var(--color-primary-strong)] sm:text-[1.95rem] xl:text-[2.05rem]"
          >
            <img
              src={brandIcon}
              alt=""
              className="h-10 w-10 shrink-0 object-contain sm:h-11 sm:w-11"
            />
            NexoTrabajo
          </a>

          <nav className="hidden items-center gap-6 xl:gap-7 lg:flex">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id

              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative flex h-[78px] items-center whitespace-nowrap text-[14px] font-medium transition xl:text-[15px] ${
                    isActive
                      ? 'text-[var(--color-primary-strong)]'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)]'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-0 h-[3px] rounded-full bg-[var(--color-primary)] transition-all duration-300 ${
                      isActive ? 'w-full opacity-100' : 'w-0 opacity-0'
                    }`}
                  />
                </a>
              )
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to="/login"
              className="inline-flex min-h-[48px] items-center justify-center whitespace-nowrap rounded-[14px] border border-[var(--color-primary-border)] bg-white px-5 py-3 text-[14px] font-semibold text-[var(--color-primary-strong)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] xl:px-6 xl:text-[15px]"
            >
              Iniciar sesion
            </Link>
            <Link
              to="/register"
              className="inline-flex min-h-[48px] items-center justify-center whitespace-nowrap rounded-[14px] bg-[var(--color-primary)] px-5 py-3 text-[14px] font-semibold text-white shadow-[0_12px_30px_rgba(24,95,165,0.18)] transition hover:bg-[var(--color-primary-strong)] xl:px-6 xl:text-[15px]"
            >
              Crear cuenta
            </Link>
          </div>

          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-[14px] border border-[var(--color-primary-border)] bg-white text-[var(--color-primary-strong)] lg:hidden"
          >
            <span className="space-y-1">
              <span className="block h-0.5 w-5 rounded-full bg-current" />
              <span className="block h-0.5 w-5 rounded-full bg-current" />
              <span className="block h-0.5 w-5 rounded-full bg-current" />
            </span>
          </button>
        </div>

        {isOpen && (
          <div className="border-t border-[var(--color-primary-border)] py-4 lg:hidden">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  className={`rounded-xl px-3 py-3 text-sm font-medium transition ${
                    activeSection === link.id
                      ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary-strong)]'
                      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-primary-softer)] hover:text-[var(--color-primary)]'
                  }`}
                >
                  {link.label}
                </a>
              ))}

              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="rounded-[14px] border border-[var(--color-primary-border)] bg-white px-5 py-3 text-center text-sm font-semibold text-[var(--color-primary-strong)]"
              >
                Iniciar sesion
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="rounded-[14px] bg-[var(--color-primary)] px-5 py-3 text-center text-sm font-semibold text-white"
              >
                Crear cuenta
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
