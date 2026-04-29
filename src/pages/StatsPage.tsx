import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLibraryContext } from '../context/LibraryContext'

interface ReaderLevel {
  label: string
  minReadBooks: number
  nextLevelMinReadBooks: number | null
}

// Traduce cantidad de leídos a un nivel simple de lector.
function getReaderLevel(readBooksCount: number): ReaderLevel {
  if (readBooksCount <= 2) {
    return {
      label: 'Lector principiante',
      minReadBooks: 0,
      nextLevelMinReadBooks: 3,
    }
  }
  if (readBooksCount <= 7) {
    return {
      label: 'Lector constante',
      minReadBooks: 3,
      nextLevelMinReadBooks: 8,
    }
  }
  if (readBooksCount <= 14) {
    return {
      label: 'Lector avanzado',
      minReadBooks: 8,
      nextLevelMinReadBooks: 15,
    }
  }
  return {
    label: 'Lector élite',
    minReadBooks: 15,
    nextLevelMinReadBooks: null,
  }
}

// Página "Estadísticas" (ruta "/estadisticas"): resumen visual de lectura.
export function StatsPage() {
  const { books, counts, readBooks, top10Books, yearlyGoal, setYearlyGoal } = useLibraryContext()
  const [goalDraft, setGoalDraft] = useState(yearlyGoal)

  // Porcentaje de libros leídos sobre el total.
  const readPercent = counts.total === 0 ? 0 : Math.round((counts.read / counts.total) * 100)
  const readingPercent = counts.total === 0 ? 0 : Math.round((counts.reading / counts.total) * 100)

  // Media de valoración solo en libros leídos que ya tienen estrellas.
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

  // Distribución por género para ver preferencias.
  const genreStats = useMemo(() => {
    const counter = new Map<string, number>()
    books.forEach((book) => {
      const key = book.genre ?? 'Sin genero'
      counter.set(key, (counter.get(key) ?? 0) + 1)
    })
    return [...counter.entries()].sort((a, b) => b[1] - a[1])
  }, [books])

  // Calcula cuantos libros has terminado este año.
  const readThisYear = useMemo(() => {
    const currentYear = new Date().getFullYear()
    return readBooks.filter((book) => {
      if (!book.finishedAt) {
        return false
      }
      return new Date(book.finishedAt).getFullYear() === currentYear
    }).length
  }, [readBooks])

  // Porcentaje de avance sobre la meta anual.
  const yearlyGoalPercent = Math.min(100, Math.round((readThisYear / yearlyGoal) * 100))
  // Nivel del lector basado en total de libros leídos.
  const readerLevel = useMemo(() => getReaderLevel(counts.read), [counts.read])
  const booksUntilNextLevel =
    readerLevel.nextLevelMinReadBooks === null ? 0 : Math.max(0, readerLevel.nextLevelMinReadBooks - counts.read)

  return (
    <section className="px-8 pb-16 pt-12">
      <p className="mb-3 text-[11px] uppercase tracking-[2px] text-[var(--ri-accent)]">Estadísticas</p>
      <h1 className="mb-2 text-4xl font-medium leading-tight text-[var(--ri-text-primary)]">
        Tu progreso de lectura.
      </h1>
      <p className="mb-6 text-sm text-[var(--ri-text-muted)]">Resumen general de tu biblioteca personal.</p>

      <div className="mb-5 grid grid-cols-2 gap-2 md:grid-cols-4">
        <div className="rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] px-3.5 py-2">
          <p className="text-[10px] tracking-[0.3px] text-[var(--ri-text-muted)]">Quiero leer</p>
          <p className="mt-1 text-[15px] font-medium leading-none text-[var(--ri-accent)]">{counts.wishlist}</p>
        </div>
        <div className="rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] px-3.5 py-2">
          <p className="text-[10px] tracking-[0.3px] text-[var(--ri-text-muted)]">Leyendo</p>
          <p className="mt-1 text-[15px] font-medium leading-none text-[var(--ri-reading)]">{counts.reading}</p>
        </div>
        <div className="rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] px-3.5 py-2">
          <div className="flex items-center justify-between gap-2">
            <Link
              to="/leidos"
              className="group inline-flex items-center gap-1 text-[10px] uppercase tracking-[1.2px] text-[var(--ri-text-muted)] underline-offset-2 transition-colors hover:text-[var(--ri-accent)] hover:underline"
            >
              <span>Leídos</span>
              <span className="text-[10px] transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
          <p className="mt-1 text-[15px] font-medium leading-none text-[var(--ri-accent)]">{counts.read}</p>
        </div>
        <div className="rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] px-3.5 py-2">
          <p className="text-[10px] tracking-[0.3px] text-[var(--ri-text-muted)]">Total en biblioteca</p>
          <p className="mt-1 text-[15px] font-medium leading-none text-[var(--ri-text-primary)]">{counts.total}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-[var(--ri-border)] bg-[var(--ri-surface)] p-4">
              <p className="text-xs uppercase tracking-[1.5px] text-[var(--ri-text-muted)]">Objetivo anual</p>
              <p className="mt-2 text-sm text-[var(--ri-text-secondary)]">
                {readThisYear}/{yearlyGoal} libros en {new Date().getFullYear()}
              </p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--ri-border)]">
                <div
                  className="h-full rounded-full bg-[var(--ri-accent)]"
                  style={{ width: `${yearlyGoalPercent}%` }}
                />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={goalDraft}
                  onChange={(event) => setGoalDraft(Number(event.target.value))}
                  className="h-9 w-24 rounded-md border border-[var(--ri-border)] bg-[#0f0f0f] px-3 text-xs text-[var(--ri-text-secondary)] outline-none focus:border-[var(--ri-accent)]"
                />
                <button
                  type="button"
                  onClick={() => setYearlyGoal(goalDraft)}
                  className="rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] px-3 py-2 text-xs text-[var(--ri-text-secondary)]"
                >
                  Guardar meta
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-[var(--ri-border)] bg-[var(--ri-surface)] p-4">
              <p className="text-xs uppercase tracking-[1.5px] text-[var(--ri-text-muted)]">Progreso de lectura</p>
              <p className="mt-2 text-sm text-[var(--ri-text-secondary)]">
                Leídos: <span className="text-[var(--ri-accent)]">{readPercent}%</span>
              </p>
              <p className="text-sm text-[var(--ri-text-secondary)]">
                En progreso: <span className="text-[var(--ri-reading)]">{readingPercent}%</span>
              </p>
              <p className="mt-4 text-xs text-[var(--ri-text-muted)]">
                Valoración media: <span className="text-[var(--ri-text-secondary)]">{ratingAverage ? `${ratingAverage}/5` : 'Aún sin valoraciones'}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-[var(--ri-border)] bg-[var(--ri-surface)] p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#7a5010] bg-[#1a1000] text-[var(--ri-accent)]">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                    <path d="M17 2H7v4a5 5 0 0 0 3.2 4.66L9 14h6l-1.2-3.34A5 5 0 0 0 17 6V2Zm-8 2h6v2a3 3 0 1 1-6 0V4Zm1.5 12 1.5 2 1.5-2h-3Zm-2 4h7v2h-7v-2Z" />
                  </svg>
                </span>
                <p className="text-xs uppercase tracking-[1.5px] text-[var(--ri-text-muted)]">Distinción de lector</p>
              </div>
              <p className="text-base font-medium text-[var(--ri-accent)]">{readerLevel.label}</p>
              <p className="mt-2 text-sm text-[var(--ri-text-secondary)]">
                Has leído <span className="text-[var(--ri-text-primary)]">{counts.read}</span> libro(s).
              </p>
              {readerLevel.nextLevelMinReadBooks === null ? (
                <p className="mt-1 text-xs text-[var(--ri-text-muted)]">
                  Siguiente nivel: <span className="text-[var(--ri-text-secondary)]">Nivel máximo alcanzado</span>
                </p>
              ) : (
                <div className="mt-1 space-y-1 text-xs text-[var(--ri-text-muted)]">
                  <p>
                    Siguiente nivel:{' '}
                    <span className="text-[var(--ri-text-secondary)]">
                      {getReaderLevel(readerLevel.nextLevelMinReadBooks).label}
                    </span>
                  </p>
                  <p>
                    Te faltan <span className="text-[var(--ri-accent)]">{booksUntilNextLevel}</span> libro(s).
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-lg border border-[var(--ri-border)] bg-[var(--ri-surface)] p-4">
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
          </div>
        </div>

        <div className="md:sticky md:top-6 md:self-start">
          <div className="space-y-3">
            <div className="rounded-lg border border-[var(--ri-border)] bg-[var(--ri-surface)] p-4">
              <p className="mb-2 text-xs uppercase tracking-[1.5px] text-[var(--ri-text-muted)]">Top 10 actual</p>
              <p className="mb-2 text-sm text-[var(--ri-text-secondary)]">
                Libros en Top 10: <span className="text-[var(--ri-accent)]">{top10Books.length}/10</span>
              </p>
              {top10Books.length === 0 ? (
                <p className="text-sm text-[var(--ri-text-muted)]">Todavía no has añadido libros a tu Top 10.</p>
              ) : (
                <ul className="space-y-1 text-sm text-[var(--ri-text-secondary)]">
                  {top10Books.slice(0, 5).map((book, index) => (
                    <li key={book.id}>
                      #{index + 1} {book.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-lg border border-[var(--ri-border)] bg-[var(--ri-surface)] p-4">
              <p className="mb-2 text-xs uppercase tracking-[1.5px] text-[var(--ri-text-muted)]">
                Géneros más leídos
              </p>
              {genreStats.length === 0 ? (
                <p className="text-sm text-[var(--ri-text-muted)]">Sin datos de género.</p>
              ) : (
                <ul className="space-y-1 text-sm text-[var(--ri-text-secondary)]">
                  {genreStats.map(([genre, amount]) => (
                    <li key={genre}>
                      {genre} · {amount} libro(s)
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link
          to="/"
          className="rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] px-4 py-2 text-xs text-[var(--ri-text-secondary)] transition-colors hover:border-[#6b4f28]"
        >
          Volver a biblioteca
        </Link>
      </div>
    </section>
  )
}
