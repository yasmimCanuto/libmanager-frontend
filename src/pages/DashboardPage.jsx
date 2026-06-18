import { useEffect, useMemo, useState } from 'react'
import api from '../services/api.js'

function getTodayDate() {
  return new Date().toISOString().slice(0, 10)
}

function getReturnDate() {
  const date = new Date()
  date.setDate(date.getDate() + 7)
  return date.toISOString().slice(0, 10)
}

function DashboardPage() {
  const [books, setBooks] = useState([])
  const [loans, setLoans] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [loanError, setLoanError] = useState('')
  const [loanLoading, setLoanLoading] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)
  const [loanForm, setLoanForm] = useState({
    usuario_id: '',
    data_emprestimo: getTodayDate(),
    data_devolucao_prevista: getReturnDate(),
  })

  async function loadDashboard({ resetState = true } = {}) {
    if (resetState) {
      setLoading(true)
      setError('')
    }

    try {
      const [booksResponse, loansResponse, usersResponse] = await Promise.all([
        api.get('/livros'),
        api.get('/emprestimos'),
        api.get('/usuarios'),
      ])

      setBooks(booksResponse.data)
      setLoans(loansResponse.data)
      setUsers(usersResponse.data)
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          'Nao foi possivel carregar o dashboard.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true

    async function fetchInitialDashboard() {
      try {
        const [booksResponse, loansResponse, usersResponse] = await Promise.all([
          api.get('/livros'),
          api.get('/emprestimos'),
          api.get('/usuarios'),
        ])

        if (!active) {
          return
        }

        setBooks(booksResponse.data)
        setLoans(loansResponse.data)
        setUsers(usersResponse.data)
      } catch (requestError) {
        if (!active) {
          return
        }

        setError(
          requestError.response?.data?.message ||
            'Nao foi possivel carregar o dashboard.',
        )
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchInitialDashboard()

    return () => {
      active = false
    }
  }, [])

  const availableReaders = useMemo(
    () => users.filter((user) => user.tipo === 'leitor' || user.tipo === 'bibliotecario'),
    [users],
  )

  const activeLoans = useMemo(
    () => loans.filter((loan) => loan.status === 'ativo').length,
    [loans],
  )

  const dashboardCards = useMemo(
    () => [
      {
        title: 'Estetica /atitudal',
        text: 'Cores sobrias em cinza e azul para sistemas administrativos.',
      },
      {
        title: 'Dados estruturados',
        text: `Foco em tabelas e manipulacao eficiente das informacoes. ${activeLoans} emprestimo(s) ativo(s).`,
      },
    ],
    [activeLoans],
  )

  function handleStartLoan(book) {
    setSelectedBook(book)
    setLoanError('')
    setFeedback('')
    setLoanForm({
      usuario_id: '',
      data_emprestimo: getTodayDate(),
      data_devolucao_prevista: getReturnDate(),
    })
  }

  function handleCancelLoan() {
    setSelectedBook(null)
    setLoanError('')
  }

  async function handleSubmitLoan(event) {
    event.preventDefault()

    if (!selectedBook) {
      return
    }

    setLoanError('')
    setLoanLoading(true)

    try {
      await api.post('/emprestimos', {
        usuario_id: Number(loanForm.usuario_id),
        livro_id: selectedBook.id,
        data_emprestimo: loanForm.data_emprestimo,
        data_devolucao_prevista: loanForm.data_devolucao_prevista,
      })

      setFeedback('Emprestimo registrado com sucesso.')
      await loadDashboard({ resetState: false })
      setSelectedBook(null)
    } catch (requestError) {
      setLoanError(
        requestError.response?.data?.message ||
          'Nao foi possivel registrar o emprestimo.',
      )
    } finally {
      setLoanLoading(false)
    }
  }

  return (
    <div className="page">
      <header className="page-header dashboard-header">
        <h1>DASHBOARD DO BIBLIOTECARIO</h1>
      </header>

      <section className="page-stack">
        <article className="panel wide table-panel">
          <div className="panel-header">
            <h2>Acervo de Livros</h2>
            <span>{books.length.toString().padStart(2, '0')} Livros Cadastrados</span>
          </div>

          {loading ? <p>Carregando dashboard...</p> : null}
          {feedback ? <div className="feedback success">{feedback}</div> : null}
          {error ? <div className="feedback error">{error}</div> : null}
          {!loading && !error ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Titulo</th>
                  <th>Autor</th>
                  <th>Ano</th>
                  <th>Status</th>
                  <th>Acao</th>
                </tr>
              </thead>
              <tbody>
                {books.slice(0, 5).map((book) => (
                  <tr key={book.id}>
                    <td>{book.titulo}</td>
                    <td>{book.autor}</td>
                    <td>{book.ano_publicacao}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          book.status === 'disponivel' ? 'success' : 'danger'
                        }`}
                      >
                        {book.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="button-small table-action"
                        disabled={book.status !== 'disponivel'}
                        onClick={() => handleStartLoan(book)}
                      >
                        {book.status === 'disponivel' ? 'EMPRESTAR' : 'INDISPONIVEL'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </article>

        {selectedBook ? (
          <article className="panel loan-form-panel">
            <div className="panel-header">
              <h2>Novo Emprestimo</h2>
              <span>{selectedBook.titulo}</span>
            </div>

            <form className="form-grid two-columns" onSubmit={handleSubmitLoan}>
              <label className="field field-full">
                <span>Livro selecionado</span>
                <input type="text" value={`${selectedBook.titulo} - ${selectedBook.autor}`} disabled />
              </label>

              <label className="field field-full">
                <span>Leitor</span>
                <select
                  value={loanForm.usuario_id}
                  onChange={(event) =>
                    setLoanForm((current) => ({
                      ...current,
                      usuario_id: event.target.value,
                    }))
                  }
                  required
                >
                  <option value="">Selecione um usuario</option>
                  {availableReaders.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.nome} - {user.email}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>Data do emprestimo</span>
                <input
                  type="date"
                  value={loanForm.data_emprestimo}
                  onChange={(event) =>
                    setLoanForm((current) => ({
                      ...current,
                      data_emprestimo: event.target.value,
                    }))
                  }
                  required
                />
              </label>

              <label className="field">
                <span>Data de devolucao prevista</span>
                <input
                  type="date"
                  value={loanForm.data_devolucao_prevista}
                  onChange={(event) =>
                    setLoanForm((current) => ({
                      ...current,
                      data_devolucao_prevista: event.target.value,
                    }))
                  }
                  required
                />
              </label>

              {loanError ? <div className="feedback error field-full">{loanError}</div> : null}

              {!availableReaders.length ? (
                <div className="feedback error field-full">
                  Cadastre ao menos um usuario para registrar emprestimos.
                </div>
              ) : null}

              <div className="form-actions field-full">
                <button
                  type="submit"
                  className="button-primary"
                  disabled={loanLoading || !availableReaders.length}
                >
                  {loanLoading ? 'Salvando...' : 'Confirmar emprestimo'}
                </button>
                <button type="button" className="button-secondary" onClick={handleCancelLoan}>
                  Cancelar
                </button>
              </div>
            </form>
          </article>
        ) : null}

        <div className="info-grid">
          {dashboardCards.map((card) => (
            <article key={card.title} className="info-card dashboard-info-card">
              <strong>{card.title}</strong>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default DashboardPage
