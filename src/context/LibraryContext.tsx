import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { createBook, deleteBook as deleteBookRequest, getBooks, updateBook, ApiClientError } from '../api/client'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { ApiBook } from '../types/api'
import { LibraryContext } from './LibraryContextInstance'

export interface LibraryCard {
  id: string
  title: string
  author: string
  genre?: string
  // Nota corta personal sobre el libro.
  note?: string
  // URL de portada. Queda lista para Open Library.
  coverUrl?: string
  // Fecha de alta del libro para ordenaciones.
  createdAt?: string
  // Fecha de finalizacion para objetivo anual.
  finishedAt?: string
  icon: string
  status: 'wishlist' | 'reading' | 'read'
  progress?: number
  stars?: number
}

type LibraryView = 'all' | 'wishlist' | 'reading' | 'read'

function iconByStatus(status: LibraryCard['status']) {
  if (status === 'wishlist') return '📖'
  if (status === 'reading') return '📗'
  return '📘'
}

// Convierte el tipo API al tipo que ya usa la UI.
function mapApiBookToLibraryCard(book: ApiBook): LibraryCard {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    coverUrl: book.coverUrl,
    note: book.notes,
    status: book.status,
    icon: iconByStatus(book.status),
    progress: book.progress,
    // Solo mostramos estrellas cuando el estado ya es "read".
    stars:
      book.status === 'read' && typeof book.rating === 'number'
        ? (book.rating as 1 | 2 | 3 | 4 | 5)
        : undefined,
    createdAt: book.createdAt,
    finishedAt: book.finishedAt,
  }
}

export interface LibraryContextValue {
  books: LibraryCard[]
  top10BookIds: string[]
  activeView: LibraryView
  selectedBookId: string | null
  openedBook: LibraryCard | null
  counts: {
    wishlist: number
    reading: number
    read: number
    total: number
  }
  wishlistBooks: LibraryCard[]
  readingBooks: LibraryCard[]
  readBooks: LibraryCard[]
  top10Books: LibraryCard[]
  booksLoading: boolean
  booksError: string | null
  retryLoadBooks: () => Promise<void>
  handleViewChange: (view: LibraryView) => void
  handleSelectBook: (bookId: string) => void
  handleCloseModal: () => void
  markBookAsReading: (bookId: string) => void
  markBookAsWishlist: (bookId: string) => void
  markBookAsRead: (bookId: string) => void
  updateBookProgress: (bookId: string, progress: number) => void
  updateBookStars: (bookId: string, stars: 1 | 2 | 3 | 4 | 5) => void
  updateBookNote: (bookId: string, note: string) => void
  yearlyGoal: number
  setYearlyGoal: (goal: number) => void
  addBook: (input: {
    title: string
    author: string
    genre?: string
    note?: string
    coverUrl?: string
    status: LibraryCard['status']
    stars?: number
  }) => void
  addToTop10: (bookId: string) => { ok: boolean; reason?: 'full' | 'already-added' | 'not-read' }
  removeFromTop10: (bookId: string) => void
  deleteBookById: (bookId: string) => void
}

interface LibraryProviderProps {
  children: ReactNode
}

export function LibraryProvider({ children }: Readonly<LibraryProviderProps>) {
  // Los libros ahora viven en backend y se cargan por API.
  const [books, setBooks] = useState<LibraryCard[]>([])
  // Estado para UI de red: carga inicial.
  const [booksLoading, setBooksLoading] = useState(true)
  // Estado para UI de red: error con mensaje claro.
  const [booksError, setBooksError] = useState<string | null>(null)
  // Lista de ids del Top 10 (persistida en localStorage).
  const [top10BookIds, setTop10BookIds] = useLocalStorage<string[]>('readink.top10.v1', [])
  // Meta anual de lectura configurable por el usuario.
  const [yearlyGoal, setYearlyGoalStorage] = useLocalStorage<number>('readink.yearly-goal.v1', 12)
  // Vista activa compartida para filtrar columnas.
  const [activeView, setActiveView] = useState<LibraryView>('all')
  // Libro seleccionado para resaltar la tarjeta.
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null)
  // Libro abierto en el modal de resumen.
  const [openedBookId, setOpenedBookId] = useState<string | null>(null)

  // Carga libros desde API y prepara estados loading/error.
  const retryLoadBooks = useCallback(async () => {
    try {
      setBooksLoading(true)
      setBooksError(null)
      const apiBooks = await getBooks()
      setBooks(apiBooks.map(mapApiBookToLibraryCard))
    } catch (error) {
      if (error instanceof ApiClientError) {
        setBooksError(error.message)
      } else {
        setBooksError('No se pudieron cargar tus libros. Reintenta.')
      }
    } finally {
      setBooksLoading(false)
    }
  }, [])

  // Carga inicial al montar el provider.
  useEffect(() => {
    void retryLoadBooks()
  }, [retryLoadBooks])

  // Calculamos métricas una vez por cambio real de libros.
  const counts = useMemo(() => {
    const wishlist = books.filter((book) => book.status === 'wishlist').length
    const reading = books.filter((book) => book.status === 'reading').length
    const read = books.filter((book) => book.status === 'read').length

    return {
      wishlist,
      reading,
      read,
      total: books.length,
    }
  }, [books])

  // Preparamos listas visibles según la pestaña actual.
  const visibleBooks = useMemo(() => {
    if (activeView === 'all') {
      return books
    }
    return books.filter((book) => book.status === activeView)
  }, [activeView, books])

  const wishlistBooks = useMemo(
    () => visibleBooks.filter((book) => book.status === 'wishlist'),
    [visibleBooks],
  )
  const readingBooks = useMemo(
    () => visibleBooks.filter((book) => book.status === 'reading'),
    [visibleBooks],
  )
  const readBooks = useMemo(
    () => visibleBooks.filter((book) => book.status === 'read'),
    [visibleBooks],
  )

  // Mapa por id para resolver libros de forma rapida.
  const booksById = useMemo(() => {
    return new Map(books.map((book) => [book.id, book]))
  }, [books])

  // Libros del top 10, respetando el orden de top10BookIds.
  const top10Books = useMemo(() => {
    return top10BookIds
      .map((bookId) => booksById.get(bookId))
      .filter((book): book is LibraryCard => Boolean(book))
  }, [booksById, top10BookIds])

  // Handler global para cambiar de vista sin recrear función.
  const handleViewChange = useCallback((view: LibraryView) => {
    setActiveView(view)
    // Al cambiar de vista, quitamos selección para evitar confusión visual.
    setSelectedBookId(null)
  }, [])

  // Handler global para seleccionar y abrir resumen del libro.
  const handleSelectBook = useCallback((bookId: string) => {
    setSelectedBookId(bookId)
    setOpenedBookId(bookId)
  }, [])

  // Handler global para cerrar el modal de resumen.
  const handleCloseModal = useCallback(() => {
    setOpenedBookId(null)
  }, [])

  // Guarda una nota corta en el libro seleccionado.
  const updateBookNote = useCallback(
    (bookId: string, note: string) => {
      const cleanNote = note.trim()
      void (async () => {
        try {
          setBooksError(null)
          const updatedBook = await updateBook(bookId, { notes: cleanNote || '' })
          setBooks((prevBooks) =>
            prevBooks.map((book) => (book.id === bookId ? mapApiBookToLibraryCard(updatedBook) : book)),
          )
        } catch (error) {
          if (error instanceof ApiClientError) {
            setBooksError(error.message)
          } else {
            setBooksError('No se pudo actualizar la nota.')
          }
        }
      })()
    },
    [setBooks, setBooksError],
  )

  // Normaliza la meta anual para evitar valores raros.
  const setYearlyGoal = useCallback(
    (goal: number) => {
      const safeGoal = Math.min(200, Math.max(1, Math.round(goal)))
      setYearlyGoalStorage(safeGoal)
    },
    [setYearlyGoalStorage],
  )

  // Cambia un libro de "wishlist" o "read" a "reading".
  const markBookAsReading = useCallback(
    (bookId: string) => {
      void (async () => {
        try {
          setBooksError(null)
          const updatedBook = await updateBook(bookId, {
            status: 'reading',
            progress: 0,
          })
          setBooks((prevBooks) =>
            prevBooks.map((book) => (book.id === bookId ? mapApiBookToLibraryCard(updatedBook) : book)),
          )
        } catch (error) {
          if (error instanceof ApiClientError) {
            setBooksError(error.message)
          } else {
            setBooksError('No se pudo cambiar el estado a leyendo.')
          }
        }
      })()
    },
    [setBooks, setBooksError],
  )

  // Cambia un libro de "reading" a "wishlist".
  const markBookAsWishlist = useCallback(
    (bookId: string) => {
      void (async () => {
        try {
          setBooksError(null)
          const updatedBook = await updateBook(bookId, { status: 'wishlist', progress: 0 })
          setBooks((prevBooks) =>
            prevBooks.map((book) => (book.id === bookId ? mapApiBookToLibraryCard(updatedBook) : book)),
          )
        } catch (error) {
          if (error instanceof ApiClientError) {
            setBooksError(error.message)
          } else {
            setBooksError('No se pudo mover a quiero leer.')
          }
        }
      })()
    },
    [setBooks, setBooksError],
  )

  // Cambia un libro de "reading" a "read".
  const markBookAsRead = useCallback(
    (bookId: string) => {
      void (async () => {
        try {
          setBooksError(null)
          const updatedBook = await updateBook(bookId, { status: 'read', progress: 100 })
          setBooks((prevBooks) =>
            prevBooks.map((book) => (book.id === bookId ? mapApiBookToLibraryCard(updatedBook) : book)),
          )
        } catch (error) {
          if (error instanceof ApiClientError) {
            setBooksError(error.message)
          } else {
            setBooksError('No se pudo marcar como leído.')
          }
        }
      })()
    },
    [setBooks, setBooksError],
  )

  // Actualiza el progreso (%) de un libro en estado "reading".
  const updateBookProgress = useCallback(
    (bookId: string, progress: number) => {
      // Aseguramos rango valido para evitar valores raros.
      const safeProgress = Math.min(100, Math.max(0, Math.round(progress)))
      void (async () => {
        try {
          setBooksError(null)
          const updatedBook = await updateBook(bookId, { progress: safeProgress })
          setBooks((prevBooks) =>
            prevBooks.map((book) => (book.id === bookId ? mapApiBookToLibraryCard(updatedBook) : book)),
          )
        } catch (error) {
          if (error instanceof ApiClientError) {
            setBooksError(error.message)
          } else {
            setBooksError('No se pudo actualizar el progreso.')
          }
        }
      })()
    },
    [setBooks, setBooksError],
  )

  // Actualiza la puntuacion de un libro leido.
  const updateBookStars = useCallback(
    (bookId: string, stars: 1 | 2 | 3 | 4 | 5) => {
      void (async () => {
        try {
          setBooksError(null)
          const updatedBook = await updateBook(bookId, { rating: stars })
          setBooks((prevBooks) =>
            prevBooks.map((book) => (book.id === bookId ? mapApiBookToLibraryCard(updatedBook) : book)),
          )
        } catch (error) {
          if (error instanceof ApiClientError) {
            setBooksError(error.message)
          } else {
            setBooksError('No se pudo actualizar la valoración.')
          }
        }
      })()
    },
    [setBooks, setBooksError],
  )

  // Crea un nuevo libro en la biblioteca global.
  const addBook = useCallback(
    (input: {
      title: string
      author: string
      genre?: string
      note?: string
      coverUrl?: string
      status: LibraryCard['status']
      stars?: number
    }) => {
      void (async () => {
        try {
          setBooksError(null)
          const createdBook = await createBook({
            title: input.title,
            author: input.author,
            coverUrl: input.coverUrl,
            status: input.status,
            notes: input.note?.trim() || undefined,
            rating: input.status === 'read' ? input.stars : undefined,
            progress: input.status === 'reading' ? 0 : undefined,
          })
          setBooks((prevBooks) => [mapApiBookToLibraryCard(createdBook), ...prevBooks])
        } catch (error) {
          if (error instanceof ApiClientError) {
            setBooksError(error.message)
          } else {
            setBooksError('No se pudo crear el libro.')
          }
        }
      })()
    },
    [setBooks, setBooksError],
  )

  // Añade un libro al Top 10 si cumple reglas.
  const addToTop10 = useCallback(
    (bookId: string) => {
      const book = booksById.get(bookId)
      if (book?.status !== 'read') {
        return { ok: false as const, reason: 'not-read' as const }
      }
      if (top10BookIds.includes(bookId)) {
        return { ok: false as const, reason: 'already-added' as const }
      }
      if (top10BookIds.length >= 10) {
        return { ok: false as const, reason: 'full' as const }
      }

      setTop10BookIds((prevIds) => [...prevIds, bookId])
      return { ok: true as const }
    },
    [booksById, top10BookIds, setTop10BookIds],
  )

  // Elimina un libro del Top 10 por id.
  const removeFromTop10 = useCallback(
    (bookId: string) => {
      setTop10BookIds((prevIds) => prevIds.filter((id) => id !== bookId))
    },
    [setTop10BookIds],
  )

  // Elimina libro en backend y sincroniza estado local.
  const deleteBookById = useCallback(
    (bookId: string) => {
      void (async () => {
        try {
          setBooksError(null)
          await deleteBookRequest(bookId)
          setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId))
          setTop10BookIds((prevIds) => prevIds.filter((id) => id !== bookId))
          setSelectedBookId((prevId) => (prevId === bookId ? null : prevId))
          setOpenedBookId((prevId) => (prevId === bookId ? null : prevId))
        } catch (error) {
          if (error instanceof ApiClientError) {
            setBooksError(error.message)
          } else {
            setBooksError('No se pudo eliminar el libro.')
          }
        }
      })()
    },
    [setBooks, setBooksError, setTop10BookIds],
  )

  // Resolvemos el libro abierto actual para el modal.
  const openedBook = useMemo(
    () => books.find((book) => book.id === openedBookId) ?? null,
    [books, openedBookId],
  )

  const value = useMemo(
    () => ({
      books,
      top10BookIds,
      activeView,
      selectedBookId,
      openedBook,
      counts,
      wishlistBooks,
      readingBooks,
      readBooks,
      top10Books,
      booksLoading,
      booksError,
      retryLoadBooks,
      handleViewChange,
      handleSelectBook,
      handleCloseModal,
      markBookAsReading,
      markBookAsWishlist,
      markBookAsRead,
      updateBookProgress,
      updateBookStars,
      updateBookNote,
      yearlyGoal,
      setYearlyGoal,
      addBook,
      addToTop10,
      removeFromTop10,
      deleteBookById,
    }),
    [
      books,
      top10BookIds,
      activeView,
      selectedBookId,
      openedBook,
      counts,
      wishlistBooks,
      readingBooks,
      readBooks,
      top10Books,
      booksLoading,
      booksError,
      retryLoadBooks,
      handleViewChange,
      handleSelectBook,
      handleCloseModal,
      markBookAsReading,
      markBookAsWishlist,
      markBookAsRead,
      updateBookProgress,
      updateBookStars,
      updateBookNote,
      yearlyGoal,
      setYearlyGoal,
      addBook,
      addToTop10,
      removeFromTop10,
      deleteBookById,
    ],
  )

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
}

