import { useEffect, useState, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { LibraryStats } from '../components/books/LibraryStats'
import { Modal } from '../components/ui/Modal'
import { type LibraryCard, useLibraryContext } from '../context/LibraryContext'

// Texto visible del estado del libro.
function statusLabel(status: LibraryCard['status']) {
  if (status === 'wishlist') return 'Wishlist'
  if (status === 'reading') return 'Leyendo'
  return 'Leido'
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
  } = useLibraryContext()
  // Valor temporal del slider para editar progreso antes de guardar.
  const [progressDraft, setProgressDraft] = useState(0)

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

      <section className="grid grid-cols-1 gap-4 px-8 pb-8 md:grid-cols-3">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[11px] uppercase tracking-[1.5px] text-[var(--ri-text-muted)]">Quiero leer</h2>
            <span className={`rounded-full border px-2 py-0.5 text-[10px] ${badgeClasses('wishlist')}`}>
              {wishlistBooks.length}
            </span>
          </div>
          {wishlistBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              isSelected={selectedBookId === book.id}
              onSelect={handleSelectBook}
            />
          ))}
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[11px] uppercase tracking-[1.5px] text-[var(--ri-text-muted)]">Leyendo</h2>
            <span className={`rounded-full border px-2 py-0.5 text-[10px] ${badgeClasses('reading')}`}>
              {readingBooks.length}
            </span>
          </div>
          {readingBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              isSelected={selectedBookId === book.id}
              onSelect={handleSelectBook}
            />
          ))}
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <Link
              to="/leidos"
              title="Ir a pagina de leidos"
              className="group inline-flex items-center gap-1 text-[11px] uppercase tracking-[1.5px] text-[var(--ri-text-muted)] underline-offset-2 transition-colors hover:text-[var(--ri-accent)] hover:underline"
            >
              <span>Leidos</span>
              <span className="text-[10px] transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
            <span className={`rounded-full border px-2 py-0.5 text-[10px] ${badgeClasses('read')}`}>
              {readBooks.length}
            </span>
          </div>
          {readBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              isSelected={selectedBookId === book.id}
              onSelect={handleSelectBook}
            />
          ))}
          {readBooks.length === 0 ? (
            <div className="rounded-md border border-dashed border-[var(--ri-border)] px-4 py-6 text-center">
              <p className="text-[11px] leading-relaxed text-[#333]">Anade mas libros a tu lista</p>
            </div>
          ) : null}
        </div>
      </section>

      <Modal isOpen={openedBook !== null} title="Resumen del libro" onClose={handleCloseModal}>
        {openedBook ? (
          <div className="space-y-4">
            <div className="rounded-md border border-[var(--ri-border)] bg-[#111] p-4">
              <p className="text-xs uppercase tracking-[1.5px] text-[var(--ri-text-muted)]">Titulo</p>
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
                  Marcar como leido
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
                  <p className="text-xs uppercase tracking-[1.5px] text-[var(--ri-text-muted)]">Valoracion</p>
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
          </div>
        ) : null}
      </Modal>
    </>
  )
}
