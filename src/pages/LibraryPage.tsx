import { useEffect, useMemo, useState, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { LibraryStats } from '../components/books/LibraryStats'
import { Modal } from '../components/ui/Modal'
import { type LibraryCard, useLibraryContext } from '../context/LibraryContext'

// Texto visible del estado del libro.
function statusLabel(status: LibraryCard['status']) {
  if (status === 'wishlist') return 'Wishlist'
  if (status === 'reading') return 'Leyendo'
  return 'Leído'
}

// Color de fondo del icono segun el estado.
function coverClasses(status: LibraryCard['status']) {
  if (status === 'wishlist') return 'bg-[#1a1000]'
  if (status === 'reading') return 'bg-[#0a1200]'
  return 'bg-[#0d0d0d]'
}

// Color del chip del estado dentro de la tarjeta.
function tagClasses(status: LibraryCard['status']) {
  if (status === 'wishlist') return 'bg-[#1a1000] text-[var(--ri-accent)]'
  if (status === 'reading') return 'bg-[#07141d] text-[var(--ri-reading)]'
  return 'bg-[#161616] text-[#555]'
}

// Color del contador (badge) de cada columna.
function badgeClasses(kind: 'wishlist' | 'reading' | 'read') {
  if (kind === 'wishlist') return 'border-[#7a5010] text-[var(--ri-accent)]'
  if (kind === 'reading') return 'border-[#164e63] text-[var(--ri-reading)]'
  return 'border-[var(--ri-border)] text-[#777]'
}

interface BookCardProps {
  readonly book: LibraryCard
  readonly isSelected: boolean
  readonly onSelect: (bookId: string) => void
}

type LibrarySort = 'recent' | 'title' | 'rating' | 'progress'

// Tarjeta individual de libro. Es un <button> para accesibilidad
// (se puede activar con click, Enter o Espacio).
function BookCard({ book, isSelected, onSelect }: BookCardProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect(book.id)
    }
  }

  return (
    <button
      type="button"
      className={`mb-2.5 flex h-[205px] w-full cursor-pointer flex-col rounded-md border bg-[var(--ri-surface)] p-3.5 text-left transition-colors ${
        isSelected ? 'border-[var(--ri-accent)]' : 'border-[var(--ri-border)] hover:border-[#6b4f28]'
      }`}
      onClick={() => onSelect(book.id)}
      onKeyDown={handleKeyDown}
    >
      <div
        className={`mb-2.5 flex h-20 items-center justify-center rounded-md ${coverClasses(book.status)}`}
      >
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={`Portada de ${book.title}`}
            className="h-full w-full rounded-md object-cover"
          />
        ) : (
          <span className="text-3xl opacity-40">{book.icon}</span>
        )}
      </div>
      <h3 className="mb-1 line-clamp-2 min-h-9 text-[13px] font-medium text-[var(--ri-text-secondary)]">
        {book.title}
      </h3>
      <p className="mb-2 truncate text-[11px] text-[var(--ri-text-muted)]">{book.author}</p>
      {book.note ? (
        <p className="line-clamp-2 text-[10px] text-[var(--ri-text-muted)]">"{book.note}"</p>
      ) : null}
      <div className="mt-auto flex items-center justify-between">
        <span className={`rounded-full px-2 py-0.5 text-[10px] ${tagClasses(book.status)}`}>
          {statusLabel(book.status)}
        </span>
        {book.stars ? (
          <span className="text-[10px] tracking-[-1px] text-[var(--ri-accent)]">
            {'★'.repeat(book.stars)}
          </span>
        ) : null}
      </div>
      {book.progress ? (
        <div className="mt-2 h-0.5 overflow-hidden rounded-full bg-[var(--ri-border)]">
          <div
            className="h-full rounded-full bg-[var(--ri-reading)]"
            style={{ width: `${book.progress}%` }}
          />
        </div>
      ) : null}
    </button>
  )
}

// Pagina "Biblioteca" (ruta "/"): contiene el hero, las stats
// y las tres columnas de libros.
export function LibraryPage() {
  // Estado global: libros, listas filtradas y handlers del modal.
  const {
    selectedBookId,
    openedBook,
    counts,
    wishlistBooks,
    readingBooks,
    readBooks,
    handleSelectBook,
    handleCloseModal,
    markBookAsReading,
    markBookAsWishlist,
    markBookAsRead,
    updateBookProgress,
    updateBookStars,
    updateBookNote,
  } = useLibraryContext()
  // Valor temporal del slider para editar progreso antes de guardar.
  const [progressDraft, setProgressDraft] = useState(0)
  // Valor temporal para editar nota del libro en el modal.
  const [noteDraft, setNoteDraft] = useState('')
  // Filtros de busqueda para columnas de biblioteca.
  const [searchTerm, setSearchTerm] = useState('')
  const [genreFilter, setGenreFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState<'all' | LibraryCard['status']>('all')
  const [sortBy, setSortBy] = useState<LibrarySort>('recent')

  // Mantiene el titulo de la pestaña al dia con el total de libros.
  useEffect(() => {
    document.title = `Readink · ${counts.total} libros`
  }, [counts.total])

  // Cuando cambia el libro abierto, sincronizamos el slider.
  useEffect(() => {
    if (openedBook?.status === 'reading') {
      setProgressDraft(openedBook.progress ?? 0)
    }
  }, [openedBook])

  // Sincroniza la nota temporal cuando cambias de libro abierto.
  useEffect(() => {
    setNoteDraft(openedBook?.note ?? '')
  }, [openedBook])

  // Lista de generos para el filtro rapido.
  const availableGenres = useMemo(() => {
    const uniqueGenres = new Set<string>()
    ;[...wishlistBooks, ...readingBooks, ...readBooks].forEach((book) => {
      if (book.genre) {
        uniqueGenres.add(book.genre)
      }
    })
    return [...uniqueGenres].sort((a, b) => a.localeCompare(b))
  }, [wishlistBooks, readingBooks, readBooks])

  // Reglas unificadas para filtrar y ordenar cada columna.
  const filterAndSortBooks = (books: LibraryCard[]) => {
    const query = searchTerm.trim().toLowerCase()
    const filtered = books.filter((book) => {
      if (statusFilter !== 'all' && book.status !== statusFilter) {
        return false
      }
      if (genreFilter !== 'all' && (book.genre ?? '') !== genreFilter) {
        return false
      }
      if (!query) {
        return true
      }
      return (
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        (book.note?.toLowerCase().includes(query) ?? false)
      )
    })

    return filtered.sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title)
      }
      if (sortBy === 'rating') {
        return (b.stars ?? 0) - (a.stars ?? 0)
      }
      if (sortBy === 'progress') {
        return (b.progress ?? 0) - (a.progress ?? 0)
      }
      const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return bDate - aDate
    })
  }

  const visibleWishlistBooks = useMemo(() => filterAndSortBooks(wishlistBooks), [wishlistBooks, searchTerm, genreFilter, statusFilter, sortBy])
  const visibleReadingBooks = useMemo(() => filterAndSortBooks(readingBooks), [readingBooks, searchTerm, genreFilter, statusFilter, sortBy])
  const visibleReadBooks = useMemo(() => filterAndSortBooks(readBooks), [readBooks, searchTerm, genreFilter, statusFilter, sortBy])

  return (
    <>
      <section className="px-8 pb-8 pt-12">
        <p className="mb-3 text-[11px] uppercase tracking-[2px] text-[var(--ri-accent)]">
          Tu biblioteca
        </p>
        <h1 className="mb-2 text-4xl font-medium leading-tight text-[var(--ri-text-primary)]">
          Bienvenida, Sandra.
        </h1>
        <p className="text-sm text-[var(--ri-text-muted)]">
          {counts.total} libros registrados · {counts.reading} en progreso
        </p>
      </section>

      <LibraryStats />

      <section className="px-8 pb-4">
        <div className="grid grid-cols-1 gap-3 rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] p-4 md:grid-cols-2 xl:grid-cols-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar por título, autor o nota"
            className="h-10 rounded-md border border-[var(--ri-border)] bg-[#0f0f0f] px-3 text-xs text-[var(--ri-text-secondary)] outline-none focus:border-[var(--ri-accent)]"
          />
          <select
            value={genreFilter}
            onChange={(event) => setGenreFilter(event.target.value)}
            className="h-10 rounded-md border border-[var(--ri-border)] bg-[#0f0f0f] px-3 text-xs text-[var(--ri-text-secondary)] outline-none focus:border-[var(--ri-accent)]"
          >
            <option value="all">Todos los géneros</option>
            {availableGenres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as 'all' | LibraryCard['status'])}
            className="h-10 rounded-md border border-[var(--ri-border)] bg-[#0f0f0f] px-3 text-xs text-[var(--ri-text-secondary)] outline-none focus:border-[var(--ri-accent)]"
          >
            <option value="all">Todos los estados</option>
            <option value="wishlist">Quiero leer</option>
            <option value="reading">Leyendo</option>
            <option value="read">Leído</option>
          </select>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as LibrarySort)}
            className="h-10 rounded-md border border-[var(--ri-border)] bg-[#0f0f0f] px-3 text-xs text-[var(--ri-text-secondary)] outline-none focus:border-[var(--ri-accent)]"
          >
            <option value="recent">Orden: añadidos recientemente</option>
            <option value="title">Orden: título A-Z</option>
            <option value="rating">Orden: mejor valorados</option>
            <option value="progress">Orden: mayor progreso</option>
          </select>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 px-8 pb-8 md:grid-cols-3">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[11px] uppercase tracking-[1.5px] text-[var(--ri-text-muted)]">Quiero leer</h2>
            <span className={`rounded-full border px-2 py-0.5 text-[10px] ${badgeClasses('wishlist')}`}>
              {visibleWishlistBooks.length}
            </span>
          </div>
          {visibleWishlistBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              isSelected={selectedBookId === book.id}
              onSelect={handleSelectBook}
            />
          ))}
          {visibleWishlistBooks.length === 0 ? (
            <div className="rounded-md border border-dashed border-[var(--ri-border)] px-4 py-6 text-center">
              <p className="text-[11px] leading-relaxed text-[#777]">Sin resultados en quiero leer.</p>
              <Link to="/explorar" className="mt-2 inline-block text-xs text-[var(--ri-accent)] underline">
                Ir a explorar
              </Link>
            </div>
          ) : null}
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[11px] uppercase tracking-[1.5px] text-[var(--ri-text-muted)]">Leyendo</h2>
            <span className={`rounded-full border px-2 py-0.5 text-[10px] ${badgeClasses('reading')}`}>
              {visibleReadingBooks.length}
            </span>
          </div>
          {visibleReadingBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              isSelected={selectedBookId === book.id}
              onSelect={handleSelectBook}
            />
          ))}
          {visibleReadingBooks.length === 0 ? (
            <div className="rounded-md border border-dashed border-[var(--ri-border)] px-4 py-6 text-center">
              <p className="text-[11px] leading-relaxed text-[#777]">Sin resultados en leyendo.</p>
            </div>
          ) : null}
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <Link
              to="/leidos"
              title="Ir a página de leídos"
              className="group inline-flex items-center gap-1 text-[11px] uppercase tracking-[1.5px] text-[var(--ri-text-muted)] underline-offset-2 transition-colors hover:text-[var(--ri-accent)] hover:underline"
            >
              <span>Leídos</span>
              <span className="text-[10px] transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
            <span className={`rounded-full border px-2 py-0.5 text-[10px] ${badgeClasses('read')}`}>
              {visibleReadBooks.length}
            </span>
          </div>
          {visibleReadBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              isSelected={selectedBookId === book.id}
              onSelect={handleSelectBook}
            />
          ))}
          {visibleReadBooks.length === 0 ? (
            <div className="rounded-md border border-dashed border-[var(--ri-border)] px-4 py-6 text-center">
              <p className="text-[11px] leading-relaxed text-[#777]">Sin resultados en leídos.</p>
            </div>
          ) : null}
        </div>
      </section>

      <Modal isOpen={openedBook !== null} title="Resumen del libro" onClose={handleCloseModal}>
        {openedBook ? (
          <div className="space-y-4">
            <div className="rounded-md border border-[var(--ri-border)] bg-[#111] p-4">
              <p className="text-xs uppercase tracking-[1.5px] text-[var(--ri-text-muted)]">Título</p>
              <p className="mt-1 text-lg font-medium text-[var(--ri-text-primary)]">{openedBook.title}</p>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] p-4">
                <p className="text-xs uppercase tracking-[1.5px] text-[var(--ri-text-muted)]">Autor</p>
                <p className="mt-1 text-sm text-[var(--ri-text-secondary)]">{openedBook.author}</p>
              </div>
              <div className="rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] p-4">
                <p className="text-xs uppercase tracking-[1.5px] text-[var(--ri-text-muted)]">Estado</p>
                <p className="mt-1 text-sm text-[var(--ri-text-secondary)]">{statusLabel(openedBook.status)}</p>
              </div>
            </div>

            {openedBook.progress ? (
              <div className="rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] p-4">
                <p className="text-xs uppercase tracking-[1.5px] text-[var(--ri-text-muted)]">Progreso</p>
                <p className="mt-1 text-sm text-[var(--ri-text-secondary)]">{openedBook.progress}% completado</p>
              </div>
            ) : null}

            {openedBook.status === 'reading' ? (
              <div className="rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] p-4">
                <p className="text-xs uppercase tracking-[1.5px] text-[var(--ri-text-muted)]">Actualizar progreso</p>
                <div className="mt-2">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={progressDraft}
                    onChange={(event) => setProgressDraft(Number(event.target.value))}
                    className="h-1 w-full cursor-pointer appearance-none rounded-full bg-[#2a2a2a] accent-[var(--ri-reading)]"
                  />
                  <p className="mt-1 text-xs text-[var(--ri-text-secondary)]">{progressDraft}%</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    updateBookProgress(openedBook.id, progressDraft)
                    handleCloseModal()
                  }}
                  className="mt-3 rounded-md border border-[#164e63] bg-[#07141d] px-4 py-2 text-xs font-medium text-[var(--ri-reading)]"
                >
                  Guardar progreso
                </button>

                {/* Accion rapida para mover el libro a la columna de leidos. */}
                <button
                  type="button"
                  onClick={() => {
                    markBookAsRead(openedBook.id)
                    handleCloseModal()
                  }}
                  className="ml-2 rounded-md bg-[var(--ri-accent)] px-4 py-2 text-xs font-medium text-[var(--ri-bg)]"
                >
                  Marcar como leído
                </button>

                <button
                  type="button"
                  onClick={() => {
                    markBookAsWishlist(openedBook.id)
                    handleCloseModal()
                  }}
                  className="ml-2 rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] px-4 py-2 text-xs font-medium text-[var(--ri-text-secondary)]"
                >
                  Marcar como quiero leer
                </button>
              </div>
            ) : null}

            {openedBook.status === 'wishlist' ? (
              <div className="rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] p-4">
                {/* Accion rapida para mover el libro a la columna de leyendo. */}
                <button
                  type="button"
                  onClick={() => {
                    markBookAsReading(openedBook.id)
                    handleCloseModal()
                  }}
                  className="rounded-md border border-[#164e63] bg-[#07141d] px-4 py-2 text-xs font-medium text-[var(--ri-reading)]"
                >
                  Marcar como leyendo
                </button>
              </div>
            ) : null}

            {openedBook.status === 'read' ? (
              <>
                <div className="rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] p-4">
                  <p className="text-xs uppercase tracking-[1.5px] text-[var(--ri-text-muted)]">Valoración</p>
                  <div className="mt-2 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => updateBookStars(openedBook.id, star as 1 | 2 | 3 | 4 | 5)}
                        className={`text-lg transition-colors ${
                          (openedBook.stars ?? 0) >= star ? 'text-[var(--ri-accent)]' : 'text-[#555]'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] p-4">
                  {/* Accion rapida para mover el libro de leido a leyendo. */}
                  <button
                    type="button"
                    onClick={() => {
                      markBookAsReading(openedBook.id)
                      handleCloseModal()
                    }}
                    className="rounded-md border border-[#164e63] bg-[#07141d] px-4 py-2 text-xs font-medium text-[var(--ri-reading)]"
                  >
                    Marcar como leyendo
                  </button>
                </div>
              </>
            ) : null}

            <div className="rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] p-4">
              <p className="text-xs uppercase tracking-[1.5px] text-[var(--ri-text-muted)]">Nota personal</p>
              <textarea
                value={noteDraft}
                onChange={(event) => setNoteDraft(event.target.value)}
                rows={3}
                placeholder="Escribe una frase o resumen corto..."
                className="mt-2 w-full rounded-md border border-[var(--ri-border)] bg-[#0f0f0f] px-3 py-2 text-xs text-[var(--ri-text-secondary)] outline-none focus:border-[var(--ri-accent)]"
              />
              <button
                type="button"
                onClick={() => updateBookNote(openedBook.id, noteDraft)}
                className="mt-3 rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] px-4 py-2 text-xs font-medium text-[var(--ri-text-secondary)]"
              >
                Guardar nota
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  )
}
