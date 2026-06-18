import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="login-page">
      <section className="login-card error-card">
        <div className="brand compact brand-login">
          <div className="brand-logo" aria-hidden="true">
            <span className="book-left" />
            <span className="book-right" />
            <span className="book-dot" />
          </div>
          <strong>LibManager</strong>
        </div>

        <h1>Oops! Algo deu errado.</h1>
        <div className="error-illustration" aria-hidden="true">
          <div className="shelf left" />
          <div className="owl">
            <span className="owl-eye left" />
            <span className="owl-eye right" />
            <span className="owl-beak" />
          </div>
          <div className="shelf right" />
        </div>
        <p>Acesso Negado ou Pagina nao Encontrada.</p>
        <Link to="/dashboard" className="button-primary inline-button">
          Voltar ao Inicio
        </Link>
        <div className="panel subtle-panel">
          <p>Tratamento de excecoes e feedback de permissao (401/403/404).</p>
        </div>
      </section>
    </div>
  )
}

export default NotFoundPage
