import { Link } from 'react-router-dom'
import RegisterShell from '../../components/auth/RegisterShell'

const registerOptions = [
  {
    title: 'Trabajador',
    description: 'Crear perfil personal.',
    to: '/register/worker',
    badge: 'T',
  },
  {
    title: 'Empresa',
    description: 'Registrar organización.',
    to: '/register/company',
    badge: 'E',
  },
]

function RegisterSelect() {
  return (
    <RegisterShell
      title="Crear cuenta"
      subtitle="Elige el tipo de cuenta."
      cardWidth="max-w-3xl"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {registerOptions.map((option) => (
          <Link
            key={option.title}
            to={option.to}
            className="group rounded-[1.75rem] border border-[var(--color-primary-border)] bg-[var(--color-primary-softer)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:bg-white hover:shadow-[0_18px_40px_rgba(4,44,83,0.12)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-lg font-bold text-[var(--color-primary)] shadow-sm transition group-hover:bg-[var(--color-primary-soft)]">
                {option.badge}
              </span>
              <span className="text-sm font-semibold text-[var(--color-primary)] transition group-hover:text-[var(--color-primary-strong)]">
                Continuar
              </span>
            </div>

            <div className="mt-4 space-y-2">
              <h2 className="text-[1.5rem] font-bold tracking-[-0.04em] text-[var(--color-text)]">
                {option.title}
              </h2>
              <p className="text-sm leading-6 text-[var(--color-text-muted)]">
                {option.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <p className="text-center text-sm text-[var(--color-text-muted)]">
        ¿Ya tienes cuenta?{' '}
        <Link
          to="/login"
          className="font-semibold text-[var(--color-primary)] transition hover:text-[var(--color-primary-strong)]"
        >
          Iniciar sesión
        </Link>
      </p>
    </RegisterShell>
  )
}

export default RegisterSelect
