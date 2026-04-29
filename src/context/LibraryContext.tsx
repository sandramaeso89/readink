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
    icon: '📖',
    status: 'wishlist',
  },
  {
    id: 'wishlist-2',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    icon: '📖',
    status: 'wishlist',
  },
  {
    id: 'wishlist-3',
    title: 'La vegetariana',
    author: 'Han Kang',
    icon: '📖',
    status: 'wishlist',
  },
  {
    id: 'reading-1',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    icon: '📗',
    status: 'reading',
    progress: 62,
  },
  {
    id: 'reading-2',
    title: 'El nombre del viento',
    author: 'Patrick Rothfuss',
    icon: '📗',
    status: 'reading',
    progress: 28,
  },
  {
    id: 'read-1',
    title: 'Atomic Habits',
    author: 'James Clear',
    icon: '📘',
    status: 'read',
    stars: 5,
  },
]

interface LibraryContextValue {
  books: LibraryCard[]
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
  handleViewChange: (view: LibraryView) => void
  handleSelectBook: (bookId: string) => void
  handleCloseModal: () => void
}

const LibraryContext = createContext<LibraryContextValue | null>(null)

interface LibraryProviderProps {
  children: ReactNode
}

export function LibraryProvider({ children }: Readonly<LibraryProviderProps>) {
  // Estado global de libros compartido por toda la app.
  const [books] = useLocalStorage<LibraryCard[]>('readink.library.v1', INITIAL_BOOKS)
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

  // Resolvemos el libro abierto actual para el modal.
  const openedBook = useMemo(
    () => books.find((book) => book.id === openedBookId) ?? null,
    [books, openedBookId],
  )

  const value = useMemo(
    () => ({
      books,
      activeView,
      selectedBookId,
      openedBook,
      counts,
      wishlistBooks,
      readingBooks,
      readBooks,
      handleViewChange,
      handleSelectBook,
      handleCloseModal,
    }),
    [
      books,
      activeView,
      selectedBookId,
      openedBook,
      counts,
      wishlistBooks,
      readingBooks,
      readBooks,
      handleViewChange,
      handleSelectBook,
      handleCloseModal,
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
