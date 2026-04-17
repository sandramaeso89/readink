import type { Book } from '../../types/book'
import { Button } from '../ui/Button'

interface BookCardProps {
  // Libro que se va a mostrar en la tarjeta.
  book: Book
  // Acción para abrir el detalle del libro.
  onOpenDetails: (book: Book) => void
}

export function BookCard({ book, onOpenDetails }: BookCardProps) {
  // Fondo difuminado morado para todas las tarjetas.
  const cardGradientByStatus = {
    WISHLIST: 'bg-gradient-to-br from-brand-accent/35 via-brand-500/35 to-brand-800',
    READING: 'bg-gradient-to-br from-brand-500/40 via-brand-700/35 to-brand-800',
    READ: 'bg-gradient-to-br from-brand-700/35 via-brand-accent/30 to-brand-800',
  } as const

  return (
    <article
      className={`grid grid-cols-[72px_1fr] gap-4 overflow-hidden rounded-2xl border border-brand-200/20 p-4 shadow-lg shadow-black/35 transition-transform duration-200 hover:-translate-y-1 ${cardGradientByStatus[book.list]}`}
    >
      <img
        src={book.coverUrl ?? 'https://placehold.co/144x220?text=No+Cover'}
        alt={`Portada de ${book.title}`}
        className="h-24 w-[72px] rounded-lg border border-brand-200/30 object-cover"
      />

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-white/90">
          {book.list}
        </p>
        <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-brand-accent">
          {book.title}
        </h3>
        <p className="text-sm text-white">{book.authorNames.join(', ')}</p>

        <div className="flex items-center justify-between pt-1">
          <p className="text-xs text-white/90">
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
