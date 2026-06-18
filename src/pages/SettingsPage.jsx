import useAuth from '../context/useAuth.jsx'

function SettingsPage() {
  const { user } = useAuth()

  return (
    <div className="page">
      <header className="page-header compact-header">
        <h1>Ajustes</h1>
      </header>

      <section className="panel form-panel">
        <div className="settings-list">
          <div className="settings-item">
            <strong>API do backend</strong>
            <span>{import.meta.env.VITE_API_URL || 'http://localhost:3000'}</span>
          </div>
          <div className="settings-item">
            <strong>Persistencia de login</strong>
            <span>Usuario atual: {user?.email || 'Nao autenticado'}</span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default SettingsPage
