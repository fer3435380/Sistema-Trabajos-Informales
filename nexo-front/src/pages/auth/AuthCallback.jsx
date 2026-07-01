import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { handleOAuthCallback } from '../../services/authRepository'

function redirectPathForRole(role, returnTo) {
  if (returnTo && returnTo.startsWith('/app/')) return returnTo
  return role === 'company' ? '/app/company' : '/app/worker'
}

function AuthCallback() {
  const navigate = useNavigate()
  const [message, setMessage] = useState('Validando acceso seguro...')

  useEffect(() => {
    let isMounted = true

    handleOAuthCallback()
      .then((result) => {
        if (!isMounted) return
        if (!result.success) {
          setMessage(result.message || 'No se pudo completar el inicio de sesion.')
          return
        }
        navigate(redirectPathForRole(result.role, result.returnTo), { replace: true })
      })
      .catch(() => {
        if (isMounted) {
          setMessage('No se pudo completar el inicio de sesion.')
        }
      })

    return () => {
      isMounted = false
    }
  }, [navigate])

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-primary-softer)] px-6">
      <section className="w-full max-w-md rounded-[1.5rem] bg-white p-6 text-center shadow-lg">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Acceso seguro</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">{message}</p>
        {message !== 'Validando acceso seguro...' ? (
          <Link
            to="/login"
            className="mt-5 inline-flex rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white"
          >
            Volver al login
          </Link>
        ) : null}
      </section>
    </main>
  )
}

export default AuthCallback
