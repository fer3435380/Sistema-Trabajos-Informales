import { Navigate, Route, Routes } from 'react-router-dom'
import Home from '../pages/public/Home'
import Login from '../pages/auth/Login'
import RegisterSelect from '../pages/auth/RegisterSelect'
import RegisterWorker from '../pages/auth/RegisterWorker'
import RegisterCompany from '../pages/auth/RegisterCompany'
import WorkerDashboard from '../pages/worker/WorkerDashboard'
import CompanyDashboard from '../pages/company/CompanyDashboard'
import ProtectedRoute from './ProtectedRoute'

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterSelect />} />
      <Route path="/register/worker" element={<RegisterWorker />} />
      <Route path="/register/company" element={<RegisterCompany />} />
      <Route
        path="/app/worker"
        element={
          <ProtectedRoute role="worker">
            <WorkerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/company"
        element={
          <ProtectedRoute role="company">
            <CompanyDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/registro" element={<Navigate to="/register" replace />} />
      <Route path="/registro/trabajador" element={<Navigate to="/register/worker" replace />} />
      <Route path="/registro/empresa" element={<Navigate to="/register/company" replace />} />
      <Route path="/app/trabajador" element={<Navigate to="/app/worker" replace />} />
      <Route path="/app/empresa" element={<Navigate to="/app/company" replace />} />
    </Routes>
  )
}

export default AppRouter
