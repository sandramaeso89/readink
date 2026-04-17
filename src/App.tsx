import { useMemo, useState } from 'react'
import { BookDetailModal } from './components/books/BookDetailModal'
import { BookList } from './components/books/BookList'
import { SearchForm } from './components/books/SearchForm'
import type { Book } from './types/book'

const MOCK_BOOKS: Book[] = [
  {
    id: '1',
    workKey: '/works/OL45883W',
    title: 'Clean Code',
    authorNames: ['Robert C. Martin'],
    firstPublishYear: 2008,
    coverUrl: 'https://covers.openlibrary.org/b/id/9611996-L.jpg',
    list: 'READING',
    note: 'Muy claro para mejorar nombres y funciones.',
    rating: null,
  },
  {
    id: '2',
    workKey: '/works/OL82563W',
    title: 'The Pragmatic Programmer',
    authorNames: ['Andrew Hunt', 'David Thomas'],
    firstPublishYear: 1999,
    coverUrl: 'https://covers.openlibrary.org/b/id/8091016-L.jpg',
    list: 'WISHLIST',
    note: null,
    rating: null,
  },
  {
    id: '3',
    workKey: '/works/OL27448W',
    title: 'Refactoring',
    authorNames: ['Martin Fowler'],
    firstPublishYear: 1999,
    coverUrl: 'https://covers.openlibrary.org/b/id/8231856-L.jpg',
    list: 'READ',
    note: 'Capítulos de tests y deuda técnica muy útiles.',
    rating: 5,
  },
]

function App() {
  // Guardamos el texto que escribe la usuaria en el buscador.
  const [query, setQuery] = useState('')
  // Guardamos qué libro está abierto en el modal de detalle.
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)

  // Filtramos por título o autor para mostrar solo coincidencias.
  const filteredBooks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return MOCK_BOOKS
    }

    return MOCK_BOOKS.filter((book) => {
      const titleMatches = book.title.toLowerCase().includes(normalizedQuery)
      const authorMatches = book.authorNames
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery)

      return titleMatches || authorMatches
    })
  }, [query])

  return (
    <main className="relative min-h-screen overflow-hidden bg-brand-900 text-brand-200">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-brand-accent/25 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 h-72 w-72 rounded-full bg-brand-700/25 blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-12 md:px-8 md:py-16">
        <header className="space-y-4 rounded-3xl border border-brand-accent/25 bg-brand-800/55 p-6 shadow-2xl backdrop-blur-sm md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-100">
            Personal Reading Hub
          </p>
          <h1 className="text-5xl font-bold uppercase tracking-[0.08em] text-brand-accent md:text-7xl">
            Readink
          </h1>
          <p className="text-xl font-medium leading-tight text-brand-200 md:text-3xl">
            Tu tracker personal de lectura
          </p>
          <p className="max-w-3xl text-sm leading-relaxed text-brand-100 md:text-base">
            Organiza tus libros y mantén tus notas de lectura en una interfaz
            moderna con estética morada.
          </p>
        </header>

        <SearchForm
          value={query}
          onChange={setQuery}
          onSubmit={(event) => {
            // Evitamos que el formulario recargue la página.
            event.preventDefault()
          }}
        />

        <BookList
          title="Libros (datos de ejemplo tipados)"
          books={filteredBooks}
          emptyMessage="No encontramos libros con ese texto."
          onOpenDetails={setSelectedBook}
        />
      </div>

      <BookDetailModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
      />
    </main>
  )
}

export default App
