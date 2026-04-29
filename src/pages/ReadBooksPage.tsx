import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Modal } from '../components/ui/Modal'
import { type LibraryCard, useLibraryContext } from '../context/LibraryContext'

// Página exclusiva para libros leidos y seccion Top 10.
export function ReadBooksPage() {
  const { readBooks, top10BookIds, top10Books, addToTop10, removeFromTop10, updateBookStars } =
    useLibraryContext()
  // Libro seleccionado para abrir su resumen en modal.
  const [openedBook, setOpenedBook] = useState<LibraryCard | null>(null)

  // Mensaje simple para avisar cuando Top 10 ya está completo.
  const isTop10Full = top10BookIds.length >= 10

  return (
    <section className="px-8 pb-8 pt-12">
      <p className="mb-3 text-[11px] uppercase tracking-[2px] text-[var(--ri-accent)]">Leidos</p>
      <h1 className="mb-2 text-4xl font-medium leading-tight text-[var(--ri-text-primary)]">
        Tus libros finalizados
      </h1>
      <p className="mb-6 text-sm text-[var(--ri-text-muted)]">
        Aqui puedes gestionar tus leidos y construir tu Top 10 personal.
      </p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm uppercase tracking-[1.5px] text-[var(--ri-text-muted)]">Todos los leidos</h2>
            <span className="rounded-full border border-[var(--ri-border)] px-2 py-0.5 text-[10px] text-[#777]">
              {readBooks.length} libros
            </span>
          </div>

          {readBooks.length === 0 ? (
            <p className="text-sm text-[var(--ri-text-muted)]">Todavia no tienes libros marcados como leidos.</p>
          ) : (
            <div className="space-y-2">
              {readBooks.map((book) => {
                const isInTop10 = top10BookIds.includes(book.id)

                return (
                  <article
                    key={book.id}
                    className="flex flex-col gap-3 rounded-md border border-[var(--ri-border)] bg-[#111] p-3 md:flex-row md:items-center md:justify-between"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenedBook(book)}
                      className="text-left"
                    >
                      <p className="text-sm font-medium text-[var(--ri-text-secondary)]">{book.title}</p>
                      <p className="text-xs text-[var(--ri-text-muted)]">{book.author}</p>
                      {book.stars ? (
                        <p className="mt-1 text-xs text-[var(--ri-accent)]">{'★'.repeat(book.stars)}</p>
                      ) : null}
                    </button>

                    <button
                      type="button"
                      onClick={() => addToTop10(book.id)}
                      disabled={isInTop10 || isTop10Full}
                      className="rounded-md border border-[#3a2a12] bg-[#1a1000] px-3 py-1.5 text-xs font-medium text-[var(--ri-accent)] transition-colors hover:bg-[#221500] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isInTop10 ? 'Ya en Top 10' : 'Anadir al Top 10'}
                    </button>
                  </article>
                )
              })}
            </div>
          )}

          {isTop10Full ? (
            <p className="mt-3 text-xs text-[#ffb46a]">
              El Top 10 esta completo. Elimina alguno para anadir otro.
            </p>
          ) : null}
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm uppercase tracking-[1.5px] text-[var(--ri-text-muted)]">Top 10</h2>
              <span className="rounded-full border border-[#7a5010] px-2 py-0.5 text-[10px] text-[var(--ri-accent)]">
                {top10Books.length}/10
              </span>
            </div>

            {top10Books.length === 0 ? (
              <p className="text-sm text-[var(--ri-text-muted)]">Tu Top 10 esta vacio por ahora.</p>
            ) : (
              <div className="space-y-2">
                {top10Books.map((book, index) => (
                  <article
                    key={book.id}
                    className="flex flex-col gap-3 rounded-md border border-[var(--ri-border)] bg-[#111] p-3 md:flex-row md:items-center md:justify-between"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenedBook(book)}
                      className="text-left"
                    >
                      <p className="text-xs text-[var(--ri-text-muted)]">#{index + 1}</p>
                      <p className="text-sm font-medium text-[var(--ri-text-secondary)]">{book.title}</p>
                      <p className="text-xs text-[var(--ri-text-muted)]">{book.author}</p>
                      {book.stars ? (
                        <p className="mt-1 text-xs text-[var(--ri-accent)]">{'★'.repeat(book.stars)}</p>
                      ) : null}
                    </button>

                    <button
                      type="button"
                      onClick={() => removeFromTop10(book.id)}
                      className="rounded-md border border-[#3a2a12] bg-[#1a1000] px-3 py-1.5 text-xs font-medium text-[var(--ri-accent)] transition-colors hover:bg-[#221500]"
                    >
                      Eliminar de Top 10
                    </button>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link
          to="/"
          className="rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] px-4 py-2 text-xs text-[var(--ri-text-secondary)] transition-colors hover:border-[#6b4f28]"
        >
          Volver a biblioteca
        </Link>
      </div>

      <Modal isOpen={openedBook !== null} title="Resumen del libro" onClose={() => setOpenedBook(null)}>
        {openedBook ? (
          <div className="space-y-3">
            <div className="rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] p-4">
              <p className="text-xs uppercase tracking-[1.5px] text-[var(--ri-text-muted)]">Titulo</p>
              <p className="mt-1 text-base font-medium text-[var(--ri-text-primary)]">{openedBook.title}</p>
            </div>

            <div className="rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] p-4">
              <p className="text-xs uppercase tracking-[1.5px] text-[var(--ri-text-muted)]">Autor</p>
              <p className="mt-1 text-sm text-[var(--ri-text-secondary)]">{openedBook.author}</p>
            </div>

            <div className="rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] p-4">
              <p className="text-xs uppercase tracking-[1.5px] text-[var(--ri-text-muted)]">Estado</p>
              <p className="mt-1 text-sm text-[var(--ri-text-secondary)]">Leido</p>
            </div>

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

          </div>
        ) : null}
      </Modal>
    </section>
  )
}
