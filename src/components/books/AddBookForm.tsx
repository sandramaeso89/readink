import { useEffect, useState } from 'react'
import { useLibraryContext } from '../../context/useLibraryContext'
import type { LibraryCard } from '../../context/LibraryContext'
import { ApiClientError, searchOpenLibrary } from '../../api/client'
import type { ApiOpenLibraryBook } from '../../types/api'

type FormStatus = 'idle' | 'success' | 'error'

const fieldClassName =
  'h-11 w-full rounded-lg border border-[var(--ri-border)] bg-[#0f0f0f] px-4 text-sm text-[var(--ri-text-secondary)] outline-none transition-colors focus:border-[var(--ri-accent)]'

interface AddBookFormProps {
  // Callback opcional para cerrar modal tras guardar correctamente.
  onSuccess?: () => void
}

const KNOWN_GENRES = ['Novela', 'Fantasía', 'Historia', 'Tecnología', 'Productividad', 'Ciencia'] as const

// Convierte genero libre de Open Library a uno de la app.
function normalizeGenre(genre?: string) {
  if (!genre) return 'Novela'
  const lowerGenre = genre.toLowerCase()
  if (lowerGenre.includes('fantasy')) return 'Fantasía'
  if (lowerGenre.includes('history')) return 'Historia'
  if (lowerGenre.includes('science')) return 'Ciencia'
  if (lowerGenre.includes('technology')) return 'Tecnología'
  if (lowerGenre.includes('productivity')) return 'Productividad'
  return 'Novela'
}

// Formulario controlado para añadir libros manualmente.
export function AddBookForm({ onSuccess }: Readonly<AddBookFormProps>) {
  const { addBook } = useLibraryContext()

  // Estado controlado de cada input del formulario.
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [genre, setGenre] = useState('Novela')
  const [note, setNote] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [status, setStatus] = useState<LibraryCard['status']>('wishlist')
  const [stars, setStars] = useState(5)
  // Búsqueda simple para autocompletar desde Open Library.
  const [openLibraryQuery, setOpenLibraryQuery] = useState('')
  const [openLibraryResults, setOpenLibraryResults] = useState<ApiOpenLibraryBook[]>([])
  const [isLoadingOpenLibrary, setIsLoadingOpenLibrary] = useState(false)
  const [openLibraryError, setOpenLibraryError] = useState('')

  // Estado para feedback visual (error o confirmacion).
  const [formStatus, setFormStatus] = useState<FormStatus>('idle')
  const [message, setMessage] = useState('')

  // Busca en Open Library vía backend para autocompletar el formulario.
  const runOpenLibrarySearch = async (queryText: string) => {
    try {
      setIsLoadingOpenLibrary(true)
      setOpenLibraryError('')
      const results = await searchOpenLibrary(queryText)
      setOpenLibraryResults(results)
    } catch (error) {
      setOpenLibraryResults([])
      if (error instanceof ApiClientError) {
        setOpenLibraryError(error.message)
      } else {
        setOpenLibraryError('No se pudo buscar en Open Library.')
      }
    } finally {
      setIsLoadingOpenLibrary(false)
    }
  }

  useEffect(() => {
    const query = openLibraryQuery.trim()
    if (query.length < 3) {
      setOpenLibraryResults([])
      setOpenLibraryError('')
      return
    }

    const timeoutId = setTimeout(() => {
      void runOpenLibrarySearch(query)
    }, 350)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [openLibraryQuery])

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()

    const cleanTitle = title.trim()
    const cleanAuthor = author.trim()

    // Validación básica: título y autor son obligatorios.
    if (!cleanTitle || !cleanAuthor) {
      setFormStatus('error')
      setMessage('Completa título y autor antes de guardar.')
      return
    }

    try {
      await addBook({
        title: cleanTitle,
        author: cleanAuthor,
        genre,
        note,
        coverUrl: coverUrl.trim() || undefined,
        status,
        // Solo enviamos estrellas cuando el estado es "leído".
        stars: status === 'read' ? stars : undefined,
      })

      // Limpiamos inputs solo si el backend confirmó el alta.
      setTitle('')
      setAuthor('')
      setGenre('Novela')
      setNote('')
      setCoverUrl('')
      setStatus('wishlist')
      setStars(5)
      setOpenLibraryQuery('')
      setOpenLibraryResults([])
      setOpenLibraryError('')
      setFormStatus('success')
      setMessage('Libro añadido correctamente.')

      // Si el formulario vive en modal, avisamos para cerrarlo.
      onSuccess?.()
    } catch (error) {
      setFormStatus('error')
      setMessage(error instanceof ApiClientError ? error.message : 'No se pudo crear el libro.')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-h-[80vh] overflow-y-auto rounded-xl border border-[var(--ri-border)] bg-[var(--ri-surface)] p-6 shadow-xl shadow-black/30 md:p-7"
    >
      <p className="mb-2 text-[11px] uppercase tracking-[1.8px] text-[var(--ri-accent)]">Reading</p>
      <h3 className="mb-5 text-xl font-medium text-[var(--ri-text-primary)]">Añadir libro</h3>


      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="xl:col-span-3">
          <label htmlFor="book-openlibrary-search" className="mb-1.5 block text-xs text-[var(--ri-text-muted)]">
            Buscar en Open Library (autocompletar)
          </label>
          <input
            id="book-openlibrary-search"
            type="text"
            value={openLibraryQuery}
            onChange={(event) => setOpenLibraryQuery(event.target.value)}
            placeholder="Escribe al menos 3 letras..."
            className={fieldClassName}
          />
          {isLoadingOpenLibrary ? (
            <p className="mt-1 text-xs text-[var(--ri-text-muted)]">Buscando...</p>
          ) : null}
          {openLibraryResults.length > 0 ? (
            <div className="mt-2 max-h-44 space-y-2 overflow-y-auto rounded-lg border border-[var(--ri-border)] bg-[#0f0f0f] p-2">
              {openLibraryResults.map((book) => (
                <button
                  key={book.id}
                  type="button"
                  onClick={() => {
                    // Rellena campos para ahorrar escritura manual.
                    setTitle(book.title)
                    setAuthor(book.author)
                    setCoverUrl(book.coverUrl ?? '')
                    setGenre(normalizeGenre())
                    setOpenLibraryResults([])
                    setOpenLibraryError('')
                    setOpenLibraryQuery(book.title)
                  }}
                  className="w-full rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] px-3 py-2 text-left text-xs text-[var(--ri-text-secondary)] transition-colors hover:border-[#6b4f28]"
                >
                  <span className="block font-medium">{book.title}</span>
                  <span className="block text-[var(--ri-text-muted)]">{book.author}</span>
                </button>
              ))}
            </div>
          ) : null}
          {openLibraryError ? (
            <div className="mt-2 rounded-md border border-[#3a1f1f] bg-[#160b0b] p-2">
              <p className="text-xs text-[#ff9b9b]">{openLibraryError}</p>
              <button
                type="button"
                onClick={() => void runOpenLibrarySearch(openLibraryQuery)}
                className="mt-1 rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] px-2 py-1 text-[11px] text-[var(--ri-text-secondary)]"
              >
                Reintentar búsqueda
              </button>
            </div>
          ) : null}
        </div>

        <div>
          <label htmlFor="book-title" className="mb-1.5 block text-xs text-[var(--ri-text-muted)]">
            Título
          </label>
          <input
            id="book-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ej: El alquimista"
            className={fieldClassName}
          />
        </div>

        <div>
          <label htmlFor="book-author" className="mb-1.5 block text-xs text-[var(--ri-text-muted)]">
            Autor
          </label>
          <input
            id="book-author"
            type="text"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            placeholder="Ej: Paulo Coelho"
            className={fieldClassName}
          />
        </div>

        <div>
          <label htmlFor="book-cover-url" className="mb-1.5 block text-xs text-[var(--ri-text-muted)]">
            Portada (URL)
          </label>
          <input
            id="book-cover-url"
            type="url"
            value={coverUrl}
            onChange={(event) => setCoverUrl(event.target.value)}
            placeholder="https://..."
            className={fieldClassName}
          />
          {coverUrl ? (
            <div className="mt-2 rounded-md border border-[var(--ri-border)] bg-[#111] p-2">
              <p className="mb-1 text-[10px] text-[var(--ri-text-muted)]">Vista previa</p>
              <img
                src={coverUrl}
                alt="Vista previa de portada"
                className="h-16 w-12 rounded object-cover"
              />
            </div>
          ) : (
            <p className="mt-2 text-[11px] text-[var(--ri-text-muted)]">
              Este libro no tiene portada disponible en Open Library.
            </p>
          )}
        </div>

        <div className="md:col-span-2 xl:col-span-3">
          <label htmlFor="book-note" className="mb-1.5 block text-xs text-[var(--ri-text-muted)]">
            Nota personal
          </label>
          <textarea
            id="book-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Ej: Quiero leerlo este verano"
            rows={3}
            className="w-full rounded-lg border border-[var(--ri-border)] bg-[#0f0f0f] px-4 py-3 text-sm text-[var(--ri-text-secondary)] outline-none transition-colors focus:border-[var(--ri-accent)]"
          />
        </div>

        <div>
          <label htmlFor="book-status" className="mb-1.5 block text-xs text-[var(--ri-text-muted)]">
            Estado inicial
          </label>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setStatus('reading')}
              className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                status === 'reading'
                  ? 'border-[#164e63] bg-[#07141d] text-[var(--ri-reading)]'
                  : 'border-[var(--ri-border)] bg-[var(--ri-surface)] text-[var(--ri-text-secondary)]'
              }`}
            >
              Marcar como leyendo
            </button>
            <button
              type="button"
              onClick={() => setStatus('read')}
              className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                status === 'read'
                  ? 'border-[#3a2a12] bg-[#1a1000] text-[var(--ri-accent)]'
                  : 'border-[var(--ri-border)] bg-[var(--ri-surface)] text-[var(--ri-text-secondary)]'
              }`}
            >
              Marcar como leído
            </button>
          </div>
          <select
            id="book-status"
            value={status}
            onChange={(event) => setStatus(event.target.value as LibraryCard['status'])}
            className={fieldClassName}
          >
            <option value="wishlist">Quiero leer</option>
            <option value="reading">Leyendo</option>
            <option value="read">Leído</option>
          </select>
        </div>

        <div>
          <label htmlFor="book-genre" className="mb-1.5 block text-xs text-[var(--ri-text-muted)]">
            Género
          </label>
          <select
            id="book-genre"
            value={genre}
            onChange={(event) => setGenre(event.target.value)}
            className={fieldClassName}
          >
            {KNOWN_GENRES.map((knownGenre) => (
              <option key={knownGenre} value={knownGenre}>
                {knownGenre}
              </option>
            ))}
          </select>
        </div>

        {status === 'read' ? (
          <div>
            <label htmlFor="book-stars" className="mb-1.5 block text-xs text-[var(--ri-text-muted)]">
              Estrellas
            </label>
            <select
              id="book-stars"
              value={stars}
              onChange={(event) => setStars(Number(event.target.value))}
              className={fieldClassName}
            >
              <option value={1}>1 estrella</option>
              <option value={2}>2 estrellas</option>
              <option value={3}>3 estrellas</option>
              <option value={4}>4 estrellas</option>
              <option value={5}>5 estrellas</option>
            </select>
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <button
          type="submit"
          className="rounded-lg bg-[var(--ri-accent)] px-5 py-3 text-sm font-medium text-[var(--ri-bg)] shadow-md shadow-[#00000066]"
        >
          Añadir libro
        </button>

        {formStatus === 'idle' ? null : (
          <output
            className={`text-xs ${
              formStatus === 'error' ? 'text-[#ff7676]' : 'text-[var(--ri-reading)]'
            }`}
          >
            {message}
          </output>
        )}
      </div>
    </form>
  )
}
