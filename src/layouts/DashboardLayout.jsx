import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'

function DashboardLayout() {
  return (
    <div className="app-stage">
      <div className="app-shell">
        <Sidebar />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
