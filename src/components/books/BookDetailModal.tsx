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
        <div className="space-y-4">
          <div className="grid grid-cols-[96px_1fr] gap-4">
            <img
              src={book.coverUrl ?? 'https://placehold.co/192x300?text=No+Cover'}
              alt={`Portada de ${book.title}`}
              className="h-36 w-24 rounded-lg object-cover"
            />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-900">{book.title}</h3>
              <p className="text-sm text-slate-600">
                {book.authorNames.join(', ')}
              </p>
              <p className="text-sm text-slate-500">
                Año: {book.firstPublishYear ?? 'No disponible'}
              </p>
              <p className="text-sm text-slate-500">Estado: {book.list}</p>
              <p className="text-sm text-slate-500">
                Valoración:{' '}
                {book.rating === null ? 'Sin valorar' : `${book.rating}/5`}
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Nota personal
            </p>
            <p className="mt-1 text-sm text-slate-700">
              {book.note ?? 'Todavía no has escrito ninguna nota.'}
            </p>
          </div>
        </div>
      )}
    </Modal>
  )
}
