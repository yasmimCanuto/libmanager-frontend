import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../context/useAuth.jsx'

function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', senha: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const destination = location.state?.from?.pathname || '/dashboard'

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(form)
      navigate(destination, { replace: true })
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          'Nao foi possivel fazer login no momento.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <section className="login-card">
        <div className="brand compact brand-login">
          <div className="brand-logo" aria-hidden="true">
            <span className="book-left" />
            <span className="book-right" />
            <span className="book-dot" />
          </div>
          <strong>LibManager</strong>
        </div>

        <div className="login-layout">
          <div className="login-panel">
            <div className="page-header left tight">
              <h1>Login do Bibliotecario</h1>
            </div>

            <form className="form-grid login-form" onSubmit={handleSubmit}>
              <label className="field compact">
                <span>E-mail</span>
                <input
                  type="email"
                  placeholder="Ex: bibliotecario@biblioteca.com"
                  value={form.email}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, email: event.target.value }))
                  }
                />
              </label>

              <label className="field compact">
                <span>Password</span>
                <input
                  type="password"
                  placeholder="Digite sua senha"
                  value={form.senha}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, senha: event.target.value }))
                  }
                />
              </label>

              {error ? <div className="feedback error">{error}</div> : null}

              <button type="submit" className="button-primary full-width" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <a href="/" className="login-link">
              Esqueceu a senha?
            </a>
          </div>

          <div className="login-visual" aria-hidden="true">
            <div className="screen-frame">
              <div className="screen-head" />
              <div className="screen-body">
                <div className="screen-lock">
                  <span className="lock-shackle" />
                  <span className="lock-body" />
                </div>
              </div>
              <div className="screen-ribbon" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LoginPage
