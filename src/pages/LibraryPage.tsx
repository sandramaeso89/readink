import { useEffect, type KeyboardEvent } from 'react'
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
  return 'border-[#222] text-[#555]'
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
        isSelected ? 'border-[var(--ri-accent)]' : 'border-[var(--ri-border)] hover:border-[#333]'
      }`}
      onClick={() => onSelect(book.id)}
      onKeyDown={handleKeyDown}
    >
      <div
        className={`mb-2.5 flex h-20 items-center justify-center rounded-md ${coverClasses(book.status)}`}
      >
        <span className="text-3xl opacity-40">{book.icon}</span>
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
        <div className="mt-2 h-0.5 overflow-hidden rounded-full bg-[#1e1e1e]">
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
  } = useLibraryContext()

  // Mantiene el titulo de la pestaña al dia con el total de libros.
  useEffect(() => {
    document.title = `Readink · ${counts.total} libros`
  }, [counts.total])

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
            <h2 className="text-[11px] uppercase tracking-[1.5px] text-[var(--ri-text-muted)]">Leidos</h2>
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
            <div className="rounded-md border border-dashed border-[#1e1e1e] px-4 py-6 text-center">
              <p className="text-[11px] leading-relaxed text-[#333]">Anade mas libros a tu lista</p>
            </div>
          ) : null}
        </div>
      </section>

      <Modal isOpen={openedBook !== null} title="Resumen del libro" onClose={handleCloseModal}>
        {openedBook ? (
          <div className="space-y-4">
            <div className="rounded-md border border-[#1e1e1e] bg-[#111] p-4">
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

            {openedBook.stars ? (
              <div className="rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] p-4">
                <p className="text-xs uppercase tracking-[1.5px] text-[var(--ri-text-muted)]">Valoracion</p>
                <p className="mt-1 text-sm text-[var(--ri-accent)]">{'★'.repeat(openedBook.stars)}</p>
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </>
  )
}
