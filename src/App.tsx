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
  // Guardamos el texto que escribe la usuaria en el buscador
  const [query, setQuery] = useState('')
  // Guardamos qué libro está abierto en el modal (detalle)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)

  // Filtramos por título o autor para demostrar consumo de datos tipados
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
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 md:px-6">
        <header className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-wider text-violet-600">
            Readink
          </p>
          <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
            Tu tracker personal de lectura
          </h1>
          <p className="max-w-2xl text-sm text-slate-600 md:text-base">
            Componentes reutilizables en React + TypeScript con estilo moderno
            usando Tailwind CSS.
          </p>
        </header>

        <SearchForm
          value={query}
          onChange={setQuery}
          onSubmit={(event) => {
            // Evitamos que el formulario recargue la página
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
