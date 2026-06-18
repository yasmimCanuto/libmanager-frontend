import { useEffect, useState } from 'react'
import api from '../services/api.js'

function LoansPage() {
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadLoans({ resetState = true } = {}) {
    if (resetState) {
      setLoading(true)
      setError('')
    }

    try {
      const response = await api.get('/emprestimos')
      setLoans(response.data)
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          'Nao foi possivel carregar os emprestimos.',
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleReturnLoan(id) {
    try {
      await api.patch(`/emprestimos/${id}/devolver`)
      await loadLoans()
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          'Nao foi possivel registrar a devolucao.',
      )
    }
  }

  useEffect(() => {
    let active = true

    async function fetchInitialLoans() {
      try {
        const response = await api.get('/emprestimos')

        if (!active) {
          return
        }

        setLoans(response.data)
      } catch (requestError) {
        if (!active) {
          return
        }

        setError(
          requestError.response?.data?.message ||
            'Nao foi possivel carregar os emprestimos.',
        )
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchInitialLoans()

    return () => {
      active = false
    }
  }, [])

  return (
    <div className="page">
      <header className="page-header compact-header">
        <h1>Gestao de Emprestimos</h1>
      </header>

      <section className="page-stack">
        <article className="panel table-panel">
          <div className="panel-header">
            <h2>Gestao de Emprestimos</h2>
            <span>INNER JOIN descreve relacionamentos</span>
          </div>

          {loading ? <p>Carregando emprestimos...</p> : null}
          {error ? <div className="feedback error">{error}</div> : null}

          {!loading && !error ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Aluno</th>
                  <th>Livro</th>
                  <th>Retirada</th>
                  <th>Previsao</th>
                  <th>Status</th>
                  <th>Acao</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr key={loan.id}>
                    <td>{loan.usuario_nome}</td>
                    <td>{loan.livro_titulo}</td>
                    <td>{loan.data_emprestimo}</td>
                    <td>{loan.data_devolucao_prevista}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          loan.status === 'ativo' ? 'warning' : 'success'
                        }`}
                      >
                        {loan.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="button-small"
                        onClick={() => handleReturnLoan(loan.id)}
                        disabled={loan.status !== 'ativo'}
                      >
                        Devolver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </article>

        <article className="panel subtle-panel">
          <p>Uso de INNER JOIN para exibir dados relacionais de usuarios e livros.</p>
        </article>
      </section>
    </div>
  )
}

export default LoansPage
