import { useEffect, useState } from 'react'
import api from '../services/api.js'

function BooksPage() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadBooks({ resetState = true } = {}) {
    if (resetState) {
      setLoading(true)
      setError('')
    }

    try {
      const response = await api.get('/livros')
      setBooks(response.data)
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          'Nao foi possivel carregar os livros.',
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteBook(id) {
    try {
      await api.delete(`/livros/${id}`)
      await loadBooks()
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          'Nao foi possivel remover o livro.',
      )
    }
  }

  useEffect(() => {
    let active = true

    async function fetchInitialBooks() {
      try {
        const response = await api.get('/livros')

        if (!active) {
          return
        }

        setBooks(response.data)
      } catch (requestError) {
        if (!active) {
          return
        }

        setError(
          requestError.response?.data?.message ||
            'Nao foi possivel carregar os livros.',
        )
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchInitialBooks()

    return () => {
      active = false
    }
  }, [])

  return (
    <div className="page">
      <header className="page-header compact-header">
        <h1>Listar Livros</h1>
      </header>

      <section className="panel table-panel">
        <div className="panel-header">
          <h2>Acervo de Livros</h2>
          <span>{books.length.toString().padStart(2, '0')} Livros</span>
        </div>

        {loading ? <p>Carregando livros...</p> : null}
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
              {books.map((book) => (
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
                      className="button-small"
                      onClick={() => handleDeleteBook(book.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </section>
    </div>
  )
}

export default BooksPage
