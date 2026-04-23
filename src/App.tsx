interface LibraryCard {
  id: string
  title: string
  author: string
  icon: string
  status: 'wishlist' | 'reading' | 'read'
  progress?: number
  stars?: number
}

const WISHLIST_BOOKS: LibraryCard[] = [
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
]

const READING_BOOKS: LibraryCard[] = [
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
]

const READ_BOOKS: LibraryCard[] = [
  {
    id: 'read-1',
    title: 'Atomic Habits',
    author: 'James Clear',
    icon: '📘',
    status: 'read',
    stars: 5,
  },
]

function statusLabel(status: LibraryCard['status']) {
  if (status === 'wishlist') return 'Wishlist'
  if (status === 'reading') return 'Leyendo'
  return 'Leido'
}

function coverClasses(status: LibraryCard['status']) {
  if (status === 'wishlist') return 'bg-[#1a1000]'
  if (status === 'reading') return 'bg-[#0a1200]'
  return 'bg-[#0d0d0d]'
}

function tagClasses(status: LibraryCard['status']) {
  if (status === 'wishlist') return 'bg-[#1a1000] text-[#f59e0b]'
  if (status === 'reading') return 'bg-[#0a1800] text-[#4ade80]'
  return 'bg-[#161616] text-[#555]'
}

function badgeClasses(kind: 'wishlist' | 'reading' | 'read') {
  if (kind === 'wishlist') return 'border-[#7a5010] text-[#f59e0b]'
  if (kind === 'reading') return 'border-[#1a3a1a] text-[#4ade80]'
  return 'border-[#222] text-[#555]'
}

function BookCard({ book }: { readonly book: LibraryCard }) {
  return (
    <article className="mb-2.5 cursor-pointer rounded-xl border border-[#1e1e1e] bg-[#111] p-3.5 transition-colors hover:border-[#333]">
      <div
        className={`mb-2.5 flex h-20 items-center justify-center rounded-md ${coverClasses(book.status)}`}
      >
        <span className="text-3xl opacity-40">{book.icon}</span>
      </div>
      <h3 className="mb-1 truncate text-[13px] font-medium text-[#ddd]">
        {book.title}
      </h3>
      <p className="mb-2 text-[11px] text-[#444]">{book.author}</p>
      <div className="flex items-center justify-between">
        <span className={`rounded-full px-2 py-0.5 text-[10px] ${tagClasses(book.status)}`}>
          {statusLabel(book.status)}
        </span>
        {book.stars ? (
          <span className="text-[10px] tracking-[-1px] text-[#f59e0b]">
            {'★'.repeat(book.stars)}
          </span>
        ) : null}
      </div>
      {book.progress ? (
        <div className="mt-2 h-0.5 overflow-hidden rounded-full bg-[#1e1e1e]">
          <div
            className="h-full rounded-full bg-[#4ade80]"
            style={{ width: `${book.progress}%` }}
          />                      
        </div>
      ) : null}
    </article>
  )
}

function App() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] px-4 py-8 font-sans text-white md:px-8">
      <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-2xl border border-[#141414] bg-[#0a0a0a]">
        <nav className="flex items-center justify-between border-b border-[#1e1e1e] px-8 py-5">
          <p className="text-5xl font-medium tracking-[-0.5px] text-[#f59e0b]">
            read<span className="font-normal text-white">ink</span>
          </p>
          <ul className="hidden list-none items-center gap-6 md:flex">
            <li className="cursor-pointer text-[13px] text-[#f59e0b]">Biblioteca</li>
            <li className="cursor-pointer text-[13px] text-[#666] transition-colors hover:text-white">
              Explorar
            </li>
            <li className="cursor-pointer text-[13px] text-[#666] transition-colors hover:text-white">
              Estadisticas
            </li>
          </ul>
          <button className="rounded-md bg-[#f59e0b] px-4 py-1.5 text-xs font-medium text-[#0a0a0a]">
            + Anadir libro
          </button>
        </nav>

        <section className="px-8 pb-8 pt-12">
          <p className="mb-3 text-[11px] uppercase tracking-[2px] text-[#f59e0b]">
            Tu biblioteca
          </p>
          <h1 className="mb-2 text-4xl font-medium leading-tight text-white">
            Bienvenida, Sandra.
          </h1>
          <p className="text-sm text-[#555]">7 libros registrados · 2 en progreso</p>
        </section>

        <section className="grid grid-cols-2 gap-3 px-8 pb-8 md:grid-cols-4">
          <div className="rounded-lg border border-[#1e1e1e] bg-[#111] px-5 py-3.5">
            <p className="mb-1 text-[22px] font-medium text-[#f59e0b]">3</p>
            <p className="text-[11px] tracking-[0.5px] text-[#444]">Quiero leer</p>
          </div>
          <div className="rounded-lg border border-[#1e1e1e] bg-[#111] px-5 py-3.5">
            <p className="mb-1 text-[22px] font-medium text-[#4ade80]">2</p>
            <p className="text-[11px] tracking-[0.5px] text-[#444]">Leyendo</p>
          </div>
          <div className="rounded-lg border border-[#1e1e1e] bg-[#111] px-5 py-3.5">
            <p className="mb-1 text-[22px] font-medium text-white">2</p>
            <p className="text-[11px] tracking-[0.5px] text-[#444]">Leidos</p>
          </div>
          <div className="rounded-lg border border-[#1e1e1e] bg-[#111] px-5 py-3.5">
            <p className="mb-1 text-[22px] font-medium text-white">847</p>
            <p className="text-[11px] tracking-[0.5px] text-[#444]">Paginas leidas</p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 px-8 pb-8 md:grid-cols-3">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[11px] uppercase tracking-[1.5px] text-[#444]">Quiero leer</h2>
              <span className={`rounded-full border px-2 py-0.5 text-[10px] ${badgeClasses('wishlist')}`}>
                3
              </span>
            </div>
            {WISHLIST_BOOKS.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[11px] uppercase tracking-[1.5px] text-[#444]">Leyendo</h2>
              <span className={`rounded-full border px-2 py-0.5 text-[10px] ${badgeClasses('reading')}`}>
                2
              </span>
            </div>
            {READING_BOOKS.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[11px] uppercase tracking-[1.5px] text-[#444]">Leidos</h2>
              <span className={`rounded-full border px-2 py-0.5 text-[10px] ${badgeClasses('read')}`}>
                2
              </span>
            </div>
            {READ_BOOKS.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
            <div className="rounded-xl border border-dashed border-[#1e1e1e] px-4 py-6 text-center">
              <p className="text-[11px] leading-relaxed text-[#333]">Anade mas libros a tu lista</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default App
