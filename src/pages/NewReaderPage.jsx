import { useState } from 'react'
import api from '../services/api.js'

function NewReaderPage() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    tipo: 'bibliotecario',
  })
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setFeedback('')
    setError('')

    try {
      await api.post('/usuarios', form)
      setFeedback('Leitor cadastrado com sucesso.')
      setForm({
        nome: '',
        email: '',
        senha: '',
        tipo: 'bibliotecario',
      })
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          'Nao foi possivel cadastrar o leitor.',
      )
    }
  }

  return (
    <div className="page admin-page">
      <header className="page-header admin-header">
        <span className="page-kicker">Usuarios</span>
        <h1>CADASTRO DE NOVO LEITOR</h1>
        <p className="page-description">
          Registre o usuario com os dados previstos no backend para manter o fluxo
          consistente.
        </p>
      </header>

      <section className="page-stack">
        <form className="panel form-panel form-grid admin-form-panel" onSubmit={handleSubmit}>
          <div className="panel-header inline-panel-header">
            <h2>Dados do Usuario</h2>
            <span>Cadastro principal</span>
          </div>

          <div className="form-grid two-columns admin-form-grid">
            <label className="field field-full">
              <span>Nome completo</span>
              <input
                type="text"
                placeholder="Digite o nome completo"
                value={form.nome}
                onChange={(event) =>
                  setForm((current) => ({ ...current, nome: event.target.value }))
                }
              />
            </label>

            <label className="field">
              <span>E-mail</span>
              <input
                type="email"
                placeholder="Digite o e-mail"
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({ ...current, email: event.target.value }))
                }
              />
            </label>

            <label className="field">
              <span>Tipo</span>
              <select
                value={form.tipo}
                onChange={(event) =>
                  setForm((current) => ({ ...current, tipo: event.target.value }))
                }
              >
                <option value="bibliotecario">Bibliotecario</option>
                <option value="leitor">Leitor</option>
              </select>
            </label>

            <label className="field field-full">
              <span>Senha</span>
              <input
                type="password"
                placeholder="Digite uma senha"
                value={form.senha}
                onChange={(event) =>
                  setForm((current) => ({ ...current, senha: event.target.value }))
                }
              />
            </label>
          </div>

          {feedback ? <div className="feedback success">{feedback}</div> : null}
          {error ? <div className="feedback error">{error}</div> : null}

          <div className="form-actions">
            <button type="submit" className="button-primary">
              Salvar Leitor
            </button>
            <button
              type="button"
              className="button-secondary"
              onClick={() =>
                setForm({
                  nome: '',
                  email: '',
                  senha: '',
                  tipo: 'bibliotecario',
                })
              }
            >
              Limpar
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default NewReaderPage
