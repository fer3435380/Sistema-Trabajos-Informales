import { Navigate } from 'react-router-dom'
import { getSession } from '../services/authRepository'

function ProtectedRoute({ role, children }) {
  const session = getSession()

  if (!session) {
    return <Navigate to="/login" replace />
  }

  if (role && session.role !== role) {
    return <Navigate to={session.role === 'company' ? '/app/company' : '/app/worker'} replace />
  }

  return children
}

export default ProtectedRoute
