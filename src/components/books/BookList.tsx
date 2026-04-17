import type { Book } from '../../types/book'
import { EmptyState } from '../ui/EmptyState'
import { BookCard } from './BookCard'

interface BookListProps {
  // Título de la sección que agrupa las tarjetas.
  title: string
  // Lista de libros que se mostrarán.
  books: Book[]
  // Texto cuando la lista esté vacía.
  emptyMessage: string
  // Acción al pulsar "Ver detalle".
  onOpenDetails: (book: Book) => void
}

export function BookList({
  title,
  books,
  emptyMessage,
  onOpenDetails,
}: BookListProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-wide text-brand-accent">
          {title}
        </h2>
        <p className="text-sm text-brand-100">
          Selecciona un libro para ver su detalle y tus notas guardadas.
        </p>
      </div>

      {books.length === 0 ? (
        <EmptyState title="Sin resultados" description={emptyMessage} />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {books.map((book) => (
            <BookCard key={book.id} book={book} onOpenDetails={onOpenDetails} />
          ))}
        </div>
      )}
    </section>
  )
}
