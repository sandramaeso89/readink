import { useMemo } from 'react'
import { useLibraryContext } from '../context/LibraryContext'

// Pagina "Estadisticas" (ruta "/estadisticas"): resumen visual de lectura.
export function StatsPage() {
  const { books, counts, readBooks, top10Books } = useLibraryContext()

  // Porcentaje de libros leidos sobre el total.
  const readPercent = counts.total === 0 ? 0 : Math.round((counts.read / counts.total) * 100)
  const readingPercent = counts.total === 0 ? 0 : Math.round((counts.reading / counts.total) * 100)

  // Media de valoracion solo en libros leidos que ya tienen estrellas.
  const ratingAverage = useMemo(() => {
    const ratedBooks = readBooks.filter((book) => typeof book.stars === 'number')
    if (ratedBooks.length === 0) {
      return null
    }
    const sum = ratedBooks.reduce((acc, book) => acc + (book.stars ?? 0), 0)
    return (sum / ratedBooks.length).toFixed(1)
  }, [readBooks])

  // Top autores por numero de libros.
  const topAuthors = useMemo(() => {
    const counter = new Map<string, number>()
    books.forEach((book) => {
      counter.set(book.author, (counter.get(book.author) ?? 0) + 1)
    })
    return [...counter.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
  }, [books])

  // Distribucion por genero para ver preferencias.
  const genreStats = useMemo(() => {
    const counter = new Map<string, number>()
    books.forEach((book) => {
      const key = book.genre ?? 'Sin genero'
      counter.set(key, (counter.get(key) ?? 0) + 1)
    })
    return [...counter.entries()].sort((a, b) => b[1] - a[1])
  }, [books])

  return (
    <section className="px-8 pb-16 pt-12">
      <p className="mb-3 text-[11px] uppercase tracking-[2px] text-[var(--ri-accent)]">
        Estadisticas
      </p>
      <h1 className="mb-2 text-4xl font-medium leading-tight text-[var(--ri-text-primary)]">
        Tu progreso de lectura.
      </h1>
      <p className="mb-6 text-sm text-[var(--ri-text-muted)]">Resumen general de tu biblioteca personal.</p>

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] p-4">
          <p className="text-xs text-[var(--ri-text-muted)]">Total</p>
          <p className="mt-1 text-2xl text-[var(--ri-text-primary)]">{counts.total}</p>
        </div>
        <div className="rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] p-4">
          <p className="text-xs text-[var(--ri-text-muted)]">Leidos</p>
          <p className="mt-1 text-2xl text-[var(--ri-accent)]">{counts.read}</p>
        </div>
        <div className="rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] p-4">
          <p className="text-xs text-[var(--ri-text-muted)]">Leyendo</p>
          <p className="mt-1 text-2xl text-[var(--ri-reading)]">{counts.reading}</p>
        </div>
        <div className="rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] p-4">
          <p className="text-xs text-[var(--ri-text-muted)]">Quiero leer</p>
          <p className="mt-1 text-2xl text-[var(--ri-text-primary)]">{counts.wishlist}</p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] p-4">
          <p className="text-xs uppercase tracking-[1.5px] text-[var(--ri-text-muted)]">Progreso de lectura</p>
          <p className="mt-2 text-sm text-[var(--ri-text-secondary)]">
            Leidos: <span className="text-[var(--ri-accent)]">{readPercent}%</span>
          </p>
          <p className="text-sm text-[var(--ri-text-secondary)]">
            En progreso: <span className="text-[var(--ri-reading)]">{readingPercent}%</span>
          </p>
        </div>
        <div className="rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] p-4">
          <p className="text-xs uppercase tracking-[1.5px] text-[var(--ri-text-muted)]">Valoracion media</p>
          <p className="mt-2 text-sm text-[var(--ri-text-secondary)]">
            {ratingAverage ? `${ratingAverage}/5` : 'Aun no hay valoraciones'}
          </p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] p-4">
          <p className="mb-2 text-xs uppercase tracking-[1.5px] text-[var(--ri-text-muted)]">Top autores</p>
          {topAuthors.length === 0 ? (
            <p className="text-sm text-[var(--ri-text-muted)]">Sin datos de autores.</p>
          ) : (
            <ul className="space-y-1 text-sm text-[var(--ri-text-secondary)]">
              {topAuthors.map(([author, amount]) => (
                <li key={author}>
                  {author} · {amount} libro(s)
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] p-4">
          <p className="mb-2 text-xs uppercase tracking-[1.5px] text-[var(--ri-text-muted)]">
            Generos mas leidos
          </p>
          {genreStats.length === 0 ? (
            <p className="text-sm text-[var(--ri-text-muted)]">Sin datos de genero.</p>
          ) : (
            <ul className="space-y-1 text-sm text-[var(--ri-text-secondary)]">
              {genreStats.map(([genre, amount]) => (
                <li key={genre}>
                  {genre} · {amount}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] p-4">
        <p className="mb-2 text-xs uppercase tracking-[1.5px] text-[var(--ri-text-muted)]">Top 10 actual</p>
        <p className="mb-2 text-sm text-[var(--ri-text-secondary)]">
          Libros en Top 10: <span className="text-[var(--ri-accent)]">{top10Books.length}/10</span>
        </p>
        {top10Books.length === 0 ? (
          <p className="text-sm text-[var(--ri-text-muted)]">Todavia no has anadido libros a tu Top 10.</p>
        ) : (
          <ul className="space-y-1 text-sm text-[var(--ri-text-secondary)]">
            {top10Books.slice(0, 3).map((book, index) => (
              <li key={book.id}>
                #{index + 1} {book.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
