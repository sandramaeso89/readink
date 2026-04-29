import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

export interface LibraryCard {
  id: string
  title: string
  author: string
  genre?: string
  // URL de portada. Queda lista para Open Library.
  coverUrl?: string
  icon: string
  status: 'wishlist' | 'reading' | 'read'
  progress?: number
  stars?: number
}

type LibraryView = 'all' | 'wishlist' | 'reading' | 'read'

const INITIAL_BOOKS: LibraryCard[] = [
  {
    id: 'wishlist-1',
    title: 'La insoportable levedad',
    author: 'Milan Kundera',
    genre: 'Novela',
    icon: '📖',
    status: 'wishlist',
  },
  {
    id: 'wishlist-2',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    genre: 'Historia',
    icon: '📖',
    status: 'wishlist',
  },
  {
    id: 'wishlist-3',
    title: 'La vegetariana',
    author: 'Han Kang',
    genre: 'Novela',
    icon: '📖',
    status: 'wishlist',
  },
  {
    id: 'reading-1',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    genre: 'Tecnologia',
    icon: '📗',
    status: 'reading',
    progress: 62,
  },
  {
    id: 'reading-2',
    title: 'El nombre del viento',
    author: 'Patrick Rothfuss',
    genre: 'Fantasia',
    icon: '📗',
    status: 'reading',
    progress: 28,
  },
  {
    id: 'read-1',
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Productividad',
    icon: '📘',
    status: 'read',
    stars: 5,
  },
]

interface LibraryContextValue {
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
  handleViewChange: (view: LibraryView) => void
  handleSelectBook: (bookId: string) => void
  handleCloseModal: () => void
  markBookAsReading: (bookId: string) => void
  markBookAsRead: (bookId: string) => void
  updateBookProgress: (bookId: string, progress: number) => void
  updateBookStars: (bookId: string, stars: 1 | 2 | 3 | 4 | 5) => void
  addBook: (input: {
    title: string
    author: string
    genre?: string
    coverUrl?: string
    status: LibraryCard['status']
    stars?: number
  }) => void
  addToTop10: (bookId: string) => { ok: boolean; reason?: 'full' | 'already-added' | 'not-read' }
  removeFromTop10: (bookId: string) => void
}

const LibraryContext = createContext<LibraryContextValue | null>(null)

interface LibraryProviderProps {
  children: ReactNode
}

export function LibraryProvider({ children }: Readonly<LibraryProviderProps>) {
  // Estado global de libros compartido por toda la app.
  const [books, setBooks] = useLocalStorage<LibraryCard[]>('readink.library.v1', INITIAL_BOOKS)
  // Lista de ids del Top 10 (persistida en localStorage).
  const [top10BookIds, setTop10BookIds] = useLocalStorage<string[]>('readink.top10.v1', [])
  // Vista activa compartida para filtrar columnas.
  const [activeView, setActiveView] = useState<LibraryView>('all')
  // Libro seleccionado para resaltar la tarjeta.
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null)
  // Libro abierto en el modal de resumen.
  const [openedBookId, setOpenedBookId] = useState<string | null>(null)

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

  // Cambia un libro de "wishlist" a "reading".
  const markBookAsReading = useCallback(
    (bookId: string) => {
      setBooks((prevBooks) =>
        prevBooks.map((book) => {
          if (book.id !== bookId) {
            return book
          }
          if (book.status !== 'wishlist') {
            return book
          }

          return {
            ...book,
            status: 'reading',
            // Al empezar lectura, iniciamos en 0%.
            progress: 0,
          }
        }),
      )
    },
    [setBooks],
  )

  // Cambia un libro de "reading" a "read".
  const markBookAsRead = useCallback(
    (bookId: string) => {
      setBooks((prevBooks) =>
        prevBooks.map((book) => {
          if (book.id !== bookId) {
            return book
          }
          if (book.status !== 'reading') {
            return book
          }

          return {
            ...book,
            status: 'read',
            // Al pasar a leido quitamos progreso.
            progress: undefined,
          }
        }),
      )
    },
    [setBooks],
  )

  // Actualiza el progreso (%) de un libro en estado "reading".
  const updateBookProgress = useCallback(
    (bookId: string, progress: number) => {
      // Aseguramos rango valido para evitar valores raros.
      const safeProgress = Math.min(100, Math.max(0, Math.round(progress)))

      setBooks((prevBooks) =>
        prevBooks.map((book) => {
          if (book.id !== bookId) {
            return book
          }
          if (book.status !== 'reading') {
            return book
          }
          return { ...book, progress: safeProgress }
        }),
      )
    },
    [setBooks],
  )

  // Actualiza la puntuacion de un libro leido.
  const updateBookStars = useCallback(
    (bookId: string, stars: 1 | 2 | 3 | 4 | 5) => {
      setBooks((prevBooks) =>
        prevBooks.map((book) => {
          if (book.id !== bookId) {
            return book
          }
          if (book.status !== 'read') {
            return book
          }
          return { ...book, stars }
        }),
      )
    },
    [setBooks],
  )

  // Crea un nuevo libro en la biblioteca global.
  const addBook = useCallback(
    (input: {
      title: string
      author: string
      genre?: string
      coverUrl?: string
      status: LibraryCard['status']
      stars?: number
    }) => {
      // Icono simple segun el estado para mantener estilo visual.
      const iconByStatus: Record<LibraryCard['status'], string> = {
        wishlist: '📖',
        reading: '📗',
        read: '📘',
      }

      const newBook: LibraryCard = {
        id: `book-${Date.now()}`,
        title: input.title,
        author: input.author,
        genre: input.genre,
        coverUrl: input.coverUrl,
        status: input.status,
        icon: iconByStatus[input.status],
        // Solo guardamos estrellas si viene valor y el estado es "read".
        stars: input.status === 'read' ? input.stars : undefined,
      }

      setBooks((prevBooks) => [newBook, ...prevBooks])
    },
    [setBooks],
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
      handleViewChange,
      handleSelectBook,
      handleCloseModal,
      markBookAsReading,
      markBookAsRead,
      updateBookProgress,
      updateBookStars,
      addBook,
      addToTop10,
      removeFromTop10,
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
      handleViewChange,
      handleSelectBook,
      handleCloseModal,
      markBookAsReading,
      markBookAsRead,
      updateBookProgress,
      updateBookStars,
      addBook,
      addToTop10,
      removeFromTop10,
    ],
  )

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
}

export function useLibraryContext() {
  const context = useContext(LibraryContext)
  if (!context) {
    throw new Error('useLibraryContext debe usarse dentro de LibraryProvider')
  }
  return context
}
