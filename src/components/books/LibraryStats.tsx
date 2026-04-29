import { useLibraryContext } from '../../context/LibraryContext'

export function LibraryStats() {
  // Leemos métricas globales desde Context para no pasar props.
  const { counts } = useLibraryContext()

  return (
    <section className="grid grid-cols-2 gap-2 px-8 pb-5 md:grid-cols-4">
      <div className="rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] px-3.5 py-2">
        <p className="text-[15px] font-medium leading-none text-[var(--ri-accent)]">{counts.wishlist}</p>
        <p className="mt-1 text-[10px] tracking-[0.3px] text-[var(--ri-text-muted)]">Quiero leer</p>
      </div>
      <div className="rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] px-3.5 py-2">
        <p className="text-[15px] font-medium leading-none text-[var(--ri-reading)]">{counts.reading}</p>
        <p className="mt-1 text-[10px] tracking-[0.3px] text-[var(--ri-text-muted)]">Leyendo</p>
      </div>
      <div className="rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] px-3.5 py-2">
        <p className="text-[15px] font-medium leading-none text-[var(--ri-text-primary)]">{counts.read}</p>
        <p className="mt-1 text-[10px] tracking-[0.3px] text-[var(--ri-text-muted)]">Leídos</p>
      </div>
      <div className="rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] px-3.5 py-2">
        <p className="text-[15px] font-medium leading-none text-[var(--ri-text-primary)]">{counts.total}</p>
        <p className="mt-1 text-[10px] tracking-[0.3px] text-[var(--ri-text-muted)]">Total en biblioteca</p>
      </div>
    </section>
  )
}
