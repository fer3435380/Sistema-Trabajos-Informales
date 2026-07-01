import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import brandIcon from '../../assets/landing/nexotrabajo_icono.png'
import AuthProviderButton from '../../components/auth/AuthProviderButton'
import AuthSeparator from '../../components/auth/AuthSeparator'
import { beginOAuthLogin, login } from '../../services/authRepository'
import { DEMO_CREDENTIALS } from '../../data/seedAppState'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [authMessage, setAuthMessage] = useState('')
  const [googleMessage, setGoogleMessage] = useState('')

  const redirectByRole = (role) => {
    navigate(role === 'company' ? '/app/company' : '/app/worker')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setGoogleMessage('')

    if (!email.trim() || !password.trim()) {
      setAuthMessage('Completa tu correo y contraseña para continuar.')
      return
    }

    if (!EMAIL_PATTERN.test(email.trim())) {
      setAuthMessage('Ingresa un correo electrónico válido.')
      return
    }

    setAuthMessage('')
    await beginOAuthLogin({
      loginHint: email,
      returnTo: email.trim().toLowerCase().includes('operaciones') ? '/app/company' : '/app/worker',
    })
  }

  const handleGoogleSignIn = async () => {
    // Real SSO belongs to a later phase; we only resolve mock Google accounts here.
    if (!email.trim()) {
      setGoogleMessage('Escribe el correo de tu cuenta Google mock para continuar.')
      return
    }

    const result = await login(email, password, { allowGoogleMock: true })

    if (!result.success) {
      setGoogleMessage('El acceso con Google real se conectará en la fase de SSO. Usa una cuenta registrada para continuar.')
      return
    }

    setGoogleMessage('')
    redirectByRole(result.role)
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[linear-gradient(145deg,#3a7fc2_0%,#1e67ae_36%,#0d4d8e_72%,#073b6c_100%)]">
      <div className="pointer-events-none absolute left-[-100px] top-[-60px] h-[280px] w-[280px] rounded-full bg-white/10 blur-3xl lg:h-[360px] lg:w-[360px]" />
      <div className="pointer-events-none absolute bottom-[-120px] right-[-80px] h-[260px] w-[260px] rounded-full bg-white/8 blur-3xl lg:h-[340px] lg:w-[340px]" />

      <section className="relative flex min-h-screen w-full flex-col lg:h-screen lg:flex-row">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[-220px] top-[-180px] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.06)_45%,rgba(255,255,255,0)_74%)] lg:h-[700px] lg:w-[700px]" />
          <div className="absolute bottom-[-260px] left-[-20px] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(110,186,255,0.28)_0%,rgba(110,186,255,0.08)_46%,rgba(110,186,255,0)_74%)] lg:h-[720px] lg:w-[720px]" />
          <div className="absolute right-[-200px] top-[0] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_44%,rgba(255,255,255,0)_76%)] lg:h-[560px] lg:w-[560px]" />
          <div className="absolute left-[12%] top-[18%] hidden h-[240px] w-[240px] rounded-full border border-white/12 bg-[radial-gradient(circle,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.03)_56%,rgba(255,255,255,0)_80%)] sm:block lg:h-[320px] lg:w-[320px]" />
          <div className="absolute bottom-[14%] left-[22%] hidden h-[220px] w-[220px] rounded-full border border-white/10 bg-[radial-gradient(circle,rgba(132,197,255,0.2)_0%,rgba(132,197,255,0.04)_54%,rgba(132,197,255,0)_80%)] sm:block lg:h-[300px] lg:w-[300px]" />
          <div className="absolute right-[18%] top-[22%] hidden h-36 w-36 rounded-full border border-white/12 bg-white/6 lg:block" />
          <div className="absolute left-[45%] top-[52%] hidden h-16 w-16 rounded-full border border-white/10 bg-white/6 lg:block" />
        </div>

        <div className="relative flex flex-col justify-center px-6 pb-6 pt-24 sm:px-10 lg:w-[50%] lg:px-14 lg:py-10 xl:px-20">
          <div className="absolute left-6 top-6 sm:left-8 lg:left-10 lg:top-10">
            <Link
              to="/"
              aria-label="Volver al inicio"
              className="inline-flex items-center justify-center rounded-full border border-white/18 bg-white/10 p-2.5 backdrop-blur-md transition hover:bg-white/16 focus:outline-none focus:ring-4 focus:ring-white/25 lg:p-3.5"
            >
              <img
                src={brandIcon}
                alt="NexoJobs"
                className="h-12 w-12 object-contain lg:h-16 lg:w-16"
              />
            </Link>
          </div>

          <div className="max-w-[540px]">
            <h1 className="text-[2.2rem] font-black leading-[0.95] tracking-[-0.07em] text-white sm:text-[3rem] lg:text-[4.2rem] xl:text-[4.8rem]">
              Bienvenido
              <br />
              nuevamente
            </h1>
            <p className="mt-4 max-w-[24ch] text-base leading-7 text-[#d7e7f8] sm:text-lg lg:text-[1.35rem] lg:leading-[1.55]">
              Continúa donde lo dejaste y accede a nuevas oportunidades.
            </p>
          </div>
        </div>

        <div className="relative flex flex-1 items-center justify-center px-4 pb-8 sm:px-6 lg:justify-center lg:px-10 lg:py-8 xl:px-14">
          <div className="w-full max-w-[400px]">
            <div className="rounded-[1.75rem] bg-white px-6 py-6 shadow-[0_30px_80px_rgba(4,44,83,0.34)] sm:px-7">
              <div>
                <h2 className="text-[1.85rem] font-bold tracking-[-0.05em] text-[var(--color-text)] lg:text-[2.1rem]">
                  Iniciar sesión
                </h2>
                <p className="mt-1.5 text-sm leading-6 text-[var(--color-text-muted)]">
                  Accede a tu cuenta para continuar.
                </p>
              </div>

              <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-semibold text-[var(--color-text)]">
                        Correo electrónico
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="tu@correo.com"
                        autoComplete="email"
                        aria-invalid={Boolean(authMessage)}
                        className="w-full rounded-[1.25rem] border border-[var(--color-primary-border)] bg-white px-4 py-3 text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-muted)]/80 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary-soft)]"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <label htmlFor="password" className="block text-sm font-semibold text-[var(--color-text)]">
                          Contraseña
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowPassword((currentValue) => !currentValue)}
                          className="text-sm font-semibold text-[var(--color-primary)] transition hover:text-[var(--color-primary-strong)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-soft)] focus:ring-offset-2 focus:ring-offset-white"
                        >
                          {showPassword ? 'Ocultar' : 'Mostrar'}
                        </button>
                      </div>

                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Ingresa tu contraseña"
                        autoComplete="current-password"
                        aria-invalid={Boolean(authMessage)}
                        className="w-full rounded-[1.25rem] border border-[var(--color-primary-border)] bg-white px-4 py-3 text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-muted)]/80 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary-soft)]"
                      />
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <label className="inline-flex items-center gap-3 text-sm text-[var(--color-text-muted)]">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(event) => setRememberMe(event.target.checked)}
                          className="h-4 w-4 rounded border-[var(--color-primary-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary-soft)]"
                        />
                        Recordarme
                      </label>

                      <a
                        href="#"
                        className="text-sm font-semibold text-[var(--color-primary)] transition hover:text-[var(--color-primary-strong)]"
                      >
                        ¿Olvidaste tu contraseña?
                      </a>
                    </div>

                    <div className="min-h-[20px]" aria-live="polite">
                      {authMessage ? (
                        <p className="text-sm text-[var(--color-primary-strong)]">
                          {authMessage}
                        </p>
                      ) : null}
                    </div>

                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center rounded-[1.35rem] bg-[var(--color-primary)] px-4 py-3.5 text-base font-semibold text-white shadow-[0_18px_36px_rgba(24,95,165,0.24)] transition hover:bg-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-soft)]"
                    >
                      Iniciar sesión
                    </button>
                  </form>

                  <div className="mt-4">
                    <AuthSeparator />

                    <div className="mt-3">
                      <AuthProviderButton onClick={handleGoogleSignIn}>
                        Continuar con Google
                      </AuthProviderButton>
                    </div>

                    <div className="mt-2 min-h-[18px]" aria-live="polite">
                      {googleMessage ? (
                        <p className="text-center text-xs leading-5 text-[var(--color-text-muted)]">
                          {googleMessage}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <p className="mt-3 text-center text-sm text-[var(--color-text-muted)]">
                    ¿No tienes cuenta?{' '}
                    <Link
                      to="/register"
                      className="font-semibold text-[var(--color-primary)] transition hover:text-[var(--color-primary-strong)]"
                    >
                      Crear cuenta
                    </Link>
                  </p>

                  <div className="mt-4 flex items-center gap-2 rounded-[1rem] border border-[var(--color-primary-border)] bg-[var(--color-primary-softer)] p-2">
                    <span className="shrink-0 pl-1 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
                      Prueba
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setEmail(DEMO_CREDENTIALS.worker.email)
                        setPassword(DEMO_CREDENTIALS.worker.password)
                        setAuthMessage('')
                      }}
                      className="flex-1 rounded-[0.7rem] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--color-primary-strong)] transition hover:bg-[var(--color-primary-soft)]"
                    >
                      Trabajadora
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEmail(DEMO_CREDENTIALS.company.email)
                        setPassword(DEMO_CREDENTIALS.company.password)
                        setAuthMessage('')
                      }}
                      className="flex-1 rounded-[0.7rem] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--color-primary-strong)] transition hover:bg-[var(--color-primary-soft)]"
                    >
                      Empresa
                    </button>
                  </div>
                </div>
              </div>
            </div>
      </section>
    </main>
  )
}

export default Login
