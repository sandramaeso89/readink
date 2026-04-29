import { useEffect, useMemo, useState } from 'react'
import { useLibraryContext } from '../context/LibraryContext'

interface SuggestedBook {
  title: string
  author: string
  genre: string
}

interface OpenLibraryWork {
  key: string
  title: string
  authors?: Array<{ name: string }>
  subject?: string[]
}

const SUGGESTED_CATALOG: SuggestedBook[] = [
  { title: 'El problema de los tres cuerpos', author: 'Liu Cixin', genre: 'Ciencia' },
  { title: 'La sombra del viento', author: 'Carlos Ruiz Zafon', genre: 'Novela' },
  { title: 'Elantris', author: 'Brandon Sanderson', genre: 'Fantasia' },
  { title: 'Deep Work', author: 'Cal Newport', genre: 'Productividad' },
  { title: 'Breves respuestas a las grandes preguntas', author: 'Stephen Hawking', genre: 'Ciencia' },
  { title: 'El infinito en un junco', author: 'Irene Vallejo', genre: 'Historia' },
  { title: 'Dune', author: 'Frank Herbert', genre: 'Fantasia' },
  { title: 'Habitos atomicos', author: 'James Clear', genre: 'Productividad' },
  { title: 'Sapiens (edicion ilustrada)', author: 'Yuval Noah Harari', genre: 'Historia' },
  { title: 'El camino de los reyes', author: 'Brandon Sanderson', genre: 'Fantasia' },
]

// Pagina "Explorar" (ruta "/explorar"): sugerencias locales segun biblioteca.
export function ExplorePage() {
  const { books, readBooks, addBook } = useLibraryContext()
  // Estado de tendencias que llegan desde Open Library.
  const [trendingBooks, setTrendingBooks] = useState<SuggestedBook[]>([])
  const [isLoadingTrends, setIsLoadingTrends] = useState(false)
  const [trendsError, setTrendsError] = useState('')

  // Generos y autores mas frecuentes de la biblioteca.
  const profile = useMemo(() => {
    const genreCount = new Map<string, number>()
    const authorCount = new Map<string, number>()

    books.forEach((book) => {
      if (book.genre) {
        genreCount.set(book.genre, (genreCount.get(book.genre) ?? 0) + 1)
      }
      authorCount.set(book.author, (authorCount.get(book.author) ?? 0) + 1)
    })

    const topGenres = [...genreCount.entries()].sort((a, b) => b[1] - a[1]).map(([genre]) => genre)
    const topAuthors = [...authorCount.entries()].sort((a, b) => b[1] - a[1]).map(([author]) => author)

    return { topGenres, topAuthors }
  }, [books])

  // Libros ya guardados para no recomendarlos de nuevo.
  const ownedTitles = useMemo(() => {
    return new Set(books.map((book) => book.title.toLowerCase()))
  }, [books])

  // Recomendaciones principales, priorizando coincidencias de genero/autor.
  const recommended = useMemo(() => {
    return SUGGESTED_CATALOG.map((candidate) => {
      let score = 0
      if (profile.topGenres.slice(0, 2).includes(candidate.genre)) score += 2
      if (profile.topAuthors.slice(0, 2).includes(candidate.author)) score += 1
      if (ownedTitles.has(candidate.title.toLowerCase())) score -= 100
      return { ...candidate, score }
    })
      .filter((book) => book.score > -100)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
  }, [ownedTitles, profile.topAuthors, profile.topGenres])

  // Sugerencias secundarias para ampliar lecturas.
  const suggestions = useMemo(() => {
    return SUGGESTED_CATALOG.filter((candidate) => !ownedTitles.has(candidate.title.toLowerCase()))
      .filter((candidate) => !recommended.some((book) => book.title === candidate.title))
      .slice(0, 4)
  }, [ownedTitles, recommended])

  const hasReadingHistory = readBooks.length > 0 || books.length > 0

  // Carga tendencias públicas de Open Library (tema general: fiction).
  useEffect(() => {
    const controller = new AbortController()

    async function loadTrends() {
      try {
        setIsLoadingTrends(true)
        setTrendsError('')

        const response = await fetch('https://openlibrary.org/subjects/fiction.json?limit=6', {
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error('No se pudieron cargar tendencias')
        }

        const data = (await response.json()) as { works?: OpenLibraryWork[] }
        const mappedBooks =
          data.works?.map((work) => ({
            title: work.title,
            author: work.authors?.[0]?.name ?? 'Autor desconocido',
            genre: work.subject?.[0] ?? 'Fiction',
          })) ?? []

        setTrendingBooks(mappedBooks)
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return
        }
        setTrendsError('No se pudieron cargar tendencias de Open Library.')
      } finally {
        setIsLoadingTrends(false)
      }
    }

    loadTrends()
    return () => controller.abort()
  }, [])

  // Añade una sugerencia/recomendacion a la biblioteca local.
  const addSuggestedToLibrary = (book: SuggestedBook) => {
    addBook({
      title: book.title,
      author: book.author,
      genre: book.genre,
      status: 'wishlist',
    })
  }

  return (
    <section className="px-8 pb-16 pt-12">
      <p className="mb-3 text-[11px] uppercase tracking-[2px] text-[var(--ri-accent)]">
        Explorar
      </p>
      <h1 className="mb-2 text-4xl font-medium leading-tight text-[var(--ri-text-primary)]">
        Descubre nuevos libros.
      </h1>
      <p className="mb-6 text-sm text-[var(--ri-text-muted)]">
        Recomendaciones basadas en tu biblioteca actual. Mas adelante se conectaran con Open Library.
      </p>

      {hasReadingHistory ? null : (
        <div className="rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] p-4">
          <p className="text-sm text-[var(--ri-text-muted)]">
            Anade algunos libros a tu biblioteca para personalizar mejor las recomendaciones.
          </p>
        </div>
      )}

      <div className="mb-6 rounded-md border border-[#3a2a12] bg-[var(--ri-surface-alt)] p-5 shadow-lg shadow-black/30">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm uppercase tracking-[1.5px] text-[var(--ri-accent)]">
            Tendencias de Open Library
          </h2>
          <span className="rounded-full border border-[#3a2a12] bg-[#1a1000] px-2 py-0.5 text-[10px] text-[var(--ri-accent)]">
            En vivo
          </span>
        </div>

        {isLoadingTrends ? <p className="text-sm text-[var(--ri-text-muted)]">Cargando tendencias...</p> : null}

        {trendsError ? <p className="text-sm text-[#ff7676]">{trendsError}</p> : null}

        {!isLoadingTrends && !trendsError ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {trendingBooks.map((book) => (
              <article key={book.title} className="rounded-md border border-[var(--ri-border)] bg-[#111] p-4">
                <p className="text-sm font-medium text-[var(--ri-text-secondary)]">{book.title}</p>
                <p className="text-xs text-[var(--ri-text-muted)]">{book.author}</p>
                <p className="mt-2 text-xs text-[var(--ri-accent)]">{book.genre}</p>
                <button
                  type="button"
                  onClick={() => addSuggestedToLibrary(book)}
                  disabled={ownedTitles.has(book.title.toLowerCase())}
                  className="mt-3 rounded-md border border-[#3a2a12] bg-[#1a1000] px-3 py-1.5 text-xs font-medium text-[var(--ri-accent)] transition-colors hover:bg-[#221500] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {ownedTitles.has(book.title.toLowerCase()) ? 'Ya en tu biblioteca' : 'Anadir a biblioteca'}
                </button>
              </article>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mb-6 rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] p-5">
        <h2 className="mb-3 text-sm uppercase tracking-[1.5px] text-[var(--ri-text-muted)]">
          Recomendadas para ti
        </h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {recommended.map((book) => (
            <article key={book.title} className="rounded-md border border-[var(--ri-border)] bg-[#111] p-4">
              <p className="text-sm font-medium text-[var(--ri-text-secondary)]">{book.title}</p>
              <p className="text-xs text-[var(--ri-text-muted)]">{book.author}</p>
              <p className="mt-2 text-xs text-[var(--ri-accent)]">{book.genre}</p>
              <button
                type="button"
                onClick={() => addSuggestedToLibrary(book)}
                disabled={ownedTitles.has(book.title.toLowerCase())}
                className="mt-3 rounded-md border border-[#3a2a12] bg-[#1a1000] px-3 py-1.5 text-xs font-medium text-[var(--ri-accent)] transition-colors hover:bg-[#221500] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {ownedTitles.has(book.title.toLowerCase()) ? 'Ya en tu biblioteca' : 'Anadir a biblioteca'}
              </button>
            </article>
          ))}
        </div>
      </div>

      <div className="rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] p-5">
        <h2 className="mb-3 text-sm uppercase tracking-[1.5px] text-[var(--ri-text-muted)]">
          Sugerencias para ampliar tu biblioteca
        </h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {suggestions.map((book) => (
            <article key={book.title} className="rounded-md border border-[var(--ri-border)] bg-[#111] p-4">
              <p className="text-sm font-medium text-[var(--ri-text-secondary)]">{book.title}</p>
              <p className="text-xs text-[var(--ri-text-muted)]">{book.author}</p>
              <p className="mt-2 text-xs text-[var(--ri-text-muted)]">{book.genre}</p>
              <button
                type="button"
                onClick={() => addSuggestedToLibrary(book)}
                disabled={ownedTitles.has(book.title.toLowerCase())}
                className="mt-3 rounded-md border border-[#3a2a12] bg-[#1a1000] px-3 py-1.5 text-xs font-medium text-[var(--ri-accent)] transition-colors hover:bg-[#221500] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {ownedTitles.has(book.title.toLowerCase()) ? 'Ya en tu biblioteca' : 'Anadir a biblioteca'}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
