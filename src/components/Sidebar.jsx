import { NavLink } from 'react-router-dom'
import useAuth from '../context/useAuth.jsx'

const menuItems = [
  { label: 'Inicio', to: '/dashboard', icon: 'home' },
  { label: 'Listar Livros', to: '/livros', icon: 'books' },
  { label: 'Novo Livro', to: '/livros/novo', icon: 'plus' },
  { label: 'Gestao de Usuarios', to: '/leitores/novo', icon: 'users' },
  { label: 'Emprestimos', to: '/emprestimos', icon: 'loans' },
  { label: 'Ajustes', to: '/ajustes', icon: 'gear' },
]

function Sidebar() {
  const { logout, user } = useAuth()

  return (
    <aside className="sidebar">
      <div className="brand compact">
        <div className="brand-logo" aria-hidden="true">
          <span className="book-left" />
          <span className="book-right" />
          <span className="book-dot" />
        </div>
        <strong>LibManager</strong>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-link${isActive ? ' active' : ''}`
            }
          >
            <span className={`nav-icon ${item.icon}`} aria-hidden="true" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <strong>{user?.nome || 'Bibliotecario'}</strong>
          <span>{user?.email || 'Sem e-mail'}</span>
        </div>

        <button
          type="button"
          className="sidebar-logout"
          onClick={logout}
        >
          Sair
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
