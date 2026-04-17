import type { Book } from '../../types/book'
import { Modal } from '../ui/Modal'

interface BookDetailModalProps {
  // Libro seleccionado. Si es null, el modal se cierra.
  book: Book | null
  // Función para cerrar el modal.
  onClose: () => void
}

export function BookDetailModal({ book, onClose }: BookDetailModalProps) {
  return (
    <Modal isOpen={book !== null} title="Detalle del libro" onClose={onClose}>
      {!book ? null : (
        <div className="space-y-5">
          <div className="grid grid-cols-[96px_1fr] gap-4 md:grid-cols-[112px_1fr]">
            <img
              src={book.coverUrl ?? 'https://placehold.co/192x300?text=No+Cover'}
              alt={`Portada de ${book.title}`}
              className="h-36 w-24 rounded-xl border border-brand-200/25 object-cover md:h-40 md:w-28"
            />
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-brand-accent">{book.title}</h3>
              <p className="text-sm text-brand-200">
                {book.authorNames.join(', ')}
              </p>
              <p className="text-sm text-brand-200">
                Año: {book.firstPublishYear ?? 'No disponible'}
              </p>
              <p className="text-sm text-brand-200">Estado: {book.list}</p>
              <p className="text-sm text-brand-200">
                Valoración:{' '}
                {book.rating === null ? 'Sin valorar' : `${book.rating}/5`}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-brand-accent/50 bg-brand-900/85 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent">
              Nota personal
            </p>
            <p className="mt-1 text-sm text-brand-200">
              {book.note ?? 'Todavía no has escrito ninguna nota.'}
            </p>
          </div>
        </div>
      )}
    </Modal>
  )
}
