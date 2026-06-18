import { Navigate, Route, Routes } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout.jsx'
import DashboardPage from '../pages/DashboardPage.jsx'
import SettingsPage from '../pages/SettingsPage.jsx'
import BooksPage from '../pages/BooksPage.jsx'
import LoansPage from '../pages/LoansPage.jsx'
import LoginPage from '../pages/LoginPage.jsx'
import NewBookPage from '../pages/NewBookPage.jsx'
import NewReaderPage from '../pages/NewReaderPage.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/livros" element={<BooksPage />} />
        <Route path="/livros/novo" element={<NewBookPage />} />
        <Route path="/leitores/novo" element={<NewReaderPage />} />
        <Route path="/emprestimos" element={<LoansPage />} />
        <Route path="/ajustes" element={<SettingsPage />} />
      </Route>

      <Route path="/inicio" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRoutes
