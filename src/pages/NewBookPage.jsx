import { useEffect, useState } from 'react'
import api from '../services/api.js'

function NewBookPage() {
  const [form, setForm] = useState({
    titulo: '',
    autor: '',
    categoria_id: '',
    ano_publicacao: '',
    status: 'disponivel',
  })
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadCategories() {
      try {
        const response = await api.get('/categorias')

        if (active) {
          setCategories(response.data)
        }
      } catch {
        if (active) {
          setCategories([])
        }
      } finally {
        if (active) {
          setLoadingCategories(false)
        }
      }
    }

    loadCategories()

    return () => {
      active = false
    }
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setFeedback('')
    setError('')

    try {
      await api.post('/livros', {
        titulo: form.titulo,
        autor: form.autor,
        categoria_id: form.categoria_id ? Number(form.categoria_id) : undefined,
        ano_publicacao: Number(form.ano_publicacao),
        status: form.status,
      })

      setFeedback('Livro cadastrado com sucesso.')
      setForm({
        titulo: '',
        autor: '',
        categoria_id: '',
        ano_publicacao: '',
        status: 'disponivel',
      })
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          'Nao foi possivel cadastrar o livro.',
      )
    }
  }

  return (
    <div className="page admin-page">
      <header className="page-header admin-header">
        <span className="page-kicker">Catalogo</span>
        <h1>CADASTRO DE NOVO LIVRO</h1>
        <p className="page-description">
          Preencha os dados principais do acervo para manter o catalogo organizado.
        </p>
      </header>

      <section className="page-stack">
        <form className="panel form-panel form-grid admin-form-panel" onSubmit={handleSubmit}>
          <div className="panel-header inline-panel-header">
            <h2>Dados do Livro</h2>
            <span>Cadastro principal do acervo</span>
          </div>

          <div className="form-grid two-columns admin-form-grid">
            <label className="field field-full">
              <span>Titulo</span>
              <input
                type="text"
                placeholder="Digite o titulo do livro"
                value={form.titulo}
                onChange={(event) =>
                  setForm((current) => ({ ...current, titulo: event.target.value }))
                }
              />
            </label>

            <label className="field">
              <span>Autor</span>
              <input
                type="text"
                placeholder="Digite o nome do autor"
                value={form.autor}
                onChange={(event) =>
                  setForm((current) => ({ ...current, autor: event.target.value }))
                }
              />
            </label>

            <label className="field">
              <span>Categoria (opcional)</span>
              <select
                value={form.categoria_id}
                disabled={loadingCategories}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    categoria_id: event.target.value,
                  }))
                }
              >
                <option value="">Sem categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nome}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Ano de Publicacao</span>
              <input
                type="number"
                placeholder="2024"
                value={form.ano_publicacao}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    ano_publicacao: event.target.value,
                  }))
                }
              />
            </label>

            <label className="field">
              <span>Status</span>
              <select
                value={form.status}
                onChange={(event) =>
                  setForm((current) => ({ ...current, status: event.target.value }))
                }
              >
                <option value="disponivel">Disponivel</option>
                <option value="emprestado">Emprestado</option>
              </select>
            </label>
          </div>

          {feedback ? <div className="feedback success">{feedback}</div> : null}
          {error ? <div className="feedback error">{error}</div> : null}

          <div className="form-actions">
            <button type="submit" className="button-primary">
              Salvar
            </button>
            <button
              type="button"
              className="button-secondary"
              onClick={() =>
                setForm({
                  titulo: '',
                  autor: '',
                  categoria_id: '',
                  ano_publicacao: '',
                  status: 'disponivel',
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

export default NewBookPage
