import type { Book } from '../../types/book'
import { Button } from '../ui/Button'

interface BookCardProps {
  // Libro que se va a mostrar en la tarjeta.
  book: Book
  // Acción para abrir el detalle del libro.
  onOpenDetails: (book: Book) => void
}

export function BookCard({ book, onOpenDetails }: BookCardProps) {
  return (
    <article className="grid grid-cols-[72px_1fr] gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <img
        src={book.coverUrl ?? 'https://placehold.co/144x220?text=No+Cover'}
        alt={`Portada de ${book.title}`}
        className="h-24 w-[72px] rounded-lg object-cover"
      />

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">
          {book.list}
        </p>
        <h3 className="line-clamp-2 text-base font-semibold text-slate-900">
          {book.title}
        </h3>
        <p className="text-sm text-slate-600">{book.authorNames.join(', ')}</p>

        <div className="flex items-center justify-between pt-1">
          <p className="text-xs text-slate-500">
            {book.firstPublishYear ?? 'Año desconocido'}
          </p>
          <Button variant="secondary" onClick={() => onOpenDetails(book)}>
            Ver detalle
          </Button>
        </div>
      </div>
    </article>
  )
}
