import { useState, type FormEventHandler } from 'react'
import { useLibraryContext, type LibraryCard } from '../../context/LibraryContext'

type FormStatus = 'idle' | 'success' | 'error'

const fieldClassName =
  'h-11 w-full rounded-lg border border-[var(--ri-border)] bg-[#0f0f0f] px-4 text-sm text-[var(--ri-text-secondary)] outline-none transition-colors focus:border-[var(--ri-accent)]'

interface AddBookFormProps {
  // Callback opcional para cerrar modal tras guardar correctamente.
  onSuccess?: () => void
}

// Formulario controlado para anadir libros manualmente.
export function AddBookForm({ onSuccess }: Readonly<AddBookFormProps>) {
  const { addBook } = useLibraryContext()

  // Estado controlado de cada input del formulario.
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [genre, setGenre] = useState('Novela')
  const [status, setStatus] = useState<LibraryCard['status']>('wishlist')
  const [stars, setStars] = useState(5)

  // Estado para feedback visual (error o confirmacion).
  const [formStatus, setFormStatus] = useState<FormStatus>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    const cleanTitle = title.trim()
    const cleanAuthor = author.trim()

    // Validacion basica: titulo y autor son obligatorios.
    if (!cleanTitle || !cleanAuthor) {
      setFormStatus('error')
      setMessage('Completa titulo y autor antes de guardar.')
      return
    }

    addBook({
      title: cleanTitle,
      author: cleanAuthor,
      genre,
      status,
      // Solo enviamos estrellas cuando el estado es "leido".
      stars: status === 'read' ? stars : undefined,
    })

    // Limpiamos inputs para permitir alta rapida de otro libro.
    setTitle('')
    setAuthor('')
    setGenre('Novela')
    setStatus('wishlist')
    setStars(5)
    setFormStatus('success')
    setMessage('Libro anadido correctamente.')

    // Si el formulario vive en modal, avisamos para cerrarlo.
    onSuccess?.()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-[var(--ri-border)] bg-[var(--ri-surface)] p-6 shadow-xl shadow-black/30 md:p-7"
    >
      <p className="mb-2 text-[11px] uppercase tracking-[1.8px] text-[var(--ri-accent)]">Reading</p>
      <h3 className="mb-5 text-xl font-medium text-[var(--ri-text-primary)]">Anadir libro</h3>


      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div>
          <label htmlFor="book-title" className="mb-1.5 block text-xs text-[var(--ri-text-muted)]">
            Titulo
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
          <label htmlFor="book-status" className="mb-1.5 block text-xs text-[var(--ri-text-muted)]">
            Estado inicial
          </label>
          <select
            id="book-status"
            value={status}
            onChange={(event) => setStatus(event.target.value as LibraryCard['status'])}
            className={fieldClassName}
          >
            <option value="wishlist">Quiero leer</option>
            <option value="reading">Leyendo</option>
            <option value="read">Leido</option>
          </select>
        </div>

        <div>
          <label htmlFor="book-genre" className="mb-1.5 block text-xs text-[var(--ri-text-muted)]">
            Genero
          </label>
          <select
            id="book-genre"
            value={genre}
            onChange={(event) => setGenre(event.target.value)}
            className={fieldClassName}
          >
            <option value="Novela">Novela</option>
            <option value="Fantasia">Fantasia</option>
            <option value="Historia">Historia</option>
            <option value="Tecnologia">Tecnologia</option>
            <option value="Productividad">Productividad</option>
            <option value="Ciencia">Ciencia</option>
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
